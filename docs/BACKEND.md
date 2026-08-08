
# Credit Engine — Documentação Técnica

> Motor de precificação e liquidação de recebíveis multimoedas.

**Última atualização:** 2026-08-08

---

## Sumário

- [1. Visão Geral](#1-visão-geral)
- [2. Stack](#2-stack)
- [3. API](#3-api)
  - [3.1 Base Path](#31-base-path)
  - [3.2 Receivables](#32-receivables)
  - [3.3 Pricings](#33-pricings)
  - [3.4 Exchange Rates](#34-exchange-rates)
  - [3.5 Currencies](#35-currencies)
  - [3.6 Assignors](#36-assignors)
  - [3.7 Receivable Types](#37-receivable-types)
  - [3.8 Settlements](#38-settlements)
- [4. DTOs e Contratos](#4-dtos-e-contratos)
- [5. Entidades](#5-entidades)
- [6. Fluxos Principais](#6-fluxos-principais)
  - [6.1 Criar Recebível](#61-criar-recebível)
  - [6.2 Simular Precificação](#62-simular-precificação)
  - [6.3 Liquidar Recebível](#63-liquidar-recebível)
- [7. Estratégia de Precificação](#7-estratégia-de-precificação)
- [8. Regras de Negócio](#8-regras-de-negócio)
- [9. Tratamento de Erros](#9-tratamento-de-erros)
- [10. Repositórios e Mappers](#10-repositórios-e-mappers)
- [11. Extensibilidade](#11-extensibilidade)
- [12. Execução Local](#12-execução-local)
- [13. Testes](#13-testes)
- [14. Pontos de Atenção](#14-pontos-de-atenção)
- [15. Estrutura do Projeto](#15-estrutura-do-projeto)

---

# 1. Visão Geral

O **Credit Engine** é um motor de precificação e liquidação de recebíveis.

O serviço permite:

- Cadastrar recebíveis individualmente;
- Cadastrar recebíveis em lote;
- Simular precificação;
- Precificar e criar liquidações;
- Gerenciar moedas;
- Gerenciar taxas de câmbio;
- Gerenciar tipos de recebíveis.

### Objetivo

Esta documentação tem como objetivo mapear:

- endpoints;
- contratos de requisição e resposta;
- fluxos de negócio;
- entidades persistidas;
- regras de precificação;
- regras de validação;
- tratamento de erros;
- decisões de implementação;
- pontos de extensão.

---

# 2. Stack

| Tecnologia | Utilização |
|---|---|
| Java 21 | Linguagem |
| Spring Boot 4 | Framework |
| Spring Web MVC | API REST |
| Spring Data JPA | Persistência |
| PostgreSQL | Banco de dados |
| Flyway | Migrações |
| SpringDoc OpenAPI | Documentação da API |
| Lombok | Redução de boilerplate |
| Jakarta Validation | Validação |
| JUnit | Testes |
| Mockito | Mocks e testes unitários |

---

# 3. API

## 3.1 Base Path

Todos os endpoints utilizam:

```text
/api/v1
````

Quando um endpoint cria um recurso, a API também define o header `Location` apontando para o recurso criado.

---

# 3.2 Receivables

## Criar recebível

```http
POST /api/v1/receivables
```

### Request

`CreateReceivableRequest`

Campos:

```text
assignorName       string
assignorDocument   string
receivableTypeId   UUID
currencyId         UUID
faceValue          BigDecimal
dueDate            LocalDate
operationDate      LocalDate
baseRate           BigDecimal
```

### Response

```text
ReceivableResponse
```

### Fluxo

1. Busca ou cria o `Assignor` pelo documento.
    
2. Busca a `Currency`.
    
3. Busca o `ReceivableType`.
    
4. Converte o request em `Receivable` através do mapper.
    
5. Persiste através do `ReceivableRepository`.
    

### Regra

O cedente é identificado pelo documento para garantir unicidade e consistência referencial.

### Validações

- Campos obrigatórios;
    
- `faceValue >= 0.01`;
    
- Documento do cedente é único;
    
- Se o documento já existir associado a outro nome, lança `InvalidDocumentException`.
    

---

## Criar recebíveis em lote

```http
POST /api/v1/receivables/batch
```

### Request

```text
CreateReceivableBatchRequest
```


O lote suporta no máximo **500 recebíveis**.

### Campos
```text
 List<CreateReceivableRequest> receivables
```

### Response

```text
ReceivableBatchResponse
```

### Fluxo

Cada item do lote utiliza o mesmo fluxo e as mesmas validações da criação individual.

---

## Buscar recebível

```http
GET /api/v1/receivables/{id}
```

### Response

```text
ReceivableResponse
```

Se o recebível não existir:

```http
404 Not Found
```

---

## Atualizar recebível

```http
PUT /api/v1/receivables/{id}
```

### Request

```text
UpdateReceivableRequest
```

### Response

```text
ReceivableResponse
```

### Fluxo

1. Localiza o recebível.
    
2. Aplica os campos de atualização.
    
3. Caso IDs de entidades relacionadas sejam fornecidos, busca as entidades correspondentes.
    
4. Persiste o resultado.
    

---

# 3.3 Pricings

## Liquidar recebível

```http
POST /api/v1/pricings/receivables/{receivableId}/settle
```

### Request

```text
PricingRequest
```

Campos:

```text
paymentCurrencyId
settlementDate
```

### Response

```text
PricingResponse
```

Campos principais:

```text
settlementId
receivableId
faceValue
presentValue
exchangeRate
netAmount
```

### Fluxo

```text
1. Buscar Receivable
        ↓
2. Validar status PENDING
        ↓
3. Buscar Payment Currency
        ↓
4. Calcular precificação
        ↓
5. Criar Settlement
        ↓
6. Alterar Receivable para SETTLED
        ↓
7. Persistir Settlement
        ↓
8. Retornar PricingResponse
```

### Validação de status

Um recebível já liquidado não pode ser liquidado novamente.

Nesse caso:

```text
ReceivableAlreadySettledException
```

HTTP:

```http
422 Unprocessable Content
```

### Responsabilidades

O cálculo é delegado ao:

```text
PricingCalculatorService
```

enquanto a orquestração da operação permanece no:

```text
PricingService
```

---

# 3.4 Simulação de precificação

```http
POST /api/v1/pricings/receivables/simulate
```

### Request

```text
PricingSimulationRequest
```

Campos:

```text
faceValue
receivableTypeId
operationDate
dueDate
baseRate
titleCurrencyId
paymentCurrencyId
```

### Response

```text
PricingSimulationResponse
```

Campos:

```text
faceValue
spreadRate
totalRate
installments
presentValue
appliedExchangeRate
netAmount
```

`appliedExchangeRate` pode ser `null` quando a operação não exige conversão cambial.

### Fluxo

1. Busca o `ReceivableType`.
    
2. Busca as moedas envolvidas.
    
3. Calcula o número de parcelas/meses.
    
4. Resolve a `PricingStrategy`.
    
5. Calcula o valor presente.
    
6. Caso as moedas sejam diferentes, busca a taxa de câmbio.
    
7. Calcula o valor líquido.
    

### Importante

A simulação **não persiste dados**.

---

# 3.5 Exchange Rates

## Criar taxa de câmbio

```http
POST /api/v1/exchange-rates
```

### Request

```text
CreateExchangeRateRequest
```

Campos:

```text
sourceCurrencyId
targetCurrencyId
exchangeRate
referenceDate
```

### Response

```text
ExchangeRateResponse
```

### Fluxo

1. Valida as moedas.
    
2. Converte o request para entidade.
    
3. Persiste através do `ExchangeRateRepository`.
    

---

## Atualizar taxa

```http
PUT /api/v1/exchange-rates/{id}
```

### Request

```text
UpdateExchangeRateRequest
```

Os campos são opcionais.

### Response

```text
ExchangeRateResponse
```

---

## Sincronizar taxa

```http
POST /api/v1/exchange-rates/sync?sourceCurrencyId=&targetCurrencyId=
```

Atualmente utiliza um provider mockado.

Valores configurados:

```text
USD → BRL = 5.42
EUR → BRL = 5.87
Demais combinações = 1
```

A taxa obtida é persistida como um novo `ExchangeRate`.

---

# 3.6 Currencies

## Listar moedas

```http
GET /api/v1/currencies
```

Retorna:

```text
Page<CurrencyResponse>
```

A consulta utiliza paginação.

---

# 3.7 Assignors

## Buscar cedente

```http
GET /api/v1/assignor/{id}
```

---

## Listar cedentes

```http
GET /api/v1/assignor
```

A consulta é paginada.

O resultado é convertido através do mapper de `Assignor`.

---

# 3.8 Receivable Types

## Listar tipos de recebíveis

```http
GET /api/v1/receivable-types
```

Retorna dados paginados.

---

# 3.9 Settlements

## Listar liquidações

```http
GET /api/v1/settlements
```

### Filtros

```text
assignorName
currencyIso
receivableTypeCode
status
startDate
endDate
```

Além dos filtros, a API recebe parâmetros de paginação.

### Implementação

A consulta utiliza:

```text
SettlementRepositoryCustom
```

para realizar filtros e paginação.

---

## Buscar liquidação

```http
GET /api/v1/settlements/{id}
```

---

# 4. DTOs e Contratos

## Requests

Localização:

```text
src/main/java/br/com/joaobarbosa/srm/creditengine/dto/
```

Principais requests:

```text
CreateReceivableRequest
CreateReceivableBatchRequest
UpdateReceivableRequest

PricingRequest
PricingSimulationRequest

CreateExchangeRateRequest
UpdateExchangeRateRequest

SettlementFilterRequest
```

## Responses

```text
ReceivableResponse
ReceivableBatchResponse

PricingResponse
PricingSimulationResponse

ExchangeRateResponse
CurrencyResponse
AssignorResponse
SettlementResponse
```

---

# 5. Entidades

Localização:

```text
src/main/java/br/com/joaobarbosa/srm/creditengine/model/entity
```

## Receivable

Representa um recebível.

Principais atributos:

```text
assignor
receivableType
currency
baseRate
faceValue
status
dueDate
operationDate
```

Status:

```text
PENDING
SETTLED
```

---

## Settlement

Representa a liquidação de um recebível.

Principais atributos:

```text
receivable
paymentCurrency
presentValue
appliedExchangeRate
netAmount
status
createdAt
```

---

## ReceivableType

Representa o tipo de recebível e sua regra de risco.

```text
name
code
spreadRate
```

---

## ExchangeRate

Representa uma taxa de câmbio.

```text
sourceCurrency
targetCurrency
rate
referenceDate
```

---

## Currency

Representa uma moeda.

```text
isoCode
name
```

O `isoCode` possui três caracteres.

---

## Assignor

Representa o cedente do recebível.

```text
name
document
```

O documento é único.

---

# 6. Fluxos Principais

## 6.1 Criar recebível

```text
CreateReceivableRequest
        │
        ▼
ReceivableService
        │
        ├──► AssignorService
        │
        ├──► CurrencyRepository
        │
        ├──► ReceivableTypeRepository
        │
        ▼
ReceivableMapper
        │
        ▼
ReceivableRepository
        │
        ▼
ReceivableResponse
```

---

# 6.2 Simular precificação

```text
PricingSimulationRequest
        │
        ▼
PricingService
        │
        ├──► ReceivableType
        │
        ├──► Currency
        │
        ▼
PricingStrategyResolver
        │
        ▼
PricingStrategy
        │
        ▼
Present Value
        │
        ├── moedas diferentes?
        │          │
        │          └──► ExchangeRateService
        │
        ▼
Net Amount
        │
        ▼
PricingSimulationResponse
```

A simulação não gera persistência.

---

# 6.3 Liquidar recebível

```text
Receivable
    │
    ▼
Validar PENDING
    │
    ▼
Resolver moeda de pagamento
    │
    ▼
PricingCalculatorService
    │
    ├──► PricingStrategy
    │
    └──► ExchangeRateService
    │
    ▼
Criar Settlement
    │
    ▼
Receivable = SETTLED
    │
    ▼
Persistir Settlement
    │
    ▼
PricingResponse
```

---

# 7. Estratégia de Precificação

O projeto utiliza o **Strategy Pattern** para encapsular as diferentes regras de precificação por tipo de recebível.

## Componentes

```text
PricingStrategy
AbstractPricingStrategy
PricingStrategyResolverImpl
```

---

## AbstractPricingStrategy

A implementação base calcula:

```text
total = 1 + baseRate + spread
```

Depois:

```text
discountFactor = total ^ installments
```

E:

```text
presentValue = faceValue / discountFactor
```

O resultado utiliza:

```text
scale = 2
rounding = HALF_UP
```

O período de parcelas deve ser maior que zero.

Caso contrário:

```text
InvalidInstallmentPeriodException
```

---

## Strategies implementadas

### Cheque pré-datado

```text
PostDatedCheckPricingStrategy
```

Código:

```text
CHEQUE_PRE_DATADO
```

### Duplicata mercantil

```text
DuplicataMercantilPricingStrategy
```

Código:

```text
DUPLICATA_MERCANTIL
```

---

## PricingStrategyResolver

O:

```text
PricingStrategyResolverImpl
```

monta um mapa:

```text
receivableTypeCode → PricingStrategy
```

As estratégias são descobertas através das beans do Spring.

Caso não exista uma estratégia correspondente:

```text
UnsupportedReceivableTypeException
```

### Benefício

Novas regras de precificação podem ser adicionadas sem alterar o fluxo central do cálculo.

---

# 8. PricingCalculatorService

O `PricingCalculatorService` centraliza o cálculo financeiro utilizado tanto na simulação quanto na liquidação.

Método principal:

```text
calculate(receivable, paymentCurrency)
```

Responsabilidades:

1. Calcular `installments`;
    
2. Resolver a estratégia;
    
3. Calcular `presentValue`;
    
4. Resolver a taxa de câmbio;
    
5. Calcular `netAmount`.
    

---

## Cálculo do período

O número de parcelas/meses é calculado considerando:

```text
operationDate
dueDate
```

O resultado mínimo é:

```text
1
```

---

## Taxa de câmbio

Quando a moeda do título e a moeda de pagamento são iguais:

```text
exchangeRate = 1
```

Quando são diferentes:

```text
ExchangeRateRepository
```

é consultado para obter a taxa.

---

## Valor líquido

O valor líquido é calculado como:

```text
netAmount = presentValue × exchangeRate
```

---

# 9. Regras de Negócio

## Recebível

O valor de face deve ser:

```text
faceValue >= 0.01
```

---

## Lote

Um lote pode possuir no máximo:

```text
500 recebíveis
```

---

## Taxa de câmbio

A taxa deve respeitar:

```text
exchangeRate >= 0.000001
```

---

## Cedente

O documento do cedente é único.

O comportamento é:

```text
Documento inexistente
        ↓
Criar Assignor

Documento existente + mesmo nome
        ↓
Reutilizar Assignor

Documento existente + nome diferente
        ↓
InvalidDocumentException
```

---

## Liquidação

Um recebível somente pode ser liquidado uma vez.

Transição válida:

```text
PENDING → SETTLED
```

Uma segunda tentativa gera:

```text
ReceivableAlreadySettledException
```

---

# 10. Tratamento de Erros

O tratamento global é realizado por:

```text
GlobalExceptionHandler
```

Localização:

```text
controller/advice/GlobalExceptionHandler.java
```

## Códigos HTTP

|HTTP|Situação|
|---|---|
|`400`|Erros de validação|
|`404`|Recurso não encontrado|
|`409`|Conflito de dados|
|`422`|Regra de negócio não processável|
|`500`|Erro inesperado|

---

## 400 — Bad Request

Exemplo:

```text
MethodArgumentNotValidException
```

A resposta contém os campos e respectivas mensagens de validação.

---

## 404 — Not Found

Exemplos:

```text
DomainNotFoundException
ExchangeRateNotFoundException
```

---

## 409 — Conflict

Exemplos:

```text
DataIntegrityViolationException
InvalidDocumentException
```

---

## 422 — Unprocessable Content

Exemplos:

```text
ReceivableAlreadySettledException
UnsupportedReceivableTypeException
InvalidInstallmentPeriodException
```

---

## 500 — Internal Server Error

Exceções não tratadas são registradas através de log.

---

# 11. Repositórios e Mappers

## Repositories

Localização:

```text
src/main/java/.../repository/
```

Os repositórios padrão utilizam Spring Data.

---

## Settlement Repository

`Settlement` possui implementação customizada para consultas analíticas.

A implementação suporta:

- filtros;
    
- paginação;
    
- consulta otimizada.
    

---

## Mappers

Localização:

```text
src/main/java/br/com/joaobarbosa/srm/creditengine/mappers
```

Implementações:

```text
mappers/impl
```

Os mappers centralizam as conversões:

```text
DTO → Entity
Entity → DTO
```

> Manter as implementações dos mappers revisadas para garantir que os campos e formatos retornados estejam de acordo com os contratos da API.

---

# 12. Extensibilidade

## Adicionar novo tipo de recebível

Para adicionar uma nova regra de precificação:

### 1. Criar o tipo no banco

O `code` deve ser único.

```text
ReceivableType
```

---

### 2. Criar a Strategy

Implementar:

```text
PricingStrategy
```

ou:

```text
AbstractPricingStrategy
```

A classe deve ser registrada como:

```java
@Component
```

e implementar:

```java
getReceivableTypeCode()
```

retornando o mesmo `code` cadastrado no banco.

---

### 3. Resolver automaticamente

O:

```text
PricingStrategyResolverImpl
```

encontrará automaticamente a nova implementação através das beans do Spring.

---

# 13. Integração com Provider de Câmbio

Atualmente o sistema utiliza um provider mockado.

A implementação atual está em:

```text
ExchangeRateServiceImpl.syncFromMockedProvider
```

## Provider real

Uma integração real pode ser feita substituindo a implementação atual por uma chamada HTTP ao provider externo.

Fluxo:

```text
API externa
    ↓
ExchangeRateService
    ↓
Persistência
    ↓
ExchangeRate
```

Outra possibilidade é criar uma nova implementação de `ExchangeRateService` e utilizar profiles/DI para selecionar a implementação.

---

# 14. Execução Local

## Build

```bash
mvn clean package
```

---

## Executar com Maven

```bash
mvn spring-boot:run
```

---

## Executar o JAR

Depois do build:

```bash
java -jar target/<arquivo>.jar
```

---

# 15. OpenAPI / Swagger

O projeto utiliza:

```text
springdoc-openapi-starter-webmvc-ui
```

A documentação pode ser acessada através de:

```text
http://localhost:8080/swagger-ui.html
```

ou:

```text
http://localhost:8080/swagger-ui/index.html
```

A especificação OpenAPI em JSON:

```text
http://localhost:8080/v3/api-docs
```

A URL exata da interface pode variar conforme a versão/configuração do SpringDoc.

---

# 16. Testes

Os testes estão localizados em:

```text
src/test/java
```

Existem testes para:

- Strategies;
    
- Services.
    

Também é recomendado implementar testes de integração para o fluxo completo:

```text
create receivable
        ↓
simulate
        ↓
settle
```

---

# 17. Pontos de Atenção e Melhorias

## Provider de câmbio

Atualmente a taxa é mockada e hardcoded.

Para produção:

```text
Mock Provider
     ↓
Real Exchange Provider
```

---

## Testes de integração

Adicionar testes para:

- repositories;
    
- settlement repository customizado;
    
- fluxos de criação;
    
- simulação;
    
- liquidação.
    

---

## Banco de dados

Garantir:

- índices adequados;
    
- foreign keys;
    
- constraints;
    
- unicidade do documento do cedente.
    

---

## Logging

O `PricingService` já registra logs de simulação, auxiliando em:

- auditoria;
    
- debugging;
    
- rastreamento das operações.
    

---

# 18. Estrutura do Projeto

## Controllers

```text
src/main/java/br/com/joaobarbosa/srm/creditengine/controller
```

## Services

```text
src/main/java/br/com/joaobarbosa/srm/creditengine/service/impl
```

## DTOs

```text
src/main/java/br/com/joaobarbosa/srm/creditengine/dto
```

## Entities

```text
src/main/java/br/com/joaobarbosa/srm/creditengine/model/entity
```

## Strategies

```text
src/main/java/br/com/joaobarbosa/srm/creditengine/strategy
```

## Mappers

```text
src/main/java/br/com/joaobarbosa/srm/creditengine/mappers
```

## Repositories

```text
src/main/java/br/com/joaobarbosa/srm/creditengine/repository
```

## Exception Handler

```text
controller/advice/GlobalExceptionHandler.java
```

## Application

```text
CreditEngineApplication.java
```

---

# 19. Resumo Arquitetural

O fluxo principal do sistema pode ser representado da seguinte forma:

```text
                    ┌──────────────────┐
                    │    REST API      │
                    │   Controller     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     Service      │
                    │   Orquestração   │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────────┐ ┌───────────────┐
        │ Strategy │  │ ExchangeRate │ │     Mapper    │
        │  Engine  │  │   Service    │ │               │
        └──────────┘  └──────────────┘ └───────────────┘
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                    ┌──────────────────┐
                    │   Repository     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   PostgreSQL     │
                    └──────────────────┘
```

O cálculo financeiro é isolado no `PricingCalculatorService`, enquanto as regras específicas de cada tipo de recebível são encapsuladas pelas implementações de `PricingStrategy`.

Isso permite que novos tipos de recebíveis sejam adicionados sem modificar o fluxo central de precificação.



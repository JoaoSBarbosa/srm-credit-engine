# SRM Credit Engine

> Motor de precificação e liquidação de recebíveis multimoedas.

**Technical Challenge — SRM Credit Engine**

Implementação do desafio técnico proposto para desenvolvimento de uma plataforma de cessão de crédito multimoedas para operações envolvendo recebíveis, precificação, câmbio e liquidação.

O projeto foi desenvolvido com foco em **separação de responsabilidades, integridade transacional, precisão financeira, testabilidade e evolução arquitetural**, utilizando uma API REST como núcleo da solução.

---

## Visão Geral

O **SRM Credit Engine** representa o backend de uma plataforma destinada a operações de cessão de crédito.

O sistema recebe recebíveis de diferentes tipos, aplica regras de precificação específicas para cada ativo, considera a moeda da operação e registra a liquidação de forma persistente e auditável.

O fluxo principal pode ser resumido como:

```text
Recebível
    │
    ▼
Tipo de Recebível
    │
    ▼
Regra de Precificação
    │
    ▼
Valor Presente
    │
    ├───────────────┐
    │               │
    ▼               ▼
Mesma moeda    Conversão cambial
    │               │
    └───────┬───────┘
            ▼
      Valor Líquido
            │
            ▼
        Liquidação
            │
            ▼
        PostgreSQL
```

---

## Funcionalidades

### Recebíveis

* Cadastro individual de recebíveis;
* Cadastro em lote;
* Consulta por identificador;
* Atualização de recebíveis;
* Validação dos dados de entrada;
* Controle de status da operação.

### Precificação

* Simulação de precificação sem persistência;
* Precificação efetiva durante a liquidação;
* Cálculo de valor presente;
* Aplicação de taxa base;
* Aplicação de spread conforme o tipo de recebível;
* Conversão cambial em operações cross-currency.

### Câmbio

* Cadastro de taxas de câmbio;
* Atualização de taxas;
* Sincronização através de provider mockado;
* Suporte a operações com diferentes moedas.

### Liquidação

* Criação de liquidações;
* Controle de estado do recebível;
* Prevenção de liquidação duplicada;
* Registro persistente da operação;
* Consulta analítica de liquidações.

### API

* API REST versionada;
* Paginação;
* Filtros para consultas analíticas;
* Validação de requests;
* Tratamento global de exceções;
* Documentação OpenAPI/Swagger.

---

## Arquitetura

O backend utiliza uma arquitetura em camadas, separando responsabilidades entre exposição HTTP, serviços de aplicação e persistência.

```text
┌───────────────────────────────────────┐
│              REST API                 │
│            Controllers                │
└──────────────────┬────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────┐
│              Services                 │
│       Application / Business          │
└───────────────┬───────────┬───────────┘
                │           │
                ▼           ▼
        ┌────────────┐ ┌──────────────┐
        │  Strategy  │ │ ExchangeRate │
        │   Engine   │ │   Service    │
        └────────────┘ └──────────────┘
                │           │
                └─────┬─────┘
                      ▼
             ┌─────────────────┐
             │   Repositories   │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │   PostgreSQL    │
             └─────────────────┘
```

A precificação utiliza **Strategy Pattern**, permitindo que regras específicas de diferentes tipos de recebíveis sejam implementadas de forma independente.

O cálculo financeiro é centralizado no `PricingCalculatorService`, enquanto o `PricingService` é responsável pela orquestração da operação.

---

## Stack

| Tecnologia         | Utilização              |
| ------------------ | ----------------------- |
| Java 21            | Linguagem               |
| Spring Boot 4.1.0  | Framework               |
| Spring Web MVC     | API REST                |
| Spring Data JPA    | Persistência            |
| PostgreSQL         | Banco de dados          |
| Flyway             | Versionamento do schema |
| SpringDoc OpenAPI  | Documentação da API     |
| Jakarta Validation | Validação               |
| JUnit              | Testes                  |
| Mockito            | Testes unitários        |
| Testcontainers     | Testes de integração    |
| Docker             | Containerização         |
| Docker Compose     | Orquestração            |

---

## Estrutura do Projeto

```text
srm-credit-engine/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   └── java/
│   │   └── test/
│   └── pom.xml
│
├── frontend/
│   └── ...
│
├── docs/
│   ├── BACKEND.md
│   ├── architecture-decisions.md
│   └── ...
│
├── AI_USAGE.md
├── docker-compose.yml
└── README.md
```

O frontend será integrado posteriormente à API.

---

## Documentação

A documentação está separada por responsabilidade para evitar que o README se torne excessivamente detalhado.

### Backend

A documentação técnica completa da API, DTOs, entidades, fluxos de negócio, estratégias de precificação, regras e estrutura interna está disponível em:

**[Documentação técnica do Backend](docs/BACKEND.md)**

### Decisões arquiteturais

As principais decisões técnicas e seus respectivos motivos estão documentadas em:

**[Architecture Decision Records](docs/architecture-decisions.md)**

### Uso de Inteligência Artificial

O projeto também documenta o uso de ferramentas de IA durante o desenvolvimento, incluindo situações em que a IA foi utilizada como suporte técnico e casos em que suas sugestões precisaram ser avaliadas ou corrigidas.

**[AI Usage](AI_USAGE.md)**

---

## Banco de Dados

O projeto utiliza **PostgreSQL** como banco relacional e **Flyway** para versionamento das migrações.

As migrações ficam em:

```text
backend/src/main/resources/db/migration/
```

O schema possui entidades relacionadas a:

```text
Currency
    │
    ├── ExchangeRate
    │
    └── Receivable
            │
            ├── Assignor
            ├── ReceivableType
            └── Settlement
```

A escolha do PostgreSQL está relacionada ao uso de recursos relacionais, constraints, transações e recursos específicos do banco necessários para a aplicação.

---

## API e Swagger

Após iniciar o backend, a documentação interativa da API estará disponível em:

```text
http://localhost:8080/swagger-ui.html
```

A especificação OpenAPI pode ser acessada em:

```text
http://localhost:8080/v3/api-docs
```

A API utiliza o prefixo:

```text
/api/v1
```

Principais recursos:

```text
/receivables
/pricings
/exchange-rates
/currencies
/assignor
/receivable-types
/settlements
```

Para detalhes dos contratos e fluxos, consulte a [documentação técnica do backend](docs/BACKEND.md).

---

## Execução Local

### Pré-requisitos

Para executar o projeto localmente, serão necessários:

* Java 21;
* Maven;
* Docker;
* Docker Compose.

---

### Executar o ambiente com Docker Compose

O ambiente será disponibilizado através do Docker Compose, permitindo inicializar os serviços da aplicação e suas dependências de infraestrutura de forma padronizada.

```bash
docker compose up -d
```

Verificar os containers:

```bash
docker compose ps
```

Encerrar o ambiente:

```bash
docker compose down
```

> Atualmente o Docker Compose está sendo estruturado.

---

### Executar o backend localmente

A partir do diretório `backend`:

```bash
./mvnw spring-boot:run
```

Ou, caso o Maven esteja instalado globalmente:

```bash
mvn spring-boot:run
```

---

## Testes

Os testes podem ser executados com:

```bash
mvn test
```

O projeto possui testes unitários para as principais regras de negócio e estratégias de precificação.

Também são utilizados **Testcontainers** para executar testes de integração utilizando uma instância real do PostgreSQL.

Essa abordagem permite que as migrações Flyway sejam executadas contra o mesmo tipo de banco utilizado pela aplicação, evitando adaptações específicas das migrations para bancos de teste como H2.

Para os testes de integração, é necessário que o Docker esteja disponível.

---

## Precisão Financeira

Como o domínio envolve operações financeiras, os cálculos monetários utilizam `BigDecimal` em vez de tipos de ponto flutuante binário.

O cálculo base de precificação segue:

```text
Valor Presente =
    Valor Face /
    (1 + Taxa Base + Spread) ^ Prazo
```

Em operações cross-currency, a conversão cambial é aplicada após o cálculo do valor presente:

```text
Valor Líquido =
    Valor Presente × Taxa de Câmbio
```

Os valores monetários são arredondados utilizando escala decimal e `RoundingMode.HALF_UP`.

---

## Estratégia de Precificação

O projeto utiliza o **Strategy Pattern** para desacoplar as regras de precificação.

Atualmente existem estratégias para:

```text
DUPLICATA_MERCANTIL
CHEQUE_PRE_DATADO
```

Novos tipos de recebíveis podem possuir novas estratégias sem alterar o fluxo central do motor de precificação.

---

## Integridade e Liquidação

Uma liquidação representa uma operação financeira persistida e deve respeitar as propriedades ACID.

O fluxo de liquidação é:

```text
PENDING
   │
   ▼
Calcular precificação
   │
   ▼
Criar Settlement
   │
   ▼
SETTLED
```

Um recebível já liquidado não pode ser liquidado novamente.

O banco também possui constraints para reforçar regras de integridade que não devem depender exclusivamente da aplicação.

---

## Consultas Analíticas

O endpoint de liquidações suporta filtros e paginação:

```text
GET /api/v1/settlements
```

Filtros disponíveis incluem:

```text
assignorName
currencyIso
receivableTypeCode
status
startDate
endDate
```

A consulta utiliza uma implementação customizada de repositório para permitir maior controle sobre a construção da consulta e sua paginação.

---

## Status do Projeto

### Backend

* [x] Modelagem do domínio
* [x] Persistência PostgreSQL
* [x] Migrações Flyway
* [x] Gestão de moedas
* [x] Gestão de taxas de câmbio
* [x] Gestão de cedentes
* [x] Gestão de tipos de recebíveis
* [x] Gestão de recebíveis
* [x] Motor de precificação
* [x] Strategy Pattern
* [x] Simulação de precificação
* [x] Liquidação
* [x] Consultas analíticas
* [x] Tratamento global de exceções
* [x] Validação de requests
* [x] OpenAPI / Swagger
* [x] Testes unitários
* [x] Testes de integração com PostgreSQL
* [ ] Containerização completa da aplicação

### Frontend

* [ ] Estrutura inicial
* [ ] Integração com API
* [ ] Painel do operador
* [ ] Simulação de precificação
* [ ] Grid de liquidações
* [ ] Filtros e paginação

### Infraestrutura

* [x] PostgreSQL via Docker
* [x] Docker Compose inicial
* [ ] Containerização do backend
* [ ] Containerização do frontend
* [ ] Ambiente completo via Docker Compose
* [ ] CI/CD

---

## Desafio Técnico

Este projeto foi desenvolvido como implementação do desafio técnico:

> **Desafio Técnico: Plataforma de Cessão de Crédito Multimoedas — SRM Credit Engine**

O desafio propõe a construção de uma plataforma capaz de receber recebíveis, aplicar regras de precificação baseadas no risco do ativo, realizar conversões cambiais e registrar as respectivas liquidações.

Além dos requisitos funcionais, o desafio avalia aspectos de engenharia como:

* qualidade e organização do código;
* princípios SOLID, DRY e KISS;
* padrões de projeto;
* testes automatizados;
* integridade transacional;
* domínio de Git;
* documentação;
* decisões arquiteturais;
* uso responsável de ferramentas de IA;
* capacidade de evolução da solução.

Este repositório busca apresentar não apenas uma implementação funcional, mas também as decisões de engenharia utilizadas durante sua construção.

---

## Git e Processo de Desenvolvimento

O desenvolvimento utiliza branches de feature e **Conventional Commits**.

Exemplos:

```text
feat: add pricing services
test: add service and strategy tests
fix: prevent query clause concatenation
docs: configure Swagger UI
```

As funcionalidades são desenvolvidas em branches próprias e integradas à `main` através de Pull Requests.

O histórico do repositório é mantido como parte do processo de desenvolvimento e busca refletir a evolução incremental da solução.

---

## Próximos Passos

As próximas etapas previstas são:

1. Finalizar a containerização do backend;
2. Estruturar o frontend;
3. Integrar frontend e backend;
4. Disponibilizar o ambiente completo através do Docker Compose;
5. Expandir os testes de integração;
6. Automatizar a execução dos testes via CI;
7. Evoluir observabilidade e documentação conforme necessário.

---

## Autor

**João Barbosa**

Projeto desenvolvido como implementação de desafio técnico para a construção de uma plataforma de cessão de crédito multimoedas.

---

## Licença

Este projeto foi desenvolvido para fins de avaliação técnica.

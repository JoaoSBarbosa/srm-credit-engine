# Decisões de Arquitetura


Este documento registra as principais decisões arquiteturais adotadas durante o desenvolvimento do **SRM Credit Engine**.

O objetivo é documentar não apenas **o que foi escolhido**, mas principalmente **o motivo da escolha**, as alternativas avaliadas e os impactos técnicos da decisão.

---

# ADR-001 - Monorepo

## Decisão

> Foi adotada uma estratégia de Monorepo, concentrando backend, frontend, documentação e infraestrutura em um único repositório.

## Contexto

> O desafio exige a entrega de uma aplicação composta por backend, frontend, documentação, Docker e banco de dados, além de uma boa experiência de avaliação do código.

## Alternativas avaliadas

- Repositórios separados (Backend e Frontend)
- Monorepo ( Escolhido )

## Motivo da escolha

> O Monorepo foi adotado para simplificar a avaliação técnica da solução.

Dessa forma, toda a aplicação pode ser obtida com um único clone do repositório e executada através de um único comando utilizando Docker Compose, reduzindo o tempo de configuração do ambiente e facilitando a reprodução da solução pelo avaliador.

Além disso, a documentação, diagramas, scripts SQL e decisões arquiteturais permanecem centralizados no mesmo repositório.

Em um ambiente corporativo com equipes independentes de Frontend e Backend, a separação em múltiplos repositórios seria uma alternativa mais adequada.

## Vantagens

- Facilita a avaliação do projeto.
- Um único repositório para documentação e código.
- Docker Compose centralizado.
- Configuração simples do ambiente.
- Menor esforço para executar o projeto.

## Desvantagens

- Repositório tende a crescer com o tempo.
- Menor independência entre equipes.

---

# ADR-002 - PostgreSQL

## Decisão

Foi utilizado PostgreSQL como banco de dados relacional da aplicação.

## Contexto

O sistema realiza operações financeiras envolvendo cálculo de valores monetários, liquidações e transações que exigem integridade e consistência dos dados.

## Alternativas avaliadas

- PostgreSQL(Escolhido)
- MySQL
- SQL Server

## Motivo da escolha

O PostgreSQL é amplamente adotado em aplicações corporativas e financeiras devido à sua robustez, confiabilidade, conformidade com o padrão SQL e excelente suporte às propriedades ACID.

Além disso, possui ótimo desempenho para consultas complexas, suporte a índices avançados, transações concorrentes e tipos de dados adequados para aplicações financeiras, como NUMERIC, utilizado para armazenar valores monetários com precisão decimal.

Também é uma tecnologia amplamente utilizada no ecossistema Java/Spring Boot e possui excelente integração com Flyway e Docker.

## Vantagens

Excelente suporte às propriedades ACID.
Alta confiabilidade.
Grande adoção no mercado.
Excelente integração com Spring Boot.
Ótimo suporte para Docker.
Excelente precisão para dados financeiros.

## Desvantagens

Curva de aprendizado um pouco maior quando comparado ao MySQL.

---

# ADR-003 - Flyway

## Decisão

Foi utilizado Flyway para versionamento do banco de dados.

## Contexto

O desafio exige a entrega dos scripts DDL e uma estrutura de banco consistente.

## Alternativas avaliadas

- Flyway (Escolhido)
- Liquibase

## Motivo da escolha

O Flyway foi escolhido por ser uma ferramenta simples, amplamente utilizada em projetos Spring Boot e já fazer parte da experiência prática do desenvolvedor.

## Vantagens

Fácil utilização.
Integração nativa com Spring Boot.
Controle de versão do banco.
Scripts SQL explícitos.
Grande adoção no mercado.

## Desvantagens

Menor flexibilidade para migrações muito complexas quando comparado ao Liquibase.

---

# ADR-004 - Java 21

## Decisão

Foi utilizada a versão Java 21.

## Contexto

O desafio exige Java 11 ou superior.

## Alternativas avaliadas

Java 17
Java 21 (Escolhido)

## Motivo da escolha

O Java 21 é a versão LTS mais recente disponível no momento do desenvolvimento do projeto.

A escolha permite utilizar uma plataforma moderna, estável e com suporte de longo prazo, mantendo compatibilidade com o ecossistema Spring Boot e acesso às melhorias de desempenho e produtividade introduzidas nas versões mais recentes da linguagem.

## Vantagens

Long Term Support (LTS).
Melhor desempenho.
Melhorias na linguagem.
Ecossistema atualizado.
Compatibilidade com Spring Boot.

## Desvantagens

Pode não estar disponível em ambientes legados


---

# ADR-005 - Modelagem e Integridade da Tabela de Câmbio (`exchange_rate`)

## Decisão
> Foi adotada uma modelagem com regras rígidas de integridade no nível de banco de dados (constraints `CHECK` e `UNIQUE`) e indexação composta otimizada na tabela `exchange_rate`.

## Contexto
O sistema realiza conversões de moedas e auditoria de liquidações financeiras. Cotações zeradas, negativas ou duplicadas no mesmo dia podem causar falhas críticas de cálculo (como divisão por zero) ou inconsistências contábeis. Além disso, consultas de cotação por par de moedas e data são frequentes e críticas para a performance.

## Alternativas avaliadas

- Validação das regras de negócio apenas no backend (Spring Boot/Bean Validation).
- Validação no backend + Constraints de Integridade e Índices Dedicados no PostgreSQL (Escolhido).

## Motivo da escolha

A combinação de validações no banco e índice planejado foi adotada por três razões principais:

1. **Defesa em Profundidade (*Defense in Depth*) e Constraint `CHECK`:**
   A constraint `CHECK (exchange_rate > 0)` garante que nenhuma taxa menor ou igual a zero seja inserida. Isso previne falhas graves na aplicação (como divisão por zero no cálculo de conversão) e assegura que os dados permaneçam válidos mesmo que ocorra um bug no backend ou um script SQL seja executado diretamente no banco.

2. **Garantia de Invariância Contábil e Constraint `UNIQUE`:**
   A constraint `uq_rate_by_date` garante a unicidade do par `(target_currency_id, source_currency_id, reference_date)`, impedindo a existência de duas cotações conflitantes para o mesmo par de moedas no mesmo dia.

3. **Otimização de Consultas e Índice Composto DESC (`idx_exchange_rate_search`):**
   A consulta mais frequente do sistema busca a cotação de um par específico de moedas na data mais recente. O índice composto `(source_currency_id, target_currency_id, reference_date DESC)` cobre exatamente os campos da cláusula `WHERE` e a ordenação do `ORDER BY reference_date DESC`, permitindo uma busca via *Index Scan* de baixíssima latência ($O(\log N)$).

4. **Precisão Numérica (`DECIMAL(18, 6)`):**
   O tipo `DECIMAL` foi escolhido em detrimento do `FLOAT`/`DOUBLE` para evitar inconsistências decorrentes do arredondamento de ponto flutuante em operações financeiras.

## Vantagens

- **Integridade Garantida:** Impede a entrada de dados inválidos no nível mais baixo da infraestrutura.
- **Alta Performance em Leitura:** Índice alinhado com o padrão de acesso mais comum do sistema.
- **Auditoria Confiável:** Impossibilita cotações duplicadas na mesma data de referência.
- **Precisão Financeira:** Uso correto de tipo numérico exato para taxas de conversão.

## Desvantagens

- **Pequeno Overhead em Escrita:** A verificação de constraints e atualização do índice adiciona um custo insignificante no `INSERT`/`UPDATE` (aceitável dado que cotações têm volume de leitura muito superior ao de escrita).

# AI_USAGE.md

## Resumo

A IA foi utilizada como ferramenta de apoio durante o desenvolvimento, principalmente para acelerar tarefas repetitivas, auxiliar na revisão de código e explorar alternativas de implementação.

Todo código gerado ou sugerido pela IA foi revisado, adaptado e validado manualmente antes de ser incorporado ao projeto.

## 1. Organização e documentação

A IA foi utilizada como ferramenta de apoio para sugerir uma organização inicial do README e da documentação técnica.

Toda a estrutura foi revisada, adaptada e validada manualmente para garantir aderência aos requisitos do desafio e às decisões arquiteturais adotadas.

## 2. Geração de código repetitivo

A IA foi utilizada em alguns momentos para auxiliar na geração de código repetitivo, principalmente em:

- Mappers;
- Getters e setters;
- Instanciação de entidades;
- Conversões entre entidade e DTO;
- Estrutura inicial de algumas classes.

Todo o código gerado foi revisado manualmente. Durante esse processo, foram identificados casos em que campos não foram mapeados ou foram associados incorretamente devido a diferenças de nomenclatura, sendo essas situações corrigidas manualmente.

## 3. Repositories e consultas

A IA foi utilizada como apoio na criação e revisão de interfaces de Repository e consultas utilizando Spring Data JPA.

Durante esse processo, a IA sugeriu algumas abordagens de consultas derivadas e JPQL, que foram posteriormente analisadas e validadas manualmente.

Um exemplo foi uma consulta para obter a cotação mais recente de um par de moedas. Uma sugestão inicial utilizava `LIMIT 1` dentro de uma consulta JPQL, o que é uma construção específica de SQL e não é válida nesse contexto.

A implementação foi revisada e corrigida para utilizar uma abordagem compatível com Spring Data JPA, mantendo a consulta alinhada ao modelo de domínio e aos índices definidos no banco de dados.

## 4. Cenarios de testes

A IA também foi utilizada para auxiliar na criação de cenários de testes unitários,

## 5. Análise

O principal benefício observado foi a redução do tempo gasto em tarefas repetitivas e a possibilidade de explorar outras abordagens de implementação.

No entanto, as sugestões geradas pela IA não foram consideradas automaticamente corretas.

Durante o desenvolvimento foram identificadas situações como:

- Consultas JPQL contendo sintaxe específica de SQL;
- Mapeamentos incompletos;
- Nomes de propriedades incompatíveis com o modelo;
- Abordagens que precisaram ser adaptadas à arquitetura do projeto.

Por esse motivo, todo código gerado ou sugerido foi submetido a revisão, compilação e/ou testes antes de ser utilizado.

## Prompts usados

Alguns exemplos de prompts utilizados durante o desenvolvimento:

- "Avaliar possíveis casos de borda para o cálculo de conversão de moedas."
- "Sugerir cenários de testes para o serviço de cálculo."
- "Revisar a estrutura de DTO, entidade e mapper."
- "Analisar possíveis problemas de performance na consulta de cotação."

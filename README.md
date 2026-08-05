# SRM Credit Engine

Plataforma de cessão de crédito multimoedas para a SRM Asset — recebe recebíveis (duplicatas, cheques pré-datados), calcula o deságio por tipo de ativo e registra a liquidação de forma auditável.

> Este README é atualizado conforme o projeto evolui. A versão completa (arquitetura, decisões técnicas, como rodar) está em construção junto com o restante do backend.

## Stack

- **Backend**: Java 21 + Spring Boot 4.1.0
- **Banco**: PostgreSQL + Flyway
- **Infra**: Docker + Docker Compose

## Estrutura

```
srm-credit-engine/
├── backend/     # API Spring Boot
├── frontend/    # SPA React (em breve)
└── docs/        # Diagramas e decisões técnicas
```
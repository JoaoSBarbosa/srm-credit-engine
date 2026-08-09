# Documentação Técnica — Frontend SRM Credit Engine

## 1. Visão geral

O projeto é uma SPA em **Next.js (App Router)** que serve como painel operacional para a plataforma de cessão de crédito multimoedas. A aplicação consome uma API REST (Spring Boot) e organiza a interface em quatro módulos de negócio:

| Módulo              | Rota base         | Responsabilidade                                                                                                                                  |
| ------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Recebíveis**      | `/receivables`    | Cadastro unitário e em lote de recebíveis, simulação de precificação em tempo real e listagem dos pendentes de liquidação (com ação de liquidar). |
| **Moedas**          | `/currencies`     | Cadastro, edição e listagem das moedas usadas nas operações.                                                                                      |
| **Liquidações**     | `/settlements`    | Extrato paginado e filtrável de todas as operações já liquidadas.                                                                                 |
| **Taxas de câmbio** | `/exchange-rates` | Cadastro/edição manual de cotações e sincronização automática via API externa.                                                                    |

Além desses quatro, existem duas telas de apoio:

- **`/`** — Home/dashboard com atalhos para as operações mais usadas.
- **`/pricing`** — Simulador de precificação avulso (não vinculado a um recebível específico).

---

## 2. Stack tecnológica

| Camada       | Tecnologia                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router, React 19)                                                                 |
| Linguagem    | TypeScript (strict mode)                                                                          |
| Estilização  | Tailwind CSS v4, tema escuro (slate/black)                                                        |
| Formulários  | `react-hook-form` + `zod` (usado no módulo de Pricing); demais módulos usam `useState` controlado |
| Notificações | `sonner` (toasts de sucesso/erro)                                                                 |
| Ícones       | `lucide-react`                                                                                    |
| Lint         | ESLint (`eslint-config-next`)                                                                     |

Scripts principais (`package.json`):

```bash
npm run dev     # ambiente de desenvolvimento (Turbopack)
npm run build   # build de produção
npm run start   # servidor de produção
npm run lint    # checagem de lint
```

### Variáveis de ambiente

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Definida em `.env.local` / `.env.example`. Caso ausente, o cliente HTTP usa `http://localhost:8080` como fallback (ver `lib/api/client.ts`).

---

## 3. Arquitetura e organização de pastas

O projeto segue uma **arquitetura orientada a features** (feature-based), separando código de UI genérica (`shared/`) de código específico de domínio (`features/`):

```
app/                     → rotas (App Router), cada page.tsx apenas compõe AppShell + feature
  page.tsx               → Home
  pricing/page.tsx
  receivables/page.tsx
  receivables/create/page.tsx
  receivables/create/batch/page.tsx
  currencies/page.tsx
  settlements/page.tsx
  exchange-rates/page.tsx

features/                → um diretório por domínio de negócio
  <feature>/
    types.ts             → contratos de request/response da feature
    services/            → chamadas HTTP (um arquivo por recurso)
    hooks/                → hooks de estado/orquestração (use-*.ts)
    components/           → componentes de apresentação específicos da feature
    pages/ (ou page/)     → componente "página" que monta a feature completa

shared/
  layout/                → AppShell, Header, Footer, NavigationMenu (+ config)
  components/            → Button, DataTable, Badge, EmptyState, campos de formulário, inputs mascarados

lib/api/
  client.ts              → cliente HTTP para uso em Client Components (fetch + tratamento de erro)
  server.ts              → cliente HTTP para uso em Server Components (cache: "no-store")

types/api.ts             → tipos genéricos de API (PageResponse<T>, ApiError)
utils/formatters.ts       → formatação de moeda, data, percentual e normalização de documento
```

### Padrão de camadas dentro de cada feature

```
UI (components/, pages/)
   ↓ chama
Hook de estado (hooks/use-*.ts)   → useState/useEffect, toasts, orquestra chamadas
   ↓ chama
Service (services/*.service.ts)  → apenas monta a URL/payload e delega ao lib/api/client
   ↓ chama
lib/api/client.ts                → fetch genérico com tratamento de erro HTTP
```

Essa separação mantém os componentes React livres de lógica de rede: eles apenas leem estado exposto pelos hooks e disparam callbacks.

---

## 4. Integração com a API

### Cliente HTTP (`lib/api/client.ts`)

Wrapper único sobre `fetch` com:

- Base URL vinda de `NEXT_PUBLIC_API_URL`;
- Header `Content-Type: application/json` automático quando há `body`;
- Em respostas não-OK, tenta extrair `message`/`error` do corpo JSON do backend (formato do `GlobalExceptionHandler` da API) e lança `Error` com essa mensagem — é esse texto que aparece nos toasts do `sonner`;
- Trata `204 No Content` retornando `undefined`.

Funções expostas: `getJson`, `postJson`, `putJson`, `deleteJson`.

Existe também `lib/api/server.ts`, equivalente para uso em Server Components (usa `cache: "no-store"` para sempre buscar dado fresco), embora as páginas atuais sejam majoritariamente Client Components.

### Formato de paginação (`types/api.ts`)

```ts
type PageResponse<T> = {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};
```

Esse formato reflete o `Page<T>` do Spring Data e é usado por Moedas, Taxas de Câmbio e Liquidações.

---

## 5. Módulo: Recebíveis (`features/receivables`)

### Endpoints consumidos

| Ação                     | Método/rota                                     | Payload                                      | Onde é chamado                                                       |
| ------------------------ | ----------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------- |
| Criar recebível único    | `POST /api/v1/receivables`                      | `CreateReceivablePayload`                    | `use-create-receivable-form.ts`                                      |
| Criar lote de recebíveis | `POST /api/v1/receivables/batch`                | `{ receivables: CreateReceivablePayload[] }` | `use-create-receivable-batch-form.ts`                                |
| Listar pendentes         | `GET /api/v1/receivables`                       | —                                            | `use-pending-receivables.ts`                                         |
| Simular precificação     | `POST /api/v1/pricings/receivables/simulate`    | `PricingSimulationPayload`                   | usado nos dois formulários de cadastro, em tempo real                |
| Liquidar recebível       | `POST /api/v1/pricings/receivables/{id}/settle` | `{ paymentCurrencyId, settlementDate }`      | `use-settle-receivable.ts`, acionado pelo botão "Liquidar recebível" |

### 5.1 Cadastro unitário — `/receivables/create`

- Formulário controlado (`use-create-receivable-form.ts`) com campos: cedente (nome/documento), tipo de recebível, moeda, valor de face, taxa base, data de operação e data de vencimento.
- A cada alteração relevante do formulário, dispara (com _debounce_ via `setTimeout`) uma chamada de **simulação** (`simulatePricing`) e exibe o resultado em tempo real no painel lateral (`SimulationRecebiveis` / `ResultItem`).
- Ao submeter, chama `createReceivable` e reseta o formulário exibindo mensagem de sucesso/erro.

### 5.2 Cadastro em lote — `/receivables/create/batch`

- Hook `use-create-receivable-batch-form.ts` mantém uma lista de itens (`BatchReceivableItem[]`), cada um com uma chave própria, permitindo:
  - Adicionar/remover linhas (limite de **20 recebíveis** por lote — `MAX_RECEIVABLES`);
  - Expandir/colapsar cada linha (apenas **1 linha expandida por vez** — `MAX_EXPANDED` — as demais viram um resumo colapsado via `ReceivableBatchSummary`);
  - Selecionar múltiplas linhas (checkbox) para remoção em massa (`removeSelected`);
  - Cada linha expandida tem sua própria simulação de precificação (`ReceivableBatchSimulation`), independente das demais.
- Ao submeter, normaliza o documento do cedente (remove máscara — `normalizeDocument`) e envia tudo em uma única chamada `POST /api/v1/receivables/batch`.

### 5.3 Listagem de pendentes — `/receivables`

- `PendingReceivables` renderiza uma `DataTable` com: cedente, tipo, moeda, valor de face, taxa base, vencimento, status (badge) e uma coluna de ação.
- Botão **"Liquidar recebível"** (variante `success`) chama `useSettleReceivable().settleReceivable(...)`, enviando:
  - `paymentCurrencyId`: a própria moeda do recebível (`receivable.currencyId`);
  - `settlementDate`: data atual (`new Date().toISOString().split("T")[0]`);
- Em caso de sucesso, exibe toast e recarrega a lista (`reload()`), removendo o item liquidado da listagem de pendentes.

### Componentes de apoio

- `ReceivableStatusBadge` — mapeia status (`PENDING`, `ACTIVE`, `SETTLED`, `CANCELLED`) para cor/rótulo em PT-BR.
- `getReceivableTypeLabel` (`util/receivable-type-label.ts`) — converte o código do tipo (ex.: `DUPLICATA_MERCANTIL`) em rótulo legível, com fallback genérico (title case) para tipos não mapeados.

---

## 6. Módulo: Moedas (`features/currencies`)

### Endpoints consumidos

| Ação   | Método/rota                              | Payload             |
| ------ | ---------------------------------------- | ------------------- |
| Listar | `GET /api/v1/currencies?page=0&size=100` | —                   |
| Criar  | `POST /api/v1/currencies`                | `{ isoCode, name }` |
| Editar | `PUT /api/v1/currencies/{id}`            | `{ isoCode, name }` |

### Fluxo

- `useCurrencies()` centraliza estado de listagem, modal (criar/editar) e salvamento.
- `CurrenciesPage` exibe um botão **"Nova moeda"**, a tabela (`CurrencyList`) com botão **"Editar"** por linha, e um modal único (`CurrencyFormModal`) reaproveitado tanto para criação quanto edição — o modo é definido pela presença de `editingCurrency`.
- Ao submeter o modal, o `isoCode` é normalizado para maiúsculas antes do envio.
- Após salvar (criar ou editar), a lista é recarregada (`load()`).

---

## 7. Módulo: Liquidações (`features/settlements`)

### Endpoint consumido

`GET /api/v1/settlements` com querystring paginada e filtros opcionais:

```
?page=0&size=20&assignorName=&currencyIso=&receivableTypeCode=&status=&startDate=&endDate=
```

Todos os filtros são opcionais e montados dinamicamente via `URLSearchParams` (`settlement.service.ts`), apenas os campos preenchidos são enviados.

### Fluxo

- `useSettlements()` guarda `filter`, `page` e `pageSize` em estado; qualquer mudança dispara novo `GET` automaticamente (via `useEffect`).
- `SettlementFilters` — formulário de filtro com: cedente (texto livre), moeda (select, populado por `getCurrencies`), tipo de recebível (select, populado por `getReceivableTypes`), data inicial/final e itens por página. Possui botões **"Filtrar"** e **"Limpar filtros"**.
- `SettlementTable` — tabela com cedente, tipo, moeda, valor de face, valor presente, câmbio aplicado, valor líquido, data e status; usa a paginação embutida do `DataTable` (`Página X de Y`, botões Anterior/Próxima).
- Ao trocar filtro ou tamanho de página, a página volta para `0` automaticamente.

---

## 8. Módulo: Taxas de câmbio (`features/exchange-rates`)

### Endpoints consumidos

| Ação                             | Método/rota                                                            | Payload                     |
| -------------------------------- | ---------------------------------------------------------------------- | --------------------------- |
| Listar (paginado)                | `GET /api/v1/exchange-rates?page=&size=`                               | —                           |
| Criar                            | `POST /api/v1/exchange-rates`                                          | `CreateExchangeRateRequest` |
| Editar                           | `PUT /api/v1/exchange-rates/{id}`                                      | `UpdateExchangeRateRequest` |
| Sincronizar com provedor externo | `POST /api/v1/exchange-rates/sync?sourceCurrencyId=&targetCurrencyId=` | corpo vazio                 |

A sincronização é feita **no backend**: o frontend apenas dispara o `POST /sync` informando as duas moedas envolvidas; é a API que consulta o provedor externo (`https://open.er-api.com/v6`) e persiste a cotação retornada, devolvendo o `ExchangeRateResponse` já salvo. O frontend não fala diretamente com a API externa.

### Fluxo (`/exchange-rates`)

- `useExchangeRates()` controla listagem paginada, criação, edição e sincronização, todas seguidas de `reload()` da página atual.
- `ExchangeRateForm` reaproveitado para criar/editar:
  - A taxa de câmbio é digitada como uma máscara numérica de 6 casas decimais (`RATE_DECIMAL_PLACES`), convertendo dígitos brutos em valor formatado (`1.234,567890`) e depois em `number` no submit;
  - Moedas de origem/destino são selects populados via `getCurrencies()`;
  - Ao editar, os campos são pré-preenchidos localizando as moedas pelo `isoCode` retornado na resposta.
- `ExchangeRateTable` lista as cotações com ações **"Editar"** e **"Sincronizar"** por linha — sincronizar reenvia as mesmas moedas daquela linha para o endpoint `/sync`, atualizando a cotação com o valor mais recente do provedor externo.
- Paginação com seletor de itens por página (10/20/50/100).

---

## 9. Camada de apresentação compartilhada (`shared/`)

### Layout (`shared/layout`)

- **`AppShell`** — wrapper padrão de página (`Header` + `<main>` + `Footer`), usado por todas as rotas.
- **`Header`** — logo + `NavigationMenu` (desktop) + botão hambúrguer que abre o menu em accordion no mobile.
- **`NavigationMenu`** — menu **guiado por configuração** (`navigation-menu.config.ts`), com suporte a itens simples (link direto) e itens com submenu (dropdown no desktop / accordion no mobile). Estrutura atual:
  - **Recebíveis** (submenu: Pendentes de liquidação, Cadastrar recebível, Cadastrar lote)
  - **Moedas** (link direto)
  - **Liquidações** (link direto)
  - **Taxas de câmbio** (link direto)
- **`Footer`** — rodapé fixo com nome do produto e crédito de autoria.

### Componentes de UI (`shared/components`)

| Componente                                          | Uso                                                                                                                                                                                                                              |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                                            | Botão padronizado com 11 variantes (`primary`, `secondary`, `outline`, `ghost`, `danger`, `success`, `warning`, `info`, `link`, `dark`, `light`), 2 tamanhos, estado de `loading` com spinner e `loadingText`.                   |
| `DataTable<T>`                                      | Tabela genérica responsiva — renderiza uma versão em `<table>` para desktop e uma versão em cards empilhados para mobile a partir das mesmas colunas; suporta `loading`, `emptyMessage` (via `EmptyState`) e paginação embutida. |
| `Badge`                                             | Selo colorido (tons `amber`, `blue`, `emerald`, `slate`) usado por `ReceivableStatusBadge`.                                                                                                                                      |
| `EmptyState`                                        | Mensagem padrão de "nenhum registro encontrado", com suporte a ícone e descrição.                                                                                                                                                |
| `FormField`                                         | Envolve um input com `<label>` e mensagem de erro.                                                                                                                                                                               |
| `SelectField`                                       | Select padronizado com opção de placeholder "Carregando..." enquanto opções são buscadas.                                                                                                                                        |
| `TextInput`                                         | Input de texto com estilo padrão do design system.                                                                                                                                                                               |
| `MaskedInput` / `CurrencyInput` / `PercentageInput` | Inputs com máscara para documento (CPF/CNPJ), valores monetários e percentuais.                                                                                                                                                  |
| `ResultItem`                                        | Linha de par label/valor usada nos painéis de resultado de simulação.                                                                                                                                                            |

### Utilitários (`utils/formatters.ts`)

- `formatCurrency(value, currency)` — formata como moeda `pt-BR` usando `Intl.NumberFormat`.
- `formatDate(value)` — formata como `dd/mm/aaaa`.
- `formatPercent(value)` — formata com 2 casas decimais e símbolo `%`.
- `normalizeDocument(document)` — remove máscara de CPF/CNPJ antes de enviar ao backend.

---

## 10. Convenções de código observadas

- **Nomenclatura de hooks**: `use-*.ts`, sempre client-side (`"use client"` no topo).
- **Nomenclatura de serviços**: `*.service.ts`, funções nomeadas por ação (`getX`, `createX`, `updateX`, `syncX`).
- **Tipos por feature**: cada feature define seus próprios `Request`/`Response` em `types.ts`, evitando acoplamento entre módulos (ex.: `ReceivableResponse` é diferente de `PricingResponse`, mesmo compartilhando alguns campos).
- **Toda mutação passa por toast** (`sonner`) de sucesso/erro, dando feedback imediato ao operador.
- **Todo dado paginado** segue o formato `PageResponse<T>` (`content` + `page.{number,size,totalElements,totalPages}`).
- Pequenas inconsistências de nomenclatura de pastas já mapeadas acima (`hook/` vs `hooks/`, `page/` vs `pages/`, `acitions/` — typo de "actions") não afetam o funcionamento, mas vale padronizar em uma próxima limpeza técnica.

---

## 11. Como rodar localmente

```bash
npm install
cp .env.example .env.local   # ajuste NEXT_PUBLIC_API_URL se necessário
npm run dev
```

Acesse `http://localhost:3000`. A API backend (Spring Boot) deve estar disponível na URL configurada em `NEXT_PUBLIC_API_URL` (padrão `http://localhost:8080`).

---

## 12. Resumo das rotas de navegação

| Rota                        | Componente                  | Descrição                                              |
| --------------------------- | --------------------------- | ------------------------------------------------------ |
| `/`                         | `Home`                      | Dashboard com atalhos                                  |
| `/pricing`                  | `PricingSimulationForm`     | Simulador avulso de precificação                       |
| `/receivables`              | `PendingReceivables`        | Lista de recebíveis pendentes + ação de liquidar       |
| `/receivables/create`       | `CreateRecebiveisForm`      | Cadastro unitário com simulação em tempo real          |
| `/receivables/create/batch` | `CreateBatchReceivableForm` | Cadastro em lote (até 20 itens) com simulação por item |
| `/currencies`               | `CurrenciesPage`            | CRUD (criar/editar/listar) de moedas                   |
| `/settlements`              | `SettlementList`            | Extrato paginado e filtrável de liquidações            |
| `/exchange-rates`           | `ExchangeRateList`          | CRUD de cotações + sincronização com provedor externo  |

# Issue #1 — Configurar estrutura do monorepo e infraestrutura base

## Data: 2025-05-29
## Branch: feat/setup-monorepo
## Status: Em desenvolvimento

---

## Contexto

Primeira issue do projeto MenteMX Pro. Configuração da estrutura base do monorepo
com workspaces npm para suportar 3 apps (mobile, backend, desktop) e 1 pacote
compartilhado (core).

## Decisões Técnicas

1. **Monorepo com npm workspaces** — escolhido por simplicidade e compatibilidade nativa
2. **Estrutura apps/ + packages/** — separação clara entre aplicações e lógica compartilhada
3. **TypeScript strict** em todos os pacotes
4. **Vitest + fast-check** como framework de testes (PBT)
5. **@mentemx/core** — pacote compartilhado para lógica de negócio (analytics, format, licensing)

## Estrutura Criada

```
src/MenteMX-Pro-App/
├── package.json              # Raiz do monorepo (workspaces)
├── .gitignore
├── .eslintrc.json
├── apps/
│   ├── backend/              # Node.js + Express API
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── .env.example
│   │   └── src/index.ts      # Health check endpoint
│   ├── mobile/               # React Native + Expo
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── app.json
│   │   └── app/index.tsx     # Tela inicial
│   └── desktop/              # Electron (placeholder)
│       ├── package.json
│       └── src/.gitkeep
├── packages/
│   └── core/                 # Lógica compartilhada
│       ├── package.json
│       ├── tsconfig.json
│       ├── vitest.config.ts
│       └── src/
│           ├── index.ts
│           ├── format.ts     # Formatação de tempos
│           └── __tests__/
│               └── format.test.ts
└── docs/
    └── prompts/              # Registro de prompts por issue
```

## Testes

- `packages/core/src/__tests__/format.test.ts` — testes unitários para formatação de tempo

## Próximos Passos

- Issue #2: Configurar SQLite + Drizzle ORM no mobile
- Issue #3: Configurar PostgreSQL no backend

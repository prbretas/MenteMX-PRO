# Issue #3 — Configurar banco de dados PostgreSQL no backend

## Data: 2025-05-29
## Branch: chore/setup-postgres-schema
## Status: Em desenvolvimento

---

## Contexto

Configuração do PostgreSQL no backend com Drizzle ORM, espelhando o schema
do mobile (SQLite) com tipos nativos do PostgreSQL.

## Decisões Técnicas

1. **pg (node-postgres)** — Driver PostgreSQL para Node.js
2. **drizzle-orm/pg-core** — Schema tipado com tipos nativos PG
3. **UUID nativo** — PostgreSQL suporta uuid como tipo, com defaultRandom()
4. **Timestamps nativos** — Usando tipo timestamp do PG (vs TEXT no SQLite)
5. **Enums nativos** — pgEnum para event_type, terrain_type, op_type
6. **Pool de conexões** — max 10, idle timeout 30s

## Diferenças SQLite vs PostgreSQL

| Aspecto | SQLite (mobile) | PostgreSQL (backend) |
|---------|-----------------|---------------------|
| IDs | TEXT (uuid gerado no client) | uuid com defaultRandom() |
| Timestamps | TEXT (ISO 8601) | timestamp nativo |
| Booleans | INTEGER (0/1) | boolean nativo |
| Enums | TEXT com CHECK | pgEnum nativo |

## Arquivos Criados

- `apps/backend/src/db/schema.ts` — Schema PostgreSQL com 9 entidades
- `apps/backend/src/db/index.ts` — Pool de conexões + inicialização
- `apps/backend/drizzle.config.ts` — Configuração do Drizzle Kit

## Testes

- Backend: 1 teste passando (health check)
- Core: 8 testes passando (format)

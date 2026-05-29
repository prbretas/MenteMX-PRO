# Issue #2 — Configurar banco de dados local (SQLite + Drizzle ORM)

## Data: 2025-05-29
## Branch: chore/setup-sqlite-schema
## Status: Em desenvolvimento

---

## Contexto

Configuração do banco de dados local SQLite com Drizzle ORM no app mobile.
Schema completo com as 9 entidades do sistema conforme definido no design.md.

## Decisões Técnicas

1. **expo-sqlite** — Driver nativo para SQLite no Expo
2. **drizzle-orm** — ORM type-safe com suporte a SQLite
3. **Timestamps como TEXT** — ISO 8601 strings (SQLite não tem tipo DATE nativo)
4. **UUIDs como TEXT** — Gerados no cliente para suporte offline
5. **pending_operation.payload como TEXT** — JSON stringified para flexibilidade

## Entidades Criadas

1. `pilot` — Perfil do piloto (auth + streak)
2. `bike` — Motos do piloto
3. `event` — Corridas e treinos
4. `session` — Sessões de treino/corrida
5. `lap` — Voltas individuais
6. `setup` — Configurações de suspensão e pneus
7. `mx_score_history` — Histórico do MX Score
8. `streak_milestone` — Marcos de streak (7, 30, 100 dias)
9. `pending_operation` — Fila de sincronização offline

## Arquivos Criados

- `apps/mobile/src/db/schema.ts` — Schema Drizzle com todas as 9 entidades
- `apps/mobile/src/db/index.ts` — Inicialização do banco
- `apps/mobile/src/db/migrations/0000_initial_schema.sql` — Migration SQL
- `apps/mobile/drizzle.config.ts` — Configuração do Drizzle Kit

## Índices

- Criados índices para FKs mais consultadas (pilot_id, session_id, etc.)
- Índice em pending_operation.synced para queries de sync

## Próximos Passos

- Issue #3: Configurar PostgreSQL no backend (schema espelhado)
- Issue #4: Implementar autenticação

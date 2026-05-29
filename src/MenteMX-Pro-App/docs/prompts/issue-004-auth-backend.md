# Issue #4 — Implementar autenticação e cadastro de Piloto (backend)

## Data: 2025-05-29
## Branch: feat/auth-backend
## Status: Em desenvolvimento

---

## Contexto

Implementação dos endpoints de autenticação (register/login) e perfil do piloto
no backend, com validação Zod, hash bcrypt e JWT.

## Endpoints Criados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /auth/register | Cadastro de piloto |
| POST | /auth/login | Login com email/senha |
| GET | /pilots/:id | Perfil do piloto (autenticado) |
| PUT | /pilots/:id | Atualizar nome (autenticado) |

## Decisões Técnicas

1. **bcrypt** — Hash de senha com 10 salt rounds
2. **jsonwebtoken** — JWT com expiração configurável (default 7d)
3. **Zod** — Validação de input (register/login schemas)
4. **Middleware auth** — Extrai pilotId do Bearer token
5. **Autorização** — Piloto só acessa seu próprio perfil

## Arquivos Criados

- `src/auth/auth.schema.ts` — Schemas Zod (register, login)
- `src/auth/auth.service.ts` — Lógica de negócio (register, login, verifyToken)
- `src/auth/auth.middleware.ts` — Middleware JWT
- `src/auth/auth.routes.ts` — Rotas Express
- `src/__tests__/auth.test.ts` — 7 testes de validação de schema

## Testes

- 8 testes passando (1 health + 7 auth schema validation)

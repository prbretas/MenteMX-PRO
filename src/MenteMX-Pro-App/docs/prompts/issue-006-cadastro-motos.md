# Issue #6 — Implementar cadastro e gestão de Motos

## Data: 2025-05-29
## Branch: feat/cadastro-motos
## Status: Em desenvolvimento

---

## Contexto

CRUD completo de motos no backend com validação Zod e autenticação JWT.

## Endpoints Criados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /pilots/:id/bikes | Lista motos do piloto |
| POST | /pilots/:id/bikes | Cadastra nova moto |
| PUT | /pilots/:pilotId/bikes/:bikeId | Atualiza moto |
| DELETE | /pilots/:pilotId/bikes/:bikeId | Remove moto |

## Validações

- brand: string não vazia
- model: string não vazia
- year: inteiro entre 1990 e 2030
- displacementCc: inteiro entre 50 e 500

## Testes

- 16 testes passando (1 health + 7 auth + 8 bikes)

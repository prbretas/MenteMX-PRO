# 🏁 MenteMX Pro

> Plataforma de inteligência esportiva e programa mental para pilotos e atletas do mundo offroad. Dados criam campeões.

---

## Sobre

O **MenteMX Pro** é o app do Mente MX — um programa mental para pilotos e atletas de mundo offroad. A plataforma transforma a percepção subjetiva do piloto em dados analíticos estruturados, permitindo evolução técnica e mental baseada em métricas reais de performance, consistência e setup de moto.

O sistema opera em modelo **Local-First** — dados registrados offline, sincronizados quando há sinal. A interface segue o padrão **Modo Luva** — botões grandes, alto contraste e comandos simplificados para uso rápido entre baterias.

---

## Funcionalidades (MVP)

| Módulo | Descrição |
|---|---|
| 📊 Analytics | Consistência por sessão, MX Score (0–1000) e Gráfico de Radar 360° |
| 🔧 Setup Técnico | Log de suspensão (cliques), pneus e notas por tipo de terreno |
| 🏆 Eventos | Cadastro de corridas e treinos com histórico e métricas consolidadas |
| 📶 Sincronização | Local-First com fila offline e sync automático ao reconectar |
| 🔥 Gamificação | Streaks de treino com marcos em 7, 30 e 100 dias |
| 📄 Relatórios | Exportação PDF para compartilhar com equipe ou patrocinadores |

---

## Stack

- **Mobile:** React Native + Expo
- **Banco local:** SQLite + Drizzle ORM
- **Backend:** Node.js + Express
- **Banco servidor:** PostgreSQL
- **Geração de PDF:** PDFKit (server-side)
- **Testes:** Vitest + fast-check (Property-Based Testing)

---

## Estrutura do projeto

```
MXPilotPRO/
├── apps/
│   ├── mobile/          # React Native / Expo
│   └── backend/         # Node.js / Express
├── packages/
│   └── core/            # Lógica de negócio compartilhada (analytics, streak, formatação)
├── docs/
│   ├── product.md       # Visão do produto e roadmap
│   ├── meeting-notes.md # Atas de reunião
│   └── backlog.md       # Backlog de épicos e stories
├── .kiro/
│   └── specs/
│       └── mentemx-pro/ # Spec completo: requirements, design e tasks
└── scripts/             # Scripts de automação de issues e PRs
```

---

## Fluxo de desenvolvimento

Este projeto usa **GitHub Flow** com branches por funcionalidade.

```
main  ←── Pull Request ←── feat/nome-da-feature
                       ←── fix/nome-do-bug
                       ←── docs/nome-da-doc
                       ←── chore/nome-da-tarefa
```

### Regras

- `main` é protegida — nenhum commit direto
- Cada branch deve ter uma **Issue** associada
- Sempre abrir **Pull Request** para merge em `main`
- Apagar a branch após o merge
- Usar **Conventional Commits** (ver [CONTRIBUTING.md](./CONTRIBUTING.md))

### Nomenclatura de branches

| Tipo | Padrão | Exemplo |
|---|---|---|
| Nova funcionalidade | `feat/<nome>` | `feat/cadastro-piloto` |
| Correção de bug | `fix/<nome>` | `fix/sync-conflito` |
| Documentação | `docs/<nome>` | `docs/contributing` |
| Manutenção | `chore/<nome>` | `chore/setup-monorepo` |

---

## Roadmap

| Fase | Período | Foco |
|---|---|---|
| 🏗️ Fase 1 — Fundação | Dias 1–30 | Monorepo, autenticação, registro de voltas, sincronização |
| 🧠 Fase 2 — Inteligência | Dias 31–60 | Consistência, MX Score, Radar, Setup Técnico |
| 🎯 Fase 3 — Retenção | Dias 61–90 | Streaks, exportação PDF, Modo Luva |

---

## Spec

O spec completo do projeto está em `.kiro/specs/mentemx-pro/`:

- [`requirements.md`](.kiro/specs/mentemx-pro/requirements.md) — 11 requisitos com user stories e critérios de aceitação
- [`design.md`](.kiro/specs/mentemx-pro/design.md) — Arquitetura, modelos de dados, algoritmos e 21 propriedades de correção
- [`tasks.md`](.kiro/specs/mentemx-pro/tasks.md) — Plano de implementação em 3 fases com 47 tarefas

---

## Contribuindo

Leia o [CONTRIBUTING.md](./CONTRIBUTING.md) antes de começar.

---

## Licença

MIT

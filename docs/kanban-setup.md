# 📋 Quadro Kanban — MenteMX Pro

## Visão Geral

O projeto utiliza um quadro Kanban com 9 etapas (ver [CONTRIBUTING.md](../CONTRIBUTING.md)) e 17 issues organizadas em 3 fases.

---

## Labels do Projeto

### Prioridade
| Label | Cor | Descrição |
|---|---|---|
| `priority: critical` | 🔴 | Bloqueante — deve ser feito primeiro |
| `priority: high` | 🟠 | Alta prioridade — essencial para o MVP |
| `priority: medium` | 🟡 | Média prioridade — importante mas não bloqueante |
| `priority: low` | 🟢 | Baixa prioridade — nice to have |

### Fase
| Label | Cor | Descrição |
|---|---|---|
| `fase: 1-fundacao` | 🔵 | Fase 1 — Fundação (Dias 1–30) |
| `fase: 2-inteligencia` | 🟣 | Fase 2 — Inteligência (Dias 31–60) |
| `fase: 3-retencao` | 🩵 | Fase 3 — Retenção (Dias 61–90) |

### Tipo
| Label | Descrição |
|---|---|
| `type: feature` | Nova funcionalidade |
| `type: infra` | Infraestrutura e configuração |
| `type: test` | Testes (property-based ou unit) |
| `type: checkpoint` | Checkpoint de validação |

### Módulo
| Label | Descrição |
|---|---|
| `module: auth` | Autenticação e cadastro |
| `module: analytics` | Analytics (Consistência, MX Score, Radar) |
| `module: sync` | Sincronização Local-First |
| `module: setup` | Setup Técnico |
| `module: events` | Módulo de Eventos |
| `module: gamification` | Gamificação (Streaks) |
| `module: reports` | Relatórios PDF |
| `module: ui` | Interface Modo Luva |

### Dependência
| Label | Descrição |
|---|---|
| `blocked` | Bloqueada por outra issue |
| `blocking` | Esta issue bloqueia outras |

### Status (Kanban)
| Label | Etapa |
|---|---|
| `status: em-refinamento` | Em refinamento |
| `status: refinado` | Refinada e pronta |
| `status: comprometido` | Dev comprometido |
| `status: em-desenvolvimento` | Em desenvolvimento |
| `status: desenvolvimento-ok` | Código pronto |
| `status: code-review` | PR em revisão |
| `status: testes` | Validação final |

---

## Mapa de Dependências

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FASE 1 — FUNDAÇÃO (Dias 1–30)                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Task 1] Estrutura do projeto                                      │
│      │                                                              │
│      ├── [Task 1.1] Workspaces ──┐                                  │
│      ├── [Task 1.2] SQLite ──────┤                                  │
│      └── [Task 1.3] PostgreSQL ──┘                                  │
│                                  │                                  │
│                                  ▼                                  │
│                        [Task 2] Autenticação                        │
│                                  │                                  │
│                                  ▼                                  │
│                        [Task 3] Motos ──────────────────┐           │
│                                  │                      │           │
│                    ┌─────────────┼──────────┐           │           │
│                    ▼             ▼          ▼           │           │
│           [Task 5] Sessões  [Task 4]   (→ Fase 2)      │           │
│                    │        Checkpoint                   │           │
│              ┌─────┼─────┐                              │           │
│              ▼     ▼     ▼                              │           │
│      [Task 6]  [Task 7]  (→ Fase 2)                    │           │
│       Sync     Eventos                                  │           │
│              │     │                                    │           │
│              └──┬──┘                                    │           │
│                 ▼                                       │           │
│           [Task 8] Checkpoint Fase 1                    │           │
│                                                         │           │
├─────────────────────────────────────────────────────────────────────┤
│                  FASE 2 — INTELIGÊNCIA (Dias 31–60)                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                         │           │
│  [Task 9] Consistência ◄── Task 5                       │           │
│      │                                                  │           │
│      ▼                                                  │           │
│  [Task 10] MX Score ◄── Task 9 + Task 6                │           │
│      │                                                  │           │
│      ▼                                                  │           │
│  [Task 11] Radar ◄── Task 10 + Task 9                  │           │
│      │                                                  │           │
│      │    [Task 12] Setup ◄── Task 3 ──────────────────┘           │
│      │        │                                                     │
│      └────┬───┘                                                     │
│           ▼                                                         │
│     [Task 13] Checkpoint Fase 2                                     │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                    FASE 3 — RETENÇÃO (Dias 61–90)                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Task 14] Streaks ◄── Task 5 + Task 6                             │
│                                                                     │
│  [Task 15] Relatórios PDF ◄── Task 10 + Task 11 + Task 9           │
│                                                                     │
│  [Task 16] Modo Luva ◄── Task 5 + Task 11                          │
│                                                                     │
│           ┌───────┬───────┬───────┐                                 │
│           ▼       ▼       ▼       ▼                                 │
│     [Task 17] Checkpoint Final                                      │
│     ◄── Task 13 + Task 14 + Task 15 + Task 16                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Tabela de Dependências

| Task | Título | Depende de | Bloqueia |
|---|---|---|---|
| 1 | Estrutura do projeto | — | 1.1, 1.2, 1.3 |
| 1.1 | Workspaces | — | 1.2, 1.3 |
| 1.2 | SQLite + Drizzle | 1.1 | 2 |
| 1.3 | PostgreSQL + Drizzle | 1.1 | 2 |
| 2 | Autenticação | 1.2, 1.3 | 3 |
| 3 | Motos | 2 | 4, 5, 12 |
| 4 | Checkpoint auth | 2, 3 | — |
| 5 | Sessões e Voltas | 3 | 6, 7, 8, 9, 14, 16 |
| 6 | Sincronização | 5 | 8, 10, 14 |
| 7 | Eventos | 5 | 8 |
| 8 | Checkpoint Fase 1 | 5, 6, 7 | — |
| 9 | Consistência | 5 | 10, 11, 13, 15 |
| 10 | MX Score | 9, 6 | 11, 13, 15 |
| 11 | Radar | 10, 9 | 13, 15, 16 |
| 12 | Setup Técnico | 3 | 13 |
| 13 | Checkpoint Fase 2 | 9, 10, 11, 12 | 17 |
| 14 | Streaks | 5, 6 | 17 |
| 15 | Relatórios PDF | 10, 11, 9 | 17 |
| 16 | Modo Luva | 5, 11 | 17 |
| 17 | Checkpoint Final | 13, 14, 15, 16 | — |

---

## Como Executar

```powershell
# 1. Criar as labels no repositório
.\scripts\create_labels.ps1

# 2. Criar todas as issues com labels e dependências
.\scripts\create_kanban_issues.ps1
```

---

## Prioridades por Fase

### Fase 1 — Critical Path
1. Task 1 → Task 2 → Task 3 → Task 5 → Task 6 (caminho crítico)
2. Task 7 (paralelo com Task 6 após Task 5)

### Fase 2 — Analytics Core
1. Task 9 → Task 10 → Task 11 (cadeia de analytics)
2. Task 12 (paralelo, depende apenas de Task 3)

### Fase 3 — Engagement
1. Task 14, 15, 16 (podem ser paralelas entre si)
2. Task 17 (checkpoint final, depende de todas)

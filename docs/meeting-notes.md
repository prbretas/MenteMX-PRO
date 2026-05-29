# Ata de Reunião — MenteMX Pro

---

## Reunião 1 — Kick-off do Produto

**Data:** 15 de maio de 2026
**Participantes:** Philippe Bretas (Product Owner / Dev)
**Objetivo:** Definir visão, escopo do MVP e estrutura do projeto

---

### Funcionalidades discutidas

- **Módulo Analytics (coração do produto)**
  - Cálculo de Consistência baseado em desvio padrão das voltas
  - MX Score: pontuação proprietária de 0 a 1000 com 4 fatores ponderados (melhor tempo 40%, consistência 30%, frequência 20%, evolução 10%)
  - Gráfico de Radar com 5 dimensões: Performance, Consistência, Mental, Físico e Setup

- **Módulo de Setup Técnico**
  - Log de cliques de suspensão dianteira e traseira (compressão e retorno)
  - Gestão de pressão de pneus e tipo de pneu por tipo de terreno (barro, areia, misto)
  - Notas de texto livre por setup

- **Módulo de Eventos**
  - Cadastro de corridas e treinos com pista/local
  - Registro de Holeshot e posição final em corridas
  - Histórico cronológico com resumo consolidado de sessões

- **Sincronização Local-First**
  - App funciona 100% offline; dados sincronizados automaticamente quando há sinal
  - Estratégia Last-Write-Wins (LWW) por timestamp para resolução de conflitos

- **Gamificação**
  - Streaks de dias consecutivos com treino registrado
  - Marcos em 7, 30 e 100 dias com notificação de conquista

- **Exportação de Relatórios**
  - PDF com MX Score, Gráfico de Radar, histórico de sessões e evolução de consistência
  - Compartilhamento via apps nativos (WhatsApp, e-mail, etc.)

---

### Regras de negócio definidas

- Consistência requer mínimo de 3 voltas por sessão; abaixo disso exibe mensagem explicativa
- Volta com tempo inferior a 10 segundos exige confirmação antes de salvar (prevenção de erro)
- MX Score considera apenas sessões dos últimos 30 dias; sem sessões = score 0
- Setup sem tipo de terreno não pode ser salvo
- Streak é zerado se o piloto não registrar nenhuma sessão em um dia corrido
- Relatório não é gerado se o período selecionado não contiver sessões
- Interface segue padrão **Modo Luva**: botões mínimo 56dp, contraste WCAG 2.1 AA (4.5:1), máximo 3 ações primárias por tela

---

### Stack técnica decidida

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Mobile | React Native + Expo | Cross-platform iOS/Android, suporte nativo a SQLite |
| Banco local | SQLite + Drizzle ORM | Offline-first, queries tipadas |
| Backend | Node.js + Express | JSON nativo, escalável |
| Banco servidor | PostgreSQL | Maturidade, suporte a JSON |
| PDF | PDFKit (server-side) | Sem binários nativos no mobile |
| Testes PBT | fast-check + Vitest | TypeScript nativo, shrinking automático |

---

### Estrutura de branches definida

O projeto adota o modelo **GitHub Flow** com branches por funcionalidade:

- `main` — branch principal, sempre estável, protegida
- `feat/<nome>` — nova funcionalidade (ex: `feat/cadastro-piloto`)
- `fix/<nome>` — correção de bug (ex: `fix/sync-conflito`)
- `docs/<nome>` — documentação (ex: `docs/contributing`)
- `chore/<nome>` — manutenção, configuração (ex: `chore/setup-monorepo`)

Cada branch deve ter uma Issue associada. Nenhum código vai direto para `main` — sempre via Pull Request com revisão.

---

### Roadmap de desenvolvimento (3 fases)

| Fase | Período | Foco |
|---|---|---|
| Fase 1 — Fundação | Dias 1–30 | Monorepo, autenticação, cadastro de piloto/moto, registro de voltas, sincronização offline, módulo de eventos |
| Fase 2 — Inteligência | Dias 31–60 | Consistência, MX Score, Gráfico de Radar, Setup Técnico |
| Fase 3 — Retenção | Dias 61–90 | Streaks, exportação PDF, smoke tests Modo Luva |

---

### Decisões e próximos passos

- [x] Spec completo criado (requirements.md, design.md, tasks.md) em `.kiro/specs/mxpilot-pro/`
- [x] Repositório criado no GitHub com primeiro commit
- [ ] Criar Issues no GitHub para cada épico do tasks.md
- [ ] Iniciar Fase 1: configurar monorepo e estrutura base (branch `chore/setup-monorepo`)
- [ ] Cada funcionalidade será desenvolvida em branch separada conforme fluxo definido

---

### Observações

- O projeto não terá implementação imediata; a estrutura e documentação são a prioridade desta sessão
- Toda nova funcionalidade deve referenciar o requisito correspondente do requirements.md
- Os 21 property tests com `fast-check` são opcionais para MVP rápido, mas recomendados para garantir correção dos algoritmos de cálculo
- O design.md contém o grafo de dependências de tarefas com 13 waves de execução paralela

#!/usr/bin/env pwsh
# Script para criar Issues do projeto MenteMX Pro no GitHub
# Cada issue inclui: descrição, labels de prioridade, fase, tipo, módulo e dependências

$repo = "prbretas/MXPilotPRO"

Write-Host "🚀 Criando issues do projeto MenteMX Pro..." -ForegroundColor Cyan
Write-Host "   Repositório: $repo" -ForegroundColor Gray
Write-Host ""

# ═══════════════════════════════════════════════════════════════
# FASE 1 — FUNDAÇÃO (Dias 1–30)
# ═══════════════════════════════════════════════════════════════

# --- TASK 1: Estrutura do Projeto ---

Write-Host "📦 Fase 1 - Fundação..." -ForegroundColor Blue

$body = @"
## Descrição
Criar a estrutura base do monorepo com workspaces e configurar toda a infraestrutura de desenvolvimento.

## Sub-tarefas
- [ ] Criar monorepo com workspaces: ``apps/mobile`` (Expo) e ``apps/backend`` (Node.js/Express)
- [ ] Configurar TypeScript estrito em ambos os workspaces
- [ ] Configurar Vitest + ``@fast-check/vitest`` no workspace de testes compartilhado (``packages/core``)
- [ ] Criar ``vitest.config.ts`` com ``globals: true`` e ``environment: 'node'``
- [ ] Configurar ESLint + Prettier com regras compartilhadas

## Critérios de Aceite
- Monorepo funcional com 3 workspaces (mobile, backend, core)
- TypeScript compilando sem erros em todos os workspaces
- Vitest rodando com fast-check configurado
- ESLint + Prettier aplicando regras compartilhadas

## Dependências
Nenhuma — esta é a primeira tarefa do projeto.

## Requirements
Transversal (base para todos os requisitos)
"@

gh issue create --repo $repo --title "Task 1: Configurar estrutura do projeto e infraestrutura base" --body $body --label "priority: critical","fase: 1-fundacao","type: infra","blocking"

# --- TASK 1.1 ---

$body = @"
## Descrição
Criar a estrutura de diretórios do monorepo e configurar os workspaces TypeScript.

## Sub-tarefas
- [ ] Criar ``apps/mobile``, ``apps/backend``, ``packages/core`` (lógica de negócio compartilhada)
- [ ] Configurar ``tsconfig.json`` base e por workspace
- [ ] Configurar package.json com workspaces

## Critérios de Aceite
- Diretórios criados e acessíveis
- TypeScript compilando em cada workspace independentemente
- Imports entre workspaces funcionando

## Dependências
Nenhuma — sub-tarefa inicial.

## Requirements
Transversal
"@

gh issue create --repo $repo --title "Task 1.1: Criar estrutura de diretórios e configurar workspaces" --body $body --label "priority: critical","fase: 1-fundacao","type: infra","blocking"

# --- TASK 1.2 ---

$body = @"
## Descrição
Configurar o banco de dados local SQLite com Drizzle ORM no workspace mobile.

## Sub-tarefas
- [ ] Instalar ``expo-sqlite`` e ``drizzle-orm`` no workspace mobile
- [ ] Criar schema Drizzle para as 9 entidades: pilot, bike, event, session, lap, setup, mx_score_history, streak_milestone, pending_operation
- [ ] Gerar e aplicar migrations iniciais

## Critérios de Aceite
- Schema criado com todas as 9 entidades
- Migrations geradas e aplicáveis
- Queries básicas (INSERT/SELECT) funcionando no SQLite

## Dependências
- Depende de: Task 1.1 (estrutura de diretórios)

## Requirements
1, 2, 3, 7, 8, 10
"@

gh issue create --repo $repo --title "Task 1.2: Configurar banco de dados local (SQLite + Drizzle ORM)" --body $body --label "priority: critical","fase: 1-fundacao","type: infra","blocking"

# --- TASK 1.3 ---

$body = @"
## Descrição
Configurar o banco de dados PostgreSQL com Drizzle ORM no workspace backend.

## Sub-tarefas
- [ ] Instalar ``drizzle-orm`` + ``pg`` no workspace backend
- [ ] Criar schema espelhando as mesmas 9 entidades do mobile
- [ ] Configurar conexão com pool e variáveis de ambiente

## Critérios de Aceite
- Schema PostgreSQL criado com todas as 9 entidades
- Conexão com pool funcionando
- Variáveis de ambiente configuradas (.env.example)

## Dependências
- Depende de: Task 1.1 (estrutura de diretórios)

## Requirements
1, 3
"@

gh issue create --repo $repo --title "Task 1.3: Configurar banco de dados PostgreSQL e ORM no backend" --body $body --label "priority: critical","fase: 1-fundacao","type: infra","blocking"

# --- TASK 2 ---

$body = @"
## Descrição
Implementar o sistema completo de autenticação e cadastro de piloto, incluindo backend (endpoints REST) e frontend (telas mobile).

## Sub-tarefas
- [ ] Criar endpoint ``POST /auth/register`` com validação de e-mail único e hash de senha (bcrypt)
- [ ] Criar endpoint ``POST /auth/login`` com geração de JWT
- [ ] Criar endpoints ``GET /pilots/:id`` e ``PUT /pilots/:id``
- [ ] Implementar telas RegisterScreen e LoginScreen no mobile com validação de formulário
- [ ] Aplicar padrão Modo Luva: botões >= 56dp, alto contraste, máximo 3 ações primárias

## Critérios de Aceite
- Cadastro com validação de e-mail duplicado
- Login com JWT funcional
- Telas mobile com validação de campos
- Interface seguindo padrão Modo Luva

## Dependências
- Depende de: Task 1.2 (SQLite), Task 1.3 (PostgreSQL)

## Requirements
1.1, 1.2, 1.3, 1.4, 1.7, 9.1, 9.2, 9.3
"@

gh issue create --repo $repo --title "Task 2: Implementar autenticação e cadastro de Piloto" --body $body --label "priority: critical","fase: 1-fundacao","type: feature","module: auth","blocking"

# --- TASK 3 ---

$body = @"
## Descrição
Implementar o cadastro e gestão de motos associadas ao piloto.

## Sub-tarefas
- [ ] Criar endpoints ``GET /pilots/:id/bikes`` e ``POST /pilots/:id/bikes``
- [ ] Implementar BikeRepository no SQLite local com operações CRUD
- [ ] Criar tela ProfileScreen com formulário de cadastro/edição de Moto
- [ ] Escrever property test para round-trip de cadastro de Moto (Property 1)

## Critérios de Aceite
- CRUD completo de motos (backend + mobile)
- Validação de campos obrigatórios: marca, modelo, ano, cilindrada
- Property test passando (round-trip)

## Dependências
- Depende de: Task 2 (autenticação — precisa do piloto cadastrado)

## Requirements
1.5, 1.6, 1.7
"@

gh issue create --repo $repo --title "Task 3: Implementar cadastro e gestão de Motos" --body $body --label "priority: high","fase: 1-fundacao","type: feature","module: auth"

# --- TASK 4 ---

$body = @"
## Descrição
Checkpoint de validação da Fase 1 — Fundação de autenticação e perfil.

## Checklist
- [ ] Todos os testes passam (unit + property)
- [ ] Endpoints de auth respondem corretamente (register, login)
- [ ] Endpoints de bikes respondem corretamente (CRUD)
- [ ] Schema SQLite migrado e funcional
- [ ] Schema PostgreSQL migrado e funcional

## Dependências
- Depende de: Task 2 (auth), Task 3 (motos)

## Requirements
Validação transversal dos requisitos 1.x
"@

gh issue create --repo $repo --title "Task 4: Checkpoint — Fundação de autenticação e perfil" --body $body --label "priority: medium","fase: 1-fundacao","type: checkpoint"

# --- TASK 5 ---

$body = @"
## Descrição
Implementar o registro de sessões e voltas com interface Modo Luva, incluindo exibição em tempo real e cálculo de resumo.

## Sub-tarefas
- [ ] Criar SessionRepository e LapRepository no SQLite local
- [ ] Implementar SessionScreen com registro de volta em no máximo 2 toques
- [ ] Exibir em tempo real: última volta, melhor tempo e delta em relação ao melhor
- [ ] Manter tela ativa (wake lock) durante sessão ativa
- [ ] Implementar alerta de confirmação para voltas < 10 segundos
- [ ] Permitir edição/exclusão de volta antes de encerrar sessão
- [ ] Implementar função formatLapTime(ms): formato MM:SS.d
- [ ] Implementar cálculo de melhor tempo e resumo de sessão
- [ ] Escrever property tests (Properties 2, 3, 4, 5)

## Critérios de Aceite
- Registro de volta em <= 2 toques
- Persistência local imediata (offline)
- Formato MM:SS.d correto
- Melhor tempo = mínimo da lista
- Resumo completo ao encerrar sessão (>= 3 voltas)
- Todos os property tests passando

## Dependências
- Depende de: Task 3 (motos — precisa selecionar moto para sessão)

## Requirements
2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 9.1, 9.4, 9.5
"@

gh issue create --repo $repo --title "Task 5: Implementar registro de Sessão e Voltas (Modo Luva)" --body $body --label "priority: critical","fase: 1-fundacao","type: feature","module: analytics","blocking"

# --- TASK 6 ---

$body = @"
## Descrição
Implementar o sistema de sincronização Local-First com fila de operações pendentes e resolução de conflitos LWW.

## Sub-tarefas
- [ ] Implementar syncService com enqueue, flush e getStatus
- [ ] Criar endpoint ``POST /sync/batch`` no backend
- [ ] Detectar mudanças de conectividade e disparar flush automático
- [ ] Exibir indicadores visuais: Offline / Sincronizando / Sincronizado / Erro
- [ ] Implementar backoff exponencial (1s, 2s, 4s, 8s, max 5min) para falhas
- [ ] Escrever property tests (Properties 6, 7)

## Critérios de Aceite
- Dados registrados offline são sincronizados ao reconectar
- Conflitos resolvidos por LWW (timestamp mais recente vence)
- Indicadores visuais de estado de sync funcionando
- Backoff exponencial implementado
- Property tests passando

## Dependências
- Depende de: Task 5 (sessões/voltas — precisa de dados para sincronizar)

## Requirements
3.1, 3.2, 3.3, 3.4, 3.5, 3.6
"@

gh issue create --repo $repo --title "Task 6: Implementar sincronização Local-First (fila pending_ops)" --body $body --label "priority: critical","fase: 1-fundacao","type: feature","module: sync","blocking"

# --- TASK 7 ---

$body = @"
## Descrição
Implementar o módulo de eventos (corridas e treinos) com cadastro, histórico e resumo consolidado.

## Sub-tarefas
- [ ] Criar EventRepository no SQLite e endpoints ``GET/POST /pilots/:id/events``
- [ ] Criar EventsScreen com formulário de cadastro (nome, data, tipo, pista)
- [ ] Exibir campos adicionais para corrida: posição de largada, holeshot, posição final
- [ ] Exibir histórico em ordem cronológica decrescente
- [ ] Marcar eventos futuros como "Agendado"
- [ ] Escrever property tests (Properties 15, 16)

## Critérios de Aceite
- CRUD de eventos funcional
- Campos adicionais para corrida exibidos condicionalmente
- Histórico ordenado por data decrescente
- Eventos futuros marcados como "Agendado"
- Property tests passando

## Dependências
- Depende de: Task 5 (sessões — eventos contêm sessões)

## Requirements
8.1, 8.2, 8.3, 8.4, 8.5, 8.6
"@

gh issue create --repo $repo --title "Task 7: Implementar Módulo de Eventos" --body $body --label "priority: high","fase: 1-fundacao","type: feature","module: events"

# --- TASK 8 ---

$body = @"
## Descrição
Checkpoint de validação — Fundação completa (fim da Fase 1).

## Checklist
- [ ] Todos os testes passam (unit + property + integration)
- [ ] Sincronização funciona offline → online
- [ ] Eventos são listados corretamente
- [ ] Sessões e voltas registram e calculam resumo
- [ ] Interface Modo Luva aplicada nas telas implementadas

## Dependências
- Depende de: Task 5 (sessões), Task 6 (sync), Task 7 (eventos)

## Requirements
Validação transversal de todos os requisitos da Fase 1
"@

gh issue create --repo $repo --title "Task 8: Checkpoint — Fundação completa" --body $body --label "priority: medium","fase: 1-fundacao","type: checkpoint"

# ═══════════════════════════════════════════════════════════════
# FASE 2 — INTELIGÊNCIA (Dias 31–60)
# ═══════════════════════════════════════════════════════════════

Write-Host "🧠 Fase 2 - Inteligência..." -ForegroundColor Magenta

# --- TASK 9 ---

$body = @"
## Descrição
Implementar o cálculo do Índice de Consistência baseado no Coeficiente de Variação (CV) normalizado.

## Sub-tarefas
- [ ] Implementar ``calculateConsistency(lapTimes: number[]): number | null`` em ``packages/core/src/analytics/consistency.ts``
- [ ] Usar CV normalizado: ``max(0, 100 × (1 - CV × k))``
- [ ] Retornar null para listas com menos de 3 voltas (nunca lançar exceção)
- [ ] Garantir retorno de 100 quando σ = 0 (todas as voltas iguais)
- [ ] Exibir índice no resumo da sessão e no histórico
- [ ] Escrever property test (Property 8)

## Critérios de Aceite
- Resultado sempre em [0, 100] para >= 3 voltas
- Retorna null para < 3 voltas
- Retorna 100 para voltas idênticas (invariante)
- Property test passando

## Dependências
- Depende de: Task 5 (sessões — precisa dos tempos de volta)

## Requirements
4.1, 4.2, 4.3, 4.4, 4.5, 4.6
"@

gh issue create --repo $repo --title "Task 9: Implementar cálculo de Índice de Consistência" --body $body --label "priority: critical","fase: 2-inteligencia","type: feature","module: analytics","blocking"

# --- TASK 10 ---

$body = @"
## Descrição
Implementar o cálculo do MX Score — pontuação proprietária de 0 a 1000 baseada em 4 fatores ponderados.

## Sub-tarefas
- [ ] Implementar ``calculateMXScore(sessions: Session[], referenceDate: Date): number``
- [ ] Calcular os 4 fatores: melhor tempo (40%), consistência (30%), frequência (20%), evolução (10%)
- [ ] Aplicar ``clamp(round(raw × 1000), 0, 1000)``
- [ ] Retornar 0 para lista vazia de sessões
- [ ] Recalcular automaticamente após sincronização de nova sessão
- [ ] Persistir histórico em mx_score_history
- [ ] Escrever property tests (Properties 9, 10, 11)

## Critérios de Aceite
- MX Score sempre inteiro em [0, 1000]
- Retorna 0 para lista vazia
- Cálculo determinístico (mesmos dados = mesmo resultado)
- Ponderação correta dos 4 fatores
- Recálculo automático pós-sync
- Property tests passando

## Dependências
- Depende de: Task 9 (consistência — é um dos fatores do MX Score), Task 6 (sync — recálculo pós-sync)

## Requirements
5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7
"@

gh issue create --repo $repo --title "Task 10: Implementar cálculo do MX Score" --body $body --label "priority: critical","fase: 2-inteligencia","type: feature","module: analytics","blocking"

# --- TASK 11 ---

$body = @"
## Descrição
Implementar o Gráfico de Radar com 5 dimensões (Performance, Consistência, Mental, Físico, Setup).

## Sub-tarefas
- [ ] Implementar ``calculateRadarDimensions(pilotId: string): Promise<RadarData>``
- [ ] Calcular dimensões Performance, Consistência e Setup automaticamente
- [ ] Implementar registro manual das dimensões Mental e Físico (escala 1-10)
- [ ] Renderizar RadarChart com ``@salmonco/react-native-radar-chart`` na AnalyticsScreen
- [ ] Exibir dimensão com valor 0 quando dados insuficientes
- [ ] Escrever property tests (Properties 12, 13)

## Critérios de Aceite
- Todas as 5 dimensões em [0, 10]
- Valores Mental/Físico fora de [1, 10] rejeitados
- Gráfico SVG renderizando corretamente
- Dimensões sem dados exibem 0 com indicador visual
- Property tests passando

## Dependências
- Depende de: Task 10 (MX Score — usado na dimensão Performance), Task 9 (consistência — dimensão Consistência)

## Requirements
6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7
"@

gh issue create --repo $repo --title "Task 11: Implementar Gráfico de Radar (Visão 360°)" --body $body --label "priority: high","fase: 2-inteligencia","type: feature","module: analytics"

# --- TASK 12 ---

$body = @"
## Descrição
Implementar o módulo de Setup Técnico com registro de suspensão, pneus e notas por tipo de terreno.

## Sub-tarefas
- [ ] Criar SetupRepository no SQLite e endpoints ``GET /pilots/:id/setups``
- [ ] Criar SetupScreen com formulário de suspensão dianteira/traseira e pneus
- [ ] Validar tipo de terreno obrigatório; bloquear salvamento sem terreno
- [ ] Suportar consulta, edição, duplicação e notas de texto livre
- [ ] Escrever property test (Property 14)

## Critérios de Aceite
- CRUD completo de setups
- Terreno obrigatório (barro, areia, misto)
- Duplicação funcional
- Notas de texto livre
- Property test de round-trip passando

## Dependências
- Depende de: Task 3 (motos — setup é associado a uma moto)

## Requirements
7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8
"@

gh issue create --repo $repo --title "Task 12: Implementar Módulo de Setup Técnico" --body $body --label "priority: high","fase: 2-inteligencia","type: feature","module: setup"

# --- TASK 13 ---

$body = @"
## Descrição
Checkpoint de validação — Inteligência completa (fim da Fase 2).

## Checklist
- [ ] Todos os property tests de analytics passam
- [ ] MX Score calculado corretamente com 4 fatores
- [ ] Gráfico de Radar renderiza com 5 dimensões
- [ ] Setup persiste com round-trip correto
- [ ] Índice de Consistência funciona para >= 3 voltas

## Dependências
- Depende de: Task 9 (consistência), Task 10 (MX Score), Task 11 (radar), Task 12 (setup)

## Requirements
Validação transversal de todos os requisitos da Fase 2
"@

gh issue create --repo $repo --title "Task 13: Checkpoint — Inteligência completa" --body $body --label "priority: medium","fase: 2-inteligencia","type: checkpoint"

# ═══════════════════════════════════════════════════════════════
# FASE 3 — RETENÇÃO (Dias 61–90)
# ═══════════════════════════════════════════════════════════════

Write-Host "🎯 Fase 3 - Retenção..." -ForegroundColor Green

# --- TASK 14 ---

$body = @"
## Descrição
Implementar o sistema de gamificação com streaks de treino, marcos e notificações.

## Sub-tarefas
- [ ] Implementar streakService com getCurrentStreak, processEndOfDay e getRecord
- [ ] Criar job agendado no backend para processar fim de dia
- [ ] Exibir streak atual e recorde no ProfileScreen e HomeScreen
- [ ] Registrar marcos em streak_milestone (7, 30, 100 dias) de forma atômica
- [ ] Enviar notificação push de conquista e incentivo
- [ ] Escrever property tests (Properties 17, 18, 19, 20)

## Critérios de Aceite
- Streak incrementa corretamente (+1 por dia com sessão)
- Streak zera após dia sem sessão
- Marcos registrados atomicamente antes do reset
- Recorde histórico sempre >= streak atual
- Property tests passando

## Dependências
- Depende de: Task 5 (sessões — streak conta dias com sessão), Task 6 (sync — dados sincronizados)

## Requirements
10.1, 10.2, 10.3, 10.4, 10.5, 10.6
"@

gh issue create --repo $repo --title "Task 14: Implementar Gamificação — Streaks de Treino" --body $body --label "priority: high","fase: 3-retencao","type: feature","module: gamification"

# --- TASK 15 ---

$body = @"
## Descrição
Implementar a exportação de relatórios em PDF com MX Score, Radar, histórico e evolução.

## Sub-tarefas
- [ ] Criar endpoint ``POST /pilots/:id/reports`` com PDFKit no backend
- [ ] Incluir no PDF: MX Score, Gráfico de Radar, histórico de sessões, melhor tempo, evolução de Consistência, logotipo e data
- [ ] Implementar ReportScreen com seleção de período (7d, 30d, 90d, personalizado)
- [ ] Disponibilizar PDF para compartilhamento via Share API nativa
- [ ] Exibir mensagem de erro quando período não contém sessões
- [ ] Escrever property test (Property 21)

## Critérios de Aceite
- PDF gerado com todos os 7 elementos obrigatórios
- Seleção de período funcional
- Compartilhamento via Share API
- Mensagem de erro para período sem dados
- Property test passando

## Dependências
- Depende de: Task 10 (MX Score), Task 11 (Radar), Task 9 (consistência)

## Requirements
11.1, 11.2, 11.3, 11.4, 11.5, 11.6
"@

gh issue create --repo $repo --title "Task 15: Implementar Exportação de Relatórios PDF" --body $body --label "priority: high","fase: 3-retencao","type: feature","module: reports"

# --- TASK 16 ---

$body = @"
## Descrição
Validar e implementar a interface Modo Luva em todas as telas, incluindo tema escuro automático.

## Sub-tarefas
- [ ] Verificar altura mínima de 56dp em todos os botões de ação primária
- [ ] Verificar razão de contraste >= 4.5:1 (WCAG 2.1 AA)
- [ ] Verificar máximo de 3 ações primárias por tela
- [ ] Implementar tema escuro automático quando SO usa modo escuro
- [ ] Criar testes de snapshot para componentes Modo Luva

## Critérios de Aceite
- Todos os botões primários >= 56dp
- Contraste >= 4.5:1 em todas as combinações de cor
- Máximo 3 ações primárias por tela
- Tema escuro aplicado automaticamente
- Testes de snapshot passando

## Dependências
- Depende de: Task 5 (sessões — tela principal), Task 11 (radar — tela analytics)

## Requirements
9.1, 9.2, 9.3, 9.4, 9.5, 9.6
"@

gh issue create --repo $repo --title "Task 16: Implementar interface Modo Luva — validação e smoke tests" --body $body --label "priority: medium","fase: 3-retencao","type: feature","module: ui"

# --- TASK 17 ---

$body = @"
## Descrição
Checkpoint final — Garantir que todos os testes passam e o MVP está completo.

## Checklist
- [ ] Executar suite completa de testes (property tests + unit + integration)
- [ ] Verificar cobertura de todos os 11 requisitos
- [ ] Verificar que todas as 21 propriedades de correção estão testadas
- [ ] Validar fluxo completo: cadastro → sessão → sync → analytics → relatório
- [ ] Validar gamificação (streak incrementa, zera, registra marcos)
- [ ] Validar Modo Luva em todas as telas

## Dependências
- Depende de: Task 13 (checkpoint fase 2), Task 14 (streaks), Task 15 (relatórios), Task 16 (modo luva)

## Requirements
Validação final de todos os 11 requisitos do MVP
"@

gh issue create --repo $repo --title "Task 17: Checkpoint final — MVP completo" --body $body --label "priority: medium","fase: 3-retencao","type: checkpoint"

Write-Host ""
Write-Host "✅ Todas as 17 issues foram criadas com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Resumo de dependências:" -ForegroundColor Yellow
Write-Host "   Task 1 (infra) → sem dependências" -ForegroundColor Gray
Write-Host "   Task 1.1, 1.2, 1.3 → sem dependências (wave 0)" -ForegroundColor Gray
Write-Host "   Task 2 (auth) → depende de 1.2, 1.3" -ForegroundColor Gray
Write-Host "   Task 3 (motos) → depende de 2" -ForegroundColor Gray
Write-Host "   Task 4 (checkpoint) → depende de 2, 3" -ForegroundColor Gray
Write-Host "   Task 5 (sessões) → depende de 3" -ForegroundColor Gray
Write-Host "   Task 6 (sync) → depende de 5" -ForegroundColor Gray
Write-Host "   Task 7 (eventos) → depende de 5" -ForegroundColor Gray
Write-Host "   Task 8 (checkpoint) → depende de 5, 6, 7" -ForegroundColor Gray
Write-Host "   Task 9 (consistência) → depende de 5" -ForegroundColor Gray
Write-Host "   Task 10 (MX Score) → depende de 9, 6" -ForegroundColor Gray
Write-Host "   Task 11 (radar) → depende de 10, 9" -ForegroundColor Gray
Write-Host "   Task 12 (setup) → depende de 3" -ForegroundColor Gray
Write-Host "   Task 13 (checkpoint) → depende de 9, 10, 11, 12" -ForegroundColor Gray
Write-Host "   Task 14 (streaks) → depende de 5, 6" -ForegroundColor Gray
Write-Host "   Task 15 (relatórios) → depende de 10, 11, 9" -ForegroundColor Gray
Write-Host "   Task 16 (modo luva) → depende de 5, 11" -ForegroundColor Gray
Write-Host "   Task 17 (checkpoint final) → depende de 13, 14, 15, 16" -ForegroundColor Gray

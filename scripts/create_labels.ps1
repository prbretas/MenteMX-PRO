#!/usr/bin/env pwsh
# Script para criar labels no repositório GitHub
# Projeto: MenteMX Pro (antigo MXPilot Pro)

$repo = "prbretas/MXPilotPRO"

Write-Host "🏷️  Criando labels de prioridade..." -ForegroundColor Cyan

# Labels de Prioridade
gh label create "priority: critical" --color "B60205" --description "Bloqueante - deve ser feito primeiro" --repo $repo --force
gh label create "priority: high" --color "D93F0B" --description "Alta prioridade - essencial para o MVP" --repo $repo --force
gh label create "priority: medium" --color "FBCA04" --description "Média prioridade - importante mas não bloqueante" --repo $repo --force
gh label create "priority: low" --color "0E8A16" --description "Baixa prioridade - nice to have" --repo $repo --force

Write-Host "🏷️  Criando labels de fase..." -ForegroundColor Cyan

# Labels de Fase
gh label create "fase: 1-fundacao" --color "1D76DB" --description "Fase 1 - Fundação (Dias 1-30)" --repo $repo --force
gh label create "fase: 2-inteligencia" --color "5319E7" --description "Fase 2 - Inteligência (Dias 31-60)" --repo $repo --force
gh label create "fase: 3-retencao" --color "006B75" --description "Fase 3 - Retenção (Dias 61-90)" --repo $repo --force

Write-Host "🏷️  Criando labels de tipo..." -ForegroundColor Cyan

# Labels de Tipo
gh label create "type: feature" --color "A2EEEF" --description "Nova funcionalidade" --repo $repo --force
gh label create "type: infra" --color "D4C5F9" --description "Infraestrutura e configuração" --repo $repo --force
gh label create "type: test" --color "BFD4F2" --description "Testes (property-based ou unit)" --repo $repo --force
gh label create "type: checkpoint" --color "F9D0C4" --description "Checkpoint de validação" --repo $repo --force

Write-Host "🏷️  Criando labels de módulo..." -ForegroundColor Cyan

# Labels de Módulo
gh label create "module: auth" --color "C2E0C6" --description "Autenticação e cadastro" --repo $repo --force
gh label create "module: analytics" --color "C2E0C6" --description "Analytics (Consistência, MX Score, Radar)" --repo $repo --force
gh label create "module: sync" --color "C2E0C6" --description "Sincronização Local-First" --repo $repo --force
gh label create "module: setup" --color "C2E0C6" --description "Setup Técnico" --repo $repo --force
gh label create "module: events" --color "C2E0C6" --description "Módulo de Eventos" --repo $repo --force
gh label create "module: gamification" --color "C2E0C6" --description "Gamificação (Streaks)" --repo $repo --force
gh label create "module: reports" --color "C2E0C6" --description "Relatórios PDF" --repo $repo --force
gh label create "module: ui" --color "C2E0C6" --description "Interface Modo Luva" --repo $repo --force

Write-Host "🏷️  Criando labels de status do Kanban..." -ForegroundColor Cyan

# Labels de Status (Kanban)
gh label create "status: em-refinamento" --color "EDEDED" --description "Issue em refinamento" --repo $repo --force
gh label create "status: refinado" --color "EDEDED" --description "Issue refinada e pronta" --repo $repo --force
gh label create "status: comprometido" --color "EDEDED" --description "Dev comprometido com a issue" --repo $repo --force
gh label create "status: em-desenvolvimento" --color "EDEDED" --description "Em desenvolvimento ativo" --repo $repo --force
gh label create "status: desenvolvimento-ok" --color "EDEDED" --description "Código pronto, auto-revisão feita" --repo $repo --force
gh label create "status: code-review" --color "EDEDED" --description "PR aberto, aguardando revisão" --repo $repo --force
gh label create "status: testes" --color "EDEDED" --description "Validação final antes do merge" --repo $repo --force

Write-Host "🏷️  Criando labels de dependência..." -ForegroundColor Cyan

# Labels de Dependência (para indicar bloqueios)
gh label create "blocked" --color "B60205" --description "Bloqueada por outra issue" --repo $repo --force
gh label create "blocking" --color "D93F0B" --description "Esta issue bloqueia outras" --repo $repo --force

Write-Host "`n✅ Todas as labels foram criadas com sucesso!" -ForegroundColor Green

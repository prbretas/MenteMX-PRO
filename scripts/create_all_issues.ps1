$repo = "prbretas/MXPilotPRO"

$issues = @(
    @{
        title = "[FASE 1] Implementar telas de autenticacao no mobile (Modo Luva)"
        labels = "fase-1-fundacao,mobile"
        body = @"
## Objetivo
Implementar as telas de cadastro e login no app mobile seguindo o padrao Modo Luva.

## Tarefas
- [ ] Criar RegisterScreen com React Hook Form
- [ ] Criar LoginScreen com React Hook Form
- [ ] Exibir mensagens de erro descritivas por campo invalido
- [ ] Redirecionar para HomeScreen apos cadastro/login bem-sucedido
- [ ] Aplicar padrao Modo Luva: botoes >= 56dp, alto contraste, maximo 3 acoes primarias

## Branch
feat/auth-mobile

## Referencias
- Spec: tasks.md - Tarefa 2.2
- Requirements: 1.2, 1.3, 1.4, 9.1, 9.2, 9.3
"@
    },
    @{
        title = "[FASE 1] Property test: round-trip de cadastro de Moto"
        labels = "fase-1-fundacao,test"
        body = @"
## Objetivo
Escrever property test com fast-check para garantir que o round-trip de cadastro de moto preserva todos os dados.

## Tarefas
- [ ] Criar arquivo packages/core/src/__tests__/bike.property.test.ts
- [ ] Arbitrario: fc.record({ brand, model, year: fc.integer({min:1990,max:2030}), displacement: fc.integer({min:50,max:500}) })
- [ ] Apos cadastro bem-sucedido, consultar lista deve retornar moto com dados identicos

## Branch
test/property-bike-roundtrip

## Referencias
- Spec: tasks.md - Tarefa 3.2 (opcional)
- Design: Property 1
- Requirements: 1.6
"@
    },
    @{
        title = "[FASE 1] Implementar registro de Sessao e Voltas (Modo Luva)"
        labels = "fase-1-fundacao,mobile"
        body = @"
## Objetivo
Implementar a tela de sessao ativa com registro de voltas em no maximo 2 toques, exibicao em tempo real e wake lock.

## Tarefas
- [ ] Implementar LapRepository e SessionRepository no SQLite
- [ ] INSERT imediato de volta com lap_time_ms, session_id, lap_number
- [ ] Suporte a soft-delete (is_deleted) e edicao de volta
- [ ] Implementar SessionScreen com registro em no maximo 2 toques
- [ ] Exibir em tempo real: ultima volta, melhor tempo e delta
- [ ] Manter tela ativa (wake lock) durante sessao ativa
- [ ] Alerta de confirmacao para voltas < 10 segundos

## Branch
feat/registro-sessao-voltas

## Referencias
- Spec: tasks.md - Tarefas 5, 5.1
- Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 9.1, 9.4, 9.5
"@
    },
    @{
        title = "[FASE 1] Implementar formatacao de tempo de volta (MM:SS.d)"
        labels = "fase-1-fundacao,analytics"
        body = @"
## Objetivo
Implementar a funcao de formatacao de tempo de volta em milissegundos para o formato MM:SS.d.

## Tarefas
- [ ] Criar packages/core/src/utils/formatTime.ts
- [ ] Implementar formatLapTime(ms: number): string
- [ ] Converter milissegundos para formato MM:SS.d

## Branch
feat/format-lap-time

## Referencias
- Spec: tasks.md - Tarefa 5.3
- Requirements: 2.3
"@
    },
    @{
        title = "[FASE 1] Property tests: persistencia de Volta e formato MM:SS.d"
        labels = "fase-1-fundacao,test"
        body = @"
## Objetivo
Escrever property tests para garantir persistencia local imediata de volta e formato correto de tempo.

## Tarefas
- [ ] Property 2: persistencia local imediata - fc.integer({min:10000,max:300000})
- [ ] Property 3: formato MM:SS.d - fc.integer({min:0,max:5999900}) -> regex /^\d{2}:\d{2}\.\d$/
- [ ] Property 4: melhor tempo = minimo da lista
- [ ] Property 5: completude do resumo de sessao

## Branch
test/property-lap-session

## Referencias
- Spec: tasks.md - Tarefas 5.2, 5.4, 5.6, 5.8 (opcionais)
- Design: Properties 2, 3, 4, 5
- Requirements: 2.2, 2.3, 2.4, 2.5
"@
    },
    @{
        title = "[FASE 1] Implementar encerramento de Sessao e calculo do resumo"
        labels = "fase-1-fundacao,analytics,mobile"
        body = @"
## Objetivo
Implementar o encerramento de sessao com calculo automatico do resumo (voltas, melhor tempo, media, consistencia).

## Tarefas
- [ ] Calcular: contagem de voltas, melhor tempo, tempo medio e indice de Consistencia
- [ ] Exibir 'Consistencia indisponivel - minimo de 3 voltas necessario' quando < 3 voltas
- [ ] Exibir resumo na tela apos encerrar sessao

## Branch
feat/encerramento-sessao

## Referencias
- Spec: tasks.md - Tarefa 5.7
- Requirements: 2.5, 4.4
"@
    },
    @{
        title = "[FASE 1] Implementar sincronizacao Local-First (fila pending_ops)"
        labels = "fase-1-fundacao,backend,mobile"
        body = @"
## Objetivo
Implementar o servico de sincronizacao offline/online com fila de operacoes pendentes e backoff exponencial.

## Tarefas
- [ ] Implementar PendingOperationRepository no SQLite
- [ ] Implementar syncService.enqueue() - INSERT em pending_operation
- [ ] Implementar syncService.flush() - envio em lote ao servidor
- [ ] Criar endpoint POST /sync/batch no backend
- [ ] Marcar ops como synced=true apos confirmacao 200 OK
- [ ] Backoff exponencial: 1s, 2s, 4s, 8s, max 5min
- [ ] Detectar mudancas de conectividade e disparar flush automatico
- [ ] Indicadores visuais: Offline / Sincronizando / Sincronizado / Erro

## Branch
feat/sincronizacao-local-first

## Referencias
- Spec: tasks.md - Tarefas 6, 6.1, 6.2
- Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
"@
    },
    @{
        title = "[FASE 1] Property tests: resolucao de conflito LWW e integridade de sync"
        labels = "fase-1-fundacao,test"
        body = @"
## Objetivo
Escrever property tests para garantir a corretude da sincronizacao e resolucao de conflitos.

## Tarefas
- [ ] Property 6: LWW - dois registros com mesmo ID, resultado deve ter updated_at mais recente
- [ ] Property 7: integridade - apos flush, todas as ops devem ter synced=true

## Branch
test/property-sync

## Referencias
- Spec: tasks.md - Tarefas 6.3, 6.4 (opcionais)
- Design: Properties 6, 7
- Requirements: 3.5, 3.6
"@
    },
    @{
        title = "[FASE 1] Implementar Modulo de Eventos"
        labels = "fase-1-fundacao,backend,mobile"
        body = @"
## Objetivo
Implementar o modulo de eventos (corridas e treinos) com historico cronologico e resumo consolidado.

## Tarefas
- [ ] Implementar EventRepository com CRUD e ORDER BY event_date DESC
- [ ] Criar endpoints GET/POST /pilots/:id/events no backend
- [ ] Criar EventsScreen com formulario de cadastro (nome, data, tipo, pista)
- [ ] Campos adicionais para corrida: posicao de largada, holeshot, posicao final
- [ ] Marcar eventos futuros como 'Agendado'
- [ ] Calcular resumo consolidado de sessoes associadas

## Branch
feat/modulo-eventos

## Referencias
- Spec: tasks.md - Tarefas 7, 7.1
- Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6
"@
    },
    @{
        title = "[FASE 1] Property tests: ordenacao e agregacao de Eventos"
        labels = "fase-1-fundacao,test"
        body = @"
## Objetivo
Escrever property tests para garantir ordenacao cronologica e agregacao correta do resumo de eventos.

## Tarefas
- [ ] Property 15: ordenacao decrescente por event_date
- [ ] Property 16: bestTime = min dos melhores tempos, avgConsistency = media das consistencias

## Branch
test/property-eventos

## Referencias
- Spec: tasks.md - Tarefas 7.2, 7.3 (opcionais)
- Design: Properties 15, 16
- Requirements: 8.4, 8.5
"@
    },
    @{
        title = "[FASE 1] Checkpoint: Fundacao completa"
        labels = "fase-1-fundacao,checkpoint"
        body = @"
## Objetivo
Validar que toda a Fase 1 esta funcionando corretamente antes de avancar para a Fase 2.

## Criterios de aceite
- [ ] Todos os testes passam (unit + property)
- [ ] Endpoints de auth e bikes respondem corretamente
- [ ] Schema SQLite migrado com as 9 entidades
- [ ] Sincronizacao offline->online funciona
- [ ] Eventos sao listados em ordem cronologica decrescente
- [ ] Registro de volta funciona em no maximo 2 toques

## Referencias
- Spec: tasks.md - Tarefas 4 e 8
"@
    },
    @{
        title = "[FASE 2] Implementar calculo do Indice de Consistencia"
        labels = "fase-2-inteligencia,analytics"
        body = @"
## Objetivo
Implementar a funcao calculateConsistency usando Coeficiente de Variacao normalizado.

## Tarefas
- [ ] Criar packages/core/src/analytics/consistency.ts
- [ ] Implementar calculateConsistency(lapTimes: number[]): number | null
- [ ] Usar CV normalizado: max(0, 100 x (1 - CV x k))
- [ ] Retornar null para < 3 voltas (nunca lancar excecao)
- [ ] Garantir retorno de 100 quando desvio padrao = 0
- [ ] Exibir indice no resumo da sessao e no historico

## Branch
feat/calculo-consistencia

## Referencias
- Spec: tasks.md - Tarefas 9, 9.1
- Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
"@
    },
    @{
        title = "[FASE 2] Property test: Indice de Consistencia (range e invariante)"
        labels = "fase-2-inteligencia,test"
        body = @"
## Objetivo
Escrever property test para garantir que o indice de consistencia esta sempre em [0,100] e que voltas identicas retornam 100.

## Tarefas
- [ ] Property 8a: fc.array(fc.integer({min:10000,max:300000}), {minLength:3}) -> resultado em [0,100]
- [ ] Property 8b: Array(n).fill(t) -> calculateConsistency = 100 (invariante de igualdade)
- [ ] Arquivo: packages/core/src/__tests__/consistency.property.test.ts

## Branch
test/property-consistencia

## Referencias
- Spec: tasks.md - Tarefa 9.2 (opcional)
- Design: Property 8
- Requirements: 4.1, 4.2, 4.5
"@
    },
    @{
        title = "[FASE 2] Implementar calculo do MX Score"
        labels = "fase-2-inteligencia,analytics,backend"
        body = @"
## Objetivo
Implementar a funcao calculateMXScore com os 4 fatores ponderados e integracao com o backend.

## Tarefas
- [ ] Criar packages/core/src/analytics/mxScore.ts
- [ ] Implementar os 4 fatores: bestTimeFactor (40%), consistencyFactor (30%), frequencyFactor (20%), evolutionFactor (10%)
- [ ] Cada fator normalizado para [0,1]; aceitar fatores negativos antes do clamp
- [ ] Aplicar clamp(round(raw x 1000), 0, 1000)
- [ ] Retornar 0 para lista vazia de sessoes
- [ ] Integrar recalculo automatico apos syncService.flush()
- [ ] Persistir historico em mx_score_history
- [ ] Exibir MX Score na HomeScreen

## Branch
feat/calculo-mx-score

## Referencias
- Spec: tasks.md - Tarefas 10, 10.1, 10.5
- Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7
"@
    },
    @{
        title = "[FASE 2] Property tests: MX Score (bounds, determinismo, ponderacao)"
        labels = "fase-2-inteligencia,test"
        body = @"
## Objetivo
Escrever property tests para garantir corretude do calculo do MX Score.

## Tarefas
- [ ] Property 9: resultado sempre em [0,1000] incluindo array vazio
- [ ] Property 10: determinismo - mesmos dados = mesmo resultado
- [ ] Property 11: ponderacao correta 40/30/20/10 equivalente a implementacao de referencia

## Branch
test/property-mx-score

## Referencias
- Spec: tasks.md - Tarefas 10.2, 10.3, 10.4 (opcionais)
- Design: Properties 9, 10, 11
- Requirements: 5.1, 5.2, 5.7
"@
    },
    @{
        title = "[FASE 2] Implementar Grafico de Radar (Visao 360 graus)"
        labels = "fase-2-inteligencia,analytics,mobile,backend"
        body = @"
## Objetivo
Implementar o calculo das 5 dimensoes do Radar e renderizar o grafico na AnalyticsScreen.

## Tarefas
- [ ] Implementar calculateRadarDimensions(pilotId) em analyticsService
- [ ] Dimensao Performance: MX_Score / 1000 x 10
- [ ] Dimensao Consistencia: media das ultimas 5 sessoes / 10
- [ ] Dimensao Setup: formula composta com frequencia de registros e delta de tempo
- [ ] Formulario pos-sessao para registro manual de Mental e Fisico (escala 1-10)
- [ ] Validar e rejeitar valores fora de [1,10]
- [ ] Renderizar RadarChart com @salmonco/react-native-radar-chart na AnalyticsScreen
- [ ] Exibir dimensao com valor 0 e indicador visual quando dados insuficientes
- [ ] Integrar com endpoint GET /pilots/:id/analytics

## Branch
feat/grafico-radar

## Referencias
- Spec: tasks.md - Tarefas 11, 11.1, 11.2, 11.5
- Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7
"@
    },
    @{
        title = "[FASE 2] Property tests: dimensoes do Radar e validacao Mental/Fisico"
        labels = "fase-2-inteligencia,test"
        body = @"
## Objetivo
Escrever property tests para garantir que as dimensoes do Radar estao em [0,10] e que inputs invalidos sao rejeitados.

## Tarefas
- [ ] Property 12: todas as 5 dimensoes em [0,10] para qualquer entrada valida
- [ ] Property 13: valores fora de [1,10] rejeitados; valores em [1,10] aceitos e persistidos

## Branch
test/property-radar

## Referencias
- Spec: tasks.md - Tarefas 11.3, 11.4 (opcionais)
- Design: Properties 12, 13
- Requirements: 6.2, 6.3, 6.4, 6.5
"@
    },
    @{
        title = "[FASE 2] Implementar Modulo de Setup Tecnico"
        labels = "fase-2-inteligencia,mobile,backend"
        body = @"
## Objetivo
Implementar o modulo de setup tecnico com log de suspensao, pneus e notas por tipo de terreno.

## Tarefas
- [ ] Implementar SetupRepository com CRUD completo no SQLite
- [ ] Validar terrain obrigatorio antes de persistir
- [ ] Criar endpoints GET /pilots/:id/setups no backend
- [ ] Criar SetupScreen com formulario de suspensao dianteira/traseira e pneus
- [ ] Botao 'Duplicar Setup' que cria copia com novo ID
- [ ] Campo de notas de texto livre

## Branch
feat/modulo-setup-tecnico

## Referencias
- Spec: tasks.md - Tarefas 12, 12.1, 12.3
- Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8
"@
    },
    @{
        title = "[FASE 2] Property test: round-trip de Setup tecnico"
        labels = "fase-2-inteligencia,test"
        body = @"
## Objetivo
Escrever property test para garantir que o round-trip de setup preserva todos os campos.

## Tarefas
- [ ] Arbitrario: fc.record({ terrain: fc.constantFrom('mud','sand','mixed'), frontCompression, frontRebound, rearCompression, rearRebound, rearLinkHeight, frontTirePressure, rearTirePressure, tireBrandModel })
- [ ] Apos salvar, consultar por ID deve retornar objeto com todos os campos preservados

## Branch
test/property-setup

## Referencias
- Spec: tasks.md - Tarefa 12.2 (opcional)
- Design: Property 14
- Requirements: 7.5
"@
    },
    @{
        title = "[FASE 2] Checkpoint: Inteligencia completa"
        labels = "fase-2-inteligencia,checkpoint"
        body = @"
## Objetivo
Validar que toda a Fase 2 esta funcionando corretamente antes de avancar para a Fase 3.

## Criterios de aceite
- [ ] Todos os property tests de analytics passam
- [ ] MX Score calculado corretamente com os 4 fatores
- [ ] Grafico de Radar renderiza com as 5 dimensoes
- [ ] Setup persiste com round-trip correto
- [ ] Indice de Consistencia exibido no resumo da sessao

## Referencias
- Spec: tasks.md - Tarefa 13
"@
    },
    @{
        title = "[FASE 3] Implementar Gamificacao - Streaks de Treino"
        labels = "fase-3-retencao,backend,mobile"
        body = @"
## Objetivo
Implementar o sistema de streaks de treino com marcos, notificacoes e exibicao no perfil.

## Tarefas
- [ ] Implementar streakService.getCurrentStreak() - sequencia de dias consecutivos
- [ ] Implementar logica de incremento: sessao em dia sem sessao previa -> streak + 1
- [ ] Implementar streakService.processEndOfDay() com reset e registro de marcos
- [ ] Registrar marcos em streak_milestone (7, 30, 100 dias) de forma atomica
- [ ] Implementar streakService.getRecord() - manter record_streak no perfil
- [ ] Criar job agendado no backend para processar fim de dia
- [ ] Exibir streak atual e recorde no ProfileScreen e HomeScreen
- [ ] Enviar notificacao push de conquista e incentivo

## Branch
feat/gamificacao-streaks

## Referencias
- Spec: tasks.md - Tarefas 14, 14.1, 14.4, 14.5
- Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6
"@
    },
    @{
        title = "[FASE 3] Property tests: streak (calculo, incremento, reset, recorde)"
        labels = "fase-3-retencao,test"
        body = @"
## Objetivo
Escrever property tests para garantir a corretude de todos os comportamentos do streak.

## Tarefas
- [ ] Property 17: calculo correto - fc.array(fc.boolean()) -> streak = comprimento da sequencia consecutiva mais recente
- [ ] Property 18: incremento unitario - streak atual n -> apos sessao = n+1
- [ ] Property 19: reset e preservacao de marcos - apos dia sem sessao: streak=0, marcos registrados antes
- [ ] Property 20: recorde invariante - record_streak >= streak_atual em qualquer ponto

## Branch
test/property-streak

## Referencias
- Spec: tasks.md - Tarefas 14.2, 14.3, 14.5, 14.6 (opcionais)
- Design: Properties 17, 18, 19, 20
- Requirements: 10.1, 10.3, 10.4, 10.5
"@
    },
    @{
        title = "[FASE 3] Implementar Exportacao de Relatorios PDF"
        labels = "fase-3-retencao,backend,mobile"
        body = @"
## Objetivo
Implementar a geracao de relatorios PDF no backend e a tela de exportacao no mobile.

## Tarefas
- [ ] Criar endpoint POST /pilots/:id/reports com PDFKit no backend
- [ ] Incluir no PDF: MX Score, Grafico de Radar, historico de sessoes, melhor tempo, evolucao de Consistencia, logotipo, data de geracao
- [ ] Retornar URL temporaria para download
- [ ] Implementar ReportScreen com selecao de periodo (7d, 30d, 90d, personalizado)
- [ ] Chamar reportService.generateReport() e abrir Share API nativa
- [ ] Exibir mensagem quando periodo nao contem sessoes

## Branch
feat/exportacao-pdf

## Referencias
- Spec: tasks.md - Tarefas 15, 15.1, 15.3
- Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6
"@
    },
    @{
        title = "[FASE 3] Property test: completude do relatorio PDF"
        labels = "fase-3-retencao,test"
        body = @"
## Objetivo
Escrever property test para garantir que o PDF gerado contem todos os 7 elementos obrigatorios.

## Tarefas
- [ ] Arbitrario: fc.record({ period, sessions: fc.array(sessionArbitrary, {minLength:1}) })
- [ ] PDF deve conter: MX Score, Radar, historico, melhor tempo, evolucao de Consistencia, logotipo, data

## Branch
test/property-relatorio-pdf

## Referencias
- Spec: tasks.md - Tarefa 15.2 (opcional)
- Design: Property 21
- Requirements: 11.2, 11.5
"@
    },
    @{
        title = "[FASE 3] Implementar interface Modo Luva - smoke tests e tema escuro"
        labels = "fase-3-retencao,mobile,test"
        body = @"
## Objetivo
Validar e implementar todos os requisitos de acessibilidade do Modo Luva com testes de smoke.

## Tarefas
- [ ] Criar testes de snapshot para botoes primarios verificando minHeight: 56
- [ ] Verificar que cada tela expoe no maximo 3 acoes primarias
- [ ] Usar useColorScheme() para aplicar tema escuro automaticamente
- [ ] Configurar paleta de cores com razao de contraste >= 4.5:1 (WCAG 2.1 AA)

## Branch
feat/modo-luva-smoke-tests

## Referencias
- Spec: tasks.md - Tarefas 16, 16.1, 16.2
- Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6
"@
    },
    @{
        title = "[FASE 3] Checkpoint final: todos os testes passam - MVP completo"
        labels = "fase-3-retencao,checkpoint"
        body = @"
## Objetivo
Validar que o MVP completo esta funcionando com todos os testes passando.

## Criterios de aceite
- [ ] Suite completa de testes passa (property tests + unit + integration)
- [ ] Todos os 11 requisitos cobertos
- [ ] Todas as 21 propriedades de correcao verificadas
- [ ] Interface Modo Luva validada (56dp, contraste 4.5:1, max 3 acoes)
- [ ] Sincronizacao offline->online funcionando
- [ ] Exportacao PDF funcionando com compartilhamento nativo

## Referencias
- Spec: tasks.md - Tarefa 17
"@
    }
)

foreach ($issue in $issues) {
    Write-Host "Criando issue: $($issue.title)"
    $result = gh issue create --repo $repo --title $issue.title --label $issue.labels --body $issue.body
    Write-Host $result
    Start-Sleep -Milliseconds 500
}

Write-Host "Todas as issues criadas com sucesso!"

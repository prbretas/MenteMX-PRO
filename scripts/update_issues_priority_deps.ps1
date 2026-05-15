# encoding: ascii
$repo = "prbretas/MXPilotPRO"

$issueData = @{
    1  = @{ priority = "prioridade: critica"; deps = "";                    reason = "Raiz absoluta do projeto. Sem o monorepo configurado nenhuma outra issue pode ser iniciada." }
    2  = @{ priority = "prioridade: critica"; deps = "Depende de #1";       reason = "O schema SQLite e a base de todos os repositorios locais. Bloqueia #10, #11, #13, #14, #16." }
    3  = @{ priority = "prioridade: critica"; deps = "Depende de #1";       reason = "O schema PostgreSQL e necessario para os endpoints de auth e sync. Bloqueia #4, #14." }
    4  = @{ priority = "prioridade: critica"; deps = "Depende de #1, #3";   reason = "Autenticacao e o portao de entrada do sistema. Sem JWT nenhum endpoint protegido funciona. Bloqueia #6, #8." }
    6  = @{ priority = "prioridade: alta";    deps = "Depende de #2, #4";   reason = "Cadastro de Moto depende do perfil do Piloto (auth) e do SQLite. Bloqueia #9, #10, #16, #25." }
    8  = @{ priority = "prioridade: alta";    deps = "Depende de #1, #4";   reason = "Telas de login/cadastro dependem do monorepo e do backend de auth. Bloqueia o uso real do app." }
    9  = @{ priority = "prioridade: media";   deps = "Depende de #6";       reason = "Property test de round-trip de Moto. Depende do BikeRepository (#6) estar implementado." }
    10 = @{ priority = "prioridade: critica"; deps = "Depende de #2, #6";   reason = "Registro de Voltas e o core do produto. Bloqueia #11, #12, #13, #19, #21." }
    11 = @{ priority = "prioridade: alta";    deps = "Depende de #10";      reason = "Formatacao de tempo e necessaria para exibir voltas corretamente." }
    12 = @{ priority = "prioridade: media";   deps = "Depende de #10, #11"; reason = "Property tests de persistencia e formato. Dependem de LapRepository e formatLapTime." }
    13 = @{ priority = "prioridade: alta";    deps = "Depende de #10";      reason = "Encerramento de Sessao com calculo de resumo. Bloqueia #19, #20." }
    14 = @{ priority = "prioridade: critica"; deps = "Depende de #2, #3";   reason = "Sincronizacao Local-First e pilar arquitetural do produto. Bloqueia #15, #21." }
    15 = @{ priority = "prioridade: media";   deps = "Depende de #14";      reason = "Property tests de sync. Dependem do syncService estar implementado." }
    16 = @{ priority = "prioridade: alta";    deps = "Depende de #2, #6, #10"; reason = "Modulo de Eventos depende de Motos, Sessoes e SQLite. Bloqueia #17." }
    17 = @{ priority = "prioridade: media";   deps = "Depende de #16";      reason = "Property tests de Eventos. Dependem do EventRepository estar implementado." }
    18 = @{ priority = "prioridade: alta";    deps = "Depende de #4, #6, #8, #10, #13, #14, #16"; reason = "Checkpoint da Fase 1. So pode ser validado quando todas as issues da Fase 1 estiverem concluidas." }
    19 = @{ priority = "prioridade: critica"; deps = "Depende de #13";      reason = "Calculo de Consistencia e base do MX Score e do Radar. Bloqueia #20, #21, #23." }
    20 = @{ priority = "prioridade: media";   deps = "Depende de #19";      reason = "Property test de Consistencia. Depende da funcao calculateConsistency." }
    21 = @{ priority = "prioridade: critica"; deps = "Depende de #14, #19"; reason = "MX Score e a metrica central do produto. Bloqueia #22, #23." }
    22 = @{ priority = "prioridade: media";   deps = "Depende de #21";      reason = "Property tests de MX Score. Dependem de calculateMXScore." }
    23 = @{ priority = "prioridade: alta";    deps = "Depende de #19, #21, #25"; reason = "Grafico de Radar depende de Consistencia, MX Score e Setup. Bloqueia #24." }
    24 = @{ priority = "prioridade: media";   deps = "Depende de #23";      reason = "Property tests do Radar. Dependem de calculateRadarDimensions." }
    25 = @{ priority = "prioridade: alta";    deps = "Depende de #2, #6";   reason = "Modulo de Setup depende do SQLite e das Motos. Bloqueia #23, #26." }
    26 = @{ priority = "prioridade: media";   deps = "Depende de #25";      reason = "Property test de Setup. Depende do SetupRepository." }
    27 = @{ priority = "prioridade: alta";    deps = "Depende de #19, #21, #23, #25"; reason = "Checkpoint da Fase 2. So pode ser validado quando Consistencia, MX Score, Radar e Setup estiverem prontos." }
    28 = @{ priority = "prioridade: alta";    deps = "Depende de #10, #14"; reason = "Streaks dependem de Sessoes e da sincronizacao para processar fim de dia no servidor." }
    29 = @{ priority = "prioridade: media";   deps = "Depende de #28";      reason = "Property tests de Streak. Dependem do streakService." }
    30 = @{ priority = "prioridade: alta";    deps = "Depende de #21, #23, #27"; reason = "Exportacao de PDF depende de MX Score, Radar e do checkpoint da Fase 2." }
    31 = @{ priority = "prioridade: media";   deps = "Depende de #30";      reason = "Property test de PDF. Depende do endpoint de relatorio." }
    32 = @{ priority = "prioridade: media";   deps = "Depende de #8, #10";  reason = "Smoke tests do Modo Luva dependem das telas de auth e sessao estarem implementadas." }
    33 = @{ priority = "prioridade: alta";    deps = "Depende de #28, #29, #30, #31, #32"; reason = "Checkpoint final do MVP. So pode ser validado quando toda a Fase 3 estiver concluida." }
}

foreach ($num in ($issueData.Keys | Sort-Object)) {
    $data = $issueData[$num]
    $priority = $data.priority
    $deps = $data.deps
    $reason = $data.reason

    Write-Host "Atualizando issue #$num..."

    # Adicionar label de prioridade
    gh issue edit $num --repo $repo --add-label $priority 2>&1 | Out-Null

    # Montar secao de dependencias
    if ($deps -eq "") {
        $depSection = "Nenhuma - pode ser iniciada imediatamente"
    } else {
        $depSection = $deps
    }

    # Nivel de prioridade em texto
    $prioText = switch ($priority) {
        "prioridade: critica" { "[CRITICA] Bloqueante - sem isso nada funciona" }
        "prioridade: alta"    { "[ALTA] Essencial para o MVP" }
        "prioridade: media"   { "[MEDIA] Importante mas nao bloqueante" }
        "prioridade: baixa"   { "[BAIXA] Opcional ou pode ser feito depois" }
    }

    $comment = "## Analise de Prioridade e Dependencias`n`n**Prioridade:** $prioText`n`n**Justificativa:** $reason`n`n**Dependencias:** $depSection`n`n---`n*Atualizado automaticamente pela analise do grafo de dependencias do projeto.*"

    gh issue comment $num --repo $repo --body $comment 2>&1 | Out-Null
    Write-Host "  OK - Issue #$num (prioridade: $priority)"
    Start-Sleep -Milliseconds 400
}

Write-Host ""
Write-Host "Todas as issues atualizadas!"

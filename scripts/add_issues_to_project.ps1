$projectId = "PVT_kwHOBSq_9c4BXwil"
$repo = "prbretas/MXPilotPRO"
$backlogOptionId = "b6d20368"
$statusFieldId = "PVTSSF_lAHOBSq_9c4BXwilzhS7PSo"

# Buscar todas as issues do repositorio
Write-Host "Buscando issues do repositorio..."
$issuesJson = gh issue list --repo $repo --state open --limit 50 --json number,id,title
$issues = $issuesJson | ConvertFrom-Json

Write-Host "Total de issues encontradas: $($issues.Count)"

foreach ($issue in $issues) {
    Write-Host "Adicionando issue #$($issue.number): $($issue.title)"
    
    # Adicionar issue ao projeto
    $addQuery = @{ query = "mutation { addProjectV2ItemById(input: { projectId: `"$projectId`" contentId: `"$($issue.id)`" }) { item { id } } }" } | ConvertTo-Json -Compress
    $addResult = $addQuery | gh api graphql --input - | ConvertFrom-Json
    $itemId = $addResult.data.addProjectV2ItemById.item.id
    
    Write-Host "  Item ID: $itemId"
    
    # Definir status como BACKLOG
    $statusQuery = @{ query = "mutation { updateProjectV2ItemFieldValue(input: { projectId: `"$projectId`" itemId: `"$itemId`" fieldId: `"$statusFieldId`" value: { singleSelectOptionId: `"$backlogOptionId`" } }) { projectV2Item { id } } }" } | ConvertTo-Json -Compress
    $statusResult = $statusQuery | gh api graphql --input -
    Write-Host "  Status definido como BACKLOG"
    
    Start-Sleep -Milliseconds 300
}

Write-Host ""
Write-Host "Todas as issues adicionadas ao projeto Kanban!"
Write-Host "Acesse: https://github.com/users/prbretas/projects/3"

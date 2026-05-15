$projectId = "PVT_kwHOBSq_9c4BXwil"

# Adicionar campo Prioridade (single select)
$q1 = @"
{"query":"mutation { addProjectV2Field(input: { projectId: \"$projectId\" dataType: SINGLE_SELECT name: \"Prioridade\" }) { projectV2Field { ... on ProjectV2SingleSelectField { id name } } } }"}
"@
Write-Host "Criando campo Prioridade..."
$r1 = $q1 | gh api graphql --input -
Write-Host $r1

# Adicionar campo Dependencias (texto)
$q2 = @"
{"query":"mutation { addProjectV2Field(input: { projectId: \"$projectId\" dataType: TEXT name: \"Dependencias\" }) { projectV2Field { ... on ProjectV2Field { id name } } } }"}
"@
Write-Host "Criando campo Dependencias..."
$r2 = $q2 | gh api graphql --input -
Write-Host $r2

$projectId = "PVT_kwHOBSq_9c4BXwil"
$fieldId = "PVTSSF_lAHOBSq_9c4BXwilzhS7PSo"

# Criar as colunas via GraphQL com query inline
$query = '{"query":"mutation { updateProjectV2Field(input: { projectId: \"' + $projectId + '\" fieldId: \"' + $fieldId + '\" singleSelectOptions: [ { name: \"BACKLOG\", color: GRAY, description: \"Issues identificadas\" } { name: \"EM REFINAMENTO\", color: BLUE, description: \"Issue sendo detalhada\" } { name: \"REFINADO\", color: PURPLE, description: \"Issue pronta para comprometer\" } { name: \"COMPROMETIDO\", color: YELLOW, description: \"Comprometido para sprint\" } { name: \"EM DESENVOLVIMENTO\", color: ORANGE, description: \"Desenvolvimento em andamento\" } { name: \"DESENVOLVIMENTO OK\", color: GREEN, description: \"Codigo pronto\" } { name: \"CODE REVIEW\", color: BLUE, description: \"Em revisao de codigo\" } { name: \"TESTES\", color: YELLOW, description: \"Em fase de testes\" } { name: \"DONE\", color: GREEN, description: \"Concluido\" } ] }) { projectV2Field { ... on ProjectV2SingleSelectField { id name options { id name } } } } }"}'

Write-Host "Enviando mutation..."
$result = $query | gh api graphql --input -
Write-Host $result

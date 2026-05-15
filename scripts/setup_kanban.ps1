$projectId = "PVT_kwHOBSq_9c4BXwil"
$repo = "prbretas/MXPilotPRO"

# Passo 1: Obter o ID do campo Status existente
Write-Host "Obtendo campo Status do projeto..."
$fieldsJson = gh project field-list 3 --owner prbretas --format json
$fields = $fieldsJson | ConvertFrom-Json
$statusField = $fields.fields | Where-Object { $_.name -eq "Status" }
Write-Host "Status field ID: $($statusField.id)"
Write-Host "Status field type: $($statusField.type)"

# Passo 2: Deletar opcoes existentes e criar as 9 colunas via GraphQL
# Primeiro vamos ver as opcoes atuais
Write-Host "Opcoes atuais do Status:"
$statusField.options | ForEach-Object { Write-Host "  - $($_.name) (id: $($_.id))" }

# Passo 3: Atualizar o campo Status com as 9 colunas via GraphQL
$mutation = @"
mutation {
  updateProjectV2Field(input: {
    projectId: "$projectId"
    fieldId: "$($statusField.id)"
    singleSelectOptions: [
      { name: "BACKLOG", color: GRAY, description: "Issues identificadas, ainda nao refinadas" }
      { name: "EM REFINAMENTO", color: BLUE, description: "Issue sendo detalhada e estimada" }
      { name: "REFINADO", color: PURPLE, description: "Issue detalhada e pronta para comprometer" }
      { name: "COMPROMETIDO", color: YELLOW, description: "Issue comprometida para a sprint atual" }
      { name: "EM DESENVOLVIMENTO", color: ORANGE, description: "Desenvolvimento em andamento" }
      { name: "DESENVOLVIMENTO OK", color: GREEN, description: "Codigo pronto, aguardando code review" }
      { name: "CODE REVIEW", color: BLUE, description: "Em revisao de codigo" }
      { name: "TESTES", color: YELLOW, description: "Em fase de testes" }
      { name: "DONE", color: GREEN, description: "Concluido e entregue" }
    ]
  }) {
    projectV2Field {
      ... on ProjectV2SingleSelectField {
        id
        name
        options {
          id
          name
        }
      }
    }
  }
}
"@

Write-Host "Atualizando colunas do Kanban..."
$result = $mutation | gh api graphql --input -
Write-Host $result

Write-Host "Colunas criadas com sucesso!"

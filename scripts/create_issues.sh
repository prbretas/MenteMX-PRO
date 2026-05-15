#!/bin/bash
# create_issues.sh — Cria épico e stories em lote via GitHub CLI
# Edite as variáveis abaixo com os dados do seu projeto

set -e

REPO=$(gh repo view --json nameWithOwner -q '.nameWithOwner')
echo "Criando issues em: $REPO"

# -------------------------------------------------------
# ÉPICO — edite o título e a descrição
# -------------------------------------------------------
EPIC_TITLE="[EPIC] Nome do épico"
EPIC_BODY="Descrição do épico."

EPIC_URL=$(gh issue create \
  --title "$EPIC_TITLE" \
  --body "$EPIC_BODY" \
  --label "epic" \
  --repo "$REPO")

EPIC_NUMBER=$(echo "$EPIC_URL" | grep -oP '\d+$')
echo "Épico criado: #$EPIC_NUMBER — $EPIC_URL"

# -------------------------------------------------------
# STORIES — adicione quantas precisar
# -------------------------------------------------------
create_story() {
  local TITLE="$1"
  local BODY="$2"

  URL=$(gh issue create \
    --title "[STORY] $TITLE" \
    --body "$BODY

Épico: #$EPIC_NUMBER" \
    --label "story,priority:high" \
    --repo "$REPO")

  echo "Story criada: $URL"
}

create_story "Nome da story 1" "Como usuário, quero... para que..."
create_story "Nome da story 2" "Como usuário, quero... para que..."

echo "Todas as issues foram criadas."

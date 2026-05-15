#!/bin/bash
# open_pr.sh — Abre um PR vinculado à issue da branch atual

set -e

BRANCH=$(git branch --show-current)
ISSUE_NUMBER=$(echo "$BRANCH" | grep -oP '(?<=feature/|fix/|docs/)\d+')

if [ -z "$ISSUE_NUMBER" ]; then
  echo "Não foi possível detectar o número da issue na branch: $BRANCH"
  read -p "Informe o número da issue manualmente: " ISSUE_NUMBER
fi

ISSUE_TITLE=$(gh issue view "$ISSUE_NUMBER" --json title -q '.title')

git push -u origin "$BRANCH"

gh pr create \
  --title "feat: $ISSUE_TITLE" \
  --body "Closes #$ISSUE_NUMBER" \
  --base main

echo "PR aberto com sucesso."

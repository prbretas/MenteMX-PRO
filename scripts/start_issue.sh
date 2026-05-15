#!/bin/bash
# start_issue.sh — Cria uma branch a partir de uma issue aberta

set -e

echo "Issues abertas:"
gh issue list --state open

echo ""
read -p "Número da issue: " ISSUE_NUMBER

ISSUE_TITLE=$(gh issue view "$ISSUE_NUMBER" --json title -q '.title')
SLUG=$(echo "$ISSUE_TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')

BRANCH="feature/${ISSUE_NUMBER}-${SLUG}"

git checkout -b "$BRANCH"
echo "Branch criada: $BRANCH"

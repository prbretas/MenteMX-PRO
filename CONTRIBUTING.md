# Guia de Contribuição — MXPilot Pro

---

## Fluxo de trabalho

Este projeto usa **GitHub Flow** com um **Kanban automatizado**. Toda funcionalidade, correção ou melhoria passa por 9 etapas rastreadas no [Project Board](https://github.com/users/prbretas/projects/3).

### As 9 etapas do Kanban

| Etapa | Label para aplicar | O que acontece |
|---|---|---|
| **BACKLOG** | *(estado inicial)* | Issue identificada, aguardando refinamento |
| **EM REFINAMENTO** | `status: em-refinamento` | Detalhamento da issue, perguntas ao dev |
| **REFINADO** | `status: refinado` | Issue clara, pronta para comprometer |
| **COMPROMETIDO** | `status: comprometido` | Dev comprometido, pronto para iniciar |
| **EM DESENVOLVIMENTO** | `status: em-desenvolvimento` | Código sendo escrito |
| **DESENVOLVIMENTO OK** | `status: desenvolvimento-ok` | Código pronto, auto-revisão feita |
| **CODE REVIEW** | `status: code-review` | PR aberto, aguardando revisão |
| **TESTES** | `status: testes` | Validação final antes do merge |
| **DONE** | *(fechar a issue)* | Entregue ✅ |

> **Como funciona a automação:** ao adicionar uma label `status: *` em uma issue, o GitHub Actions move o card automaticamente no board **e** posta um guia com checklist para aquela etapa.

### Passo a passo completo

```bash
# 1. Escolha uma issue no BACKLOG e adicione: status: em-refinamento
#    → O bot posta o guia de refinamento com perguntas a responder

# 2. Após refinar, adicione: status: refinado
#    → O bot confirma que está pronta para comprometer

# 3. Quando for iniciar, adicione: status: comprometido
#    → Crie a branch:
git checkout main && git pull origin main
git checkout -b feat/nome-da-feature

# 4. Ao começar a codar, adicione: status: em-desenvolvimento

# 5. Quando o código estiver pronto, adicione: status: desenvolvimento-ok
#    → Faça a auto-revisão com o checklist do bot

# 6. Abra o PR e adicione: status: code-review
gh pr create --title "feat: descrição" --body "Closes #<numero>"

# 7. Após aprovação no PR, adicione: status: testes

# 8. Após todos os testes passarem, faça o merge
#    → Feche a issue → card vai para DONE automaticamente
```

---

## Nomenclatura de branches

| Tipo | Padrão | Exemplo |
|---|---|---|
| Nova funcionalidade | `feat/<nome>` | `feat/cadastro-piloto` |
| Correção de bug | `fix/<nome>` | `fix/sync-conflito` |
| Documentação | `docs/<nome>` | `docs/contributing` |
| Manutenção / config | `chore/<nome>` | `chore/setup-monorepo` |

Use nomes em **kebab-case**, curtos e descritivos. Evite nomes genéricos como `feat/update` ou `fix/bug`.

---

## Convenção de commits (Conventional Commits)

Todos os commits devem seguir o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<escopo opcional>): <descrição curta em minúsculas>
```

### Tipos aceitos

| Tipo | Quando usar |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Apenas documentação |
| `chore` | Manutenção, configuração, dependências |
| `test` | Adição ou correção de testes |
| `refactor` | Refatoração sem mudança de comportamento |
| `style` | Formatação, espaçamento (sem lógica) |
| `perf` | Melhoria de performance |

### Exemplos

```bash
feat(auth): adicionar endpoint de cadastro de piloto
fix(sync): corrigir resolução de conflito LWW por timestamp
docs(readme): atualizar instruções de setup do monorepo
chore(deps): atualizar expo-sqlite para versão 14
test(analytics): adicionar property test para MX Score bounds
```

---

## Rastreabilidade

Cada tarefa de implementação referencia um ou mais requisitos do spec. Ao abrir um PR:

- Mencione a Issue: `Closes #<numero>`
- Mencione o requisito do spec quando aplicável: `Implements Requirement 2.3`
- Descreva brevemente o que foi feito e como testar

---

## Boas práticas

- **Um PR por Issue** — PRs grandes são difíceis de revisar
- **Commits atômicos** — cada commit deve representar uma mudança coesa
- **Testes obrigatórios** — toda lógica de cálculo deve ter ao menos um teste
- **Sem código morto** — não deixe código comentado ou `console.log` de debug
- **Apague a branch** após o merge para manter o repositório limpo

---

## Scripts disponíveis

```bash
bash scripts/start_issue.sh   # Cria branch a partir de uma Issue
bash scripts/open_pr.sh       # Abre PR para a branch atual
bash scripts/create_issues.sh # Cria Issues em lote a partir de um arquivo
```

---

## Spec do projeto

Antes de implementar qualquer funcionalidade, leia o spec em `.kiro/specs/mxpilot-pro/`:

- `requirements.md` — O que o sistema deve fazer
- `design.md` — Como o sistema foi projetado
- `tasks.md` — Lista de tarefas ordenadas por fase e dependência

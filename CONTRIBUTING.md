# Guia de Contribuição — MXPilot Pro

---

## Fluxo de trabalho

Este projeto usa **GitHub Flow**. Toda funcionalidade, correção ou melhoria é desenvolvida em uma branch separada e integrada via Pull Request.

### Passo a passo

1. **Escolha ou crie uma Issue** no GitHub descrevendo o que será feito
2. **Crie uma branch** a partir de `main` seguindo a nomenclatura abaixo
3. **Implemente** a alteração com commits atômicos e descritivos
4. **Abra um Pull Request** para `main` referenciando a Issue (`Closes #123`)
5. **Aguarde revisão** — nenhum merge sem aprovação
6. **Apague a branch** após o merge

```bash
# Criar branch a partir de main
git checkout main
git pull origin main
git checkout -b feat/nome-da-feature

# Após implementar
git add .
git commit -m "feat: descrição da funcionalidade"
git push -u origin feat/nome-da-feature

# Abrir PR via GitHub CLI
gh pr create --title "feat: descrição" --body "Closes #<numero-da-issue>"
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

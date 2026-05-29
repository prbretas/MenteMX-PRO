# Requirements Document

## Introdução

Este documento formaliza o fluxo de trabalho de desenvolvimento do projeto MenteMX Pro. Define as regras e procedimentos que devem ser seguidos ao trabalhar em cada issue, desde a atribuição inicial até o merge final. O objetivo é garantir rastreabilidade, qualidade e consistência em todo o ciclo de desenvolvimento, integrando o GitHub Flow com o Kanban automatizado do projeto.

## Glossário

- **Desenvolvedor**: Agente (humano ou IA) responsável por implementar o código de uma issue
- **Revisor**: Pessoa responsável por revisar o código do Pull Request (neste projeto, o próprio usuário/owner)
- **Sistema_Workflow**: Conjunto de regras e automações que governam o fluxo de desenvolvimento do projeto
- **Issue**: Unidade de trabalho no GitHub Issues, representando uma tarefa, funcionalidade ou correção
- **Pull_Request**: Solicitação de merge de uma branch de feature para a branch principal (main)
- **Kanban_Board**: Quadro de projeto no GitHub Projects com colunas automatizadas por labels
- **Label_Status**: Labels no formato `status: <etapa>` que disparam a automação do Kanban
- **Branch_Feature**: Branch criada a partir de main para desenvolvimento de uma issue específica
- **Conventional_Commits**: Padrão de mensagens de commit no formato `<tipo>(<escopo>): <descrição>`
- **CI_CD_Pipeline**: Pipeline de integração e entrega contínua que executa testes automatizados
- **Diretório_Projeto**: Caminho `/src/MenteMX-Pro-App` onde todo o código-fonte do aplicativo reside
- **Diretório_Prompts**: Caminho `/src/MenteMX-Pro-App/docs/prompts` onde os prompts utilizados são salvos

## Requisitos

### Requisito 1: Atribuição de Perfil na Issue

**User Story:** Como desenvolvedor, eu quero que meu perfil seja atribuído à issue ao iniciar o trabalho, para que o time saiba quem é responsável por cada tarefa.

#### Critérios de Aceitação

1. WHEN o desenvolvimento de uma issue é iniciado, THE Sistema_Workflow SHALL atribuir o perfil do desenvolvedor como assignee da issue
2. WHEN uma issue já possui um assignee diferente, THE Sistema_Workflow SHALL manter o assignee existente e adicionar o novo desenvolvedor como assignee adicional
3. IF uma issue é iniciada sem atribuição de perfil, THEN THE Sistema_Workflow SHALL bloquear a transição para "Em Desenvolvimento" até que o assignee seja definido

### Requisito 2: Conformidade com GitHub Flow

**User Story:** Como desenvolvedor, eu quero seguir o GitHub Flow padronizado, para que o histórico do projeto seja consistente e rastreável.

#### Critérios de Aceitação

1. WHEN uma nova issue é iniciada para desenvolvimento, THE Sistema_Workflow SHALL criar uma branch a partir de main seguindo o padrão de nomenclatura: `feat/<nome>`, `fix/<nome>`, `docs/<nome>` ou `chore/<nome>`
2. THE Sistema_Workflow SHALL utilizar nomes de branch em kebab-case, curtos e descritivos
3. THE Sistema_Workflow SHALL garantir que nenhum commit seja feito diretamente na branch main
4. WHEN um commit é criado, THE Sistema_Workflow SHALL formatar a mensagem seguindo o padrão Conventional_Commits: `<tipo>(<escopo>): <descrição em minúsculas>`
5. THE Sistema_Workflow SHALL utilizar commits atômicos, onde cada commit representa uma mudança coesa e independente

### Requisito 3: Transição para "Em Desenvolvimento" no Kanban

**User Story:** Como desenvolvedor, eu quero que o card da issue se mova automaticamente para "Em Desenvolvimento" no Kanban, para que o time visualize o progresso em tempo real.

#### Critérios de Aceitação

1. WHEN o desenvolvimento de uma issue é iniciado, THE Sistema_Workflow SHALL adicionar a label `status: em-desenvolvimento` à issue
2. WHEN a label `status: em-desenvolvimento` é adicionada, THE Kanban_Board SHALL mover o card para a coluna "Em Desenvolvimento"
3. IF a issue possui dependências em aberto, THEN THE Sistema_Workflow SHALL exibir um aviso listando as dependências não concluídas antes de prosseguir

### Requisito 4: Código no Diretório do Projeto

**User Story:** Como desenvolvedor, eu quero que todo o código do aplicativo esteja centralizado em um único diretório, para manter a organização e facilitar a navegação do projeto.

#### Critérios de Aceitação

1. THE Sistema_Workflow SHALL criar todo o código-fonte do aplicativo dentro do Diretório_Projeto (`/src/MenteMX-Pro-App`)
2. WHEN um novo arquivo de código é criado, THE Sistema_Workflow SHALL posicioná-lo dentro da estrutura de diretórios do Diretório_Projeto
3. THE Sistema_Workflow SHALL seguir a estrutura de monorepo definida no design do projeto: `apps/mobile`, `apps/backend` e `packages/core` dentro do Diretório_Projeto

### Requisito 5: Criação de Casos de Teste e User Stories

**User Story:** Como desenvolvedor, eu quero criar casos de teste e user stories após finalizar o desenvolvimento, para documentar o comportamento esperado e facilitar a validação.

#### Critérios de Aceitação

1. WHEN o desenvolvimento de uma issue é concluído, THE Sistema_Workflow SHALL criar casos de teste que cubram os critérios de aceitação da issue
2. WHEN o desenvolvimento de uma issue é concluído, THE Sistema_Workflow SHALL documentar as user stories implementadas com cenários de teste associados
3. THE Sistema_Workflow SHALL incluir testes unitários utilizando Vitest para toda lógica de negócio implementada
4. WHERE a funcionalidade envolve lógica com variação significativa de inputs, THE Sistema_Workflow SHALL incluir property-based tests utilizando fast-check
5. WHEN os testes são criados, THE Sistema_Workflow SHALL garantir que todos os testes passam localmente antes de prosseguir

### Requisito 6: Execução de Testes CI/CD

**User Story:** Como desenvolvedor, eu quero executar os testes da pipeline CI/CD, para verificar que o sistema funciona corretamente antes de solicitar revisão.

#### Critérios de Aceitação

1. WHEN o código está pronto para revisão, THE CI_CD_Pipeline SHALL executar a suite completa de testes automatizados
2. WHEN os testes da CI_CD_Pipeline falham, THE Sistema_Workflow SHALL bloquear a criação do Pull_Request até que os erros sejam corrigidos
3. THE CI_CD_Pipeline SHALL executar testes unitários, property-based tests e verificações de lint/type-check
4. WHEN todos os testes passam, THE Sistema_Workflow SHALL adicionar a label `status: desenvolvimento-ok` à issue

### Requisito 7: Salvamento de Prompts

**User Story:** Como desenvolvedor, eu quero salvar todos os prompts utilizados durante o desenvolvimento, para análise posterior e melhoria contínua do processo.

#### Critérios de Aceitação

1. WHEN prompts são utilizados durante o desenvolvimento de uma issue, THE Sistema_Workflow SHALL salvar os prompts no Diretório_Prompts (`/src/MenteMX-Pro-App/docs/prompts`)
2. THE Sistema_Workflow SHALL nomear os arquivos de prompt com o padrão: `issue-<numero>-<descricao-curta>.md`
3. WHEN um arquivo de prompt é criado, THE Sistema_Workflow SHALL incluir metadados: número da issue, data, objetivo do prompt e resultado obtido
4. THE Sistema_Workflow SHALL organizar os prompts em ordem cronológica dentro do arquivo correspondente à issue

### Requisito 8: Criação de Pull Request

**User Story:** Como desenvolvedor, eu quero criar um Pull Request após o desenvolvimento, para formalizar a solicitação de merge e facilitar a revisão de código.

#### Critérios de Aceitação

1. WHEN o desenvolvimento e os testes estão concluídos, THE Sistema_Workflow SHALL criar um Pull_Request da Branch_Feature para a branch main
2. THE Pull_Request SHALL incluir no título o padrão Conventional_Commits: `<tipo>(<escopo>): <descrição>`
3. THE Pull_Request SHALL referenciar a issue correspondente com `Closes #<numero>` no corpo
4. WHEN o Pull_Request é criado, THE Sistema_Workflow SHALL adicionar a label `status: code-review` à issue
5. THE Pull_Request SHALL incluir uma descrição com: resumo das mudanças, o que foi testado e referência ao requisito do spec implementado

### Requisito 9: Code Review pelo Usuário

**User Story:** Como owner do projeto, eu quero realizar pessoalmente a revisão de código, para garantir a qualidade e manter o controle sobre o que entra na base de código.

#### Critérios de Aceitação

1. WHEN um Pull_Request é criado, THE Sistema_Workflow SHALL aguardar a revisão e aprovação do Revisor (owner do projeto) antes de prosseguir
2. THE Sistema_Workflow SHALL solicitar o Revisor como reviewer do Pull_Request
3. IF o Revisor solicita alterações, THEN THE Sistema_Workflow SHALL implementar as correções solicitadas e atualizar o Pull_Request
4. WHILE o Pull_Request aguarda revisão, THE Sistema_Workflow SHALL manter a issue na coluna "Code Review" do Kanban_Board

### Requisito 10: Merge pelo Usuário

**User Story:** Como owner do projeto, eu quero ser o responsável por aceitar e fazer o merge do PR, para manter controle total sobre o que entra na branch principal.

#### Critérios de Aceitação

1. THE Sistema_Workflow SHALL aguardar que o Revisor (owner) execute o merge do Pull_Request
2. THE Sistema_Workflow SHALL manter a Branch_Feature após o merge até que o Revisor decida deletá-la manualmente
3. WHEN o Pull_Request é aprovado pelo Revisor, THE Sistema_Workflow SHALL adicionar a label `status: testes` à issue para validação final
4. WHEN a issue é fechada após o merge, THE Kanban_Board SHALL mover o card automaticamente para a coluna "Done"

### Requisito 11: Sequenciamento de Tarefas

**User Story:** Como desenvolvedor, eu quero garantir que uma tarefa só seja iniciada após o merge da anterior, para evitar conflitos e manter a base de código estável.

#### Critérios de Aceitação

1. THE Sistema_Workflow SHALL aguardar o merge do Pull_Request atual antes de iniciar o desenvolvimento da próxima issue
2. IF um Pull_Request está em aberto aguardando merge, THEN THE Sistema_Workflow SHALL bloquear o início de uma nova issue até que o merge seja concluído
3. WHEN o merge de um Pull_Request é concluído, THE Sistema_Workflow SHALL permitir o início da próxima issue na fila do backlog
4. IF o Revisor autoriza explicitamente desenvolvimento paralelo, THEN THE Sistema_Workflow SHALL permitir o início de uma nova issue mesmo com PR em aberto

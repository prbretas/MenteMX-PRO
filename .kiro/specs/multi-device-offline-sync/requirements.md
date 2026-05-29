# Requirements Document

## Introduction

Este documento especifica os requisitos para a funcionalidade de **Sincronização Multi-Dispositivo Offline** do MenteMX Pro. O objetivo é expandir a arquitetura Local-First existente para suportar dois dispositivos operando de forma coordenada:

1. **Versão Mobile** — dispositivo primário usado na pista/corrida para entrada rápida de dados (Modo Luva).
2. **Versão Desktop** — dispositivo secundário usado para análise detalhada, dashboards e relatórios pela equipe ou piloto.

Ambos os dispositivos devem funcionar de forma independente quando offline e sincronizar automaticamente quando a conectividade for restabelecida. O cenário crítico é o uso em locais remotos (pistas de Motocross fora de centros urbanos) onde a conexão com a internet é inexistente ou intermitente.

A sincronização deve ser transparente para o Piloto, sem necessidade de intervenção manual, e deve resolver conflitos de forma determinística quando ambos os dispositivos editam os mesmos dados offline.

---

## Glossary

- **Piloto**: Usuário principal da plataforma, praticante de Motocross.
- **Sistema**: A plataforma MenteMX Pro como um todo (mobile, desktop e backend).
- **App_Mobile**: A aplicação mobile do MenteMX Pro (React Native + Expo), usada na pista.
- **App_Desktop**: A aplicação desktop do MenteMX Pro, usada para análise e relatórios.
- **Servidor**: Infraestrutura de backend Node.js responsável pela persistência centralizada e mediação da sincronização.
- **Banco_Local**: Armazenamento SQLite no dispositivo do Piloto, disponível sem conexão à internet.
- **Banco_Central**: Banco de dados PostgreSQL no Servidor que mantém a versão autoritativa dos dados.
- **Fila_Offline**: Estrutura de dados local que armazena operações pendentes de sincronização enquanto o dispositivo está sem conexão.
- **Registro_Sync**: Metadado associado a cada registro de dados contendo timestamp de última modificação, identificador do dispositivo de origem e número de versão.
- **Conflito**: Situação em que o mesmo registro foi modificado em dois ou mais dispositivos durante um período offline, gerando versões divergentes.
- **Resolução_LWW**: Estratégia de resolução de conflitos "Last-Writer-Wins" baseada no timestamp de modificação mais recente.
- **Vetor_Versão**: Estrutura que rastreia o número de modificações por dispositivo para detectar conflitos causais.
- **Dispositivo**: Qualquer instância do App_Mobile ou App_Desktop registrada na conta do Piloto.
- **Sessão_Sync**: Processo completo de envio e recebimento de dados entre um Dispositivo e o Servidor.
- **Heartbeat**: Sinal periódico enviado pelo Dispositivo ao Servidor para indicar conectividade ativa.
- **Tombstone**: Marcador lógico que indica que um registro foi excluído, preservado para propagação da exclusão entre Dispositivos.

---

## Requirements

### Requirement 1: Registro e Gerenciamento de Dispositivos

**User Story:** Como piloto, quero registrar meus dispositivos (mobile e desktop) na minha conta, para que ambos possam acessar e sincronizar meus dados de forma segura.

#### Acceptance Criteria

1. THE Sistema SHALL permitir que o Piloto registre até 5 Dispositivos associados à sua conta.
2. WHEN o Piloto faz login em um novo Dispositivo, THE Sistema SHALL registrar automaticamente o Dispositivo com um identificador único e associá-lo à conta do Piloto.
3. THE Sistema SHALL armazenar para cada Dispositivo registrado: identificador único, nome atribuído pelo Piloto, tipo (mobile ou desktop), data do último acesso e data da última sincronização.
4. THE App_Mobile SHALL permitir que o Piloto visualize a lista de Dispositivos registrados na sua conta.
5. THE App_Desktop SHALL permitir que o Piloto visualize a lista de Dispositivos registrados na sua conta.
6. WHEN o Piloto remove um Dispositivo da sua conta, THE Sistema SHALL revogar o acesso do Dispositivo removido e excluir os tokens de autenticação associados.
7. IF o Piloto tentar registrar um sexto Dispositivo, THEN THE Sistema SHALL exibir a mensagem "Limite de 5 dispositivos atingido. Remova um dispositivo existente para continuar." e bloquear o registro.

---

### Requirement 2: Armazenamento Local e Fila Offline

**User Story:** Como piloto que treina em locais sem internet, quero que todas as operações realizadas no dispositivo sejam salvas localmente e enfileiradas para sincronização posterior, para que eu não perca nenhum dado registrado na pista.

#### Acceptance Criteria

1. THE App_Mobile SHALL armazenar todas as operações de criação, edição e exclusão de dados no Banco_Local imediatamente, independentemente do estado da conexão com a internet.
2. THE App_Desktop SHALL armazenar todas as operações de criação, edição e exclusão de dados no Banco_Local imediatamente, independentemente do estado da conexão com a internet.
3. WHEN um Dispositivo está sem conexão com a internet, THE Sistema SHALL enfileirar cada operação na Fila_Offline com os seguintes metadados: timestamp da operação, identificador do Dispositivo, tipo de operação (criar, editar, excluir) e identificador do registro afetado.
4. THE Sistema SHALL preservar a ordem cronológica das operações na Fila_Offline.
5. THE Sistema SHALL garantir que a Fila_Offline persista entre reinicializações do aplicativo e do dispositivo.
6. IF o Banco_Local atingir 90% da capacidade de armazenamento alocada, THEN THE Sistema SHALL notificar o Piloto e sugerir a conexão com a internet para sincronização dos dados pendentes.
7. FOR ALL operações registradas na Fila_Offline, THE Sistema SHALL manter a integridade referencial entre registros dependentes (uma Volta referencia uma Sessão existente no Banco_Local).

---

### Requirement 3: Detecção de Conectividade e Sincronização Automática

**User Story:** Como piloto, quero que a sincronização entre meus dispositivos aconteça automaticamente quando houver internet disponível, para que eu não precise me preocupar em sincronizar manualmente.

#### Acceptance Criteria

1. WHEN um Dispositivo detecta que a conexão com a internet foi restabelecida, THE Sistema SHALL iniciar automaticamente uma Sessão_Sync dentro de 5 segundos.
2. WHILE um Dispositivo possui conexão ativa com a internet, THE Sistema SHALL enviar um Heartbeat ao Servidor a cada 30 segundos para confirmar a conectividade.
3. WHILE a Sessão_Sync estiver em andamento, THE App_Mobile SHALL exibir um indicador visual discreto de sincronização em progresso.
4. WHILE a Sessão_Sync estiver em andamento, THE App_Desktop SHALL exibir um indicador visual discreto de sincronização em progresso.
5. WHEN a Sessão_Sync é concluída com sucesso, THE Sistema SHALL limpar as operações sincronizadas da Fila_Offline.
6. IF a Sessão_Sync falhar por perda de conexão durante o processo, THEN THE Sistema SHALL manter as operações não sincronizadas na Fila_Offline e tentar novamente na próxima detecção de conectividade.
7. IF a Sessão_Sync falhar 3 vezes consecutivas, THEN THE Sistema SHALL aumentar o intervalo entre tentativas usando backoff exponencial (30s, 60s, 120s) até um máximo de 5 minutos entre tentativas.
8. THE Sistema SHALL executar a Sessão_Sync de forma incremental, enviando apenas as operações pendentes desde a última sincronização bem-sucedida.

---

### Requirement 4: Resolução de Conflitos

**User Story:** Como piloto que usa mobile na pista e desktop em casa, quero que o sistema resolva automaticamente conflitos quando ambos os dispositivos editam os mesmos dados offline, para que eu não perca informações importantes.

#### Acceptance Criteria

1. WHEN o Servidor recebe operações de dois Dispositivos que modificam o mesmo registro durante um período offline, THE Sistema SHALL detectar o Conflito comparando os Vetores_Versão dos registros.
2. WHEN um Conflito é detectado, THE Sistema SHALL aplicar a estratégia Resolução_LWW, preservando a versão com o timestamp de modificação mais recente.
3. WHEN um Conflito é resolvido, THE Sistema SHALL criar um registro de auditoria contendo: identificador do registro em conflito, versões conflitantes, versão escolhida, timestamp da resolução e Dispositivos envolvidos.
4. WHEN um Conflito é resolvido, THE Sistema SHALL notificar o Piloto em todos os Dispositivos conectados, informando qual registro foi afetado e qual versão foi preservada.
5. THE App_Mobile SHALL permitir que o Piloto visualize o histórico de Conflitos resolvidos nos últimos 30 dias.
6. THE App_Desktop SHALL permitir que o Piloto visualize o histórico de Conflitos resolvidos nos últimos 30 dias.
7. IF dois registros conflitantes possuírem timestamps idênticos, THEN THE Sistema SHALL utilizar o identificador do Dispositivo como critério de desempate determinístico (ordem lexicográfica do identificador).
8. FOR ALL resoluções de Conflito aplicadas, THE Sistema SHALL propagar a versão resolvida para todos os Dispositivos na próxima Sessão_Sync (propriedade de convergência).

---

### Requirement 5: Sincronização de Exclusões (Tombstones)

**User Story:** Como piloto, quero que quando eu excluo um dado em um dispositivo, essa exclusão seja propagada para todos os meus outros dispositivos, para que meus dados estejam consistentes em todas as plataformas.

#### Acceptance Criteria

1. WHEN o Piloto exclui um registro em qualquer Dispositivo, THE Sistema SHALL criar um Tombstone no Banco_Local contendo: identificador do registro excluído, timestamp da exclusão e identificador do Dispositivo de origem.
2. WHEN uma Sessão_Sync é executada, THE Sistema SHALL propagar os Tombstones para o Servidor.
3. WHEN um Dispositivo recebe um Tombstone do Servidor durante a Sessão_Sync, THE Sistema SHALL aplicar a exclusão lógica no Banco_Local do Dispositivo receptor.
4. IF um Dispositivo recebe um Tombstone para um registro que foi modificado localmente após o timestamp do Tombstone, THEN THE Sistema SHALL preservar a modificação local e descartar o Tombstone (a edição mais recente prevalece sobre a exclusão anterior).
5. THE Sistema SHALL reter os Tombstones no Banco_Central por 90 dias para garantir a propagação para Dispositivos que estiveram offline por períodos prolongados.
6. WHEN um Tombstone ultrapassa 90 dias de retenção, THE Sistema SHALL removê-lo permanentemente do Banco_Central.

---

### Requirement 6: Propagação de Dados entre Dispositivos

**User Story:** Como piloto, quero que os dados registrados no mobile na pista apareçam automaticamente no desktop quando eu chegar em casa, para que eu possa analisar minha performance sem precisar transferir dados manualmente.

#### Acceptance Criteria

1. WHEN o App_Mobile sincroniza dados de Sessão com o Servidor, THE Servidor SHALL disponibilizar esses dados para download pelo App_Desktop na próxima Sessão_Sync.
2. WHEN o App_Desktop sincroniza dados de análise ou anotações com o Servidor, THE Servidor SHALL disponibilizar esses dados para download pelo App_Mobile na próxima Sessão_Sync.
3. THE Sistema SHALL sincronizar os seguintes tipos de dados entre Dispositivos: Sessões, Voltas, Setups, Eventos, configurações de perfil e anotações.
4. THE Sistema SHALL associar a cada registro sincronizado um Registro_Sync contendo: timestamp de criação, timestamp de última modificação, identificador do Dispositivo de origem e número de versão incremental.
5. WHEN um Dispositivo recebe dados atualizados do Servidor, THE Sistema SHALL aplicar as atualizações no Banco_Local preservando a consistência referencial (Sessões antes de Voltas, Motos antes de Setups).
6. FOR ALL dados sincronizados entre dois Dispositivos via Servidor, THE Sistema SHALL garantir que o estado final dos dados seja idêntico em ambos os Dispositivos após a convergência (propriedade de consistência eventual).

---

### Requirement 7: Integridade e Verificação de Dados

**User Story:** Como piloto, quero ter certeza de que meus dados não são corrompidos durante a sincronização, para que eu possa confiar nas métricas e análises apresentadas pelo sistema.

#### Acceptance Criteria

1. THE Sistema SHALL calcular um checksum (hash SHA-256) para cada lote de operações enviado durante a Sessão_Sync.
2. WHEN o Servidor recebe um lote de operações, THE Servidor SHALL verificar o checksum recebido contra o checksum calculado localmente.
3. IF o checksum de um lote não corresponder ao esperado, THEN THE Servidor SHALL rejeitar o lote e solicitar reenvio ao Dispositivo de origem.
4. THE Sistema SHALL executar cada Sessão_Sync dentro de uma transação atômica: todas as operações do lote são aplicadas com sucesso ou nenhuma é aplicada.
5. WHEN uma Sessão_Sync é concluída com sucesso, THE Sistema SHALL atualizar o Registro_Sync de cada registro afetado com o novo número de versão.
6. FOR ALL registros presentes no Banco_Local e no Banco_Central após uma Sessão_Sync bem-sucedida, THE Sistema SHALL garantir que os dados sejam idênticos (propriedade de round-trip: upload seguido de download produz dados equivalentes ao original).

---

### Requirement 8: Experiência do Usuário na Sincronização

**User Story:** Como piloto, quero ter visibilidade clara do estado de sincronização dos meus dados, para que eu saiba se posso confiar que meus dados estão atualizados em todos os dispositivos.

#### Acceptance Criteria

1. THE App_Mobile SHALL exibir um indicador persistente do estado de sincronização: "Sincronizado", "Pendente (N alterações)" ou "Offline".
2. THE App_Desktop SHALL exibir um indicador persistente do estado de sincronização: "Sincronizado", "Pendente (N alterações)" ou "Offline".
3. WHEN o Piloto acessa a tela de configurações de sincronização, THE Sistema SHALL exibir: data e hora da última sincronização bem-sucedida, número de operações pendentes e lista de Dispositivos com seus respectivos estados.
4. THE App_Mobile SHALL permitir que o Piloto force manualmente uma Sessão_Sync a qualquer momento através de um botão dedicado.
5. THE App_Desktop SHALL permitir que o Piloto force manualmente uma Sessão_Sync a qualquer momento através de um botão dedicado.
6. WHEN o Piloto força uma Sessão_Sync manual e o Dispositivo está offline, THE Sistema SHALL exibir a mensagem "Sem conexão com a internet. A sincronização será realizada automaticamente quando a conexão for restabelecida."
7. IF a Fila_Offline contiver operações pendentes há mais de 24 horas, THEN THE Sistema SHALL exibir uma notificação ao Piloto recomendando a conexão com a internet para sincronização.

---

### Requirement 9: Segurança na Sincronização

**User Story:** Como piloto, quero que meus dados sejam transmitidos de forma segura entre dispositivos e servidor, para que informações sensíveis de performance não sejam interceptadas.

#### Acceptance Criteria

1. THE Sistema SHALL transmitir todos os dados de sincronização exclusivamente via protocolo HTTPS com TLS 1.2 ou superior.
2. THE Sistema SHALL autenticar cada Dispositivo com um token JWT de curta duração (expiração máxima de 1 hora) durante a Sessão_Sync.
3. WHEN um token JWT expira durante uma Sessão_Sync, THE Sistema SHALL renovar o token automaticamente usando um refresh token válido, sem interromper a sincronização em andamento.
4. IF um refresh token for revogado (por remoção do Dispositivo ou alteração de senha), THEN THE Sistema SHALL encerrar a Sessão_Sync imediatamente e solicitar nova autenticação do Piloto.
5. THE Sistema SHALL criptografar os dados armazenados no Banco_Local utilizando criptografia AES-256 vinculada ao Dispositivo.
6. THE Servidor SHALL registrar em log de auditoria todas as Sessões_Sync realizadas, incluindo: identificador do Dispositivo, timestamp, número de operações e resultado (sucesso ou falha).

---

### Requirement 10: Performance e Otimização da Sincronização

**User Story:** Como piloto com conexão limitada em áreas rurais, quero que a sincronização seja eficiente e consuma o mínimo de dados possível, para que funcione mesmo com sinal fraco.

#### Acceptance Criteria

1. THE Sistema SHALL utilizar compressão de dados (gzip ou equivalente) em todas as transmissões de sincronização para reduzir o consumo de banda.
2. THE Sistema SHALL transmitir apenas os deltas (diferenças) entre o estado local e o estado do Servidor, evitando retransmissão de dados já sincronizados.
3. WHEN a conexão disponível possui largura de banda inferior a 100 kbps, THE Sistema SHALL priorizar a sincronização de dados críticos (Sessões e Voltas) sobre dados secundários (anotações e configurações de perfil).
4. THE Sistema SHALL limitar o tamanho máximo de cada lote de sincronização a 1 MB para evitar timeouts em conexões instáveis.
5. WHEN uma Sessão_Sync é interrompida, THE Sistema SHALL retomar a sincronização a partir do último lote confirmado, sem reenviar dados já processados.
6. THE Sistema SHALL completar a Sessão_Sync de uma Sessão de treino típica (20 voltas com metadados) em menos de 10 segundos em uma conexão de 1 Mbps.

---

### Requirement 11: Serialização e Protocolo de Sincronização

**User Story:** Como desenvolvedor do MenteMX Pro, quero que o protocolo de sincronização seja bem definido e testável, para que a comunicação entre dispositivos e servidor seja confiável e extensível.

#### Acceptance Criteria

1. THE Sistema SHALL serializar todas as operações de sincronização em formato JSON seguindo um schema versionado.
2. THE Sistema SHALL incluir no payload de sincronização: versão do protocolo, identificador do Dispositivo, timestamp do lote, array de operações e checksum do lote.
3. THE Servidor SHALL validar o schema do payload recebido antes de processar as operações.
4. IF o payload recebido não conformar ao schema esperado, THEN THE Servidor SHALL rejeitar o lote com código de erro descritivo e versão do schema esperada.
5. THE Sistema SHALL suportar versionamento do protocolo de sincronização para permitir atualizações sem quebrar compatibilidade com Dispositivos em versões anteriores.
6. FOR ALL payloads de sincronização válidos, serializar e deserializar o payload SHALL produzir dados equivalentes ao original (propriedade de round-trip).
7. THE Sistema SHALL disponibilizar um pretty-printer para o formato de payload de sincronização, facilitando depuração e logging.


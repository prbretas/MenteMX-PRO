# Implementation Plan: Multi-Device Offline Sync

## Overview

Implementação incremental da funcionalidade de **Sincronização Multi-Dispositivo Offline** do MenteMX Pro. A stack é TypeScript em todo o monorepo: React Native/Expo + SQLite/Drizzle ORM no mobile, Node.js/Express/PostgreSQL no backend, e lógica compartilhada em `packages/core`. Os algoritmos de sincronização, resolução de conflitos e serialização são cobertos por testes de propriedade com `fast-check` validando as 28 propriedades de correção definidas no design.

A implementação segue 4 fases: **Fundação** (estrutura, device registry, armazenamento local), **Core Sync** (fila offline, detecção de conectividade, protocolo), **Resolução de Conflitos** (version vectors, LWW, tombstones) e **Segurança & Performance** (criptografia, compressão, priorização).

---

## Tasks

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- FASE 1 — FUNDAÇÃO (Estrutura, Device Registry, Storage Local)  -->
<!-- ═══════════════════════════════════════════════════════════════ -->

- [ ] 1. Configurar estrutura do projeto e schemas de sincronização
  - Criar módulos de sync no monorepo existente
  - Configurar schemas de banco de dados para sincronização (PostgreSQL + SQLite)
  - Configurar Vitest + `@fast-check/vitest` para testes de propriedade do módulo sync
  - _Requirements: transversal_

  - [ ] 1.1 Criar estrutura de diretórios do módulo de sincronização
    - Criar `packages/core/src/sync/` com subpastas: `device/`, `queue/`, `conflict/`, `tombstone/`, `protocol/`, `transport/`
    - Criar `apps/backend/src/sync/` com subpastas: `endpoints/`, `services/`, `validators/`
    - Criar `apps/mobile/src/sync/` com subpastas: `manager/`, `connectivity/`, `ui/`
    - Configurar barrel exports (`index.ts`) em cada módulo
    - _Requirements: transversal_

  - [ ] 1.2 Criar schemas de sincronização no PostgreSQL (Banco_Central)
    - Criar tabelas: `devices`, `sync_metadata`, `tombstones`, `conflict_audit`, `sync_session_logs`
    - Criar índices de performance conforme design
    - Gerar e aplicar migrations com Drizzle Kit
    - _Requirements: 1.3, 5.5, 4.3, 9.6_

  - [ ] 1.3 Criar schemas de sincronização no SQLite (Banco_Local)
    - Criar tabelas locais via Drizzle ORM: `offline_queue`, `sync_metadata`, `tombstones`, `devices`
    - Configurar criptografia AES-256 vinculada ao dispositivo
    - Gerar migrations locais
    - _Requirements: 2.1, 2.2, 9.5_

- [ ] 2. Implementar Registro e Gerenciamento de Dispositivos
  - Criar `DeviceManager` no cliente e `DeviceRegistryService` no servidor
  - Implementar endpoints REST para CRUD de dispositivos
  - Aplicar limite de 5 dispositivos por conta com mensagem descritiva
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [ ] 2.1 Implementar `DeviceRegistryService` no backend
    - Criar `apps/backend/src/sync/services/deviceRegistry.ts`
    - Implementar: `register()`, `list()`, `remove()`, `getCount()`, `updateLastAccess()`, `updateLastSync()`, `revokeTokens()`
    - Validar limite de 5 dispositivos ativos por `pilot_id`
    - Retornar erro `SYNC_005` com mensagem descritiva ao atingir limite
    - _Requirements: 1.1, 1.2, 1.3, 1.6, 1.7_

  - [ ] 2.2 Implementar endpoints REST de dispositivos
    - `POST /devices` — registrar novo dispositivo (auto-registro no login)
    - `GET /devices` — listar dispositivos do piloto
    - `DELETE /devices/:deviceId` — remover dispositivo e revogar tokens
    - Middleware de autenticação JWT em todos os endpoints
    - _Requirements: 1.2, 1.4, 1.5, 1.6_

  - [ ] 2.3 Implementar `DeviceManager` no cliente (mobile/desktop)
    - Criar `packages/core/src/sync/device/deviceManager.ts`
    - Implementar: `registerDevice()`, `listDevices()`, `removeDevice()`, `getCurrentDevice()`
    - Gerar `deviceId` UUID v4 no primeiro login e persistir localmente
    - _Requirements: 1.2, 1.3, 1.4, 1.5_

  - [ ]* 2.4 Escrever property test para invariante de contagem de dispositivos
    - **Property 1: Device count invariant**
    - Arbitrário: `fc.array(deviceInfoArb, { minLength: 1, maxLength: 10 })`
    - Para qualquer sequência de registros, o número de dispositivos ativos nunca excede 5
    - Arquivo: `packages/core/src/__tests__/sync/device-registry.property.test.ts`
    - **Validates: Requirements 1.1, 1.7**

  - [ ]* 2.5 Escrever property test para round-trip de registro de dispositivo
    - **Property 2: Device registration round-trip**
    - Arbitrário: `deviceInfoArb` (name + type)
    - Após registro bem-sucedido, listar dispositivos deve retornar dispositivo com nome, tipo e ID não-nulo
    - Arquivo: `packages/core/src/__tests__/sync/device-registry.property.test.ts`
    - **Validates: Requirements 1.3**

  - [ ]* 2.6 Escrever property test para revogação de acesso após remoção
    - **Property 3: Device removal revokes access**
    - Arbitrário: `deviceInfoArb`
    - Após remoção, tentativas de autenticação com tokens do dispositivo devem falhar
    - Arquivo: `packages/core/src/__tests__/sync/device-registry.property.test.ts`
    - **Validates: Requirements 1.6**

- [ ] 3. Implementar Armazenamento Local e Fila Offline
  - Criar `OfflineQueue` com persistência entre reinicializações
  - Garantir ordem cronológica e integridade referencial
  - Implementar monitoramento de capacidade do Banco_Local
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ] 3.1 Implementar `OfflineQueue` com persistência e ordenação
    - Criar `packages/core/src/sync/queue/offlineQueue.ts`
    - Implementar: `enqueue()`, `getPending()`, `markSynced()`, `clear()`, `getCount()`
    - Persistir em SQLite local — sobrevive a reinicializações do app e dispositivo
    - Manter ordem cronológica (ORDER BY `created_at` ASC)
    - Incluir metadados: timestamp, device_id, operation_type, record_id
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ] 3.2 Implementar validação de integridade referencial na fila
    - Verificar existência de registros pai no Banco_Local antes de enfileirar (Volta → Sessão, Setup → Moto)
    - Rejeitar operação com erro descritivo se parent não existir
    - _Requirements: 2.7_

  - [ ] 3.3 Implementar monitoramento de capacidade do Banco_Local
    - Verificar uso de armazenamento periodicamente
    - Notificar piloto quando Banco_Local atinge 90% da capacidade alocada
    - Sugerir conexão com internet para sincronização
    - _Requirements: 2.6_

  - [ ]* 3.4 Escrever property test para persistência local independente de rede
    - **Property 4: Local persistence independence from network state**
    - Arbitrário: `syncOperationArb, fc.boolean()` (network state)
    - Para qualquer operação e qualquer estado de rede, a operação é persistida localmente e recuperável
    - Arquivo: `packages/core/src/__tests__/sync/offline-queue.property.test.ts`
    - **Validates: Requirements 2.1, 2.2**

  - [ ]* 3.5 Escrever property test para completude de metadados da fila
    - **Property 5: Offline queue metadata completeness**
    - Arbitrário: `syncOperationArb`
    - Toda entrada na fila deve conter: timestamp válido, device_id correto, operation_type e record_id não-nulos
    - Arquivo: `packages/core/src/__tests__/sync/offline-queue.property.test.ts`
    - **Validates: Requirements 2.3**

  - [ ]* 3.6 Escrever property test para ordenação cronológica da fila
    - **Property 6: Offline queue chronological ordering**
    - Arbitrário: `fc.array(syncOperationArb, { minLength: 2 })`
    - Operações pendentes devem ser retornadas em ordem crescente de timestamp
    - Arquivo: `packages/core/src/__tests__/sync/offline-queue.property.test.ts`
    - **Validates: Requirements 2.4**

  - [ ]* 3.7 Escrever property test para integridade referencial na fila
    - **Property 7: Referential integrity in offline queue**
    - Arbitrário: `syncOperationArb` com referências a parent records
    - Operações que referenciam parent inexistente devem ser rejeitadas
    - Arquivo: `packages/core/src/__tests__/sync/offline-queue.property.test.ts`
    - **Validates: Requirements 2.7**

- [ ] 4. Checkpoint — Fundação completa
  - Garantir que todos os testes passam, device registry funciona com limite de 5, fila offline persiste entre reinicializações e mantém ordem cronológica. Perguntar ao usuário se há dúvidas antes de continuar.


<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- FASE 2 — CORE SYNC (Conectividade, Protocolo, Sessão de Sync)  -->
<!-- ═══════════════════════════════════════════════════════════════ -->

- [ ] 5. Implementar Detecção de Conectividade e Heartbeat
  - Criar `ConnectivityDetector` com detecção de mudanças de rede
  - Implementar heartbeat a cada 30s enquanto online
  - Trigger automático de sync em < 5s após reconexão
  - _Requirements: 3.1, 3.2_

  - [ ] 5.1 Implementar `ConnectivityDetector` no cliente
    - Criar `packages/core/src/sync/transport/connectivityDetector.ts`
    - Implementar: `isOnline()`, `onConnectivityChange()`, `getConnectionQuality()`
    - Detectar qualidade de conexão: 'high' (>= 100kbps), 'low' (< 100kbps), 'offline'
    - Trigger de sync automático em < 5s após detecção de reconexão
    - _Requirements: 3.1_

  - [ ] 5.2 Implementar serviço de Heartbeat
    - Criar `packages/core/src/sync/transport/heartbeatService.ts`
    - Enviar `POST /sync/heartbeat` a cada 30s enquanto online
    - Criar endpoint `POST /sync/heartbeat` no backend que retorna `server_time`
    - Parar heartbeat quando offline; retomar quando online
    - _Requirements: 3.2_

- [ ] 6. Implementar Protocolo de Sincronização e Serialização
  - Criar serializer JSON versionado com checksum SHA-256
  - Implementar validação de schema e protocolo no servidor
  - Suportar versionamento para backward compatibility
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 7.1, 7.2_

  - [ ] 6.1 Implementar serializer e checksum do payload de sync
    - Criar `packages/core/src/sync/protocol/serializer.ts`
    - Implementar: `serialize(batch)`, `deserialize(json)`, `calculateChecksum(operations)`
    - Checksum: SHA-256 do array de operações serializado
    - Incluir no payload: `protocolVersion`, `deviceId`, `batchTimestamp`, `operations[]`, `checksum`
    - Implementar pretty-printer para depuração
    - _Requirements: 11.1, 11.2, 11.6, 11.7, 7.1_

  - [ ] 6.2 Implementar validador de schema e protocolo no servidor
    - Criar `apps/backend/src/sync/validators/batchValidator.ts`
    - Implementar: `validateSchema()`, `validateChecksum()`, `validateProtocolVersion()`
    - Rejeitar payloads inválidos com código de erro descritivo e versão esperada
    - Suportar múltiplas versões do protocolo (backward compatibility)
    - _Requirements: 11.3, 11.4, 11.5, 7.2, 7.3_

  - [ ]* 6.3 Escrever property test para determinismo do checksum
    - **Property 20: Checksum determinism**
    - Arbitrário: `fc.array(syncOperationArb)`
    - Calcular SHA-256 múltiplas vezes sobre o mesmo batch deve produzir resultado idêntico
    - Arquivo: `packages/core/src/__tests__/sync/checksum.property.test.ts`
    - **Validates: Requirements 7.1**

  - [ ]* 6.4 Escrever property test para round-trip de serialização do payload
    - **Property 26: Sync payload serialization round-trip**
    - Arbitrário: `syncBatchArb`
    - Serializar para JSON e deserializar deve produzir payload equivalente ao original
    - Arquivo: `packages/core/src/__tests__/sync/serialization.property.test.ts`
    - **Validates: Requirements 11.6, 11.7**

  - [ ]* 6.5 Escrever property test para completude estrutural do payload
    - **Property 27: Sync payload structural completeness**
    - Arbitrário: `syncBatchArb`
    - Todo payload gerado deve conter: protocolVersion (semver válido), deviceId (UUID válido), batchTimestamp (ISO 8601), operations[] (não-vazio), checksum (SHA-256 hex)
    - Arquivo: `packages/core/src/__tests__/sync/serialization.property.test.ts`
    - **Validates: Requirements 11.1, 11.2**

  - [ ]* 6.6 Escrever property test para backward compatibility do protocolo
    - **Property 28: Protocol version backward compatibility**
    - Arbitrário: `fc.constantFrom('0.9.0', '1.0.0', '1.1.0')`
    - Servidor deve aceitar e processar payloads de versões suportadas sem erro
    - Arquivo: `packages/core/src/__tests__/sync/protocol-version.property.test.ts`
    - **Validates: Requirements 11.5**

- [ ] 7. Implementar SyncManager e Sessão de Sincronização
  - Criar `SyncManager` com push/pull incremental
  - Implementar endpoints `POST /sync/push` e `GET /sync/pull`
  - Implementar transação atômica e limpeza de operações confirmadas
  - Implementar backoff exponencial para falhas
  - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 7.4, 7.5_

  - [ ] 7.1 Implementar `SyncManager.startSync()` com push incremental
    - Criar `packages/core/src/sync/manager/syncManager.ts`
    - Coletar operações pendentes da `OfflineQueue` (apenas `synced = false`)
    - Agrupar em lotes (max 1MB por lote)
    - Calcular checksum SHA-256 por lote
    - Enviar via `POST /sync/push`
    - Limpar operações confirmadas da fila após sucesso
    - _Requirements: 3.5, 3.8, 7.1_

  - [ ] 7.2 Implementar endpoint `POST /sync/push` no backend
    - Criar `apps/backend/src/sync/endpoints/syncPush.ts`
    - Validar schema + checksum do lote recebido
    - Rejeitar lote com checksum inválido (solicitar reenvio)
    - Aplicar operações em transação atômica (tudo ou nada)
    - Atualizar `sync_metadata` com novos version vectors
    - Registrar sessão em `sync_session_logs`
    - _Requirements: 7.2, 7.3, 7.4, 7.5, 9.6_

  - [ ] 7.3 Implementar `SyncManager.pull()` e endpoint `GET /sync/pull`
    - Criar `apps/backend/src/sync/endpoints/syncPull.ts`
    - Retornar operações e tombstones desde `last_sync_timestamp`
    - Suportar paginação (`hasMore`) para grandes volumes
    - Aplicar atualizações no Banco_Local respeitando ordem de dependência
    - _Requirements: 3.8, 6.1, 6.2, 6.5_

  - [ ] 7.4 Implementar retry com backoff exponencial
    - Criar `packages/core/src/sync/transport/retryStrategy.ts`
    - Implementar: para n <= 3 falhas, intervalo = 30s; para n > 3, intervalo = min(30 × 2^(n-3), 300)s
    - Máximo de 5 minutos entre tentativas
    - Manter operações não sincronizadas na fila durante falhas
    - _Requirements: 3.6, 3.7_

  - [ ]* 7.5 Escrever property test para limpeza seletiva de operações confirmadas
    - **Property 8: Sync clears only confirmed operations**
    - Arbitrário: `fc.array(syncOperationArb), fc.subarray()`
    - Após sync que confirma subconjunto S, exatamente S é removido da fila; restante permanece
    - Arquivo: `packages/core/src/__tests__/sync/sync-manager.property.test.ts`
    - **Validates: Requirements 3.5, 3.6**

  - [ ]* 7.6 Escrever property test para cálculo de intervalo de backoff
    - **Property 9: Backoff exponential interval calculation**
    - Arbitrário: `fc.integer({ min: 1, max: 20 })`
    - Para n falhas: n <= 3 → 30s; n > 3 → min(30 × 2^(n-3), 300)s; nunca excede 300s
    - Arquivo: `packages/core/src/__tests__/sync/sync-manager.property.test.ts`
    - **Validates: Requirements 3.7**

  - [ ]* 7.7 Escrever property test para sync incremental (apenas pendentes)
    - **Property 10: Incremental sync transmits only pending operations**
    - Arbitrário: `fc.array(syncOperationArb)` com flags `synced` mistos
    - Batch de sync deve conter exclusivamente operações com `synced = false`
    - Arquivo: `packages/core/src/__tests__/sync/sync-manager.property.test.ts`
    - **Validates: Requirements 3.8, 10.2**

  - [ ]* 7.8 Escrever property test para atomicidade da transação de sync
    - **Property 21: Sync atomicity**
    - Arbitrário: `fc.array(syncOperationArb)` com uma operação inválida inserida
    - Se qualquer operação do lote falha, nenhuma deve ser aplicada no banco central
    - Arquivo: `packages/core/src/__tests__/sync/sync-transaction.property.test.ts`
    - **Validates: Requirements 7.4**

  - [ ]* 7.9 Escrever property test para integridade round-trip de dados
    - **Property 22: Sync round-trip data integrity**
    - Arbitrário: `syncOperationArb`
    - Registro enviado (push) e recebido de volta (pull) deve ser byte-equivalente ao original
    - Arquivo: `packages/core/src/__tests__/sync/sync-roundtrip.property.test.ts`
    - **Validates: Requirements 7.5, 7.6**

- [ ] 8. Checkpoint — Core Sync completo
  - Garantir que todos os testes passam, sync push/pull funciona com checksum, backoff exponencial está correto, e transações são atômicas. Perguntar ao usuário se há dúvidas antes de continuar.


<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- FASE 3 — RESOLUÇÃO DE CONFLITOS (Version Vectors, LWW, Tombs)  -->
<!-- ═══════════════════════════════════════════════════════════════ -->

- [ ] 9. Implementar Version Vectors e Detecção de Conflitos
  - Criar `VersionVectorService` com operações de incremento, merge e comparação
  - Implementar detecção de concorrência entre vetores
  - _Requirements: 4.1_

  - [ ] 9.1 Implementar `VersionVectorService`
    - Criar `packages/core/src/sync/conflict/versionVector.ts`
    - Implementar: `increment(vector, deviceId)`, `merge(local, remote)`, `dominates(a, b)`, `concurrent(a, b)`
    - `dominates(a, b)`: true se a >= b em todas as entradas e > em pelo menos uma
    - `concurrent(a, b)`: true se nem a domina b nem b domina a
    - _Requirements: 4.1_

  - [ ]* 9.2 Escrever property test para detecção de conflito via version vectors
    - **Property 11: Conflict detection via concurrent version vectors**
    - Arbitrário: `versionVectorArb` (pares)
    - Vetores concorrentes (nenhum domina o outro) devem ser detectados como conflito; se um domina, não é conflito
    - Arquivo: `packages/core/src/__tests__/sync/version-vector.property.test.ts`
    - **Validates: Requirements 4.1**

- [ ] 10. Implementar Resolução de Conflitos LWW
  - Criar `ConflictResolver` com estratégia LWW + desempate determinístico
  - Implementar registro de auditoria de conflitos
  - Implementar notificação de conflitos resolvidos
  - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

  - [ ] 10.1 Implementar `ConflictResolver` com LWW e desempate
    - Criar `packages/core/src/sync/conflict/conflictResolver.ts`
    - Implementar `detectAndResolveConflict(local, remote)` conforme algoritmo do design
    - LWW: timestamp mais recente vence
    - Desempate: ordem lexicográfica do `device_id` quando timestamps idênticos
    - Resultado determinístico: mesmos inputs → mesmo winner
    - _Requirements: 4.2, 4.7_

  - [ ] 10.2 Implementar registro de auditoria e notificação de conflitos
    - Criar `apps/backend/src/sync/services/conflictAudit.ts`
    - Registrar para cada conflito: record_id, versões conflitantes, versão escolhida, estratégia, timestamp, devices envolvidos
    - Criar endpoint `GET /sync/conflicts` — histórico dos últimos 30 dias
    - Notificar piloto em todos os dispositivos conectados sobre conflitos resolvidos
    - _Requirements: 4.3, 4.4, 4.5, 4.6_

  - [ ] 10.3 Implementar propagação de versão resolvida (convergência)
    - Após resolução no servidor, incluir versão resolvida no próximo `GET /sync/pull` de cada dispositivo
    - Garantir que todos os dispositivos convergem para o mesmo estado após sync
    - _Requirements: 4.8_

  - [ ]* 10.4 Escrever property test para resolução LWW com desempate determinístico
    - **Property 12: LWW conflict resolution with deterministic tiebreaker**
    - Arbitrário: `fc.record({ ts1: fc.date(), ts2: fc.date(), deviceId1: fc.uuid(), deviceId2: fc.uuid() })`
    - Se T1 ≠ T2: timestamp mais recente vence. Se T1 = T2: device_id lexicograficamente menor vence. Sempre determinístico.
    - Arquivo: `packages/core/src/__tests__/sync/conflict-resolver.property.test.ts`
    - **Validates: Requirements 4.2, 4.7**

  - [ ]* 10.5 Escrever property test para completude do registro de auditoria
    - **Property 13: Conflict audit record completeness**
    - Arbitrário: `syncOperationArb` (pares conflitantes)
    - Registro de auditoria deve conter: record_id, ambas versões, versão resolvida, estratégia, timestamp, ambos device_ids
    - Arquivo: `packages/core/src/__tests__/sync/conflict-resolver.property.test.ts`
    - **Validates: Requirements 4.3**

  - [ ]* 10.6 Escrever property test para convergência após resolução
    - **Property 14: Convergence after conflict resolution**
    - Arbitrário: `fc.array(syncOperationArb)` (multi-device)
    - Após todos os dispositivos completarem sync, dados do registro afetado devem ser idênticos em todos
    - Arquivo: `packages/core/src/__tests__/sync/sync-integration.property.test.ts`
    - **Validates: Requirements 4.8**

- [ ] 11. Implementar Tombstones e Sincronização de Exclusões
  - Criar `TombstoneService` com criação, propagação e regra de recência
  - Implementar TTL de 90 dias com cleanup automático
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ] 11.1 Implementar `TombstoneService` no cliente
    - Criar `packages/core/src/sync/tombstone/tombstoneService.ts`
    - Implementar: `create(recordId, tableName)`, `getPending()`, `apply(tombstone)`, `shouldApply(tombstone, localRecord)`
    - Criar tombstone com: record_id, deletion timestamp, device_id, expires_at (90 dias)
    - Enfileirar tombstone para propagação via sync
    - _Requirements: 5.1, 5.2_

  - [ ] 11.2 Implementar aplicação de tombstones com regra de recência
    - `shouldApply(tombstone, localRecord)`: aplicar se `localRecord.updatedAt <= tombstone.deletedAt`
    - Descartar tombstone se registro local foi modificado após o timestamp de exclusão
    - Aplicar exclusão lógica no Banco_Local quando tombstone é recebido do servidor
    - _Requirements: 5.3, 5.4_

  - [ ] 11.3 Implementar TTL de 90 dias e cleanup no servidor
    - Criar `apps/backend/src/sync/services/tombstoneCleanup.ts`
    - Job periódico que remove tombstones com `expires_at < NOW()`
    - Reter tombstones por exatamente 90 dias para propagação a dispositivos offline
    - _Requirements: 5.5, 5.6_

  - [ ]* 11.4 Escrever property test para criação de tombstone na exclusão
    - **Property 15: Tombstone creation on deletion**
    - Arbitrário: `fc.uuid(), fc.constantFrom('sessions', 'laps', 'setups', 'events', 'notes')`
    - Ao excluir registro, tombstone deve ser criado com record_id, deletion timestamp e device_id corretos
    - Arquivo: `packages/core/src/__tests__/sync/tombstone.property.test.ts`
    - **Validates: Requirements 5.1**

  - [ ]* 11.5 Escrever property test para regra de recência do tombstone
    - **Property 16: Tombstone application respects recency**
    - Arbitrário: `tombstoneArb, fc.date()` (local updatedAt)
    - Se `localRecord.updatedAt <= tombstone.deletedAt` → aplicar. Se `localRecord.updatedAt > tombstone.deletedAt` → descartar.
    - Arquivo: `packages/core/src/__tests__/sync/tombstone.property.test.ts`
    - **Validates: Requirements 5.3, 5.4**

  - [ ]* 11.6 Escrever property test para TTL de retenção de tombstones
    - **Property 17: Tombstone retention TTL**
    - Arbitrário: `tombstoneArb` com idades variadas (0–120 dias)
    - Tombstones < 90 dias: retidos. Tombstones >= 90 dias: removidos pelo cleanup.
    - Arquivo: `packages/core/src/__tests__/sync/tombstone.property.test.ts`
    - **Validates: Requirements 5.5, 5.6**

- [ ] 12. Implementar Propagação de Dados e Consistência Eventual
  - Implementar aplicação ordenada de atualizações (parent antes de child)
  - Garantir consistência eventual entre dispositivos
  - Sincronizar todos os tipos de dados: Sessões, Voltas, Setups, Eventos, configurações, anotações
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ] 12.1 Implementar aplicador de sync com ordenação por dependência
    - Criar `packages/core/src/sync/manager/syncApplicator.ts`
    - Ordenar atualizações: Sessões antes de Voltas, Motos antes de Setups
    - Aplicar em transação local para manter consistência referencial
    - Atualizar `sync_metadata` local com novos version vectors
    - _Requirements: 6.4, 6.5_

  - [ ]* 12.2 Escrever property test para ordenação por dependência
    - **Property 18: Dependency-ordered application of updates**
    - Arbitrário: `fc.array(syncOperationArb)` com relações parent-child
    - Parents devem ser aplicados antes de children; integridade referencial deve ser mantida após aplicação
    - Arquivo: `packages/core/src/__tests__/sync/sync-applicator.property.test.ts`
    - **Validates: Requirements 6.5**

  - [ ]* 12.3 Escrever property test para consistência eventual entre dispositivos
    - **Property 19: Eventual consistency between devices**
    - Arbitrário: `fc.array(syncOperationArb)` (dois dispositivos simulados)
    - Após ambos completarem sync, registros ativos (não-tombstoned) devem ser idênticos em conteúdo e versão
    - Arquivo: `packages/core/src/__tests__/sync/sync-integration.property.test.ts`
    - **Validates: Requirements 6.6**

- [ ] 13. Checkpoint — Resolução de Conflitos completa
  - Garantir que todos os testes passam, conflitos são resolvidos deterministicamente, tombstones respeitam recência e TTL, e dispositivos convergem após sync. Perguntar ao usuário se há dúvidas antes de continuar.


<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- FASE 4 — SEGURANÇA & PERFORMANCE (Crypto, Compressão, UX)      -->
<!-- ═══════════════════════════════════════════════════════════════ -->

- [ ] 14. Implementar Segurança na Sincronização
  - Implementar autenticação JWT de curta duração com refresh automático
  - Configurar HTTPS + TLS 1.2+ para todas as transmissões
  - Implementar criptografia AES-256 no Banco_Local
  - Implementar log de auditoria de sessões de sync
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [ ] 14.1 Implementar autenticação JWT para sync com refresh automático
    - Criar `packages/core/src/sync/transport/authService.ts`
    - JWT de curta duração (expiração máxima 1h) para cada Sessão_Sync
    - Renovar token automaticamente via refresh token sem interromper sync
    - Encerrar sync e solicitar re-autenticação se refresh token for revogado
    - _Requirements: 9.2, 9.3, 9.4_

  - [ ] 14.2 Implementar criptografia AES-256 do Banco_Local
    - Configurar SQLCipher ou equivalente para criptografia at-rest
    - Vincular chave de criptografia ao dispositivo (device-bound key)
    - Garantir que dados são inacessíveis sem a chave do dispositivo
    - _Requirements: 9.5_

  - [ ] 14.3 Implementar HTTPS enforcement e log de auditoria
    - Configurar TLS 1.2+ em todos os endpoints de sync
    - Registrar em `sync_session_logs`: device_id, timestamp, operations count, resultado
    - _Requirements: 9.1, 9.6_

- [ ] 15. Implementar Performance e Otimização
  - Implementar compressão gzip em todas as transmissões
  - Implementar batching com limite de 1MB
  - Implementar priorização de dados críticos sob baixa largura de banda
  - Implementar resumabilidade de sync interrompido
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ] 15.1 Implementar compressão gzip e delta sync
    - Configurar compressão gzip em todas as requisições/respostas de sync
    - Transmitir apenas deltas (operações pendentes desde última sync bem-sucedida)
    - _Requirements: 10.1, 10.2_

  - [ ] 15.2 Implementar batch builder com limite de 1MB e priorização
    - Criar `packages/core/src/sync/protocol/batchBuilder.ts`
    - Particionar operações em lotes onde cada lote serializado <= 1MB
    - Sob baixa largura de banda (< 100kbps): priorizar Sessões e Voltas sobre anotações e configurações
    - _Requirements: 10.3, 10.4_

  - [ ] 15.3 Implementar resumabilidade de sync interrompido
    - Rastrear último lote confirmado pelo servidor
    - Retomar sync a partir do lote K+1 após interrupção no lote K
    - Não reenviar operações de lotes já confirmados
    - _Requirements: 10.5_

  - [ ]* 15.4 Escrever property test para limite de tamanho de batch
    - **Property 23: Batch size limit**
    - Arbitrário: `fc.array(syncOperationArb, { minLength: 1, maxLength: 200 })`
    - Nenhum lote gerado deve exceder 1MB quando serializado
    - Arquivo: `packages/core/src/__tests__/sync/batch-builder.property.test.ts`
    - **Validates: Requirements 10.4**

  - [ ]* 15.5 Escrever property test para resumabilidade do sync
    - **Property 24: Sync resumability from last confirmed batch**
    - Arbitrário: `fc.array(syncBatchArb), fc.integer()` (ponto de interrupção)
    - Após interrupção no lote K, próximo sync retoma do lote K+1; nenhuma operação de 1..K é retransmitida
    - Arquivo: `packages/core/src/__tests__/sync/sync-manager.property.test.ts`
    - **Validates: Requirements 10.5**

  - [ ]* 15.6 Escrever property test para priorização sob baixa largura de banda
    - **Property 25: Priority-based sync under low bandwidth**
    - Arbitrário: `fc.array(syncOperationArb)` com tabelas mistas (sessions, laps, notes, settings)
    - Sob bandwidth < 100kbps, dados críticos (sessions, laps) devem ser transmitidos antes de dados secundários
    - Arquivo: `packages/core/src/__tests__/sync/batch-builder.property.test.ts`
    - **Validates: Requirements 10.3**

- [ ] 16. Implementar UI de Status de Sincronização
  - Criar indicadores visuais de estado de sync em mobile e desktop
  - Implementar tela de configurações de sincronização
  - Implementar botão de sync manual e notificações
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [ ] 16.1 Implementar `SyncStatusIndicator` no mobile e desktop
    - Criar `apps/mobile/src/sync/ui/SyncStatusIndicator.tsx`
    - Exibir estados: "Sincronizado", "Pendente (N alterações)", "Sincronizando" (com progresso), "Offline"
    - Indicador persistente e discreto na UI principal
    - _Requirements: 8.1, 8.2, 3.3, 3.4_

  - [ ] 16.2 Implementar tela de configurações de sincronização
    - Exibir: data/hora da última sync, número de operações pendentes, lista de dispositivos com estados
    - Botão "Sincronizar agora" para forçar sync manual
    - Mensagem "Sem conexão com a internet..." quando offline e sync manual é tentado
    - _Requirements: 8.3, 8.4, 8.5, 8.6_

  - [ ] 16.3 Implementar notificações de sync
    - Notificação quando Fila_Offline tem operações pendentes há mais de 24h
    - Notificação de conflitos resolvidos em todos os dispositivos
    - _Requirements: 8.7, 4.4_

- [ ] 17. Integração final e wiring de componentes
  - Conectar todos os módulos de sync no fluxo completo
  - Integrar ConnectivityDetector → SyncManager → OfflineQueue → ConflictResolver → UI
  - Garantir que o fluxo end-to-end funciona: offline → enqueue → reconexão → push → pull → convergência
  - _Requirements: 3.1, 6.1, 6.2, 6.3, 6.6_

  - [ ] 17.1 Wiring do fluxo completo de sincronização no cliente
    - Conectar `ConnectivityDetector` ao `SyncManager` (trigger em < 5s)
    - Conectar `SyncManager` à `OfflineQueue` para coleta de operações
    - Conectar `SyncManager` ao `SyncStatusIndicator` para atualização de UI
    - Conectar `TombstoneService` ao fluxo de pull
    - Registrar listeners de mudança de conectividade
    - _Requirements: 3.1, 6.1, 6.2, 6.3_

  - [ ] 17.2 Wiring do fluxo de sync no servidor
    - Conectar `SyncEndpoint` → `BatchValidator` → `ConflictResolver` → `TombstoneManager` → `AuditLogger`
    - Configurar middleware de autenticação JWT nos endpoints de sync
    - Configurar compressão gzip no Express
    - _Requirements: 9.1, 9.2, 7.2, 10.1_

- [ ] 18. Checkpoint final — Garantir que todos os testes passam
  - Executar suite completa de testes (property tests + unit + integration)
  - Verificar cobertura de todos os 11 requisitos e 28 propriedades de correção
  - Validar fluxo end-to-end: dois dispositivos simulados sincronizam via servidor
  - Perguntar ao usuário se há dúvidas antes de considerar a feature completa.


---

## Notes

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido, mas cobrem as 28 propriedades de correção definidas no design
- Cada tarefa referencia requisitos específicos para rastreabilidade completa
- Os checkpoints garantem validação incremental ao final de cada fase
- Os testes de propriedade usam `fast-check` com mínimo de 100 iterações por propriedade (padrão); em CI, usar `FC_NUM_RUNS=500`
- A lógica de sincronização compartilhada fica em `packages/core/src/sync/` para ser testada independentemente de React Native e Node.js
- A estratégia Local-First garante que nenhuma operação bloqueia por falta de rede
- Arbitrários customizados (`versionVectorArb`, `syncOperationArb`, `tombstoneArb`, `syncBatchArb`, `deviceInfoArb`) são definidos em `packages/core/src/__tests__/sync/arbitraries.ts`
- O protocolo de sync é versionado (semver) para permitir atualizações sem quebrar dispositivos em versões anteriores

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 2, "tasks": ["2.4", "2.5", "2.6", "3.1", "3.2", "3.3"] },
    { "id": 3, "tasks": ["3.4", "3.5", "3.6", "3.7", "5.1", "5.2"] },
    { "id": 4, "tasks": ["6.1", "6.2", "9.1"] },
    { "id": 5, "tasks": ["6.3", "6.4", "6.5", "6.6", "9.2"] },
    { "id": 6, "tasks": ["7.1", "7.4", "10.1"] },
    { "id": 7, "tasks": ["7.2", "7.3", "10.2", "10.3"] },
    { "id": 8, "tasks": ["7.5", "7.6", "7.7", "7.8", "7.9", "10.4", "10.5", "10.6"] },
    { "id": 9, "tasks": ["11.1", "11.2", "11.3"] },
    { "id": 10, "tasks": ["11.4", "11.5", "11.6", "12.1"] },
    { "id": 11, "tasks": ["12.2", "12.3", "14.1", "14.2", "14.3"] },
    { "id": 12, "tasks": ["15.1", "15.2", "15.3"] },
    { "id": 13, "tasks": ["15.4", "15.5", "15.6", "16.1", "16.2", "16.3"] },
    { "id": 14, "tasks": ["17.1", "17.2"] }
  ]
}
```

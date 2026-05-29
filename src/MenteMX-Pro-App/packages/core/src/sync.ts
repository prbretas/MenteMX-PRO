/**
 * Lógica de sincronização Local-First.
 * Gerencia fila de operações pendentes com backoff exponencial.
 */

export type SyncStatus = 'offline' | 'syncing' | 'synced' | 'error';

export interface PendingOp {
  id: string;
  deviceId: string;
  opType: 'INSERT' | 'UPDATE' | 'DELETE';
  tableName: string;
  recordId: string;
  payload: string;
  createdAt: string;
  synced: boolean;
}

export interface SyncResult {
  confirmed: string[];
  errors: Array<{ id: string; error: string }>;
  total: number;
  success: number;
  failed: number;
}

/**
 * Calcula o delay de backoff exponencial.
 * Base: 1s, max: 5min (300s)
 */
export function calculateBackoff(attempt: number): number {
  const baseMs = 1000;
  const maxMs = 300000; // 5 minutos
  const delay = Math.min(baseMs * Math.pow(2, attempt), maxMs);
  return delay;
}

/**
 * Resolução de conflito Last-Write-Wins.
 * Retorna o registro com updated_at mais recente.
 */
export function resolveConflictLWW<T extends { updatedAt: string }>(
  local: T,
  remote: T
): T {
  const localTime = new Date(local.updatedAt).getTime();
  const remoteTime = new Date(remote.updatedAt).getTime();
  return remoteTime >= localTime ? remote : local;
}

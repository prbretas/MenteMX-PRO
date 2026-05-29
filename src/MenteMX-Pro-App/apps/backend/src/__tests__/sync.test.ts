import { describe, it, expect } from 'vitest';
import { syncBatchSchema, syncOperationSchema } from '../sync/sync.schema.js';

describe('Sync Schema Validation', () => {
  it('aceita batch válido', () => {
    const result = syncBatchSchema.safeParse({
      operations: [{
        id: '550e8400-e29b-41d4-a716-446655440000',
        deviceId: 'device-123',
        opType: 'INSERT',
        tableName: 'lap',
        recordId: 'rec-1',
        payload: '{"lapTimeMs":90000}',
        createdAt: '2024-01-01T10:00:00Z',
      }],
    });
    expect(result.success).toBe(true);
  });

  it('rejeita batch vazio', () => {
    const result = syncBatchSchema.safeParse({ operations: [] });
    expect(result.success).toBe(false);
  });

  it('rejeita opType inválido', () => {
    const result = syncOperationSchema.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440000',
      deviceId: 'device-123',
      opType: 'INVALID',
      tableName: 'lap',
      recordId: 'rec-1',
      payload: '{}',
      createdAt: '2024-01-01T10:00:00Z',
    });
    expect(result.success).toBe(false);
  });

  it('aceita todos os opTypes válidos', () => {
    for (const opType of ['INSERT', 'UPDATE', 'DELETE']) {
      const result = syncOperationSchema.safeParse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        deviceId: 'dev',
        opType,
        tableName: 'session',
        recordId: 'r1',
        payload: '{}',
        createdAt: '2024-01-01T10:00:00Z',
      });
      expect(result.success).toBe(true);
    }
  });
});

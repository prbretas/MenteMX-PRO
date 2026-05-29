import { describe, it, expect } from 'vitest';
import { calculateBackoff, resolveConflictLWW } from '../sync.js';

describe('Sync - Backoff Exponencial', () => {
  it('attempt 0 = 1s', () => {
    expect(calculateBackoff(0)).toBe(1000);
  });

  it('attempt 1 = 2s', () => {
    expect(calculateBackoff(1)).toBe(2000);
  });

  it('attempt 2 = 4s', () => {
    expect(calculateBackoff(2)).toBe(4000);
  });

  it('attempt 3 = 8s', () => {
    expect(calculateBackoff(3)).toBe(8000);
  });

  it('nunca excede 5 minutos (300s)', () => {
    expect(calculateBackoff(20)).toBe(300000);
    expect(calculateBackoff(100)).toBe(300000);
  });
});

describe('Sync - Resolução de Conflito LWW', () => {
  it('retorna registro mais recente (remote ganha)', () => {
    const local = { id: '1', name: 'old', updatedAt: '2024-01-01T10:00:00Z' };
    const remote = { id: '1', name: 'new', updatedAt: '2024-01-01T11:00:00Z' };
    expect(resolveConflictLWW(local, remote)).toBe(remote);
  });

  it('retorna registro mais recente (local ganha)', () => {
    const local = { id: '1', name: 'newer', updatedAt: '2024-01-01T12:00:00Z' };
    const remote = { id: '1', name: 'old', updatedAt: '2024-01-01T11:00:00Z' };
    expect(resolveConflictLWW(local, remote)).toBe(local);
  });

  it('empate: remote ganha (>=)', () => {
    const local = { id: '1', name: 'a', updatedAt: '2024-01-01T10:00:00Z' };
    const remote = { id: '1', name: 'b', updatedAt: '2024-01-01T10:00:00Z' };
    expect(resolveConflictLWW(local, remote)).toBe(remote);
  });
});

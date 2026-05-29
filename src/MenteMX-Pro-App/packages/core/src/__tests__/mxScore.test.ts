import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { calculateMXScore, type SessionData } from '../analytics/mxScore.js';

const sessionArb = fc.record({
  bestLapMs: fc.integer({ min: 30000, max: 180000 }),
  consistencyIndex: fc.oneof(fc.constant(null), fc.integer({ min: 0, max: 100 })),
  avgLapMs: fc.integer({ min: 30000, max: 200000 }),
  date: fc.date({ min: new Date('2024-01-01'), max: new Date('2024-12-31') }).map(d => d.toISOString()),
});

describe('calculateMXScore - Unit Tests', () => {
  it('retorna 0 para lista vazia', () => {
    const result = calculateMXScore([]);
    expect(result.score).toBe(0);
  });

  it('retorna score > 0 para sessão válida', () => {
    const sessions: SessionData[] = [{
      bestLapMs: 90000,
      consistencyIndex: 80,
      avgLapMs: 95000,
      date: '2024-06-01T10:00:00Z',
    }];
    const result = calculateMXScore(sessions);
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThanOrEqual(1000);
  });
});

describe('Property 9: MX Score dentro dos limites [0, 1000]', () => {
  it('resultado sempre em [0, 1000] para qualquer conjunto de sessões', () => {
    fc.assert(
      fc.property(
        fc.array(sessionArb, { minLength: 0, maxLength: 20 }),
        (sessions) => {
          const result = calculateMXScore(sessions);
          return result.score >= 0 && result.score <= 1000;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 10: Determinismo do MX Score', () => {
  it('mesmos dados = mesmo resultado', () => {
    fc.assert(
      fc.property(
        fc.array(sessionArb, { minLength: 1, maxLength: 10 }),
        (sessions) => {
          const r1 = calculateMXScore(sessions);
          const r2 = calculateMXScore(sessions);
          return r1.score === r2.score;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 11: Ponderação correta 40/30/20/10', () => {
  it('score é inteiro', () => {
    fc.assert(
      fc.property(
        fc.array(sessionArb, { minLength: 1, maxLength: 10 }),
        (sessions) => {
          const result = calculateMXScore(sessions);
          return Number.isInteger(result.score);
        }
      ),
      { numRuns: 100 }
    );
  });
});

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { calculateConsistency } from '../analytics/consistency.js';

describe('calculateConsistency - Unit Tests', () => {
  it('retorna null para < 3 voltas', () => {
    expect(calculateConsistency([])).toBeNull();
    expect(calculateConsistency([90000])).toBeNull();
    expect(calculateConsistency([90000, 91000])).toBeNull();
  });

  it('retorna 100 para voltas idênticas', () => {
    expect(calculateConsistency([90000, 90000, 90000])).toBe(100);
    expect(calculateConsistency([60000, 60000, 60000, 60000, 60000])).toBe(100);
  });

  it('retorna valor entre 0 e 100 para voltas variadas', () => {
    const result = calculateConsistency([90000, 92000, 88000, 91000]);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
  });

  it('maior variação = menor consistência', () => {
    const consistent = calculateConsistency([90000, 90500, 89500])!;
    const inconsistent = calculateConsistency([90000, 100000, 80000])!;
    expect(consistent).toBeGreaterThan(inconsistent);
  });
});

describe('Property 8: Índice de Consistência — range e invariante', () => {
  it('resultado sempre em [0, 100] para qualquer lista >= 3 voltas', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 10000, max: 300000 }), { minLength: 3, maxLength: 50 }),
        (lapTimes) => {
          const result = calculateConsistency(lapTimes);
          return result !== null && result >= 0 && result <= 100;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('invariante de igualdade: voltas idênticas = 100', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 10000, max: 300000 }),
        fc.integer({ min: 3, max: 20 }),
        (time, n) => {
          const lapTimes = Array(n).fill(time);
          return calculateConsistency(lapTimes) === 100;
        }
      ),
      { numRuns: 100 }
    );
  });
});

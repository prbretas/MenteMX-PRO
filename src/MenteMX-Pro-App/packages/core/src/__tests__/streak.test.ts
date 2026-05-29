import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { calculateStreak, incrementStreak, processEndOfDay, getRecord } from '../streak.js';

describe('Streak - Unit Tests', () => {
  it('calculateStreak: 0 para array vazio', () => {
    expect(calculateStreak([])).toBe(0);
  });

  it('calculateStreak: conta dias consecutivos desde o início', () => {
    expect(calculateStreak([true, true, true, false, true])).toBe(3);
  });

  it('incrementStreak: n -> n+1', () => {
    expect(incrementStreak(5)).toBe(6);
    expect(incrementStreak(0)).toBe(1);
  });

  it('processEndOfDay: reset sem sessão', () => {
    const result = processEndOfDay(5, 10, false);
    expect(result.currentStreak).toBe(0);
    expect(result.recordStreak).toBe(10);
  });

  it('processEndOfDay: milestone 7', () => {
    const result = processEndOfDay(7, 5, false);
    expect(result.milestone).toBe(7);
    expect(result.recordStreak).toBe(7);
  });

  it('processEndOfDay: com sessão mantém streak', () => {
    const result = processEndOfDay(5, 3, true);
    expect(result.currentStreak).toBe(5);
    expect(result.recordStreak).toBe(5);
  });
});

describe('Property 17: Cálculo correto do streak', () => {
  it('streak = comprimento da sequência consecutiva mais recente', () => {
    fc.assert(
      fc.property(
        fc.array(fc.boolean(), { minLength: 1, maxLength: 30 }),
        (days) => {
          const streak = calculateStreak(days);
          // Verificar manualmente
          let expected = 0;
          for (const d of days) {
            if (d) expected++;
            else break;
          }
          return streak === expected;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 18: Incremento unitário', () => {
  it('streak n -> após sessão = n+1', () => {
    fc.assert(
      fc.property(fc.nat({ max: 365 }), (n) => {
        return incrementStreak(n) === n + 1;
      }),
      { numRuns: 100 }
    );
  });
});

describe('Property 20: Recorde invariante', () => {
  it('record >= current em qualquer momento', () => {
    fc.assert(
      fc.property(
        fc.nat({ max: 365 }),
        fc.nat({ max: 365 }),
        (current, record) => {
          const result = getRecord(current, record);
          return result >= current;
        }
      ),
      { numRuns: 100 }
    );
  });
});

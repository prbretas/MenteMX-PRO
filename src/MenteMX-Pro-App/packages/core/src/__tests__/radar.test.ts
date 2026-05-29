import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { calculateRadarDimensions, validateMentalPhysicalInput, type RadarInput } from '../analytics/radar.js';

describe('Radar - Unit Tests', () => {
  it('retorna todas as dimensões em 0 para input vazio', () => {
    const result = calculateRadarDimensions({
      mxScore: 0,
      consistencyScores: [],
      mentalScores: [],
      physicalScores: [],
      setupRegistros30d: 0,
    });
    expect(result.performance).toBe(0);
    expect(result.consistency).toBe(0);
    expect(result.mental).toBe(0);
    expect(result.physical).toBe(0);
    expect(result.setup).toBe(0);
  });

  it('performance = mxScore / 100', () => {
    const result = calculateRadarDimensions({
      mxScore: 750,
      consistencyScores: [],
      mentalScores: [],
      physicalScores: [],
      setupRegistros30d: 0,
    });
    expect(result.performance).toBe(7.5);
  });

  it('validateMentalPhysicalInput aceita [1, 10]', () => {
    for (let i = 1; i <= 10; i++) {
      expect(validateMentalPhysicalInput(i)).toBe(true);
    }
  });

  it('validateMentalPhysicalInput rejeita fora de [1, 10]', () => {
    expect(validateMentalPhysicalInput(0)).toBe(false);
    expect(validateMentalPhysicalInput(11)).toBe(false);
    expect(validateMentalPhysicalInput(5.5)).toBe(false);
  });
});

describe('Property 12: Dimensões do Radar em [0, 10]', () => {
  it('todas as dimensões sempre em [0, 10]', () => {
    fc.assert(
      fc.property(
        fc.record({
          mxScore: fc.integer({ min: 0, max: 1000 }),
          consistencyScores: fc.array(fc.integer({ min: 0, max: 100 }), { maxLength: 10 }),
          mentalScores: fc.array(fc.integer({ min: 1, max: 10 }), { maxLength: 10 }),
          physicalScores: fc.array(fc.integer({ min: 1, max: 10 }), { maxLength: 10 }),
          setupRegistros30d: fc.integer({ min: 0, max: 20 }),
        }),
        (input: RadarInput) => {
          const r = calculateRadarDimensions(input);
          return r.performance >= 0 && r.performance <= 10
            && r.consistency >= 0 && r.consistency <= 10
            && r.mental >= 0 && r.mental <= 10
            && r.physical >= 0 && r.physical <= 10
            && r.setup >= 0 && r.setup <= 10;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 13: Validação Mental/Físico', () => {
  it('valores fora de [1, 10] rejeitados', () => {
    fc.assert(
      fc.property(
        fc.integer().filter(v => v < 1 || v > 10),
        (value) => !validateMentalPhysicalInput(value)
      ),
      { numRuns: 100 }
    );
  });

  it('valores em [1, 10] aceitos', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        (value) => validateMentalPhysicalInput(value)
      ),
      { numRuns: 100 }
    );
  });
});

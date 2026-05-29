import { describe, it, expect } from 'vitest';
import { createSetupSchema } from '../setups/setups.schema.js';

describe('Setups Schema Validation', () => {
  it('aceita setup mínimo (apenas terrain)', () => {
    const result = createSetupSchema.safeParse({ terrain: 'mud' });
    expect(result.success).toBe(true);
  });

  it('aceita setup completo', () => {
    const result = createSetupSchema.safeParse({
      terrain: 'sand',
      frontCompressionClicks: 12,
      frontReboundClicks: 8,
      rearCompressionClicks: 14,
      rearReboundClicks: 10,
      rearLinkHeightMm: 100.5,
      frontTirePressure: 0.9,
      rearTirePressure: 0.85,
      tireBrandModel: 'Pirelli Scorpion MX32',
      notes: 'Bom para barro molhado',
    });
    expect(result.success).toBe(true);
  });

  it('rejeita terrain inválido', () => {
    const result = createSetupSchema.safeParse({ terrain: 'rock' });
    expect(result.success).toBe(false);
  });

  it('rejeita cliques > 30', () => {
    const result = createSetupSchema.safeParse({
      terrain: 'mixed',
      frontCompressionClicks: 35,
    });
    expect(result.success).toBe(false);
  });

  it('rejeita pressão fora do range', () => {
    const result = createSetupSchema.safeParse({
      terrain: 'mud',
      frontTirePressure: 3.0,
    });
    expect(result.success).toBe(false);
  });
});

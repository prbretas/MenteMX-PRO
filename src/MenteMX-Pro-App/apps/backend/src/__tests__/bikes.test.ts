import { describe, it, expect } from 'vitest';
import { createBikeSchema, updateBikeSchema } from '../bikes/bikes.schema.js';

describe('Bikes Schema Validation', () => {
  describe('createBikeSchema', () => {
    it('aceita dados válidos', () => {
      const result = createBikeSchema.safeParse({
        brand: 'Honda',
        model: 'CRF 250R',
        year: 2024,
        displacementCc: 250,
      });
      expect(result.success).toBe(true);
    });

    it('rejeita marca vazia', () => {
      const result = createBikeSchema.safeParse({
        brand: '',
        model: 'CRF 250R',
        year: 2024,
        displacementCc: 250,
      });
      expect(result.success).toBe(false);
    });

    it('rejeita ano fora do range (< 1990)', () => {
      const result = createBikeSchema.safeParse({
        brand: 'Honda',
        model: 'CRF 250R',
        year: 1980,
        displacementCc: 250,
      });
      expect(result.success).toBe(false);
    });

    it('rejeita ano fora do range (> 2030)', () => {
      const result = createBikeSchema.safeParse({
        brand: 'Honda',
        model: 'CRF 250R',
        year: 2031,
        displacementCc: 250,
      });
      expect(result.success).toBe(false);
    });

    it('rejeita cilindrada fora do range (< 50)', () => {
      const result = createBikeSchema.safeParse({
        brand: 'Honda',
        model: 'CRF 50',
        year: 2024,
        displacementCc: 30,
      });
      expect(result.success).toBe(false);
    });

    it('rejeita cilindrada fora do range (> 500)', () => {
      const result = createBikeSchema.safeParse({
        brand: 'KTM',
        model: 'SX-F 600',
        year: 2024,
        displacementCc: 600,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updateBikeSchema', () => {
    it('aceita atualização parcial (apenas marca)', () => {
      const result = updateBikeSchema.safeParse({
        brand: 'Yamaha',
      });
      expect(result.success).toBe(true);
    });

    it('aceita objeto vazio', () => {
      const result = updateBikeSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });
});

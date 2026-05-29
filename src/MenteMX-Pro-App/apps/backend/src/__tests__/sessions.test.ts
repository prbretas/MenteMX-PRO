import { describe, it, expect } from 'vitest';
import { createSessionSchema, addLapSchema, endSessionSchema } from '../sessions/sessions.schema.js';

describe('Sessions Schema Validation', () => {
  describe('createSessionSchema', () => {
    it('aceita sessão sem bikeId e eventId', () => {
      const result = createSessionSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('aceita sessão com bikeId válido', () => {
      const result = createSessionSchema.safeParse({
        bikeId: '550e8400-e29b-41d4-a716-446655440000',
      });
      expect(result.success).toBe(true);
    });

    it('rejeita bikeId inválido', () => {
      const result = createSessionSchema.safeParse({
        bikeId: 'not-a-uuid',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('addLapSchema', () => {
    it('aceita tempo válido (90 segundos)', () => {
      const result = addLapSchema.safeParse({ lapTimeMs: 90000 });
      expect(result.success).toBe(true);
    });

    it('rejeita tempo < 10 segundos', () => {
      const result = addLapSchema.safeParse({ lapTimeMs: 5000 });
      expect(result.success).toBe(false);
    });

    it('rejeita tempo negativo', () => {
      const result = addLapSchema.safeParse({ lapTimeMs: -1 });
      expect(result.success).toBe(false);
    });

    it('rejeita tempo decimal', () => {
      const result = addLapSchema.safeParse({ lapTimeMs: 90000.5 });
      expect(result.success).toBe(false);
    });
  });

  describe('endSessionSchema', () => {
    it('aceita sem scores', () => {
      const result = endSessionSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('aceita mentalScore válido (1-10)', () => {
      const result = endSessionSchema.safeParse({ mentalScore: 7 });
      expect(result.success).toBe(true);
    });

    it('rejeita mentalScore fora do range (0)', () => {
      const result = endSessionSchema.safeParse({ mentalScore: 0 });
      expect(result.success).toBe(false);
    });

    it('rejeita mentalScore fora do range (11)', () => {
      const result = endSessionSchema.safeParse({ mentalScore: 11 });
      expect(result.success).toBe(false);
    });

    it('aceita physicalScore válido', () => {
      const result = endSessionSchema.safeParse({ physicalScore: 5 });
      expect(result.success).toBe(true);
    });
  });
});

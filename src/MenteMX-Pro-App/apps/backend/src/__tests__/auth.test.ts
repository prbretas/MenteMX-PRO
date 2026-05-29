import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from '../auth/auth.schema.js';

describe('Auth Schema Validation', () => {
  describe('registerSchema', () => {
    it('aceita dados válidos', () => {
      const result = registerSchema.safeParse({
        name: 'João Piloto',
        email: 'joao@mentemx.com',
        password: '123456',
      });
      expect(result.success).toBe(true);
    });

    it('rejeita nome curto', () => {
      const result = registerSchema.safeParse({
        name: 'J',
        email: 'joao@mentemx.com',
        password: '123456',
      });
      expect(result.success).toBe(false);
    });

    it('rejeita email inválido', () => {
      const result = registerSchema.safeParse({
        name: 'João',
        email: 'nao-e-email',
        password: '123456',
      });
      expect(result.success).toBe(false);
    });

    it('rejeita senha curta', () => {
      const result = registerSchema.safeParse({
        name: 'João',
        email: 'joao@mentemx.com',
        password: '123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('aceita dados válidos', () => {
      const result = loginSchema.safeParse({
        email: 'joao@mentemx.com',
        password: 'minha-senha',
      });
      expect(result.success).toBe(true);
    });

    it('rejeita email inválido', () => {
      const result = loginSchema.safeParse({
        email: 'invalido',
        password: 'minha-senha',
      });
      expect(result.success).toBe(false);
    });

    it('rejeita senha vazia', () => {
      const result = loginSchema.safeParse({
        email: 'joao@mentemx.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });
});

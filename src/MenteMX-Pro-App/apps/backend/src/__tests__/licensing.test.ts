import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateLicenseKey, isValidKeyFormat } from '../licensing/licensing.service.js';
import { generateKeySchema, activateKeySchema } from '../licensing/licensing.schema.js';

describe('License Key Generation', () => {
  it('gera key no formato MXPRO-XXXX-XXXX-XXXX', () => {
    const key = generateLicenseKey();
    expect(isValidKeyFormat(key)).toBe(true);
  });

  it('keys geradas são únicas (100 keys)', () => {
    const keys = new Set<string>();
    for (let i = 0; i < 100; i++) {
      keys.add(generateLicenseKey());
    }
    expect(keys.size).toBe(100);
  });

  it('property: formato sempre válido', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const key = generateLicenseKey();
        return isValidKeyFormat(key);
      }),
      { numRuns: 100 }
    );
  });
});

describe('License Key Schema Validation', () => {
  it('generateKeySchema aceita plano válido', () => {
    expect(generateKeySchema.safeParse({ plan: 'monthly' }).success).toBe(true);
    expect(generateKeySchema.safeParse({ plan: 'yearly' }).success).toBe(true);
    expect(generateKeySchema.safeParse({ plan: 'one-time' }).success).toBe(true);
  });

  it('generateKeySchema rejeita plano inválido', () => {
    expect(generateKeySchema.safeParse({ plan: 'free' }).success).toBe(false);
  });

  it('activateKeySchema aceita key válida', () => {
    const result = activateKeySchema.safeParse({
      code: 'MXPRO-AB12-CD34-EF56',
      deviceId: 'device-123',
      deviceType: 'mobile',
    });
    expect(result.success).toBe(true);
  });

  it('activateKeySchema rejeita formato inválido', () => {
    const result = activateKeySchema.safeParse({
      code: 'INVALID-KEY',
      deviceId: 'device-123',
      deviceType: 'mobile',
    });
    expect(result.success).toBe(false);
  });
});

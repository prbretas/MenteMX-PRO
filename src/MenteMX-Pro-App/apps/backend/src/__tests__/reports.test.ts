import { describe, it, expect } from 'vitest';
import { generateReportSchema } from '../reports/reports.schema.js';

describe('Reports Schema Validation', () => {
  it('aceita período 7d', () => {
    expect(generateReportSchema.safeParse({ period: '7d' }).success).toBe(true);
  });

  it('aceita período 30d', () => {
    expect(generateReportSchema.safeParse({ period: '30d' }).success).toBe(true);
  });

  it('aceita período 90d', () => {
    expect(generateReportSchema.safeParse({ period: '90d' }).success).toBe(true);
  });

  it('aceita período custom com datas', () => {
    const result = generateReportSchema.safeParse({
      period: 'custom',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
    });
    expect(result.success).toBe(true);
  });

  it('rejeita período inválido', () => {
    expect(generateReportSchema.safeParse({ period: '15d' }).success).toBe(false);
  });
});

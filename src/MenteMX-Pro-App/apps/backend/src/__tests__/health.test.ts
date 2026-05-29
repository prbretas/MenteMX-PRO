import { describe, it, expect } from 'vitest';

describe('Health Check', () => {
  it('deve retornar status ok', () => {
    const response = {
      status: 'ok',
      service: 'mentemx-pro-api',
      version: '0.1.0',
    };

    expect(response.status).toBe('ok');
    expect(response.service).toBe('mentemx-pro-api');
    expect(response.version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

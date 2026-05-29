import { describe, it, expect } from 'vitest';
import { formatLapTime, parseLapTime } from '../format.js';

describe('formatLapTime', () => {
  it('formata 0ms como 00:00.0', () => {
    expect(formatLapTime(0)).toBe('00:00.0');
  });

  it('formata 90000ms (1:30) como 01:30.0', () => {
    expect(formatLapTime(90000)).toBe('01:30.0');
  });

  it('formata 125300ms como 02:05.3', () => {
    expect(formatLapTime(125300)).toBe('02:05.3');
  });

  it('lança erro para tempo negativo', () => {
    expect(() => formatLapTime(-1)).toThrow('Tempo não pode ser negativo');
  });
});

describe('parseLapTime', () => {
  it('converte 01:30.0 para 90000ms', () => {
    expect(parseLapTime('01:30.0')).toBe(90000);
  });

  it('converte 02:05.3 para 125300ms', () => {
    expect(parseLapTime('02:05.3')).toBe(125300);
  });

  it('lança erro para formato inválido', () => {
    expect(() => parseLapTime('1:30.0')).toThrow('Formato inválido');
  });

  it('lança erro para segundos >= 60', () => {
    expect(() => parseLapTime('01:60.0')).toThrow('Segundos inválidos');
  });
});

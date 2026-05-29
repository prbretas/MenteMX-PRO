import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { formatLapTime, parseLapTime } from '../format.js';

describe('Property 3: Formato de tempo de volta MM:SS.d', () => {
  it('formatLapTime produz string no formato MM:SS.d para qualquer tempo válido (0-5999900ms)', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 5999900 }), (ms) => {
        const result = formatLapTime(ms);
        const regex = /^\d{2}:\d{2}\.\d$/;
        return regex.test(result);
      }),
      { numRuns: 100 }
    );
  });

  it('round-trip: parseLapTime(formatLapTime(ms)) preserva o valor com precisão de décimos', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 5999900 }), (ms) => {
        const rounded = Math.floor(ms / 100) * 100;
        const formatted = formatLapTime(rounded);
        const parsed = parseLapTime(formatted);
        return parsed === rounded;
      }),
      { numRuns: 100 }
    );
  });

  it('formatLapTime: segundos sempre entre 0-59, décimos entre 0-9', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 5999900 }), (ms) => {
        const result = formatLapTime(ms);
        const [mmss, d] = result.split('.');
        const [, ss] = mmss.split(':').map(Number);
        return ss >= 0 && ss <= 59 && Number(d) >= 0 && Number(d) <= 9;
      }),
      { numRuns: 100 }
    );
  });

  it('formatLapTime é determinístico: mesma entrada = mesma saída', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 5999900 }), (ms) => {
        return formatLapTime(ms) === formatLapTime(ms);
      }),
      { numRuns: 100 }
    );
  });
});

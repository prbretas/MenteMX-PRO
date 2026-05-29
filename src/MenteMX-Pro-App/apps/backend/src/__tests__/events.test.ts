import { describe, it, expect } from 'vitest';
import { createEventSchema } from '../events/events.schema.js';

describe('Events Schema Validation', () => {
  it('aceita evento de treino válido', () => {
    const result = createEventSchema.safeParse({
      name: 'Treino Interlagos',
      eventDate: '2024-06-15',
      type: 'training',
    });
    expect(result.success).toBe(true);
  });

  it('aceita corrida com todos os campos', () => {
    const result = createEventSchema.safeParse({
      name: 'Copa Brasil MX',
      eventDate: '2024-07-20',
      type: 'race',
      location: 'Indaiatuba-SP',
      startPosition: 3,
      holeshot: true,
      finalPosition: 1,
      status: 'completed',
    });
    expect(result.success).toBe(true);
  });

  it('rejeita nome vazio', () => {
    const result = createEventSchema.safeParse({
      name: '',
      eventDate: '2024-06-15',
      type: 'training',
    });
    expect(result.success).toBe(false);
  });

  it('rejeita tipo inválido', () => {
    const result = createEventSchema.safeParse({
      name: 'Evento',
      eventDate: '2024-06-15',
      type: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it('rejeita posição negativa', () => {
    const result = createEventSchema.safeParse({
      name: 'Corrida',
      eventDate: '2024-06-15',
      type: 'race',
      startPosition: 0,
    });
    expect(result.success).toBe(false);
  });
});

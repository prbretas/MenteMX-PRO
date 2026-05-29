import { z } from 'zod';

export const createSessionSchema = z.object({
  bikeId: z.string().uuid().optional(),
  eventId: z.string().uuid().optional(),
});

export const addLapSchema = z.object({
  lapTimeMs: z.number().int().min(10000, 'Tempo mínimo: 10 segundos'),
});

export const endSessionSchema = z.object({
  mentalScore: z.number().int().min(1).max(10).optional(),
  physicalScore: z.number().int().min(1).max(10).optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type AddLapInput = z.infer<typeof addLapSchema>;
export type EndSessionInput = z.infer<typeof endSessionSchema>;

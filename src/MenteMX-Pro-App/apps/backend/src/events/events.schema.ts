import { z } from 'zod';

export const createEventSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  eventDate: z.string().min(1, 'Data é obrigatória'),
  type: z.enum(['race', 'training']),
  location: z.string().optional(),
  startPosition: z.number().int().min(1).optional(),
  holeshot: z.boolean().optional(),
  finalPosition: z.number().int().min(1).optional(),
  status: z.enum(['scheduled', 'completed']).default('scheduled'),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

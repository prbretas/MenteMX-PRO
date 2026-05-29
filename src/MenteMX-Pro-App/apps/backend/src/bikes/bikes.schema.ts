import { z } from 'zod';

export const createBikeSchema = z.object({
  brand: z.string().min(1, 'Marca é obrigatória'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  year: z.number().int().min(1990).max(2030),
  displacementCc: z.number().int().min(50).max(500),
});

export const updateBikeSchema = createBikeSchema.partial();

export type CreateBikeInput = z.infer<typeof createBikeSchema>;
export type UpdateBikeInput = z.infer<typeof updateBikeSchema>;

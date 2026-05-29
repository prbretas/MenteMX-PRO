import { z } from 'zod';

export const createSetupSchema = z.object({
  bikeId: z.string().uuid().optional(),
  terrain: z.enum(['mud', 'sand', 'mixed']),
  frontCompressionClicks: z.number().int().min(0).max(30).optional(),
  frontReboundClicks: z.number().int().min(0).max(30).optional(),
  rearCompressionClicks: z.number().int().min(0).max(30).optional(),
  rearReboundClicks: z.number().int().min(0).max(30).optional(),
  rearLinkHeightMm: z.number().min(80).max(120).optional(),
  frontTirePressure: z.number().min(0.5).max(2.0).optional(),
  rearTirePressure: z.number().min(0.5).max(2.0).optional(),
  tireBrandModel: z.string().optional(),
  notes: z.string().optional(),
});

export const updateSetupSchema = createSetupSchema.partial();

export type CreateSetupInput = z.infer<typeof createSetupSchema>;

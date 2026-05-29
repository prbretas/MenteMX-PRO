import { z } from 'zod';

export const generateKeySchema = z.object({
  plan: z.enum(['one-time', 'monthly', 'yearly']),
  expiresInDays: z.number().int().min(1).optional(),
});

export const activateKeySchema = z.object({
  code: z.string().regex(/^MXPRO-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/, 'Formato inválido: MXPRO-XXXX-XXXX-XXXX'),
  deviceId: z.string().min(1),
  deviceType: z.enum(['mobile', 'desktop']),
});

export type GenerateKeyInput = z.infer<typeof generateKeySchema>;
export type ActivateKeyInput = z.infer<typeof activateKeySchema>;

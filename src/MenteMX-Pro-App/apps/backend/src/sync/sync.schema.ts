import { z } from 'zod';

export const syncOperationSchema = z.object({
  id: z.string().uuid(),
  deviceId: z.string().min(1),
  opType: z.enum(['INSERT', 'UPDATE', 'DELETE']),
  tableName: z.string().min(1),
  recordId: z.string().min(1),
  payload: z.string(), // JSON stringified
  createdAt: z.string(), // ISO 8601
});

export const syncBatchSchema = z.object({
  operations: z.array(syncOperationSchema).min(1).max(100),
});

export type SyncOperation = z.infer<typeof syncOperationSchema>;
export type SyncBatchInput = z.infer<typeof syncBatchSchema>;

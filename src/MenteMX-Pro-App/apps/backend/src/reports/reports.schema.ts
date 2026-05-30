import { z } from 'zod';

export const generateReportSchema = z.object({
  period: z.enum(['7d', '30d', '90d', 'custom']),
  startDate: z.string().optional(), // required if period = custom
  endDate: z.string().optional(),   // required if period = custom
});

export type GenerateReportInput = z.infer<typeof generateReportSchema>;

export interface ReportData {
  pilotName: string;
  period: string;
  mxScore: number;
  radar: {
    performance: number;
    consistency: number;
    mental: number;
    physical: number;
    setup: number;
  };
  sessions: Array<{
    date: string;
    lapCount: number;
    bestLapMs: number;
    consistencyIndex: number | null;
  }>;
  bestTimeMs: number | null;
  generatedAt: string;
}

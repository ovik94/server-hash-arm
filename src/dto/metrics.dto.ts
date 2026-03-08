import { z } from 'zod';

export const saveMetricsSchema = z.object({
  date: z.string().min(1),
});

export type SaveMetricsDto = z.infer<typeof saveMetricsSchema>;

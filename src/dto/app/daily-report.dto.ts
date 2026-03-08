import { z } from 'zod';

export const dailyReportExpenseSchema = z.object({
  id: z.string().min(1),
  sum: z.string().min(1),
  cashFlowStatement: z.string().min(1),
  comment: z.string().optional(),
  counterparty: z.string().optional(),
});

export const addDailyReportSchema = z.object({
  date: z.string().min(1), // dd.MM.yyyy
  adminName: z.string().min(1),
  ipCash: z.string().min(1),
  ipAcquiring: z.string().min(1),
  oooCash: z.string().min(1),
  oooAcquiring: z.string().min(1),
  yandex: z.string().optional(),
  ipNetmonet: z.string().optional(),
  oooNetmonet: z.string().optional(),
  online: z.string().optional(),
  totalSum: z.string().min(1),
  totalCash: z.string().min(1),
  expenses: z.array(dailyReportExpenseSchema),
  ipCashReceipt: z.string().optional(),
  oooCashReceipt: z.string().optional(),
});

export const updateDailyReportSchema = addDailyReportSchema.extend({
  id: z.string().min(1),
});

export const getReportsQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});

export type AddDailyReportDto = z.infer<typeof addDailyReportSchema>;
export type UpdateDailyReportDto = z.infer<typeof updateDailyReportSchema>;
export type GetReportsQueryDto = z.infer<typeof getReportsQuerySchema>;

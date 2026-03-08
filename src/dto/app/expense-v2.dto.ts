import { z } from 'zod';

export const expenseV2CategorySchema = z.object({
  title: z.string().min(1),
  icon: z.string().min(1),
  counterpartyType: z.string().optional(),
});

export const addExpenseV2Schema = z.object({
  sum: z.string().min(1),
  comment: z.string().optional(),
  counterparty: z.string().optional(),
  category: expenseV2CategorySchema,
});

export const deleteExpenseV2Schema = z.object({
  id: z.string().min(1).optional(),
});

export type AddExpenseV2Dto = z.infer<typeof addExpenseV2Schema>;
export type DeleteExpenseV2Dto = z.infer<typeof deleteExpenseV2Schema>;

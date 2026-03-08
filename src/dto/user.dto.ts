import { z } from 'zod';

export const userBaseSchema = z.object({
  name: z.string().min(1),
  role: z.enum(['admin', 'waiter', 'supervisor', 'teller']),
  phone: z.string().optional(),
  password: z.string().optional(),
});

export const addUserSchema = userBaseSchema;

export const editUserSchema = userBaseSchema.extend({
  id: z.string().min(1),
});

export const deleteUserSchema = z.object({
  id: z.string().min(1),
});

export const loginSchema = z.object({
  id: z.string().min(1),
  password: z.string().min(1),
});

export type AddUserDto = z.infer<typeof addUserSchema>;
export type EditUserDto = z.infer<typeof editUserSchema>;
export type DeleteUserDto = z.infer<typeof deleteUserSchema>;
export type LoginDto = z.infer<typeof loginSchema>;

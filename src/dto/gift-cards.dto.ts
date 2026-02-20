import { z } from "zod";

export const giftCardsListQuerySchema = z.object({
  nominal: z.string().optional(),
});

export const giftCardsAddSchema = z.object({
  count: z.number().int().positive(),
  start: z.number().int(),
  nominal: z.number().positive(),
});

export const giftCardNumberSchema = z.object({
  number: z.union([z.number(), z.string()]),
});

export type GiftCardsListQueryDto = z.infer<typeof giftCardsListQuerySchema>;
export type GiftCardsAddDto = z.infer<typeof giftCardsAddSchema>;
export type GiftCardNumberDto = z.infer<typeof giftCardNumberSchema>;


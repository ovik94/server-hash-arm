import { z } from "zod";

export const statementCompanyTypeSchema = z.enum([
  "ipHashLavash",
  "oooHashLavash",
  "ipFoodTrack",
]);

export const statementProcessSchema = z.object({
  companyType: statementCompanyTypeSchema,
  operations: z
    .array(
      z.object({
        operation: z.any(),
      })
    )
    .nonempty(),
});

export type StatementProcessDto = z.infer<typeof statementProcessSchema>;


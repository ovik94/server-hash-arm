import { Document, Model, Schema, model } from "mongoose";

export type CashFlowType = "receipts" | "expenses" | "info";

export interface CashFlowStatement {
  name: string;
  type: CashFlowType;
  paymentTypes?: string[];
  purposeOfPayment?: string[];
}

export interface CashFlowStatementDocument
  extends CashFlowStatement,
    Document {}

const cashFlowStatementSchema = new Schema<CashFlowStatementDocument>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["receipts", "expenses", "info"],
    },
    paymentTypes: {
      type: [String],
      default: undefined,
    },
    purposeOfPayment: {
      type: [String],
      default: undefined,
    },
  },
  { versionKey: false }
);

export const CashFlowStatementModel: Model<CashFlowStatementDocument> =
  model<CashFlowStatementDocument>(
    "CashFlowStatement",
    cashFlowStatementSchema
  );


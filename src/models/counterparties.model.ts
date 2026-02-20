import { Document, Model, Schema, model } from "mongoose";

export type CounterpartyType = "kitchen" | "service" | "manager" | "provider";

export interface Counterparty {
  name: string;
  type: CounterpartyType;
  companyName?: string;
  phone?: string;
  description?: string;
}

export interface CounterpartyDocument extends Counterparty, Document {}

const counterpartiesSchema = new Schema<CounterpartyDocument>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["kitchen", "service", "manager", "provider"],
    },
    companyName: String,
    phone: String,
    description: String,
  },
  { versionKey: false }
);

export const CounterpartiesModel: Model<CounterpartyDocument> =
  model<CounterpartyDocument>("Counterparties", counterpartiesSchema);


import { Document, Model, Schema, model } from "mongoose";

export type GiftCardStatus = "NOT_ACTIVATED" | "ACTIVATED";

export interface GiftCard {
  value: number;
  number: number;
  code: number;
  activationDate?: string;
  status: GiftCardStatus;
}

export interface GiftCardDocument extends GiftCard, Document {}

const giftCardsSchema = new Schema<GiftCardDocument>(
  {
    value: { type: Number, required: true },
    number: { type: Number, required: true },
    code: { type: Number, required: true },
    activationDate: String,
    status: {
      type: String,
      required: true,
      enum: ["NOT_ACTIVATED", "ACTIVATED"],
    },
  },
  {
    versionKey: false,
  }
);

export const GiftCardsModel: Model<GiftCardDocument> =
  model<GiftCardDocument>("GiftCards", giftCardsSchema);


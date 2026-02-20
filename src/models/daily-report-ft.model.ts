import { Document, Model, Schema, model } from "mongoose";

export interface DailyReportFT {
  date: string;
  adminName: string;
  cash: string;
  acquiring: string;
  yandex?: string;
  totalSum: string;
  comment?: string;
}

export interface DailyReportFTDocument extends DailyReportFT, Document {
  id: string;
}

const dailyReportFTSchema = new Schema<DailyReportFTDocument>(
  {
    date: { type: String, required: true },
    adminName: { type: String, required: true },
    cash: { type: String, required: true },
    acquiring: { type: String, required: true },
    yandex: { type: String, required: false },
    totalSum: { type: String, required: true },
    comment: { type: String, required: false },
  },
  {
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

export const DailyReportFTModel: Model<DailyReportFTDocument> =
  model<DailyReportFTDocument>("DailyReportFT", dailyReportFTSchema);


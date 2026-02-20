import { Document, Model, Schema, model } from "mongoose";

export interface DailyReportExpense {
  id: string;
  sum: string;
  cashFlowStatement: string;
  comment?: string;
  counterparty?: string;
}

export interface DailyReport {
  date: string;
  adminName: string;
  ipCash: string;
  ipAcquiring: string;
  oooCash: string;
  oooAcquiring: string;
  yandex?: string;
  ipNetmonet?: string;
  oooNetmonet?: string;
  online?: string;
  totalSum: string;
  totalCash: string;
  expenses: DailyReportExpense[];
}

export interface DailyReportDocument extends DailyReport, Document {
  id: string;
}

const dailyReportSchema = new Schema<DailyReportDocument>(
  {
    date: { type: String, required: true },
    adminName: { type: String, required: true },
    ipCash: { type: String, required: true },
    ipAcquiring: { type: String, required: true },
    oooCash: { type: String, required: true },
    oooAcquiring: { type: String, required: true },
    yandex: String,
    ipNetmonet: String,
    oooNetmonet: String,
    online: String,
    totalSum: { type: String, required: true },
    totalCash: { type: String, required: true },
    expenses: [
      {
        id: { type: String, required: true },
        sum: { type: String, required: true },
        cashFlowStatement: { type: String, required: true },
        comment: String,
        counterparty: String,
      },
    ],
  },
  {
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        // сохранить поведение старой модели:
        // добавляем поле id и убираем _id
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

export const DailyReportModel: Model<DailyReportDocument> =
  model<DailyReportDocument>("DailyReport", dailyReportSchema);


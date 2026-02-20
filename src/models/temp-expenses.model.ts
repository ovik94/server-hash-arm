import { Document, Model, Schema, model } from "mongoose";

export interface TempExpenseCategory {
  title: string;
  icon: string;
  counterpartyType?: string;
}

export interface TempExpense {
  sum: string;
  comment?: string;
  counterparty?: string;
  category: TempExpenseCategory;
}

export interface TempExpenseDocument extends TempExpense, Document {
  id: string;
}

const tempExpensesSchema = new Schema<TempExpenseDocument>(
  {
    sum: { type: String, required: true },
    comment: String,
    counterparty: String,
    category: {
      title: { type: String, required: true },
      icon: { type: String, required: true },
      counterpartyType: String,
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        // сохранить предыдущее поведение: добавить id и убрать служебные поля
        ret.id = ret._id;
        if (ret.category && ret.category._id) {
          delete ret.category._id;
        }
        delete ret._id;
      },
    },
  }
);

export const TempExpensesModel: Model<TempExpenseDocument> =
  model<TempExpenseDocument>("TempExpenses", tempExpensesSchema);


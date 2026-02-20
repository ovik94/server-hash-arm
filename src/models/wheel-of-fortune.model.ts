import { Document, Model, Schema, model } from "mongoose";

export interface WheelOfFortuneContent {
  title: string;
  color: string;
}

export interface WheelOfFortuneContentDocument
  extends WheelOfFortuneContent,
  Document { }

export interface WheelOfFortune {
  code: string;
  description: string;
  // Хранится массив ObjectId или поддокументов Mongoose – типизируем как any[]
  // чтобы не конфликтовать с фактическим типом, который добавляет Mongoose.
  content: any[];
}

export interface WheelOfFortuneDocument
  extends WheelOfFortune,
  Document { }

const wheelOfFortuneContentSchema = new Schema<WheelOfFortuneContentDocument>(
  {
    title: { type: String, required: true },
    color: { type: String, required: true },
  },
  { versionKey: false }
);

export const WheelOfFortuneContentModel: Model<WheelOfFortuneContentDocument> =
  model<WheelOfFortuneContentDocument>(
    "WheelOfFortuneContent",
    wheelOfFortuneContentSchema
  );

const wheelOfFortuneSchema = new Schema<WheelOfFortuneDocument>(
  {
    code: { type: String, required: true },
    description: { type: String, required: true },
    content: [
      {
        type: Schema.Types.ObjectId,
        ref: "WheelOfFortuneContent",
      },
    ],
  } as any,
  { versionKey: false }
);

export const WheelOfFortuneModel: Model<WheelOfFortuneDocument> =
  model<WheelOfFortuneDocument>("WheelOfFortune", wheelOfFortuneSchema);


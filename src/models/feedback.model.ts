import { Document, Model, Schema, model } from 'mongoose';

export type FeedbackType =
  | 'textInput'
  | 'textArea'
  | 'select'
  | 'rating'
  | 'selectOtherVariant'
  | 'selectGroupString'
  | 'selectGroupNumber';

export interface Feedback {
  title: string;
  subtitle?: string;
  type: FeedbackType;
  options?: string[];
  required?: boolean;
}

export interface FeedbackDocument extends Feedback, Document {}

const feedbackSchema = new Schema<FeedbackDocument>(
  {
    title: { type: String, required: true },
    subtitle: String,
    type: {
      type: String,
      required: true,
      enum: [
        'textInput',
        'textArea',
        'select',
        'rating',
        'selectOtherVariant',
        'selectGroupString',
        'selectGroupNumber',
      ],
    },
    options: [String],
    required: Boolean,
  },
  { versionKey: false }
);

export const FeedbackModel: Model<FeedbackDocument> = model<FeedbackDocument>(
  'Feedback',
  feedbackSchema
);

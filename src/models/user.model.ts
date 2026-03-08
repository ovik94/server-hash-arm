import { Document, Model, Schema, model } from 'mongoose';

export interface User {
  name: string;
  role: 'admin' | 'waiter' | 'supervisor' | 'teller';
  phone?: string;
  password?: string;
}

export interface UserDocument extends User, Document {}

const usersSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'waiter', 'supervisor', 'teller'],
    },
    phone: { type: String, required: false },
    password: { type: String, required: false },
  },
  { versionKey: false }
);

export const UserModel: Model<UserDocument> = model<UserDocument>(
  'Users',
  usersSchema
);

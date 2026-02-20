import { Document, Model, Schema, model } from "mongoose";

export interface Role {
  name: string;
  privilege: string[];
}

export interface RoleDocument extends Role, Document {}

const rolesSchema = new Schema<RoleDocument>(
  {
    name: { type: String, required: true },
    privilege: { type: [String], required: true },
  },
  { versionKey: false }
);

export const RoleModel: Model<RoleDocument> = model<RoleDocument>(
  "Roles",
  rolesSchema
);


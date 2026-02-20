import { CounterpartiesModel } from "../models/counterparties.model";

export async function findByType(type?: string): Promise<any[]> {
  const query = type ? { type } : {};
  return CounterpartiesModel.find(query).sort({ type: 1 }).exec();
}

export async function create(data: any) {
  const doc = new CounterpartiesModel(data);
  return doc.save();
}

export async function findById(id: string) {
  return CounterpartiesModel.findById(id);
}

export async function save(doc: any) {
  return doc.save();
}

export async function deleteById(id: string) {
  return CounterpartiesModel.deleteOne({ _id: id });
}

export async function findAll(): Promise<any[]> {
  return CounterpartiesModel.find({}).exec();
}


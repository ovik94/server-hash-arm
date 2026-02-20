import { CashFlowStatementModel } from "../models/cash-flow-statement.model";

export async function findByType(type?: string) {
  const query = type ? { type } : {};
  return CashFlowStatementModel.find(query).sort({ type: 1 }).exec();
}

export async function create(data: any) {
  const doc = new CashFlowStatementModel(data);
  return doc.save();
}

export async function findById(id: string) {
  return CashFlowStatementModel.findById(id);
}

export async function save(doc: any) {
  return doc.save();
}

export async function deleteById(id: string) {
  return CashFlowStatementModel.deleteOne({ _id: id });
}


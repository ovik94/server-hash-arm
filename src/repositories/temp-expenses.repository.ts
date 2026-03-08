import { TempExpensesModel } from '../models/temp-expenses.model';

export async function findAll() {
  return TempExpensesModel.find();
}

export async function create(data: any) {
  const newExpense = new TempExpensesModel(data);
  return newExpense.save();
}

export async function deleteById(id: string) {
  return TempExpensesModel.deleteOne({ _id: id });
}

export async function deleteAll() {
  return TempExpensesModel.deleteMany();
}

import { expensesGApiController } from "../../lib";

export async function getExpenses() {
  const reports = await expensesGApiController.getExpenses();
  return reports.map((item: any) => ({
    ...item,
    category: item.category ? JSON.parse(item.category) : {},
  }));
}

export async function addExpense(body: any) {
  await expensesGApiController.addExpense(body);
}

export async function deleteExpense(id: string) {
  await expensesGApiController.deleteExpense(id);
}


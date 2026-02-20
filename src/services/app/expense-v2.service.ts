import * as tempExpensesRepository from "../../repositories/temp-expenses.repository";

export async function getExpenses() {
  return tempExpensesRepository.findAll();
}

export async function addExpense(body: any) {
  await tempExpensesRepository.create(body);
  return tempExpensesRepository.findAll();
}

export async function deleteExpense(id?: string) {
  if (!id) {
    await tempExpensesRepository.deleteAll();
  } else {
    await tempExpensesRepository.deleteById(id);
  }

  return tempExpensesRepository.findAll();
}


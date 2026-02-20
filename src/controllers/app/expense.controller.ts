import { Request, Response } from "express";
import * as expenseService from "../../services/app";

export async function getExpenses(req: Request, res: Response) {
  try {
    const data = await expenseService.getExpenses();
    return res.json({ status: "OK", data });
  } catch (err: any) {
    return res.json({ status: "ERROR", message: err.message });
  }
}

export async function addExpense(req: Request, res: Response) {
  try {
    await expenseService.addExpense(req.body);
    return res.json({ status: "OK" });
  } catch (err: any) {
    return res.json({ status: "ERROR", message: err.message });
  }
}

export async function deleteExpense(req: Request, res: Response) {
  const { id } = req.body || {};

  if (!id) {
    return res.json({ status: "ERROR", message: "Не указан id расхода" });
  }

  try {
    await expenseService.deleteExpense(id);
    return res.json({ status: "OK" });
  } catch (err: any) {
    return res.json({ status: "ERROR", message: err.message });
  }
}


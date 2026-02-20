import { Request, Response } from "express";
import * as expenseV2Service from "../../services/app";
import {
  addExpenseV2Schema,
  deleteExpenseV2Schema,
} from "../../dto/app";

function formatZodError(err: any): string {
  if (err?.issues?.length) {
    return err.issues[0].message;
  }
  return "Validation error";
}

export async function getExpenses(req: Request, res: Response) {
  try {
    const expenses = await expenseV2Service.getExpenses();
    return res.json({ status: "OK", data: expenses });
  } catch (err: any) {
    return res.json({ status: "ERROR", message: err._message });
  }
}

export async function addExpense(req: Request, res: Response) {
  try {
    const body = addExpenseV2Schema.parse(req.body);
    const expenses = await expenseV2Service.addExpense(body);
    return res.json({ status: "OK", data: expenses });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.json({ status: "ERROR", message: formatZodError(err) });
    }
    return res.json({ status: "ERROR", message: err._message });
  }
}

export async function deleteExpense(req: Request, res: Response) {
  try {
    const body = deleteExpenseV2Schema.parse(req.body);
    const expenses = await expenseV2Service.deleteExpense(body.id);
    return res.json({ status: "OK", data: expenses });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.json({ status: "ERROR", message: formatZodError(err) });
    }
    return res.json({ status: "ERROR", message: err._message });
  }
}


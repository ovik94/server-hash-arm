import * as dailyReportRepository from "../../repositories/daily-report.repository";
import {
  financialOperationsGApiController,
  dailyReportsGApiController,
} from "../../lib";
import { transformDateString } from "../../utils";

export async function getReports(params: { from?: string; to?: string }) {
  const { from, to } = params;
  const findQuery: any = {};

  if (from && to) {
    findQuery.date = {
      $gte: transformDateString(from),
      $lte: transformDateString(to),
    };
  } else if (from) {
    findQuery.date = {
      $gte: transformDateString(from),
    };
  } else if (to) {
    findQuery.date = {
      $lte: transformDateString(to),
    };
  }

  const reports = await dailyReportRepository.findReportsByDateRange(
    findQuery
  );
  return reports;
}

export async function addReport(body: any) {
  const date = transformDateString(body.date);

  const newReport = await dailyReportRepository.createReport({
    ...body,
    date,
  });

  for (const expense of body.expenses) {
    await financialOperationsGApiController.addFinancialOperation([
      expense.id,
      body.date,
      expense.cashFlowStatement,
      "Наличные",
      expense.sum.replace(".", ","),
      expense.counterparty || "",
      expense.comment || "",
    ]);
  }

  for (const receipt of ["ipCash", "oooCash"] as const) {
    if (body[receipt]) {
      await financialOperationsGApiController.addFinancialOperation([
        `${newReport.id}-${receipt}`,
        body.date,
        "Поступления наличные средства",
        "Наличные",
        body[receipt].replace(".", ","),
        "",
        receipt === "ipCash" ? "по ИП" : "по ООО",
      ]);
    }
  }

  return newReport;
}

export async function updateReport(body: any) {
  const report = await dailyReportRepository.findReportById(body.id);
  const reportExpenses = report?.expenses || [];

  const operations =
    await financialOperationsGApiController.getFinancialOperations();

  for (const expense of body.expenses) {
    const hasExpense = reportExpenses.find(
      (exp: any) => exp.id === expense.id
    );
    if (hasExpense) {
      await financialOperationsGApiController.updateFinancialOperation(
        expense.id,
        [
          body.date,
          expense.cashFlowStatement,
          "Наличные",
          expense.sum.replace(".", ","),
          expense.counterparty || "",
          expense.comment,
        ],
        operations
      );
    } else {
      await financialOperationsGApiController.addFinancialOperation([
        expense.id,
        body.date,
        expense.cashFlowStatement,
        "Наличные",
        expense.sum.replace(".", ","),
        expense.counterparty || "",
        expense.comment,
      ]);
    }
  }

  for (const receipt of ["ipCash", "oooCash"] as const) {
    if (body[receipt]) {
      await financialOperationsGApiController.updateFinancialOperation(
        `${report.id}-${receipt}`,
        [
          body.date,
          "Поступления наличные средства",
          "Наличные",
          body[receipt].replace(".", ","),
          "",
          receipt === "ipCash" ? "по ИП" : "по ООО",
        ],
        operations
      );
    }
  }

  const idsToDelete: string[] = [];
  reportExpenses.forEach((i: any) => {
    if (!body.expenses.find((j: any) => j.id === i.id)) {
      idsToDelete.push(i.id);
    }
  });

  if (idsToDelete.length) {
    for (const id of idsToDelete) {
      await financialOperationsGApiController.deleteFinancialOperation(id);
    }
  }

  const newReport = await dailyReportRepository.updateReportById(body.id, {
    ...body,
    date: transformDateString(body.date),
  });

  return newReport;
}

export async function setNewReports() {
  const reports = await dailyReportsGApiController.getDailyReports();

  const transformReports = reports.map((report: any) => {
    const data = { ...report };
    const online = (data as any).ipOnline;

    delete (data as any).id;
    delete (data as any).ipOnline;
    delete (data as any).expenses;

    return {
      ...data,
      online,
      date: transformDateString((data as any).date),
    };
  });

  await dailyReportRepository.insertMany(transformReports);

  return true;
}


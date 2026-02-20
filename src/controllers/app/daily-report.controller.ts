import { Request, Response } from "express";
import * as dailyReportService from "../../services/app";
import {
  addDailyReportSchema,
  getReportsQuerySchema,
  updateDailyReportSchema,
} from "../../dto";

/**
 * Дата в запросе от клиента приходит в формате dd.MM.yyyy
 * В базу сохраняется в формате yyyy-MM-dd
 */

function formatZodError(err: any): string {
  if (err?.issues?.length) {
    return err.issues[0].message;
  }
  return "Validation error";
}

export async function getReports(req: Request, res: Response) {
  try {
    const { from, to } = getReportsQuerySchema.parse(req.query);
    const reports = await dailyReportService.getReports({ from, to });
    return res.json({ status: "OK", data: reports });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.json({ status: "ERROR", message: formatZodError(err) });
    }
    return res.json({ status: "ERROR", message: err.message });
  }
}

export async function addReport(req: Request, res: Response) {
  try {
    const body = addDailyReportSchema.parse(req.body);
    const newReport = await dailyReportService.addReport(body);
    return res.json({ status: "OK", data: newReport });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.json({ status: "ERROR", message: formatZodError(err) });
    }
    // eslint-disable-next-line no-console
    console.error(err, "error-add-daily-report");
    return res.json({ status: "ERROR", message: err.message });
  }
}

export async function updateReport(req: Request, res: Response) {
  try {
    const body = updateDailyReportSchema.parse(req.body);
    const newReport = await dailyReportService.updateReport(body);
    return res.json({ status: "OK", data: newReport });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.json({ status: "ERROR", message: formatZodError(err) });
    }
    return res.json({ status: "ERROR", message: err.message });
  }
}

export async function setNewReports(req: Request, res: Response) {
  try {
    await dailyReportService.setNewReports();
    return res.json({ status: "OK" });
  } catch (err: any) {
    return res.json({ status: "ERROR", message: err.message });
  }
}



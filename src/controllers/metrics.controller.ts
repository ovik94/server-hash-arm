import { Request, Response } from "express";
import * as metricsService from "../services";
import { saveMetricsSchema } from "../dto";

export async function saveMetrics(req: Request, res: Response) {
  try {
    const { date } = saveMetricsSchema.parse(req.body);
    const data = await metricsService.saveMetrics(date);
    return res.json({ status: "OK", data });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.json({
        status: "ERROR",
        message: "Некорректный формат даты",
      });
    }
    return res.json({ status: "ERROR", message: err.message });
  }
}


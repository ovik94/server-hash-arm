import { Request, Response } from "express";
import * as iikoServerService from "../services";

export async function getLunchSales(req: Request, res: Response) {
  try {
    const result = await iikoServerService.getLunchSales(
      req.body.dateFrom,
      req.body.dateTo
    );

    return res.json({ status: "OK", data: result });
  } catch (err: any) {
    return res.json({ status: "ERROR", message: err.data || err.message });
  }
}


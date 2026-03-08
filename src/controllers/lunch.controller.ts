import { Request, Response } from 'express';
import * as lunchService from '../services';

export async function getLunchWeek(req: Request, res: Response) {
  return res.json({ status: 'OK', data: lunchService.getWeekNumber() });
}

export async function sendLunchTelegram(req: Request, res: Response) {
  await lunchService.sendLunchTelegram();
  return res.json({ status: 'OK' });
}

export async function sendLunchVk(req: Request, res: Response) {
  const status = await lunchService.sendLunchVk();
  return res.json({ status });
}

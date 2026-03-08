import { Request, Response } from 'express';
import * as wheelOfFortuneService from '../services';

export async function getWheelOfFortuneList(req: Request, res: Response) {
  try {
    const data = await wheelOfFortuneService.getWheelOfFortuneList();
    return res.json({
      status: 'OK',
      data,
    });
  } catch (err: any) {
    return res.json({ status: 'ERROR', message: err._message || err.message });
  }
}

export async function getWheelOfFortuneData(req: Request, res: Response) {
  try {
    const data = await wheelOfFortuneService.getWheelOfFortuneData(
      req.query.code as string
    );
    return res.json({
      status: 'OK',
      data,
    });
  } catch (err: any) {
    return res.json({ status: 'ERROR', message: err._message || err.message });
  }
}

export async function addWheelOfFortune(req: Request, res: Response) {
  try {
    const data = await wheelOfFortuneService.addWheelOfFortune(req.body);
    return res.json({
      status: 'OK',
      data,
    });
  } catch (err: any) {
    return res.json({ status: 'ERROR', message: err._message || err.message });
  }
}

export async function editWheelOfFortune(req: Request, res: Response) {
  try {
    const data = await wheelOfFortuneService.editWheelOfFortune(req.body);
    return res.json({
      status: 'OK',
      data,
    });
  } catch (err: any) {
    return res.json({ status: 'ERROR', message: err._message || err.message });
  }
}

export async function deleteWheelOfFortune(req: Request, res: Response) {
  try {
    const data = await wheelOfFortuneService.deleteWheelOfFortune(req.body.id);
    return res.json({
      status: 'OK',
      data,
    });
  } catch (err: any) {
    return res.json({ status: 'ERROR', message: err._message || err.message });
  }
}

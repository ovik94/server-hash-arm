import { Request, Response } from 'express';
import * as feedbackService from '../services';

export async function getRequestsList(req: Request, res: Response) {
  try {
    const data = await feedbackService.getRequestsList();
    return res.json({ status: 'OK', data });
  } catch (err: any) {
    return res.json({ status: 'ERROR', message: err._message || err.message });
  }
}

export async function updateRequestsList(req: Request, res: Response) {
  try {
    const data = await feedbackService.updateRequestsList(req.body.requests);
    return res.json({ status: 'OK', data });
  } catch (err: any) {
    return res.json({ status: 'ERROR', message: err._message || err.message });
  }
}

export async function sendFeedback(req: Request, res: Response) {
  const { body } = req as { body: any[] };

  try {
    await feedbackService.sendFeedback(body);
    return res.json({ status: 'OK' });
  } catch (err: any) {
    return res.json({ status: 'ERROR', message: err.message });
  }
}

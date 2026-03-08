import { Request, Response } from 'express';
import * as counterpartiesService from '../services';

export async function getCounterparties(req: Request, res: Response) {
  try {
    const data = await counterpartiesService.getCounterparties(
      req.query.type as string | undefined
    );
    return res.json({ status: 'OK', data });
  } catch (err: any) {
    return res.json({ status: 'ERROR', message: err._message || err.message });
  }
}

export async function addCounterparty(req: Request, res: Response) {
  try {
    const data = await counterpartiesService.addCounterparty(req.body);
    return res.json({ status: 'OK', data });
  } catch (err: any) {
    return res.json({ status: 'ERROR', message: err._message || err.message });
  }
}

export async function editCounterparty(req: Request, res: Response) {
  try {
    const data = await counterpartiesService.editCounterparty(req.body);
    return res.json({ status: 'OK', data });
  } catch (err: any) {
    return res.json({ status: 'ERROR', message: err._message || err.message });
  }
}

export async function deleteCounterparty(req: Request, res: Response) {
  try {
    const data = await counterpartiesService.deleteCounterparty(req.body.id);
    return res.json({ status: 'OK', data });
  } catch (err: any) {
    return res.json({ status: 'ERROR', message: err._message || err.message });
  }
}

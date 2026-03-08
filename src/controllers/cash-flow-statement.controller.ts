import { Request, Response } from 'express';
import * as cashFlowService from '../services';

export async function getCashFlowStatement(req: Request, res: Response) {
  try {
    const data = await cashFlowService.getCashFlowStatement(
      req.query.type as string | undefined
    );
    return res.json({ status: 'OK', data });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.log(err, 'err');
    return res.json({ status: 'ERROR', message: err._message || err.message });
  }
}

export async function addCashFlowStatement(req: Request, res: Response) {
  try {
    const data = await cashFlowService.addCashFlowStatement(req.body);
    return res.json({ status: 'OK', data });
  } catch (err: any) {
    return res.json({ status: 'ERROR', message: err._message || err.message });
  }
}

export async function editCashFlowStatement(req: Request, res: Response) {
  try {
    const data = await cashFlowService.editCashFlowStatement(req.body);
    return res.json({ status: 'OK', data });
  } catch (err: any) {
    return res.json({ status: 'ERROR', message: err._message || err.message });
  }
}

export async function deleteCashFlowStatement(req: Request, res: Response) {
  try {
    const data = await cashFlowService.deleteCashFlowStatement(req.body.id);
    return res.json({ status: 'OK', data });
  } catch (err: any) {
    return res.json({ status: 'ERROR', message: err._message || err.message });
  }
}

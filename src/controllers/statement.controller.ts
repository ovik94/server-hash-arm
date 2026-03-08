import { Request, Response } from 'express';
import * as statementService from '../services';
import { statementProcessSchema } from '../dto';

export const process = async (req: Request, res: Response) => {
  try {
    const { operations, companyType } = statementProcessSchema.parse(req.body);

    await statementService.process(operations, companyType);

    return res.json({ status: 'OK' });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.log(err, 'err');
    if (err.name === 'ZodError') {
      return res.json({
        status: 'ERROR',
        message: 'Некорректные данные для обработки выписки',
      });
    }
    return res.json({ status: 'ERROR', message: err.message });
  }
};

export const load = async (req: Request, res: Response) => {
  try {
    const result = await statementService.load(req);

    return res.json({ status: 'OK', data: result });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.log(err, 'err');
    return res.json({ status: 'ERROR', message: err.message });
  }
};

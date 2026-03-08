import { Request, Response } from 'express';
import * as giftCardsService from '../services';
import {
  giftCardsListQuerySchema,
  giftCardsAddSchema,
  giftCardNumberSchema,
} from '../dto';

function formatZodError(err: any): string {
  if (err?.issues?.length) {
    return err.issues[0].message;
  }
  return 'Validation error';
}

export async function getList(req: Request, res: Response) {
  try {
    const { nominal } = giftCardsListQuerySchema.parse(req.query);
    const gitfCards = await giftCardsService.getList(nominal);

    return res.json({ status: 'OK', data: gitfCards });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.json({ status: 'ERROR', message: formatZodError(err) });
    }
    return res.json({ status: 'ERROR', message: err.message });
  }
}

export async function add(req: Request, res: Response) {
  try {
    const body = giftCardsAddSchema.parse(req.body);
    const data = await giftCardsService.add(body);
    return res.json({ status: 'OK', data });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.json({ status: 'ERROR', message: formatZodError(err) });
    }
    return res.json({ status: 'ERROR', message: err.message });
  }
}

export async function activate(req: Request, res: Response) {
  try {
    const { number } = giftCardNumberSchema.parse(req.body);
    const updatedCard = await giftCardsService.activate(number);
    return res.json({ status: 'OK', data: updatedCard });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.json({ status: 'ERROR', message: formatZodError(err) });
    }
    return res.json({ status: 'ERROR', message: err._message || err.message });
  }
}

export async function sendImage(req: Request, res: Response) {
  try {
    const { number } = giftCardNumberSchema.parse(req.body);
    const image = await giftCardsService.sendImage(number);
    res.writeHead(200, { 'Content-Type': 'image/png' });
    return res.end(image, 'binary');
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.json({ status: 'ERROR', message: formatZodError(err) });
    }

    if (err.code === 'NOT_ACTIVATED') {
      return res.json({
        status: 'ERROR',
        message: 'Подарочная карта не активирована',
      });
    }

    return res.json({ status: 'ERROR', message: err._message || err.message });
  }
}

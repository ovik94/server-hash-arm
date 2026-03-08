import { Request, Response } from 'express';
import { getWebMenu, getMenuItem as fetchMenuItem } from '../services';

export async function getMenu(req: Request, res: Response) {
  const data = await getWebMenu();
  return res.json({ status: 'OK', data });
}

export async function getMenuItem(req: Request, res: Response) {
  const data = await fetchMenuItem(req.query.id as string);

  return res.json({
    status: 'OK',
    data,
  });
}

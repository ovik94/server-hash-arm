import { Request, Response } from "express";
import * as iikoCloudService from "../services";

export async function getReserveList(req: Request, res: Response) {
  try {
    const reserves = await iikoCloudService.getReserveList(
      req.query.date as string | undefined
    );

    return res.json({ status: "OK", data: reserves });
  } catch (err: any) {
    return res.json({ status: "ERROR", message: err.data || err.message });
  }
}

export async function getCurrentPrepays(req: Request, res: Response) {
  try {
    const prepays = await iikoCloudService.getCurrentPrepays();

    return res.json({ status: "OK", data: prepays });
  } catch (err: any) {
    return res.json({ status: "ERROR", message: err.data || err.message });
  }
}

export async function getMenuList(req: Request, res: Response) {
  try {
    const menuList = await iikoCloudService.getMenuList();

    return res.json({ status: "OK", data: menuList });
  } catch (err: any) {
    return res.json({ status: "ERROR", message: err.data || err.message });
  }
}

export async function getMenu(req: Request, res: Response) {
  try {
    const transformedMenu = await iikoCloudService.getMenu(req.body.id);

    return res.json({ status: "OK", data: transformedMenu });
  } catch (err: any) {
    return res.json({ status: "ERROR", message: err.data || err.message });
  }
}


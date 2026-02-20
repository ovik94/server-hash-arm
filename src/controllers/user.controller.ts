import { Request, Response } from "express";
import * as userService from "../services";
import {
  addUserSchema,
  deleteUserSchema,
  editUserSchema,
  loginSchema,
} from "../dto";

function formatZodError(err: any): string {
  if (err?.issues?.length) {
    return err.issues[0].message;
  }
  return "Validation error";
}

export async function getUserList(req: Request, res: Response) {
  try {
    const data = await userService.getUserList();
    return res.json({ status: "OK", data });
  } catch (err: any) {
    return res.json({ status: "ERROR", message: err.message || err._message });
  }
}

export async function addUser(req: Request, res: Response) {
  try {
    const body = addUserSchema.parse(req.body);
    const data = await userService.addUser(body);
    return res.json({ status: "OK", data });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.json({ status: "ERROR", message: formatZodError(err) });
    }
    return res.json({ status: "ERROR", message: err.message || err._message });
  }
}

export async function editUser(req: Request, res: Response) {
  try {
    const body = editUserSchema.parse(req.body);
    const data = await userService.editUser(body);
    return res.json({ status: "OK", data });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.json({ status: "ERROR", message: formatZodError(err) });
    }
    return res.json({ status: "ERROR", message: err.message || err._message });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const body = deleteUserSchema.parse(req.body);
    const data = await userService.deleteUser(body.id);
    return res.json({ status: "OK", data });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.json({ status: "ERROR", message: formatZodError(err) });
    }
    return res.json({ status: "ERROR", message: err.message || err._message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const body = loginSchema.parse(req.body);
    await userService.login({ id: body.id, password: body.password });
    return res.json({ status: "OK" });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.json({ status: "ERROR", message: formatZodError(err) });
    }
    return res.json({ status: "ERROR", message: err.message || "Ошибка входа" });
  }
}


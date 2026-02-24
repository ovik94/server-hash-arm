import { Router } from "express";
import {
  getUserList,
  addUser,
  login,
  editUser,
  deleteUser,
} from "../controllers/user.controller";

const router = Router();

router.get("/list", getUserList);
router.post("/add", addUser);
router.post("/login", login);
router.post("/edit", editUser);
router.post("/delete", deleteUser);

export default router;


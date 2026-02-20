import { Router } from "express";
import {
  getExpenses,
  addExpense,
  deleteExpense,
} from "../../controllers/app";

const router = Router();

router.get("/", getExpenses);
router.post("/add", addExpense);
router.post("/delete", deleteExpense);

export default router;


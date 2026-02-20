import { Router } from "express";
import {
  getExpensesV2,
  addExpenseV2,
  deleteExpenseV2,
} from "../../controllers/app";

const router = Router();

router.get("/", getExpensesV2);
router.post("/add", addExpenseV2);
router.post("/delete", deleteExpenseV2);

export default router;


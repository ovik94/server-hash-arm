import { Router } from "express";
import {
  getCashFlowStatement,
  addCashFlowStatement,
  editCashFlowStatement,
  deleteCashFlowStatement,
} from "../controllers/cash-flow-statement.controller";

const router = Router();

router.get("/", getCashFlowStatement);
router.post("/add", addCashFlowStatement);
router.post("/edit", editCashFlowStatement);
router.post("/delete", deleteCashFlowStatement);

export default router;


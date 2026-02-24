import { Router } from "express";
import {
  getCounterparties,
  addCounterparty,
  editCounterparty,
  deleteCounterparty,
} from "../controllers/counterparties.controller";

const router = Router();

router.get("/", getCounterparties);
router.post("/add", addCounterparty);
router.post("/edit", editCounterparty);
router.post("/delete", deleteCounterparty);

export default router;


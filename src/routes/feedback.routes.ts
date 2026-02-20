import { Router } from "express";
import {
  getRequestsList,
  updateRequestsList,
  sendFeedback,
} from "../controllers";

const router = Router();

router.get("/list", getRequestsList);
router.post("/update", updateRequestsList);
router.post("/send", sendFeedback);

export default router;


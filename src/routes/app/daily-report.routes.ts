import { Router } from "express";
import {
  getReports,
  addReport,
  updateReport,
  setNewReports,
} from "../../controllers/app";

const router = Router();

router.get("/reports", getReports);
router.post("/add", addReport);
router.post("/update", updateReport);
router.get("/set-reports", setNewReports);

export default router;


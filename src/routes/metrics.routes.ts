import { Router } from "express";
import { saveMetrics } from "../controllers";

const router = Router();

router.post("/save", saveMetrics);

export default router;


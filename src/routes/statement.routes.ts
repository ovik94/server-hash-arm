import { Router } from "express";
import { load, process } from "../controllers";

const router = Router();

router.post("/load", load);
router.post("/process", process);

export default router;


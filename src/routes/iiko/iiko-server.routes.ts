import { Router } from "express";
import { getLunchSales } from "../../controllers";

const router = Router();

router.post("/get-lunch-sales", getLunchSales);

export default router;


import { Router } from "express";
import { getLunchSales } from "../../controllers/iiko-server.controller";

const router = Router();

router.post("/get-lunch-sales", getLunchSales);

export default router;


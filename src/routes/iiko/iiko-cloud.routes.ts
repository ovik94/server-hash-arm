import { Router } from "express";
import {
  getReserveList,
  getCurrentPrepays,
  getMenuList,
  getMenu,
} from "../../controllers/iiko-cloud.controller";

const router = Router();

router.get("/reserve-list", getReserveList);
router.get("/current-prepays", getCurrentPrepays);
router.get("/menu-list", getMenuList);
router.post("/menu", getMenu);

export default router;


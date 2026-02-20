import { Router } from "express";
import {
  getMenuItem,
  iikoGetMenu,
} from "../../controllers";

const router = Router();

router.get("/menu", iikoGetMenu);
router.get("/menuItem", getMenuItem);

export default router;


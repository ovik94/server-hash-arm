import { Router } from "express";
import {
  getWheelOfFortuneList,
  getWheelOfFortuneData,
  addWheelOfFortune,
  deleteWheelOfFortune,
  editWheelOfFortune,
} from "../controllers";

const router = Router();

router.get("/list", getWheelOfFortuneList);
router.get("/data", getWheelOfFortuneData);
router.post("/add", addWheelOfFortune);
router.post("/delete", deleteWheelOfFortune);
router.post("/edit", editWheelOfFortune);

export default router;


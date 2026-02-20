import { Router } from "express";
import {
  getList,
  add,
  activate,
  sendImage,
} from "../controllers";

const router = Router();

router.get("/", getList);
// метод не для фронта
router.post("/add", add);
router.post("/activate", activate);
router.post("/send-image", sendImage);

export default router;


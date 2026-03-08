import { Router } from 'express';
import {
  getWheelOfFortuneList,
  getWheelOfFortuneData,
  addWheelOfFortune,
  deleteWheelOfFortune,
  editWheelOfFortune,
} from '../controllers/wheel-of-fortune.controller';

const router = Router();

router.get('/list', getWheelOfFortuneList);
router.get('/data', getWheelOfFortuneData);
router.post('/add', addWheelOfFortune);
router.post('/delete', deleteWheelOfFortune);
router.post('/edit', editWheelOfFortune);

export default router;

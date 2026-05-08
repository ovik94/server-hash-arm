import { Router } from 'express';
import { sendLunchVk, getLunchWeek } from '../controllers/lunch.controller';

const router = Router();

// router.get('/menu-for-today', sendLunchTelegram);
router.get('/menu-for-today-vk', sendLunchVk);
router.get('/get-week', getLunchWeek);

export default router;

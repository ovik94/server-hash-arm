import { Router } from 'express';
import { getMenuItem, getMenu } from '../../controllers/iiko.controller';

const router = Router();

router.get('/menu', getMenu);
router.get('/menuItem', getMenuItem);

export default router;

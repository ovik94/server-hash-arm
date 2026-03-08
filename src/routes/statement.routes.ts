import { Router } from 'express';
import { load, process } from '../controllers/statement.controller';

const router = Router();

router.post('/load', load);
router.post('/process', process);

export default router;

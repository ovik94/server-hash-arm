import { Router } from 'express';
import { saveMetrics } from '../controllers/metrics.controller';

const router = Router();

router.post('/save', saveMetrics);

export default router;

import express from 'express';
import AuthRouter from './auth';
import ApiRouter from './api';
import EsiRouter from './esi';

const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/api', ApiRouter);
router.use('/esi', EsiRouter);

export default router;

import { Router } from 'express';
import { sendSuccess } from '../utils/responseUtils.js';

const router = Router();

router.get('/health', (req, res) => {
  return sendSuccess(res, null, 'Phishing detection backend is running');
});

export default router;

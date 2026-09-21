import { Router } from 'express';
import { handleUrlScan, handleEmailScan, handleMessageScan } from '../controllers/scanController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { urlScanSchema, emailScanSchema, messageScanSchema } from '../validators/scanValidators.js';
import { urlScanLimiter, emailScanLimiter } from '../middleware/rateLimitMiddleware.js';

const router = Router();

// Protect all scan routes with authentication middleware
router.use(requireAuth);

router.post('/scans/url', urlScanLimiter, validate(urlScanSchema), handleUrlScan);
router.post('/scans/email', emailScanLimiter, validate(emailScanSchema), handleEmailScan);
router.post('/scans/message', emailScanLimiter, validate(messageScanSchema), handleMessageScan);

export default router;

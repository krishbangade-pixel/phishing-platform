import { Router } from 'express';
import { handleGetHistory, handleGetScanById, handleDeleteScan } from '../controllers/historyController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { historyQuerySchema, uuidParamSchema } from '../validators/historyValidators.js';

const router = Router();

// Protect history routes with authentication middleware
router.use(requireAuth);

router.get('/scans', validate(historyQuerySchema, 'query'), handleGetHistory);
router.get('/scans/:id', validate(uuidParamSchema, 'params'), handleGetScanById);
router.delete('/scans/:id', validate(uuidParamSchema, 'params'), handleDeleteScan);

export default router;

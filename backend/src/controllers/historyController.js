import { getUserScans, getScanById, deleteScanRecord } from '../services/historyService.js';
import { sendSuccess, sendPaginatedSuccess, sendError } from '../utils/responseUtils.js';

export async function handleGetHistory(req, res, next) {
  try {
    const userId = req.user.id;
    const userToken = req.token;
    const { page, limit, type, risk_level, status, search } = req.query;

    const result = await getUserScans(userId, {
      page,
      limit,
      type,
      riskLevel: risk_level,
      status,
      search
    }, userToken);

    return sendPaginatedSuccess(res, result.scans, result.pagination);
  } catch (error) {
    next(error);
  }
}

export async function handleGetScanById(req, res, next) {
  try {
    const userId = req.user.id;
    const scanId = req.params.id;
    const userToken = req.token;

    const scan = await getScanById(scanId, userId, userToken);

    if (!scan) {
      return sendError(res, 'NOT_FOUND', 'Scan report not found or you do not have permission to access it.', 404);
    }

    return sendSuccess(res, scan);
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteScan(req, res, next) {
  try {
    const userId = req.user.id;
    const scanId = req.params.id;
    const userToken = req.token;

    const result = await deleteScanRecord(scanId, userId, userToken);

    if (!result.found) {
      return sendError(res, 'NOT_FOUND', 'Scan record not found or you do not have permission to delete it.', 404);
    }

    return sendSuccess(res, null, 'Scan record deleted successfully.');
  } catch (error) {
    next(error);
  }
}

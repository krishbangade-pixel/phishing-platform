import { executeUrlScan, executeEmailScan, executeMessageScan } from '../services/scanService.js';
import { sendSuccess, sendError } from '../utils/responseUtils.js';
import logger from '../utils/logger.js';

export async function handleUrlScan(req, res, next) {
  try {
    const { url } = req.body;
    const userId = req.user.id;
    const userToken = req.token;

    const result = await executeUrlScan(url, userId, userToken);
    return sendSuccess(res, result, 'URL scan completed and saved successfully.', 201);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.code, error.message, error.statusCode);
    }
    next(error);
  }
}

export async function handleEmailScan(req, res, next) {
  try {
    const { subject, content, sender, replyTo } = req.body;
    const userId = req.user.id;
    const userToken = req.token;

    const result = await executeEmailScan({ subject, content, sender, replyTo }, userId, userToken);
    return sendSuccess(res, result, 'Email scan completed and saved successfully.', 201);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.code, error.message, error.statusCode);
    }
    next(error);
  }
}

export async function handleMessageScan(req, res, next) {
  try {
    const { content } = req.body;
    const userId = req.user.id;
    const userToken = req.token;

    const result = await executeMessageScan(content, userId, userToken);
    return sendSuccess(res, result, 'Message scan completed and saved successfully.', 201);
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.code, error.message, error.statusCode);
    }
    next(error);
  }
}

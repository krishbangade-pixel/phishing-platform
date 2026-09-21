export function sendSuccess(res, data = null, message = null, statusCode = 200) {
  const response = { success: true };

  if (message) {
    response.message = message;
  }

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
}

export function sendPaginatedSuccess(res, data, pagination, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    pagination
  });
}

export function sendError(res, code = 'INTERNAL_SERVER_ERROR', message = 'An unexpected error occurred.', statusCode = 500, details = null) {
  const response = {
    success: false,
    error: {
      code,
      message
    }
  };

  if (details && process.env.NODE_ENV !== 'production') {
    response.error.details = details;
  }

  return res.status(statusCode).json(response);
}

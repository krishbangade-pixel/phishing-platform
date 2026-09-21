import { sendError } from '../utils/responseUtils.js';

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const dataToValidate = req[source];
    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      const issue = result.error.issues[0];
      const errorMessage = issue ? `${issue.path.join('.')}: ${issue.message}` : 'Validation error';

      return sendError(
        res,
        'VALIDATION_ERROR',
        errorMessage,
        400,
        result.error.flatten()
      );
    }

    // Replace request data with parsed/sanitized value
    req[source] = result.data;
    return next();
  };
}

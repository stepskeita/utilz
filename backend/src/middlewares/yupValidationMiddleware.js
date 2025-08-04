/**
 * Middleware to validate request data using Yup schemas
 */
export const validateSchema = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const dataToValidate = req[source];

      // Validate the data against the schema
      const validatedData = await schema.validate(dataToValidate, {
        abortEarly: false, // Return all errors, not just the first one
        stripUnknown: true // Remove unknown properties
      });

      // Replace the original data with validated/sanitized data
      req[source] = validatedData;

      next();
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors
        });
      }

      // For other types of errors, pass to error handler
      next(error);
    }
  };
};

/**
 * Validate query parameters
 */
export const validateQuery = (schema) => validateSchema(schema, 'query');

/**
 * Validate URL parameters
 */
export const validateParams = (schema) => validateSchema(schema, 'params');

/**
 * Validate request body
 */
export const validateBody = (schema) => validateSchema(schema, 'body');

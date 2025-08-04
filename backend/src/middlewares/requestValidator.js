
const requestValidator = (schema, dataType = 'body') => {
  return async (req, res, next) => {
    try {
      // Get the data to validate based on dataType
      const dataToValidate = dataType === 'query' ? req.query : req.body;

      // Validate the data against the schema
      const validatedData = await schema.validate(dataToValidate, {
        abortEarly: false, // Return all errors, not just the first one
        stripUnknown: true, // Remove unknown properties
      });

      // Replace the original data with validated data
      if (dataType === 'query') {
        req.query = validatedData;
      } else {
        req.body = validatedData;
      }

      next();
    } catch (error) {
      // Handle Yup validation errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: error.errors?.length > 0 ? error.errors[0] : 'Validation error',
          errors: error.errors,
        });
      }

      // Handle other errors
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
};

export default requestValidator;
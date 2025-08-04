import * as Yup from 'yup';

// API key creation validation schema
export const createApiKeySchema = Yup.object({
  name: Yup.string()
    .required('Key name is required')
    .min(2, 'Key name must be at least 2 characters')
    .max(50, 'Key name must be at most 50 characters')
    .default('Default Key'),
  expiresAt: Yup.date()
    .min(
      new Date(Date.now() + 86400000), // At least 1 day from now
      'Expiry date must be at least 1 day in the future'
    )
    .transform((value, originalValue) => {
      if (!originalValue) return null;
      const date = new Date(originalValue);
      return isNaN(date.getTime()) ? null : date;
    })
    .nullable(),

  ipRestrictions: Yup.mixed()
    .transform((value) => {
      // Handle null, undefined, empty array, or empty string
      if (!value || (Array.isArray(value) && value.length === 0) || value === '') {
        return null;
      }
      // Ensure it's an array
      if (!Array.isArray(value)) {
        return [value];
      }
      return value;
    })
    .test(
      'valid-ip-format',
      'One or more IP addresses are invalid',
      function (value) {
        if (!value) return true; // Null is allowed

        // IP regex that supports both IPv4 addresses and CIDR notation
        const ipRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;

        return value.every(ip => ipRegex.test(ip));
      }
    )
    .nullable()
});

// API key update validation schema
export const updateApiKeySchema = Yup.object({
  name: Yup.string()
    .min(2, 'Key name must be at least 2 characters')
    .max(50, 'Key name must be at most 50 characters'),
  isActive: Yup.boolean(),
  expiresAt: Yup.date()
    .transform((value, originalValue) => {
      if (!originalValue) return null;
      const date = new Date(originalValue);
      return isNaN(date.getTime()) ? null : date;
    })
    .test(
      'future-date',
      'Expiry date must be at least 1 day in the future if provided',
      function (value) {
        const { path, createError } = this;

        // If no value is provided, validation passes
        if (!value) return true;

        // At least 1 day from now
        const minDate = new Date(Date.now() + 86400000);

        // Check if the date is at least 1 day in the future
        if (value < minDate) {
          return createError({
            path,
            message: 'Expiry date must be at least 1 day in the future'
          });
        }

        return true;
      }
    )
    .nullable(),

  ipRestrictions: Yup.mixed()
    .transform((value) => {
      // Handle null, undefined, empty array, or empty string
      if (!value || (Array.isArray(value) && value.length === 0) || value === '') {
        return null;
      }
      // Ensure it's an array
      if (!Array.isArray(value)) {
        return [value];
      }
      return value;
    })
    .test(
      'valid-ip-format',
      'One or more IP addresses are invalid',
      function (value) {
        if (!value) return true; // Null is allowed

        // IP regex that supports both IPv4 addresses and CIDR notation
        const ipRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;

        return value.every(ip => ipRegex.test(ip));
      }
    )
    .nullable()
});




export default {
  createApiKeySchema,
  updateApiKeySchema,

};
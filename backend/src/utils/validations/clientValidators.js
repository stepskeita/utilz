import * as Yup from 'yup';

// Client creation validation schema
export const createClientSchema = Yup.object({
  name: Yup.string()
    .required('Client name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  contactPerson: Yup.string()
    .required('Contact person is required')
    .min(2, 'Contact person name must be at least 2 characters'),
  contactPhone: Yup.string()
    .matches(
      /^(\+\d{1,3})?\s?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/,
      'Invalid phone number format'
    )
    .nullable(),
  address: Yup.string()
    .nullable(),
  website: Yup.string()
    .url('Invalid website URL')
    .nullable(),
  plan: Yup.string()
    .oneOf(['basic', 'premium', 'enterprise'], 'Invalid plan type')
    .default('basic'),
  monthlyQuota: Yup.number()
    .positive('Monthly quota must be a positive number')
    .integer('Monthly quota must be an integer')
    .min(100, 'Monthly quota must be at least 100')
    .default(1000),
  notes: Yup.string()
    .nullable()
});

// Client update validation schema
export const updateClientSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: Yup.string()
    .email('Invalid email address'),
  contactPerson: Yup.string()
    .min(2, 'Contact person name must be at least 2 characters'),
  contactPhone: Yup.string()
    .matches(
      /^(\+\d{1,3})?\s?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/,
      'Invalid phone number format'
    )
    .nullable(),
  address: Yup.string()
    .nullable(),
  website: Yup.string()
    .url('Invalid website URL')
    .nullable(),
  isActive: Yup.boolean(),
  plan: Yup.string()
    .oneOf(['basic', 'premium', 'enterprise'], 'Invalid plan type'),
  monthlyQuota: Yup.number()
    .positive('Monthly quota must be a positive number')
    .integer('Monthly quota must be an integer')
    .min(100, 'Monthly quota must be at least 100'),
  notes: Yup.string()
    .nullable(),
  status: Yup.string()
    .oneOf(['active', 'inactive', 'suspended'], 'Invalid status')
});

// Client Authentication Schemas
export const clientLoginSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
});

export const clientChangePasswordSchema = Yup.object({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your new password')
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
});

export const clientPasswordResetRequestSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
});

export const clientPasswordResetSchema = Yup.object({
  token: Yup.string()
    .required('Reset token is required'),
  newPassword: Yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your new password')
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
});

// API Key validation schemas
export const createApiKeySchema = Yup.object({
  name: Yup.string()
    .required('API key name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  isAirtime: Yup.boolean()
    .default(false),
  isCashpower: Yup.boolean()
    .default(false),
  isBoth: Yup.boolean()
    .default(false),
  expiresAt: Yup.date()
    .min(new Date(), 'Expiration date must be in the future')
    .nullable(),
  ipRestrictions: Yup.array()
    .of(Yup.string().matches(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      'Invalid IP address format'
    ))
    .nullable()
});

export const updateApiKeySchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  isActive: Yup.boolean(),
  isAirtime: Yup.boolean(),
  isCashpower: Yup.boolean(),
  isBoth: Yup.boolean(),
  expiresAt: Yup.date()
    .min(new Date(), 'Expiration date must be in the future')
    .nullable(),
  ipRestrictions: Yup.array()
    .of(Yup.string().matches(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      'Invalid IP address format'
    ))
    .nullable()
});

// Pagination schema
export const paginationSchema = Yup.object({
  page: Yup.number()
    .integer('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .default(1),
  limit: Yup.number()
    .integer('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(10)
});

// Transaction query schema
export const transactionQuerySchema = Yup.object({
  page: Yup.number()
    .integer('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .default(1),
  limit: Yup.number()
    .integer('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(50),
  type: Yup.string()
    .oneOf(['credit', 'debit'], 'Type must be either credit or debit')
    .nullable(),
  startDate: Yup.date()
    .nullable(),
  endDate: Yup.date()
    .nullable()
    .when('startDate', (startDate, schema) => {
      return startDate ? schema.min(startDate, 'End date must be after start date') : schema;
    })
});

// Top-up request query schema
export const topUpRequestQuerySchema = Yup.object({
  page: Yup.number()
    .integer('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .default(1),
  limit: Yup.number()
    .integer('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(20),
  status: Yup.string()
    .oneOf(['pending', 'approved', 'rejected'], 'Status must be pending, approved, or rejected')
    .nullable()
});

// UUID validation
export const uuidSchema = Yup.object({
  id: Yup.string()
    .required('ID is required')
    .matches(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      'Invalid UUID format'
    )
});

export default {
  createClientSchema,
  updateClientSchema,
  clientLoginSchema,
  clientChangePasswordSchema,
  clientPasswordResetRequestSchema,
  clientPasswordResetSchema,
  createApiKeySchema,
  updateApiKeySchema,
  paginationSchema,
  transactionQuerySchema,
  topUpRequestQuerySchema,
  uuidSchema
};
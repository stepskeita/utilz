import * as Yup from 'yup';

/**
 * Validation schemas for wallet-related operations
 */

// Enum values from ClientWallet model
const walletStatusValues = ['active', 'suspended', 'closed'];

/**
 * Schema for creating a new wallet
 */
export const createWalletSchema = Yup.object({
  clientId: Yup.string()
    .uuid('Client ID must be a valid UUID')
    .required('Client ID is required'),


});


/**
 * Schema for adding funds to a wallet
 */
export const addFundsSchema = Yup.object({
  clientId: Yup.string()
    .uuid('Client ID must be a valid UUID')
    .required('Client ID is required'),
  amount: Yup.number()
    .positive('Amount must be positive')
    .min(0.01, 'Minimum amount is 0.01')
    .required('Amount is required'),
  description: Yup.string()
    .max(255, 'Description cannot exceed 255 characters')
    .nullable(),
  reference: Yup.string()
    .max(100, 'Reference cannot exceed 100 characters')
    .matches(/^[a-zA-Z0-9-_]+$/, 'Reference must contain only letters, numbers, hyphens, and underscores').nullable(),
});
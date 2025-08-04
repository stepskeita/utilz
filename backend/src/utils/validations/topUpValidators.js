import * as Yup from 'yup';

// Schema for topup requests
export const topUpSchema = Yup.object({
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .trim()
    .matches(/^(\+220|220)?[0-9]{7}$/, 'Invalid phone number format. Use format: 2203XXXXXX or +2203XXXXXX')
    .transform((value) => {
      // Normalize phone number to 2203XXXXXX format
      if (value.startsWith('+220')) {
        return value.substring(1);
      }
      if (value.startsWith('220') && value.length === 10) {
        return value;
      }
      if (value.length === 7) {
        return '220' + value;
      }
      return value;
    }),

  provider: Yup.string()
    .required('Provider is required')
    .trim()
    .lowercase()
    .oneOf(['africell', 'qcell', 'comium', 'gamcel'], 'Invalid provider'),

  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .min(5, 'Minimum amount is D5')
    .max(1000, 'Maximum amount is D1000')
});

// Schema for status query parameters
export const statusQuerySchema = Yup.object({
  status: Yup.string()
    .oneOf(['success', 'fail']),

  provider: Yup.string()
    .oneOf(['africell', 'qcell', 'comium', 'gamcel'], 'Invalid provider'),

  startDate: Yup.date()
    .transform((value, originalValue) => {
      if (!originalValue) return null;
      const date = new Date(originalValue);
      return isNaN(date.getTime()) ? null : date;
    }),

  endDate: Yup.date()
    .transform((value, originalValue) => {
      if (!originalValue) return null;
      const date = new Date(originalValue);
      return isNaN(date.getTime()) ? null : date;
    })
    .test(
      'is-after-start-date',
      'End date must be after start date',
      function (endDate) {
        const { startDate } = this.parent;
        if (!startDate || !endDate) return true;
        return endDate > startDate;
      }
    ),

  limit: Yup.number()
    .integer('Limit must be an integer')
    .min(1, 'Minimum limit is 1')
    .max(500, 'Maximum limit is 500'),

  offset: Yup.number()
    .integer('Offset must be an integer')
    .min(0, 'Offset cannot be negative')
});

export default {
  topUpSchema,
  statusQuerySchema
};
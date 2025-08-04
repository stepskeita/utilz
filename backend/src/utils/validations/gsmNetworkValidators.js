import * as Yup from "yup";

// GSM Network creation schema
export const createNetworkSchema = Yup.object({
  name: Yup.string()
    .required("Network name is required")
    .min(2, "Network name must be at least 2 characters")
    .max(50, "Network name must be at most 50 characters"),

  code: Yup.string()
    .required("Network code is required")
    .min(2, "Network code must be at least 2 characters")
    .max(20, "Network code must be at most 20 characters")
    .matches(
      /^[A-Za-z0-9_-]+$/,
      "Network code can only contain alphanumeric characters, underscores, and hyphens"
    ),

  country: Yup.string()
    .required("Country is required")
    .min(2, "Country must be at least 2 characters")
    .max(60, "Country must be at most 60 characters"),

  logoUrl: Yup.string().url("Logo URL must be a valid URL").nullable(),

  isActive: Yup.boolean().default(true),
});

// GSM Network update schema
export const updateNetworkSchema = Yup.object({
  name: Yup.string()
    .min(2, "Network name must be at least 2 characters")
    .max(50, "Network name must be at most 50 characters"),

  country: Yup.string()
    .min(2, "Country must be at least 2 characters")
    .max(60, "Country must be at most 60 characters"),

  code: Yup.string()
    .min(2, "Network code must be at least 2 characters")
    .max(10, "Network code must be at most 10 characters")
    .matches(
      /^[A-Za-z0-9_-]+$/,
      "Network code can only contain alphanumeric characters, underscores, and hyphens"
    ),

  logoUrl: Yup.string().url("Logo URL must be a valid URL").nullable(),

  isActive: Yup.boolean(),
});

// Network list query parameters
export const listNetworkQuerySchema = Yup.object({
  country: Yup.string(),
  isActive: Yup.boolean().transform((value) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  }),
});

export default {
  createNetworkSchema,
  updateNetworkSchema,
};

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal } from "react-responsive-modal";
import { useUpdateApiKeyMutation } from "../../../api/queries";
import CustomTextInput from "../../../components/generic/CustomTextInput";
import CustomButton from "../../../components/generic/CustomButton";
import toast from "react-hot-toast";

const EditApiKeyModal = ({ isOpen, apiKey, onClose, onSuccess }) => {
  const updateApiKeyMutation = useUpdateApiKeyMutation();

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("API Key name is required")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be less than 50 characters"),
    serviceType: Yup.string()
      .required("Service type is required")
      .oneOf(["airtime", "cashpower", "both"], "Invalid service type"),
  });

  const getInitialServiceType = () => {
    if (apiKey.isBoth) return "both";
    if (apiKey.isAirtime) return "airtime";
    if (apiKey.isCashpower) return "cashpower";
    return "both";
  };

  const formik = useFormik({
    initialValues: {
      name: apiKey.name || "",
      serviceType: getInitialServiceType(),
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const apiKeyData = {
          name: values.name,
          isAirtime:
            values.serviceType === "airtime" || values.serviceType === "both",
          isCashpower:
            values.serviceType === "cashpower" || values.serviceType === "both",
          isBoth: values.serviceType === "both",
        };

        await updateApiKeyMutation.mutateAsync({
          apiKeyId: apiKey.id,
          apiKeyData,
        });

        toast.success("API Key updated successfully!");
        onSuccess();
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to update API key"
        );
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      center
      classNames={{
        modal: "customModal",
      }}
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Edit API Key
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <CustomTextInput
            label="API Key Name"
            id="name"
            placeholder="Enter a descriptive name for your API key"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Access <span className="text-red-500">*</span>
            </label>
            <select
              id="serviceType"
              name="serviceType"
              value={formik.values.serviceType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="both">
                Both Services (Airtime & Electricity)
              </option>
              <option value="airtime">Airtime Only</option>
              <option value="cashpower">Electricity Only</option>
            </select>
            {formik.touched.serviceType && formik.errors.serviceType && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.serviceType}
              </p>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Note</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Changes to service access will take effect immediately. Make
                    sure your applications are configured accordingly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <CustomButton
              type="button"
              onClick={handleClose}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              disabled={
                updateApiKeyMutation.isPending ||
                !formik.isValid ||
                !formik.dirty
              }
            >
              {updateApiKeyMutation.isPending
                ? "Updating..."
                : "Update API Key"}
            </CustomButton>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditApiKeyModal;

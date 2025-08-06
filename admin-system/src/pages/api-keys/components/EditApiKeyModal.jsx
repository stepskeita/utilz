import React from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useUpdateApiKeyMutation,
  useGetClientsQuery,
} from "../../../api/queries";
import CustomTextInput from "../../../components/generic/CustomTextInput";
import CustomSelectInput from "../../../components/generic/CustomSelectInput";
import CustomButton from "../../../components/generic/CustomButton";
import CustomReactSelect from "../../../components/generic/CustomReactSelect";
import toast from "react-hot-toast";

const EditApiKeyModal = ({ isOpen, onClose, onSuccess, apiKey }) => {
  const updateApiKeyMutation = useUpdateApiKeyMutation();
  const getClientsQuery = useGetClientsQuery();

  const validationSchema = Yup.object({
    name: Yup.string().required("API Key name is required"),
    isAirtime: Yup.boolean(),
    isCashpower: Yup.boolean(),
    isBoth: Yup.boolean(),
    expiresAt: Yup.date().nullable(),
    isActive: Yup.boolean(),
  });

  const getInitialServiceType = () => {
    if (apiKey?.isBoth) return "both";
    if (apiKey?.isAirtime && apiKey?.isCashpower) return "both";
    if (apiKey?.isAirtime) return "airtime";
    if (apiKey?.isCashpower) return "cashpower";
    return "both";
  };

  const formik = useFormik({
    initialValues: {
      name: apiKey?.name || "",
      serviceType: getInitialServiceType(),
      expiresAt: apiKey?.expiresAt
        ? new Date(apiKey.expiresAt).toISOString().split("T")[0]
        : "",
      isActive: apiKey?.isActive || false,
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
          expiresAt: values.expiresAt || null,
          isActive: values.isActive,
        };

        await updateApiKeyMutation.mutateAsync({
          apiKeyId: apiKey.id,
          apiKeyData,
        });

        toast.success("API Key updated successfully!");
        onSuccess();
        onClose();
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
            placeholder="Enter a descriptive name for the API key"
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

          <CustomTextInput
            label="Expiration Date (Optional)"
            id="expiresAt"
            type="date"
            placeholder="Leave empty for no expiration"
            value={formik.values.expiresAt}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.expiresAt && formik.errors.expiresAt}
          />

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formik.values.isActive}
                onChange={formik.handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
            <p className="mt-1 text-sm text-gray-500">
              Inactive API keys cannot be used to access services
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Note</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Changes to service access will take effect immediately. Make
                    sure the client's applications are configured accordingly.
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

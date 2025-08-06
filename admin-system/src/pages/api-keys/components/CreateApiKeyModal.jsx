import React from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useCreateApiKeyMutation,
  useGetClientsQuery,
} from "../../../api/queries";
import CustomTextInput from "../../../components/generic/CustomTextInput";
import CustomSelectInput from "../../../components/generic/CustomSelectInput";
import CustomButton from "../../../components/generic/CustomButton";
import CustomReactSelect from "../../../components/generic/CustomReactSelect";
import toast from "react-hot-toast";

const CreateApiKeyModal = ({ isOpen, onClose, onSuccess }) => {
  const createApiKeyMutation = useCreateApiKeyMutation();
  const getClientsQuery = useGetClientsQuery();

  const validationSchema = Yup.object({
    name: Yup.string().required("API Key name is required"),
    clientId: Yup.string().required("Client is required"),
    isAirtime: Yup.boolean(),
    isCashpower: Yup.boolean(),
    isBoth: Yup.boolean(),
    expiresAt: Yup.date().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      clientId: "",
      isAirtime: false,
      isCashpower: false,
      isBoth: false,
      expiresAt: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Validate that at least one service is selected
        if (!values.isAirtime && !values.isCashpower && !values.isBoth) {
          toast.error("Please select at least one service");
          return;
        }

        // If isBoth is selected, set both airtime and cashpower to true
        const apiKeyData = {
          name: values.name,
          isAirtime: values.isBoth ? true : values.isAirtime,
          isCashpower: values.isBoth ? true : values.isCashpower,
          expiresAt: values.expiresAt || null,
        };

        await createApiKeyMutation.mutateAsync({
          clientId: values.clientId,
          apiKeyData,
        });

        toast.success("API Key created successfully");
        onSuccess();
        onClose();
        formik.resetForm();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to create API key"
        );
      }
    },
  });

  const handleServiceChange = (service, checked) => {
    if (service === "both") {
      formik.setFieldValue("isBoth", checked);
      if (checked) {
        formik.setFieldValue("isAirtime", false);
        formik.setFieldValue("isCashpower", false);
      }
    } else {
      formik.setFieldValue(service, checked);
      if (checked) {
        formik.setFieldValue("isBoth", false);
      }
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      center
      classNames={{
        modal: "rounded-lg shadow-xl",
      }}
    >
      <div className="p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Create New API Key</h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <CustomTextInput
            label="API Key Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
            placeholder="Enter API key name"
          />

          <CustomReactSelect
            label="Client"
            value={{
              value: formik.values.clientId,
              label:
                getClientsQuery?.data?.clients?.find(
                  (client) => client.id === formik.values.clientId
                )?.name || "Select Client",
            }}
            onChange={(selectedOption) =>
              formik.setFieldValue("clientId", selectedOption.value)
            }
            placeholder="Select Client"
            options={
              getClientsQuery?.data?.clients?.map((client) => ({
                value: client.id,
                label: client.name,
              })) || []
            }
            error={formik.touched.clientId && formik.errors.clientId}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Subscriptions
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formik.values.isAirtime}
                  onChange={(e) =>
                    handleServiceChange("isAirtime", e.target.checked)
                  }
                  className="mr-2"
                />
                <span className="text-sm">Airtime Service</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formik.values.isCashpower}
                  onChange={(e) =>
                    handleServiceChange("isCashpower", e.target.checked)
                  }
                  className="mr-2"
                />
                <span className="text-sm">Electricity Token Service</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formik.values.isBoth}
                  onChange={(e) =>
                    handleServiceChange("both", e.target.checked)
                  }
                  className="mr-2"
                />
                <span className="text-sm font-medium">Both Services</span>
              </label>
            </div>
          </div>

          <CustomTextInput
            label="Expiration Date (Optional)"
            name="expiresAt"
            type="date"
            value={formik.values.expiresAt}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.expiresAt && formik.errors.expiresAt}
            placeholder="Select expiration date"
          />

          <div className="flex justify-end gap-3 pt-4">
            <CustomButton
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              disabled={
                createApiKeyMutation.isPending ||
                !formik.isValid ||
                !formik.dirty
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createApiKeyMutation.isPending
                ? "Creating..."
                : "Create API Key"}
            </CustomButton>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateApiKeyModal;

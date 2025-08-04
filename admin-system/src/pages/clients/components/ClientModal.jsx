import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useCreateClientMutation,
  useUpdateClientMutation,
} from "../clientQueries";
import CustomModal from "../../../components/generic/CustomModal";
import CustomTextInput from "../../../components/generic/CustomTextInput";
import CustomTextArea from "../../../components/generic/CustomTextArea";
import CustomSelectInput from "../../../components/generic/CustomSelectInput";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const ClientModal = ({ client, onClose, onSuccess }) => {
  const queryClient = useQueryClient();
  const createMutation = useCreateClientMutation();
  const updateMutation = useUpdateClientMutation();

  const isEditing = !!client;

  const formik = useFormik({
    initialValues: {
      name: client?.name || "",
      email: client?.email || "",
      contactPerson: client?.contactPerson || "",
      contactPhone: client?.contactPhone || "",
      address: client?.address || "",
      website: client?.website || "",
      plan: client?.plan || "basic",
      notes: client?.notes || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Company name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      contactPerson: Yup.string().required("Contact person is required"),
      contactPhone: Yup.string(),
      address: Yup.string(),
      website: Yup.string().url("Invalid website URL"),
      plan: Yup.string().oneOf(
        ["basic", "premium", "enterprise"],
        "Invalid plan"
      ),
      notes: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        if (isEditing) {
          await updateMutation.mutateAsync({
            clientId: client.id,
            clientData: values,
          });
        } else {
          await createMutation.mutateAsync(values);
        }
        queryClient.invalidateQueries(["clients"]);
        toast.success(
          isEditing
            ? "Client updated successfully!"
            : "Client created successfully!"
        );
        onSuccess();
      } catch (error) {
        console.error("Form submission failed:", error);
        toast.error(error?.response?.data?.message || "Failed to save client");
      }
    },
  });

  useEffect(() => {
    if (client) {
      formik.resetForm();
    }
  }, [client]);

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <CustomModal
      title={isEditing ? "Edit Client" : "Add New Client"}
      isOpen={true}
      setIsOpen={onClose}
      className={"w-[450px] h-[500px]"}
    >
      <div className="w-full h-full flex flex-col gap-4">
        <div className="flex-1 flex flex-col gap-3 p-2 overflow-y-auto">
          <CustomTextInput
            required={true}
            id={"name"}
            label={"Company Name"}
            onChange={formik.handleChange}
            value={formik.values.name}
            error={formik.errors.name}
            placeholder="Enter company name"
          />

          <CustomTextInput
            required={true}
            id={"email"}
            label={"Email Address"}
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            error={formik.errors.email}
            placeholder="Enter email address"
          />

          <CustomTextInput
            required={true}
            id={"contactPerson"}
            label={"Contact Person"}
            onChange={formik.handleChange}
            value={formik.values.contactPerson}
            error={formik.errors.contactPerson}
            placeholder="Enter contact person name"
          />

          <CustomTextInput
            id={"contactPhone"}
            label={"Contact Phone"}
            onChange={formik.handleChange}
            value={formik.values.contactPhone}
            error={formik.errors.contactPhone}
            placeholder="Enter contact phone number"
          />

          <CustomTextArea
            id={"address"}
            label={"Address"}
            onChange={formik.handleChange}
            value={formik.values.address}
            error={formik.errors.address}
            placeholder="Enter company address"
            rows={3}
          />

          <CustomTextInput
            id={"website"}
            label={"Website"}
            onChange={formik.handleChange}
            value={formik.values.website}
            error={formik.errors.website}
            placeholder="https://example.com"
          />

          <CustomSelectInput
            required={true}
            id={"plan"}
            label={"Subscription Plan"}
            value={formik.values.plan}
            onChange={formik.handleChange}
            error={formik.errors.plan}
            options={[
              { value: "basic", label: "Basic" },
              { value: "premium", label: "Premium" },
              { value: "enterprise", label: "Enterprise" },
            ]}
          />

          <CustomTextArea
            id={"notes"}
            label={"Notes"}
            onChange={formik.handleChange}
            value={formik.values.notes}
            error={formik.errors.notes}
            placeholder="Additional notes about this client"
            rows={3}
          />
        </div>
        <div className="p-2 flex items-center justify-end">
          <button
            type="button"
            className="bg-primary text-white px-4 py-2 rounded disabled:hover:bg-primary disabled:opacity-50"
            onClick={formik.submitForm}
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {formik.isSubmitting
              ? "Saving..."
              : isEditing
              ? "Update Client"
              : "Create Client"}
          </button>
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ClientModal;

import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useApproveTopUpRequestMutation } from "../../topupRequestQueries";
import CustomTextInput from "../../../../components/generic/CustomTextInput";
import CustomTextArea from "../../../../components/generic/CustomTextArea";
import CustomModal from "../../../../components/generic/CustomModal";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const ApproveRequestModal = ({ isOpen, setIsOpen, requestId }) => {
  const queryClient = useQueryClient();
  const approveRequestMutation = useApproveTopUpRequestMutation();

  const formik = useFormik({
    initialValues: {
      approvedAmount: "",
      adminNotes: "",
    },
    onSubmit: async (values) => {
      try {
        await approveRequestMutation.mutateAsync({
          ...values,
          id: requestId,
        });
        queryClient.invalidateQueries(["topUpRequestDetails"]);
        toast.success("Request approved successfully!");
        setIsOpen(false);
        // Handle successful approval (e.g., show a success message)
      } catch (error) {
        console.log(error);
        // Handle error (e.g., show an error message)
        toast.error(
          error?.response?.data?.message || "Failed to approve request"
        );
      }
    },
    validationSchema: Yup.object().shape({
      approvedAmount: Yup.number()
        .min(0, "Amount must be positive")
        .required("Required"),
      adminNotes: Yup.string().max(500, "Must be 500 characters or less"),
    }),
  });

  useEffect(() => {
    if (isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  return (
    <CustomModal
      title={"Approve Top-Up Request"}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className={"w-[450px] h-[450px]"}
    >
      <div className="w-full h-full flex flex-col gap-4">
        <div className="flex-1 flex flex-col gap-3 p-2 overflow-y-auto">
          <CustomTextInput
            required={true}
            id={"approvedAmount"}
            label={"Approved Amount"}
            onChange={formik.handleChange}
            value={formik.values.approvedAmount}
            error={formik.errors.approvedAmount}
            type="number"
            placeholder="Enter approved amount"
          />

          <CustomTextArea
            id={"adminNotes"}
            label={"Admin Notes"}
            onChange={formik.handleChange}
            value={formik.values.adminNotes}
            error={formik.errors.adminNotes}
            placeholder="Enter any notes or comments"
            maxLength={500}
          />
        </div>
        <div className="p-2 flex items-center justify-end">
          <button
            type="button"
            className="bg-primary text-white px-4 py-2 rounded disabled:hover:bg-primary disabled:opacity-50"
            onClick={formik.submitForm}
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {formik.isSubmitting ? "Approving..." : "Approve Request"}
          </button>
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ApproveRequestModal;

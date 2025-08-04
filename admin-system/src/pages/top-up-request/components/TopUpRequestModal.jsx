import React, { use, useEffect } from "react";
import CustomModal from "../../../components/generic/CustomModal";
import CustomButton from "../../../components/generic/CustomButton";
import TopUpRequestForm from "./TopUpRequestForm";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import { useCreateTopUpRequestMutation } from "../topupRequestQueries";
import { useQueryClient } from "@tanstack/react-query";
const TopUpRequestModal = ({ isOpen, setIsOpen }) => {
  const topupRequestMutation = useCreateTopUpRequestMutation();
  const queryClient = useQueryClient();
  const formik = useFormik({
    initialValues: {
      requestedAmount: "",
      paymentMethod: "",
      clientNotes: "",
      receipt: null,
    },
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("requestedAmount", values.requestedAmount);
        formData.append("paymentMethod", values.paymentMethod);
        formData.append("clientNotes", values.clientNotes);
        formData.append("receipt", values.receipt);
        await topupRequestMutation.mutateAsync(formData);
        queryClient.invalidateQueries({
          queryKey: ["topUpRequests"],
        });
        toast.success("Top-up request submitted successfully!");
        setIsOpen(false);
      } catch (error) {
        console.log(error);
        toast.error(
          error?.response?.data?.message || "Failed to submit top-up request"
        );
      }
    },
    validationSchema: Yup.object().shape({
      requestedAmount: Yup.number()
        .required("Requested amount is required")
        .min(1, "Amount must be at least 1"),
      paymentMethod: Yup.string().required("Payment method is required"),
      clientNotes: Yup.string().optional(),
      receipt: Yup.mixed().required("Receipt is required"),
    }),
  });

  useEffect(() => {
    formik.resetForm();
  }, [isOpen]);

  return (
    <CustomModal
      className={"w-[500px] h-[500px]"}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={"Top Up Request"}
    >
      <div className="w-full h-full flex flex-col gap-4">
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
          {/* Form component can be added here */}
          <TopUpRequestForm formik={formik} />
        </div>
        <div className="flex items-center justify-end p-2">
          <CustomButton
            disabled={!formik.isValid || formik.isSubmitting}
            onClick={formik.submitForm}
          >
            {formik.isSubmitting ? "Submitting..." : "Submit Request"}
          </CustomButton>
          <button
            className="px-4 py-2  rounded-md"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default TopUpRequestModal;

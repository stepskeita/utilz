import React, { useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useChangePasswordMutation } from "./changePasswordQueries";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { updatePasswordClient } from "../../store/store"; // Uncomment if you want to update redux
import toast from "react-hot-toast";

import CustomTextInput from "../../components/generic/CustomTextInput";
import CustomButton from "../../components/generic/CustomButton";

const ChangePasswordPage = () => {
  const changePasswordMutation = useChangePasswordMutation();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .min(8, "Must be at least 8 characters long")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm your new password"),
    }),
    onSubmit: async (values) => {
      try {
        await changePasswordMutation.mutateAsync(values);
        toast.success("Password updated successfully!");
        navigate("/dashboard");
      } catch (error) {
        console.error("Change password failed:", error);
      }
    },
  });

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Change Password</h2>
          <p className="mt-2 text-base text-gray-600">
            Update your password for enhanced security.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <form className="p-8 space-y-6" onSubmit={formik.handleSubmit}>
            <CustomTextInput
              label={"Current Password"}
              id="currentPassword"
              type="password"
              placeholder="Enter your current password"
              onChange={formik.handleChange}
              required={true}
              error={formik.errors.currentPassword}
              showEyeIcon={true}
            />

            <CustomTextInput
              label={"New Password"}
              id="newPassword"
              type="password"
              placeholder="Enter your new password"
              onChange={formik.handleChange}
              required={true}
              error={formik.errors.newPassword}
              showEyeIcon={true}
            />

            <CustomTextInput
              label={"Confirm New Password"}
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              onChange={formik.handleChange}
              required={true}
              error={formik.errors.confirmPassword}
              showEyeIcon={true}
            />

            {formik.status?.error && (
              <p className="text-sm text-red-600">{formik.status.error}</p>
            )}
            {formik.status?.success && (
              <p className="text-sm text-green-600">{formik.status.success}</p>
            )}

            <div className="flex justify-end pt-4">
              <CustomButton
                type="submit"
                className=" w-[150px]"
                disabled={
                  formik.isSubmitting || changePasswordMutation.isLoading
                }
              >
                {formik.isSubmitting || changePasswordMutation.isLoading
                  ? "Updating..."
                  : "Update Password"}
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;

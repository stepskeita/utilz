import React, { useEffect } from "react";
import CustomLogo from "../../../components/generic/CustomLogo";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../../components/generic/CustomTextInput";
import CustomButton from "../../../components/generic/CustomButton";
import { useResetPassword } from "../forgotPasswordQueries";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const resetPasswordMutation = useResetPassword();

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },

    onSubmit: async (values) => {
      try {
        await resetPasswordMutation.mutateAsync({
          token,
          ...values,
        });
        // Redirect or show success message

        toast.success("Password reset successfully!");
        navigate("/");
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to reset password."
        );
        console.error("Reset password error:", error);
      }
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(
          /[@$!%*?&]/,
          "Password must contain at least one special character"
        ),
      confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
    }),
  });

  useEffect(() => {
    if (!token) navigate("/forgot-password");
  }, [token]);

  return (
    <div class="relative flex min-h-screen flex-col">
      <header class="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
        <CustomLogo />
      </header>
      <main class="flex flex-1 items-center justify-center py-12 sm:py-16 lg:py-20">
        <div class="w-full max-w-md px-4">
          <div class="text-center">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Create new password
            </h2>
          </div>
          <div class="mt-8 space-y-6">
            <div class="space-y-2">
              <CustomTextInput
                id={"newPassword"}
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                error={formik.errors.newPassword}
                type={"password"}
                placeholder={"New Password"}
                label={"New Password"}
                required={true}
                showEyeIcon={true}
              />

              <CustomTextInput
                id={"confirmPassword"}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                error={formik.errors.confirmPassword}
                type={"password"}
                placeholder={"Confirm Password"}
                label={"Confirm Password"}
                required={true}
                showEyeIcon={true}
              />
            </div>
            <div>
              <CustomButton
                onClick={formik.submitForm}
                disabled={formik.isSubmitting || !formik.isValid}
                className={"w-full"}
              >
                {formik.isSubmitting ? "Resetting..." : "Reset Password"}
              </CustomButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;

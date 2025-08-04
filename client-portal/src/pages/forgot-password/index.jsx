import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import CustomLogo from "../../components/generic/CustomLogo";
import { Link } from "react-router-dom";
import CustomButton from "../../components/generic/CustomButton";
import CustomTextInput from "../../components/generic/CustomTextInput";
import { useRequestPasswordReset } from "./forgotPasswordQueries";
import toast from "react-hot-toast";
import EmailSent from "./components/EmailSent";

const ForgotPasswordPage = () => {
  const [openSent, setOpenSent] = React.useState(false);
  const requestPasswordReset = useRequestPasswordReset();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values) => {
      try {
        await requestPasswordReset.mutateAsync(values);
        toast.success("Password reset link sent to your email.");
        setOpenSent(true);
      } catch (error) {
        toast.error("Failed to send password reset link.");
      }
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
  });
  return (
    <div class="relative flex min-h-screen flex-col">
      <header class="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
        <div class="flex items-center gap-3">
          <CustomLogo />
        </div>
      </header>
      <main class="flex flex-1 items-center justify-center py-12 sm:py-16 lg:py-20">
        {openSent ? (
          <EmailSent setOpenSent={setOpenSent} />
        ) : (
          <div class="w-full max-w-md px-4">
            <div class="text-center">
              <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Reset your password
              </h2>
            </div>
            <div class="mt-8 space-y-6">
              <div class="space-y-4">
                <p class="text-base text-gray-600 text-center">
                  Enter your email address and we will send you a link to reset
                  your password.
                </p>
                <CustomTextInput
                  label={"Email address"}
                  required={true}
                  placeholder={"Enter your email address"}
                  id={"email"}
                  values={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.errors.email}
                />
              </div>
              <div>
                <CustomButton
                  disabled={formik.isSubmitting || !formik.isValid}
                  onClick={formik.submitForm}
                  className={"w-full"}
                >
                  {formik.isSubmitting ? "Sending..." : "Send Reset Link"}
                </CustomButton>
              </div>
            </div>
            <p class="mt-6 text-center text-sm text-gray-600">
              Remembered your password?
              <Link
                class="font-medium text-[var(--brand-color)] hover:text-opacity-90 ml-2"
                to="/"
              >
                Sign in
              </Link>
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ForgotPasswordPage;

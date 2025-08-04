import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "./loginQueries";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin } from "../../store/store";
import CustomLogo from "../../components/generic/CustomLogo";
import CustomTextInput from "../../components/generic/CustomTextInput";
import CustomButton from "../../components/generic/CustomButton";

const LoginPage = () => {
  const loginMutation = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await loginMutation.mutateAsync(values);

        dispatch(loginAdmin(response.data?.data || {}));

        if (values.password === "password") {
          navigate("/change-password");
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
  });

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <CustomLogo />
          </div>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <form className="space-y-6" onSubmit={formik.handleSubmit}>
              <CustomTextInput
                label={"Email"}
                id="email"
                placeholder="Your email address"
                onChange={formik.handleChange}
                required={true}
                error={formik.errors.email}
              />
              <CustomTextInput
                label={"Password"}
                id="password"
                type="password"
                placeholder="Your password"
                onChange={formik.handleChange}
                required={true}
                showEyeIcon={true}
                error={formik.errors.password}
              />
              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <Link
                    to={"/forgot-password"}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <div>
                <CustomButton
                  type="submit"
                  className="w-full p-2"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? "Logging in..." : "Login"}
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;

import React from "react";
import CustomButton from "../../../components/generic/CustomButton";
import { useNavigate } from "react-router-dom";

const EmailSent = ({ setOpenSent }) => {
  const navigate = useNavigate();
  return (
    <div class="w-full max-w-md space-y-8">
      <div>
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-color)]">
          <svg
            aria-hidden="true"
            class="h-6 w-6 text-[var(--accent-color)]"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-[var(--accent-color)]">
          Check your email
        </h2>
        <p class="mt-2 text-center text-sm text-[var(--secondary-color)]">
          We've sent a password reset link to your email address.
        </p>
      </div>
      <div class="rounded-md bg-white p-8 shadow">
        <p class="text-center text-[var(--secondary-color)]">
          If you don't see the email in your inbox, please check your spam
          folder. The link will expire in 1 hour.
        </p>
        <div class="mt-8 text-center">
          <CustomButton className={"w-full "} onClick={() => navigate("/")}>
            Back to Login
          </CustomButton>
        </div>
      </div>
      <p class="mt-4 text-center text-sm text-[var(--secondary-color)] mr-2">
        Didn't receive the email?
        <button
          onClick={() => setOpenSent(false)}
          class="font-medium text-[var(--accent-color)] hover:underline"
        >
          Resend link
        </button>
      </p>
    </div>
  );
};

export default EmailSent;

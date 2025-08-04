import React from "react";
import ErrorIcon from "../../assets/icons/error.png";
import { twMerge } from "tailwind-merge";

const IsError = ({
  message = "Server error: Cannot perform this request",
  className,
}) => {
  return (
    <div
      className={twMerge(
        "py-7 px-3 flex flex-col items-center justify-center gap-4",
        className
      )}
    >
      <img src={ErrorIcon} className="object-scale-down w-[150px]" alt="" />

      <p>{message}</p>
    </div>
  );
};

export default IsError;

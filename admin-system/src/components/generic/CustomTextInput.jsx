import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

const CustomTextInput = ({
  id,
  label,
  required,
  placeholder,
  error,
  className,
  showEyeIcon = false,
  hideErrorComponent = false,
  ...rest
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="">
      {label && (
        <label htmlFor={id} className="block text-sm text-main mb-2">
          {label} {required && <sup className="text-red-500">*</sup>}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          className={twMerge(
            "text-sm border border-gray-300 p-2 outline-none h-[38px]  w-full",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          autoComplete="off"
          {...rest}
          type={rest?.type ? (show ? "text" : rest?.type) : "text"}
        />
        {rest?.type === "password" && showEyeIcon && (
          <button
            onClick={() => setShow(!show)}
            type="button"
            className="bg-none p-1 absolute right-0 top-1/2 -translate-y-1/2"
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
      {!hideErrorComponent ? (
        error ? (
          <small className="text-xs text-red-500 block">{error}</small>
        ) : (
          <small
            className="text-xs text-red-500 block"
            style={{
              visibility: "hidden",
            }}
          >
            X
          </small>
        )
      ) : null}
    </div>
  );
};

export default CustomTextInput;

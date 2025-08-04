import React from "react";
import { twMerge } from "tailwind-merge";

const CustomTextArea = ({
  id,
  label,
  required,
  placeholder,
  error,
  className,
  ...rest
}) => {
  return (
    <div className="">
      {label && (
        <label htmlFor={id} className="block text-sm text-main mb-2">
          {label} {required && <sup className="text-red-500">*</sup>}
        </label>
      )}
      <div className="relative">
        <textarea
          id={id}
          placeholder={placeholder}
          className={twMerge(
            "text-sm border border-gray-300 p-2 outline-none  w-full h-[175px]",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          autoComplete="off"
          {...rest}
        />
      </div>
      {error ? (
        <small className="text-red-500 text-xs">{error}</small>
      ) : (
        <small
          className="text-red-500 text-xs"
          style={{
            visibility: "hidden",
          }}
        >
          X
        </small>
      )}
    </div>
  );
};

export default CustomTextArea;

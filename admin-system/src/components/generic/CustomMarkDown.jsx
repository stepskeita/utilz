import React from "react";
import Editor from "react-simple-wysiwyg";
import { twMerge } from "tailwind-merge";

const CustomMarkDown = ({
  label,
  error,
  required = false,
  className = "",
  ...rest
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-normal text-gray-600">
          {label} {required && <sup className="text-red-500">*</sup>}
        </label>
      )}
      <div className="relative flex-1">
        <Editor
          className={twMerge(
            "border border-gray-300 outline-none   px-2 text-xs py-2 w-full rounded-md",
            className,

            error && "border-red-500 focus:border-red-500 "
          )}
          {...rest}
        />
      </div>
      {error ? (
        <p className="text-xs text-red-500 px-1">{error}</p>
      ) : (
        <p
          className="text-xs text-red-500 px-1"
          style={{
            visibility: "hidden",
          }}
        >
          x
        </p>
      )}
    </div>
  );
};

export default CustomMarkDown;

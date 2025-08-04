import classNames from "classnames";
import React from "react";
import { twMerge } from "tailwind-merge";
import { v4 as uuidV4 } from "uuid";
const CustomSelectInput = ({
  id,
  label,
  required,
  placeholder,
  error,
  options,
  className,
  hideErrorComponent = false,
  ...rest
}) => {
  return (
    <div className="">
      {label && (
        <label htmlFor={id} className="block text-sm text-main mb-2">
          {label} {required && <sup className="text-red-500">*</sup>}
        </label>
      )}
      <select
        id={id}
        {...rest}
        className={twMerge(
          "text-sm border border-gray-300 p-2 outline-none h-[38px]  w-full",
          error && "border-red-500 focus:border-red-500",
          className
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option value={option.value} key={uuidV4()}>
            {option.label}
          </option>
        ))}
      </select>
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

export default CustomSelectInput;

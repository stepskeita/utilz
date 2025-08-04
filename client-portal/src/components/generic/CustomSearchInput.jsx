import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

const CustomSearchInput = ({
  id,
  required,
  placeholder,
  error,
  className,
  width = "100%",
  ...rest
}) => {
  return (
    <div className="">
      <div
        className={twMerge(
          "flex items-center bg-white rounded-md border border-gray-300",
          error && "border-red-500"
        )}
        style={{
          width,
        }}
      >
        <FaMagnifyingGlass className="text-xl m-2 text-gray-700" />
        <input
          type="text"
          className="flex-1 outline-none border-none p-1 text-gray-600"
          placeholder={placeholder || "Search..."}
          {...rest}
        />
      </div>
      {error && <small className="text-red-500 text-sm my-1">{error}</small>}
    </div>
  );
};

export default CustomSearchInput;

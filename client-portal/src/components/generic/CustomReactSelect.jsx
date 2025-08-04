import React from "react";
import { FaChevronDown } from "react-icons/fa6";
import Select from "react-select";
import { twMerge } from "tailwind-merge";
import colors from "../../constants/colors";

const CustomReactSelect = ({
  label,
  error,
  options,
  required,
  className,
  hideErrorComponent = false,
  ...rest
}) => {
  return (
    <div>
      {label && (
        <label className={twMerge("block text-sm text-main mb-2")}>
          {label} {required && <sup className="text-red-500">*</sup>}
        </label>
      )}
      <div className="w-full relative">
        <Select
          options={options}
          styles={{
            control: (provided, state) => ({
              ...provided,
              outline: "none",
              borderColor: error
                ? "red"
                : state.isFocused
                ? colors.primary
                : colors.primary,
              boxShadow: "none",
              borderRadius: 0,
              borderWidth: 0,
            }),
            menu: (provided) => ({
              ...provided,
              maxHeight: "300px",
              overflowY: "auto",
              position: "absolute",
              zIndex: 1000, // Adjust if necessary
            }),
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999, // Ensure it's above other elements
            }),
            singleValue: (provided) => ({
              ...provided,
              fontSize: 13,
              outline: "none",
            }),
            placeholder: (provided) => ({
              ...provided,
              // color: "#a0aec0",
              padding: 5,
              outline: "none",
            }),
            option: (provided, state) => ({
              ...provided,
              background:
                state.isFocused && !state.isSelected
                  ? "#f6f6f6"
                  : state.isSelected
                  ? colors.primary
                  : "#fff",
              fontSize: 13,
            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              display: "none",
              outline: "none",
              border: "none",
            }),
          }}
          className={twMerge(
            "outline-none bg-none border border-gray-300 focus:border-main h-full w-full text-sm font-light ",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          menuPlacement="auto" // auto | top | bottom
          menuShouldScrollIntoView={true} // Ensures the dropdown scrolls into view
          {...rest}
        />

        {/* drop down icon */}
        {(!rest?.isMulti || (rest?.isMulti && rest?.value?.length === 0)) && (
          <div
            className={twMerge(
              "text-xs z-10 absolute top-1/2 -translate-y-1/2 right-1",
              error && "text-red-500"
            )}
          >
            <FaChevronDown />
          </div>
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

export default CustomReactSelect;

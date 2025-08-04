import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineFolderOpen } from "react-icons/ai";
import { getFileIcon } from "../../helperFunctions";
import { twMerge } from "tailwind-merge";

const CustomFileInput = ({
  containerClassNames,
  inputClassNames,
  labelClassNames,
  id = "file-upload",
  children,
  files = [],
  setFiles,
  required,
  onDelete,
  error,
  label,
  hideErrorComponent = false,
  ...rest
}) => {
  return (
    <div className="w-full ">
      {label && (
        <label htmlFor={id} className="block text-sm text-main mb-2">
          {label} {required && <sup className="text-red-500">*</sup>}
        </label>
      )}
      <label
        htmlFor={"file-upload"}
        className={twMerge(
          "w-full border border-dotted border-gray-400 flex flex-col justify-center items-center gap-2 cursor-pointer h-[150px]",
          error && "border-red-500"
        )}
      >
        <div className="w-[40px] h-[40px] rounded-full bg-primary/10 flex items-center justify-center">
          <AiOutlineFolderOpen className="text-xl text-primary" />
        </div>
        <p className="text-xs font-semibold whitespace-nowrap">
          Drag and drop your files
        </p>
      </label>
      <input
        type="file"
        onChange={(e) => setFiles(e.target.files)}
        id={"file-upload"}
        {...rest}
        hidden
      />

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

      {Object.keys(files)?.length > 0 && (
        <div className="flex items-stretch gap-3 flex-wrap">
          {Object.keys(files)?.map((key, idx) => (
            <div className="relative w-[80px]">
              <button
                onClick={() => onDelete(idx)}
                className="text-white bg-red-500 absolute top-1 right-1 z-20 p-1 rounded-md hover:bg-red-600"
              >
                <AiOutlineDelete className="text-xl" />
              </button>
              <img
                src={getFileIcon(files[key])}
                className="w-full object-scale-down block mb-2"
              />
              <p className="text-xs mx-auto">{files[key].name || "NO NAME"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomFileInput;

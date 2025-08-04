import React from "react";
import CustomSpinner from "./CustomSpinner";
import { twMerge } from "tailwind-merge";

const IsLoading = ({ className }) => {
  return (
    <div
      className={twMerge(
        "h-[250px] flex items-center justify-center",
        className
      )}
    >
      <CustomSpinner />
    </div>
  );
};

export default IsLoading;

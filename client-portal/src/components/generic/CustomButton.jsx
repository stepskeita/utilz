import React from "react";
import { twMerge } from "tailwind-merge";

const CustomButton = ({ className, children, ...props }) => {
  return (
    <button
      className={twMerge(
        "p-[5px] xl:p-[7px] px-[10px] xl:px-[15px] text-sm xl:text-base rounded-lg bg-primary/90 hover:bg-primary text-white flex justify-center items-center gap-3 disabled:cursor-not-allowed disabled:bg-primary/60 whitespace-nowrap",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;

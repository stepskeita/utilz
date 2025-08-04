import React from "react";
import { twMerge } from "tailwind-merge";

const CustomCard = ({ className, children, ...props }) => {
  return (
    <div
      className={twMerge(
        "w-full rounded-xl bg-white border border-gray-300 shadow-sm ",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default CustomCard;

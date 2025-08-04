import React from "react";
import { twMerge } from "tailwind-merge";

const CustomSpinner = ({ className }) => {
  return <span className={twMerge("loader", className)}></span>;
};

export default CustomSpinner;

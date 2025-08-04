import React from "react";
import { twMerge } from "tailwind-merge";

const CustomLogo = ({ className }) => {
  return (
    <h2 className={twMerge("text-primary font-bold text-2xl", className)}>
      <span className="text-black">ITOPUP</span> PORTAL
    </h2>
  );
};

export default CustomLogo;

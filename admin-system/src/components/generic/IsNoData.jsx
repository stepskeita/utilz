import React from "react";
import { twMerge } from "tailwind-merge";
import NotFoundIcon from "../../assets/icons/not-found.png";

const IsNoData = ({
  message = "No data found. Please add more, to populate the list.",
  className = "",
}) => {
  return (
    <div
      className={twMerge(
        "py-7 px-3 flex flex-col items-center justify-center gap-4",
        className
      )}
    >
      <img src={NotFoundIcon} className="object-scale-down w-[150px]" alt="" />
      {message}
    </div>
  );
};

export default IsNoData;

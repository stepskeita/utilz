import React from "react";
import { twMerge } from "tailwind-merge";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";

const CustomPagination = ({ className, filters, setFilters, pagination }) => {
  return (
    <div
      className={twMerge("flex items-center justify-between mt-4", className)}
    >
      <div className="flex items-center gap-1">
        <button
          disabled={!pagination?.hasPrevPage}
          onClick={() =>
            setFilters({
              ...filters,
              page: pagination?.currentPage - 1,
            })
          }
          className="p-1 w-[100px] h-[25px] md:h-[35px] overflow-hidden px-3 border-[1px] bg-white text-primary outline-none text-xs font-light flex items-center justify-center hover:bg-primary/5 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:hover:bg-gray-50"
        >
          <AiOutlineLeft className="md:text-xl font-bold" />
        </button>
        <button
          disabled={!pagination?.hasNextPage}
          onClick={() =>
            setFilters({
              ...filters,
              page: pagination?.currentPage + 1,
            })
          }
          className="p-1 w-[100px] h-[25px] md:h-[35px] overflow-hidden px-3 border-[1px] bg-white text-primary outline-none text-xs font-light flex items-center justify-center hover:bg-primary/5 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:hover:bg-gray-50"
        >
          <AiOutlineRight className="md:text-xl font-bold" />
        </button>
      </div>

      <select
        value={pagination?.pageLimit || filters?.limit || ""}
        onChange={(e) =>
          e.target.value &&
          setFilters({
            ...filters,
            limit: e.target.value,
          })
        }
        className="h-[25px] p-1 md:h-[35px] overflow-hidden px-3 border-[1px] border-gray-400 outline-none text-xs font-light"
      >
        {/* <option value="">Limit</option> */}
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
        <option value="25">25</option>
        <option value="30">30</option>
        <option value="all">All</option>
      </select>
    </div>
  );
};

export default CustomPagination;

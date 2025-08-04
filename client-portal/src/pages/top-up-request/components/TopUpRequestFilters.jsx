import React from "react";
import CustomCard from "../../../components/generic/CustomCard";
import CustomSelectInput from "../../../components/generic/CustomSelectInput";
import CustomButton from "../../../components/generic/CustomButton";

const TopUpRequestFilters = ({ filters, setFilters }) => {
  return (
    <CustomCard className="flex justify-between  p-4">
      <h2 className="text-lg font-semibold">Top Up Request Filters</h2>

      <div className="flex items-center gap-3">
        <CustomSelectInput
          value={filters?.status || ""}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          placeholder={"Choose Status"}
          options={[
            { value: "", label: "All Statuses" },
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
          ]}
          hideErrorComponent={true}
        />

        <CustomButton
          onClick={() =>
            setFilters({
              limit: filters.limit || 10,
              page: 1,
            })
          }
        >
          Clear Filters
        </CustomButton>
      </div>
    </CustomCard>
  );
};

export default TopUpRequestFilters;

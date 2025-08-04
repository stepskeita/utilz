import React from "react";
import CustomCard from "../../../components/generic/CustomCard";
import CustomTextInput from "../../../components/generic/CustomTextInput";
import CustomSelectInput from "../../../components/generic/CustomSelectInput";
import CustomButton from "../../../components/generic/CustomButton";

const TransactionFilters = ({ filters, setFilters }) => {
  return (
    <CustomCard className={"p-6 bg-white border border-gray-200 shadow-sm"}>
      <h2 className="text-lg font-semibold mb-2">Transaction Filters</h2>
      <p className="text-gray-600 mb-2">
        Use the filters below to narrow down your transaction search.
      </p>
      {/* Add filter inputs here */}
      <div className="flex items-center justify-end gap-4 ">
        <CustomSelectInput
          value={filters.type || "all"}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          placeholder={"Choose Service Type"}
          options={[
            { value: "all", label: "All Services" },
            { value: "airtime", label: "Airtime" },
            { value: "cashpower", label: "Electricity Tokens" },
          ]}
          hideErrorComponent={true}
        />

        <CustomTextInput
          value={filters.amount || ""}
          onChange={(e) => setFilters({ ...filters, amount: e.target.value })}
          placeholder={"Amount (GMD)"}
          hideErrorComponent={true}
        />

        <CustomSelectInput
          value={filters.status || ""}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          placeholder={"Choose Status"}
          options={[
            { value: "", label: "All Status" },
            { value: "success", label: "Success" },
            { value: "fail", label: "Failed" },
          ]}
          hideErrorComponent={true}
        />

        <CustomButton
          onClick={() =>
            setFilters({
              limit: filters.limit || 10,
              page: 1,
              type: "all",
            })
          }
        >
          Clear Filters
        </CustomButton>
      </div>
    </CustomCard>
  );
};

export default TransactionFilters;

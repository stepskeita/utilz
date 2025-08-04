import React from "react";
import CustomCard from "../../../components/generic/CustomCard";
import CustomTextInput from "../../../components/generic/CustomTextInput";
import CustomSelectInput from "../../../components/generic/CustomSelectInput";
import CustomButton from "../../../components/generic/CustomButton";

const ClientFilters = ({ filters, setFilters }) => {
  return (
    <CustomCard className={"p-6 bg-white border border-gray-200 shadow-sm"}>
      <h2 className="text-lg font-semibold mb-2">Client Filters</h2>
      <p className="text-gray-600 mb-2">
        Use the filters below to narrow down your client search.
      </p>
      <div className="flex items-center justify-end gap-4">
        <CustomTextInput
          value={filters.search || ""}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder={"Search clients..."}
          hideErrorComponent={true}
        />

        <CustomSelectInput
          value={filters.status || ""}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          placeholder={"Choose Status"}
          options={[
            { value: "", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
          hideErrorComponent={true}
        />

        <CustomSelectInput
          value={filters.plan || ""}
          onChange={(e) => setFilters({ ...filters, plan: e.target.value })}
          placeholder={"Choose Plan"}
          options={[
            { value: "", label: "All Plans" },
            { value: "basic", label: "Basic" },
            { value: "premium", label: "Premium" },
            { value: "enterprise", label: "Enterprise" },
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

export default ClientFilters;

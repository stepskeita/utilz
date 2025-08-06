import React from "react";
import CustomCard from "../../../components/generic/CustomCard";
import CustomTextInput from "../../../components/generic/CustomTextInput";
import CustomSelectInput from "../../../components/generic/CustomSelectInput";
import CustomButton from "../../../components/generic/CustomButton";

const ApiKeyFilters = ({ filters, setFilters }) => {
  return (
    <CustomCard className={"p-6 bg-white border border-gray-200 shadow-sm"}>
      <h2 className="text-lg font-semibold mb-2">API Key Filters</h2>
      <p className="text-gray-600 mb-2">
        Use the filters below to narrow down your API key search.
      </p>
      <div className="flex items-center justify-end gap-4">
        <CustomTextInput
          value={filters.search || ""}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder={"Search API Keys"}
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
          value={filters.service || ""}
          onChange={(e) => setFilters({ ...filters, service: e.target.value })}
          placeholder={"Choose Service"}
          options={[
            { value: "", label: "All Services" },
            { value: "airtime", label: "Airtime Only" },
            { value: "cashpower", label: "Electricity Only" },
            { value: "both", label: "Both Services" },
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

export default ApiKeyFilters;

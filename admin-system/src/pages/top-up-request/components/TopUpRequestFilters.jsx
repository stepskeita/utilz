import React from "react";
import CustomCard from "../../../components/generic/CustomCard";
import CustomSelectInput from "../../../components/generic/CustomSelectInput";
import CustomButton from "../../../components/generic/CustomButton";
import CustomReactSelect from "../../../components/generic/CustomReactSelect";
import { useGetClientsQuery } from "../topupRequestQueries";

const TopUpRequestFilters = ({ filters, setFilters }) => {
  const getClientsQuery = useGetClientsQuery();

  return (
    <CustomCard className="flex justify-between  p-4">
      <h2 className="text-lg font-semibold">Filters</h2>

      <div className="flex items-center gap-3">
        <CustomReactSelect
          className={"w-44"}
          value={{
            value: filters.clientId || "",
            label:
              getClientsQuery.data?.find(
                (client) => client.id === filters.clientId
              )?.name || "Choose Client",
          }}
          onChange={(selectedOption) =>
            setFilters({ ...filters, clientId: selectedOption.value })
          }
          placeholder={"Choose Client"}
          options={
            getClientsQuery.data?.map((client) => ({
              value: client.id,
              label: client.name,
            })) || []
          }
          hideErrorComponent={true}
        />
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

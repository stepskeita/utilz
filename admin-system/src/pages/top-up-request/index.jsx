import React from "react";
import TopUpRequestFilters from "./components/TopUpRequestFilters";
import { useTopUpRequestsQuery } from "./topupRequestQueries";
import TopUpRequestTable from "./components/TopUpRequestTable";
import CustomPagination from "../../components/generic/CustomPagination";

const TopUpRequest = () => {
  const [filters, setFilters] = React.useState({
    page: 1,
    limit: 10,
  });
  const { isPending, data } = useTopUpRequestsQuery(filters);
  console.log(data);

  return (
    <div className="p-4 flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Client Wallet Top Up Request</h1>
      </div>
      <TopUpRequestFilters filters={filters} setFilters={setFilters} />
      <TopUpRequestTable
        topUpRequests={data?.topUpRequests}
        isLoading={isPending}
      />
      <CustomPagination
        pagination={data?.pagination}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
};

export default TopUpRequest;

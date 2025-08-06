import React from "react";
import TopUpRequestFilters from "./components/TopUpRequestFilters";
import { useTopUpRequestsQuery } from "./topupRequestQueries";
import CustomButton from "../../components/generic/CustomButton";
import TopUpRequestModal from "./components/TopUpRequestModal";
import TopUpRequestTable from "./components/TopUpRequestTable";
import CustomPagination from "../../components/generic/CustomPagination";

const TopUpRequest = () => {
  const [filters, setFilters] = React.useState({
    page: 1,
    limit: 10,
  });
  const [openRequestModal, setOpenRequestModal] = React.useState(false);
  const { isPending, data } = useTopUpRequestsQuery(filters);
  console.log(data);

  return (
    <div className="p-4 flex flex-col space-y-4">
      <TopUpRequestModal
        isOpen={openRequestModal}
        setIsOpen={setOpenRequestModal}
      />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Top Up Request</h1>
        <CustomButton onClick={() => setOpenRequestModal(true)}>
          Top Up Wallet
        </CustomButton>
      </div>
      <TopUpRequestFilters filters={filters} setFilters={setFilters} />
      <TopUpRequestTable
        topUpRequests={data?.topUpRequests}
        isPending={isPending}
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

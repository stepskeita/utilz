import React from "react";
import { useGetTransactionHistoryQuery } from "../../api/queries";
import TransactionsTable from "./components/TransactionsTable";
import TransactionFilters from "./components/TransactionFilters";
import CustomPagination from "../../components/generic/CustomPagination";
import CustomCard from "../../components/generic/CustomCard";
import { useNavigate } from "react-router-dom";

const TransactionsPage = () => {
  const [filters, setFilters] = React.useState({
    limit: 10,
    page: 1,
    type: "all", // 'all', 'airtime', 'cashpower'
  });

  const [openRequestModal, setOpenRequestModal] = React.useState(false);
  const { isPending, data } = useGetTransactionHistoryQuery(filters);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <CustomCard className={"p-6 bg-white border border-gray-200 shadow-sm"}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Utility Transactions</h1>
            <p className="text-gray-600">
              View and manage your airtime and electricity token transactions
              here.
            </p>
          </div>
        </div>
      </CustomCard>
      <TransactionFilters filters={filters} setFilters={setFilters} />

      <TransactionsTable
        isLoading={isPending}
        transactions={data?.transactions || []}
        transactionType={filters.type}
      />
      <CustomPagination
        className="mt-4"
        filters={filters}
        setFilters={setFilters}
        pagination={data?.pagination}
      />
    </div>
  );
};

export default TransactionsPage;

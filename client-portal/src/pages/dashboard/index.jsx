import React from "react";
import {
  useGetWalletBalanceQuery,
  useGetApiKeysQuery,
  useGetTransactionHistoryQuery,
  useGetUsageStatsQuery,
} from "../../api/queries";
import APIKeys from "./components/APIKeys";
import WalletTransactions from "./components/WalletTransactions";
import CustomButton from "../../components/generic/CustomButton";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  // Fetch wallet balance
  const { data: walletData, isLoading: walletLoading } =
    useGetWalletBalanceQuery();

  // Fetch API keys
  const { data: apiKeyData, isLoading: apiKeyLoading } = useGetApiKeysQuery();

  // Fetch recent transactions
  const { data: transactionsData, isLoading: transactionsLoading } =
    useGetTransactionHistoryQuery({
      limit: 5,
      page: 1,
    });

  // Fetch usage statistics
  const { data: usageStats, isLoading: statsLoading } = useGetUsageStatsQuery();

  const navigate = useNavigate();

  return (
    <main className="flex-1 p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex w-full h-full flex-col">
            <div className="flex-1">
              <p className="text-gray-800 text-lg font-semibold">
                Wallet Balance
              </p>
              <p className="text-gray-500 text-3xl font-bold mt-2">
                {walletLoading
                  ? "Loading..."
                  : walletData
                  ? `D${walletData.balance.toFixed(2)}`
                  : "--"}
              </p>
            </div>
            <CustomButton
              onClick={() => navigate("/top-up-request")}
              className={"mt-4"}
            >
              Add Funds
            </CustomButton>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-800 text-lg font-semibold mb-4">
            Service Usage
          </h3>
          {statsLoading ? (
            <p className="text-gray-500">Loading stats...</p>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Airtime Transactions
                </span>
                <span className="font-semibold text-blue-600">
                  {usageStats?.airtimeCount || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Electricity Transactions
                </span>
                <span className="font-semibold text-purple-600">
                  {usageStats?.cashpowerCount || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Spent</span>
                <span className="font-semibold text-green-600">
                  D{usageStats?.totalSpent?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <APIKeys apiKeys={apiKeyData || []} />

      <WalletTransactions
        transactionsData={transactionsData?.transactions}
        transactionsLoading={transactionsLoading}
      />
    </main>
  );
};

export default DashboardPage;

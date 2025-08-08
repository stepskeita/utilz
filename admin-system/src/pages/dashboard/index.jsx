import React from "react";
import {
  useGetGamSwitchBalance,
  useGetUsageStatsQuery,
  useRecentTopUpRequestsQuery,
} from "./dashboardQueries";

import CustomButton from "../../components/generic/CustomButton";
import { useNavigate } from "react-router-dom";
import RecentTopUps from "./components/RecentTopUps";

const DashboardPage = () => {
  const { data: gamswitchData, isPending: gamswitchLoading } =
    useGetGamSwitchBalance();

  const navigate = useNavigate();

  const { data: recentTopUpRequests, isPending: recentTopUpRequestsLoading } =
    useRecentTopUpRequestsQuery();

  const { data: usageStats, isPending: usageStatsLoading } =
    useGetUsageStatsQuery();

  return (
    <main className="flex-1 p-6 space-y-6">
      <div className="grid grid-cols-1  gap-6">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex w-full h-full flex-col">
            <div className="flex-1">
              <p className="text-gray-800 text-lg font-semibold">
                GamSwitch Balance
              </p>
              <p className="text-gray-500 text-3xl font-bold mt-2">
                {gamswitchLoading
                  ? "Loading..."
                  : gamswitchData
                  ? `${gamswitchData?.currency === "GMD" ? "D" : "$"}${
                      gamswitchData?.amount
                    }`
                  : "--"}
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex w-full h-full flex-col">
            <div className="flex-1">
              <p className="text-gray-800 text-lg font-semibold mb-4">
                System Statistics
              </p>
              {usageStatsLoading ? (
                <div className="text-gray-500">Loading...</div>
              ) : usageStats ? (
                <div className="space-y-4">
                  {/* Transaction Stats */}
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Transactions
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total:</span>
                        <span className="font-medium">
                          {usageStats.transactions?.total || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Successful:</span>
                        <span className="font-medium text-green-600">
                          {usageStats.transactions?.successful || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Airtime:</span>
                        <span className="font-medium">
                          {usageStats.transactions?.airtime || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cashpower:</span>
                        <span className="font-medium">
                          {usageStats.transactions?.cashpower || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Client Stats */}
                  <div className="border-t pt-3">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Clients
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total:</span>
                        <span className="font-medium">
                          {usageStats.clients?.total || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Active:</span>
                        <span className="font-medium text-green-600">
                          {usageStats.clients?.active || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amount Stats */}
                  <div className="border-t pt-3">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Total Volume
                    </p>
                    <div className="text-lg font-bold text-gray-800">
                      D{usageStats.amounts?.total || 0}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">--</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <RecentTopUps
        recentTopups={recentTopUpRequests?.topUpRequests || []}
        isLoading={recentTopUpRequestsLoading}
      />
    </main>
  );
};

export default DashboardPage;

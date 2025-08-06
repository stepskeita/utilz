import React from "react";
import {
  useGetGamSwitchBalance,
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

  return (
    <main className="flex-1 p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex w-full h-full flex-col">
            <div className="flex-1">
              <p className="text-gray-800 text-lg font-semibold">
                GamSwitch Balance
              </p>
              <p className="text-gray-500 text-3xl font-bold mt-2">
                {gamswitchLoading
                  ? "Loading..."
                  : gamswitchData?.balance
                  ? `${
                      gamswitchData.currency === "GMD" ? "D" : "$"
                    }${parseFloat(gamswitchData.balance).toFixed(2)}`
                  : "--"}
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhz_jQe5fjHIHaGHvahIDnlHQHAvrYfzZVzWM5KK3gW_pnZ6avaRRO5R7sXvefRhvd7fGQK-KqZvDBziepjJeotCBSn3tXEm1ngKWA83GkxQFOK_9a52InDZ6wQjyvFNrb4-kyojIKRcnj0lm3r1xWa56m2sCks2j-Cy0oww2mesaTE0zz12YK0muAXnhmFMnAfK90NOovu4LSRDfYI9r6VXvmj7bsEZZ4894EPcqtcEHJv1wUcMn1T5gV_75AQQof-VrIFrB8v14"
            className="w-[100px] object-scale-down"
            alt=""
          />
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

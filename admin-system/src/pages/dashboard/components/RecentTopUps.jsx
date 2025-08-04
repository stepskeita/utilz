import React from "react";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../components/generic/CustomButton";

const RecentTopUps = ({ recentTopups = [], isLoading = false }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "fail":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-3">
        <h2 className="text-gray-800 text-lg font-semibold p-6">
          Recent Topup Transactions
        </h2>

        <CustomButton onClick={() => navigate("/transactions")}>
          All Transactions
        </CustomButton>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3" scope="col">
                Date
              </th>
              <th className="px-6 py-3" scope="col">
                Phone Number
              </th>
              <th className="px-6 py-3" scope="col">
                Amount
              </th>
              <th className="px-6 py-3" scope="col">
                Network
              </th>
              <th className="px-6 py-3" scope="col">
                Status
              </th>
              <th className="px-6 py-3" scope="col">
                Client
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : recentTopups && recentTopups.length > 0 ? (
              recentTopups.map((tx) => (
                <tr
                  key={tx.id}
                  className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/top-ups/${tx.id}`)}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tx.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    GMD {parseFloat(tx.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap uppercase">
                    {tx.networkCode}
                  </td>
                  <td
                    className={twMerge(
                      "px-6 py-4 whitespace-nowrap font-semibold",
                      getStatusColor(tx.status)
                    )}
                  >
                    {tx.status.toUpperCase()}
                    {tx.errorMessage && (
                      <span className="block text-xs font-normal text-gray-500">
                        {tx.errorMessage}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tx.Client.name}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTopUps;

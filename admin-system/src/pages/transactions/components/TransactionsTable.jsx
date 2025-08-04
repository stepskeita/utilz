import React from "react";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";
import moment from "moment/moment";

const TransactionsTable = ({
  transactions = [],
  isLoading = false,
  transactionType = "all",
}) => {
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

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case "airtime":
        return "bg-blue-100 text-blue-800";
      case "cashpower":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case "airtime":
        return "Airtime";
      case "cashpower":
        return "Electricity";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3" scope="col">
                Date
              </th>
              <th className="px-6 py-3" scope="col">
                Type
              </th>
              <th className="px-6 py-3" scope="col">
                {transactionType === "cashpower"
                  ? "Meter Number"
                  : "Phone Number"}
              </th>
              <th className="px-6 py-3" scope="col">
                Amount
              </th>
              <th className="px-6 py-3" scope="col">
                Provider
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
                <td colSpan={7} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : transactions && transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/transactions/${tx.id}`)}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={twMerge(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        getTransactionTypeColor(tx.type)
                      )}
                    >
                      {getTransactionTypeLabel(tx.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tx.type === "cashpower" ? tx.meterNumber : tx.phoneNumber}
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
                    {tx.Client?.name || "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
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

export default TransactionsTable;

import React from "react";
import { twMerge } from "tailwind-merge";
import CustomButton from "../../../components/generic/CustomButton";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../../helperFunctions";

const WalletTransactions = ({
  transactionsData = [],
  transactionsLoading = false,
}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-3">
        <h2 className="text-gray-800 text-lg font-semibold p-6">
          Recent Transactions
        </h2>
        <CustomButton onClick={() => navigate("/transactions")}>
          Wallet transactions
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
                Amount
              </th>
              <th className="px-6 py-3" scope="col">
                Balance Before
              </th>
              <th className="px-6 py-3" scope="col">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {transactionsLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : transactionsData && transactionsData.length > 0 ? (
              transactionsData.map((tx) => (
                <tr key={tx.id} className="bg-white border-b">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                  <td
                    className={twMerge(
                      "px-6 py-4",
                      tx.type === "credit"
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    )}
                  >
                    {tx.type === "credit"
                      ? formatCurrency(tx.amount, "GMD +")
                      : formatCurrency(Math.abs(tx.amount), "GMD -")}
                  </td>
                  <td className="px-6 py-4">
                    {formatCurrency(tx?.balanceBefore, "GMD ")}
                  </td>
                  <td className="px-6 py-4">{tx?.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">
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

export default WalletTransactions;

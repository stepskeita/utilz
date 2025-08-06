import React from "react";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../components/generic/CustomButton";

const RecentTopUps = ({ recentTopups = [], isLoading = false }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "D0.00";
    return `D${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-3">
        <h2 className="text-gray-800 text-lg font-semibold p-6">
          Recent Wallet Top-Up Requests
        </h2>

        <CustomButton onClick={() => navigate("/top-up-request")}>
          All Top-Up Requests
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
                Client
              </th>
              <th className="px-6 py-3" scope="col">
                Requested Amount
              </th>
              <th className="px-6 py-3" scope="col">
                Approved Amount
              </th>
              <th className="px-6 py-3" scope="col">
                Payment Method
              </th>
              <th className="px-6 py-3" scope="col">
                Status
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
              recentTopups.map((request) => (
                <tr
                  key={request.id}
                  className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/top-up-request/${request.id}`)}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {new Date(request.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {request.client?.name ||
                          request.Client?.name ||
                          "Unknown Client"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {request.client?.email || request.Client?.email || ""}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    {formatCurrency(request.requestedAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    {request.approvedAmount ? (
                      formatCurrency(request.approvedAmount)
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">
                    {request.paymentMethod || (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={twMerge(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        getStatusBadge(request.status)
                      )}
                    >
                      {request.status?.toUpperCase()}
                    </span>
                    {request.rejectionReason && (
                      <div className="text-xs text-red-500 mt-1 max-w-xs truncate">
                        {request.rejectionReason}
                      </div>
                    )}
                    {request.adminNotes && request.status === "approved" && (
                      <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                        {request.adminNotes}
                      </div>
                    )}
                    {request.processor && (
                      <div className="text-xs text-gray-400 mt-1">
                        Processed by: {request.processor.email}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center py-4">
                    <svg
                      className="h-12 w-12 text-gray-400 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      No Top-Up Requests
                    </h3>
                    <p className="text-sm text-gray-500">
                      No recent wallet top-up requests found.
                    </p>
                  </div>
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

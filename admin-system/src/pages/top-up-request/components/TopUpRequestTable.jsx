import React from "react";
import { FaEye, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { twMerge } from "tailwind-merge";
import moment from "moment";

const TopUpRequestTable = ({ topUpRequests = [], isLoading = false }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : topUpRequests && topUpRequests.length > 0 ? (
              topUpRequests.map((request) => (
                <tr key={request.id} className="bg-white border-b">
                  <td className="px-6 py-4">
                    {moment(request.createdAt).format("MMM D, YYYY h:mm A")}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {request.client?.name || "N/A"}
                    {request.client?.email && (
                      <span className="block text-xs text-gray-500">
                        {request.client.email}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">GMD {request.requestedAmount}</td>
                  <td
                    className={twMerge(
                      "px-6 py-4",
                      request.status === "pending"
                        ? "text-yellow-600 font-semibold"
                        : request.status === "approved"
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    )}
                  >
                    {request.status === "pending"
                      ? "Pending"
                      : request.status === "approved"
                      ? "Approved"
                      : "Rejected"}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      className="text-blue-600  mr-4"
                      onClick={() =>
                        navigate(`/top-up-request/details`, { state: request })
                      }
                      title="View Details"
                    >
                      <FaEye className="inline mr-1" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  No top-up requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopUpRequestTable;

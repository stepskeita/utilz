import React from "react";
import { FaEye, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { twMerge } from "tailwind-merge";
import { useDeleteTopUpRequestMutation } from "../topupRequestQueries";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";

const TopUpRequestTable = ({ topUpRequests = [], isLoading = false }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteTopUpRequestMutation();

  const handleCancelRequest = async (requestId) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: "Error!",
        text: "Do you want to continue",
        icon: "error",
        confirmButtonText: "Yes, cancel it!",
        showCancelButton: true,
        cancelButtonText: "No, keep it",
      });

      if (isConfirmed) {
        await deleteMutation.mutateAsync(requestId);
        queryClient.invalidateQueries(["topUpRequests"]);
        toast.success("Top-up request deleted successfully");
      }
    } catch (error) {}
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : topUpRequests && topUpRequests.length > 0 ? (
              topUpRequests.map((request) => (
                <tr key={request.id} className="bg-white border-b">
                  <td className="px-6 py-4">
                    {moment(request.createdAt).format("MMM D, YYYY h:mm A")}
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
                    >
                      <FaEye className="inline mr-1" />
                      View Details
                    </button>
                    <button
                      disabled={request.status !== "pending"}
                      title={
                        request.status !== "pending"
                          ? "You can only cancel pending requests"
                          : "Cancel Request"
                      }
                      onClick={() => handleCancelRequest(request.id)}
                      className="text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaTimes className="inline mr-1" />
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
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

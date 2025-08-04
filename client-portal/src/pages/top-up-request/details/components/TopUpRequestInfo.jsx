import React from "react";
import { twMerge } from "tailwind-merge";

const TopUpRequestInfo = ({ request }) => {
  const paymentMethods = {
    bank_transfer: "Bank Transfer",
    mobile_money: "Mobile Money",
    card_payment: "Card Payment",
    cash: "Cash",
  };

  if (!request) return null;
  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Top-Up Request Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="mb-2">
            <span className="font-medium">Status:</span>{" "}
            <span
              className={twMerge(
                "capitalize",
                request.status === "pending"
                  ? "text-yellow-600"
                  : request.status === "approved"
                  ? "text-green-600"
                  : "text-red-600"
              )}
            >
              {request.status}
            </span>
          </div>
          <div className="mb-2">
            <span className="font-medium">Requested Amount:</span>{" "}
            {request.requestedAmount}
          </div>
          <div className="mb-2">
            <span className="font-medium">Payment Method:</span>{" "}
            {paymentMethods[request.paymentMethod] || "N/A"}
          </div>
          <div className="mb-2">
            <span className="font-medium">Payment Reference:</span>{" "}
            {request.paymentReference || "N/A"}
          </div>
          <div className="mb-2">
            <span className="font-medium">Client Notes:</span>{" "}
            {request.clientNotes || "N/A"}
          </div>
        </div>
        <div>
          <div className="mb-2">
            <span className="font-medium">Created At:</span>{" "}
            {new Date(request.createdAt).toLocaleString()}
          </div>
          <div className="mb-2">
            <span className="font-medium">Approved Amount:</span>{" "}
            {request.approvedAmount ?? "N/A"}
          </div>
          <div className="mb-2">
            <span className="font-medium">Admin Notes:</span>{" "}
            {request.adminNotes || "N/A"}
          </div>
          <div className="mb-2">
            <span className="font-medium">Rejection Reason:</span>{" "}
            {request.rejectionReason || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUpRequestInfo;

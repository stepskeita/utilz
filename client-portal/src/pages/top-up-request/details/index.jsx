import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTopUpRequestDetailsQuery } from "../topupRequestQueries";
import TopUpRequestInfo from "./components/TopUpRequestInfo";
import TopUpReceiptImage from "./components/TopUpReceiptImage";

const TopUpRequestDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const requestId = state?.id;
  const {
    data: request,
    isLoading,
    isError,
    error,
  } = useTopUpRequestDetailsQuery(requestId);

  console.log(request);

  useEffect(() => {
    if (!requestId) {
      navigate("/top-up-request", { replace: true });
    }
  }, [requestId, navigate]);

  if (!requestId) return null;

  return (
    <div className="max-w-2xl mx-auto py-8">
      {isLoading && (
        <div className="text-center text-gray-500">
          Loading top-up request details...
        </div>
      )}
      {isError && (
        <div className="text-center text-red-500">
          {error?.message || "Failed to load details."}
        </div>
      )}
      {request && (
        <>
          <TopUpRequestInfo request={request} />
          <TopUpReceiptImage
            receiptBase64={request.receiptBase64}
            receiptFileName={request.receiptFileName}
          />
        </>
      )}
    </div>
  );
};

export default TopUpRequestDetails;

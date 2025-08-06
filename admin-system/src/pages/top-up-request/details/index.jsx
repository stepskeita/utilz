import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useApproveTopUpRequestMutation,
  useRejectTopUpRequestMutation,
  useTopUpRequestDetailsQuery,
} from "../topupRequestQueries";
import TopUpRequestInfo from "./components/TopUpRequestInfo";
import TopUpReceiptImage from "./components/TopUpReceiptImage";
import CustomCard from "../../../components/generic/CustomCard";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import ApproveRequestModal from "./components/ApproveRequestModal";
import RejectRequestModal from "./components/RejectRequestModal";

const TopUpRequestDetails = () => {
  const [openApproveModal, setOpenApproveModal] = React.useState(false);
  const [openRejectModal, setOpenRejectModal] = React.useState(false);
  const navigate = useNavigate();
  const { id: requestId } = useParams();
  const {
    data: request,
    isLoading,
    isError,
    error,
  } = useTopUpRequestDetailsQuery(requestId);

  useEffect(() => {
    if (!requestId) {
      navigate("/top-up-request", { replace: true });
    }
  }, [requestId, navigate]);

  if (!requestId) return null;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <ApproveRequestModal
        isOpen={openApproveModal}
        setIsOpen={setOpenApproveModal}
        requestId={requestId}
      />
      <RejectRequestModal
        isOpen={openRejectModal}
        setIsOpen={setOpenRejectModal}
        requestId={requestId}
      />
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
          <CustomCard
            className={
              "w-full flex items-center justify-between gap-3 mb-4 p-3"
            }
          >
            <h2 className="text-lg font-semibold mb-4">
              Top-Up Request Details
            </h2>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setOpenApproveModal(true)}
                disabled={request.status !== "pending"}
                className="p-2 px-3 bg-green-500 text-white rounded-sm disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => setOpenRejectModal(true)}
                className="p-2 px-3 bg-red-500 text-white rounded-sm disabled:opacity-50"
                disabled={request.status !== "pending"}
              >
                Reject
              </button>
            </div>
          </CustomCard>
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

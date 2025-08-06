import React from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { useDeleteApiKeyMutation } from "../../../api/queries";
import CustomButton from "../../../components/generic/CustomButton";
import toast from "react-hot-toast";

const DeleteApiKeyModal = ({ isOpen, onClose, onSuccess, apiKey }) => {
  const deleteApiKeyMutation = useDeleteApiKeyMutation();

  const handleDelete = async () => {
    try {
      await deleteApiKeyMutation.mutateAsync(apiKey.id);
      toast.success("API Key deleted successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete API key");
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      center
      classNames={{
        modal: "customModal",
      }}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">
              Delete API Key
            </h3>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-4">
            Are you sure you want to delete the API key "{apiKey?.name}"? This
            action cannot be undone.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Warning</h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>This will permanently delete the API key</li>
                    <li>Any applications using this key will stop working</li>
                    <li>This action cannot be reversed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {apiKey && (
            <div className="mt-4 bg-gray-50 rounded-md p-3">
              <div className="text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium text-gray-900">Name:</span>
                    <span className="ml-2 text-gray-600">{apiKey.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Client:</span>
                    <span className="ml-2 text-gray-600">
                      {apiKey.Client?.name || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Status:</span>
                    <span
                      className={`ml-2 ${
                        apiKey.isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {apiKey.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Services:</span>
                    <span className="ml-2 text-gray-600">
                      {apiKey.isBoth
                        ? "Both Services"
                        : apiKey.isAirtime && apiKey.isCashpower
                        ? "Both Services"
                        : apiKey.isAirtime
                        ? "Airtime Only"
                        : apiKey.isCashpower
                        ? "Electricity Only"
                        : "No Services"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <CustomButton
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600"
          >
            Cancel
          </CustomButton>
          <CustomButton
            type="button"
            onClick={handleDelete}
            disabled={deleteApiKeyMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteApiKeyMutation.isPending ? "Deleting..." : "Delete API Key"}
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteApiKeyModal;

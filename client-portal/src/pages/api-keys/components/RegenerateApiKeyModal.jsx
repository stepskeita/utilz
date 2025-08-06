import React from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { useRegenerateApiKeyMutation } from "../../../api/queries";
import CustomButton from "../../../components/generic/CustomButton";
import toast from "react-hot-toast";

const RegenerateApiKeyModal = ({ isOpen, onClose, onSuccess, apiKey }) => {
  const regenerateApiKeyMutation = useRegenerateApiKeyMutation();

  const handleRegenerate = async () => {
    try {
      await regenerateApiKeyMutation.mutateAsync(apiKey.id);
      toast.success("API Key regenerated successfully!");
      onSuccess(); // Trigger cache refresh
      onClose(); // Close modal after successful regeneration
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to regenerate API key"
      );
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
              className="h-6 w-6 text-orange-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">
              Regenerate API Key
            </h3>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-4">
            Are you sure you want to regenerate the API key "{apiKey?.name}"?
            This will create a new key and invalidate the old one.
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
                    <li>This will permanently invalidate the old API key</li>
                    <li>
                      Any applications using the old key will stop working
                    </li>
                    <li>
                      You'll receive the new key in the updated table after
                      regeneration
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
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
            onClick={handleRegenerate}
            disabled={regenerateApiKeyMutation.isPending}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {regenerateApiKeyMutation.isPending
              ? "Regenerating..."
              : "Regenerate API Key"}
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
};

export default RegenerateApiKeyModal;

import React from "react";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import { useRegenerateApiKeyMutation } from "../../../api/queries";
import { twMerge } from "tailwind-merge";

const APIKeyItem = ({ apiKey }) => {
  const [showAPIKey, setShowAPIKey] = React.useState(false);
  const regenerateApiKeyMutation = useRegenerateApiKeyMutation();

  const handleCopy = () => {
    if (apiKey?.key) {
      copy(apiKey.key);
      toast.success("API Key copied to clipboard");
    }
  };

  const handleRegenerate = async () => {
    try {
      await regenerateApiKeyMutation.mutateAsync(apiKey.id);
      toast.success("API Key regenerated successfully");
    } catch (error) {
      toast.error("Failed to regenerate API key");
    }
  };

  const getServiceBadgeColor = (service) => {
    switch (service) {
      case "airtime":
        return "bg-blue-100 text-blue-800";
      case "cashpower":
        return "bg-purple-100 text-purple-800";
      case "both":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getServiceLabel = (isAirtime, isCashpower, isBoth) => {
    if (isBoth) return "Both Services";
    if (isAirtime && isCashpower) return "Both Services";
    if (isAirtime) return "Airtime Only";
    if (isCashpower) return "Electricity Only";
    return "No Services";
  };

  const getServiceType = (isAirtime, isCashpower, isBoth) => {
    if (isBoth) return "both";
    if (isAirtime && isCashpower) return "both";
    if (isAirtime) return "airtime";
    if (isCashpower) return "cashpower";
    return "none";
  };

  const serviceType = getServiceType(
    apiKey?.isAirtime,
    apiKey?.isCashpower,
    apiKey?.isBoth
  );
  const serviceLabel = getServiceLabel(
    apiKey?.isAirtime,
    apiKey?.isCashpower,
    apiKey?.isBoth
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-800">{apiKey?.name}</h3>
          <span
            className={twMerge(
              "px-2 py-1 text-xs font-medium rounded-full",
              getServiceBadgeColor(serviceType)
            )}
          >
            {serviceLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAPIKey(!showAPIKey)}
            className="p-2 text-gray-500 hover:text-gray-700"
            title="Toggle API Key visibility"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
              <path
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
          </button>
          <button
            onClick={handleCopy}
            className="p-2 text-gray-500 hover:text-gray-700"
            title="Copy API Key"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
          </button>
          <button
            onClick={handleRegenerate}
            disabled={regenerateApiKeyMutation.isPending}
            className="p-2 text-orange-500 hover:text-orange-700 disabled:opacity-50"
            title="Regenerate API Key"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            disabled
            className="form-input flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-gray-500 bg-gray-50"
            readOnly
            type={showAPIKey ? "text" : "password"}
            value={apiKey?.key || ""}
            placeholder="API Key will be displayed here"
          />
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <p className="mb-1">
          <strong>Security Note:</strong> Keep your API key secure and never
          share it publicly.
        </p>
        <p>
          <strong>Services:</strong> This key has access to{" "}
          {serviceLabel.toLowerCase()}.
        </p>
      </div>
    </div>
  );
};

export default APIKeyItem;

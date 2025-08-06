import React from "react";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

const APIKeyItem = ({ apiKey }) => {
  const [showAPIKey, setShowAPIKey] = React.useState(false);

  const handleCopy = () => {
    if (apiKey?.key) {
      copy(apiKey.key);
      toast.success("API Key copied to clipboard");
    }
  };

  const getServiceChips = (isAirtime, isCashpower, isBoth) => {
    const chips = [];

    if (isBoth || (isAirtime && isCashpower)) {
      chips.push(
        <span
          key="airtime"
          className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
        >
          Airtime
        </span>,
        <span
          key="electricity"
          className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800"
        >
          Electricity
        </span>
      );
    } else if (isAirtime) {
      chips.push(
        <span
          key="airtime"
          className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
        >
          Airtime
        </span>
      );
    } else if (isCashpower) {
      chips.push(
        <span
          key="electricity"
          className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800"
        >
          Electricity
        </span>
      );
    }

    return chips;
  };

  const getStatusBadge = (isActive) => {
    return (
      <span
        className={twMerge(
          "px-2 py-1 text-xs font-medium rounded-full",
          isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        )}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-800">{apiKey?.name}</h3>
          {getStatusBadge(apiKey?.isActive)}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAPIKey(!showAPIKey)}
            className="p-1.5 text-gray-500 hover:text-gray-700 rounded"
            title="Toggle API Key visibility"
          >
            {showAPIKey ? (
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-500 hover:text-gray-700 rounded"
            title="Copy API Key"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              disabled
              className="form-input flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-gray-500 bg-gray-50 text-sm"
              readOnly
              type={showAPIKey ? "text" : "password"}
              value={apiKey?.key || ""}
              placeholder="API Key will be displayed here"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Services:</span>
          <div className="flex gap-1">
            {getServiceChips(
              apiKey?.isAirtime,
              apiKey?.isCashpower,
              apiKey?.isBoth
            )}
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Created:{" "}
          {apiKey?.createdAt
            ? new Date(apiKey.createdAt).toLocaleDateString()
            : "N/A"}
        </div>
      </div>

      {!apiKey?.isActive && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          <strong>Note:</strong> This API key is inactive. Contact your
          administrator to activate it.
        </div>
      )}
    </div>
  );
};

export default APIKeyItem;

import React from "react";
import APIKeyItem from "./APIKeyItem";
import CustomButton from "../../../components/generic/CustomButton";
import { useNavigate } from "react-router-dom";

const APIKeys = ({ apiKeys = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-800 text-lg font-semibold">API Keys</h2>
        <CustomButton onClick={() => navigate("/api-keys")}>
          Manage API Keys
        </CustomButton>
      </div>
      {apiKeys?.length > 0 ? (
        <>
          {apiKeys.slice(0, 2).map((key) => (
            <APIKeyItem key={key.id} apiKey={key} />
          ))}
          {apiKeys.length > 2 && (
            <div className="text-center mt-4">
              <p className="text-gray-500 text-sm">
                {apiKeys.length - 2} more API key
                {apiKeys.length - 2 > 1 ? "s" : ""}...
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <div className="flex flex-col items-center">
            <svg
              className="h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No API Keys Yet
            </h3>
            <p className="text-gray-500 mb-4 text-center max-w-sm">
              API keys are created by administrators. Contact your admin to
              request new API keys for your account.
            </p>
            <CustomButton onClick={() => navigate("/api-keys")}>
              View API Keys
            </CustomButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIKeys;

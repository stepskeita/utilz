import React from "react";
import APIKeyItem from "./APIKeyItem";

const APIKeys = ({ apiKeys = [] }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h2 className="text-gray-800 text-lg font-semibold mb-4">API Keys</h2>
      {apiKeys?.map((key) => (
        <APIKeyItem key={key.id} apiKey={key} />
      ))}
    </div>
  );
};

export default APIKeys;

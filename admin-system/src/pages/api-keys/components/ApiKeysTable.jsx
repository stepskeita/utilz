import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import moment from "moment/moment";
import {
  FaEdit,
  FaTrash,
  FaKey,
  FaCopy,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import EditApiKeyModal from "./EditApiKeyModal";
import DeleteApiKeyModal from "./DeleteApiKeyModal";
import RegenerateApiKeyModal from "./RegenerateApiKeyModal";
import toast from "react-hot-toast";
import copy from "copy-to-clipboard";

const ApiKeysTable = ({ apiKeys = [], isLoading = false, onRefetch }) => {
  const [editingApiKey, setEditingApiKey] = useState(null);
  const [deletingApiKey, setDeletingApiKey] = useState(null);
  const [regeneratingApiKey, setRegeneratingApiKey] = useState(null);
  const [visibleKeys, setVisibleKeys] = useState({});

  const copyToClipboard = (text, label) => {
    copy(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }));
  };

  const maskKey = (key) => {
    if (!key) return "";
    return key.substring(0, 8) + "..." + key.substring(key.length - 8);
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
        Active
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
        Inactive
      </span>
    );
  };

  const getServiceChips = (apiKey) => {
    const chips = [];

    if (apiKey.isBoth || apiKey.isAirtime) {
      chips.push(
        <span
          key="airtime"
          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
        >
          Airtime
        </span>
      );
    }

    if (apiKey.isBoth || apiKey.isCashpower) {
      chips.push(
        <span
          key="cashpower"
          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800"
        >
          Electricity
        </span>
      );
    }

    if (!apiKey.isAirtime && !apiKey.isCashpower && !apiKey.isBoth) {
      chips.push(
        <span
          key="none"
          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
        >
          No Services
        </span>
      );
    }

    return <div className="flex flex-wrap gap-1">{chips}</div>;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3" scope="col">
                Name
              </th>
              <th className="px-6 py-3" scope="col">
                API Key
              </th>
              <th className="px-6 py-3" scope="col">
                Client
              </th>
              <th className="px-6 py-3" scope="col">
                Services
              </th>
              <th className="px-6 py-3" scope="col">
                Status
              </th>
              <th className="px-6 py-3" scope="col">
                Created
              </th>
              <th className="px-6 py-3" scope="col">
                Expires
              </th>
              <th className="px-6 py-3" scope="col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : apiKeys && apiKeys.length > 0 ? (
              apiKeys.map((apiKey) => {
                return (
                  <tr
                    key={apiKey.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FaKey className="text-gray-400" />
                        {apiKey.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 max-w-xs">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono text-gray-800 flex-1 min-w-0">
                          {visibleKeys[apiKey.id]
                            ? apiKey.key
                            : maskKey(apiKey.key)}
                        </code>

                        <button
                          onClick={() => copyToClipboard(apiKey.key, "API Key")}
                          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                          title="Copy API Key"
                        >
                          <FaCopy size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {apiKey.Client?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getServiceChips(apiKey)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(apiKey.isActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {moment(apiKey.createdAt).format("MMM DD, YYYY")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {apiKey.expiresAt
                        ? moment(apiKey.expiresAt).format("MMM DD, YYYY")
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingApiKey(apiKey)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit API Key"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => setRegeneratingApiKey(apiKey)}
                          className="text-orange-600 hover:text-orange-800"
                          title="Regenerate API Key"
                        >
                          <FaKey />
                        </button>
                        {/* <button
                          onClick={() => setDeletingApiKey(apiKey)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete API Key"
                        >
                          <FaTrash />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center">
                  No API keys found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {editingApiKey && (
        <EditApiKeyModal
          isOpen={!!editingApiKey}
          apiKey={editingApiKey}
          onClose={() => setEditingApiKey(null)}
          onSuccess={() => {
            setEditingApiKey(null);
            onRefetch && onRefetch();
          }}
        />
      )}

      {deletingApiKey && (
        <DeleteApiKeyModal
          isOpen={!!deletingApiKey}
          apiKey={deletingApiKey}
          onClose={() => setDeletingApiKey(null)}
          onSuccess={() => {
            setDeletingApiKey(null);
            onRefetch && onRefetch();
          }}
        />
      )}

      {regeneratingApiKey && (
        <RegenerateApiKeyModal
          isOpen={!!regeneratingApiKey}
          apiKey={regeneratingApiKey}
          onClose={() => setRegeneratingApiKey(null)}
          onSuccess={() => {
            setRegeneratingApiKey(null);
            onRefetch && onRefetch();
          }}
        />
      )}
    </div>
  );
};

export default ApiKeysTable;

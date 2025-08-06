import React, { useState } from "react";
import {
  FiCopy,
  FiEye,
  FiEyeOff,
  FiEdit,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";
import {
  useDeleteApiKeyMutation,
  useRegenerateApiKeyMutation,
} from "../../../api/queries";
import CustomButton from "../../../components/generic/CustomButton";
import toast from "react-hot-toast";
import copy from "copy-to-clipboard";
import moment from "moment";
import EditApiKeyModal from "./EditApiKeyModal";
import RegenerateApiKeyModal from "./RegenerateApiKeyModal";
import DeleteApiKeyModal from "./DeleteApiKeyModal";

const ApiKeysTable = ({ apiKeys, onRefetch }) => {
  const [showKeys, setShowKeys] = useState({});
  const [editingKey, setEditingKey] = useState(null);
  const [regeneratingKey, setRegeneratingKey] = useState(null);
  const [deletingKey, setDeletingKey] = useState(null);

  const deleteApiKeyMutation = useDeleteApiKeyMutation();
  const regenerateApiKeyMutation = useRegenerateApiKeyMutation();

  const toggleKeyVisibility = (keyId) => {
    setShowKeys((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }));
  };

  const copyToClipboard = (text, label) => {
    copy(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleDelete = (apiKey) => {
    setDeletingKey(apiKey);
  };

  const handleRegenerate = (apiKey) => {
    setRegeneratingKey(apiKey);
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

  const getStatusBadge = (apiKey) => {
    const isExpired =
      apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date();
    const isActive = apiKey.isActive && !isExpired;

    if (isActive) {
      return (
        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
          Active
        </span>
      );
    } else if (isExpired) {
      return (
        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
          Expired
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
          Inactive
        </span>
      );
    }
  };

  const maskKey = (key) => {
    if (!key) return "";
    return key.substring(0, 8) + "..." + key.substring(key.length - 8);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">API Key</th>
                <th className="px-6 py-3">Services</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Last Used</th>
                <th className="px-6 py-3">Expires</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((apiKey) => (
                <tr
                  key={apiKey.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {apiKey.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                      </code>

                      <button
                        onClick={() => copyToClipboard(apiKey.key, "API Key")}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <FiCopy size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getServiceChips(apiKey)}</td>
                  <td className="px-6 py-4">{getStatusBadge(apiKey)}</td>
                  <td className="px-6 py-4">
                    {apiKey.lastUsedAt
                      ? moment(apiKey.lastUsedAt).fromNow()
                      : "Never"}
                  </td>
                  <td className="px-6 py-4">
                    {apiKey.expiresAt
                      ? moment(apiKey.expiresAt).format("MMM DD, YYYY")
                      : "Never"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingKey(apiKey)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleRegenerate(apiKey)}
                        className="text-green-600 hover:text-green-800"
                        title="Regenerate"
                        disabled={regenerateApiKeyMutation.isPending}
                      >
                        <FiRefreshCw size={16} />
                      </button>
                      {/* <button
                        onClick={() => handleDelete(apiKey)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                        disabled={deleteApiKeyMutation.isPending}
                      >
                        <FiTrash2 size={16} />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit API Key Modal */}
      {editingKey && (
        <EditApiKeyModal
          isOpen={!!editingKey}
          apiKey={editingKey}
          onClose={() => setEditingKey(null)}
          onSuccess={() => {
            setEditingKey(null);
            onRefetch();
          }}
        />
      )}

      {/* Regenerate API Key Modal */}
      {regeneratingKey && (
        <RegenerateApiKeyModal
          isOpen={!!regeneratingKey}
          apiKey={regeneratingKey}
          onClose={() => setRegeneratingKey(null)}
          onSuccess={() => {
            setRegeneratingKey(null);
            onRefetch();
          }}
        />
      )}

      {/* Delete API Key Modal */}
      {deletingKey && (
        <DeleteApiKeyModal
          isOpen={!!deletingKey}
          apiKey={deletingKey}
          onClose={() => setDeletingKey(null)}
          onSuccess={() => {
            setDeletingKey(null);
            onRefetch();
          }}
        />
      )}
    </>
  );
};

export default ApiKeysTable;

import React from "react";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";
import moment from "moment/moment";
import { FaEdit, FaTrash, FaKey } from "react-icons/fa";

const ApiKeysTable = ({ apiKeys = [], isLoading = false }) => {
  const navigate = useNavigate();

  const getStatusColor = (isActive) => {
    return isActive ? "text-green-600" : "text-red-600";
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
                <td colSpan={7} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : apiKeys && apiKeys.length > 0 ? (
              apiKeys.map((apiKey) => {
                const serviceType = getServiceType(
                  apiKey.isAirtime,
                  apiKey.isCashpower,
                  apiKey.isBoth
                );
                const serviceLabel = getServiceLabel(
                  apiKey.isAirtime,
                  apiKey.isCashpower,
                  apiKey.isBoth
                );

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
                      {apiKey.Client?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={twMerge(
                          "px-2 py-1 text-xs font-medium rounded-full",
                          getServiceBadgeColor(serviceType)
                        )}
                      >
                        {serviceLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={twMerge(
                          "px-2 py-1 text-xs font-medium rounded-full",
                          getStatusColor(apiKey.isActive)
                        )}
                      >
                        {apiKey.isActive ? "Active" : "Inactive"}
                      </span>
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
                          onClick={() =>
                            navigate(`/api-keys/${apiKey.id}/edit`)
                          }
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit API Key"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/api-keys/${apiKey.id}/regenerate`)
                          }
                          className="text-orange-600 hover:text-orange-800"
                          title="Regenerate API Key"
                        >
                          <FaKey />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/api-keys/${apiKey.id}/delete`)
                          }
                          className="text-red-600 hover:text-red-800"
                          title="Delete API Key"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  No API keys found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiKeysTable;

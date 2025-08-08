import React from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import moment from "moment";
import { useDeleteClientMutation } from "../clientQueries";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

const ClientTable = ({ clients = [], isPending = false, onEdit }) => {
  const navigate = useNavigate();

  const deleteClientMutation = useDeleteClientMutation();

  const getStatusBadge = (isActive) => (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );

  const getPlanBadge = (plan) => {
    const planColors = {
      basic: "bg-gray-100 text-gray-800",
      premium: "bg-yellow-100 text-yellow-800",
      enterprise: "bg-purple-100 text-purple-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          planColors[plan] || planColors.basic
        }`}
      >
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </span>
    );
  };

  const getWalletBalance = (client) => {
    if (!client.wallet) return "N/A";
    const balance = parseFloat(client.wallet.balance || 0);
    return `D${balance.toFixed(2)}`;
  };

  const queryClient = useQueryClient();

  const handleDeleteClient = async (clientId) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      });
      if (isConfirmed) {
        await deleteClientMutation.mutateAsync(clientId, {
          onError: (err) => {
            toast.error(
              err?.response?.data?.message || "Failed to delete client"
            );
          },
          onSuccess: () => {
            queryClient.invalidateQueries(["clients"]);
            toast.success("Client deleted successfully");
          },
        });
      }
    } catch (error) {}
  };

  // Call the delete client mutation here

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3" scope="col">
                Client Name
              </th>
              <th className="px-6 py-3" scope="col">
                Email
              </th>
              <th className="px-6 py-3" scope="col">
                Contact Person
              </th>
              <th className="px-6 py-3" scope="col">
                Wallet Balance
              </th>
              <th className="px-6 py-3" scope="col">
                Plan
              </th>
              <th className="px-6 py-3" scope="col">
                Status
              </th>
              <th className="px-6 py-3" scope="col">
                Created
              </th>
              <th className="px-6 py-3" scope="col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isPending ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : clients && clients.length > 0 ? (
              clients.map((client) => (
                <tr
                  key={client.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {client.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {client.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {client.id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {client.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {client.contactPerson}
                    </div>
                    {client.contactPhone && (
                      <div className="text-sm text-gray-500">
                        {client.contactPhone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    {getWalletBalance(client)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPlanBadge(client.plan)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(client.isActive)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {moment(client.createdAt).format("MMM DD, YYYY")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(client)}
                        className="p-1 text-blue-600 hover:text-blue-900"
                        title="Edit Client"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/clients/${client.id}`)}
                        className="p-1 text-gray-600 hover:text-gray-900"
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        disabled={deleteClientMutation.isPending}
                        onClick={() => handleDeleteClient(client.id)}
                        className="p-1 text-red-600 hover:text-red-900 disabled:opacity-50"
                        title="Delete Client"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center">
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientTable;

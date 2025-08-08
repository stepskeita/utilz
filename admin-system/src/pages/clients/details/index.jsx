import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetClientByIdQuery,
  useGetClientUsageStatsQuery,
  useUpdateClientMutation,
} from "../clientQueries";
import CustomButton from "../../../components/generic/CustomButton";
import IsLoading from "../../../components/generic/IsLoading";
import IsError from "../../../components/generic/IsError";
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
} from "react-icons/fi";
import moment from "moment";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

const ClientDetailsPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const updateClientMutation = useUpdateClientMutation();
  const queryClient = useQueryClient();
  const {
    data: clientData,
    isPending,
    error,
  } = useGetClientByIdQuery(clientId);
  const { data: statsData } = useGetClientUsageStatsQuery(clientId, {
    startDate: moment().startOf("month").format("YYYY-MM-DD"),
    endDate: moment().endOf("month").format("YYYY-MM-DD"),
  });

  const client = clientData?.data;

  if (isPending) return <IsLoading />;
  if (error) return <IsError message="Failed to load client details" />;
  if (!client) return <IsError message="Client not found" />;

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

  const handleToggleActivation = async (client) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "Client will be deactivated.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, deactivate it!",
        cancelButtonText: "No, cancel!",
      });
      if (isConfirmed) {
        await updateClientMutation.mutateAsync(
          {
            clientId: client?.id,
            clientData: { isActive: !client.isActive },
          },
          {
            onError: (err) => {
              toast.error(
                err?.response?.data?.message || "Failed to deactivate client"
              );
            },
            onSuccess: () => {
              queryClient.invalidateQueries(["client"]);
              toast.success(
                client?.isActive
                  ? "Client deactivated successfully"
                  : "Client activated successfully"
              );
            },
          }
        );
      }
    } catch (error) {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <CustomButton
            onClick={() => navigate("/clients")}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Clients
          </CustomButton>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CustomButton
            onClick={() =>
              navigate("/clients", { state: { editClient: client } })
            }
            className="flex items-center gap-2"
          >
            <FiEdit className="w-4 h-4" />
            Edit Client
          </CustomButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <p className="mt-1 text-sm text-gray-900">{client.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <p className="mt-1 text-sm text-gray-900">{client.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Person
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {client.contactPerson}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Phone
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {client.contactPhone || "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">{getStatusBadge(client.isActive)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subscription Plan
                </label>
                <div className="mt-1">{getPlanBadge(client.plan)}</div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Additional Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {client.address || "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {client.website ? (
                    <a
                      href={client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {client.website}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Webhook URL
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {client.webhookUrl || "Not configured"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {client.notes || "No notes"}
                </p>
              </div>
            </div>
          </div>

          {/* API Usage */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              API Usage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Monthly Quota
                </label>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {client.monthlyQuota?.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Used This Month
                </label>
                <p className="mt-1 text-2xl font-bold text-blue-600">
                  {statsData?.data?.usageThisMonth || 0}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Remaining
                </label>
                <p className="mt-1 text-2xl font-bold text-green-600">
                  {Math.max(
                    0,
                    (client.monthlyQuota || 0) -
                      (statsData?.data?.usageThisMonth || 0)
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Wallet Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Wallet Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Balance
                </label>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {client.wallet?.balance || 0}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Wallet Status
                </label>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.wallet?.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {client.wallet?.status || "N/A"}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Top-up
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {client.wallet?.lastTopupDate
                    ? moment(client.wallet.lastTopupDate).format("MMM DD, YYYY")
                    : "Never"}
                </p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Account Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created Date
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {moment(client.createdAt).format("MMM DD, YYYY")}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Login
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {client.lastLoginAt
                    ? moment(client.lastLoginAt).format("MMM DD, YYYY HH:mm")
                    : "Never"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Updated
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {moment(client.updatedAt).format("MMM DD, YYYY HH:mm")}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <CustomButton
                onClick={() =>
                  navigate("/clients", { state: { editClient: client } })
                }
                className="w-full flex items-center justify-center gap-2"
              >
                <FiEdit className="w-4 h-4" />
                Edit Client
              </CustomButton>

              <CustomButton
                onClick={() => handleToggleActivation(client)}
                className={twMerge(
                  "w-full flex items-center justify-center gap-2",
                  client.isActive
                    ? "bg-red-100 text-red-800 hover:bg-red-200"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                )}
                disabled={updateClientMutation.isPending}
              >
                {client.isActive ? (
                  <FiTrash2 className="w-4 h-4" />
                ) : (
                  <FiCheckCircle className="w-4 h-4" />
                )}
                {client.isActive ? "Deactivate Client" : "Activate Client"}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsPage;

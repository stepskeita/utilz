import React, { useState } from "react";
import { useGetApiKeysQuery } from "../../api/queries";
import ApiKeysTable from "./components/ApiKeysTable";
import ApiKeyFilters from "./components/ApiKeyFilters";
import CustomPagination from "../../components/generic/CustomPagination";
import CustomCard from "../../components/generic/CustomCard";
import CustomButton from "../../components/generic/CustomButton";
import CreateApiKeyModal from "./components/CreateApiKeyModal";

const ApiKeysPage = () => {
  const [filters, setFilters] = React.useState({
    limit: 10,
    page: 1,
  });
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { isPending, data, refetch } = useGetApiKeysQuery(filters);

  console.log("API Keys data:", data);
  return (
    <div className="flex flex-col gap-4">
      <CustomCard className={"p-6 bg-white border border-gray-200 shadow-sm"}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">API Keys Management</h1>
            <p className="text-gray-600">
              Manage API keys for all clients and their service subscriptions.
            </p>
          </div>
          <CustomButton
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create API Key
          </CustomButton>
        </div>
      </CustomCard>
      <ApiKeyFilters filters={filters} setFilters={setFilters} />

      <ApiKeysTable
        isLoading={isPending}
        apiKeys={data?.apiKeys || []}
        onRefetch={refetch}
      />
      <CustomPagination
        className="mt-4"
        filters={filters}
        setFilters={setFilters}
        pagination={data?.pagination}
      />

      {/* Create API Key Modal */}
      <CreateApiKeyModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          refetch();
        }}
      />
    </div>
  );
};

export default ApiKeysPage;

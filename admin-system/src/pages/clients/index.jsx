import React from "react";
import { useGetClientsQuery } from "./clientQueries";
import CustomButton from "../../components/generic/CustomButton";
import ClientTable from "./components/ClientTable";
import ClientModal from "./components/ClientModal";
import ClientFilters from "./components/ClientFilters";
import CustomPagination from "../../components/generic/CustomPagination";
import CustomCard from "../../components/generic/CustomCard";
import { FiPlus } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";

const ClientsPage = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = React.useState({
    limit: 10,
    page: 1,
  });
  const [showModal, setShowModal] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState(null);

  const { data: clients, isLoading, error } = useGetClientsQuery(filters);

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleAddClient = () => {
    setSelectedClient(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClient(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <CustomCard className={"p-6 bg-white border border-gray-200 shadow-sm"}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Client Management</h1>
            <p className="text-gray-600">
              Manage your clients and their accounts
            </p>
          </div>
          <CustomButton
            onClick={handleAddClient}
            className="flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            Add Client
          </CustomButton>
        </div>
      </CustomCard>

      <ClientFilters filters={filters} setFilters={setFilters} />

      <ClientTable
        clients={clients?.data || []}
        isLoading={isLoading}
        error={error}
        onEdit={handleEditClient}
      />

      <CustomPagination
        className="mt-4"
        filters={filters}
        setFilters={setFilters}
        pagination={clients?.pagination}
      />

      {/* Client Modal */}
      {showModal && (
        <ClientModal
          client={selectedClient}
          onClose={handleCloseModal}
          onSuccess={() => {
            handleCloseModal();
            queryClient.invalidateQueries(["clients"]);
          }}
        />
      )}
    </div>
  );
};

export default ClientsPage;

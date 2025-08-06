import React from "react";
import { useGetApiKeysQuery } from "../../api/queries";
import ApiKeysTable from "./components/ApiKeysTable";
import ApiKeyFilters from "./components/ApiKeyFilters";
import CustomPagination from "../../components/generic/CustomPagination";
import CustomCard from "../../components/generic/CustomCard";

const ApiKeysPage = () => {
  const [filters, setFilters] = React.useState({
    limit: 10,
    page: 1,
  });

  const { isPending, data, refetch } = useGetApiKeysQuery(filters);

  return (
    <div className="flex flex-col gap-4">
      <CustomCard className={"p-6 bg-white border border-gray-200 shadow-sm"}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">API Keys Management</h1>
            <p className="text-gray-600">
              Manage your API keys for accessing iUtility services.
            </p>
          </div>
        </div>
      </CustomCard>

      <ApiKeyFilters filters={filters} setFilters={setFilters} />

      {isPending ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading API keys...</span>
          </div>
        </div>
      ) : data?.apiKeys && data.apiKeys.length > 0 ? (
        <>
          <ApiKeysTable apiKeys={data.apiKeys} onRefetch={refetch} />

          <CustomPagination
            className="mt-4"
            filters={filters}
            setFilters={setFilters}
            pagination={data?.pagination}
          />
        </>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
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
              No API Keys Found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md">
              You don't have any API keys yet. Contact your administrator to
              request API keys for accessing iUtility services.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 max-w-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    API Key Creation
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      API keys are created and activated by administrators to
                      ensure security and compliance with our policies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeysPage;

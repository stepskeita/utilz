import { useMutation, useQuery } from '@tanstack/react-query';
import API from './http-common';

// ==================== AUTHENTICATION QUERIES ====================

export const useLoginMutation = () =>
  useMutation({
    mutationFn: async (credentials) => {
      const res = await API.post('/admin/auth/login', credentials);
      return res.data;
    },
  });

export const useLogoutMutation = () =>
  useMutation({
    mutationFn: async () => {
      const res = await API.post('/admin/auth/logout');
      return res.data;
    },
  });

export const useChangePasswordMutation = () =>
  useMutation({
    mutationFn: async (passwordData) => {
      const res = await API.post('/admin/auth/change-password', passwordData);
      return res.data;
    },
  });

// ==================== CLIENT MANAGEMENT QUERIES ====================

export const useGetClientsQuery = (filters = {}) =>
  useQuery({
    queryKey: ['clients', filters],
    queryFn: async () => {
      const res = await API.get('/admin/clients', { params: filters });
      return res.data?.data;
    },
  });

export const useGetClientQuery = (clientId) =>
  useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      const res = await API.get(`/admin/clients/${clientId}`);
      return res.data?.data;
    },
    enabled: !!clientId,
  });

export const useCreateClientMutation = () =>
  useMutation({
    mutationFn: async (clientData) => {
      const res = await API.post('/admin/clients', clientData);
      return res.data;
    },
  });

export const useUpdateClientMutation = () =>
  useMutation({
    mutationFn: async ({ clientId, clientData }) => {
      const res = await API.put(`/admin/clients/${clientId}`, clientData);
      return res.data;
    },
  });

export const useDeleteClientMutation = () =>
  useMutation({
    mutationFn: async (clientId) => {
      const res = await API.delete(`/admin/clients/${clientId}`);
      return res.data;
    },
  });

// ==================== TRANSACTION QUERIES ====================

export const useGetTransactionsQuery = (filters = {}) =>
  useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      const res = await API.get('/admin/transactions', { params: filters });
      return res.data?.data;
    },
  });

export const useGetAirtimeTransactionsQuery = (filters = {}) =>
  useQuery({
    queryKey: ['airtime-transactions', filters],
    queryFn: async () => {
      const res = await API.get('/airtime/history', { params: filters });
      return res.data?.data;
    },
  });

export const useGetCashpowerTransactionsQuery = (filters = {}) =>
  useQuery({
    queryKey: ['cashpower-transactions', filters],
    queryFn: async () => {
      const res = await API.get('/cashpower/history', { params: filters });
      return res.data?.data;
    },
  });

// ==================== TOP-UP REQUEST QUERIES ====================

export const useGetTopUpRequestsQuery = (filters = {}) =>
  useQuery({
    queryKey: ['top-up-requests', filters],
    queryFn: async () => {
      const res = await API.get('/admin/top-up-requests', { params: filters });
      return res.data?.data;
    },
  });

export const useGetTopUpRequestQuery = (requestId) =>
  useQuery({
    queryKey: ['top-up-request', requestId],
    queryFn: async () => {
      const res = await API.get(`/admin/top-up-requests/${requestId}`);
      return res.data?.data;
    },
    enabled: !!requestId,
  });

export const useApproveTopUpRequestMutation = () =>
  useMutation({
    mutationFn: async ({ requestId, approvalData }) => {
      const res = await API.post(`/admin/top-up-requests/${requestId}/approve`, approvalData);
      return res.data;
    },
  });

export const useRejectTopUpRequestMutation = () =>
  useMutation({
    mutationFn: async ({ requestId, rejectionData }) => {
      const res = await API.post(`/admin/top-up-requests/${requestId}/reject`, rejectionData);
      return res.data;
    },
  });

export const useDownloadReceiptQuery = (requestId) =>
  useQuery({
    queryKey: ['receipt', requestId],
    queryFn: async () => {
      const res = await API.get(`/admin/top-up-requests/${requestId}/receipt`);
      return res.data?.data;
    },
    enabled: !!requestId,
  });

// ==================== API KEY MANAGEMENT QUERIES ====================

export const useGetApiKeysQuery = (filters = {}) =>
  useQuery({
    queryKey: ['api-keys', filters],
    queryFn: async () => {
      const res = await API.get('/admin/api-keys', { params: filters });
      return res.data?.data;
    },
  });

export const useGetApiKeyQuery = (apiKeyId) =>
  useQuery({
    queryKey: ['api-key', apiKeyId],
    queryFn: async () => {
      const res = await API.get(`/admin/api-keys/${apiKeyId}`);
      return res.data?.data;
    },
    enabled: !!apiKeyId,
  });

export const useCreateApiKeyMutation = () =>
  useMutation({
    mutationFn: async ({ clientId, apiKeyData }) => {
      const res = await API.post(`/admin/clients/${clientId}/api-keys`, apiKeyData);
      return res.data;
    },
  });

export const useUpdateApiKeyMutation = () =>
  useMutation({
    mutationFn: async ({ apiKeyId, apiKeyData }) => {
      const res = await API.put(`/admin/api-keys/${apiKeyId}`, apiKeyData);
      return res.data;
    },
  });

export const useDeleteApiKeyMutation = () =>
  useMutation({
    mutationFn: async (apiKeyId) => {
      const res = await API.delete(`/admin/api-keys/${apiKeyId}`);
      return res.data;
    },
  });

export const useRegenerateApiKeyMutation = () =>
  useMutation({
    mutationFn: async (apiKeyId) => {
      const res = await API.post(`/admin/api-keys/${apiKeyId}/regenerate`);
      return res.data;
    },
  });

// ==================== ANALYTICS QUERIES ====================

export const useGetSystemAnalyticsQuery = (filters = {}) =>
  useQuery({
    queryKey: ['system-analytics', filters],
    queryFn: async () => {
      const res = await API.get('/admin/analytics', { params: filters });
      return res.data?.data;
    },
  });

// ==================== WALLET MANAGEMENT QUERIES ====================

export const useUpdateClientWalletMutation = () =>
  useMutation({
    mutationFn: async ({ clientId, walletData }) => {
      const res = await API.put(`/admin/clients/${clientId}/wallet`, walletData);
      return res.data;
    },
  });

// ==================== BALANCE MONITORING QUERIES ====================

export const useCheckBalanceMutation = () =>
  useMutation({
    mutationFn: async () => {
      const res = await API.post('/admin/balance/check');
      return res.data;
    },
  });

export const useGetBalanceStatusQuery = () =>
  useQuery({
    queryKey: ['balance-status'],
    queryFn: async () => {
      const res = await API.get('/admin/balance/status');
      return res.data?.data;
    },
  });

export const useSendTestAlertMutation = () =>
  useMutation({
    mutationFn: async (alertData) => {
      const res = await API.post('/admin/balance/test-alert', alertData);
      return res.data;
    },
  });

export const useGetMonitoringStatusQuery = () =>
  useQuery({
    queryKey: ['monitoring-status'],
    queryFn: async () => {
      const res = await API.get('/admin/balance/monitoring');
      return res.data?.data;
    },
  }); 
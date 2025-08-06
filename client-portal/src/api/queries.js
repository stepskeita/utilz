import { useMutation, useQuery } from '@tanstack/react-query';
import API from './http-common';

// ==================== AUTHENTICATION QUERIES ====================

export const useLoginMutation = () =>
  useMutation({
    mutationFn: async (credentials) => {
      const res = await API.post('/client/auth/login', credentials);
      return res.data;
    },
  });

export const useLogoutMutation = () =>
  useMutation({
    mutationFn: async () => {
      const res = await API.post('/client/auth/logout');
      return res.data;
    },
  });

export const useChangePasswordMutation = () =>
  useMutation({
    mutationFn: async (passwordData) => {
      const res = await API.post('/client/auth/change-password', passwordData);
      return res.data;
    },
  });

export const useRequestPasswordResetMutation = () =>
  useMutation({
    mutationFn: async (email) => {
      const res = await API.post('/client/auth/request-password-reset', { email });
      return res.data;
    },
  });

export const useResetPasswordMutation = () =>
  useMutation({
    mutationFn: async (resetData) => {
      const res = await API.post('/client/auth/reset-password', resetData);
      return res.data;
    },
  });

// ==================== CLIENT PROFILE QUERIES ====================

export const useGetClientProfileQuery = () =>
  useQuery({
    queryKey: ['client-profile'],
    queryFn: async () => {
      const res = await API.get('/client/profile');
      return res.data?.data;
    },
  });

export const useUpdateClientProfileMutation = () =>
  useMutation({
    mutationFn: async (profileData) => {
      const res = await API.put('/client/profile', profileData);
      return res.data;
    },
  });

// ==================== WALLET QUERIES ====================

export const useGetWalletBalanceQuery = () =>
  useQuery({
    queryKey: ['wallet-balance'],
    queryFn: async () => {
      const res = await API.get('/client/wallet/balance');
      return res.data?.data;
    },
  });

export const useGetWalletTransactionsQuery = (filters = {}) =>
  useQuery({
    queryKey: ['wallet-transactions', filters],
    queryFn: async () => {
      const res = await API.get('/client/wallet/transactions', { params: filters });
      return res.data?.data;
    },
  });

// ==================== TRANSACTION QUERIES ====================

export const useGetTransactionHistoryQuery = (filters = {}) =>
  useQuery({
    queryKey: ['transaction-history', filters],
    queryFn: async () => {
      const res = await API.get('/client/transactions', { params: filters });
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

// ==================== API KEY MANAGEMENT QUERIES ====================

export const useGetApiKeysQuery = (filters = {}) =>
  useQuery({
    queryKey: ['api-keys', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters).toString();
      const res = await API.get(`/client/api-keys?${params}`);
      return res.data?.data;
    },
  });

// Client API key creation removed - only admins can create API keys

export const useUpdateApiKeyMutation = () =>
  useMutation({
    mutationFn: async ({ apiKeyId, apiKeyData }) => {
      const res = await API.put(`/client/api-keys/${apiKeyId}`, apiKeyData);
      return res.data;
    },
  });

export const useDeleteApiKeyMutation = () =>
  useMutation({
    mutationFn: async (apiKeyId) => {
      const res = await API.delete(`/client/api-keys/${apiKeyId}`);
      return res.data;
    },
  });

export const useRegenerateApiKeyMutation = () =>
  useMutation({
    mutationFn: async (apiKeyId) => {
      const res = await API.post(`/client/api-keys/${apiKeyId}/regenerate`);
      return res.data;
    },
  });

// ==================== USAGE STATISTICS QUERIES ====================

export const useGetUsageStatsQuery = () =>
  useQuery({
    queryKey: ['usage-stats'],
    queryFn: async () => {
      const res = await API.get('/client/usage-stats');
      return res.data?.data;
    },
  });

// ==================== TOP-UP REQUEST QUERIES ====================

export const useCreateTopUpRequestMutation = () =>
  useMutation({
    mutationFn: async (requestData) => {
      const res = await API.post('/client/wallet/top-up-request', requestData);
      return res.data;
    },
  });

export const useGetTopUpRequestsQuery = (filters = {}) =>
  useQuery({
    queryKey: ['top-up-requests', filters],
    queryFn: async () => {
      const res = await API.get('/client/wallet/top-up-requests', { params: filters });
      return res.data?.data;
    },
  });

export const useGetTopUpRequestQuery = (requestId) =>
  useQuery({
    queryKey: ['top-up-request', requestId],
    queryFn: async () => {
      const res = await API.get(`/client/wallet/top-up-request/${requestId}`);
      return res.data?.data;
    },
    enabled: !!requestId,
  });

export const useDeleteTopUpRequestMutation = () =>
  useMutation({
    mutationFn: async (requestId) => {
      const res = await API.delete(`/client/wallet/top-up-request/${requestId}`);
      return res.data;
    },
  }); 
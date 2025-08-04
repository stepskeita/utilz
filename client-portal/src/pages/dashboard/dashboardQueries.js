import { useQuery } from '@tanstack/react-query';
import API from '../../api/http-common';
import store from '../../store/store';

export const useWalletBalanceQuery = () =>
  useQuery({
    queryKey: ['wallet-balance'],
    queryFn: async () => {
      const res = await API.get('/client/wallet/balance');
      return res.data.data;
    },
  });

export const useApiKeyQuery = () =>
  useQuery({
    queryKey: ['api-key'],
    queryFn: async () => {
      const res = await API.get(`/apikeys/client/${store.getState().auth.client?.id}`);
      return res.data.data;
    },
  });

export const useRecentTransactionsQuery = (limit = 5) =>
  useQuery({
    queryKey: ['wallet-transactions', limit],
    queryFn: async () => {
      const res = await API.get(`/client/wallet/transactions`, {
        params: {
          limit,
        },
      });
      return res.data.data || [];
    },
  });

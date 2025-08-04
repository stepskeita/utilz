import { useMutation, useQuery } from '@tanstack/react-query';
import store from '../../store/store';
import API from '../../api/http-common';


export const useGetWalletTransactionsQuery = (filters) =>
  useQuery({
    queryKey: ['wallet-transactions', filters],
    queryFn: async () => {
      const res = await API.get(`/client/wallet/transactions`, {
        params: {
          ...filters,
        },
      });
      return res.data?.data;
    },
  });





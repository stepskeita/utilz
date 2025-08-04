import { useQuery } from '@tanstack/react-query';
import API from '../../api/http-common';
import store from '../../store/store';

export const useGetGamSwitchBalance = () =>
  useQuery({
    queryKey: ['gamswitch-balance'],
    queryFn: async () => {
      const res = await API.get('/gamswitch/balance');
      return res.data.data;
    },
  });



export const useRecentTransactionsQuery = (limit = 5) =>
  useQuery({
    queryKey: ['recent-transactions', limit],
    queryFn: async () => {
      const res = await API.get(`/topup/history`, {
        params: {
          limit,
        },
      });

      return res.data.data || [];
    },
  });

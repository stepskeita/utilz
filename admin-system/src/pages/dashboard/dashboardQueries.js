import { useQuery } from '@tanstack/react-query';
import API from '../../api/http-common';
import store from '../../store/store';

export const useGetGamSwitchBalance = () =>
  useQuery({
    queryKey: ['gamswitch-balance'],
    queryFn: async () => {
      const res = await API.get('/admin/balance/status');
      return res.data.data;
    },
  });



export const useRecentTopUpRequestsQuery = (limit = 5) =>
  useQuery({
    queryKey: ['recent-topup-requests', limit],
    queryFn: async () => {
      const res = await API.get(`/admin/top-up-requests`, {
        params: {
          limit,
          page: 1,
        },
      });

      return res.data?.data || {};
    },
  });

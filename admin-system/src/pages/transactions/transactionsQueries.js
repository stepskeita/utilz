import { useMutation, useQuery } from '@tanstack/react-query';
import store from '../../store/store';
import API from '../../api/http-common';


export const useGetTopUpTransactionsQuery = (filters) =>
  useQuery({
    queryKey: ['topup-transactions', filters],
    queryFn: async () => {
      const res = await API.get(`/topup/history`, {
        params: {
          ...filters,
        },
      });
      return res.data?.data;
    },
  });



export const useGetClientsQuery = () =>
  useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const res = await API.get(`/clients`);
      return res.data?.data;
    },
  });




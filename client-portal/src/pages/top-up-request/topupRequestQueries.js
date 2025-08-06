import { useMutation, useQuery } from '@tanstack/react-query';
import API from '../../api/http-common';

export const useTopUpRequestsQuery = (filters) => {
  return useQuery({
    queryKey: ['topUpRequests', filters],
    // Fetch top-up requests with provided filters
    queryFn: async () => {
      const response = await API.get('/client/wallet/top-up-requests', { params: filters });
      return response.data?.data;
    }
  });
};

export const useTopUpRequestDetailsQuery = (requestId) => {
  return useQuery({
    queryKey: ['topUpRequestDetails', requestId],
    // Fetch details of a specific top-up request
    queryFn: async () => {
      const response = await API.get(`/client/wallet/top-up-request/${requestId}`);
      return response.data?.data;
    },
    enabled: !!requestId
  });
};
export const useCreateTopUpRequestMutation = () => {
  return useMutation({
    mutationKey: ['createTopUpRequest'],
    // Create a new top-up request
    mutationFn: async (data) => {
      const response = await API.post('/client/wallet/top-up-request', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data?.data;
    }
  });
};
// Note: Clients cannot approve or reject their own requests
// These actions are only available to administrators

// Delete a top-up request (client)
export const useDeleteTopUpRequestMutation = () => {
  return useMutation({
    mutationKey: ['deleteTopUpRequest'],
    mutationFn: async (requestId) => {
      const response = await API.delete(`/client/wallet/top-up-request/${requestId}`);
      return response.data;
    }
  });
}

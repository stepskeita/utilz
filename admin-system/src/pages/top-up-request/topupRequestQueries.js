import { useMutation, useQuery } from '@tanstack/react-query';
import API from '../../api/http-common';

export const useTopUpRequestsQuery = (filters) => {
  return useQuery({
    queryKey: ['topUpRequests', filters],
    queryFn: async () => {
      const response = await API.get('/admin/top-up-requests', { params: filters });
      return response.data?.data;
    }
  });
};

export const useGetClientsQuery = () =>
  useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const res = await API.get(`/admin/clients`);
      return res.data?.data?.clients || [];
    },
  });

export const useTopUpRequestDetailsQuery = (requestId) => {
  return useQuery({
    queryKey: ['topUpRequestDetails', requestId],
    queryFn: async () => {
      const response = await API.get(`/admin/top-up-requests/${requestId}`);
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
export const useApproveTopUpRequestMutation = () => {
  return useMutation({
    mutationKey: ['approveTopUpRequest'],
    mutationFn: async (formData) => {
      const response = await API.post(`/admin/top-up-requests/${formData.id}/approve`, formData);
      return response.data?.data;
    }
  });
};

export const useRejectTopUpRequestMutation = () => {
  return useMutation({
    mutationKey: ['rejectTopUpRequest'],
    mutationFn: async (formData) => {
      const response = await API.post(`/admin/top-up-requests/${formData.id}/reject`, formData);
      return response.data?.data;
    }
  });
}

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

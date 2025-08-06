import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../api/http-common";
import toast from "react-hot-toast";

// Get all clients with filters
export const useGetClientsQuery = (filters) => useQuery({
  queryKey: ['clients', filters],
  queryFn: async () => {
    const res = await API.get('/admin/clients', {
      params: {
        ...filters,
      },
    });
    return res.data?.data || {};
  },

});

// Get client by ID
export const useGetClientByIdQuery = (clientId) => useQuery({
  queryKey: ['client', clientId],
  queryFn: async () => {
    const res = await API.get(`/admin/clients/${clientId}`);
    return res.data?.data;
  },
  enabled: !!clientId,

});

// Create client mutation
export const useCreateClientMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientData) => {
      const res = await API.post('/admin/clients', clientData);
      return res.data?.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['clients']);
    },

  });
};

// Update client mutation
export const useUpdateClientMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, clientData }) => {
      const res = await API.put(`/admin/clients/${clientId}`, clientData);
      return res.data?.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['clients']);
    },

  });
};

// Delete/Deactivate client mutation
export const useDeleteClientMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientId) => {
      const res = await API.delete(`/admin/clients/${clientId}`);
      return res.data?.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['clients']);
    },

  });
};

// Get client usage stats
export const useGetClientUsageStatsQuery = (clientId, dateRange) => useQuery({
  queryKey: ['client-stats', clientId, dateRange],
  queryFn: async () => {
    const res = await API.get(`/admin/clients/${clientId}/stats`, {
      params: dateRange
    });
    return res.data?.data;
  },
  enabled: !!clientId,

}); 
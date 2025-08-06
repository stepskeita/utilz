import { useMutation } from "@tanstack/react-query";
import API from "../../api/http-common";
import toast from "react-hot-toast";

export const useChangePasswordMutation = () => useMutation({
  mutationFn: async (data) => await API.post('/admin/auth/change-password', data),
  mutationKey: ['changePassword'],

  onError: (error) => {
    toast.error(error?.response?.data?.message || 'Change password failed. Please try again.');
    // Handle change password error, e.g., show error message
    console.error('Change password failed:', error);
  }
});

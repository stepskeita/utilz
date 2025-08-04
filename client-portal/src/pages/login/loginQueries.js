import { useMutation } from "@tanstack/react-query";
import API from "../../api/http-common";
import toast from "react-hot-toast";

export const useLoginMutation = () => useMutation({
  mutationFn: async (loginData) => await API.post('/client/auth/login', loginData),
  mutationKey: ['login'],

  onError: (error) => {
    toast.error(error?.response?.data?.message || 'Login failed. Please try again.');
    // Handle login error, e.g., show error message
    console.error('Login failed:', error);
  }
});

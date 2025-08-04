import { useMutation } from "@tanstack/react-query";
import API from "../../api/http-common";



export const useRequestPasswordReset = () => useMutation({
  mutationKey: ["requestPasswordReset"],
  mutationFn: async (formData) => API.post("/client/auth/request-password-reset", formData)
})



export const useResetPassword = () => useMutation({
  mutationKey: ["resetPassword"],
  mutationFn: async (formData) => API.post("/client/auth/reset-password", formData)
})
import React from "react";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import DashboardPage from "../pages/dashboard/index";
import TransactionsPage from "../pages/transactions/index";
import ChangePasswordPage from "../pages/change-password/index";
import ForgotPasswordPage from "../pages/forgot-password/index";
import ResetPasswordPage from "../pages/forgot-password/reset-password/index";

import LoginPage from "../pages/login/index";
import TopUpRequest from "../pages/top-up-request";
import TopUpRequestDetails from "../pages/top-up-request/details";

const AppRoutes = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Route>
    <Route element={<ProtectedLayout />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      <Route path="/top-up-request" element={<TopUpRequest />} />
      <Route path="/top-up-request/details" element={<TopUpRequestDetails />} />
      {/* Add more protected routes as needed */}
    </Route>
    <Route path="*" element={<h1>404 - Not Found</h1>} />
  </Routes>
);

export default AppRoutes;

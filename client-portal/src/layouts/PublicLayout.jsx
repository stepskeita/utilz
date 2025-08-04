import React from "react";
import { Outlet } from "react-router-dom";

const PublicLayout = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
    <Outlet />
  </div>
);

export default PublicLayout;

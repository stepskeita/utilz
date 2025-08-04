import React from "react";
import { systemName } from "../../system";

const Header = () => (
  <header className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-6">
    <h2 className="text-xl font-semibold text-gray-800 uppercase">
      {systemName}
    </h2>
    <div className="flex items-center gap-4"></div>
  </header>
);

export default Header;

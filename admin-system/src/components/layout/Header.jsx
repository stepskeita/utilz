import React, { use } from "react";
import { systemName } from "../../system";
import { FaSignOutAlt } from "react-icons/fa";
import { logoutAdmin } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-6">
      <h2 className="text-xl font-semibold text-gray-800 uppercase">
        {systemName}
      </h2>
      <div className="flex items-center gap-4">
        <button
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          onClick={() => dispatch(logoutAdmin())}
        >
          <FaSignOutAlt className="text-gray-600 hover:text-gray-800 transition-colors" />{" "}
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Header;

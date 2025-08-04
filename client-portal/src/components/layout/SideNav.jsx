import React from "react";
import { Link, useLocation } from "react-router-dom";
import { systemName } from "../../system";

const menus = [
  {
    name: "Dashboard",
    icon: (
      <svg
        fill="none"
        height="24px"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 12l2-2m0 0l7-7 7 7m-2 2v10a1 1 0 001 1h3m-10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    link: "/dashboard",
  },
  {
    name: "Transactions",
    icon: (
      <svg
        fill="none"
        height="24px"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    link: "/transactions",
  },
  {
    name: "API Keys",
    icon: (
      <svg
        fill="none"
        height="24px"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    link: "/api-keys",
  },
  {
    name: "Top Up Request",
    icon: (
      <svg
        fill="none"
        height="24px"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-1.5 15.5h-3v-3a1 1 0 0 1-2 0v3h-3a1 1 0 0 1 0 2h3v3a1 1 0 0 1 2 0v-3h3a1 1 0 0 1 0-2zm6.5-7h-3v-3a1 1 0 0 1-2 0v3h-3a1 1 0 0 1 0 2h3v3a1 1 0 0 1 2 0v-3h3a1 1 0 0 1 0-2z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    link: "/top-up-request",
  },
  {
    name: "Change Password",
    icon: (
      <svg
        fill="none"
        height="24px"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573
        c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    link: "/change-password",
  },
];
const SideNav = () => {
  const { pathname } = useLocation();
  return (
    <div className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="size-8 text-blue-500">
            <svg
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_6_319)">
                <path
                  d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_6_319">
                  <rect fill="white" height="48" width="48" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <span className="text-lg font-semibold text-gray-800">iUtility</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menus.map((menu) => (
          <Link
            key={menu.name}
            to={menu.link}
            className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors ${
              pathname === menu.link ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            <span className="text-gray-600">{menu.icon}</span>
            <span className="text-gray-800">{menu.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default SideNav;

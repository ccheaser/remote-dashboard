import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UserIcon,
  CogIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/outline';

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col w-64 h-screen px-4 py-8 bg-white border-r dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white">
        Dashboard
      </h2>
      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-200 transform rounded-lg dark:text-gray-200 ${
                isActive ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`
            }
          >
            <HomeIcon className="w-6 h-6" />
            <span className="mx-4 font-medium">Home</span>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-200 transform rounded-lg dark:text-gray-200 ${
                isActive ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`
            }
          >
            <UserIcon className="w-6 h-6" />
            <span className="mx-4 font-medium">Profile</span>
          </NavLink>

          {/* Settings Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center w-full px-4 py-2 mt-5 text-gray-600 transition-colors duration-200 transform rounded-lg dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <CogIcon className="w-6 h-6" />
              <span className="mx-4 font-medium">Settings</span>
              {isDropdownOpen ? (
                <ChevronUpIcon className="w-5 h-5 ml-auto" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 ml-auto" />
              )}
            </button>
            {isDropdownOpen && (
              <div className="mt-2 bg-white rounded-lg shadow-lg dark:bg-gray-700">
                <NavLink
                  to="/settings/profile"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm text-gray-600 transition-colors duration-200 transform dark:text-gray-200 ${
                      isActive ? 'bg-gray-200 dark:bg-gray-600' : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`
                  }
                >
                  Profile Settings
                </NavLink>
                <NavLink
                  to="/settings/account"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm text-gray-600 transition-colors duration-200 transform dark:text-gray-200 ${
                      isActive ? 'bg-gray-200 dark:bg-gray-600' : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`
                  }
                >
                  Account Settings
                </NavLink>
                <NavLink
                  to="/settings/setup"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm text-gray-600 transition-colors duration-200 transform dark:text-gray-200 ${
                      isActive ? 'bg-gray-200 dark:bg-gray-600' : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`
                  }
                >
                  Kurulum
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;

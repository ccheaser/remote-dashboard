// src/components/Navbar.js
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { UserCircleIcon, ChevronDownIcon } from "@heroicons/react/solid";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!currentUser) {
    return (
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-semibold">Uygulama Adı</div>
          {/* Giriş yapmamış kullanıcılar için login linki */}
          <a href="/login" className="text-blue-600 hover:underline">
            Giriş Yap
          </a>
        </div>
      </header>
    );
  }

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await logout();
    // Giriş yapmamış duruma düşüldükten sonra otomatik yönlendirme yapılabilir
    // Örneğin, login sayfasına yönlendirme:
    window.location.href = "/login";
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-semibold">Uygulama Adı</div>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center focus:outline-none"
          >
            {/* Profil Fotoğrafı veya İkonu */}
            <UserCircleIcon className="h-8 w-8 text-gray-600" />
            <ChevronDownIcon className="h-5 w-5 text-gray-600 ml-1" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2 z-20">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

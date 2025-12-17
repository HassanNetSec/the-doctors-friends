"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Menu, X } from "lucide-react";

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    router.push(token ? "/search_doctors" : "/components/Authentication");
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Heart className="w-6 h-6 text-blue-600" fill="currentColor" />
            <span className="text-lg font-semibold text-blue-600">
              doctor<span className="text-blue-500">Friend</span>
            </span>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated && (
              <button
                onClick={() => router.push("/search_doctors")}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Find Doctors
              </button>
            )}

            {isAuthenticated ? (
              <button
                onClick={onLogout}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleGetStarted}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
              >
                Get Started
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-blue-600"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-blue-100">
          <div className="px-4 py-4 space-y-4">
            {isAuthenticated && (
              <button
                onClick={() => {
                  router.push("/search_doctors");
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left text-blue-600 font-medium"
              >
                Find Doctors
              </button>
            )}

            {isAuthenticated ? (
              <button
                onClick={onLogout}
                className="block w-full text-left text-blue-600 font-medium"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleGetStarted}
                className="w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-md"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

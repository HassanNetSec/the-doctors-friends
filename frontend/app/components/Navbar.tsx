"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("email_doctor_friend_app");
      setIsAuthenticated(!!token);
    };

    // Check on mount
    checkAuth();

    // Listen for storage changes (works across tabs)
    window.addEventListener("storage", checkAuth);

    // Listen for custom auth event (works in same tab)
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => {
    const token = localStorage.getItem("email_doctor_friend_app");
    router.push(token ? "/search_doctors" : "/components/Authentication");
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("email_doctor_friend_app");
    localStorage.removeItem("password_doctor_friend_app");
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("authChange"));
    router.push("/");
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-2 cursor-pointer group transition-transform hover:scale-105"
          >
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Heart className="w-5 h-5 md:w-6 md:h-6 text-white fill-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              doctorFriend
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated && (
              <button
                onClick={() => router.push("/search_doctors")}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
              >
                Find Doctors
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </button>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 text-sm font-medium text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 hover:shadow-lg"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleGetStarted}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-64 border-t border-gray-100" : "max-h-0"
        }`}
      >
        <div className="px-4 py-4 space-y-3 bg-white/95 backdrop-blur-md">
          {isAuthenticated && (
            <button
              onClick={() => {
                router.push("/search_doctors");
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              Find Doctors
            </button>
          )}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-3 text-sm font-medium text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleGetStarted}
              className="block w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

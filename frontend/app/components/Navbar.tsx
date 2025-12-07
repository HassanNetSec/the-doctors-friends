"use client";
import React, { useState } from "react";
import {
  Heart,
  Menu,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleGetStarted = () => {
    router.push("/components/Authentication");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              The Doctor's Friend
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#specialties"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Specialties
            </a>
            <a
              href="#how-it-works"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              How It Works
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              About
            </a>
            <button
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg"
              onClick={handleGetStarted}
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <a
                href="#specialties"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Specialties
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                How It Works
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                About
              </a>
              <button
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg"
                onClick={handleGetStarted}
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar
"use client";
import React, { useState } from "react";
import {
  Heart,
  Brain,
  Bone,
  Search,
  Star,
  Users,
  Calendar,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const specialties = [
    {
      name: "Cardiologist",
      icon: Heart,
      description: "Heart and cardiovascular care",
      color: "from-red-500 to-pink-500",
    },
    {
      name: "Dermatologist",
      icon: Star,
      description: "Skin, hair, and nail treatment",
      color: "from-purple-500 to-indigo-500",
    },
    {
      name: "Orthopedic Surgeon",
      icon: Bone,
      description: "Bone and joint specialists",
      color: "from-orange-500 to-amber-500",
    },
    {
      name: "Neurologist",
      icon: Brain,
      description: "Brain and nervous system experts",
      color: "from-cyan-500 to-blue-500",
    },
  ];

  const benefits = [
    {
      icon: Users,
      title: "Wide Selection",
      description:
        "Connect with doctors from any hospital across Pakistan. Find specialists in every medical field from Neurology to ENT to Orthopedics.",
    },
    {
      icon: Star,
      title: "Verified Reviews",
      description:
        "Read authentic patient reviews and ratings to find the most reliable and trusted doctors in your area.",
    },
    {
      icon: Calendar,
      title: "Easy Booking",
      description:
        "Schedule appointments instantly with your chosen specialist. No more waiting on hold or playing phone tag.",
    },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
      // Navigate to search results page
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">

      {/* Hero Section - The Hook */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-6 animate-pulse">
              <Heart className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-medium">
                Trusted by thousands across Pakistan
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your Guide to
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Better Health
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Find a Good and Reliable Doctor Across Pakistan, Quickly
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 cursor-pointer">
                <span>Find Your Doctor Now</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-blue-300 cursor-pointer">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-gray-600 text-sm">Doctors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-600">50+</div>
                <div className="text-gray-600 text-sm">Specialties</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600">10K+</div>
                <div className="text-gray-600 text-sm">Happy Patients</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition - Key Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose The Doctor's Friend?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to find the perfect healthcare provider
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section id="specialties" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Specialties
            </h2>
            <p className="text-xl text-gray-600">
              Find experts in any medical field
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialties.map((specialty, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-blue-300"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${specialty.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <specialty.icon className="w-9 h-9 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {specialty.name}
                </h3>
                <p className="text-gray-600 text-sm">{specialty.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Search Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Find Your Doctor?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Search by specialty, location, or doctor name
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Try 'Pediatrician' or 'ENT'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold">The Doctor's Friend</span>
          </div>
          <p className="text-gray-400 mb-6">Your Guide to Better Health</p>
          <p className="text-gray-500 text-sm">
            © 2024 The Doctor's Friend. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

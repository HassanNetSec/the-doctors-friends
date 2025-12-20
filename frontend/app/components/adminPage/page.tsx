"use client";

import React, { useState, useEffect } from "react";
import patientDoctorInformation from "../patientDoctorInformation.json";
import patientSignInInfo from "../PatientSignInInfo.json";
import { Users, Calendar, DollarSign, UserCheck } from "lucide-react";

interface PatientRecord {
  appointmentId: string;
  bookingDate: string;
  doctor: {
    name: string;
    email: string;
    hospital: string;
    location: string;
  };
  patient: {
    name: string;
    email: string;
    phone: string;
  };
}

interface SignInRecord {
  email: string;
  password: string;
  timestamp: string;
}

const AdminPage = () => {
  const [patients, setPatients] = useState<PatientRecord[]>(patientDoctorInformation);
  const [signInData, setSignInData] = useState<SignInRecord[]>(patientSignInInfo);
  const [activeTab, setActiveTab] = useState<"appointments" | "users">("appointments");

  const handleReceive = (appointmentId: string) => {
    console.log(`Payment received for appointment ID: ${appointmentId}`);
    setPatients((prev) => prev.filter((p) => p.appointmentId !== appointmentId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-8">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Appointments</p>
            <p className="text-2xl font-bold text-gray-800">{patients.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Registered Users</p>
            <p className="text-2xl font-bold text-gray-800">{signInData.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Pending Payments</p>
            <p className="text-2xl font-bold text-gray-800">{patients.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <div className="bg-orange-100 p-3 rounded-lg">
            <Users className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Active Users</p>
            <p className="text-2xl font-bold text-gray-800">{signInData.length}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("appointments")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === "appointments"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          Appointments & Payments
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === "users"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          Registered Users
        </button>
      </div>

      {/* Appointments Table */}
      {activeTab === "appointments" && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Appointment Management</h2>
          {patients.length === 0 ? (
            <p className="text-center text-gray-500 mt-20 text-lg">
              🎉 No pending payments. All received!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-gray-700 font-medium rounded-tl-lg">Patient Name</th>
                    <th className="text-left px-6 py-3 text-gray-700 font-medium">Mobile / Email</th>
                    <th className="text-left px-6 py-3 text-gray-700 font-medium">Doctor Name</th>
                    <th className="text-left px-6 py-3 text-gray-700 font-medium">Doctor Email / Hospital / Location</th>
                    <th className="text-left px-6 py-3 text-gray-700 font-medium">Appointment ID</th>
                    <th className="text-left px-6 py-3 text-gray-700 font-medium">Booking Date</th>
                    <th className="text-center px-6 py-3 text-gray-700 font-medium rounded-tr-lg">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr
                      key={p.appointmentId}
                      className="bg-gray-50 hover:bg-blue-50 transition-all duration-200"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-800">{p.patient.name}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {p.patient.phone}
                        <br />
                        <span className="text-sm">{p.patient.email}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">{p.doctor.name}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {p.doctor.email}
                        <br />
                        {p.doctor.hospital}
                        <br />
                        {p.doctor.location}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">{p.appointmentId}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">{p.bookingDate}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleReceive(p.appointmentId)}
                          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
                        >
                          Receive Payment
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Users Table */}
      {activeTab === "users" && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Registered Users</h2>
          {signInData.length === 0 ? (
            <p className="text-center text-gray-500 mt-20 text-lg">
              No registered users yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead className="bg-green-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-gray-700 font-medium rounded-tl-lg">#</th>
                    <th className="text-left px-6 py-3 text-gray-700 font-medium">Email</th>
                    <th className="text-left px-6 py-3 text-gray-700 font-medium">Password Hash</th>
                    <th className="text-left px-6 py-3 text-gray-700 font-medium rounded-tr-lg">Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {signInData.map((user, idx) => (
                    <tr
                      key={idx}
                      className="bg-gray-50 hover:bg-green-50 transition-all duration-200"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-800">{idx + 1}</td>
                      <td className="px-6 py-4 text-gray-800 font-medium">{user.email}</td>
                      <td className="px-6 py-4 text-gray-600 font-mono text-sm">
                        {user.password.substring(0, 20)}...
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(user.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;

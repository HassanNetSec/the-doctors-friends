"use client";

import React, { useState } from "react";
import patientDoctorInformation from "../patientDoctorInformation.json";

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

const AdminPage = () => {
  const [patients, setPatients] = useState<PatientRecord[]>(patientDoctorInformation);

  const handleReceive = (appointmentId: string) => {
    console.log(`Payment received for appointment ID: ${appointmentId}`);
    setPatients((prev) => prev.filter((p) => p.appointmentId !== appointmentId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-8">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Admin Dashboard
      </h1>

      {patients.length === 0 ? (
        <p className="text-center text-gray-500 mt-20 text-lg">
          🎉 No pending payments. All received!
        </p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead className="bg-blue-100 rounded-t-xl">
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
              {patients.map((p, idx) => (
                <tr
                  key={p.appointmentId}
                  className={`bg-white shadow-md rounded-xl hover:bg-blue-50 transition-all duration-200`}
                >
                  <td className="px-6 py-4 font-semibold text-gray-800">{p.patient.name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {p.patient.phone}
                    <br />
                    {p.patient.email}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{p.doctor.name}</td>
                  <td className="px-6 py-4 text-gray-600">
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
  );
};

export default AdminPage;

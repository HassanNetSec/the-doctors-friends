"use client";
import React, { ChangeEvent, useState, useEffect } from "react";
import { Search, MapPin, Star, DollarSign, Briefcase, Phone, Mail, Languages, Filter, X, ChevronDown, Calendar, User, Building2, Award, Clock } from "lucide-react";
import mockDoctorData from "../components/doctors.json"
import { useRouter } from "next/navigation";
// The complete list of specialties
const ALL_SPECIALTIES: string[] = [
  'Hematology', 'Rheumatology', 'Addiction Medicine', 'Cardiology', 'Endocrinology',
  'Anesthesiology', 'Sports Medicine', 'Neurology', 'Gastroenterology', 'Thoracic Surgery',
  'Orthopedics', 'Emergency Medicine', 'Nephrology', 'Otolaryngology (ENT)', 'Radiology',
  'Occupational Medicine', 'Reproductive Endocrinology', 'Oncology', 'Ophthalmology',
  'Psychiatry', 'Family Medicine', 'Podiatry', 'Obstetrics/Gynecology', 'Geriatrics',
  'Palliative Care', 'General Surgery', 'Pulmonology', 'Internal Medicine',
  'General Practice', 'Dermatology', 'Pediatrics', 'Plastic Surgery', 'Urology'
];

// Define the Doctor interface
interface Doctor {
  id: number;
  name: string;
  age: number;
  specialty: string;
  experience_years: number;
  hospital: string;
  rating: number;
  phone: string;
  email: string;
  location: string;
  consultation_fee_usd: number;
  languages: string[];
}



const SearchDoctor = () => {
  const [speciality, setSpeciality] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [doctorsDetail] = useState(mockDoctorData);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(doctorsDetail);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'fee' | 'experience'>('rating');
  const router = useRouter()
  // Apply filters
  const applyFilters = (
    currentSearchTerm: string, 
    currentSpecialty: string, 
    allDoctors: Doctor[]
  ) => {
    let results = allDoctors;
    
    if (currentSpecialty) {
      results = results.filter((item) => item.specialty === currentSpecialty);
    }

    if (currentSearchTerm) {
      const lowerCaseSearchTerm = currentSearchTerm.toLowerCase().trim();
      results = results.filter(
        (item) => 
          item.name.toLowerCase().includes(lowerCaseSearchTerm) || 
          item.hospital.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.specialty.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.location.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Sort results
    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'fee':
          return a.consultation_fee_usd - b.consultation_fee_usd;
        case 'experience':
          return b.experience_years - a.experience_years;
        default:
          return 0;
      }
    });

    setFilteredDoctors(results);
  };
  
  useEffect(() => {
    applyFilters(searchTerm, speciality, doctorsDetail);
  }, [doctorsDetail, sortBy]);

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSpeciality(value);
    applyFilters(searchTerm, value, doctorsDetail);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(value, speciality, doctorsDetail);
  };

  const clearFilters = () => {
    setSpeciality("");
    setSearchTerm("");
    applyFilters("", "", doctorsDetail);
  };

  const handleViewProfile = (id: number) => {
    console.log(`View profile for doctor ${id}`);
    // window.location.href = `/doctors/details?id=${id}`;
    router.push(`http://localhost:3000//doctors/details?id=${id}`)
  };

  const handleBookAppointment = (id: number) => {
    console.log(`Book appointment for doctor ${id}`);
    // window.location.href = `/doctors/bookAppointment?id=${id}`;
    router.push(`/doctors/bookAppointment?id=${id}`)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 flex items-center justify-center gap-3">
              <User className="w-10 h-10" />
              Find Your Specialist
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Connect with {doctorsDetail.length}+ verified healthcare professionals
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search by doctor, hospital, specialty, or location..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
              />
            </div>

            {/* Specialty Dropdown */}
            <div className="lg:w-72 relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                value={speciality}
                onChange={handleSelectChange}
                className="w-full pl-12 pr-10 py-4 border border-gray-300 rounded-xl bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
              >
                <option value="">All Specialties</option>
                {ALL_SPECIALTIES.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || speciality) && (
              <button
                onClick={clearFilters}
                className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition flex items-center gap-2 font-semibold whitespace-nowrap"
              >
                <X className="w-5 h-5" />
                Clear
              </button>
            )}
          </div>

          {/* Sort Options */}
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-gray-700">Sort by:</span>
            <div className="flex gap-2">
              {[
                { value: 'rating', label: 'Rating' },
                { value: 'fee', label: 'Fee' },
                { value: 'experience', label: 'Experience' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    sortBy === option.value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {speciality ? `${speciality} Specialists` : 'Available Doctors'}
            </h2>
            <p className="text-gray-600 mt-1">
              {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'} found
            </p>
          </div>
        </div>

        {/* Doctor Cards Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
              >
                {/* Card Header with Gradient */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1">Dr. {doctor.name}</h3>
                      <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        {doctor.specialty}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{doctor.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Key Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Building2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm">{doctor.hospital}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-700">
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm">{doctor.location}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <Award className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm">{doctor.experience_years} years experience</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <Languages className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm">{doctor.languages.join(', ')}</span>
                    </div>
                  </div>

                  {/* Fee Badge */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Consultation Fee</span>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">
                          {doctor.consultation_fee_usd}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => handleBookAppointment(doctor.id)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
                    >
                      <Calendar className="w-5 h-5" />
                      Book Appointment
                    </button>
                    
                    <button
                      onClick={() => handleViewProfile(doctor.id)}
                      className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <User className="w-5 h-5" />
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Doctors Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn't find any doctors matching your search criteria. Try adjusting your filters or search term.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition inline-flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDoctor;
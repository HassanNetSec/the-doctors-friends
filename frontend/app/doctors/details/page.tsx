'use client';
import { useSearchParams,useRouter } from 'next/navigation';
import { Suspense } from 'react';
import doctorsDetails from "../../components/doctors.json";
import Link from 'next/link';
// Enhanced Doctor interface with age property
interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience_years: number;
  hospital: string;
  rating: number;
  phone: string;
  email: string;
  location: string;
  consultation_fee_usd: number;
  languages: string[];
  age?: number; // Optional since it wasn't in original interface
}

// Separate component for search params logic (required for useSearchParams)
const DoctorProfileContent = () => {
  const searchParams = useSearchParams();
  const idString = searchParams.get('id');
  const doctorId = idString ? parseInt(idString, 10) : undefined;

  const allDoctors: Doctor[] = doctorsDetails as Doctor[];
  const doctor = allDoctors.find(item => item.id === doctorId);

  if (!doctorId || isNaN(doctorId)) {
    return <ErrorState message="Invalid doctor ID provided" idString={idString} />;
  }

  if (!doctor) {
    return <ErrorState message="Doctor profile not found" idString={idString} />;
  }

  return <DoctorProfile doctor={doctor} />;
};

// Error state component
const ErrorState = ({ message, idString }: { message: string; idString: string | null }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-6">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="text-6xl mb-4">😔</div>
      <h1 className="text-3xl font-bold text-red-700 mb-2">Doctor Not Found</h1>
      <p className="text-gray-600 mb-2">{message}</p>
      {idString && (
        <p className="text-sm text-gray-500 mb-6">Doctor ID: {idString}</p>
      )}

      <Link
        href="http://localhost:3000/search_doctors"
        className="inline-block py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 hover:shadow-lg"
      >
        ← Return to Search
      </Link>
    </div>
  </div>
);

// Main doctor profile component
const DoctorProfile = ({ doctor }: { doctor: Doctor }) => {
    const router = useRouter()
  const handleBookAppointment = (id : number) => {
   router.push(`http://localhost:3000/doctors/bookAppointment?id=${id}`)
  };

  const handleContact = (type: 'phone' | 'email') => {
    if (type === 'phone') {
      window.location.href = `tel:${doctor.phone}`;
    } else {
      window.location.href = `mailto:${doctor.email}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 sm:px-10 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="text-white">
              <h1 className="text-4xl font-extrabold">Dr. {doctor.name}</h1>
              <span className="text-xl font-medium text-blue-100 mt-1 block">
                {doctor.specialty} Specialist
              </span>
            </div>
            <div className="flex items-center gap-2 mt-3 sm:mt-0 bg-white rounded-full px-4 py-2">
              <span className="text-2xl font-bold text-yellow-500">{doctor.rating}</span>
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          {/* Main Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* Professional Info */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-blue-600">🏥</span>
                Professional Details
              </h2>
              <div className="space-y-3">
                <DetailItem label="Hospital" value={doctor.hospital} />
                <DetailItem label="Experience" value={`${doctor.experience_years} years`} />
                <DetailItem label="Location" value={doctor.location} />
                {doctor.age && <DetailItem label="Age" value={`${doctor.age} years`} />}
              </div>
            </section>
            
            {/* Contact & Languages */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-blue-600">📞</span>
                Contact & Communication
              </h2>
              <div className="space-y-3">
                <DetailItem 
                  label="Phone" 
                  value={doctor.phone}
                  interactive
                  onClick={() => handleContact('phone')}
                />
                <DetailItem 
                  label="Email" 
                  value={doctor.email}
                  interactive
                  onClick={() => handleContact('email')}
                />
                <DetailItem 
                  label="Languages" 
                  value={doctor.languages.join(', ')} 
                />
              </div>
            </section>
          </div>

          {/* Footer: Fee and Action Button */}
          <footer className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-500 mb-1">Consultation Fee</p>
              <p className="text-3xl font-extrabold text-green-600">
                ${doctor.consultation_fee_usd}
              </p>
            </div>
            <button
              onClick={()=>handleBookAppointment(doctor.id)}
              className="w-full sm:w-auto py-3 px-8 bg-blue-600 text-white text-xl font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Book Appointment
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

// Enhanced DetailItem component with optional interactivity
const DetailItem = ({ 
  label, 
  value, 
  interactive = false,
  onClick 
}: { 
  label: string; 
  value: string | number;
  interactive?: boolean;
  onClick?: () => void;
}) => (
  <div className="text-lg">
    <span className="font-bold text-gray-700 block sm:inline mr-2">{label}:</span>
    <span 
      className={`text-gray-600 ${interactive ? 'text-blue-600 hover:text-blue-800 cursor-pointer hover:underline' : ''}`}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => e.key === 'Enter' && onClick?.() : undefined}
    >
      {value}
    </span>
  </div>
);

// Main component with Suspense boundary
const Doctors = () => {
  return (
    <Suspense fallback={<LoadingState />}>
      <DoctorProfileContent />
    </Suspense>
  );
};

// Loading state component
const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
      <p className="text-xl text-gray-600">Loading doctor profile...</p>
    </div>
  </div>
);

export default Doctors;
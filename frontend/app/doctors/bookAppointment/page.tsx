'use client';
import React, { useState, Suspense, useEffect, useCallback } from 'react';
import { CircleCheck, XCircle, Loader2, Printer, Download, ArrowLeft } from 'lucide-react';
// Assuming the path is correct
import doctorsDetails from "../../components/doctors.json"

// --- Type Definitions ---
interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience_years: number;
  hospital: string;
  rating: number;
  phone: string;
  email: string; // Used for sending notification to the doctor
  location: string;
  consultation_fee_usd: number; // Stays as number, relying on JSON fix
  languages: string[];
  age?: number;
}
// ... [FormData, Receipt, NotificationStatus types remain the same]
interface FormData {
  patientName: string;
  email: string; // Used for sending confirmation to the patient
  phone: string;
  date: string;
  time: string;
  reason: string;
  notes: string;
}

interface Receipt {
  appointmentId: string;
  patientId: string;
  bookingDate: string;
  Patientemail : string
}

type NotificationStatus = 'idle' | 'success' | 'error';


// --- Sub-components & Hooks ---

const ReceiptRow: React.FC<{ label: string; value: string }> = React.memo(({ label, value }) => (
  <div className="flex justify-between items-start">
    <span className="text-sm text-gray-600 font-medium">{label}:</span>
    <span className="text-sm text-gray-900 font-semibold text-right ml-4">{value}</span>
  </div>
));

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <Loader2 className="animate-spin h-16 w-16 text-blue-600 mx-auto mb-4" />
      <p className="text-xl text-gray-600">Loading...</p>
    </div>
  </div>
);

const useUrlId = (): number | undefined => {
  const [id, setId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const idParam = urlParams.get('id');
      if (idParam) {
        const parsedId = parseInt(idParam, 10);
        if (!isNaN(parsedId)) {
          setId(parsedId);
        }
      }
    }
  }, []);
  
  return id;
};

// --- Mock PDF Function (for simulation) ---
const mockGeneratePdf = (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      console.log(`[MOCK PDF] Simulating PDF generation for element ID: ${elementId}`);
      console.log(`[MOCK PDF] File: ${filename}.pdf`);
      alert(`Download simulation complete! File: ${filename}.pdf`);
    } else {
      console.error(`Element with ID ${elementId} not found.`);
    }
};


// ----------------------------------------------------------------------------------
// ## BookAppointmentContent Component (Main Logic)
// ----------------------------------------------------------------------------------

const BookAppointmentContent = () => {
  const doctorId = useUrlId();

  // FIX: Use 'as unknown as Doctor[]' to safely cast the imported JSON data.
  // This tells TypeScript you acknowledge the potential structure mismatch but trust the data.
  const allDoctors = doctorsDetails as unknown as Doctor[];
  const doctor = allDoctors.find(item => item.id === doctorId);

  // --- State Hooks ---
  const [formData, setFormData] = useState<FormData>({
    patientName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    reason: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<NotificationStatus>('idle');
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // --- Utility Functions ---
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prevData => ({
      ...prevData,
      [e.target.name]: e.target.value
    }));
  }, []);

  const generateAppointmentId = useCallback((): string => {
    const prefix = 'APT';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }, []);

  const generatePatientId = useCallback((): string => {
    const prefix = 'PAT';
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `${prefix}-${random}`;
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleDownload = useCallback(() => {
    if (receipt && doctor) {
        const filename = `Appointment_${doctor.name.replace(/\s/g, '')}_${receipt.appointmentId}`;
        mockGeneratePdf('receipt-container', filename);
        setNotificationMessage('Download initiated! Check your browser downloads.');
    } else {
        setNotificationMessage('Cannot download: Receipt data is missing.');
    }
  }, [receipt, doctor]);
  
  // 📧 NEW: Function to call the Next.js API route
  const sendEmailNotification = async (currentDoctor: Doctor, currentFormData: FormData, currentReceiptData: Receipt) => {
    
    try {
        // This initiates the POST request to your serverless function
        const response = await fetch('/api/sendAppointmentEmail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                doctor: currentDoctor, 
                formData: currentFormData, 
                receiptData: currentReceiptData 
            }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log("📧 EMAIL API SUCCESS:", data.message);
            return { 
                success: true, 
                message: 'Booking completed! Confirmation email sent to you and the doctor.'
            };
        } else {
            console.error("📧 EMAIL API FAILED:", data.message);
            return { 
                success: false, 
                message: `Booking Recorded, but email failed: ${data.message}. Check credentials.`
            };
        }
    } catch (error) {
        console.error("NETWORK ERROR sending email:", error);
        return { 
          success: false, 
          message: 'Booking Recorded, but a network error prevented email notification.'
        };
    }
  };

  // --- Core Submission Logic ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor || isSubmitting) return; 
    
    setIsSubmitting(true);
    setNotificationStatus('idle');
    setNotificationMessage(null);

    // 1. Generate local data (Receipt)
    const receiptData: Receipt = {
        appointmentId: generateAppointmentId(),
        patientId: generatePatientId(),
        Patientemail : formData.email,
        bookingDate: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
    };

    try {
        // 2. Attempt to send email via API route
        const emailResult = await sendEmailNotification(doctor, formData, receiptData);
        
        // 3. Update UI state
        setReceipt(receiptData);
        setNotificationStatus(emailResult.success ? 'success' : 'error');
        setNotificationMessage(emailResult.message);

    } catch (error) {
        console.error('Submission Failed:', error);
        setNotificationStatus('error');
        setNotificationMessage('A critical error occurred during booking. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
  };
  
  // --- Rendering Logic (Doctor Not Found / Receipt / Form) ---
  
  if (doctorId === undefined || !doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <XCircle className="w-16 h-16 text-red-700 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-red-700 mb-2">Invalid Request</h1>
          <p className="text-gray-600 mb-6">Unable to find doctor information. Ensure the ID is correct.</p>
          <a
            href="/"
            className="inline-block py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            <ArrowLeft className="w-5 h-5 inline mr-2" /> Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (receipt) {
    let displayDate = 'N/A';
    try {
        const dateParts = formData.date.split('-');
        // Note: Using UTC in Date constructor avoids local time zone issues when parsing YYYY-MM-DD
        const appointmentDate = new Date(Date.UTC(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2])));
        displayDate = appointmentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) { /* silent error */ }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 py-12 text-black">
        <div className="max-w-4xl mx-auto">
          
          {/* Status Message */}
          <div className="text-center mb-8">
            {notificationStatus === 'success' ? (
              <CircleCheck className="w-20 h-20 text-green-600 mx-auto mb-4 animate-pulse" />
            ) : (
              <XCircle className="w-20 h-20 text-red-600 mx-auto mb-4" />
            )}
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Appointment Booked!
            </h1>
            <p className={`text-lg font-semibold ${notificationStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {notificationMessage}
            </p>
          </div>

          {/* Receipt container - ID ADDED HERE FOR PDF FUNCTIONALITY */}
          <div id="receipt-container" className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-1">APPOINTMENT RECEIPT</h2>
                  <p className="text-blue-100">Official Booking Confirmation</p>
                </div>
                <div className="text-4xl">🏥</div>
              </div>
            </div>

            <div className="p-8">
              
              {/* IDs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                  <p className="text-xs text-gray-600 font-semibold mb-1">APPOINTMENT ID</p>
                  <p className="text-lg font-bold text-gray-900">{receipt.appointmentId}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-600">
                  <p className="text-xs text-gray-600 font-semibold mb-1">PATIENT ID</p>
                  <p className="text-lg font-bold text-gray-900">{receipt.patientId}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
                  <p className="text-xs text-gray-600 font-semibold mb-1">BOOKING DATE</p>
                  <p className="text-sm font-bold text-gray-900">{receipt.bookingDate}</p>
                </div>
              </div>

              {/* Patient & Doctor Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">👤 Patient Information</h3>
                  <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                    <ReceiptRow label="Patient Name" value={formData.patientName} />
                    <ReceiptRow label="Email" value={formData.email} />
                    <ReceiptRow label="Phone" value={formData.phone} />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">👨‍⚕️ Doctor Information</h3>
                  <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                    <ReceiptRow label="Doctor Name" value={`${doctor.name}`} />
                    <ReceiptRow label="Specialty" value={doctor.specialty} />
                    <ReceiptRow label="Hospital" value={doctor.hospital} />
                    <ReceiptRow label="Location" value={doctor.location} />
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📅 Appointment Details</h3>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 font-semibold mb-2">DATE</p>
                      <p className="text-2xl font-bold text-gray-900">{displayDate}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 font-semibold mb-2">TIME</p>
                      <p className="text-2xl font-bold text-gray-900">{formData.time}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 font-semibold mb-2">REASON</p>
                      <p className="text-lg font-bold text-gray-900">{formData.reason}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📍 Location</h3>
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-600">
                  <p className="text-lg font-semibold text-gray-900">{doctor.hospital}</p>
                  <p className="text-gray-600">{doctor.location}</p>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">💰 Payment Details</h3>
                    <p className="text-gray-600">Consultation Fee</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-extrabold text-green-700">${doctor.consultation_fee_usd}</p>
                    <p className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full inline-block mt-2">
                      PAY AT CLINIC
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {formData.notes && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">📝 Additional Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-400">
                    <p className="text-gray-700">{formData.notes}</p>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-8">
                <h4 className="font-bold text-gray-900 mb-2">⚠️ Important Instructions</h4>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Please arrive **15 minutes before** your appointment time.</li>
                  <li>Bring a valid ID and insurance card if applicable.</li>
                  <li>Payment of **${doctor.consultation_fee_usd}** is due at the clinic.</li>
                  <li>Bring any relevant medical records or test results.</li>
                  <li>Call **{doctor.phone}** if you need to reschedule.</li>
                </ul>
              </div>

              {/* Footer */}
              <div className="text-center text-gray-500 text-sm border-t pt-4">
                <p>This is an electronic receipt. No signature required.</p>
                <p className="mt-1">For inquiries, contact: {doctor.email}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={handlePrint}
              className="py-3 px-8 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 print:hidden"
            >
              <Printer className="w-5 h-5" />
              Print Receipt
            </button>
            <button
              onClick={handleDownload}
              className="py-3 px-8 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2 print:hidden"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
            <a
              href="/"
              className="py-3 px-8 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition text-center print:hidden"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Doctor Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h2>
              <p className="text-xl text-blue-600 font-medium mb-1">{doctor.specialty} Specialist</p>
              <p className="text-gray-600">{doctor.hospital}</p>
              <p className="text-gray-600">{doctor.location}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold text-yellow-500">{doctor.rating}</span>
                <span className="text-2xl">⭐</span>
              </div>
              <p className="text-2xl font-bold text-green-600">${doctor.consultation_fee_usd}</p>
              <p className="text-sm text-gray-500">Consultation Fee</p>
            </div>
          </div>
        </div>
        
        {/* Notification Status */}
        {notificationMessage && notificationStatus !== 'idle' && (
          <div className={`p-4 mb-6 rounded-xl shadow-md ${notificationStatus === 'success' ? 'bg-green-100 border-l-4 border-green-500' : 'bg-red-100 border-l-4 border-red-500'}`}>
            <div className="flex items-center">
              {notificationStatus === 'success' ? 
                <CircleCheck className="w-5 h-5 mr-3 text-green-700" /> : 
                <XCircle className="w-5 h-5 mr-3 text-red-700" />
              }
              <span className={`font-medium ${notificationStatus === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {notificationMessage}
              </span>
            </div>
          </div>
        )}

        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
          <p className="text-gray-600 mb-8">Fill in the details below to schedule your consultation</p>

          <form onSubmit={handleSubmit} className="space-y-6 text-black">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="john.doe@example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={today}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Time *</label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select a time</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Visit *</label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Select a reason</option>
                <option value="General Consultation">General Consultation</option>
                <option value="Follow-up Visit">Follow-up Visit</option>
                <option value="Routine Checkup">Routine Checkup</option>
                <option value="Specific Concern">Specific Concern</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder="Any specific symptoms or concerns..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-4 px-8 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5" />
                    Processing...
                  </span>
                ) : (
                  'Confirm Appointment'
                )}
              </button>
              <a
                href={`/doctors?id=${doctor.id}`}
                className="py-4 px-8 bg-gray-200 text-gray-800 text-lg font-semibold rounded-lg hover:bg-gray-300 transition text-center"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------

const BookAppointment = () => {
  return (
    <Suspense fallback={<LoadingState />}>
      <BookAppointmentContent />
    </Suspense>
  )
}

export default BookAppointment;

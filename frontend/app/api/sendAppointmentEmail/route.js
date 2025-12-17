import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Email credentials from environment variables
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const APP_PASSWORD = process.env.APP_PASSWORD;

// Local JSON file path
const EMAIL_FILE_PATH = path.join(
  process.cwd(),
  'app/components/patientDoctorInformation.json'
);

// Function to send email
const sendEmail = async (mailOptions) => {
  if (!SENDER_EMAIL || !APP_PASSWORD) {
    throw new Error("Email credentials not configured on the server.");
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: SENDER_EMAIL, pass: APP_PASSWORD },
  });

  return await transporter.sendMail(mailOptions);
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { doctor, formData, receiptData } = body;

    // --- Construct Email ---
    const subject = `Appointment Confirmation for Dr. ${doctor.name} on ${formData.date}`;
    const htmlContent = `
      <html>
      <body>
        <h1>Appointment for Dr. ${doctor.name}</h1>
        <h2>Patient Info</h2>
        <p>Name: ${formData.patientName}</p>
        <p>Email: ${formData.email}</p>
        <p>Phone: ${formData.phone}</p>
        <h2>Appointment Info</h2>
        <p>Date: ${formData.date}</p>
        <p>Time: ${formData.time}</p>
        <p>Location: ${doctor.hospital} (${doctor.location})</p>
        <p>Reason: ${formData.reason}</p>
        <p>Appointment ID: ${receiptData.appointmentId}</p>
        <p>Booking Date: ${receiptData.bookingDate}</p>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `Appointment System <${SENDER_EMAIL}>`,
      to: [formData.email, doctor.email], // send to both patient and doctor
      subject,
      html: htmlContent,
    };

    // Send email
    await sendEmail(mailOptions);

    // --- Save info locally ---
    let existingData = [];
    try {
      const fileContent = fs.existsSync(EMAIL_FILE_PATH)
        ? fs.readFileSync(EMAIL_FILE_PATH, 'utf-8')
        : '';
      existingData = fileContent ? JSON.parse(fileContent) : [];
    } catch {
      existingData = []; // initialize if file is empty or invalid
    }

    existingData.push({
      doctor: {
        name: doctor.name,
        email: doctor.email,
        hospital: doctor.hospital,
        location: doctor.location,
      },
      patient: {
        name: formData.patientName,
        email: formData.email,
        phone: formData.phone,
      },
      appointmentId: receiptData.appointmentId,
      bookingDate: receiptData.bookingDate,
    });

    fs.writeFileSync(EMAIL_FILE_PATH, JSON.stringify(existingData, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Email sent and patient/doctor info saved successfully.',
    });
  } catch (error) {
    console.error('Email/Save Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send email or save info.',
      },
      { status: 500 }
    );
  }
}

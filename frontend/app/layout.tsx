import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Doctor's Friend MVP",
  description: "Patient Search and Appointment Booking Prototype.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 1. Navbar is fixed at the top */}
        <Navbar/> 
        
        {/* 2. Content Container: This div ensures the content starts below the fixed navbar. 
             The 'pt-16' class (or equivalent to 4rem/64px) pushes the children down, 
             assuming the Navbar height is 4rem (h-16 class used in your Navbar). */}
        <div className="pt-16 min-h-screen"> 
          {children}
        </div>
      </body>
    </html>
  );
}
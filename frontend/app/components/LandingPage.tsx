"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, ShieldCheck } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const LandingPage: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/components/Authentication/");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Hero Section */}
      <section className="relative py-24 px-6 lg:px-20 flex flex-col items-center text-center">
        <div className="max-w-4xl">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full">
            Trusted by 10,000+ Patients
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight">
            Your Health, Our Priority. <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Find Your Perfect Doctor.
            </span>
          </h1>

          <p className="mt-8 text-xl text-slate-600 max-w-2xl mx-auto">
            The easiest way to find trusted specialists and book appointments
            instantly. Secure, reliable, and simple to use.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="px-10 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition shadow-lg"
            >
              Get Started Now
            </button>

            <button className="text-slate-500 font-medium hover:text-blue-600 transition">
              View all specialties →
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-20 bg-white">
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Search size={24} className="text-blue-600" />}
            title="Search Doctors"
            desc="Find doctors by specialty, location, or availability that fits your needs."
          />
          <FeatureCard
            icon={<Calendar size={24} className="text-blue-600" />}
            title="Instant Booking"
            desc="Book appointments instantly with real-time availability."
          />
          <FeatureCard
            icon={<ShieldCheck size={24} className="text-blue-600" />}
            title="Verified Reviews"
            desc="Read real patient reviews and choose care you can trust."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 lg:px-20 bg-slate-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-slate-600 text-lg mb-14">
            Get medical care in three easy steps.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                title: "Search Doctor",
                desc: "Browse doctors by specialty, rating, or location.",
              },
              {
                step: "02",
                title: "Book Appointment",
                desc: "Choose a convenient time and confirm instantly.",
              },
              {
                step: "03",
                title: "Get Treatment",
                desc: "Visit your doctor and receive quality care.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-3xl p-8 border border-slate-100"
              >
                <div className="text-blue-600 font-extrabold text-3xl mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Specialties */}
   <section className="py-24 px-6 lg:px-20 bg-white">
  <div className="max-w-6xl mx-auto">
    <div className="text-center mb-14">
      <h2 className="text-4xl font-extrabold text-slate-900">
        Popular Specialties
      </h2>
      <p className="mt-3 text-lg text-slate-600">
        Explore care across the most in-demand medical fields
      </p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[
        { name: "Cardiology", icon: "❤️" },
        { name: "Dermatology", icon: "🧴" },
        { name: "Neurology", icon: "🧠" },
        { name: "Pediatrics", icon: "🧒" },
        { name: "Orthopedics", icon: "🦴" },
        { name: "Gynecology", icon: "🌸" },
        { name: "Psychiatry", icon: "💬" },
        { name: "Dentistry", icon: "🦷" },
      ].map((item) => (
        <div
          key={item.name}
          className="group bg-white border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 hover:-translate-y-1"
        >
          <div className="text-3xl mb-4 transition-transform group-hover:scale-110">
            {item.icon}
          </div>

          <span className="font-semibold text-slate-800 group-hover:text-blue-600 transition">
            {item.name}
          </span>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* Stats Section */}
      <section className="py-20 px-6 lg:px-20 bg-blue-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="text-4xl font-extrabold text-blue-600">10K+</h3>
            <p className="text-slate-600 mt-2">Happy Patients</p>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-blue-600">2K+</h3>
            <p className="text-slate-600 mt-2">Verified Doctors</p>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-blue-600">50+</h3>
            <p className="text-slate-600 mt-2">Medical Specialties</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 lg:px-20 bg-white text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
          Ready to Book Your Appointment?
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
          Join thousands of patients who trust us to connect them with the right
          doctors.
        </p>

        <button
          onClick={handleGetStarted}
          className="px-10 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition shadow-lg"
        >
          Get Started Today
        </button>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, desc }) => (
  <div className="p-8 border border-slate-100 rounded-3xl bg-white hover:shadow-xl hover:shadow-blue-50 transition">
    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-600 text-lg">{desc}</p>
  </div>
);

export default LandingPage;


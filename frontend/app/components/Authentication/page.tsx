'use client'
import React, { useState, useEffect } from 'react';
import { Heart, Mail, Lock, User, Stethoscope, AlertCircle, LogOut, ArrowLeft, Phone, UserPlus, ArrowRight, CheckCircle } from 'lucide-react';

// --- Utility: Simulated Hashing Function ---
const simpleHash = (str: string): string => {
  return btoa(str).split('').reverse().join('');
};

// --- Utility: Local Storage Keys ---
const USERS_KEY = 'mock_users_db';
const AUTH_TOKEN_KEY = 'auth_token'; // Token to track authentication
const CURRENT_USER_KEY = 'current_user_data'; // Store current user data

// Generate a simple mock token
const generateToken = (email: string): string => {
  return btoa(`${email}_${Date.now()}_${Math.random()}`);
};

// Check if user is authenticated
const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
};

// Get current user data
const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem(CURRENT_USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

type NavigationProps = {
  navigateTo: (view: 'signin' | 'signup' | 'landing' | 'search_doctors') => void;
};

// Helper function to navigate to actual routes
const navigateToRoute = (route: string) => {
  if (typeof window !== 'undefined') {
    window.location.href = route;
  }
};

// --- Main App Component ---
export default function App() {
  const [view, setView] = useState<'signin' | 'signup' | 'landing' | 'search_doctors'>('landing');
  const [isAuth, setIsAuth] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);
    if (!authenticated && view === 'search_doctors') {
      setView('landing');
    }
  }, [view]);

  const handleNavigation = (newView: 'signin' | 'signup' | 'landing' | 'search_doctors') => {
    // If trying to access protected route without auth, redirect to signin
    if (newView === 'search_doctors' && !isAuthenticated()) {
      setView('signin');
      return;
    }
    
    // Navigate to actual route for search_doctors
    if (newView === 'search_doctors') {
      navigateToRoute('/search_doctors');
      return;
    }
    
    setView(newView);
  };

  const CurrentView = () => {
    switch (view) {
      case 'signin':
        return <SignIn navigateTo={handleNavigation} />;
      case 'signup':
        return <SignUp navigateTo={handleNavigation} />;
      default:
        return <LandingPage navigateTo={handleNavigation} isAuthenticated={isAuth} />;
    }
  };

  return (
    <div className="min-h-screen">
      <CurrentView />
    </div>
  );
}

// --- Enhanced Landing Page ---
const LandingPage = ({ navigateTo, isAuthenticated }: NavigationProps & { isAuthenticated: boolean }) => {
  const user = getCurrentUser();

  const handleLogout = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.reload(); // Refresh to update auth state
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Trusted by 10,000+ Patients</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Your Health Journey
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Starts Here
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Connect with certified healthcare professionals, book appointments instantly, and manage your health records all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <button
                onClick={() => navigateToRoute('/search_doctors')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigateTo('signup')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigateTo('signin')}
                  className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-gray-200"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            {
              icon: <Stethoscope className="w-8 h-8" />,
              title: 'Find Specialists',
              description: 'Search from thousands of verified healthcare professionals near you'
            },
            {
              icon: <Heart className="w-8 h-8" />,
              title: 'Instant Booking',
              description: 'Book appointments 24/7 with real-time availability'
            },
            {
              icon: <Lock className="w-8 h-8" />,
              title: 'Secure & Private',
              description: 'Your health data is encrypted and HIPAA compliant'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Search Doctors Page (Protected Route) - Removed since using actual route ---
// This component is no longer needed as we're redirecting to /search_doctors

// --- SignIn Component ---
const SignIn = ({ navigateTo }: NavigationProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both Email and Password.');
      return;
    }

    setLoading(true);

    try {
      const storedUsersJson = localStorage.getItem(USERS_KEY);
      const users = storedUsersJson ? JSON.parse(storedUsersJson) : {};
      
      const userRecord = users[email];

      if (userRecord) {
        const hashedPassword = simpleHash(password);
        
        if (userRecord.hashedPassword === hashedPassword) {
          // Generate and store auth token
          const token = generateToken(email);
          localStorage.setItem(AUTH_TOKEN_KEY, token);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
            email: email,
            name: userRecord.name,
            phone: userRecord.phone
          }));
          
          setTimeout(() => {
            setLoading(false);
            navigateTo('landing');
            window.location.reload(); // Refresh to update auth state
          }, 1000);
        } else {
          setLoading(false);
          setError('Invalid email or password.');
        }
      } else {
        setLoading(false);
        setError('Invalid email or password.');
      }
    } catch (err) {
      setLoading(false);
      setError('An unexpected error occurred during sign-in.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <button
          onClick={() => navigateTo('landing')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 shadow-lg">
            <Stethoscope className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to access your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
                placeholder="your.email@example.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button onClick={() => navigateTo('signup')} className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer transition">
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

// --- SignUp Component ---
const SignUp = ({ navigateTo }: NavigationProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [agreed, setAgreed] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!agreed) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    
    setLoading(true);

    try {
      const storedUsersJson = localStorage.getItem(USERS_KEY);
      const users = storedUsersJson ? JSON.parse(storedUsersJson) : {};

      if (users[formData.email]) {
        setLoading(false);
        setError('This email is already registered.');
        return;
      }

      const hashedPassword = simpleHash(formData.password);
      const newUser = {
        name: formData.name,
        phone: formData.phone,
        hashedPassword: hashedPassword,
      };

      users[formData.email] = newUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      setTimeout(() => {
        setLoading(false);
        navigateTo('signin');
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError('An error occurred during registration.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <button
          onClick={() => navigateTo('landing')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-full mb-4 shadow-lg">
            <Heart className="w-8 h-8 text-cyan-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800">Create Account</h1>
          <p className="text-gray-600 mt-2">Join thousands of patients today</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition text-gray-900"
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition text-gray-900"
                placeholder="john@example.com"
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition text-gray-900"
                placeholder="(123) 456-7890"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition text-gray-900"
                placeholder="Minimum 8 characters"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition text-gray-900"
                placeholder="Repeat password"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="text-sm pt-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-cyan-600 rounded" 
                disabled={loading}
              />
              <span className="text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-cyan-600 hover:text-cyan-700 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-cyan-600 hover:text-cyan-700 font-medium">
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button onClick={() => navigateTo('signin')} className="text-cyan-600 hover:text-cyan-700 font-bold cursor-pointer transition">
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
};
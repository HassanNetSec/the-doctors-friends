'use client'
import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, ArrowLeft, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Simulated hashing
const simpleHash = (str: string) => btoa(str).split('').reverse().join('');

// LocalStorage keys
const EMAIL_KEY = 'email_doctor_friend_app';
const PASSWORD_KEY = 'password_doctor_friend_app';

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signup'); // toggle mode

// Check credentials on mount
useEffect(() => {
  const storedEmail = localStorage.getItem(EMAIL_KEY);
  const storedPassword = localStorage.getItem(PASSWORD_KEY);

  if (storedEmail && storedPassword) {
    router.push('/search_doctors'); // auto redirect
  } else {
    setMode('signup'); // show signup if not found
  }
}, [router]);


  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      localStorage.setItem(EMAIL_KEY, email);
      localStorage.setItem(PASSWORD_KEY, simpleHash(password));
      setIsRegistered(true);
      setLoading(false);
      alert('Account created successfully! You can now sign in.');
      setMode('signin');
    }, 1000);
  };


const handleSignIn = (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  // Admin check first
  if (email === 'admin@gmail.com' && password === 'admin123') {
    router.push('/components/adminPage');
    return;
  }

  const storedEmail = localStorage.getItem(EMAIL_KEY);
  const storedPassword = localStorage.getItem(PASSWORD_KEY);

  if (!storedEmail || !storedPassword) {
    setError('No account found. Please sign up first.');
    return;
  }

  if (email === storedEmail && simpleHash(password) === storedPassword) {
    alert('Signed in successfully!');
    // Optionally, redirect to a dashboard or homepage
    router.push('/search_doctors'); // replace with your desired route
  } else {
    setError('Invalid email or password.');
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 space-y-6 text-black">
        <div className="text-center">
          <CheckCircle className="mx-auto w-12 h-12 text-blue-600 mb-4" />
          <h1 className="text-2xl font-extrabold text-gray-800">{mode === 'signup' ? 'Create Account' : 'Welcome Back'}</h1>
          <p className="text-black mt-1">
            {mode === 'signup'
              ? 'Join thousands of patients today'
              : 'Sign in to access your account'}
          </p>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form
          onSubmit={mode === 'signup' ? handleSignUp : handleSignIn}
          className="space-y-4"
        >
          {mode === 'signup' && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                disabled={loading}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={loading}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white ${
              mode === 'signup' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
            } transition`}
          >
            {loading
              ? mode === 'signup'
                ? 'Creating Account...'
                : 'Signing In...'
              : mode === 'signup'
              ? 'Sign Up'
              : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-black text-sm">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setMode(mode === 'signup' ? 'signin' : 'signup');
              setError('');
            }}
            className="text-blue-600 font-bold hover:text-blue-700 transition"
          >
            {mode === 'signup' ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}

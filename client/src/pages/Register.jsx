import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Reusable age validation function
const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();
  return monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
};

// Age validation schema
const ageValidation = (minAge = 13) => z.string().min(1, 'Date of birth is required').refine((date) => {
  if (!date) return false;
  const age = calculateAge(date);
  return age !== null && age >= minAge;
}, {
  message: `You must be at least ${minAge} years old to create an account`,
});

const schema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  confirmPassword: z.string().min(8, 'Min 8 characters'),
  dateOfBirth: ageValidation(13), // Use reusable age validation
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions to create an account",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Enhanced Password strength indicator component
function PasswordStrengthIndicator({ password }) {
  const getStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '', bgColor: '', checks: {} };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    if (score <= 2) return { score, label: 'Weak', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-500', checks };
    if (score <= 3) return { score, label: 'Fair', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-500', checks };
    if (score <= 4) return { score, label: 'Good', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-500', checks };
    return { score, label: 'Strong', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-500', checks };
  };

  const strength = getStrength(password);
  
  // Don't show anything if password is empty or if all requirements are met
  if (!password || password.length === 0 || strength.score === 5) {
    return null;
  }
  
  return (
    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-2 w-6 sm:w-8 rounded-full transition-all duration-300 ${
                i <= strength.score
                  ? strength.bgColor
                  : 'bg-gray-200 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
        <span className={`text-sm font-semibold ${strength.color} flex items-center gap-1`}>
          <span className="text-lg">
            {strength.score <= 2 ? '⚠️' : strength.score <= 3 ? '⚡' : strength.score <= 4 ? '💪' : '🛡️'}
          </span>
          {strength.label}
        </span>
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <div className="font-medium mb-1">Password requirements:</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          <div className={`flex items-center gap-1 transition-colors duration-200 ${strength.checks.length ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
            <span className="transition-transform duration-200">{strength.checks.length ? '✅' : '⭕'}</span>
            <span>At least 8 characters</span>
          </div>
          <div className={`flex items-center gap-1 transition-colors duration-200 ${strength.checks.uppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
            <span className="transition-transform duration-200">{strength.checks.uppercase ? '✅' : '⭕'}</span>
            <span>Uppercase letter</span>
          </div>
          <div className={`flex items-center gap-1 transition-colors duration-200 ${strength.checks.lowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
            <span className="transition-transform duration-200">{strength.checks.lowercase ? '✅' : '⭕'}</span>
            <span>Lowercase letter</span>
          </div>
          <div className={`flex items-center gap-1 transition-colors duration-200 ${strength.checks.number ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
            <span className="transition-transform duration-200">{strength.checks.number ? '✅' : '⭕'}</span>
            <span>Number</span>
          </div>
        </div>
        <div className={`flex items-center gap-1 mt-1 transition-colors duration-200 ${strength.checks.special ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
          <span className="transition-transform duration-200">{strength.checks.special ? '✅' : '⭕'}</span>
          <span>Special character (@$!%*?&)</span>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  
  // Calculate min and max dates for age restriction
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
  const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
  
  // Format dates for input
  const maxDateString = maxDate.toISOString().split('T')[0];
  const minDateString = minDate.toISOString().split('T')[0];

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
      acceptTerms: false
    },
    resolver: zodResolver(schema),
  });

  const watchedPassword = watch('password');
  const watchedDateOfBirth = watch('dateOfBirth');
  
  // Calculate age in real-time using the reusable function
  const currentAge = calculateAge(watchedDateOfBirth);

const onSubmit = async (vals) => {
  try {
    const payload = {
      firstName: vals.firstName,
      lastName: vals.lastName,
      email: vals.email,
      password: vals.password,
      confirmPassword: vals.confirmPassword,
      dateOfBirth: vals.dateOfBirth,
    };

    const res = await api.post('/auth/register', payload);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    // ✅ Backend returns { token, user }
    login(data.token, data.user);

    toast.success('Registered successfully!');
    navigate('/');
  } catch (e) {
    toast.error(e.message);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center py-4 sm:py-8 px-3 sm:px-4 lg:px-8">
      {/* Enhanced Background with animated elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-4 sm:left-10 w-16 h-16 sm:w-32 sm:h-32 rounded-full opacity-10 animate-pulse" style={{ background: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)' }} />
        <div className="absolute top-40 right-4 sm:right-20 w-12 h-12 sm:w-24 sm:h-24 rounded-full opacity-15 animate-bounce" style={{ background: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)' }} />
        <div className="absolute bottom-40 left-4 sm:left-20 w-14 h-14 sm:w-28 sm:h-28 rounded-full opacity-10 animate-pulse" style={{ background: isDark ? 'rgba(236, 72, 153, 0.3)' : 'rgba(236, 72, 153, 0.2)' }} />
        <div className="absolute bottom-20 right-4 sm:right-10 w-10 h-10 sm:w-20 sm:h-20 rounded-full opacity-15 animate-bounce" style={{ background: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)' }} />
        
        {/* Additional mobile-optimized floating elements */}
        <div className="absolute top-1/3 left-1/4 w-8 h-8 sm:w-16 sm:h-16 rounded-full opacity-5 animate-ping" style={{ background: isDark ? 'rgba(255, 193, 7, 0.3)' : 'rgba(255, 193, 7, 0.2)' }} />
        <div className="absolute top-2/3 right-1/3 w-6 h-6 sm:w-12 sm:h-12 rounded-full opacity-8 animate-pulse" style={{ background: isDark ? 'rgba(220, 38, 127, 0.3)' : 'rgba(220, 38, 127, 0.2)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md sm:max-w-lg lg:max-w-2xl">
        {/* Enhanced Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                <svg className="h-8 w-8 sm:h-10 sm:w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-3xl animate-ping opacity-20"></div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <div className="relative">
              <span className="text-2xl sm:text-3xl lg:text-4xl animate-pulse">✨</span>
              <div className="absolute inset-0 text-2xl sm:text-3xl lg:text-4xl animate-ping opacity-20">✨</div>
            </div>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
            Join our vibrant community and start sharing your amazing stories with the world
          </p>
        </div>

        {/* Enhanced Form Container */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="group">
                <label htmlFor="firstName" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400">👤</span>
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="firstName"
                    type="text"
                    className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm hover:border-green-300 dark:hover:border-green-500 hover:shadow-md focus:shadow-lg backdrop-blur-sm"
                    placeholder="Enter your first name"
                    {...register('firstName')}
                  />
                </div>
                {errors.firstName && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.firstName.message}
                    </p>
                  </div>
                )}
              </div>

              <div className="group">
                <label htmlFor="lastName" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400">👤</span>
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="lastName"
                    type="text"
                    className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md focus:shadow-lg backdrop-blur-sm"
                    placeholder="Enter your last name"
                    {...register('lastName')}
                  />
                </div>
                {errors.lastName && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.lastName.message}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="group">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400">📧</span>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md focus:shadow-lg backdrop-blur-sm"
                  placeholder="Enter your email address"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email.message}
                  </p>
                </div>
              )}
            </div>

            {/* Date of Birth Field */}
            <div className="group">
              <label htmlFor="dateOfBirth" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <span className="text-orange-600 dark:text-orange-400">🎂</span>
                Date of Birth <span className="text-red-500 text-lg">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${
                    dateOfBirth ? 'text-green-500' : 'text-gray-400 group-focus-within:text-orange-500'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="dateOfBirth"
                  type="date"
                  required
                  min={minDateString}
                  max={maxDateString}
                  className={`block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-200 shadow-sm focus:shadow-lg backdrop-blur-sm ${
                    dateOfBirth 
                      ? 'border-green-300 dark:border-green-600 hover:border-green-400 dark:hover:border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                  }`}
                  {...register('dateOfBirth')}
                  onChange={(e) => {
                    setDateOfBirth(e.target.value);
                    register('dateOfBirth').onChange(e);
                  }}
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <span>🔒</span>
                  <span>You must be at least 13 years old to create an account</span>
                </div>
                {currentAge !== null && (
                  <div className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
                    currentAge >= 13 
                      ? 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30' 
                      : 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30'
                  }`}>
                    <span>Age: {currentAge}</span>
                    <span className="text-sm">{currentAge >= 13 ? '✅' : '❌'}</span>
                  </div>
                )}
              </div>
              {errors.dateOfBirth && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.dateOfBirth.message}
                  </p>
                </div>
              )}
            </div>

            {/* Password Fields */}
            <div className="space-y-4">
              <div className="group">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">🔐</span>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md focus:shadow-lg backdrop-blur-sm"
                    placeholder="Start typing to see password requirements"
                    {...register('password')}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      register('password').onChange(e);
                    }}
                  />
                </div>
                <PasswordStrengthIndicator password={watchedPassword} />
                {errors.password && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.password.message}
                    </p>
                  </div>
                )}
              </div>

              <div className="group">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <span className={`transition-colors ${
                    confirmPassword && password === confirmPassword 
                      ? 'text-green-600 dark:text-green-400' 
                      : confirmPassword && password !== confirmPassword 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-pink-600 dark:text-pink-400'
                  }`}>🔒</span>
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${
                      confirmPassword && password === confirmPassword 
                        ? 'text-green-500' 
                        : confirmPassword && password !== confirmPassword 
                          ? 'text-red-500' 
                          : 'text-gray-400 group-focus-within:text-pink-500'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    className={`block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-200 shadow-sm focus:shadow-lg backdrop-blur-sm ${
                      confirmPassword && password === confirmPassword 
                        ? 'border-green-300 dark:border-green-600 hover:border-green-400 dark:hover:border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500' 
                        : confirmPassword && password !== confirmPassword 
                          ? 'border-red-300 dark:border-red-600 hover:border-red-400 dark:hover:border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-500 focus:ring-2 focus:ring-pink-500 focus:border-pink-500'
                    }`}
                    placeholder="Confirm your password"
                    {...register('confirmPassword')}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      register('confirmPassword').onChange(e);
                    }}
                  />
                </div>
                {errors.confirmPassword && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.confirmPassword.message}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-gradient-to-r from-cyan-50 via-teal-50 to-blue-50 dark:from-cyan-900/20 dark:via-teal-900/20 dark:to-blue-900/20 border-2 border-cyan-200 dark:border-cyan-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    {...register('acceptTerms')}
                    className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <label htmlFor="acceptTerms" className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 cursor-pointer block">
                    <span className="text-green-600 dark:text-green-400 mr-2">✅</span>
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-medium transition-colors" target="_blank">
                      Terms and Conditions
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-medium transition-colors" target="_blank">
                      Privacy Policy
                    </Link>
                  </label>
                  {!watch('acceptTerms') && errors.acceptTerms && (
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed animate-in slide-in-from-top-2 duration-300">
                      <div className="flex items-start gap-2">
                        <span className="text-orange-500 dark:text-orange-400 mt-0.5">🔒</span>
                        <div>
                          By creating an account, you agree to our terms of service and privacy policy.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {errors.acceptTerms && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.acceptTerms.message}
                  </p>
                </div>
              )}
            </div>

            {/* Enhanced Register Button */}
            <button
              type="submit"
              className="group relative w-full flex justify-center items-center py-3 sm:py-4 px-4 sm:px-6 border border-transparent text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl text-white bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3 sm:pl-4">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-green-200 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-lg sm:text-xl">🚀</span>
                <span>Create Account</span>
              </span>
            </button>

            {/* Enhanced Sign In Link */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 hover:scale-105"
                  >
                    <span>✨</span>
                    <span>Sign in here</span>
                    <span>→</span>
                  </Link>
                </p>
              </div>
            </div>
        </form>
        </div>
      </div>
    </div>
  );
}
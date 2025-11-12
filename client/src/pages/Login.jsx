import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const schema = z.object({
  emailOrUsername: z.string().min(1, 'Email or username required'),
  password: z.string().min(6, 'Min 6 characters'),
});

export default function Login() {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { emailOrUsername: '', password: '' },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (vals) => {
  try {
    const payload = {
      emailOrUsername: vals.emailOrUsername,
      password: vals.password,
    };

    const res = await api.post('/auth/login', payload);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Invalid login details');
    }

    // ✅ The backend returns { token, user }
    login(data.token, data.user);

    toast.success('Logged in successfully! 🎉');
    navigate(from, { replace: true });

  } catch (e) {
    toast.error(e.message);
  }
};

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-cyan-900 dark:to-teal-900 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-cyan-400/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-teal-400/30 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-blue-400/30 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-10 w-5 h-5 bg-cyan-400/30 rounded-full animate-bounce delay-500"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-teal-400/30 rounded-full animate-bounce delay-1200"></div>
      </div>

      <div className="relative max-w-md w-full space-y-6 sm:space-y-8">
        {/* Enhanced Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 sm:h-24 sm:w-24 bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-lg animate-pulse">
            <svg className="h-10 w-10 sm:h-12 sm:w-12 text-white animate-ping" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
            Welcome Back
          </h2>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
            Sign in to your account to continue your journey
          </p>
        </div>

        {/* Enhanced Form Container */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20 dark:border-gray-700/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
            {/* Email/Username Field */}
            <div>
              <label htmlFor="emailOrUsername" className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                <span className="text-blue-600 dark:text-blue-400 text-lg">👤</span>
                Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="emailOrUsername"
                  type="text"
                  className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg backdrop-blur-sm"
                  placeholder="Enter your email or username"
                  {...register('emailOrUsername')}
                />
              </div>
              {errors.emailOrUsername && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.emailOrUsername.message}
                  </p>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                <span className="text-indigo-600 dark:text-indigo-400 text-lg">🔐</span>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg backdrop-blur-sm"
                  placeholder="Enter your password"
                  {...register('password')}
                />
              </div>
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

            {/* Enhanced Login Button */}
            <button
              type="submit"
              className="group relative w-full flex justify-center items-center py-3 sm:py-4 px-4 sm:px-6 border border-transparent text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl text-white bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3 sm:pl-4">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white/80 group-hover:text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="flex items-center gap-2">
                <span>🚀</span>
                Sign In
              </span>
            </button>

            {/* Enhanced Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-500 dark:text-gray-400 font-semibold rounded-full border border-gray-200 dark:border-gray-700">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Enhanced Google Login Button */}
            <a
              href={`${import.meta.env.VITE_API_BASE_URL || 'https://blogaxis.onrender.com'}/api/auth/google`}
              className="group w-full flex justify-center items-center px-4 py-3 sm:py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl sm:rounded-2xl shadow-lg bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-3 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="flex items-center gap-2">
                <span>🔍</span>
                Continue with Google
              </span>
            </a>

            {/* Enhanced Sign Up Link */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 hover:scale-105"
                  >
                    <span>✨</span>
                    <span>Sign up here</span>
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
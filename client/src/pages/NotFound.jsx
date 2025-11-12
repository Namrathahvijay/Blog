import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-16 w-16 h-16 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute bottom-32 left-20 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 animate-ping"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 animate-pulse"></div>

      <div className="max-w-2xl w-full space-y-8 text-center relative z-10">
        <div className="space-y-6">
          {/* 404 Animation with Enhanced Design */}
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
            <h1 className="relative text-8xl sm:text-9xl lg:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 dark:from-cyan-400 dark:via-teal-400 dark:to-blue-400 leading-none">
              404
            </h1>
            
            {/* Floating decorative elements */}
            <div className="absolute -top-6 -right-6 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce shadow-lg"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full animate-pulse shadow-lg"></div>
            <div className="absolute top-1/2 -right-8 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-ping"></div>
            <div className="absolute top-1/2 -left-8 w-5 h-5 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full animate-bounce"></div>
          </div>
          
          {/* Enhanced Typography */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              Oops! Page not found
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
              The page you're looking for doesn't exist or has been moved to a different location.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGoBack}
              className="group relative flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform duration-300" />
              Go Back
            </button>
            
            <Link
              to="/"
              className="group relative flex items-center justify-center px-8 py-4 border-2 border-indigo-600 text-base font-semibold rounded-xl text-indigo-600 bg-white hover:bg-indigo-50 dark:bg-gray-800 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
            >
              <HomeIcon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
              Go Home
            </Link>
          </div>

          {/* Enhanced Quick Links */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-600">
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 font-medium">
              Or explore these popular sections:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/posts"
                className="group px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
              >
                📝 Browse Posts
              </Link>
              <Link
                to="/about"
                className="group px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
              >
                ℹ️ About Us
              </Link>
              <Link
                to="/contact"
                className="group px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
              >
                📞 Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Illustration Section */}
        <div className="pt-12 space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="text-8xl sm:text-9xl opacity-20 animate-pulse">
                🔍
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Additional decorative elements */}
          <div className="flex justify-center space-x-4">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
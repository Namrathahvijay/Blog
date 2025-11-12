import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';

export default function Terms() {
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState('');

  // Table of contents for desktop
  const sections = [
    { id: 'welcome', title: 'Welcome to BlogAxis' },
    { id: 'acceptance', title: 'Acceptance of Terms' },
    { id: 'accounts', title: 'User Accounts' },
    { id: 'content', title: 'Content Guidelines' },
    { id: 'privacy', title: 'Privacy and Data Protection' },
    { id: 'termination', title: 'Account Termination' },
    { id: 'intellectual', title: 'Intellectual Property' },
    { id: 'disclaimers', title: 'Disclaimers' },
    { id: 'liability', title: 'Limitation of Liability' },
    { id: 'changes', title: 'Changes to Terms' },
    { id: 'contact', title: 'Contact Us' }
  ];

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Track active section for TOC highlighting
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
            Terms and Conditions
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Table of Contents - Desktop Only */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="sticky top-8">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        {/* Content */}
              <div className="p-4 sm:p-6 md:p-8 lg:p-12 space-y-8 sm:space-y-12">
          
          {/* Introduction */}
                <section id="welcome" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">1</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              Welcome to BlogAxis
                        <svg className="w-6 h-6 ml-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
            </h2>
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border-l-4 border-blue-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              These Terms and Conditions ("Terms") govern your use of BlogAxis ("we," "our," or "us") 
              and the services we provide. By accessing or using our platform, you agree to be bound 
              by these Terms.
            </p>
                      </div>
                    </div>
                  </div>
          </section>

          {/* Acceptance of Terms */}
                <section id="acceptance" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">2</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        Acceptance of Terms
                        <svg className="w-6 h-6 ml-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
            </h2>
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border-l-4 border-green-500">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-4">
              By creating an account, accessing, or using BlogAxis, you acknowledge that you have 
              read, understood, and agree to be bound by these Terms and our Privacy Policy.
            </p>
                          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-green-200 dark:border-green-700">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              If you do not agree to these Terms, please do not use our service.
            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
          </section>

          {/* User Accounts */}
                <section id="accounts" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">3</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        User Accounts
                        <svg className="w-6 h-6 ml-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
            </h2>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-l-4 border-purple-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
                To use certain features of BlogAxis, you must create an account. You agree to:
              </p>
                        <div className="grid gap-3">
                          {[
                            "Provide accurate, current, and complete information",
                            "Maintain and update your account information", 
                            "Keep your password secure and confidential",
                            "Be responsible for all activities under your account",
                            "Notify us immediately of any unauthorized use",
                            "Be at least 13 years old to create an account"
                          ].map((item, index) => (
                            <div key={index} className="flex items-start space-x-3 bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
                              <div className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mt-0.5">
                                <svg className="w-3 h-3 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
            </div>
          </section>

          {/* Content Guidelines */}
                <section id="content" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">4</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        Content Guidelines
                        <svg className="w-6 h-6 ml-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
            </h2>
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border-l-4 border-orange-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
                You are responsible for all content you post on BlogAxis. You agree not to post content that:
              </p>
                        <div className="grid gap-3">
                          {[
                            "Is illegal, harmful, or violates any laws",
                            "Contains hate speech, harassment, or discrimination",
                            "Is spam, misleading, or fraudulent",
                            "Violates intellectual property rights",
                            "Contains personal information of others without consent",
                            "Is sexually explicit or inappropriate",
                            "Promotes violence or dangerous activities"
                          ].map((item, index) => (
                            <div key={index} className="flex items-start space-x-3 bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-orange-200 dark:border-orange-700">
                              <div className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mt-0.5">
                                <svg className="w-3 h-3 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
            </div>
          </section>

          {/* Privacy and Data */}
                <section id="privacy" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">5</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        Privacy and Data Protection
                        <svg className="w-6 h-6 ml-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
            </h2>
                      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-6 border-l-4 border-indigo-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-4">
              We are committed to protecting your privacy. Our Privacy Policy explains how we collect, 
              use, and protect your information. By using BlogAxis, you consent to our data practices 
              as described in our Privacy Policy.
            </p>
                        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-indigo-200 dark:border-indigo-700">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              You have the right to access, update, or delete your personal information at any time.
            </p>
                        </div>
                      </div>
                    </div>
                  </div>
          </section>

          {/* Account Termination */}
                <section id="termination" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">6</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        Account Termination
                        <svg className="w-6 h-6 ml-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
            </h2>
                      <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-l-4 border-red-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
                You may delete your account at any time through your profile settings. When you delete 
                your account:
              </p>
                        <div className="grid gap-3 mb-6">
                          {[
                            "Your account and profile will be permanently deleted",
                            "All your posts, comments, and content will be removed",
                            "This action cannot be undone",
                            "You will lose access to all your data and content"
                          ].map((item, index) => (
                            <div key={index} className="flex items-start space-x-3 bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-red-200 dark:border-red-700">
                              <div className="flex-shrink-0 w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mt-0.5">
                                <svg className="w-3 h-3 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</p>
                            </div>
                          ))}
                        </div>
                        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-red-200 dark:border-red-700">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                We may also suspend or terminate accounts that violate these Terms.
              </p>
                        </div>
                      </div>
                    </div>
            </div>
          </section>

          {/* Intellectual Property */}
                <section id="intellectual" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">7</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        Intellectual Property
                        <svg className="w-6 h-6 ml-3 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
            </h2>
                      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border-l-4 border-teal-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-4">
              You retain ownership of the content you create and post on BlogAxis. However, by posting 
              content, you grant us a license to display, distribute, and modify your content as 
              necessary to provide our services.
            </p>
                        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-teal-200 dark:border-teal-700">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              BlogAxis and its original content, features, and functionality are owned by us and 
              protected by international copyright, trademark, and other intellectual property laws.
            </p>
                        </div>
                      </div>
                    </div>
                  </div>
          </section>

          {/* Disclaimers */}
                <section id="disclaimers" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">8</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        Disclaimers
                        <svg className="w-6 h-6 ml-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
            </h2>
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 border-l-4 border-yellow-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              BlogAxis is provided "as is" without warranties of any kind. We do not guarantee that 
              our service will be uninterrupted, secure, or error-free. You use our service at your 
              own risk.
            </p>
                      </div>
                    </div>
                  </div>
          </section>

          {/* Limitation of Liability */}
                <section id="liability" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">9</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        Limitation of Liability
                        <svg className="w-6 h-6 ml-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
            </h2>
                      <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-2xl p-6 border-l-4 border-gray-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              To the maximum extent permitted by law, BlogAxis shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages resulting from your use of our service.
            </p>
                      </div>
                    </div>
                  </div>
          </section>

          {/* Changes to Terms */}
                <section id="changes" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">10</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        Changes to Terms
                        <svg className="w-6 h-6 ml-3 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
            </h2>
                      <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl p-6 border-l-4 border-pink-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              We may update these Terms from time to time. We will notify users of significant changes 
              through our platform or via email. Your continued use of BlogAxis after changes constitutes 
              acceptance of the new Terms.
            </p>
                      </div>
                    </div>
                  </div>
          </section>

          {/* Contact Information */}
                <section id="contact" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">11</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        Contact Us
                        <svg className="w-6 h-6 ml-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
            </h2>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border-l-4 border-blue-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
                        <div className="grid gap-3 sm:gap-4">
                          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-blue-200 dark:border-blue-700">
                            <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Email</span>
                            </div>
                            <a href="mailto:sauravshubham903@gmail.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 transition-colors text-sm sm:text-base break-all">
                              sauravshubham903@gmail.com
                            </a>
                          </div>
                          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-blue-200 dark:border-blue-700">
                            <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                              </svg>
                              <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Website</span>
                            </div>
                            <a href="https://blog-axis.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 transition-colors text-sm sm:text-base break-all">
                              https://blog-axis.vercel.app
                            </a>
                          </div>
                          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-blue-200 dark:border-blue-700">
                            <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                              </svg>
                              <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">GitHub</span>
                            </div>
                            <a href="https://github.com/saurav-kumar-sah-dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 transition-colors text-sm sm:text-base break-all">
                              https://github.com/saurav-kumar-sah-dev
                            </a>
                          </div>
                          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-blue-200 dark:border-blue-700">
                            <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                              <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">LinkedIn</span>
                            </div>
                            <a href="https://www.linkedin.com/in/sauravkumarsah-dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 transition-colors text-sm sm:text-base break-all">
                              https://www.linkedin.com/in/sauravkumarsah-dev/
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
            </div>
          </section>

          {/* Footer */}
                <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-8 mt-12">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/20 rounded-2xl p-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
              By using BlogAxis, you acknowledge that you have read and understood these Terms and Conditions.
            </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Thank you for being part of our community! 🚀
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

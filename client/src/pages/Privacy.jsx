import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';

export default function Privacy() {
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState('');

  // Table of contents for desktop
  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'information-collect', title: 'Information We Collect' },
    { id: 'how-we-use', title: 'How We Use Your Information' },
    { id: 'information-sharing', title: 'Information Sharing' },
    { id: 'data-security', title: 'Data Security' },
    { id: 'your-rights', title: 'Your Rights and Choices' },
    { id: 'cookies', title: 'Cookies and Tracking' },
    { id: 'third-party', title: 'Third-Party Services' },
    { id: 'children-privacy', title: 'Children\'s Privacy' },
    { id: 'changes', title: 'Changes to Privacy Policy' },
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-full mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-cyan-800 dark:from-white dark:via-indigo-200 dark:to-cyan-200 bg-clip-text text-transparent mb-4">
            Privacy Policy
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
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
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
                <section id="introduction" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">1</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              Introduction
                        <svg className="w-6 h-6 ml-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
            </h2>
                      <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border-l-4 border-indigo-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              At BlogAxis, we are committed to protecting your privacy and ensuring the security of your 
              personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard 
              your information when you use our platform.
            </p>
                      </div>
                    </div>
                  </div>
          </section>

          {/* Information We Collect */}
                <section id="information-collect" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">2</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        Information We Collect
                        <svg className="w-6 h-6 ml-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
            </h2>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border-l-4 border-blue-500">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                Personal Information
              </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                When you create an account, we collect:
              </p>
                            <div className="grid gap-3">
                              {[
                                "Name (first and last name)",
                                "Email address",
                                "Username",
                                "Date of birth",
                                "Profile information (bio, location, additional info)",
                                "Profile picture (if uploaded)"
                              ].map((item, index) => (
                                <div key={index} className="flex items-start space-x-3 bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                Content Information
              </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We store the content you create and share:
              </p>
                            <div className="grid gap-3">
                              {[
                                "Blog posts and articles",
                                "Comments and replies",
                                "Images and media files",
                                "Document uploads"
                              ].map((item, index) => (
                                <div key={index} className="flex items-start space-x-3 bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                Usage Information
              </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We automatically collect certain information about your use of our service:
              </p>
                            <div className="grid gap-3">
                              {[
                                "IP address and device information",
                                "Browser type and version",
                                "Pages visited and time spent",
                                "Interactions with content (likes, comments, follows)",
                                "Search queries"
                              ].map((item, index) => (
                                <div key={index} className="flex items-start space-x-3 bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
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
                    </div>
            </div>
          </section>

          {/* How We Use Information */}
                <section id="how-we-use" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">3</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        How We Use Your Information
                        <svg className="w-6 h-6 ml-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
            </h2>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border-l-4 border-green-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
                          We use the information we collect for the following purposes:
                        </p>
                        <div className="grid gap-3">
                          {[
                            "Service Operation: To provide, maintain, and improve our blogging platform",
                            "User Experience: To personalize content and enhance user interactions",
                            "Communication: To send notifications, updates, and respond to inquiries",
                            "Security: To protect against fraud, abuse, and unauthorized access",
                            "Analytics: To understand usage patterns and improve our services",
                            "Legal Compliance: To comply with applicable laws and regulations"
                          ].map((item, index) => (
                            <div key={index} className="flex items-start space-x-3 bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-green-200 dark:border-green-700">
                              <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-0.5">
                                <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
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

          {/* Information Sharing */}
                <section id="information-sharing" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">4</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        Information Sharing and Disclosure
                        <svg className="w-6 h-6 ml-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
            </h2>
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border-l-4 border-orange-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
                We do not sell, trade, or rent your personal information to third parties. We may share 
                your information only in the following circumstances:
              </p>
                        <div className="grid gap-3">
                          {[
                            "Public Content: Your posts, comments, and profile information are visible to other users",
                            "Service Providers: We may share data with trusted third-party services that help us operate our platform",
                            "Legal Requirements: We may disclose information if required by law or to protect our rights",
                            "Safety and Security: We may share information to prevent fraud, abuse, or illegal activities",
                            "Business Transfers: In case of merger or acquisition, user data may be transferred"
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

          {/* Data Security */}
                <section id="data-security" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">5</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        Data Security
                        <svg className="w-6 h-6 ml-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
            </h2>
                      <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-l-4 border-red-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
              We implement appropriate security measures to protect your personal information:
            </p>
                        <div className="grid gap-3 mb-6">
                          {[
                            "Encryption of data in transit and at rest",
                            "Secure password hashing and storage",
                            "Regular security audits and updates",
                            "Access controls and authentication",
                            "Secure cloud infrastructure"
                          ].map((item, index) => (
                            <div key={index} className="flex items-start space-x-3 bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-red-200 dark:border-red-700">
                              <div className="flex-shrink-0 w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mt-0.5">
                                <svg className="w-3 h-3 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</p>
                            </div>
                          ))}
                        </div>
                        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-red-200 dark:border-red-700">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              However, no method of transmission over the internet is 100% secure. While we strive to 
              protect your information, we cannot guarantee absolute security.
            </p>
                        </div>
                      </div>
                    </div>
                  </div>
          </section>

          {/* Your Rights */}
                <section id="your-rights" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">6</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        Your Rights and Choices
                        <svg className="w-6 h-6 ml-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
            </h2>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-l-4 border-purple-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
              You have the following rights regarding your personal information:
            </p>
                        <div className="grid gap-3">
                          {[
                            "Access: View and download your personal data",
                            "Update: Modify your profile and account information",
                            "Delete: Remove your account and associated data",
                            "Portability: Export your content and data",
                            "Restriction: Limit how we process your information",
                            "Objection: Opt out of certain data processing activities"
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

          {/* Cookies */}
                <section id="cookies" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">7</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        Cookies and Tracking
                        <svg className="w-6 h-6 ml-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
            </h2>
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 border-l-4 border-yellow-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
              We use cookies and similar technologies to:
            </p>
                        <div className="grid gap-3 mb-6">
                          {[
                            "Remember your login status and preferences",
                            "Analyze how you use our platform",
                            "Improve our service and user experience",
                            "Provide personalized content and features"
                          ].map((item, index) => (
                            <div key={index} className="flex items-start space-x-3 bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-yellow-200 dark:border-yellow-700">
                              <div className="flex-shrink-0 w-6 h-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mt-0.5">
                                <svg className="w-3 h-3 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</p>
                            </div>
                          ))}
                        </div>
                        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-yellow-200 dark:border-yellow-700">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              You can control cookie settings through your browser, but disabling cookies may affect 
              the functionality of our platform.
            </p>
                        </div>
                      </div>
                    </div>
                  </div>
          </section>

          {/* Third-Party Services */}
                <section id="third-party" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">8</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        Third-Party Services
                        <svg className="w-6 h-6 ml-3 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
            </h2>
                      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border-l-4 border-teal-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
              Our platform integrates with third-party services:
            </p>
                        <div className="grid gap-3 mb-6">
                          {[
                            "Google OAuth: For social login functionality",
                            "Cloudinary: For image and media storage",
                            "MongoDB Atlas: For secure data storage"
                          ].map((item, index) => (
                            <div key={index} className="flex items-start space-x-3 bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-teal-200 dark:border-teal-700">
                              <div className="flex-shrink-0 w-6 h-6 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mt-0.5">
                                <svg className="w-3 h-3 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</p>
                            </div>
                          ))}
                        </div>
                        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-teal-200 dark:border-teal-700">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              These services have their own privacy policies. We encourage you to review them.
            </p>
                        </div>
                      </div>
                    </div>
                  </div>
          </section>

          {/* Children's Privacy */}
                <section id="children-privacy" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">9</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        Children's Privacy
                        <svg className="w-6 h-6 ml-3 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
            </h2>
                      <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl p-6 border-l-4 border-pink-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              Our service is not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13. If you are a parent or guardian 
              and believe your child has provided us with personal information, please contact us 
              so we can delete such information.
            </p>
                      </div>
                    </div>
                  </div>
          </section>

          {/* Changes to Privacy Policy */}
                <section id="changes" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">10</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        Changes to This Privacy Policy
                        <svg className="w-6 h-6 ml-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
            </h2>
                      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-6 border-l-4 border-indigo-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date. 
              We encourage you to review this Privacy Policy periodically for any changes.
            </p>
                      </div>
                    </div>
                  </div>
          </section>

          {/* Contact Information */}
                <section id="contact" className="scroll-mt-24">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs sm:text-sm">11</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        Contact Us
                        <svg className="w-6 h-6 ml-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
            </h2>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-l-4 border-purple-500">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
                        <div className="grid gap-3 sm:gap-4">
                          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-purple-200 dark:border-purple-700">
                            <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Email</span>
                            </div>
                            <a href="mailto:sauravshubham903@gmail.com" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 transition-colors text-sm sm:text-base break-all">
                              sauravshubham903@gmail.com
                            </a>
                          </div>
                          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-purple-200 dark:border-purple-700">
                            <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                              </svg>
                              <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Website</span>
                            </div>
                            <a href="https://blog-axis.vercel.app" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 transition-colors text-sm sm:text-base break-all">
                              https://blog-axis.vercel.app
                            </a>
                          </div>
                          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-purple-200 dark:border-purple-700">
                            <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                              </svg>
                              <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">GitHub</span>
                            </div>
                            <a href="https://github.com/saurav-kumar-sah-dev" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 transition-colors text-sm sm:text-base break-all">
                              https://github.com/saurav-kumar-sah-dev
                            </a>
                          </div>
                          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-purple-200 dark:border-purple-700">
                            <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                              <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">LinkedIn</span>
                            </div>
                            <a href="https://www.linkedin.com/in/sauravkumarsah-dev/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 transition-colors text-sm sm:text-base break-all">
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
                  <div className="bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-gray-800/50 dark:to-indigo-900/20 rounded-2xl p-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
              This Privacy Policy is effective as of the date listed above and will remain in effect 
              except with respect to any changes in its provisions in the future.
            </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Your privacy matters to us! 🔒
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

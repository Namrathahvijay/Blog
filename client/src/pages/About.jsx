import { useTheme } from '../context/ThemeContext';

export default function About() {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B5CF6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-fuchsia-600 rounded-full mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-violet-800 to-fuchsia-800 dark:from-white dark:via-violet-200 dark:to-fuchsia-200 bg-clip-text text-transparent mb-4">
            About BlogAxis
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Empowering voices, connecting communities, and sharing stories that matter.
          </p>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 mb-8 sm:mb-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Welcome to the Future of Blogging
            </h2>
            <p className="text-lg sm:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              BlogAxis is more than just a blogging platform - it's a community where ideas flourish, 
              stories are shared, and connections are made. Join thousands of writers, thinkers, and 
              creators who are shaping the digital conversation.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="p-6 sm:p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h3>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border-l-4 border-blue-500">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  To democratize content creation by providing a powerful, user-friendly platform that 
                  empowers individuals to share their stories, expertise, and perspectives with the world. 
                  We believe everyone has a voice worth hearing.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="p-6 sm:p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Our Vision</h3>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-l-4 border-purple-500">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  To become the world's leading platform for authentic storytelling and knowledge sharing, 
                  where diverse voices come together to create meaningful conversations and drive positive change.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden mb-8 sm:mb-12">
          <div className="p-8 sm:p-12">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-fuchsia-600 rounded-full mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                What Makes BlogAxis Special?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover the features that set us apart from other blogging platforms
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: "✨",
                  title: "Rich Content Types",
                  description: "Support for text, images, videos, documents, and articles - express yourself in any format.",
                  color: "from-green-500 to-emerald-600",
                  bgColor: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
                  borderColor: "border-green-200 dark:border-green-700"
                },
                {
                  icon: "👥",
                  title: "Community Features",
                  description: "Follow other users, engage with comments, and build meaningful connections.",
                  color: "from-blue-500 to-blue-600",
                  bgColor: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
                  borderColor: "border-blue-200 dark:border-blue-700"
                },
                {
                  icon: "🔒",
                  title: "Privacy & Security",
                  description: "Your data is protected with industry-standard security measures and privacy controls.",
                  color: "from-purple-500 to-purple-600",
                  bgColor: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
                  borderColor: "border-purple-200 dark:border-purple-700"
                },
                {
                  icon: "📱",
                  title: "Responsive Design",
                  description: "Beautiful, responsive interface that works perfectly on all devices and screen sizes.",
                  color: "from-yellow-500 to-orange-600",
                  bgColor: "from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
                  borderColor: "border-yellow-200 dark:border-yellow-700"
                },
                {
                  icon: "🌙",
                  title: "Dark Mode",
                  description: "Comfortable reading experience with built-in dark mode and theme customization.",
                  color: "from-red-500 to-pink-600",
                  bgColor: "from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20",
                  borderColor: "border-red-200 dark:border-red-700"
                },
                {
                  icon: "⚡",
                  title: "Fast Performance",
                  description: "Optimized for speed with modern technologies and efficient content delivery.",
                  color: "from-indigo-500 to-indigo-600",
                  bgColor: "from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20",
                  borderColor: "border-indigo-200 dark:border-indigo-700"
                }
              ].map((feature, index) => (
                <div key={index} className="group">
                  <div className={`bg-gradient-to-r ${feature.bgColor} rounded-2xl p-6 border ${feature.borderColor} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-2xl">{feature.icon}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">{feature.title}</h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden mb-8 sm:mb-12">
          <div className="p-8 sm:p-12">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-fuchsia-600 rounded-full mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                The journey behind BlogAxis and the vision that drives us forward
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl p-8 border-l-4 border-violet-500">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    BlogAxis was born from a simple observation: the internet is full of amazing stories, 
                    insights, and knowledge, but finding a platform that truly supports creators and 
                    fosters meaningful conversations can be challenging.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border-l-4 border-blue-500">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    As a MERN Stack Developer and Final-Year B.Tech CSE student, I (Saurav Kumar Sah) 
                    built BlogAxis with a shared vision: to create a blogging platform that puts users first. 
                    I wanted to build something that was not only powerful and feature-rich, but also 
                    intuitive, secure, and genuinely supportive of the creative process.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border-l-4 border-green-500">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    Today, BlogAxis serves users worldwide, from individual bloggers sharing their personal 
                    stories to professionals building their thought leadership. The platform is constantly 
                    evolving based on user feedback and the changing needs of the digital content landscape.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-8 border-l-4 border-orange-500">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    I believe that everyone has something valuable to share, and I'm committed to 
                    providing the tools and community support needed to make those voices heard. 
                    This project showcases my skills in React, Node.js, Express, MongoDB, and modern web development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden mb-8 sm:mb-12">
          <div className="p-8 sm:p-12">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-fuchsia-600 rounded-full mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Built with Modern Technology
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Powered by cutting-edge technologies for optimal performance and user experience
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
              {[
                { letter: "R", name: "React", desc: "Frontend Framework", color: "from-blue-500 to-blue-600", bgColor: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20" },
                { letter: "N", name: "Node.js", desc: "Backend Runtime", color: "from-green-500 to-green-600", bgColor: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20" },
                { letter: "M", name: "MongoDB", desc: "Database", color: "from-emerald-500 to-emerald-600", bgColor: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20" },
                { letter: "E", name: "Express", desc: "Web Framework", color: "from-purple-500 to-purple-600", bgColor: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20" }
              ].map((tech, index) => (
                <div key={index} className="group">
                  <div className={`bg-gradient-to-r ${tech.bgColor} rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${tech.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-2xl font-bold text-white">{tech.letter}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">{tech.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{tech.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/20 rounded-2xl p-8 text-center">
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                Plus <span className="font-semibold text-violet-600 dark:text-violet-400">Tailwind CSS</span>, 
                <span className="font-semibold text-blue-600 dark:text-blue-400"> Cloudinary</span>, 
                <span className="font-semibold text-green-600 dark:text-green-400"> JWT Authentication</span>, 
                and many other modern technologies that ensure a fast, secure, and scalable platform.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl sm:rounded-3xl shadow-2xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg sm:text-xl opacity-90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of creators who are already sharing their stories on BlogAxis. 
              Your voice matters, and we're here to help you share it with the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
              <a
                href="/register"
                className="bg-white text-violet-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Get Started Free
                </div>
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-violet-600 transition-all duration-200 backdrop-blur-sm"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Us
                </div>
              </a>
            </div>
            
            <div className="border-t border-white/20 pt-6 sm:pt-8">
              <p className="text-white/80 mb-4 sm:mb-6 text-base sm:text-lg">Connect with the developer:</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <a
                  href="https://github.com/saurav-kumar-sah-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </div>
                </a>
                <a
                  href="https://www.linkedin.com/in/sauravkumarsah-dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </div>
                </a>
                <a
                  href="mailto:sauravshubham903@gmail.com"
                  className="bg-white/10 backdrop-blur-sm text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

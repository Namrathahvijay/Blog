import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className="relative overflow-hidden w-full">
      {/* Enhanced Background with multiple gradients */}
      <div 
        className="absolute inset-0"
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, #0e7490 0%, #0891b2 25%, #14b8a6 50%, #0d9488 75%, #0f766e 100%)'
            : 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 25%, #22d3ee 50%, #2dd4bf 75%, #5eead4 100%)'
        }}
      />
      
      {/* Animated decorative elements */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        <div className="absolute top-4 left-4 w-16 h-16 rounded-full opacity-30 animate-pulse" style={{ background: 'rgba(255,255,255,0.2)' }} />
        <div className="absolute top-8 right-8 w-12 h-12 rounded-full opacity-25 animate-bounce" style={{ background: 'rgba(255,255,255,0.15)' }} />
        <div className="absolute bottom-8 left-8 w-20 h-20 rounded-full opacity-20 animate-pulse" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <div className="absolute bottom-4 right-4 w-14 h-14 rounded-full opacity-30 animate-bounce" style={{ background: 'rgba(255,255,255,0.2)' }} />
        
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">
            {/* Brand section */}
            <div className="lg:col-span-2 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <div className="relative">
                  <span className="text-3xl animate-pulse">✨</span>
                  <div className="absolute inset-0 text-3xl animate-ping opacity-20">✨</div>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                  BlogAxis
                </h3>
              </div>
              <p className="text-base leading-relaxed mb-6 text-white/90 max-w-md mx-auto lg:mx-0">
                Share your stories, connect with readers, and build your community. 
                <br className="hidden sm:block" />
                Built with ❤️ by{' '}
                <a 
                  href="https://github.com/namratha" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-200 hover:text-white transition-colors duration-300 font-semibold hover:underline"
                >
                  Namrathahvijay
                </a>
              </p>
              
              {/* Tech stack */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-white/80 border border-white/20">
                  ⚛️ React
                </span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-white/80 border border-white/20">
                  🟢 Node.js
                </span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-white/80 border border-white/20">
                  🍃 MongoDB
                </span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-white/80 border border-white/20">
                  🎨 Tailwind
                </span>
              </div>
            </div>

            {/* Quick links */}
            <div className="text-center lg:text-left">
              <h4 className="text-lg font-bold mb-4 text-white flex items-center justify-center lg:justify-start gap-2">
                <span className="text-xl">🔗</span>
                Quick Links
              </h4>
              <div className="space-y-3">
                <Link 
                  to="/about" 
                  className="block text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all duration-300 group"
                >
                  <span className="group-hover:text-cyan-200 transition-colors">📖</span> About Us
                </Link>
                <Link 
                  to="/contact" 
                  className="block text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all duration-300 group"
                >
                  <span className="group-hover:text-teal-200 transition-colors">📧</span> Contact
                </Link>
                <Link 
                  to="/terms" 
                  className="block text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all duration-300 group"
                >
                  <span className="group-hover:text-cyan-200 transition-colors">📋</span> Terms & Conditions
                </Link>
                <Link 
                  to="/privacy" 
                  className="block text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all duration-300 group"
                >
                  <span className="group-hover:text-teal-200 transition-colors">🔒</span> Privacy Policy
                </Link>
              </div>
            </div>

            {/* Social links */}
            <div className="text-center lg:text-left">
              <h4 className="text-lg font-bold mb-4 text-white flex items-center justify-center lg:justify-start gap-2">
                <span className="text-xl">🌐</span>
                Connect
              </h4>
              <div className="flex justify-center lg:justify-start gap-3 flex-wrap">
                <a 
                  href="https://github.com/Namrathahvijay" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group p-3 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-110 hover:shadow-lg"
                  title="GitHub"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300">📘</span>
                </a>
                <a 
                  href="https://www.linkedin.com/in/sauravkumarsah-dev/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group p-3 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-110 hover:shadow-lg"
                  title="LinkedIn"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300">💼</span>
                </a>
                <a 
                  href="namrathahvijay9740@gmail.com" 
                  className="group p-3 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-110 hover:shadow-lg"
                  title="Email"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300">📧</span>
                </a>
                <a 
                  href="https://saurav-portfolio-dun.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group p-3 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-110 hover:shadow-lg"
                  title="Portfolio"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300">🌐</span>
                </a>
              </div>
              
              {/* Contact info */}
              <div className="mt-4 text-sm text-white/70">
                <p className="mb-1">📧 namrathahvijay9740@gmail.com</p>
                <p className="text-xs text-white/60">Available for opportunities</p>
              </div>
            </div>
          </div>

          {/* Enhanced bottom bar */}
          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="text-center lg:text-left">
                <p className="text-sm text-white/80 mb-2">
                  © {new Date().getFullYear()} BlogAxis. Made with ❤️ by{' '}
                  <a 
                    href="https://github.com/saurav-kumar-sah-dev" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-200 hover:text-white transition-colors duration-300 font-semibold hover:underline"
                  >
                    Namrathahvijay
                  </a>{' '}
                  for storytellers.
                </p>
                <p className="text-xs text-white/60">
                  MERN Stack Developer
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span className="text-lg animate-pulse">🚀</span>
                  <span>Powered by MERN Stack</span>
                </div>
                <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span className="text-lg">⚡</span>
                  <span>Lightning Fast</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}



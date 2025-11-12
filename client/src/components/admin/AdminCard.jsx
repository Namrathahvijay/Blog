import { Link } from 'react-router-dom';

export default function AdminCard({ 
  title, 
  description, 
  icon, 
  href, 
  onClick, 
  className = '',
  children 
}) {
  const CardContent = () => (
    <div className={`
      group relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl 
      hover:shadow-3xl transition-all duration-300 ease-out overflow-hidden 
      border border-white/20 dark:border-gray-700/50 hover:scale-[1.02] hover:-translate-y-1 
      will-change-transform cursor-pointer h-full
      ${className}
    `}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6 sm:p-8 h-full flex flex-col">
        {/* Icon */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <span className="text-2xl sm:text-3xl">{icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
              {title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {description}
            </p>
          </div>
        </div>

        {/* Content */}
        {children && (
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        )}

        {/* Arrow indicator */}
        <div className="mt-4 flex justify-end">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="block h-full">
        <CardContent />
      </Link>
    );
  }

  if (onClick) {
    return (
      <div onClick={onClick} className="block h-full">
        <CardContent />
      </div>
    );
  }

  return <CardContent />;
}

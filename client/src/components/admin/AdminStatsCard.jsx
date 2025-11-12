export default function AdminStatsCard({ 
  title, 
  value, 
  icon, 
  color = 'blue',
  trend,
  description,
  className = ''
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600',
    pink: 'from-pink-500 to-pink-600',
    emerald: 'from-emerald-500 to-emerald-600'
  };

  const bgColorClasses = {
    blue: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
    green: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
    yellow: 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20',
    red: 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
    purple: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
    indigo: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20',
    pink: 'from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20',
    emerald: 'from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20'
  };

  return (
    <div className={`
      bg-gradient-to-br ${bgColorClasses[color]} 
      backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 
      p-4 sm:p-6 hover:shadow-3xl transition-all duration-300 ease-out hover:scale-[1.02] 
      ${className}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400 truncate">
            {title}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {trend && (
              <span className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${
                trend > 0 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                  : trend < 0 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
              }`}>
                {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend)}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
              {description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 ml-4">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${colorClasses[color]} rounded-2xl flex items-center justify-center shadow-lg`}>
            <span className="text-xl sm:text-2xl">{icon}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

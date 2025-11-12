export default function Pagination({ page, total, limit, onPrev, onNext }) {
  const hasPrev = page > 1;
  const hasNext = page * limit < total;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6">
      {/* Previous Button */}
      <button 
        disabled={!hasPrev} 
        onClick={onPrev}
        className={`group flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ease-out ${
          hasPrev 
            ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 shadow-lg hover:shadow-xl hover:scale-[1.02]' 
            : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Previous</span>
      </button>

      {/* Page Info */}
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl px-6 py-3 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">Page {page}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">of {totalPages}</div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Posts</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">{total}</div>
        </div>
      </div>

      {/* Next Button */}
      <button 
        disabled={!hasNext} 
        onClick={onNext}
        className={`group flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ease-out ${
          hasNext 
            ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 shadow-lg hover:shadow-xl hover:scale-[1.02]' 
            : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
        }`}
      >
        <span>Next</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
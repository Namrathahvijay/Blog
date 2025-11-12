import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const LIMIT = 10;

export default function MyPosts() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // '', 'draft', 'published', 'scheduled'
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ 
        page, 
        limit: LIMIT, 
        ...(search ? { search } : {}),
        ...(statusFilter ? { status: statusFilter } : {})
      });
      const res = await api.get(`/posts/my?${params.toString()}`);
      const data = await res.json();
      setPosts(data.data || []);
      setTotal(data.total || 0);
    } catch (e) {
      if (e.message?.includes('401')) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login', { replace: true, state: { from: { pathname: '/my-posts' } } });
        return;
      }
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, logout, navigate]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  useEffect(() => {
    const id = setTimeout(() => { setPage(1); loadPosts(); }, 350);
    return () => clearTimeout(id);
  }, [search, statusFilter]); // eslint-disable-line

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
      const res = await api.del(`/posts/${id}`);
      if (res.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login', { replace: true, state: { from: { pathname: '/my-posts' } } });
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');

      toast.success('Post deleted');
      setPosts((cur) => cur.filter((p) => p._id !== id));
      setTotal((t) => (t > 0 ? t - 1 : 0));
    } catch (e) {
      toast.error(e.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft': return '📝';
      case 'published': return '✅';
      case 'scheduled': return '⏰';
      default: return '📄';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Enhanced Background with animated elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs with different sizes and animations */}
        <div className="absolute top-20 left-4 sm:left-10 w-16 h-16 sm:w-32 sm:h-32 rounded-full opacity-10 animate-pulse" style={{ background: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)' }} />
        <div className="absolute top-40 right-4 sm:right-20 w-12 h-12 sm:w-24 sm:h-24 rounded-full opacity-15 animate-bounce" style={{ background: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)' }} />
        <div className="absolute bottom-40 left-4 sm:left-20 w-14 h-14 sm:w-28 sm:h-28 rounded-full opacity-10 animate-pulse" style={{ background: isDark ? 'rgba(236, 72, 153, 0.3)' : 'rgba(236, 72, 153, 0.2)' }} />
        <div className="absolute bottom-20 right-4 sm:right-10 w-10 h-10 sm:w-20 sm:h-20 rounded-full opacity-15 animate-bounce" style={{ background: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)' }} />
        
        {/* Additional mobile-optimized floating elements */}
        <div className="absolute top-1/3 left-1/4 w-8 h-8 sm:w-16 sm:h-16 rounded-full opacity-5 animate-ping" style={{ background: isDark ? 'rgba(255, 193, 7, 0.3)' : 'rgba(255, 193, 7, 0.2)' }} />
        <div className="absolute top-2/3 right-1/3 w-6 h-6 sm:w-12 sm:h-12 rounded-full opacity-8 animate-pulse" style={{ background: isDark ? 'rgba(220, 38, 127, 0.3)' : 'rgba(220, 38, 127, 0.2)' }} />
      </div>

      <div className="relative z-10 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="relative">
                <span className="text-3xl sm:text-4xl lg:text-5xl animate-pulse">📚</span>
                <div className="absolute inset-0 text-3xl sm:text-4xl lg:text-5xl animate-ping opacity-20">📚</div>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                My Posts
              </h1>
              <div className="relative">
                <span className="text-3xl sm:text-4xl lg:text-5xl animate-pulse">📚</span>
                <div className="absolute inset-0 text-3xl sm:text-4xl lg:text-5xl animate-ping opacity-20">📚</div>
              </div>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Manage your posts, drafts, and scheduled content. Create, edit, and organize your content with ease.
            </p>
          </div>

          {/* Enhanced Controls Section */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col gap-4 sm:gap-6">
                {/* Top Row: Search and Stats */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  {/* Search Bar */}
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search your posts..."
                        className="w-full pl-9 sm:pl-10 pr-10 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl sm:rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      />
                      {search && (
                        <button
                          onClick={() => setSearch('')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Stats Badge */}
                  <div className="flex-shrink-0">
                    <div className="px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl sm:rounded-2xl shadow-lg">
                      <span className="text-xs sm:text-sm font-semibold">
                        📊 {total} {total === 1 ? 'Post' : 'Posts'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Filter and Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  {/* Status Filter */}
                  <div className="flex-1 sm:flex-initial">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl sm:rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    >
                      <option value="">All Posts</option>
                      <option value="draft">📝 Drafts</option>
                      <option value="published">✅ Published</option>
                      <option value="scheduled">⏰ Scheduled</option>
                    </select>
                  </div>

                  {/* New Post Button */}
                  <div className="flex-shrink-0">
                    <Link
                      to="/compose"
                      className="inline-flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl sm:rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
                    >
                      <span className="mr-2">✍️</span>
                      <span className="hidden sm:inline">New Post</span>
                      <span className="sm:hidden">Create</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Content Section */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="relative mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <div className="text-center px-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Loading Your Posts</h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Please wait while we fetch your content...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Enhanced Posts Grid - Better laptop layout */}
              <div className="w-full overflow-visible grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 px-4 mb-8 sm:mb-12">
                {posts.map((p) => (
                  <div key={p._id} className="transform hover:scale-105 transition-all duration-300">
                    <div className="relative">
                      <PostCard post={p} onDelete={handleDelete} />
                      {/* Enhanced Status Badge - positioned to avoid overlapping */}
                      <div className="absolute top-3 right-3 z-10 pointer-events-none">
                        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border border-white/20 shadow-lg ${getStatusColor(p.status)}`}>
                          <span className="text-sm">{getStatusIcon(p.status)}</span>
                          <span className="capitalize hidden lg:inline">{p.status || 'published'}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Empty State */}
              {posts.length === 0 && (
                <div className="text-center py-12 sm:py-16">
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 sm:p-8 lg:p-12 max-w-2xl mx-auto">
                    {/* Animated Icon */}
                    <div className="relative mb-6">
                      <div className="text-4xl sm:text-6xl animate-bounce">📝</div>
                      <div className="absolute inset-0 text-4xl sm:text-6xl animate-pulse opacity-30">✨</div>
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
                      {search || statusFilter ? 'No Posts Found' : 'Your Content Hub is Empty'}
                    </h3>
                    
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 leading-relaxed px-4">
                      {search || statusFilter 
                        ? `We couldn't find any posts matching your criteria. Try adjusting your search or filter.`
                        : 'Ready to share your thoughts with the world? Create your first post and start building your audience!'
                      }
                    </p>

                    {/* Quick Tips for New Users */}
                    {!search && !statusFilter && (
                      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Quick Tips:</h4>
                        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 text-left">
                          <li>• Write about topics you're passionate about</li>
                          <li>• Use tags to help others discover your content</li>
                          <li>• Save drafts to work on posts over time</li>
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                      {search || statusFilter ? (
                        <button
                          onClick={() => { setSearch(''); setStatusFilter(''); }}
                          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl sm:rounded-2xl font-semibold hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
                        >
                          🔄 Clear Filters
                        </button>
                      ) : (
                        <>
                          <Link
                            to="/compose"
                            className="inline-block px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl sm:rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
                          >
                            ✍️ Create Your First Post
                          </Link>
                          <Link
                            to="/"
                            className="inline-block px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl sm:rounded-2xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
                          >
                            🔍 Explore Posts
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Pagination */}
              {posts.length > 0 && (
                <div className="flex justify-center px-4">
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-3 sm:p-4">
                    <Pagination
                      page={page}
                      total={total}
                      limit={LIMIT}
                      onPrev={() => setPage((p) => p - 1)}
                      onNext={() => setPage((p) => p + 1)}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client';
import SearchBar from '../components/SearchBar';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const LIMIT = 100;

export default function Home() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT, ...(search ? { search } : {}) });
      const res = await api.get(`/posts?${params.toString()}`);
      const data = await res.json();
      setPosts(data.data || []);
      setTotal(data.total || 0);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  useEffect(() => {
    const id = setTimeout(() => { setPage(1); loadPosts(); }, 350);
    return () => clearTimeout(id);
  }, [search]); // eslint-disable-line

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
      const res = await api.del(`/posts/${id}`);
      if (res.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login', { replace: true, state: { from: { pathname: '/' } } });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Enhanced Background with animated elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-10 animate-pulse" style={{ background: isDark ? 'rgba(6, 182, 212, 0.3)' : 'rgba(6, 182, 212, 0.2)' }} />
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full opacity-15 animate-bounce" style={{ background: isDark ? 'rgba(20, 184, 166, 0.3)' : 'rgba(20, 184, 166, 0.2)' }} />
        <div className="absolute bottom-40 left-20 w-28 h-28 rounded-full opacity-10 animate-pulse" style={{ background: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)' }} />
        <div className="absolute bottom-20 right-10 w-20 h-20 rounded-full opacity-15 animate-bounce" style={{ background: isDark ? 'rgba(6, 182, 212, 0.3)' : 'rgba(6, 182, 212, 0.2)' }} />
      </div>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="relative">
                <span className="text-4xl sm:text-5xl animate-pulse">✨</span>
                <div className="absolute inset-0 text-4xl sm:text-5xl animate-ping opacity-20">✨</div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                Welcome to BlogAxis
              </h1>
              <div className="relative">
                <span className="text-4xl sm:text-5xl animate-pulse">✨</span>
                <div className="absolute inset-0 text-4xl sm:text-5xl animate-ping opacity-20">✨</div>
              </div>
            </div>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover amazing stories, share your thoughts, and connect with a vibrant community of writers and readers.
            </p>
          </div>

          {/* Enhanced Search Section */}
          <div className="mb-8">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="flex-1 w-full">
                  <SearchBar value={search} onChange={setSearch} />
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-2xl shadow-lg">
                    <span className="text-sm font-semibold">
                      📊 {total} {total === 1 ? 'Post' : 'Posts'}
                    </span>
                  </div>
                  {search && (
                    <div className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl shadow-lg">
                      <span className="text-sm font-semibold">
                        🔍 Searching: "{search}"
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Content Section */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-cyan-200 dark:border-cyan-800 border-t-cyan-600 dark:border-t-cyan-400 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-teal-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Loading Amazing Content</h3>
                <p className="text-gray-500 dark:text-gray-400">Please wait while we fetch the latest posts...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Enhanced Posts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
                {posts.map((p) => (
                  <div key={p._id} className="transform hover:scale-105 transition-all duration-300">
                    <PostCard post={p} onDelete={handleDelete} />
                  </div>
                ))}
              </div>

              {/* Enhanced Empty State */}
              {posts.length === 0 && (
                <div className="text-center py-16">
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 sm:p-12 max-w-2xl mx-auto">
                    <div className="text-6xl mb-6">📝</div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                      {search ? 'No Posts Found' : 'No Posts Yet'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {search 
                        ? `We couldn't find any posts matching "${search}". Try adjusting your search terms or browse all posts.`
                        : 'Be the first to share your story! Create an account and start writing amazing content.'
                      }
                    </p>
                    {search ? (
                      <button
                        onClick={() => setSearch('')}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-2xl font-semibold hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        🔄 Clear Search
                      </button>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {user ? (
                          <button
                            onClick={() => navigate('/compose')}
                            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl font-semibold hover:from-teal-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                          >
                            ✍️ Create Post
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => navigate('/register')}
                              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl font-semibold hover:from-teal-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                              🚀 Get Started
                            </button>
                            <button
                              onClick={() => navigate('/login')}
                              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                              🔑 Sign In
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Enhanced Pagination */}
              {posts.length > 0 && (
                <div className="flex justify-center">
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-4">
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
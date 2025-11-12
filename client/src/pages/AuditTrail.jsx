import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import AdminFilters from '../components/admin/AdminFilters';
import AdminPagination from '../components/admin/AdminPagination';

export default function AuditTrail() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: '',
    targetType: '',
    admin: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    loadAudits();
  }, [filters, pagination.page]);

  const loadAudits = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.action && { action: filters.action }),
        ...(filters.targetType && { targetType: filters.targetType }),
        ...(filters.admin && { admin: filters.admin })
      });

      const response = await api.get(`/admin/audits?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setAudits(data.audits);
        setPagination(data.pagination);
      } else {
        toast.error('Failed to load audit trail');
      }
    } catch (error) {
      toast.error('Failed to load audit trail');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    const icons = {
      report_reviewed: '👀',
      post_hidden: '🙈',
      post_unhidden: '👁️',
      post_deleted: '🗑️',
      user_warned: '⚠️',
      user_suspended: '⏸️',
      user_unsuspended: '▶️',
      user_banned: '🚫',
      user_deleted: '💀',
      comment_deleted: '🗑️',
      content_approved: '✅',
      report_dismissed: '❌'
    };
    return icons[action] || '📝';
  };

  const getActionColor = (action) => {
    const colors = {
      report_reviewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      post_hidden: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      post_unhidden: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      post_deleted: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      user_warned: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      user_suspended: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      user_unsuspended: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      user_banned: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      user_deleted: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      comment_deleted: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      content_approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      report_dismissed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    };
    return colors[action] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  };

  const filterConfig = [
    {
      key: 'action',
      label: 'Action',
      type: 'select',
      value: filters.action,
      options: [
        { value: 'report_reviewed', label: 'Report Reviewed' },
        { value: 'post_hidden', label: 'Post Hidden' },
        { value: 'post_unhidden', label: 'Post Unhidden' },
        { value: 'post_deleted', label: 'Post Deleted' },
        { value: 'user_warned', label: 'User Warned' },
        { value: 'user_suspended', label: 'User Suspended' },
        { value: 'user_unsuspended', label: 'User Unsuspended' },
        { value: 'user_banned', label: 'User Banned' },
        { value: 'user_deleted', label: 'User Deleted' },
        { value: 'comment_deleted', label: 'Comment Deleted' },
        { value: 'content_approved', label: 'Content Approved' },
        { value: 'report_dismissed', label: 'Report Dismissed' }
      ]
    },
    {
      key: 'targetType',
      label: 'Target Type',
      type: 'select',
      value: filters.targetType,
      options: [
        { value: 'post', label: 'Posts' },
        { value: 'user', label: 'Users' },
        { value: 'comment', label: 'Comments' },
        { value: 'report', label: 'Reports' }
      ]
    },
    {
      key: 'admin',
      label: 'Admin',
      type: 'search',
      value: filters.admin,
      placeholder: 'Search by admin name...'
    }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Loading Audit Trail</h3>
                <p className="text-gray-500 dark:text-gray-400">Please wait while we fetch the audit logs...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Enhanced Background with animated elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-10 animate-pulse" style={{ background: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)' }} />
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full opacity-15 animate-bounce" style={{ background: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)' }} />
        <div className="absolute bottom-40 left-20 w-28 h-28 rounded-full opacity-10 animate-pulse" style={{ background: isDark ? 'rgba(236, 72, 153, 0.3)' : 'rgba(236, 72, 153, 0.2)' }} />
        <div className="absolute bottom-20 right-10 w-20 h-20 rounded-full opacity-15 animate-bounce" style={{ background: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)' }} />
      </div>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back to Admin Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/admin')}
              className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 ease-out hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Admin Dashboard</span>
            </button>
          </div>

          {/* Enhanced Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="relative">
                <span className="text-4xl sm:text-5xl animate-pulse">📋</span>
                <div className="absolute inset-0 text-4xl sm:text-5xl animate-ping opacity-20">📋</div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Audit Trail
              </h1>
              <div className="relative">
                <span className="text-4xl sm:text-5xl animate-pulse">📋</span>
                <div className="absolute inset-0 text-4xl sm:text-5xl animate-ping opacity-20">📋</div>
              </div>
            </div>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Track all moderation actions and admin activities with comprehensive audit logging and transparency.
            </p>
          </div>

          {/* Filters */}
          <AdminFilters
            filters={filterConfig}
            onFilterChange={handleFilterChange}
            title="Audit Filters"
          />

          {/* Audit Trail */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-lg">📋</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Audit Log</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Complete history of admin actions and changes</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {audits.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-6">📊</div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Audit Records Found</h3>
                  <p className="text-gray-600 dark:text-gray-400">No audit records match your current filters.</p>
                </div>
              ) : (
                audits.map((audit) => (
                  <div key={audit._id} className="p-4 sm:p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-xl">{getActionIcon(audit.action)}</span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActionColor(audit.action)} self-start`}>
                            {audit.action.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(audit.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm text-gray-900 dark:text-white">
                            <Link 
                              to={`/users/${audit.admin?._id}`} 
                              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {audit.admin?.name || 'Unknown Admin'}
                            </Link>
                            <span className="mx-1">performed action on</span>
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{audit.targetType}</span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {audit.targetType === 'post' && (
                              <Link 
                                to={`/posts/${audit.targetId}`} 
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors duration-200"
                              >
                                <span>📝</span>
                                <span>View Post</span>
                              </Link>
                            )}
                            {audit.targetType === 'user' && (
                              <Link 
                                to={`/users/${audit.targetId}`} 
                                className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors duration-200"
                              >
                                <span>👤</span>
                                <span>View User</span>
                              </Link>
                            )}
                            {audit.targetType === 'report' && (
                              <Link 
                                to={`/moderation`} 
                                className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 text-xs rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors duration-200"
                              >
                                <span>🚩</span>
                                <span>View Reports</span>
                              </Link>
                            )}
                          </div>

                          {audit.reason && (
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Reason:</span> {audit.reason}
                              </div>
                            </div>
                          )}

                          {audit.details && (
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Details:</span> {audit.details}
                              </div>
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                            <span>Target ID: {audit.targetId}</span>
                            <span>IP: {audit.ipAddress}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="p-4 sm:p-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <AdminPagination
                  page={pagination.page}
                  total={pagination.total}
                  limit={pagination.limit}
                  onPrev={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  onNext={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

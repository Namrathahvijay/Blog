import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import AdminStatsCard from '../components/admin/AdminStatsCard';
import AdminFilters from '../components/admin/AdminFilters';
import AdminPagination from '../components/admin/AdminPagination';

export default function Moderation() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    reason: '',
    targetType: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  const [moderationNotes, setModerationNotes] = useState('');
  const [actionTaken, setActionTaken] = useState('none');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const [isHidingPost, setIsHidingPost] = useState(false);

  useEffect(() => {
    loadReports();
    loadStats();
  }, [filters, pagination.page]);

  const loadReports = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.status && { status: filters.status }),
        ...(filters.reason && { reason: filters.reason }),
        ...(filters.targetType && { targetType: filters.targetType })
      });

      const response = await api.get(`/reports?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setReports(data.reports);
        setPagination(data.pagination);
      } else {
        toast.error('Failed to load reports');
      }
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/reports/stats');
      const data = await response.json();
      
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleUpdateReport = async () => {
    if (!selectedReport) return;

    setIsUpdating(true);
    try {
      const response = await api.put(`/reports/${selectedReport._id}`, {
        status: 'resolved',
        moderationNotes,
        actionTaken
      });

      if (response.ok) {
        // If hiding content, also call the admin endpoint to ensure it's hidden
        if (actionTaken === 'hide_content' && selectedReport.reportedPost) {
          try {
            await api.put(`/admin/posts/${selectedReport.reportedPost._id}/hidden`, {
              hidden: true,
              reason: moderationNotes || 'Content hidden due to report'
            });
          } catch (error) {
            console.error('Error hiding post:', error);
          }
        }
        
        toast.success('Report updated successfully');
        setSelectedReport(null);
        setModerationNotes('');
        setActionTaken('none');
        loadReports();
        loadStats();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update report');
      }
    } catch (error) {
      toast.error('Failed to update report');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDismissReport = async (reportId) => {
    setIsDismissing(true);
    try {
      const response = await api.put(`/reports/${reportId}`, {
        status: 'dismissed',
        moderationNotes: 'Report dismissed as invalid',
        actionTaken: 'none'
      });

      if (response.ok) {
        toast.success('Report dismissed');
        loadReports();
        loadStats();
      } else {
        toast.error('Failed to dismiss report');
      }
    } catch (error) {
      toast.error('Failed to dismiss report');
    } finally {
      setIsDismissing(false);
    }
  };

  const handleHidePost = async (postId) => {
    setIsHidingPost(true);
    try {
      await api.put(`/admin/posts/${postId}/hidden`, {
        hidden: true,
        reason: 'Quick hide from moderation dashboard'
      });
      toast.success('Post hidden successfully');
      loadReports();
    } catch (error) {
      toast.error('Failed to hide post');
    } finally {
      setIsHidingPost(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'reviewing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'dismissed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getReasonIcon = (reason) => {
    const icons = {
      spam: '🚫',
      harassment: '😡',
      hate_speech: '💢',
      inappropriate_content: '⚠️',
      fake_news: '📰',
      copyright_violation: '©️',
      violence: '👊',
      nudity: '🔞',
      other: '❓'
    };
    return icons[reason] || '❓';
  };

  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      value: filters.status,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'reviewing', label: 'Reviewing' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'dismissed', label: 'Dismissed' }
      ]
    },
    {
      key: 'reason',
      label: 'Reason',
      type: 'select',
      value: filters.reason,
      options: [
        { value: 'spam', label: 'Spam' },
        { value: 'harassment', label: 'Harassment' },
        { value: 'hate_speech', label: 'Hate Speech' },
        { value: 'inappropriate_content', label: 'Inappropriate Content' },
        { value: 'fake_news', label: 'Fake News' },
        { value: 'copyright_violation', label: 'Copyright Violation' },
        { value: 'violence', label: 'Violence' },
        { value: 'nudity', label: 'Nudity' },
        { value: 'other', label: 'Other' }
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
        { value: 'comment', label: 'Comments' }
      ]
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
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Loading Moderation Dashboard</h3>
                <p className="text-gray-500 dark:text-gray-400">Please wait while we fetch the reports...</p>
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
              className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-2xl font-semibold hover:from-cyan-600 hover:to-teal-600 transition-all duration-200 ease-out hover:scale-[1.02] shadow-lg hover:shadow-xl"
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
                <span className="text-4xl sm:text-5xl animate-pulse">🚩</span>
                <div className="absolute inset-0 text-4xl sm:text-5xl animate-ping opacity-20">🚩</div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                Moderation Dashboard
              </h1>
              <div className="relative">
                <span className="text-4xl sm:text-5xl animate-pulse">🚩</span>
                <div className="absolute inset-0 text-4xl sm:text-5xl animate-ping opacity-20">🚩</div>
              </div>
            </div>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Review reports, moderate content, and maintain platform safety with comprehensive moderation tools.
            </p>
          </div>

          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <AdminStatsCard
                title="Pending Reports"
                value={stats.statusStats?.find(s => s._id === 'pending')?.count || 0}
                icon="⏳"
                color="yellow"
                description="Awaiting review"
              />
              <AdminStatsCard
                title="Under Review"
                value={stats.statusStats?.find(s => s._id === 'reviewing')?.count || 0}
                icon="👀"
                color="blue"
                description="Currently reviewing"
              />
              <AdminStatsCard
                title="Resolved"
                value={stats.statusStats?.find(s => s._id === 'resolved')?.count || 0}
                icon="✅"
                color="green"
                description="Successfully resolved"
              />
              <AdminStatsCard
                title="This Week"
                value={stats.recentReports || 0}
                icon="📊"
                color="purple"
                description="Recent activity"
              />
            </div>
          )}

          {/* Filters */}
          <AdminFilters
            filters={filterConfig}
            onFilterChange={handleFilterChange}
            title="Report Filters"
          />

          {/* Reports List */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-lg">🚩</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reports</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Review and moderate reported content</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {reports.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-6">📋</div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Reports Found</h3>
                  <p className="text-gray-600 dark:text-gray-400">No reports match your current filters.</p>
                </div>
              ) : (
                reports.map((report) => (
                  <div key={report._id} className="p-4 sm:p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200">
                    <div className="space-y-4">
                      {/* Report Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getReasonIcon(report.reason)}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                              {report.reason.replace('_', ' ').toUpperCase()}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              Reported by {report.reporter?.name} • {new Date(report.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)} self-start sm:self-center`}>
                          {report.status}
                        </span>
                      </div>

                      {/* Report Description */}
                      {report.description && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 sm:p-4">
                          <p className="text-sm text-gray-700 dark:text-gray-300">{report.description}</p>
                        </div>
                      )}

                      {/* Reported Content */}
                      <div className="space-y-2">
                        {report.reportedPost && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Post:</span>
                            <Link 
                              to={`/posts/${report.reportedPost._id}`} 
                              className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                            >
                              {report.reportedPost.title}
                            </Link>
                          </div>
                        )}
                        {report.reportedUser && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-gray-600 dark:text-gray-400">User:</span>
                            <Link 
                              to={`/users/${report.reportedUser._id}`} 
                              className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                            >
                              {report.reportedUser.name}
                            </Link>
                          </div>
                        )}
                        {report.reportedComment && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Comment:</span>
                            <Link 
                              to={`/posts/${report.reportedComment.post}`} 
                              className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                            >
                              {report.reportedComment.body.substring(0, 100)}...
                            </Link>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-cyan-700 transition-all duration-200 ease-out hover:scale-[1.02] shadow-lg hover:shadow-xl"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <span>👀</span>
                            <span>Review</span>
                          </span>
                        </button>
                        {report.reportedPost && (
                          <button
                            onClick={() => handleHidePost(report.reportedPost._id)}
                            disabled={isHidingPost}
                            className={`flex-1 px-4 py-2 text-white rounded-xl font-semibold transition-all duration-200 ease-out shadow-lg ${
                              isHidingPost 
                                ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-75' 
                                : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 hover:scale-[1.02] hover:shadow-xl'
                            }`}
                          >
                            <span className="flex items-center justify-center gap-2">
                              {isHidingPost ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>Hiding...</span>
                                </>
                              ) : (
                                <>
                                  <span>🙈</span>
                                  <span>Hide Post</span>
                                </>
                              )}
                            </span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDismissReport(report._id)}
                          disabled={isDismissing}
                          className={`flex-1 px-4 py-2 text-white rounded-xl font-semibold transition-all duration-200 ease-out shadow-lg ${
                            isDismissing 
                              ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-75' 
                              : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 hover:scale-[1.02] hover:shadow-xl'
                          }`}
                        >
                          <span className="flex items-center justify-center gap-2">
                            {isDismissing ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Dismissing...</span>
                              </>
                            ) : (
                              <>
                                <span>❌</span>
                                <span>Dismiss</span>
                              </>
                            )}
                          </span>
                        </button>
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

          {/* Report Review Modal */}
          {selectedReport && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedReport(null)} />
              <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20 dark:border-gray-700/50">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center">
                        <span className="text-white text-lg">👀</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Review Report</h3>
                    </div>
                    <button
                      onClick={() => setSelectedReport(null)}
                      className="p-2 rounded-2xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all duration-200 ease-out hover:scale-110"
                    >
                      <span className="text-xl">✕</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Report Details */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-2xl p-4 sm:p-6 border border-gray-200/50 dark:border-gray-600/50">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="text-blue-600">📋</span>
                        Report Details
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600 dark:text-gray-400">Reason:</span>
                          <span className="text-gray-900 dark:text-white">{selectedReport.reason.replace('_', ' ').toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600 dark:text-gray-400">Reporter:</span>
                          <span className="text-gray-900 dark:text-white">{selectedReport.reporter?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600 dark:text-gray-400">Date:</span>
                          <span className="text-gray-900 dark:text-white">{new Date(selectedReport.createdAt).toLocaleString()}</span>
                        </div>
                        {selectedReport.description && (
                          <div className="mt-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Description:</span>
                            <p className="text-gray-900 dark:text-white mt-1">{selectedReport.description}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reported Content */}
                    <div className="bg-gradient-to-r from-gray-50 to-red-50 dark:from-gray-700 dark:to-red-900/20 rounded-2xl p-4 sm:p-6 border border-gray-200/50 dark:border-gray-600/50">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="text-red-600">🎯</span>
                        Reported Content
                      </h4>
                      {selectedReport.reportedPost && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Post:</span>
                            <span className="text-gray-900 dark:text-white">{selectedReport.reportedPost.title}</span>
                          </div>
                          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedReport.reportedPost.body.substring(0, 200)}...
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedReport.reportedUser && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-600 dark:text-gray-400">User:</span>
                            <span className="text-gray-900 dark:text-white">{selectedReport.reportedUser.name}</span>
                          </div>
                          {selectedReport.reportedUser.bio && (
                            <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {selectedReport.reportedUser.bio}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      {selectedReport.reportedComment && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Comment:</span>
                          </div>
                          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedReport.reportedComment.body}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Moderation Actions */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="text-purple-600">⚡</span>
                        Moderation Actions
                      </h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Action to Take
                        </label>
                        <select
                          value={actionTaken}
                          onChange={(e) => setActionTaken(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="none">No Action</option>
                          <option value="warning">Send Warning</option>
                          <option value="hide_content">Hide Content</option>
                          <option value="delete_content">Delete Content</option>
                          <option value="suspend_user">Suspend User</option>
                          <option value="ban_user">Ban User</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Moderation Notes
                        </label>
                        <textarea
                          value={moderationNotes}
                          onChange={(e) => setModerationNotes(e.target.value)}
                          placeholder="Add notes about the moderation decision..."
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          rows={4}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                      <button
                        onClick={() => setSelectedReport(null)}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ease-out hover:scale-[1.02] font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateReport}
                        disabled={isUpdating}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-out hover:scale-[1.02] shadow-lg hover:shadow-xl"
                      >
                        {isUpdating ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <span>✅</span>
                            Resolve Report
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AdminCard from '../components/admin/AdminCard';
import AdminStatsCard from '../components/admin/AdminStatsCard';
import AdminTable from '../components/admin/AdminTable';
import AdminPagination from '../components/admin/AdminPagination';

export default function Admin() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊', description: 'Dashboard overview and statistics' },
    { id: 'users', label: 'Users', icon: '👥', description: 'Manage user accounts and permissions' },
    { id: 'posts', label: 'Posts', icon: '📝', description: 'Moderate and manage content' },
    { id: 'moderation', label: 'Moderation', icon: '🚩', description: 'Review reports and moderate content' },
    { id: 'audit', label: 'Audit Trail', icon: '📋', description: 'View admin action history' }
  ];

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      // Load various stats in parallel
      const [usersRes, postsRes, reportsRes] = await Promise.all([
        api.get('/admin/users?limit=1'),
        api.get('/admin/posts?limit=1'),
        api.get('/reports/stats')
      ]);

      const [usersData, postsData, reportsData] = await Promise.all([
        usersRes.json(),
        postsRes.json(),
        reportsRes.json()
      ]);

      setStats({
        totalUsers: usersData.total || 0,
        totalPosts: postsData.total || 0,
        pendingReports: reportsData.statusStats?.find(s => s._id === 'pending')?.count || 0,
        recentReports: reportsData.recentReports || 0
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tabId) => {
    if (tabId === 'moderation') {
      navigate('/moderation');
    } else if (tabId === 'audit') {
      navigate('/audit-trail');
    } else {
      setTab(tabId);
    }
  };

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
          {/* Enhanced Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="relative">
                <span className="text-4xl sm:text-5xl animate-pulse">⚡</span>
                <div className="absolute inset-0 text-4xl sm:text-5xl animate-ping opacity-20">⚡</div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <div className="relative">
                <span className="text-4xl sm:text-5xl animate-pulse">⚡</span>
                <div className="absolute inset-0 text-4xl sm:text-5xl animate-ping opacity-20">⚡</div>
              </div>
            </div>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Manage users, moderate content, and oversee platform operations with powerful admin tools.
            </p>
          </div>

          {/* Enhanced Navigation Tabs */}
          <div className="mb-8">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                {tabs.map(tabItem => (
                  <button
                    key={tabItem.id}
                    onClick={() => handleTabClick(tabItem.id)}
                    className={`group relative p-4 rounded-2xl border-2 transition-all duration-200 ease-out hover:scale-[1.02] ${
                      tab === tabItem.id 
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-cyan-500 shadow-lg' 
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl mb-2">{tabItem.icon}</div>
                      <div className="font-semibold text-sm sm:text-base">{tabItem.label}</div>
                      <div className={`text-xs mt-1 ${tab === tabItem.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                        {tabItem.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {tab === 'overview' && <OverviewTab stats={stats} loading={loading} />}
          {tab === 'users' && <UsersTab />}
          {tab === 'posts' && <PostsTab />}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ stats, loading }) {
  if (loading) {
    return (
      <div className="space-y-8">
        {/* Stats Loading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-4 sm:p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions Loading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <AdminStatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon="👥"
          color="blue"
          description="Registered users"
        />
        <AdminStatsCard
          title="Total Posts"
          value={stats?.totalPosts || 0}
          icon="📝"
          color="green"
          description="Published content"
        />
        <AdminStatsCard
          title="Pending Reports"
          value={stats?.pendingReports || 0}
          icon="🚩"
          color="yellow"
          description="Awaiting review"
        />
        <AdminStatsCard
          title="Recent Activity"
          value={stats?.recentReports || 0}
          icon="📊"
          color="purple"
          description="This week"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AdminCard
          title="User Management"
          description="Manage user accounts, roles, and permissions"
          icon="👥"
          href="/admin"
          onClick={() => {/* Handle click */}}
        >
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Active Users</span>
              <span className="font-semibold text-green-600 dark:text-green-400">{stats?.totalUsers || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Pending Reports</span>
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">{stats?.pendingReports || 0}</span>
            </div>
          </div>
        </AdminCard>

        <AdminCard
          title="Content Moderation"
          description="Review and moderate posts, comments, and reports"
          icon="🚩"
          href="/moderation"
        >
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Posts</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{stats?.totalPosts || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Recent Reports</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">{stats?.recentReports || 0}</span>
            </div>
          </div>
        </AdminCard>

        <AdminCard
          title="Audit Trail"
          description="View complete history of admin actions and changes"
          icon="📋"
          href="/audit-trail"
        >
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">System Status</span>
              <span className="font-semibold text-green-600 dark:text-green-400">Healthy</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Last Backup</span>
              <span className="font-semibold text-gray-600 dark:text-gray-400">Today</span>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

function UsersTab() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  useEffect(() => { 
    (async () => {
      setLoading(true);
      const res = await api.get(`/admin/users?page=${page}&limit=${limit}`);
      const data = await res.json();
      if (res.ok) { setItems(data.data||[]); setTotal(data.total||0); }
      setLoading(false);
    })(); 
  }, [page]);

  async function setRole(id, role) {
    const res = await api.put(`/admin/users/${id}/role`, { role });
    const data = await res.json();
    if (res.ok) setItems(lst => lst.map(u => u._id === id ? data : u));
  }

  async function setSuspended(id, suspended) {
    try {
      const res = await api.put(`/admin/users/${id}/suspend`, { suspended });
      const data = await res.json();
      if (res.ok) {
        setItems(lst => lst.map(u => u._id === id ? data : u));
        alert(`User ${suspended ? 'suspended' : 'unsuspended'} successfully!`);
      } else {
        alert(`Failed to ${suspended ? 'suspend' : 'unsuspend'} user: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error toggling user suspension:', error);
      alert(`Failed to ${suspended ? 'suspend' : 'unsuspend'} user: ${error.message}`);
    }
  }

  async function deleteUser(id) {
    if (!confirm('Delete this user?')) return;
    
    try {
      const res = await api.del(`/admin/users/${id}`);
      if (res.ok) {
        setItems(lst => lst.filter(u => u._id !== id));
        alert('User deleted successfully!');
      } else {
        const data = await res.json();
        alert(`Failed to delete user: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(`Failed to delete user: ${error.message}`);
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (value, user) => (
        <Link 
          to={`/users/${user._id}`} 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img
            src={user.avatarUrl || `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="#e5e7eb"/><text x="16" y="20" text-anchor="middle" font-family="Arial" font-size="12" fill="#6b7280">U</text></svg>')}`}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
              {user.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {user.username ? `@${user.username}` : 'No username'}
            </div>
          </div>
        </Link>
      )
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => (
        <span className="text-gray-600 dark:text-gray-400 text-sm">{value}</span>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (value, user) => (
        <select 
          value={value} 
          onChange={(e) => setRole(user._id, e.target.value)} 
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={(e) => e.stopPropagation()}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      )
    },
    {
      key: 'suspended',
      label: 'Status',
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' 
            : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
        }`}>
          {value ? 'Suspended' : 'Active'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, user) => (
        <div className="flex flex-col sm:flex-row gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSuspended(user._id, !user.suspended);
            }} 
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 ${
              user.suspended 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-yellow-600 text-white hover:bg-yellow-700'
            }`}
          >
            {user.suspended ? 'Unsuspend' : 'Suspend'}
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              deleteUser(user._id);
            }} 
            className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-all duration-200 hover:scale-105"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center">
            <span className="text-white text-lg">👥</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage user roles, suspensions, and accounts</p>
          </div>
        </div>
        
        <AdminTable
          data={items}
          columns={columns}
          loading={loading}
          emptyMessage="No users found"
          mobileView="card"
        />
        
        <div className="mt-6">
          <AdminPagination
            page={page}
            total={total}
            limit={limit}
            onPrev={() => setPage(p => p - 1)}
            onNext={() => setPage(p => p + 1)}
          />
        </div>
      </div>
    </div>
  );
}

function PostsTab() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 12;

  useEffect(() => { 
    (async () => {
      setLoading(true);
      const res = await api.get(`/admin/posts?page=${page}&limit=${limit}`);
      const data = await res.json();
      if (res.ok) { setItems(data.data||[]); setTotal(data.total||0); }
      setLoading(false);
    })(); 
  }, [page]);

  async function hideToggle(id, hidden) {
    try {
      const res = await api.put(`/admin/posts/${id}/hidden`, { hidden });
      const data = await res.json();
      if (res.ok) {
        setItems(lst => lst.map(p => p._id === id ? data : p));
        alert(`Post ${hidden ? 'hidden' : 'unhidden'} successfully!`);
      } else {
        alert(`Failed to ${hidden ? 'hide' : 'unhide'} post: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error toggling post visibility:', error);
      alert(`Failed to ${hidden ? 'hide' : 'unhide'} post: ${error.message}`);
    }
  }

  async function deletePost(id) {
    if (!confirm('Delete this post?')) return;
    
    try {
      const res = await api.del(`/admin/posts/${id}`);
      if (res.ok) {
        setItems(lst => lst.filter(p => p._id !== id));
        alert('Post deleted successfully!');
      } else {
        const data = await res.json();
        alert(`Failed to delete post: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(`Failed to delete post: ${error.message}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
            <span className="text-white text-lg">📝</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Post Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage posts, hide content, and moderate posts</p>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4 animate-pulse">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">📝</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Posts Found</h3>
            <p className="text-gray-600 dark:text-gray-400">No posts are available for management.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {items.map(p => (
              <div key={p._id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200 ease-out hover:scale-[1.02]">
                <Link 
                  to={`/posts/${p._id}`} 
                  className="block hover:opacity-90 transition-opacity mb-4"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={p.user?.avatarUrl || `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="#e5e7eb"/><text x="16" y="20" text-anchor="middle" font-family="Arial" font-size="12" fill="#6b7280">U</text></svg>')}`}
                      alt={p.user?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1 hover:text-blue-600 dark:hover:text-blue-400">
                        {p.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">by {p.user?.name || 'User'}</div>
                    </div>
                  </div>
                  
                  {/* Post Type Badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      p.type === 'image' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                      p.type === 'video' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' :
                      p.type === 'document' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                      p.type === 'article' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                    }`}>
                      {p.type === 'image' && '🖼️'}
                      {p.type === 'video' && '🎬'}
                      {p.type === 'document' && '📄'}
                      {p.type === 'article' && '✍️'}
                      {p.type === 'text' && '📝'}
                      {' '}{p.type || 'text'}
                    </span>
                    {p.images && p.images.length > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {p.images.length} image{p.images.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                    {p.body}
                  </div>
                  
                  {/* Post Stats */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>👍 {p.likes?.length || 0}</span>
                    <span>💬 {p.comments?.length || 0}</span>
                    <span className="text-xs">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={!!p.hidden} 
                        onChange={e => hideToggle(p._id, e.target.checked)} 
                        className="rounded border-gray-300 dark:border-gray-600 text-red-600 focus:ring-red-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className={p.hidden ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-600 dark:text-gray-400'}>
                        {p.hidden ? 'Hidden' : 'Visible'}
                      </span>
                    </label>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePost(p._id);
                    }} 
                    className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-all duration-200 hover:scale-105"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6">
          <AdminPagination
            page={page}
            total={total}
            limit={limit}
            onPrev={() => setPage(p => p - 1)}
            onNext={() => setPage(p => p + 1)}
          />
        </div>
      </div>
    </div>
  );
}



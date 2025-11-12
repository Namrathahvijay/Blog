import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AccountSwitcher from './AccountSwitcher';

export default function Header() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [unread, setUnread] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifItems, setNotifItems] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const touchHandledRef = useRef(false);

  useEffect(() => {
    let timer;
    async function load() {
      try {
        // Only fetch notifications if user is authenticated and has a valid token
        if (!user || !user.id) { 
          setUnread(0); 
          setNotifItems([]); 
          return; 
        }
        
        const res = await api.get('/notifications?limit=10');
        if (!res.ok) {
          // If 401, user is not authenticated - clear notifications
          if (res.status === 401) {
            setUnread(0);
            setNotifItems([]);
            return;
          }
          return;
        }
        const data = await res.json();
        setUnread(data.unreadCount || 0);
        setNotifItems(data.notifications || []);
      } catch (error) {
        // Handle network errors or other issues
        // Notifications fetch error - handled silently
        setUnread(0);
        setNotifItems([]);
      } finally {
        timer = setTimeout(load, 30000);
      }
    }
    load();
    return () => { if (timer) clearTimeout(timer); };
  }, [user]);

  // Debounced search (only when authenticated)
  useEffect(() => {
    const q = query.trim();
    if (!user) { setResults([]); setOpen(false); setHighlighted(-1); return; }
    if (!q) { setResults([]); setOpen(false); setHighlighted(-1); return; }
    const id = setTimeout(async () => {
      try {
        const res = await api.get(`/users/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) return;
        const data = await res.json();
        setResults(Array.isArray(data) ? data.slice(0, 8) : []);
        setOpen(true);
        setHighlighted(-1);
      } catch {}
    }, 200);
    return () => clearTimeout(id);
  }, [query, user]);

  // Close mobile menu and search when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
        setMobileSearchOpen(false);
      }
    }

    function handleTouchOutside(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
        setMobileSearchOpen(false);
      }
    }

    if (mobileMenuOpen || mobileSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleTouchOutside, { passive: true });
      document.addEventListener('touchend', handleTouchOutside, { passive: true });
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleTouchOutside);
        document.removeEventListener('touchend', handleTouchOutside);
      };
    }
  }, [mobileMenuOpen, mobileSearchOpen]);

  function handleKeyDown(e) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => Math.min((h < 0 ? -1 : h) + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      if (highlighted >= 0 && results[highlighted]) {
        navigate(`/users/${results[highlighted]._id}`);
        setOpen(false);
        setQuery('');
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  function guardSearchEvent(e) {
    if (user) return;
    e.preventDefault();
    e.stopPropagation();
    navigate('/login', { replace: false, state: { from: location, next: location?.pathname || '/' } });
  }

  return (
    <header className="relative overflow-visible w-full shadow-2xl z-50">
      {/* Enhanced Background gradient with better contrast */}
      <div 
        className="absolute inset-0 opacity-95"
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, #0891b2 0%, #0e7490 50%, #14b8a6 100%)'
            : 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 50%, #0891b2 100%)'
        }}
      />
      
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-10 animate-pulse" style={{ background: 'rgba(255,255,255,0.2)' }} />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-10 animate-pulse" style={{ background: 'rgba(255,255,255,0.15)' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full opacity-5 animate-ping" style={{ background: 'rgba(255,255,255,0.3)' }} />
      </div>

      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

      <div className="relative z-10">
        {/* Main Header Row */}
        <div className="flex items-center justify-between py-2.5 px-4 sm:px-6 lg:px-8">
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md group-hover:bg-white/30 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-105">
              <span className="text-lg sm:text-xl filter drop-shadow-sm">✨</span>
            </div>
            <div className="group-hover:scale-105 transition-transform duration-300">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-lg tracking-tight">BlogAxis</h1>
              <p className="text-xs lg:text-sm text-white/90 hidden sm:block font-medium">Your central hub for blogging</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3">
            {/* Enhanced Desktop search */}
            <div className="w-72 xl:w-80 relative">
              <div className="relative">
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={(e) => { if (!user) return guardSearchEvent(e); if (query) setOpen(true); }}
                  onClick={(e) => { if (!user) return guardSearchEvent(e); }}
                  onBlur={() => setTimeout(() => setOpen(false), 150)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search users by name, username, place..."
                  className={`w-full px-4 py-3 pl-12 rounded-2xl backdrop-blur-sm focus:outline-none focus:ring-2 shadow-lg border transition-all duration-300 ${
                    isDark 
                      ? 'bg-gray-800/95 text-white placeholder-gray-300 focus:ring-white/50 focus:bg-gray-800 border-gray-600/50' 
                      : 'bg-white/95 text-gray-800 placeholder-gray-600 focus:ring-white/50 focus:bg-white border-white/20'
                  }`}
                  readOnly={!user}
                />
                <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  🔍
                </div>
              </div>
            {open && (
              <div ref={listRef} className={`absolute left-0 right-0 mt-2 backdrop-blur-md rounded-2xl shadow-2xl z-50 max-h-72 overflow-auto border transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-800/95 border-gray-600/50' 
                  : 'bg-white/95 border-white/20'
              }`}>
                {results.length === 0 ? (
                  <div className={`px-4 py-4 text-sm text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No users found</div>
                ) : (
                  results.map((u, idx) => (
                    <button
                      key={u._id}
                      onMouseDown={(ev) => ev.preventDefault()}
                      onClick={() => { setOpen(false); setQuery(''); navigate(`/users/${u._id}`); }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 ${
                        idx === highlighted 
                          ? (isDark ? 'bg-cyan-900/50 border-l-4 border-cyan-400' : 'bg-cyan-50 border-l-4 border-cyan-500')
                          : (isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50')
                      }`}
                    >
                      <img src={u.avatarUrl || `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\"><rect width=\"32\" height=\"32\" fill=\"#e5e7eb\"/><text x=\"16\" y=\"20\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"12\" fill=\"#6b7280\">U</text></svg>')}`} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-gray-200" />
                      <div className="min-w-0">
                        <div className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{u.name}</div>
                        <div className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {u.username && <span>@{u.username}</span>}
                          {u.place && <span className="ml-1">• {u.place}</span>}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
            </div>
            
            <Link 
              to="/" 
              className="px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
            >
              🏠 Home
            </Link>
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
            </button>
            
            {user && (
              <div className="relative">
                <button onClick={()=>setNotifOpen(o=>!o)} className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 relative shadow-lg hover:shadow-xl hover:scale-105 border border-white/20" title="Notifications">
                  <span className="text-lg">🔔</span>
                  {unread > 0 && <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-2 py-1 min-w-[20px] text-center font-bold shadow-lg animate-pulse">{unread}</span>}
                </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl text-gray-800 dark:text-gray-200 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 z-[9999] max-h-96 overflow-auto">
                  <div className="p-3 text-sm font-bold border-b border-gray-200 dark:border-gray-600 bg-gradient-to-r from-cyan-50 to-teal-100 dark:from-cyan-900/20 dark:to-teal-800/20 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🔔</span>
                      <span>Notifications</span>
                      {unread > 0 && (
                        <span className="ml-auto bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                          {unread} new
                        </span>
                      )}
                    </div>
                  </div>
                  {notifItems.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500">No notifications</div>
                  ) : notifItems.map(n => {
                    const getNotificationIcon = (type) => {
                      const icons = {
                        follow: '👥',
                        like: '👍',
                        comment: '💬',
                        reply: '↩️',
                        new_report: '🚩',
                        warning: '⚠️',
                        content_hidden: '🙈',
                        content_unhidden: '👁️',
                        content_deleted: '🗑️',
                        account_suspended: '⏸️',
                        account_unsuspended: '▶️',
                        account_banned: '🚫',
                        account_deleted: '💀'
                      };
                      return icons[type] || '🔔';
                    };

                    const getNotificationText = (n) => {
                      switch (n.type) {
                        case 'follow':
                          return `${n.sender?.name || 'Someone'} started following you`;
                        case 'like':
                          return `${n.sender?.name || 'Someone'} liked your post "${n.post?.title || 'Untitled'}"`;
                        case 'comment':
                          return `${n.sender?.name || 'Someone'} commented on your post "${n.post?.title || 'Untitled'}"`;
                        case 'reply':
                          return `${n.sender?.name || 'Someone'} replied to your comment`;
                        case 'new_report':
                          return `New report received for review`;
                        case 'warning':
                          return `Warning: ${n.details || 'You have received a warning'}`;
                        case 'content_hidden':
                          return `Your post "${n.post?.title || 'content'}" has been hidden`;
                        case 'content_unhidden':
                          return `Your post "${n.post?.title || 'content'}" has been made visible`;
                        case 'content_deleted':
                          return `Your ${n.comment ? 'comment' : 'post'} has been deleted`;
                        case 'account_suspended':
                          return `Your account has been suspended`;
                        case 'account_unsuspended':
                          return `Your account has been unsuspended`;
                        case 'account_banned':
                          return `Your account has been banned`;
                        case 'account_deleted':
                          return `Your account has been deleted`;
                        default:
                          return `${n.type.replace('_', ' ')} notification`;
                      }
                    };

                    const handleNotificationClick = async () => {
                      // Mark notification as read if it's not already read
                      if (!n.read) {
                        try {
                          await api.put(`/notifications/${n._id}/read`);
                          // Update the notification in the local state
                          setNotifItems(prev => prev.map(notif => 
                            notif._id === n._id ? { ...notif, read: true } : notif
                          ));
                          // Update unread count
                          setUnread(prev => Math.max(0, prev - 1));
                        } catch (error) {
                          console.error('Error marking notification as read:', error);
                        }
                      }
                      
                      setNotifOpen(false);
                      if (n.post) {
                        navigate(`/posts/${n.post._id || n.post}`);
                      } else if (n.sender && n.type === 'follow') {
                        navigate(`/users/${n.sender._id || n.sender}`);
                      } else if (n.type === 'new_report') {
                        navigate('/moderation');
                      }
                    };

                    return (
                      <div key={n._id} className={`p-3 border-b border-gray-100 dark:border-gray-700 text-sm flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200 ${!n.read ? 'bg-gradient-to-r from-cyan-50 to-teal-100 dark:from-cyan-900/20 dark:to-teal-800/20 border-l-4 border-l-cyan-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`} onClick={handleNotificationClick}>
                        <div className="text-lg">{getNotificationIcon(n.type)}</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">{getNotificationText(n)}</div>
                          {n.details && n.type !== 'warning' && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{n.details}</div>
                          )}
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {new Date(n.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Deleting individual notification:', n._id);
                            api.del(`/notifications/${n._id}`).then((response) => {
                              console.log('Individual delete response:', response);
                              if (response.ok) {
                                setNotifItems(list => list.filter(x => x._id !== n._id));
                                // Update unread count if the deleted notification was unread
                                if (!n.read) {
                                  setUnread(prev => Math.max(0, prev - 1));
                                }
                                console.log('Successfully deleted individual notification');
                              } else {
                                console.error('Failed to delete individual notification:', response.status);
                              }
                            }).catch((error) => {
                              console.error('Error deleting individual notification:', error);
                            });
                          }} 
                          className="text-xs text-red-600 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 p-1 rounded transition-all duration-200 hover:scale-110"
                          title="Delete notification"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                  <div className="p-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex gap-2">
                      <button 
                        onClick={async()=>{ 
                          try { 
                            console.log('Marking all notifications as read...');
                            const response = await api.put('/notifications/mark-all-read', {}); 
                            console.log('Mark all read response:', response);
                            if (response.ok) {
                              setUnread(0);
                              // Update all notifications to read in local state
                              setNotifItems(prev => prev.map(notif => ({ ...notif, read: true })));
                              console.log('Successfully marked all as read');
                            } else {
                              console.error('Failed to mark all as read:', response.status);
                            }
                          } catch (error) {
                            console.error('Error marking all as read:', error);
                          } 
                        }} 
                        className="flex-1 text-center px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white text-sm font-medium transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        ✅ Mark all read
                      </button>
                      <button 
                        onClick={async()=>{ 
                          try { 
                            console.log('Deleting all notifications...');
                            const response = await api.del('/notifications'); 
                            console.log('Delete all response:', response);
                            if (response.ok) {
                              setNotifItems([]); 
                              setUnread(0);
                              console.log('Successfully deleted all notifications');
                            } else {
                              console.error('Failed to delete all notifications:', response.status);
                            }
                          } catch (error) {
                            console.error('Error deleting all notifications:', error);
                          } 
                        }} 
                        className="px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        🗑️ Delete all
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            )}

            {user ? (
              <>
                <Link 
                  to="/compose" 
                  className="px-3 py-2 rounded-xl bg-white text-gray-800 hover:bg-gray-100 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
                >
                  ✍️ Compose
                </Link>
                
                <Link 
                  to="/my-posts" 
                  className="px-3 py-2 rounded-xl bg-white text-gray-800 hover:bg-gray-100 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
                >
                  📚 My Posts
                </Link>
                
                {/* Account Switcher */}
                <AccountSwitcher />
                
                <Link 
                  to="/profile" 
                  className="flex items-center group"
                  title={user.name}
                >
                  <div className="relative">
                    <img
                      src={user.avatarUrl || `data:image/svg+xml;utf8,${encodeURIComponent('<svg width="36" height="36" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="18" fill="#ffffff33"/><rect x="1" y="1" width="34" height="34" rx="17" fill="#ffffff55"/><text x="18" y="23" text-anchor="middle" font-family="Arial" font-size="14" fill="#1f2937">U</text></svg>')}`}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-white/50 shadow-lg group-hover:scale-110 transition-all duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="px-2.5 py-1.5 rounded-lg bg-yellow-400/80 text-gray-800 hover:bg-yellow-400 transition-all duration-300 text-xs font-medium shadow-md hover:shadow-lg hover:scale-105 border border-yellow-300/50"
                  >
                    🛡️ Admin
                  </Link>
                )}
                <button 
                  onClick={() => { logout(); navigate('/'); }} 
                  className="px-3 py-2 rounded-xl bg-red-500/80 backdrop-blur-md text-white hover:bg-red-600/80 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 border border-red-400/50"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
                >
                  🔑 Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-3 py-2 rounded-xl bg-white text-gray-800 hover:bg-gray-100 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
                >
                  📝 Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Search Toggle */}
            <button 
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                touchHandledRef.current = false;
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Mobile search toggle touched
                
                if (touchHandledRef.current) return;
                touchHandledRef.current = true;
                if (!user) {
                  navigate('/login', { replace: false, state: { from: location, next: location?.pathname || '/' } });
                  return;
                }
                setMobileSearchOpen(!mobileSearchOpen);
                setMobileMenuOpen(false);
                
                // Reset the flag after a short delay
                setTimeout(() => {
                  touchHandledRef.current = false;
                }, 300);
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // If touch was already handled, ignore this click
                if (touchHandledRef.current) {
                  console.log('Mobile search toggle click ignored (touch already handled)');
                  return;
                }
                
                console.log('Mobile search toggle clicked, current state:', mobileSearchOpen);
                if (!user) {
                  navigate('/login', { replace: false, state: { from: location, next: location?.pathname || '/' } });
                  return;
                }
                setMobileSearchOpen(!mobileSearchOpen);
                setMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 active:bg-white/30 transition-all duration-300 shadow-lg border border-white/20 touch-manipulation select-none"
              title={mobileSearchOpen ? "Close Search" : "Open Search"}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none'
              }}
            >
              <span className="text-xl pointer-events-none">🔍</span>
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                touchHandledRef.current = false;
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile menu toggle touched, current state:', mobileMenuOpen);
                
                if (touchHandledRef.current) return;
                touchHandledRef.current = true;
                
                if (mobileMenuOpen) {
                  // If menu is open, close it and go to home
                  setMobileMenuOpen(false);
                  setMobileSearchOpen(false);
                  setTimeout(() => navigate('/'), 100); // Small delay for smooth transition
                } else {
                  // If menu is closed, just open it
                  setMobileMenuOpen(true);
                  setMobileSearchOpen(false);
                }
                
                // Reset the flag after a short delay
                setTimeout(() => {
                  touchHandledRef.current = false;
                }, 300);
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // If touch was already handled, ignore this click
                if (touchHandledRef.current) {
                  console.log('Mobile menu toggle click ignored (touch already handled)');
                  return;
                }
                
                console.log('Mobile menu toggle clicked, current state:', mobileMenuOpen);
                
                if (mobileMenuOpen) {
                  // If menu is open, close it and go to home
                  setMobileMenuOpen(false);
                  setMobileSearchOpen(false);
                  setTimeout(() => navigate('/'), 100); // Small delay for smooth transition
                } else {
                  // If menu is closed, just open it
                  setMobileMenuOpen(true);
                  setMobileSearchOpen(false);
                }
              }}
              className="p-3 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 active:bg-white/30 transition-all duration-300 shadow-lg border border-white/20 touch-manipulation select-none"
              title={mobileMenuOpen ? "Close Menu & Go Home" : "Open Menu"}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none'
              }}
            >
              <span className="text-xl font-bold pointer-events-none">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="lg:hidden px-4 pb-4" ref={mobileMenuRef}>
            <div className="relative">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={(e) => { if (!user) return guardSearchEvent(e); if (query) setOpen(true); }}
                onClick={(e) => { if (!user) return guardSearchEvent(e); }}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                onKeyDown={handleKeyDown}
                placeholder="Search users..."
                className={`w-full px-4 py-4 pl-14 rounded-3xl backdrop-blur-xl focus:outline-none focus:ring-4 shadow-2xl border-2 transition-all duration-300 text-lg ${
                  isDark 
                    ? 'bg-gradient-to-r from-gray-800/95 to-gray-800/90 text-white placeholder-gray-300 focus:ring-white/50 focus:bg-gray-800 border-gray-600/50' 
                    : 'bg-gradient-to-r from-white/95 to-white/90 text-gray-800 placeholder-gray-600 focus:ring-white/50 focus:bg-white border-white/30'
                }`}
                readOnly={!user}
              />
              <div className={`absolute left-5 top-1/2 transform -translate-y-1/2 text-xl ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                🔍
              </div>
            </div>
            {open && (
              <div ref={listRef} className={`absolute left-4 right-4 mt-3 backdrop-blur-xl rounded-3xl shadow-2xl z-50 max-h-72 overflow-auto border-2 transition-all duration-300 ${
                isDark 
                  ? 'bg-gradient-to-br from-gray-800/98 to-gray-800/95 border-gray-600/50' 
                  : 'bg-gradient-to-br from-white/98 to-white/95 border-white/30'
              }`}>
                {results.length === 0 ? (
                  <div className={`px-4 py-4 text-sm text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No users found</div>
                ) : (
                  results.map((u, idx) => (
                    <button
                      key={u._id}
                      onMouseDown={(ev) => ev.preventDefault()}
                      onClick={() => { setOpen(false); setQuery(''); navigate(`/users/${u._id}`); }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 ${idx === highlighted ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}
                    >
                      <img src={u.avatarUrl || `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\"><rect width=\"32\" height=\"32\" fill=\"#e5e7eb\"/><text x=\"16\" y=\"20\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"12\" fill=\"#6b7280\">U</text></svg>')}`} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-gray-200" />
                      <div className="min-w-0">
                        <div className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{u.name}</div>
                        <div className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {u.username && <span>@{u.username}</span>}
                          {u.place && <span className="ml-1">• {u.place}</span>}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pb-4" ref={mobileMenuRef}>
            <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 space-y-4 border border-white/30 shadow-2xl">
              {/* Mobile Navigation Links */}
              <div className="flex flex-wrap gap-3">
                <Link 
                  to="/" 
                  onClick={() => { setMobileMenuOpen(false); setMobileSearchOpen(false); }}
                  className="px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-teal-500/20 backdrop-blur-md text-white hover:from-cyan-500/30 hover:to-teal-500/30 active:scale-95 transition-all duration-300 text-sm font-semibold shadow-lg border border-white/30 hover:shadow-xl touch-manipulation select-none"
                  style={{ 
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
                >
                  <span className="flex items-center gap-2 pointer-events-none">
                    <span className="text-lg">🏠</span>
                    <span>Home</span>
                  </span>
                </Link>
                
                <button 
                  onClick={toggleTheme}
                  className="px-4 py-3 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md text-white hover:from-yellow-500/30 hover:to-orange-500/30 active:scale-95 transition-all duration-300 text-sm font-semibold shadow-lg border border-white/30 hover:shadow-xl touch-manipulation select-none"
                  style={{ 
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
                >
                  <span className="flex items-center gap-2 pointer-events-none">
                    <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
                    <span>{isDark ? 'Light' : 'Dark'}</span>
                  </span>
                </button>
              </div>

              {/* User Actions */}
              {user ? (
                <div className="space-y-2">
                  <Link 
                    to="/compose" 
                    onClick={() => { setMobileMenuOpen(false); setMobileSearchOpen(false); }}
                    className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 active:scale-95 transition-all duration-300 text-sm font-bold shadow-lg border border-white/30 hover:shadow-xl text-center block"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-lg">✍️</span>
                      <span>Compose</span>
                    </span>
                  </Link>
                  
                  <Link 
                    to="/my-posts" 
                    onClick={() => { setMobileMenuOpen(false); setMobileSearchOpen(false); }}
                    className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 active:scale-95 transition-all duration-300 text-sm font-bold shadow-lg border border-white/30 hover:shadow-xl text-center block"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-lg">📚</span>
                      <span>My Posts</span>
                    </span>
                  </Link>
                  
                  {/* Mobile Notifications */}
                  <div className="w-full">
                    <button 
                      onClick={() => setNotifOpen(!notifOpen)}
                      className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-teal-500/20 to-emerald-500/20 backdrop-blur-md text-white hover:from-teal-500/30 hover:to-emerald-500/30 active:scale-95 transition-all duration-300 text-sm font-semibold shadow-lg border border-white/30 hover:shadow-xl text-center flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">🔔</span>
                      <span>Notifications</span>
                      {unread > 0 && (
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full px-2 py-1 text-xs font-bold min-w-[20px] text-center shadow-lg animate-pulse">
                          {unread}
                        </span>
                      )}
                    </button>
                    
                    {/* Mobile Notifications Dropdown */}
                    {notifOpen && (
                      <div className="mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 max-h-64 overflow-auto">
                        <div className="p-3 text-sm font-bold border-b border-gray-200 dark:border-gray-600 bg-gradient-to-r from-cyan-50 to-teal-100 dark:from-cyan-900/20 dark:to-teal-800/20 rounded-t-2xl">
                          <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                            <span className="text-lg">🔔</span>
                            <span>Notifications</span>
                            {unread > 0 && (
                              <span className="ml-auto bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                                {unread} new
                              </span>
                            )}
                          </div>
                        </div>
                        {notifItems.length === 0 ? (
                          <div className="p-3 text-sm text-gray-500 text-center">No notifications</div>
                        ) : (
                          notifItems.map(n => {
                            const getNotificationIcon = (type) => {
                              const icons = {
                                follow: '👥',
                                like_post: '👍',
                                dislike_post: '👎',
                                comment: '💬',
                                reply: '↩️',
                                new_report: '🚩',
                                warning: '⚠️',
                                content_hidden: '🙈',
                                content_unhidden: '👁️',
                                content_deleted: '🗑️',
                                account_suspended: '⏸️',
                                account_unsuspended: '▶️',
                                account_banned: '🚫',
                                account_deleted: '💀'
                              };
                              return icons[type] || '🔔';
                            };

                            const getNotificationText = (n) => {
                              switch (n.type) {
                                case 'follow':
                                  return `${n.fromUser?.name || 'Someone'} started following you`;
                                case 'like_post':
                                  return `${n.fromUser?.name || 'Someone'} liked your post "${n.post?.title || 'Untitled'}"`;
                                case 'dislike_post':
                                  return `${n.fromUser?.name || 'Someone'} disliked your post "${n.post?.title || 'Untitled'}"`;
                                case 'comment':
                                  return `${n.fromUser?.name || 'Someone'} commented on your post "${n.post?.title || 'Untitled'}"`;
                                case 'reply':
                                  return `${n.fromUser?.name || 'Someone'} replied to your comment`;
                                case 'new_report':
                                  return `New report received for review`;
                                case 'warning':
                                  return `Warning: ${n.details || 'You have received a warning'}`;
                                case 'content_hidden':
                                  return `Your post "${n.post?.title || 'content'}" has been hidden`;
                                case 'content_unhidden':
                                  return `Your post "${n.post?.title || 'content'}" has been made visible`;
                                case 'content_deleted':
                                  return `Your ${n.comment ? 'comment' : 'post'} has been deleted`;
                                case 'account_suspended':
                                  return `Your account has been suspended`;
                                case 'account_unsuspended':
                                  return `Your account has been unsuspended`;
                                case 'account_banned':
                                  return `Your account has been banned`;
                                case 'account_deleted':
                                  return `Your account has been deleted`;
                                default:
                                  return `${n.type.replace('_', ' ')} notification`;
                              }
                            };

                            const handleNotificationClick = async () => {
                              if (!n.read) {
                                try {
                                  await api.put(`/notifications/${n._id}/read`);
                                  setNotifItems(prev => prev.map(notif => 
                                    notif._id === n._id ? { ...notif, read: true } : notif
                                  ));
                                  setUnread(prev => Math.max(0, prev - 1));
                                } catch (error) {
                                  console.error('Error marking notification as read:', error);
                                }
                              }
                              
                              setNotifOpen(false);
                              setMobileMenuOpen(false);
                              setMobileSearchOpen(false);
                              
                              if (n.post) {
                                navigate(`/posts/${n.post._id || n.post}`);
                              } else if (n.fromUser && n.type === 'follow') {
                                navigate(`/users/${n.fromUser._id || n.fromUser}`);
                              } else if (n.type === 'new_report') {
                                navigate('/moderation');
                              }
                            };

                            return (
                              <div key={n._id} className={`p-3 border-b border-gray-100 dark:border-gray-700 text-sm flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200 ${!n.read ? 'bg-gradient-to-r from-cyan-50 to-teal-100 dark:from-cyan-900/20 dark:to-teal-800/20 border-l-4 border-l-cyan-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`} onClick={handleNotificationClick}>
                                <div className="text-lg">{getNotificationIcon(n.type)}</div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 dark:text-white">{getNotificationText(n)}</div>
                                  {n.details && n.type !== 'warning' && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{n.details}</div>
                                  )}
                                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {new Date(n.createdAt).toLocaleString()}
                                  </div>
                                </div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Mobile: Deleting individual notification:', n._id);
                                    api.del(`/notifications/${n._id}`).then((response) => {
                                      console.log('Mobile: Individual delete response:', response);
                                      if (response.ok) {
                                        setNotifItems(list => list.filter(x => x._id !== n._id));
                                        if (!n.read) {
                                          setUnread(prev => Math.max(0, prev - 1));
                                        }
                                        console.log('Mobile: Successfully deleted individual notification');
                                      } else {
                                        console.error('Mobile: Failed to delete individual notification:', response.status);
                                      }
                                    }).catch((error) => {
                                      console.error('Mobile: Error deleting individual notification:', error);
                                    });
                                  }} 
                                  className="text-xs text-red-600 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 p-1 rounded transition-all duration-200 hover:scale-110"
                                  title="Delete notification"
                                >
                                  ✕
                                </button>
                              </div>
                            );
                          })
                        )}
                        <div className="p-3 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex gap-2">
                            <button 
                              onClick={async()=>{ 
                                try { 
                                  console.log('Mobile: Marking all notifications as read...');
                                  const response = await api.post('/notifications/read-all', {}); 
                                  console.log('Mobile: Mark all read response:', response);
                                  if (response.ok) {
                                    setUnread(0);
                                    setNotifItems(prev => prev.map(notif => ({ ...notif, read: true })));
                                    console.log('Mobile: Successfully marked all as read');
                                  } else {
                                    console.error('Mobile: Failed to mark all as read:', response.status);
                                  }
                                } catch (error) {
                                  console.error('Mobile: Error marking all as read:', error);
                                } 
                              }} 
                              className="flex-1 text-center px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white text-sm font-medium transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                            >
                              ✅ Mark all read
                            </button>
                            <button 
                              onClick={async()=>{ 
                                try { 
                                  console.log('Mobile: Deleting all notifications...');
                                  const response = await api.del('/notifications'); 
                                  console.log('Mobile: Delete all response:', response);
                                  if (response.ok) {
                                    setNotifItems([]); 
                                    setUnread(0);
                                    console.log('Mobile: Successfully deleted all notifications');
                                  } else {
                                    console.error('Mobile: Failed to delete all notifications:', response.status);
                                  }
                                } catch (error) {
                                  console.error('Mobile: Error deleting all notifications:', error);
                                } 
                              }} 
                              className="px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                            >
                              🗑️ Delete all
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Mobile Account Switcher */}
                  <div className="w-full">
                    <AccountSwitcher 
                      isMobile={true} 
                      onMobileMenuClose={() => { setMobileMenuOpen(false); setMobileSearchOpen(false); }} 
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Link 
                      to="/profile" 
                      onClick={() => { setMobileMenuOpen(false); setMobileSearchOpen(false); }}
                      className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-teal-500/20 backdrop-blur-md text-white hover:from-cyan-500/30 hover:to-teal-500/30 active:scale-95 transition-all duration-300 text-sm font-semibold shadow-lg border border-white/30 hover:shadow-xl text-center"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span className="text-lg">👤</span>
                        <span>Profile</span>
                      </span>
                    </Link>
                    
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        onClick={() => { setMobileMenuOpen(false); setMobileSearchOpen(false); }}
                        className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800 hover:from-yellow-500 hover:to-orange-500 active:scale-95 transition-all duration-300 text-sm font-semibold shadow-lg border border-yellow-300 hover:shadow-xl"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">🛡️</span>
                          <span>Admin</span>
                        </span>
                      </Link>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => { logout(); navigate('/'); setMobileMenuOpen(false); setMobileSearchOpen(false); }} 
                    className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 active:scale-95 transition-all duration-300 text-sm font-bold shadow-lg border border-red-400/50 hover:shadow-xl"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-lg">🚪</span>
                      <span>Logout</span>
                    </span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link 
                    to="/login" 
                    onClick={() => { setMobileMenuOpen(false); setMobileSearchOpen(false); }}
                    className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md text-white hover:from-cyan-500/30 hover:to-blue-500/30 active:scale-95 transition-all duration-300 text-sm font-semibold shadow-lg border border-white/30 hover:shadow-xl text-center block"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-lg">🔑</span>
                      <span>Login</span>
                    </span>
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => { setMobileMenuOpen(false); setMobileSearchOpen(false); }}
                    className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 active:scale-95 transition-all duration-300 text-sm font-bold shadow-lg border border-white/30 hover:shadow-xl text-center block"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-lg">📝</span>
                      <span>Register</span>
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
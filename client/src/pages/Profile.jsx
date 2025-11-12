import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFollowState } from '../hooks/useFollowState';
import ReportButton from '../components/ReportButton';

// Password strength indicator component
function PasswordStrengthIndicator({ password }) {
  const getStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    if (score <= 2) return { score, label: 'Weak', color: 'text-red-500' };
    if (score <= 3) return { score, label: 'Fair', color: 'text-yellow-500' };
    if (score <= 4) return { score, label: 'Good', color: 'text-blue-500' };
    return { score, label: 'Strong', color: 'text-green-500' };
  };

  const strength = getStrength(password);
  
  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1 w-8 rounded ${
                i <= strength.score
                  ? strength.score <= 2
                    ? 'bg-red-500'
                    : strength.score <= 3
                    ? 'bg-yellow-500'
                    : strength.score <= 4
                    ? 'bg-cyan-500'
                    : 'bg-teal-500'
                  : 'bg-gray-200 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
        <span className={`text-xs font-medium ${strength.color}`}>
          {strength.label}
        </span>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Password must contain: uppercase, lowercase, number, and special character (@$!%*?&)
      </div>
    </div>
  );
}

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser, login, logout } = useAuth();
  const { isDark } = useTheme();

  const isOwn = useMemo(() => {
    if (!id) return true; // /profile route
    return authUser ? id === authUser.id : false;
  }, [id, authUser]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  
  // Use global follow state
  const { isFollowing, loading: followLoading, shouldShowFollow, toggleFollow } = useFollowState(id);
  const [listOpen, setListOpen] = useState(false);
  const [listType, setListType] = useState('followers'); // 'followers' | 'following'
  const [listItems, setListItems] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [place, setPlace] = useState('');
  const [info, setInfo] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);
  
  // Password update state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  // Account deletion state
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteError, setDeleteError] = useState('');
  
  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);

  // Fetch profile
  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(isOwn ? '/users/me' : `/users/${id}`);
        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        const p = data.user || data; // server returns {user} for /me and raw for public
        if (mounted) {
          setProfile(p);
          if (data.user) {
            setFollowersCount(p.followersCount || (p.followers?.length || 0));
            setFollowingCount(p.followingCount || (p.following?.length || 0));
          } else {
            setFollowersCount(data.followersCount || (data.followers?.length || 0));
            setFollowingCount(data.followingCount || (data.following?.length || 0));
          }
          const nameParts = (p.name || '').trim().split(/\s+/);
          const derivedFirst = p.firstName || (nameParts[0] || '');
          const derivedLast = p.lastName || (nameParts.slice(1).join(' ') || '');
          setFirstName(derivedFirst);
          setLastName(derivedLast);
          // For own profile, allow fallback to auth user; for public profiles, use only the profile data
          const prefer = (val, ownVal) => (isOwn ? (val ?? ownVal ?? '') : (val ?? ''));
          setUsername(prefer(p.username, authUser?.username));
          setBio(prefer(p.bio, authUser?.bio));
          setPlace(prefer(p.place, authUser?.place));
          setInfo(prefer(p.info, authUser?.info));
          const dobSource = isOwn ? (p.dateOfBirth || authUser?.dateOfBirth || '') : (p.dateOfBirth || '');
          setDateOfBirth(dobSource ? new Date(dobSource).toISOString().split('T')[0] : '');
        }
      } catch (e) {
        if (mounted) setError(e.message || 'Error');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => { mounted = false; };
  }, [id, isOwn]);

  // Fallback: if own profile and DoB still missing after first load, try /api/auth/me once
  useEffect(() => {
    let cancelled = false;
    async function backfillFromAuthMe() {
      try {
        if (!isOwn) return;
        if (dateOfBirth) return; // already have it
        const res = await api.get('/auth/me');
        if (!res.ok) return;
        const me = await res.json();
        const u = me?.user;
        if (!cancelled && u?.dateOfBirth && !dateOfBirth) {
          setDateOfBirth(new Date(u.dateOfBirth).toISOString().split('T')[0]);
        }
        if (!cancelled && u && !place && u.place) setPlace(u.place);
        if (!cancelled && u && !info && u.info) setInfo(u.info);
      } catch {}
    }
    backfillFromAuthMe();
    return () => { cancelled = true; };
  }, [isOwn, dateOfBirth, place, info]);

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setIsSaving(true);
    try {
      const form = new FormData();
      if (firstName) form.append('firstName', firstName);
      if (lastName) form.append('lastName', lastName);
      const computedFullName = `${firstName} ${lastName}`.trim();
      if (computedFullName) form.append('name', computedFullName);
      if (username) form.append('username', username);
      form.append('bio', bio || '');
      form.append('place', place || '');
      form.append('info', info || '');
      if (dateOfBirth) form.append('dateOfBirth', dateOfBirth);
      if (avatarFile) form.append('avatar', avatarFile);
      const res = await api.put('/users/me', form, true);
      const updated = await res.json();
      if (!res.ok) throw new Error(updated?.error || 'Update failed');
      setProfile(updated);
      // also update auth context user
      login(localStorage.getItem('token') || '', {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        username: updated.username,
        avatarUrl: updated.avatarUrl,
        firstName: updated.firstName,
        lastName: updated.lastName,
        dateOfBirth: updated.dateOfBirth,
        place: updated.place,
        info: updated.info,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      });
      setAvatarFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e) {
      setError(e.message || 'Update failed');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRemoveAvatar() {
    setError('');
    setIsRemovingAvatar(true);
    try {
      const form = new FormData();
      form.append('removeAvatar', 'true');
      const res = await api.put('/users/me', form, true);
      const updated = await res.json();
      if (!res.ok) throw new Error(updated?.error || 'Update failed');
      setProfile(updated);
      login(localStorage.getItem('token') || '', {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        username: updated.username,
        avatarUrl: updated.avatarUrl,
      });
    } catch (e) {
      setError(e.message || 'Failed');
    } finally {
      setIsRemovingAvatar(false);
    }
  }

  async function handleFollowToggle() {
    if (!authUser) {
      navigate('/login');
      return;
    }
    try {
      const result = await toggleFollow();
      if (result.success) {
        if (typeof result.followersCount === 'number') setFollowersCount(result.followersCount);
        if (typeof result.followingCount === 'number' && isOwn) setFollowingCount(result.followingCount);
      }
    } catch (e) {
      setError(e.message || 'Failed');
    }
  }

  async function openList(type) {
    setListType(type);
    setListOpen(true);
    setListLoading(true);
    setListItems([]);
    try {
      const res = await api.get(`/users/${id || authUser?.id}/${type}`);
      if (!res.ok) throw new Error('Failed to load list');
      const items = await res.json();
      setListItems(Array.isArray(items) ? items : []);
    } catch (e) {
      setError(e.message || 'Failed');
    } finally {
      setListLoading(false);
    }
  }

  async function toggleFollowFromList(userId, currentlyFollowing) {
    try {
      const path = currentlyFollowing ? `/users/${userId}/unfollow` : `/users/${userId}/follow`;
      const res = await api.post(path, {});
      await res.json().catch(() => ({}));
      if (!res.ok) throw new Error('Action failed');
      setListItems(items => items.map(u => u._id === userId ? { ...u, isFollowing: !currentlyFollowing } : u));
      if (listType === 'followers') {
        setFollowersCount(c => c); // unchanged here; server returns counts but we don't need to block on it
      } else if (listType === 'following' && (id || authUser?.id) === authUser?.id) {
        // If viewing own following list, adjust followingCount locally
        setFollowingCount(c => c + (currentlyFollowing ? -1 : 1));
      }
    } catch (e) {
      setError(e.message || 'Failed');
    }
  }

  async function handlePasswordUpdate(e) {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setIsUpdatingPassword(true);
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      setIsUpdatingPassword(false);
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      setIsUpdatingPassword(false);
      return;
    }
    
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(newPassword)) {
      setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      setIsUpdatingPassword(false);
      return;
    }
    
    try {
      const res = await api.put('/auth/password', {
        currentPassword,
        newPassword,
        confirmPassword
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Password update failed');
      }
      
      setPasswordSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (e) {
      setPasswordError(e.message || 'Password update failed');
    } finally {
      setIsUpdatingPassword(false);
    }
  }

  async function handleAccountDeletion(e) {
    e.preventDefault();
    setDeleteError('');
    setIsDeletingAccount(true);
    
    if (deleteConfirmText !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm account deletion');
      setIsDeletingAccount(false);
      return;
    }
    
    try {
      const res = await api.del('/auth/account', {
        password: deletePassword,
        confirmText: deleteConfirmText
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Account deletion failed');
      }
      
      // Account deleted successfully - clear everything and redirect
      logout();
      
      // Clear all local storage to ensure complete logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('accounts');
      
      // Force redirect to login page since user is now logged out
      window.location.href = '/login';
      
    } catch (e) {
      setDeleteError(e.message || 'Account deletion failed');
    } finally {
      setIsDeletingAccount(false);
    }
  }

  if (loading) return <div className="p-4 text-gray-500 dark:text-gray-400">Loading...</div>;
  if (error) return <div className="p-4 text-red-600 dark:text-red-400">{error}</div>;
  if (!profile) return <div className="p-4 text-gray-500 dark:text-gray-400">Not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-8">
        {/* Enhanced Profile Header - Mobile Optimized */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 shadow-2xl">
          {/* Enhanced Background with multiple gradients */}
          <div 
            className="absolute inset-0"
            style={{
              background: isDark 
                ? 'linear-gradient(135deg, #0e7490 0%, #0891b2 25%, #14b8a6 50%, #0d9488 75%, #0f766e 100%)'
                : 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 25%, #22d3ee 50%, #2dd4bf 75%, #5eead4 100%)'
            }}
          />
          
          {/* Animated decorative elements - Hidden on mobile for performance */}
          <div className="absolute inset-0 hidden sm:block">
            <div className="absolute top-4 left-4 w-16 h-16 rounded-full opacity-30 animate-pulse" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <div className="absolute top-8 right-8 w-12 h-12 rounded-full opacity-25 animate-bounce" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <div className="absolute bottom-8 left-8 w-20 h-20 rounded-full opacity-20 animate-pulse" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div className="absolute bottom-4 right-4 w-14 h-14 rounded-full opacity-30 animate-bounce" style={{ background: 'rgba(255,255,255,0.2)' }} />
            
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
          
          <div className="relative z-10 p-4 sm:p-6 lg:p-8 xl:p-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
              {/* Enhanced Avatar Section - Mobile Optimized */}
              <div className="relative group flex-shrink-0">
                <div className="relative">
                  <img
                    src={profile.avatarUrl || `data:image/svg+xml;base64,${btoa(`
                      <svg width="160" height="160" xmlns="http://www.w3.org/2000/svg">
                        <rect width="160" height="160" fill="#e5e7eb"/>
                        <text x="80" y="90" text-anchor="middle" font-family="Arial" font-size="64" fill="#6b7280">U</text>
                      </svg>
                    `)}`}
                    alt="avatar"
                    className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full object-cover border-2 sm:border-4 border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Online indicator - Smaller on mobile */}
                  <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-4 h-4 sm:w-6 sm:h-6 bg-teal-500 border-2 sm:border-4 border-white rounded-full shadow-lg animate-pulse"></div>
                </div>
              </div>
              
              {/* Enhanced Profile Info - Mobile Optimized */}
              <div className="flex-1 text-white text-center sm:text-left">
                <div className="mb-3 sm:mb-4">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent leading-tight">
                    {profile.name}
                  </h1>
                  {profile.username && (
                    <p className="text-white/80 text-base sm:text-lg lg:text-xl mb-2 sm:mb-3 font-medium">
                      @{profile.username}
                    </p>
                  )}
                  {profile.bio && (
                    <p className="text-white/90 whitespace-pre-wrap leading-relaxed text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 max-w-2xl mx-auto sm:mx-0">
                      {profile.bio}
                    </p>
                  )}
                </div>
                
                {/* Enhanced Member Info - Mobile Optimized */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-center sm:items-center gap-2 sm:gap-4 text-white/80 text-xs sm:text-sm lg:text-base mb-4 sm:mb-6">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-sm sm:text-lg">📅</span>
                    <span className="truncate">Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
                  </div>
                  {profile.updatedAt && (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-sm sm:text-lg">🔄</span>
                      <span className="truncate">Updated {new Date(profile.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                
                {/* Enhanced Action Buttons - Mobile Optimized */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {shouldShowFollow && (
                    <button
                      onClick={handleFollowToggle}
                      disabled={followLoading}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base ${
                        isFollowing 
                          ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30 hover:scale-105' 
                          : 'bg-white text-gray-800 hover:bg-gray-100 hover:scale-105'
                      } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {followLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          <span className="hidden sm:inline">Loading...</span>
                          <span className="sm:hidden">...</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1 sm:gap-2">
                          <span className="text-sm sm:text-base">{isFollowing ? '✅' : '➕'}</span>
                          <span>{isFollowing ? 'Following' : 'Follow'}</span>
                        </span>
                      )}
                    </button>
                  )}
                  {!isOwn && authUser && (
                    <ReportButton 
                      targetType="user" 
                      targetId={profile._id} 
                      targetTitle={profile.name}
                      className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl bg-white/10 text-white hover:bg-white/20 border border-white/30 hover:scale-105 text-sm sm:text-base"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Profile Details - Mobile Optimized */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <span className="text-xl sm:text-2xl">👤</span>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Profile Details</h3>
          </div>
          
          {/* Enhanced Stats Grid - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <button 
              type="button" 
              onClick={() => openList('followers')} 
              className="group text-left rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 hover:from-cyan-100 hover:to-cyan-200 dark:hover:from-cyan-900/30 dark:hover:to-cyan-800/30 transition-all duration-300 border border-cyan-200/50 dark:border-cyan-700/50 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <span className="text-lg sm:text-2xl">👥</span>
                <span className="text-xs sm:text-sm font-medium text-cyan-600 dark:text-cyan-400">Followers</span>
              </div>
              <div className="font-bold text-xl sm:text-2xl lg:text-3xl text-cyan-700 dark:text-cyan-300">{followersCount}</div>
            </button>
            
            <button 
              type="button" 
              onClick={() => openList('following')} 
              className="group text-left rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/30 dark:hover:to-green-800/30 transition-all duration-300 border border-green-200/50 dark:border-green-700/50 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <span className="text-lg sm:text-2xl">🔄</span>
                <span className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">Following</span>
              </div>
              <div className="font-bold text-xl sm:text-2xl lg:text-3xl text-green-700 dark:text-green-300">{followingCount}</div>
            </button>
            
            {username && (
              <div className="rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 border border-teal-200/50 dark:border-teal-700/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <span className="text-lg sm:text-2xl">🏷️</span>
                  <span className="text-xs sm:text-sm font-medium text-teal-600 dark:text-teal-400">Username</span>
                </div>
                <div className="font-bold text-base sm:text-lg lg:text-xl text-teal-700 dark:text-teal-300 break-all">@{username}</div>
              </div>
            )}
            
            {dateOfBirth && (
              <div className="rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200/50 dark:border-orange-700/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <span className="text-lg sm:text-2xl">🎂</span>
                  <span className="text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400">Birthday</span>
                </div>
                <div className="font-bold text-base sm:text-lg lg:text-xl text-orange-700 dark:text-orange-300">{new Date(dateOfBirth).toLocaleDateString()}</div>
              </div>
            )}
          </div>
          
          {/* Enhanced Profile Information - Mobile Optimized */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {profile.name && (
              <div className="rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 border border-cyan-200/50 dark:border-cyan-700/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-lg sm:text-2xl">📝</span>
                  <span className="text-xs sm:text-sm font-semibold text-cyan-600 dark:text-cyan-400">Name</span>
                </div>
                <div className="font-bold text-base sm:text-lg lg:text-xl text-cyan-700 dark:text-cyan-300 break-words">{profile.name}</div>
              </div>
            )}

            {place && (
              <div className="rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 border border-cyan-200/50 dark:border-cyan-700/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-lg sm:text-2xl">📍</span>
                  <span className="text-xs sm:text-sm font-semibold text-cyan-600 dark:text-cyan-400">Location</span>
                </div>
                <div className="font-bold text-base sm:text-lg lg:text-xl text-cyan-700 dark:text-cyan-300 break-words">{place}</div>
              </div>
            )}

            {(bio || profile.bio) && (
              <div className="rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200/50 dark:border-orange-700/50 lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-lg sm:text-2xl">📝</span>
                  <span className="text-xs sm:text-sm font-semibold text-orange-700 dark:text-orange-300">Bio</span>
                </div>
                <div className="pl-2 sm:pl-4 border-l-2 sm:border-l-4 border-orange-300 dark:border-orange-600/70">
                  <div className="whitespace-pre-wrap text-sm sm:text-base lg:text-lg leading-relaxed text-orange-900/90 dark:text-orange-100/90 break-words">
                    {bio || profile.bio}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {info && (
            <div className="mt-4 sm:mt-6 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 border border-teal-200/50 dark:border-teal-700/50">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <span className="text-lg sm:text-2xl">ℹ️</span>
                <span className="text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400">Additional Information</span>
              </div>
              <div className="font-medium whitespace-pre-wrap text-sm sm:text-base lg:text-lg leading-relaxed text-teal-700 dark:text-teal-300 break-words">{info}</div>
            </div>
          )}
        </div>

      {/* Followers/Following Modal */}
      <Modal
        open={listOpen}
        onClose={() => setListOpen(false)}
        title={listType === 'followers' ? 'Followers' : 'Following'}
      >
        {listLoading ? (
          <div className="p-3 sm:p-4 text-gray-600 dark:text-gray-300 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm sm:text-base">Loading...</span>
            </div>
          </div>
        ) : listItems.length === 0 ? (
          <div className="p-3 sm:p-4 text-gray-600 dark:text-gray-300 text-center">
            <span className="text-sm sm:text-base">No users to show</span>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[60vh] sm:max-h-[65vh] overflow-y-auto pr-1">
            {listItems.map(u => (
              <div key={u._id} className="flex items-center justify-between py-2 sm:py-3 px-1">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <Link to={`/users/${u._id}`} onClick={() => setListOpen(false)} className="flex-shrink-0">
                    <img src={u.avatarUrl || `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"28\" height=\"28\"><rect width=\"28\" height=\"28\" fill=\"#e5e7eb\"/><text x=\"14\" y=\"18\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"11\" fill=\"#6b7280\">U</text></svg>')}`} alt="" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link to={`/users/${u._id}`} onClick={() => setListOpen(false)} className="block">
                      <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate font-medium">{u.name}</div>
                    </Link>
                    <div className="text-xs text-gray-500 truncate">
                      {u.username && (
                        <Link to={`/users/${u._id}`} onClick={() => setListOpen(false)} className="hover:underline">
                          @{u.username}
                        </Link>
                      )}
                      {u.place ? ` · ${u.place}` : ''}
                    </div>
                  </div>
                </div>
                {authUser && authUser.id !== u._id && (
                  <button
                    onClick={() => toggleFollowFromList(u._id, u.isFollowing)}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-shrink-0 ${u.isFollowing ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600' : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}
                  >
                    <span className="hidden sm:inline">{u.isFollowing ? 'Unfollow' : 'Follow'}</span>
                    <span className="sm:hidden">{u.isFollowing ? '✓' : '+'}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </Modal>

        {/* Enhanced Edit Form - Mobile Optimized */}
        {isOwn && (
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <span className="text-2xl sm:text-3xl">✏️</span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
            </div>
          
            <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">
              {/* Personal Information Section - Mobile Optimized */}
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-cyan-200/50 dark:border-cyan-700/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <span className="text-xl sm:text-2xl">👤</span>
                  <h3 className="text-base sm:text-lg font-bold text-cyan-800 dark:text-cyan-200">Personal Information</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-cyan-700 dark:text-cyan-300">
                      👤 First Name
                    </label>
                    <input 
                      value={firstName} 
                      onChange={e => setFirstName(e.target.value)} 
                      className="w-full border-2 border-cyan-200 dark:border-cyan-700 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base" 
                      placeholder="Enter your first name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-cyan-700 dark:text-cyan-300">
                      👤 Last Name
                    </label>
                    <input 
                      value={lastName} 
                      onChange={e => setLastName(e.target.value)} 
                      className="w-full border-2 border-cyan-200 dark:border-cyan-700 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base" 
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
              </div>

              {/* Account Information Section - Mobile Optimized */}
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-teal-200/50 dark:border-teal-700/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <span className="text-xl sm:text-2xl">🏷️</span>
                  <h3 className="text-base sm:text-lg font-bold text-teal-800 dark:text-teal-200">Account Information</h3>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-teal-700 dark:text-teal-300">
                    🏷️ Username
                  </label>
                  <input 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    className="w-full border-2 border-teal-200 dark:border-teal-700 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base" 
                    placeholder="Choose a unique username"
                  />
                  <p className="text-xs mt-2 text-teal-600 dark:text-teal-400">
                    Lowercase, 2-30 characters. Must be unique.
                  </p>
                </div>
              </div>

              {/* Additional Information Section - Mobile Optimized */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-200/50 dark:border-emerald-700/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <span className="text-xl sm:text-2xl">📍</span>
                  <h3 className="text-base sm:text-lg font-bold text-emerald-800 dark:text-emerald-200">Additional Information</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-emerald-700 dark:text-emerald-300">
                      📅 Date of Birth
                    </label>
                    <input 
                      type="date"
                      value={dateOfBirth} 
                      onChange={e => setDateOfBirth(e.target.value)} 
                      className="w-full border-2 border-emerald-200 dark:border-emerald-700 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-emerald-700 dark:text-emerald-300">
                      📍 Place
                    </label>
                    <input 
                      value={place} 
                      onChange={e => setPlace(e.target.value)} 
                      className="w-full border-2 border-emerald-200 dark:border-emerald-700 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base" 
                      placeholder="Where are you from?"
                    />
                  </div>
                </div>
              </div>
            
              {/* Bio and Info Section - Mobile Optimized */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-200/50 dark:border-orange-700/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <span className="text-xl sm:text-2xl">📝</span>
                  <h3 className="text-base sm:text-lg font-bold text-orange-800 dark:text-orange-200">About You</h3>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-orange-700 dark:text-orange-300">
                      📝 Bio
                    </label>
                    <textarea 
                      value={bio} 
                      onChange={e => setBio(e.target.value)} 
                      rows={3} 
                      className="w-full border-2 border-orange-200 dark:border-orange-700 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 backdrop-blur-sm resize-none text-sm sm:text-base" 
                      placeholder="Tell us about yourself..."
                    />
                    <p className="text-xs mt-2 text-orange-600 dark:text-orange-400">
                      {bio.length}/200 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-orange-700 dark:text-orange-300">
                      ℹ️ Additional Info
                    </label>
                    <textarea 
                      value={info} 
                      onChange={e => setInfo(e.target.value)} 
                      rows={3} 
                      className="w-full border-2 border-orange-200 dark:border-orange-700 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 backdrop-blur-sm resize-none text-sm sm:text-base" 
                      placeholder="Share more about yourself, interests, hobbies..."
                    />
                    <p className="text-xs mt-2 text-orange-600 dark:text-orange-400">
                      {info.length}/500 characters
                    </p>
                  </div>
                </div>
              </div>
            
              {/* Avatar Upload Section - Mobile Optimized */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200/50 dark:border-blue-700/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <span className="text-xl sm:text-2xl">🖼️</span>
                  <h3 className="text-base sm:text-lg font-bold text-blue-800 dark:text-blue-200">Profile Picture</h3>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-blue-700 dark:text-blue-300">
                    🖼️ Upload New Picture
                  </label>
                  <input 
                    ref={fileInputRef} 
                    type="file" 
                    accept="image/*" 
                    onChange={e => setAvatarFile(e.target.files?.[0] || null)} 
                    className="w-full border-2 border-blue-200 dark:border-blue-700 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base" 
                  />
                  {avatarFile && (
                    <div className="mt-3 p-3 bg-teal-100 dark:bg-teal-900/30 border border-teal-300 dark:border-teal-700 rounded-lg sm:rounded-xl">
                      <p className="text-xs sm:text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                        <span className="text-sm sm:text-lg">✅</span>
                        <span className="truncate">New image selected: <span className="font-semibold">{avatarFile.name}</span></span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Enhanced Action Buttons - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className={`flex-1 px-6 sm:px-8 py-3 sm:py-4 text-white rounded-xl sm:rounded-2xl transition-all duration-300 font-semibold shadow-lg flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base ${
                    isSaving 
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-75' 
                      : 'bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 hover:shadow-xl hover:scale-105'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg sm:text-xl">💾</span>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                {profile.avatarUrl && (
                  <button 
                    type="button" 
                    onClick={handleRemoveAvatar}
                    disabled={isRemovingAvatar}
                    className={`px-6 sm:px-8 py-3 sm:py-4 text-white rounded-xl sm:rounded-2xl transition-all duration-300 font-semibold shadow-lg flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base ${
                      isRemovingAvatar 
                        ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-75' 
                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:scale-105'
                    }`}
                  >
                    {isRemovingAvatar ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Removing...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg sm:text-xl">🗑️</span>
                        <span>Remove Avatar</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
          </form>
        </div>
      )}

        {/* Enhanced Password Update Section - Mobile Optimized */}
        {isOwn && (
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl">🔒</span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Password Security</h2>
              </div>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base ${
                  showPasswordForm 
                    ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700' 
                    : 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white hover:from-cyan-700 hover:to-cyan-800'
                }`}
              >
                {showPasswordForm ? '🔒 Hide Form' : '🔑 Change Password'}
              </button>
            </div>
          
          {passwordSuccess && (
            <div className="p-3 sm:p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg sm:rounded-xl mb-4 sm:mb-6">
              <p className="text-green-600 dark:text-green-400 text-sm sm:text-base">{passwordSuccess}</p>
            </div>
          )}
          
            {showPasswordForm && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-blue-200/50 dark:border-blue-700/50">
                <form onSubmit={handlePasswordUpdate} className="space-y-3 sm:space-y-4 lg:space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-blue-700 dark:text-blue-300">
                      🔑 Current Password
                    </label>
                    <input 
                      type="password"
                      value={currentPassword} 
                      onChange={e => setCurrentPassword(e.target.value)} 
                      className="w-full border-2 border-blue-200 dark:border-blue-700 rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base" 
                      placeholder="Enter your current password"
                      required
                    />
                  </div>
              
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-blue-700 dark:text-blue-300">
                      🔐 New Password
                    </label>
                    <input 
                      type="password"
                      value={newPassword} 
                      onChange={e => setNewPassword(e.target.value)} 
                      className="w-full border-2 border-blue-200 dark:border-blue-700 rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base" 
                      placeholder="Enter your new password"
                      required
                    />
                    <PasswordStrengthIndicator password={newPassword} />
                  </div>
              
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-blue-700 dark:text-blue-300">
                      🔐 Confirm New Password
                    </label>
                    <input 
                      type="password"
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)} 
                      className="w-full border-2 border-blue-200 dark:border-blue-700 rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base" 
                      placeholder="Confirm your new password"
                      required
                    />
                  </div>
                  
                  {passwordError && (
                    <div className="p-2.5 sm:p-3 lg:p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg sm:rounded-xl">
                      <p className="text-red-700 dark:text-red-300 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base">
                        <span className="text-sm sm:text-base lg:text-lg">⚠️</span>
                        {passwordError}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
                    <button 
                      type="submit" 
                      disabled={isUpdatingPassword}
                      className={`flex-1 px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 text-white rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-300 font-semibold shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-3 text-xs sm:text-sm lg:text-base ${
                        isUpdatingPassword 
                          ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-75' 
                          : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 hover:shadow-xl hover:scale-105'
                      }`}
                    >
                      {isUpdatingPassword ? (
                        <>
                          <div className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm sm:text-lg lg:text-xl">🔐</span>
                          <span>Update Password</span>
                        </>
                      )}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowPasswordForm(false);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                        setPasswordError('');
                        setPasswordSuccess('');
                      }}
                      className="px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg sm:rounded-xl lg:rounded-2xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-3 text-xs sm:text-sm lg:text-base"
                    >
                      <span className="text-sm sm:text-lg lg:text-xl">❌</span>
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
        </div>
      )}

        {/* Enhanced Account Deletion Section - Mobile Optimized */}
        {isOwn && (
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-2 border-red-200 dark:border-red-800 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl">⚠️</span>
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 dark:text-red-400">
                    Danger Zone
                  </h2>
                  <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mt-1">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteForm(!showDeleteForm)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base ${
                  showDeleteForm 
                    ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700' 
                    : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
                }`}
              >
                {showDeleteForm ? '⚠️ Hide Form' : '🗑️ Delete Account'}
              </button>
            </div>
          
            {showDeleteForm && (
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-red-200 dark:border-red-700">
                <div className="mb-3 sm:mb-4 lg:mb-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-red-600 dark:text-red-400 mb-1.5 sm:mb-2 lg:mb-3 flex items-center gap-1.5 sm:gap-2">
                    <span className="text-lg sm:text-xl lg:text-2xl">⚠️</span>
                    Are you absolutely sure?
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                  </p>
                </div>
              
              <form onSubmit={handleAccountDeletion} className="space-y-3 sm:space-y-4 lg:space-y-5">
                {!profile.isGoogleUser && (
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-red-700 dark:text-red-300">
                      🔑 Enter your password to confirm
                    </label>
                    <input 
                      type="password"
                      value={deletePassword} 
                      onChange={e => setDeletePassword(e.target.value)} 
                      className="w-full border-2 border-red-200 dark:border-red-700 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base" 
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-red-700 dark:text-red-300">
                    Type <span className="font-bold text-red-600 bg-red-100 dark:bg-red-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">DELETE</span> to confirm
                  </label>
                  <input 
                    type="text"
                    value={deleteConfirmText} 
                    onChange={e => setDeleteConfirmText(e.target.value)} 
                    className="w-full border-2 border-red-200 dark:border-red-700 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base" 
                    placeholder="Type DELETE"
                    required
                  />
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-2 border-red-300 dark:border-red-600 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-5">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-lg sm:text-xl lg:text-2xl flex-shrink-0 mt-0.5">⚠️</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base lg:text-lg font-bold text-red-800 dark:text-red-200 mb-2 sm:mb-3">
                        Final Warning
                      </h4>
                      <div className="text-xs sm:text-sm text-red-700 dark:text-red-300">
                        <p className="font-semibold text-red-800 dark:text-red-200 mb-2 sm:mb-3">
                          By proceeding, you acknowledge that:
                        </p>
                        <div className="space-y-1 sm:space-y-1.5">
                          <div className="flex items-start gap-2">
                            <span className="text-red-500 dark:text-red-400 mt-0.5">•</span>
                            <span className="text-red-600 dark:text-red-400 text-xs sm:text-sm">My account and all associated data will be permanently deleted</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-red-500 dark:text-red-400 mt-0.5">•</span>
                            <span className="text-red-600 dark:text-red-400 text-xs sm:text-sm">This action cannot be undone or reversed</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-red-500 dark:text-red-400 mt-0.5">•</span>
                            <span className="text-red-600 dark:text-red-400 text-xs sm:text-sm">All my posts, comments, and profile information will be removed</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-red-500 dark:text-red-400 mt-0.5">•</span>
                            <span className="text-red-600 dark:text-red-400 text-xs sm:text-sm">I will lose access to all my content and account features</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-red-500 dark:text-red-400 mt-0.5">•</span>
                            <span className="text-red-600 dark:text-red-400 text-xs sm:text-sm">I will need to create a new account if I want to use the platform again</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 mt-4 sm:mt-5">
                  <button 
                    type="submit" 
                    className={`flex-1 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-white rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-300 font-semibold shadow-lg flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base ${
                      isDeletingAccount || deleteConfirmText !== 'DELETE' || (!profile.isGoogleUser && !deletePassword)
                        ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-75' 
                        : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:scale-105'
                    }`}
                    disabled={isDeletingAccount || deleteConfirmText !== 'DELETE' || (!profile.isGoogleUser && !deletePassword)}
                  >
                    {isDeletingAccount ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-base sm:text-lg lg:text-xl">🗑️</span>
                        <span>Delete My Account</span>
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowDeleteForm(false);
                      setDeletePassword('');
                      setDeleteConfirmText('');
                      setDeleteError('');
                      setAcceptTerms(false);
                    }}
                    className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg sm:rounded-xl lg:rounded-2xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                  >
                    <span className="text-base sm:text-lg lg:text-xl">❌</span>
                    <span>Cancel</span>
                  </button>
                </div>
                
                {deleteError && (
                  <div className="p-2.5 sm:p-3 lg:p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg sm:rounded-xl">
                    <p className="text-red-700 dark:text-red-300 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base">
                      <span className="text-sm sm:text-base lg:text-lg">⚠️</span>
                      {deleteError}
                    </p>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}

// Enhanced mobile-responsive modal
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md mx-2 sm:mx-4 p-3 sm:p-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-3 sm:mb-4 flex-shrink-0">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate pr-2">{title}</h4>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <span className="text-lg sm:text-xl">✖</span>
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}



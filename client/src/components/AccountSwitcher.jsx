import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function AccountSwitcher({ isMobile = false, onMobileMenuClose }) {
  const { user, accounts, switchAccount, removeAccount, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [switchingAccount, setSwitchingAccount] = useState(null);

  const handleSwitchAccount = async (account) => {
    console.log('Switching to account:', account.user.name);
    setSwitchingAccount(account.user.id);
    
    try {
      // Validate the token before switching
      console.log('Validating token for account:', account.user.name);
      const response = await api.post('/accounts/validate-token', { token: account.token });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Token validation response:', data);
      
      if (data.valid) {
        console.log('Token is valid, switching account...');
        switchAccount(account);
        setIsOpen(false);
        // Close mobile menu if in mobile context
        if (isMobile && onMobileMenuClose) {
          console.log('Closing mobile menu...');
          onMobileMenuClose();
        }
        // Refresh the page to update all components
        console.log('Refreshing page...');
        window.location.reload();
      } else {
        // Show a more user-friendly error message
        const errorMsg = data.error || 'This account session has expired. Please log in again.';
        console.log('Token validation failed:', errorMsg);
        if (confirm(`${errorMsg}\n\nWould you like to remove this account from your saved accounts?`)) {
          removeAccount(account.user.id);
        }
      }
    } catch (error) {
      console.error('Error validating token:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      
      // Offer fallback option to switch without validation
      const shouldTryFallback = confirm(`Error switching account: ${errorMessage}\n\nWould you like to try switching anyway? (This might work if it's just a network issue)`);
      
      if (shouldTryFallback) {
        try {
          console.log('Attempting fallback switch...');
          switchAccount(account);
          setIsOpen(false);
          if (isMobile && onMobileMenuClose) {
            onMobileMenuClose();
          }
          window.location.reload();
        } catch (fallbackError) {
          console.error('Fallback switch also failed:', fallbackError);
          if (confirm('Fallback switch also failed. Would you like to remove this account from your saved accounts?')) {
            removeAccount(account.user.id);
          }
        }
      } else if (confirm('Would you like to remove this account from your saved accounts?')) {
        removeAccount(account.user.id);
      }
    } finally {
      setSwitchingAccount(null);
    }
  };

  const handleRemoveAccount = (accountId, e) => {
    e.stopPropagation();
    const account = accounts.find(acc => acc.user.id === accountId);
    const accountName = account ? account.user.name : 'this account';
    
    if (confirm(`Are you sure you want to remove "${accountName}" from your saved accounts?\n\nYou can always add it back by logging in again.`)) {
      removeAccount(accountId);
    }
  };

  const handleAddAccount = () => {
    setIsOpen(false);
    // Close mobile menu if in mobile context
    if (isMobile && onMobileMenuClose) {
      onMobileMenuClose();
    }
    // Logout current user and go to login page
    logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Generate avatar with user initials
  const generateAvatarWithInitials = (name, size = 32) => {
    const initials = name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
    ];
    const colorIndex = name.length % colors.length;
    const bgColor = colors[colorIndex];
    
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
        <rect width="${size}" height="${size}" fill="${bgColor}"/>
        <text x="${size/2}" y="${size/2 + size/8}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${size/3}" font-weight="bold" fill="white">${initials}</text>
      </svg>
    `)}`;
  };

  if (!user) return null;

  // Debug: Log user and accounts data
  console.log('AccountSwitcher - Current user:', user);
  console.log('AccountSwitcher - Current user avatarUrl:', user?.avatarUrl);
  console.log('AccountSwitcher - Saved accounts:', accounts);
  accounts.forEach((account, index) => {
    console.log(`AccountSwitcher - Account ${index} (${account.user.name}) avatarUrl:`, account.user.avatarUrl);
  });

  // Mobile version - show accounts inline
  if (isMobile) {
    return (
      <div className="w-full space-y-3">
        <div className="text-sm font-medium text-white/90 mb-2">👥 Saved Accounts</div>
        
        {/* Current Account */}
        <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-3">
          <div className="flex items-center gap-3">
            <img
              src={user.avatarUrl && user.avatarUrl.trim() !== '' ? user.avatarUrl : generateAvatarWithInitials(user.name, 32)}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-blue-400"
              onError={(e) => {
                console.log('Avatar load error for current user:', user.name, 'avatarUrl:', user.avatarUrl);
                e.target.src = generateAvatarWithInitials(user.name, 32);
              }}
              onLoad={() => {
                console.log('Avatar loaded successfully for current user:', user.name, 'avatarUrl:', user.avatarUrl);
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">
                {user.name}
              </div>
              <div className="text-xs text-blue-200 truncate">
                {user.username && `@${user.username}`}
              </div>
              <div className="text-xs text-blue-300 font-medium">
                Current Account
              </div>
            </div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
        </div>

                {/* Other Saved Accounts */}
                {accounts.filter(acc => acc.user.id !== user.id).map((account) => (
                  <div
                    key={account.user.id}
                    className={`bg-white/10 border border-white/20 rounded-xl p-3 ${switchingAccount === account.user.id ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={account.user.avatarUrl && account.user.avatarUrl.trim() !== '' ? account.user.avatarUrl : generateAvatarWithInitials(account.user.name, 32)}
                        alt={account.user.name}
                        className="w-8 h-8 rounded-full object-cover border border-white/30"
                        onError={(e) => {
                          console.log('Avatar load error for saved account:', account.user.name, 'avatarUrl:', account.user.avatarUrl);
                          e.target.src = generateAvatarWithInitials(account.user.name, 32);
                        }}
                        onLoad={() => {
                          console.log('Avatar loaded successfully for saved account:', account.user.name, 'avatarUrl:', account.user.avatarUrl);
                        }}
                      />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {account.user.name}
                </div>
                <div className="text-xs text-white/70 truncate">
                  {account.user.username && `@${account.user.username}`}
                </div>
                <div className="text-xs text-white/60">
                  Added {formatDate(account.addedAt)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleRemoveAccount(account.user.id, e)}
                  className="p-2 rounded-lg hover:bg-red-500/20 active:bg-red-500/30 text-red-300 hover:text-red-200 transition-all duration-200 touch-manipulation"
                  title="Remove Account"
                  disabled={switchingAccount === account.user.id}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button
                  onClick={() => handleSwitchAccount(account)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white text-sm font-medium rounded-lg transition-all duration-200 min-w-[70px] flex items-center justify-center touch-manipulation"
                  disabled={switchingAccount === account.user.id}
                  title="Switch to this account"
                >
                  {switchingAccount === account.user.id ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Switch
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add Account Button */}
        <button
          onClick={handleAddAccount}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-white/30 text-white/80 hover:border-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="font-medium">Add Another Account</span>
        </button>

        {/* Account Stats */}
        {accounts.length > 0 && (
          <div className="text-xs text-white/60 text-center">
            {accounts.length} saved account{accounts.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    );
  }

  // Desktop version - dropdown
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
        title="Manage Accounts"
      >
        <span>👥</span>
        <span className="hidden sm:inline">Accounts</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl z-[9999] border border-white/20 dark:border-gray-700 max-w-[calc(100vw-2rem)]">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Manager</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Switch between your saved accounts</p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {/* Current Account */}
            <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatarUrl && user.avatarUrl.trim() !== '' ? user.avatarUrl : generateAvatarWithInitials(user.name, 40)}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                  onError={(e) => {
                    console.log('Desktop: Avatar load error for current user:', user.name, 'avatarUrl:', user.avatarUrl);
                    e.target.src = generateAvatarWithInitials(user.name, 40);
                  }}
                  onLoad={() => {
                    console.log('Desktop: Avatar loaded successfully for current user:', user.name, 'avatarUrl:', user.avatarUrl);
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.username && `@${user.username}`}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Current Account
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Other Saved Accounts */}
            {accounts.filter(acc => acc.user.id !== user.id).map((account) => (
              <div
                key={account.user.id}
                className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer group ${switchingAccount === account.user.id ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => handleSwitchAccount(account)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={account.user.avatarUrl && account.user.avatarUrl.trim() !== '' ? account.user.avatarUrl : generateAvatarWithInitials(account.user.name, 40)}
                    alt={account.user.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                    onError={(e) => {
                      console.log('Desktop: Avatar load error for saved account:', account.user.name, 'avatarUrl:', account.user.avatarUrl);
                      e.target.src = generateAvatarWithInitials(account.user.name, 40);
                    }}
                    onLoad={() => {
                      console.log('Desktop: Avatar loaded successfully for saved account:', account.user.name, 'avatarUrl:', account.user.avatarUrl);
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {account.user.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {account.user.username && `@${account.user.username}`}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      Added {formatDate(account.addedAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleRemoveAccount(account.user.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-all duration-200 hover:scale-110"
                      title="Remove Account"
                      disabled={switchingAccount === account.user.id}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    {switchingAccount === account.user.id ? (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Add Account Button */}
            <div className="p-3">
              <button
                onClick={handleAddAccount}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="font-medium">Add Another Account</span>
              </button>
            </div>

            {/* Account Stats */}
            {accounts.length > 0 && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {accounts.length} saved account{accounts.length !== 1 ? 's' : ''}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[999]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

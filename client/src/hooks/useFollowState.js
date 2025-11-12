import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

// Global follow state management
const followStateCache = new Map();
const followStateListeners = new Set();

// Notify all listeners when follow state changes
function notifyFollowStateChange(userId, isFollowing) {
  followStateCache.set(userId, isFollowing);
  followStateListeners.forEach(listener => {
    if (listener.userId === userId) {
      listener.callback(isFollowing);
    }
  });
}

// Custom hook for managing follow state
export function useFollowState(userId) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if we should show follow button
  const shouldShowFollow = user && userId && String(userId) !== String(user.id);

  // Load initial follow state
  useEffect(() => {
    if (!shouldShowFollow) {
      setIsFollowing(false);
      return;
    }

    // Check cache first
    if (followStateCache.has(userId)) {
      setIsFollowing(followStateCache.get(userId));
      return;
    }

    // Load from server
    let cancelled = false;
    async function loadFollowState() {
      try {
        const res = await api.get(`/users/${userId}`);
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (!cancelled && typeof data.isFollowing === 'boolean') {
          const followStatus = data.isFollowing;
          setIsFollowing(followStatus);
          followStateCache.set(userId, followStatus);
        }
      } catch (error) {
        // Silently fail - follow state will remain false
      }
    }

    loadFollowState();
    return () => { cancelled = true; };
  }, [userId, shouldShowFollow]);

  // Register listener for global updates
  useEffect(() => {
    if (!shouldShowFollow) return;

    const listener = {
      userId,
      callback: setIsFollowing
    };
    followStateListeners.add(listener);

    return () => {
      followStateListeners.delete(listener);
    };
  }, [userId, shouldShowFollow]);

  // Toggle follow function
  const toggleFollow = useCallback(async () => {
    if (!shouldShowFollow || loading) return;

    setLoading(true);
    try {
      const path = isFollowing ? `/users/${userId}/unfollow` : `/users/${userId}/follow`;
      const res = await api.post(path, {});
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data?.error || 'Action failed');
      }

      // Update global state
      const newFollowStatus = !isFollowing;
      notifyFollowStateChange(userId, newFollowStatus);
      
      return {
        success: true,
        isFollowing: newFollowStatus,
        followersCount: data.followersCount,
        followingCount: data.followingCount
      };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userId, isFollowing, loading, shouldShowFollow]);

  return {
    isFollowing,
    loading,
    shouldShowFollow,
    toggleFollow
  };
}

// Utility function to clear cache (useful for logout)
export function clearFollowStateCache() {
  followStateCache.clear();
  followStateListeners.forEach(listener => {
    listener.callback(false);
  });
}

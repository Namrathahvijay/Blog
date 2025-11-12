import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useState, Fragment } from 'react';
import { api, toMediaUrl } from '../api/client';
import { useFollowState } from '../hooks/useFollowState';
import ReportButton from './ReportButton';

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const ownerId = post && typeof post.user === 'object' ? post.user?._id : post.user;
  const isOwner = user && String(ownerId) === user.id;
  const [likes, setLikes] = useState(post.likesCount || 0);
  const [dislikes, setDislikes] = useState(post.dislikesCount || 0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentCount, setCommentCount] = useState(0);
  const [replyingTo, setReplyingTo] = useState(null); // comment id
  const [repliesOpen, setRepliesOpen] = useState({}); // map commentId -> boolean
  const [replies, setReplies] = useState({}); // map commentId -> array of replies

  // Get user info from post - Updated to handle author field
  const postUser = post.author && typeof post.author === 'object' ? post.author : null;
  const userName = postUser?.name || post.authorName || 'Unknown User';
  const userAvatar = postUser?.avatarUrl;
  const userId = postUser?._id || post.author;
  
  // Use global follow state (after userId is defined)
  const { isFollowing, loading: followLoading, shouldShowFollow, toggleFollow } = useFollowState(userId);

  // Initialize reactions state
  useEffect(() => {
    let cancelled = false;
    async function loadReactions() {
      try {
        const res = await api.get(`/posts/${post._id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        
        // Update likes count and liked status
        const likesArray = data.likes || [];
        setLikes(likesArray.length);
        if (user) {
          setLiked(likesArray.some(id => String(id) === String(user.id) || String(id) === String(user._id)));
        } else {
          setLiked(false);
        }
      } catch (err) {
        console.error('Error loading reactions:', err);
      }
    }
    loadReactions();
    return () => { cancelled = true; };
  }, [post._id, user]);

  // Load comment count lightweight
  useEffect(() => {
    let cancelled = false;
    async function loadCount() {
      try {
        const res = await api.get(`/posts/${post._id}/comments`);
        const data = await res.json();
        if (!res.ok) throw new Error();
        if (!cancelled) {
          const commentsArray = data.comments || [];
          setCommentCount(commentsArray.length);
          // Also load comments if we have them
          if (commentsArray.length > 0) {
            setComments(commentsArray);
          }
        }
      } catch (err) {
        console.error('Error loading comments:', err);
      }
    }
    loadCount();
    return () => { cancelled = true; };
  }, [post._id]);

  function requireAuth(redirectPath) {
    if (user) return true;
    navigate('/login', { replace: false, state: { from: location, next: redirectPath || location?.pathname } });
    return false;
  }

  function authNavigate(ev, targetPath) {
    if (user) return;
    ev.preventDefault();
    navigate('/login', { replace: false, state: { from: location, next: targetPath } });
  }

  async function toggleLike() {
    if (!requireAuth(`/posts/${post._id}`)) return;
    try {
      if (liked) {
        // Unlike
        const res = await api.del(`/posts/${post._id}/like`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setLikes(data.likesCount || likes - 1);
        setLiked(false);
      } else {
        // Like
        const res = await api.post(`/posts/${post._id}/like`, {});
        if (!res.ok) throw new Error();
        const data = await res.json();
        setLikes(data.likesCount || likes + 1);
        setLiked(true);
        // Remove dislike if it was active
        setDisliked(false);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  }

  async function handleUnlike() {
    if (!requireAuth(`/posts/${post._id}`)) return;
    try {
      if (liked) {
        // Remove the like
        const res = await api.del(`/posts/${post._id}/like`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setLikes(data.likesCount || likes - 1);
        setLiked(false);
      }
    } catch (err) {
      console.error('Error unliking:', err);
    }
  }

  async function toggleDislike() {
    if (!requireAuth(`/posts/${post._id}`)) return;
    // Dislike functionality not implemented yet
    console.log('Dislike feature coming soon!');
  }

  async function openComments() {
    if (!requireAuth(`/posts/${post._id}#comments`)) return;
    navigate(`/posts/${post._id}#comments`);
  }

  async function submitComment(parent = null) {
    if (!user) {
      console.log('No user logged in');
      return;
    }
    const text = (newComment || '').trim();
    if (!text) {
      console.log('No comment text');
      return;
    }
    console.log('Submitting comment:', { postId: post._id, text });
    try {
      const res = await api.post(`/posts/${post._id}/comments`, { text });
      console.log('Comment response status:', res.status);
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Comment submission failed:', errorData);
        throw new Error(errorData.error || 'Failed to submit comment');
      }
      const data = await res.json();
      console.log('Comment submitted successfully:', data);
      setComments(prev => [data.comment, ...prev]);
      setNewComment('');
      setCommentCount(data.commentsCount || commentCount + 1);
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert('Failed to post comment: ' + err.message);
    }
  }

  async function loadReplies(parentId) {
    try {
      const res = await api.get(`/posts/${post._id}/comments?parent=${parentId}`);
      const data = await res.json();
      if (!res.ok) throw new Error();
      setReplies(prev => ({ ...prev, [parentId]: data.data || [] }));
    } catch {
      setReplies(prev => ({ ...prev, [parentId]: [] }));
    }
  }

  async function toggleCommentLike(commentId, type) { // type: 'like' | 'dislike'
    if (!user) return;
    try {
      const res = await api.post(`/posts/${post._id}/comments/${commentId}/reaction`, { type });
      const counts = await res.json();
      if (!res.ok) throw new Error();
      const upd = (list) => (list || []).map(c => c._id === commentId ? { ...c, likes: new Array(counts.likes).fill(0), dislikes: new Array(counts.dislikes).fill(0) } : c);
      setComments(prev => upd(prev));
      setReplies(prev => {
        const out = { ...prev };
        Object.keys(out).forEach(pid => { out[pid] = upd(out[pid]); });
        return out;
      });
    } catch {}
  }

  async function handleToggleFollow(ev) {
    ev.preventDefault();
    if (!shouldShowFollow || followLoading) return;
    try {
      await toggleFollow();
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  function getDocumentIcon(mimeType) {
    if (!mimeType) return '📄';
    if (mimeType.includes('pdf')) return '📕';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📘';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📗';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📙';
    if (mimeType.includes('text')) return '📝';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '🗜️';
    return '📄';
  }

  function formatFileSize(bytes) {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  function getDocumentFilename() {
    if (post?.docOriginalName) return post.docOriginalName;
    const base = (post?.title || 'document').replace(/[^a-z0-9\-_. ]/gi, '').trim() || 'document';
    const mime = post?.docMimeType || post?.mediaMimeType || '';
    const fromMime = (
      mime.includes('pdf') ? 'pdf' :
      mime.includes('msword') ? 'doc' :
      mime.includes('wordprocessingml') ? 'docx' :
      mime.includes('presentationml') ? 'pptx' :
      mime.includes('powerpoint') ? 'ppt' :
      mime.includes('spreadsheetml') ? 'xlsx' :
      mime.includes('excel') ? 'xls' :
      mime.startsWith('text/') ? 'txt' : ''
    );
    if (fromMime) return `${base}.${fromMime}`;
    return base;
  }





  return (
    <Fragment>
    <article className="group bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-200 ease-out flex flex-col border border-white/20 dark:border-gray-700/50 hover:scale-[1.02] hover:-translate-y-1 will-change-transform overflow-hidden">
      {/* Enhanced Media */}
      {post.type === 'image' && post.mediaUrl && (
        <Link to={`/posts/${post._id}`} className="relative block group/media" onClick={(e) => authNavigate(e, `/posts/${post._id}`)}>
          <div className="relative overflow-hidden rounded-t-3xl">
            {Array.isArray(post.mediaUrl) ? (
              // Multiple images gallery
              <div className="grid grid-cols-2 gap-1 max-h-[60vh] sm:h-56">
                {post.mediaUrl.slice(0, 4).map((url, index) => (
                  <div key={index} className="relative overflow-hidden">
                    <img 
                      src={toMediaUrl(url)} 
                      alt={`Image ${index + 1}`} 
                      className="w-full h-full object-cover group-hover/media:scale-102 transition-transform duration-500 ease-out"
                      style={{ aspectRatio: '1/1' }}
                      onError={(e) => {
                        console.error('Failed to load image:', url);
                        e.target.style.display = 'none';
                      }}
                    />
                    {index === 3 && post.mediaUrl.length > 4 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-lg font-bold">+{post.mediaUrl.length - 4}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // Single image
              <img 
                src={toMediaUrl(post.mediaUrl)} 
                alt="" 
                className="w-full object-cover max-h-[60vh] sm:h-56 group-hover/media:scale-102 transition-transform duration-500 ease-out" 
                onError={(e) => {
                  console.error('Failed to load image:', post.mediaUrl);
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl px-3 py-1 shadow-lg">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                📸 {Array.isArray(post.mediaUrl) ? `${post.mediaUrl.length} Images` : 'Image'}
              </span>
            </div>
          </div>
        </Link>
      )}
      {post.type === 'video' && post.mediaUrl && (
        <Link to={`/posts/${post._id}`} className="relative block group/media" onClick={(e) => authNavigate(e, `/posts/${post._id}`)}>
          <div className="relative overflow-hidden rounded-t-3xl">
            <video src={toMediaUrl(post.mediaUrl)} className="w-full max-h-[60vh] sm:max-h-80 group-hover/media:scale-102 transition-transform duration-500 ease-out" controls preload="metadata" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl px-3 py-1 shadow-lg">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">🎥 Video</span>
            </div>
            {typeof post.videoDurationSec === 'number' && (
              <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-2xl text-sm font-semibold shadow-lg">
                ⏱️ {Math.floor(post.videoDurationSec / 60)}:{String(post.videoDurationSec % 60).padStart(2, '0')}
              </div>
            )}
          </div>
        </Link>
      )}
      {post.type === 'document' && post.mediaUrl && (
        <Link to={`/posts/${post._id}`} className="block group/document" onClick={(e) => authNavigate(e, `/posts/${post._id}`)}>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-t-3xl p-6 hover:shadow-xl transition-all duration-200 ease-out group-hover/document:scale-[1.02]">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center group-hover/document:scale-105 group-hover/document:rotate-3 transition-all duration-200 ease-out">
                  <span className="text-3xl">{getDocumentIcon(post.docMimeType || post.mediaMimeType)}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover/document:text-blue-600 dark:group-hover/document:text-blue-400 transition-colors">
                  {getDocumentFilename()}
                </h3>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                    📏 {formatFileSize(post.docSize)}
                  </span>
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-lg">
                    👆 Click to view
                  </span>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Document</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center group-hover/document:bg-blue-200 dark:group-hover/document:bg-blue-800 group-hover/document:scale-110 transition-all duration-200 ease-out">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}
      {post.type === 'article' && (
        <div className="p-4">
          <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none whitespace-pre-wrap">{post.articleContent || post.body}</div>
        </div>
      )}
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        {/* Enhanced User info header */}
        <div className="flex items-start justify-between gap-1 mb-4 w-full">
          <Link 
            to={userId ? `/users/${userId}` : '#'} 
            className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 ease-out group/user flex-shrink-0 min-w-0"
            onClick={(e) => { if (!userId) return; authNavigate(e, `/users/${userId}`); }}
          >
            <div className="relative">
              <img
                src={userAvatar || `data:image/svg+xml;base64,${btoa(`
                  <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="40" fill="#e5e7eb"/>
                    <text x="20" y="25" text-anchor="middle" font-family="Arial" font-size="16" fill="#6b7280">U</text>
                  </svg>
                `)}`}
                alt={userName}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-white/50 dark:border-gray-600/50 shadow-md group-hover/user:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover/user:text-blue-600 dark:group-hover/user:text-blue-400 transition-colors truncate">{userName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {shouldShowFollow && (
              <button
                onClick={handleToggleFollow}
                disabled={followLoading}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${isFollowing ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300' : 'bg-cyan-500 text-white hover:bg-cyan-600'} ${followLoading ? 'opacity-50' : ''}`}
              >
                {followLoading ? '...' : (isFollowing ? 'Following' : 'Follow')}
              </button>
            )}
            {isOwner && (
              <div className="flex gap-1">
                <Link 
                  className="p-2 bg-cyan-500 text-white text-sm rounded-lg hover:bg-cyan-600" 
                  to={`/edit/${post._id}`}
                  title="Edit"
                >
                  ✏️
                </Link>
                <button 
                  className="p-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600" 
                  onClick={() => onDelete(post._id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            )}
            {!isOwner && user && (
              <ReportButton 
                key={`report-post-${post._id}`}
                targetType="post" 
                targetId={post._id} 
                targetTitle={post.title}
                className="p-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600"
              />
            )}
          </div>
        </div>

        {/* Post Title */}
        <Link to={`/posts/${post._id}`} className="block mb-3" onClick={(e) => authNavigate(e, `/posts/${post._id}`)}>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        {/* Post Body */}
        {post.type !== 'article' && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">{post.body}</p>
        )}

        {/* Actions */}
        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleLike} 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${liked ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                <span>{liked ? '💚' : '👍'}</span>
                <span>{likes}</span>
              </button>
              <button
                onClick={() => setCommentOpen(true)} 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                <span>💬</span>
                <span>{commentCount}</span>
              </button>
            </div>
            <Link 
              to={`/posts/${post._id}`} 
              className="px-4 py-1.5 bg-cyan-500 text-white text-sm font-medium rounded-lg hover:bg-cyan-600 transition-all"
              onClick={(e) => authNavigate(e, `/posts/${post._id}`)}
            >
              Read more
            </Link>
          </div>
        </div>
      </div>
    </article>

    {/* Enhanced Comments Modal */}
    {commentOpen && (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
        {/* Enhanced backdrop with blur */}
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
          onClick={() => setCommentOpen(false)} 
        />
        
        {/* Enhanced modal container */}
        <div className="relative bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col animate-slideUp sm:animate-scaleIn">
          {/* Enhanced header */}
          <div className="sticky top-0 z-10 bg-gradient-to-b from-white to-white/95 dark:from-gray-800 dark:to-gray-800/95 backdrop-blur-sm p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-lg">💬</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Comments</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</p>
                </div>
              </div>
              <button 
                onClick={() => setCommentOpen(false)} 
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="Close comments"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>
          </div>

          {/* Enhanced comment input - moved to top */}
          {user && (
            <div className="p-4 sm:p-5 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex gap-3">
                <img
                  src={user.avatarUrl || `data:image/svg+xml;base64,${btoa(`
                    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                      <rect width="40" height="40" fill="#e5e7eb"/>
                      <text x="20" y="25" text-anchor="middle" font-family="Arial" font-size="16" fill="#6b7280">U</text>
                    </svg>
                  `)}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 flex-shrink-0 shadow-sm"
                />
                <div className="flex-1">
                  <textarea 
                    value={newComment} 
                    onChange={e => setNewComment(e.target.value)} 
                    placeholder="Write a comment..." 
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none shadow-sm" 
                  />
                  <div className="flex justify-end mt-2">
                    <button 
                      onClick={() => submitComment(null)} 
                      disabled={!newComment.trim()}
                      className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
                    >
                      <span>📝</span>
                      <span>Post Comment</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced comments list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-gray-50/50 dark:bg-gray-900/20">
            {commentLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-cyan-200 dark:border-cyan-800 border-t-cyan-600 dark:border-t-cyan-400 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 animate-bounce">💭</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No comments yet</h3>
                <p className="text-gray-600 dark:text-gray-400">Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-4">
              {comments.map(c => (
                <div key={c._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
                  <div className="flex gap-4 p-4">
                    {/* Avatar - Left */}
                    <Link to={`/users/${c.user?._id || c.user}`} className="flex-shrink-0 group">
                      <img 
                        src={c.user?.avatarUrl || `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="#e5e7eb"/><text x="20" y="25" text-anchor="middle" font-family="Arial" font-size="16" fill="#6b7280">U</text></svg>')}`} 
                        alt="" 
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 shadow-sm group-hover:scale-105 transition-transform duration-200" 
                      />
                    </Link>
                    
                    {/* Content - Right */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="min-w-0 flex-1">
                          <Link to={`/users/${c.user?._id || c.user}`} className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {c.user?.name || 'User'}
                          </Link>
                          {c.user?.username && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">@{c.user.username}</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap mb-3 break-words leading-relaxed">{c.text || c.body}</p>
                      
                      {/* Action buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button 
                          onClick={() => toggleCommentLike(c._id, 'like')} 
                          className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 text-xs font-medium hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-all duration-200 border border-teal-200 dark:border-teal-800 hover:shadow-sm active:scale-95"
                        >
                          👍 {(c.likes || []).length || 0}
                        </button>
                        {user && (
                          <button 
                            onClick={() => { setReplyingTo(c._id); }} 
                            className="px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 text-xs font-medium hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-all duration-200 border border-cyan-200 dark:border-cyan-800 hover:shadow-sm active:scale-95"
                          >
                            💬 Reply
                          </button>
                        )}
                        {user && String(c.user?._id || c.user) === String(user.id) && (
                          <button 
                            onClick={async () => {
                              if (!confirm('Delete this comment?')) return;
                              try {
                                const res = await api.del(`/posts/${post._id}/comments/${c._id}`);
                                if (!res.ok) throw new Error();
                                setComments(prev => prev.filter(x => x._id !== c._id));
                                setCommentCount(cnt => Math.max(0, cnt - 1));
                              } catch {}
                            }} 
                            className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 border border-red-200 dark:border-red-800 hover:shadow-sm active:scale-95"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                      {replyingTo === c._id && (
                        <div className="mt-3 p-3 bg-cyan-50 dark:bg-cyan-900/10 rounded-lg border border-cyan-200 dark:border-cyan-800 shadow-sm">
                          <div className="flex gap-2">
                            <textarea 
                              value={newComment} 
                              onChange={e => setNewComment(e.target.value)} 
                              placeholder="Write a reply..." 
                              rows="2"
                              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm shadow-sm" 
                            />
                            <div className="flex flex-col gap-2">
                              <button 
                                onClick={() => submitComment(c._id)} 
                                className="px-3 py-1.5 rounded-lg bg-cyan-500 text-white text-xs font-medium hover:bg-cyan-600 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                              >
                                📝 Reply
                              </button>
                              <button 
                                onClick={() => { setReplyingTo(null); setNewComment(''); }} 
                                className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm active:scale-95"
                              >
                                ✕ Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </Fragment>
  );
}
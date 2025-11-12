import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import PostForm from '../components/PostForm';
import { api } from '../api/client';

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);

  // pages/Edit.jsx
useEffect(() => {
  (async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to load post');
      }
      const data = await res.json();
      setInitial(data);
    } catch (e) {
      console.error('Load post error:', e.message);
      toast.error(e.message);
      navigate('/');
    }
  })();
}, [id, navigate]);


  const submit = async (vals, setUploadProgress) => {
    try {
      const fd = new FormData();
      fd.append('title', vals.title);
      fd.append('body', vals.body);
      fd.append('type', vals.type || 'text');

      // Handle different file types with progress
      if (vals.type === 'image' && vals.image) {
        // Handle multiple images
        Array.from(vals.image).forEach(file => {
          fd.append('image', file);
        });
        // Simulate upload progress for images
        setUploadProgress({ type: 'image', progress: 0 });
        for (let i = 0; i <= 100; i += 10) {
          setUploadProgress({ type: 'image', progress: i });
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } else if (vals.type === 'video' && vals.video?.[0]) {
        fd.append('video', vals.video[0]);
        // Simulate upload progress for videos
        setUploadProgress({ type: 'video', progress: 0 });
        for (let i = 0; i <= 100; i += 5) {
          setUploadProgress({ type: 'video', progress: i });
          await new Promise(resolve => setTimeout(resolve, 150));
        }
        if (typeof vals.videoStart === 'number') fd.append('videoStart', String(vals.videoStart));
        if (typeof vals.videoEnd === 'number') fd.append('videoEnd', String(vals.videoEnd));
      } else if (vals.type === 'document' && vals.document?.[0]) {
        fd.append('document', vals.document[0]);
        // Simulate upload progress for documents
        setUploadProgress({ type: 'document', progress: 0 });
        for (let i = 0; i <= 100; i += 8) {
          setUploadProgress({ type: 'document', progress: i });
          await new Promise(resolve => setTimeout(resolve, 120));
        }
      } else if (vals.type === 'article' && vals.articleContent) {
        fd.append('articleContent', vals.articleContent);
      }

      if (vals.tags) fd.append('tags', vals.tags);
      if (vals.categories) fd.append('categories', vals.categories);
      if (vals.status) fd.append('status', vals.status);
      if (vals.scheduledAt) fd.append('scheduledAt', vals.scheduledAt);

      const res = await api.put(`/posts/${id}`, fd, true);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');

      toast.success('Post updated');
      navigate('/');
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (!initial) return <div className="py-6 text-gray-600 dark:text-gray-300">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            to={`/posts/${id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 ease-out hover:scale-[1.02]"
          >
            <span>←</span>
            <span className="hidden sm:inline">Back to Post</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        <PostForm initial={initial} onSubmit={submit} submitLabel="Update" />
      </div>
    </div>
  );
}
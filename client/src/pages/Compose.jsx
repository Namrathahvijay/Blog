import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function Compose() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const submit = async (vals, setUploadProgress) => {
    try {
      console.log('Submitting post:', vals);
      
      const fd = new FormData();
      fd.append('title', vals.title);
      fd.append('body', vals.body);
      fd.append('type', vals.type || 'text');

      // Append file per type
      if (vals.type === 'image') {
        const images = vals.image;
        if (images && images.length > 0) {
          Array.from(images).forEach(img => fd.append('image', img));
          setUploadProgress({ type: 'image', progress: 0 });
          for (let i = 0; i <= 100; i += 10) {
            setUploadProgress({ type: 'image', progress: i });
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      } else if (vals.type === 'video') {
        const vid = vals.video?.[0];
        if (vid) {
          fd.append('video', vid);
          setUploadProgress({ type: 'video', progress: 0 });
          for (let i = 0; i <= 100; i += 5) {
            setUploadProgress({ type: 'video', progress: i });
            await new Promise(resolve => setTimeout(resolve, 150));
          }
        }
        if (typeof vals.videoStart === 'number') fd.append('videoStart', String(vals.videoStart));
        if (typeof vals.videoEnd === 'number') fd.append('videoEnd', String(vals.videoEnd));
      } else if (vals.type === 'document') {
        const doc = vals.document?.[0];
        if (doc) {
          fd.append('document', doc);
          setUploadProgress({ type: 'document', progress: 0 });
          for (let i = 0; i <= 100; i += 8) {
            setUploadProgress({ type: 'document', progress: i });
            await new Promise(resolve => setTimeout(resolve, 120));
          }
        }
      } else if (vals.type === 'article') {
        if (vals.articleContent) fd.append('articleContent', vals.articleContent);
      }

      if (vals.tags) fd.append('tags', vals.tags);
      if (vals.categories) fd.append('categories', vals.categories);
      if (vals.status) fd.append('status', vals.status);
      if (vals.scheduledAt) fd.append('scheduledAt', vals.scheduledAt);

      console.log('Making API request...');
      const res = await api.post('/posts', fd, true);
      console.log('Response status:', res.status);
      
      if (res.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login', { replace: true, state: { from: { pathname: '/compose' } } });
        return;
      }
      
      const data = await res.json();
      console.log('Response data:', data);
      
      if (!res.ok) {
        throw new Error(data.error || 'Create failed');
      }

      toast.success(vals.status === 'draft' ? 'Draft saved' : (vals.status === 'scheduled' ? 'Post scheduled' : 'Post published'));
      navigate('/');
    } catch (e) {
      console.error('Error creating post:', e);
      toast.error(e.message || 'Failed to create post');
    }
  };

  return <PostForm onSubmit={submit} submitLabel="Publish" />;
}
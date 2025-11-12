import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(140),
  body: z.string().min(1, 'Body is required').max(5000),
  type: z.enum(['text', 'image', 'video', 'document', 'article']).default('text'),
  image: z.any().optional(),
  video: z.any().optional(),
  document: z.any().optional(),
  articleContent: z.string().optional(),
  videoStart: z.number().int().min(0).max(150).optional(),
  videoEnd: z.number().int().min(0).max(150).optional(),
  tags: z.string().optional(),
  categories: z.string().optional(),
  status: z.enum(['draft','scheduled','published']).default('published'),
  scheduledAt: z.string().optional(),
});

export default function PostForm({ initial, onSubmit, submitLabel }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: { title: '', body: '', type: 'text', image: undefined, video: undefined, document: undefined, articleContent: '', videoStart: 0, videoEnd: 150, tags: '', categories: '', status: 'published', scheduledAt: '' },
    resolver: zodResolver(postSchema),
  });
  const [active, setActive] = useState('text');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ type: '', progress: 0 });
  const type = watch('type');

  useEffect(() => {
    if (initial) {
      setValue('title', initial.title || '');
      setValue('body', initial.body || '');
      if (initial.type) { setValue('type', initial.type); setActive(initial.type); }
      if (initial.articleContent) setValue('articleContent', initial.articleContent);
    }
  }, [initial, setValue]);

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    setUploadProgress({ type: data.type, progress: 0 });
    
    try {
      await onSubmit(data, setUploadProgress);
    } finally {
      setIsSubmitting(false);
      setUploadProgress({ type: '', progress: 0 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">✍️</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
              Create New Post
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Share your thoughts, stories, and creativity with the world. Choose your content type and let your voice be heard.
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 sm:p-8 space-y-8">
          {/* Content Type Selector */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-sm">📝</span>
              Content Type
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { key: 'text', label: 'Text', icon: '📝', desc: 'Simple text post' },
                { key: 'image', label: 'Image', icon: '🖼️', desc: 'Photo or image' },
                { key: 'video', label: 'Video', icon: '🎬', desc: 'Video content' },
                { key: 'document', label: 'Document', icon: '📄', desc: 'File upload' },
                { key: 'article', label: 'Article', icon: '✍️', desc: 'Long form content' },
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => { setActive(tab.key); setValue('type', tab.key); }}
                  className={`group relative p-4 rounded-2xl border-2 transition-all duration-200 ease-out hover:scale-[1.02] ${
                    active === tab.key 
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-cyan-500 shadow-lg' 
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{tab.icon}</div>
                    <div className="font-semibold text-sm">{tab.label}</div>
                    <div className={`text-xs mt-1 ${active === tab.key ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {tab.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* Title and Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-900 dark:text-white">
                Post Title
              </label>
              <input 
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg" 
                placeholder="Give your post a compelling title..." 
                {...register('title')} 
              />
              {errors.title && (
                <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-900 dark:text-white">
                Content
              </label>
              <textarea 
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[150px] resize-none" 
                placeholder="Share your thoughts, stories, or ideas..." 
                {...register('body')} 
              />
              {errors.body && (
                <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.body.message}
                </p>
              )}
            </div>
          </div>
          {/* Media Upload Sections */}
          {type === 'image' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-xs">🖼️</span>
                Image Upload
              </h3>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">📸</span>
                  </div>
                  <div>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">Upload Images</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Click to browse or drag and drop (multiple images allowed)</p>
                    </label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      id="image-upload"
                      multiple
                      className="hidden" 
                      {...register('image')} 
                    />
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    Supported formats: JPG, PNG, GIF, WebP (Max 10MB each, up to 10 images)
                  </div>
                  {isSubmitting && uploadProgress.type === 'image' && (
                    <div className="w-full max-w-xs">
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Uploading images...</span>
                        <span>{uploadProgress.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {type === 'video' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-xs">🎬</span>
                Video Upload
              </h3>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-purple-400 dark:hover:border-purple-500 transition-colors duration-200">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-100 to-emerald-100 dark:from-teal-900/20 dark:to-emerald-900/20 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">🎥</span>
                  </div>
                  <div>
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">Upload Video</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Click to browse or drag and drop</p>
                    </label>
                    <input 
                      type="file" 
                      accept="video/*" 
                      id="video-upload"
                      className="hidden" 
                      {...register('video')} 
                    />
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    Supported formats: MP4, MOV, AVI, WebM (Max 2m30s)
                  </div>
                  {isSubmitting && uploadProgress.type === 'video' && (
                    <div className="w-full max-w-xs">
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Uploading video...</span>
                        <span>{uploadProgress.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/10 dark:to-emerald-900/10 rounded-2xl p-6 border border-teal-200 dark:border-teal-800">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-purple-600">⏱️</span>
                  Video Trimming (Optional)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Time (seconds)</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="150" 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" 
                      placeholder="0"
                      {...register('videoStart', { valueAsNumber: true })} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Time (seconds)</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="150" 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" 
                      placeholder="150"
                      {...register('videoEnd', { valueAsNumber: true })} 
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 flex items-center gap-2">
                  <span>💡</span>
                  If your video is longer than 2m30s, it will be automatically trimmed to the selected range.
                </p>
              </div>
            </div>
          )}

          {type === 'document' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white text-xs">📄</span>
                Document Upload
              </h3>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-orange-400 dark:hover:border-orange-500 transition-colors duration-200">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">📁</span>
                  </div>
                  <div>
                    <label htmlFor="document-upload" className="cursor-pointer">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">Upload Document</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Click to browse or drag and drop</p>
                    </label>
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx,.txt,.rtf,.odt,.ppt,.pptx,.xls,.xlsx,.csv,.zip,.rar"
                      id="document-upload"
                      className="hidden" 
                      {...register('document')} 
                    />
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    Supported formats: PDF, DOC, DOCX, TXT, RTF, ODT, PPT, PPTX, XLS, XLSX, CSV, ZIP, RAR
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    Maximum file size: 50MB
                  </div>
                  {isSubmitting && uploadProgress.type === 'document' && (
                    <div className="w-full max-w-xs">
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Uploading document...</span>
                        <span>{uploadProgress.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}


          {type === 'article' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs">✍️</span>
                Article Content
              </h3>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Write your article</label>
                <textarea 
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 min-h-[300px] resize-none" 
                  placeholder="Write your detailed article here. You can include multiple paragraphs, sections, and detailed content..." 
                  {...register('articleContent')} 
                />
              </div>
            </div>
          )}

          {/* Additional Options */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-xs">🏷️</span>
              Tags & Categories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
                <input 
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200" 
                  placeholder="e.g. travel, food, lifestyle" 
                  {...register('tags')} 
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">Separate tags with commas</p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categories</label>
                <input 
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200" 
                  placeholder="e.g. Lifestyle, Tutorials, News" 
                  {...register('categories')} 
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">Separate categories with commas</p>
              </div>
            </div>
          </div>

          {/* Publishing Options */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center text-white text-xs">⚙️</span>
              Publishing Options
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select 
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200" 
                  {...register('status')}
                >
                  <option value="published">📢 Published</option>
                  <option value="draft">📝 Draft</option>
                  <option value="scheduled">⏰ Scheduled</option>
                </select>
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Schedule Publication</label>
                <input 
                  type="datetime-local" 
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200" 
                  {...register('scheduledAt')} 
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">Leave empty for immediate publication</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`group relative px-8 py-4 text-white text-lg font-semibold rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-out shadow-lg ${
                isSubmitting 
                  ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-75' 
                  : 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 hover:scale-[1.02] hover:shadow-xl'
              }`}
            >
              <span className="flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {uploadProgress.type === 'image' ? 'Uploading Images...' : 
                     uploadProgress.type === 'video' ? 'Uploading Video...' : 
                     uploadProgress.type === 'document' ? 'Uploading Document...' :
                     'Publishing...'}
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    {submitLabel || 'Publish Post'}
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
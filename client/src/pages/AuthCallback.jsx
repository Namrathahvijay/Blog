import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import toast from 'react-hot-toast';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showTermsForm, setShowTermsForm] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    const termsRequired = searchParams.get('terms_required');

    if (error) {
      toast.error('Authentication failed. Please try again.');
      navigate('/login');
      return;
    }

    if (token) {
      if (termsRequired === 'true') {
        // Show terms acceptance form
        setShowTermsForm(true);
        localStorage.setItem('token', token);
        return;
      }

      // Normal login flow
      localStorage.setItem('token', token);
      
      // Fetch user data
      api.get('/auth/me')
              .then(async res => res.json())
              .then(async data => {
                if (data.user) {
                  // Save token + user, then ensure we have all fields by fetching /auth/me
                  login(token, data.user);
                  try {
                    const meRes = await api.get('/auth/me');
                    const meData = await meRes.json();
                    if (meRes.ok && meData?.user) {
                      login(token, meData.user);
                    }
                  } catch {}
          toast.success('Successfully logged in with Google!');
          navigate('/');
        } else {
          throw new Error('Failed to fetch user data');
        }
      })
      .catch(err => {
        console.error('Auth callback error:', err);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      });
    } else {
      toast.error('No authentication token received.');
      navigate('/login');
    }
  }, [searchParams, login, navigate]);

  const handleAcceptTerms = async (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      toast.error('You must accept the terms and conditions to continue.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/auth/accept-terms', { acceptTerms: true });
      if (response.ok) {
        const data = await response.json();
        login(localStorage.getItem('token'), data.user);
        toast.success('Terms accepted! Welcome to BlogAxis!');
        navigate('/');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to accept terms. Please try again.');
      }
    } catch (error) {
      console.error('Terms acceptance error:', error);
      toast.error('Failed to accept terms. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showTermsForm) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to BlogAxis! 🎉
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Please accept our terms and conditions to complete your account setup.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <form onSubmit={handleAcceptTerms} className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  📋 Terms and Conditions
                </h2>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
                  <p>
                    By using BlogAxis, you agree to our terms of service and privacy policy. 
                    Please review the following key points:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You must be at least 13 years old to use this platform</li>
                    <li>You are responsible for the content you post</li>
                    <li>We respect your privacy and protect your data</li>
                    <li>You can delete your account at any time</li>
                    <li>We may update these terms and will notify you of changes</li>
                  </ul>
                  <p className="mt-4">
                    <strong>Full terms:</strong> <a href="/terms" className="text-blue-600 hover:text-blue-800 dark:text-blue-400" target="_blank" rel="noopener noreferrer">Terms of Service</a> | 
                    <a href="/privacy" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 ml-2" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-600 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={acceptTerms}
                    onChange={e => setAcceptTerms(e.target.checked)}
                    className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <div className="flex-1">
                    <label htmlFor="acceptTerms" className="text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer block">
                      ✅ I have read and agree to the Terms and Conditions and Privacy Policy
                    </label>
                    <div className="text-xs text-gray-700 dark:text-gray-300 mt-2">
                      By checking this box, I acknowledge that I have read, understood, and agree to be bound by the terms and conditions.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={!acceptTerms || isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Accepting...' : 'Accept Terms & Continue'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                  }}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-6 text-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Completing authentication...</p>
      </div>
    </div>
  );
}

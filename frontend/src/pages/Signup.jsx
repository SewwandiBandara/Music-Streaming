import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { username, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        username,
        email,
        password
      });

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Redirect to profile/dashboard
        navigate('/signin');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-slate-900 to-black px-4">
        <div className="max-w-md w-full space-y-8">
        <div className="text-center ">
          <h2 className="text-4xl font-bold text-white mb-2">{t('auth.signup.title')}</h2>
          <p className="text-slate-300">{t('auth.signup.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700/50">
          {error && (
            <div className="bg-red-900/20 border border-red-400 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-200 mb-2">
                {t('auth.signup.username')}
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/70 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder={t('auth.signup.usernamePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                {t('auth.signup.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/70 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder={t('auth.signup.emailPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                {t('auth.signup.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/70 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder={t('auth.signup.passwordPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200 mb-2">
                {t('auth.signup.confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/70 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder={t('auth.signup.confirmPasswordPlaceholder')}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg transform transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? t('auth.signup.loading') : t('auth.signup.button')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg shadow-lg transform transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              {t('auth.signup.cancel')}
            </button>
          </div>

          <div className="text-center text-slate-300 text-sm">
            {t('auth.signup.haveAccount')}{' '}
            <Link to="/signin" className="text-blue-400 hover:text-blue-300 font-medium transition">
              {t('auth.signup.signin')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

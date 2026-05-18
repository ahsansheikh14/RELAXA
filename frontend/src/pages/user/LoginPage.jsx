import './LoginPage.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/relaxaApi.js';
import { API_BASE_URL, setUserToken } from '../../utils/auth.js';
import { toResetPasswordPath } from '../../utils/resetLink.js';

function LoginPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetLink, setResetLink] = useState('');
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);

  const resetAuthForm = () => {
    setFormData({ name: '', email: '', password: '' });
    setErrorMessage('');
    setInfoMessage('');
    setResetLink('');
    setShowPassword(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetAuthForm();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!isSubmitting) {
      handleAuthSubmit();
    }
  };

  const handleAuthSubmit = async () => {
    setErrorMessage('');
    setInfoMessage('');
    setResetLink('');
    setIsSubmitting(true);

    const endpoint = activeTab === 'signup' ? '/api/v1/auth/register' : '/api/v1/auth/login';
    const payload =
      activeTab === 'signup'
        ? { name: formData.name.trim(), email: formData.email.trim(), password: formData.password }
        : { email: formData.email.trim(), password: formData.password };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        if (activeTab === 'login' && result.message === 'Invalid email or password.') {
          throw new Error('Email/password mismatch. Use Forgot? to reset this email password.');
        }
        throw new Error(result.message || 'Authentication failed.');
      }

      if (result.token) {
        setUserToken(result.token);
      }
      if (result.user?.name) {
        localStorage.setItem('relaxaUserName', result.user.name);
      }

      navigate('/dashboard');
    } catch (error) {
      setErrorMessage(error.message === 'Failed to fetch' ? 'Backend is not reachable. Start the backend server first.' : error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());

  const handleForgotPassword = async () => {
    setErrorMessage('');
    setInfoMessage('');
    setResetLink('');

    const email = formData.email.trim();

    if (!email) {
      setErrorMessage('Please enter your email first.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsForgotSubmitting(true);

    try {
      const result = await authApi.forgotPassword({ email: email.trim().toLowerCase() });

      if (result.status === 404 || result.emailExists === false) {
        setErrorMessage(result.message || 'This email is not registered. Please sign up first.');
        return;
      }

      if (!result.ok) {
        throw new Error(result.message || 'Unable to process forgot password.');
      }

      if (result.resetLink) {
        setInfoMessage(
          result.message ||
            'Your email is registered. Click the button below to reset your password (valid 15 minutes).'
        );
        setResetLink(result.resetLink);
      } else {
        setInfoMessage(result.message || 'Password reset link has been sent to your registered email.');
        setResetLink('');
      }
    } catch (error) {
      setErrorMessage(error.message === 'Failed to fetch' ? 'Backend is not reachable. Start the backend server first.' : error.message);
    } finally {
      setIsForgotSubmitting(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-bg-orb top" />
      <div className="login-bg-orb bottom" />

      <main className="login-main">
        <div className="login-content">
          <header className="login-header">
            <h1 className="brand">Relaxa</h1>
            <p className="tagline">Your digital sanctuary awaits.</p>
          </header>

          <div className="login-card">
            <div className="auth-tabs">
              <button
                className={`tab ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => handleTabChange('login')}
                type="button"
              >
                Login
              </button>
              <button
                className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => handleTabChange('signup')}
                type="button"
              >
                Sign Up
              </button>
            </div>

            <form className="auth-form" onSubmit={handleFormSubmit}>
            {activeTab === 'signup' && (
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Full Name
                </label>
                <div className="input-wrap">
                  <span className="material-symbols-outlined input-icon">person</span>
                  <input
                    id="name"
                    name="name"
                    className="form-input"
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <div className="input-wrap">
                <span className="material-symbols-outlined input-icon">mail</span>
                <input
                  id="email"
                  name="email"
                  className="form-input"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <button
                  className="forgot-link"
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isForgotSubmitting || isSubmitting}
                >
                  {isForgotSubmitting ? 'Sending...' : 'Forgot?'}
                </button>
              </div>
              <div className="input-wrap">
                <span className="material-symbols-outlined input-icon">lock</span>
                <input
                  id="password"
                  name="password"
                  className="form-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  className="input-trailing"
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {errorMessage && <p className="auth-error">{errorMessage}</p>}
            {infoMessage && <p className="auth-info">{infoMessage}</p>}
            {resetLink && (
              <Link className="auth-reset-link" to={toResetPasswordPath(resetLink)}>
                Reset password now
              </Link>
            )}

            <button className="submit-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : 'Enter Sanctuary'}
            </button>
            </form>

          </div>
        </div>

        <aside className="zen-sidebar">
          <div className="zen-progress">
            <div className="zen-progress-fill" />
          </div>
          <p>MINDFULNESS PHASE 01</p>
        </aside>
      </main>

      <footer className="login-footer">
        <p className="terms">
          By entering, you agree to our <a href="#/">Terms of Service</a> and <a href="#/">Privacy Policy</a>
        </p>

        <div className="reflection">
          <div className="reflection-icon">
            <span className="material-symbols-outlined">spa</span>
          </div>
          <div>
            <p className="reflection-title">Daily Reflection</p>
            <p className="reflection-sub">"Calm is a superpower."</p>
          </div>
        </div>

        <p className="login-admin-portal">
          Administrator? <Link to="/admin/login">Admin portal</Link>
        </p>
      </footer>

      <img
        className="login-illustration"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyVN77jCHhWehnQXxYGYMFlHTooIPMz4bBdnoTh6tQf67AHbALu-avNbfMj5cyW8eeg9Zw5pv5ytgUTG7kfmDlwmSrXQ4E-EINsSct4C76j4n4mY_QoH-R2E0kgc_BeWEqPolM7b0SWPF3NWfSdTXBrwNuP_4kl9DLqIN2lLcTXSqPF-rsGkonClgf2nlR7oJQPykXy7yX8hWLfTeZ0EsGJl7fB7WMnCWboqvYsHEIy1Ij2AZFy7f23XI7vyUblXa539Nufhz4-ZSu"
        alt="Serene mountain illustration"
      />
    </section>
  );
}

export default LoginPage;

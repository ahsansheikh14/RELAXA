import './AdminLoginPage.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/relaxaApi.js';
import { setAdminToken } from '../../utils/auth.js';

function AdminLoginPage() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: 'admin@relaxa.com',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    if (localStorage.getItem('relaxaAdminToken')) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminLogin = async () => {
    setErrorMessage('');
    setInfoMessage('');
    setIsSubmitting(true);
    try {
      const result = await adminApi.login({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      if (result.data?.token) {
        setAdminToken(result.data.token);
      }

      navigate('/admin/dashboard');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    setErrorMessage('');
    setInfoMessage('');
    setIsSubmitting(true);

    try {
      const result = await adminApi.forgotPassword({
        email: credentials.email.trim() || 'admin@relaxa.com',
      });
      setCredentials((prev) => ({
        ...prev,
        email: result.data?.email || 'admin@relaxa.com',
      }));
      setInfoMessage(
        `Default admin password restored. Email: ${result.data?.email || 'admin@relaxa.com'} | Password: ${
          result.data?.password || 'RelaxaAdmin@2026'
        }`
      );
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="admin-login-page">
      <div className="admin-login-container">
        <header className="admin-login-brand">
          <h1>Relaxa</h1>
          <p>Admin Portal</p>
        </header>

        <article className="admin-login-card">
          <header className="admin-login-head">
            <h2>Admin Login</h2>
            <p>Secure access for system administrators only.</p>
          </header>

          <form className="admin-login-form">
            <div className="field-group">
              <label htmlFor="admin-email">Admin Email</label>
              <div className="field-wrap">
                <span className="material-symbols-outlined">admin_panel_settings</span>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  placeholder="admin@relaxa.com"
                  value={credentials.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="field-group">
              <div className="field-label-row">
                <label htmlFor="admin-password">Password</label>
                <button type="button" onClick={handleForgotPassword}>
                  Forgot?
                </button>
              </div>
              <div className="field-wrap">
                <span className="material-symbols-outlined">lock</span>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {errorMessage && <p className="admin-auth-error">{errorMessage}</p>}
            {infoMessage && <p className="admin-auth-info">{infoMessage}</p>}

            <button className="admin-login-submit" type="button" onClick={handleAdminLogin} disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : 'Login to Dashboard'}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <div className="admin-login-hint">
            <strong>Default Admin Email</strong>
            <span>admin@relaxa.com</span>
          </div>

          <div className="secure-session">
            <span className="material-symbols-outlined">shield</span>
            <p>Encrypted Secure Session</p>
          </div>
        </article>

        <footer className="admin-login-footer">
          <p>
            Not an administrator? <Link to="/login">Return to Home</Link>
          </p>
        </footer>
      </div>

      <div className="admin-login-orb top" />
      <div className="admin-login-orb bottom" />
    </section>
  );
}

export default AdminLoginPage;

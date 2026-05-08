import './AdminLoginPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLoginPage() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminLogin = async () => {
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email.trim(),
          password: credentials.password,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Admin login failed.');
      }

      if (result.data?.token) {
        localStorage.setItem('relaxaAdminToken', result.data.token);
      }

      navigate('/admin/dashboard');
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
                <button type="button">Forgot?</button>
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

            <button className="admin-login-submit" type="button" onClick={handleAdminLogin} disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : 'Login to Dashboard'}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <div className="secure-session">
            <span className="material-symbols-outlined">shield</span>
            <p>Encrypted Secure Session</p>
          </div>
        </article>

        <footer className="admin-login-footer">
          <p>
            Not an administrator? <a href="#/">Return to Home</a>
          </p>
        </footer>
      </div>

      <div className="admin-login-orb top" />
      <div className="admin-login-orb bottom" />
    </section>
  );
}

export default AdminLoginPage;

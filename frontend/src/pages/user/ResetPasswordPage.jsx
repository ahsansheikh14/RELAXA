import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../../services/relaxaApi.js';
import './ResetPasswordPage.css';

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';
  const hasValidLink = Boolean(email && token);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setErrorMessage('');
    setInfoMessage('');

    if (!hasValidLink) {
      setErrorMessage('Invalid reset link. Request a new one from the login page.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      await authApi.resetPassword({
        email: email.trim().toLowerCase(),
        token,
        newPassword,
      });
      setInfoMessage('Password reset complete. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setErrorMessage(error.message === 'Failed to fetch' ? 'Backend is not reachable.' : error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="reset-password-page">
      <div className="reset-bg-orb top" />
      <div className="reset-bg-orb bottom" />

      <div className="reset-card">
        <header className="reset-header">
          <h1 className="reset-brand">Relaxa</h1>
          <h2>Reset your password</h2>
          {email ? <p className="reset-email">{decodeURIComponent(email)}</p> : <p>Set a new password for your account</p>}
        </header>

        {!hasValidLink ? (
          <div className="reset-invalid">
            <p className="reset-error">This reset link is invalid or incomplete.</p>
            <Link className="reset-back-link" to="/login">
              Back to login
            </Link>
          </div>
        ) : (
          <form className="reset-form" onSubmit={handleFormSubmit}>
            <div className="reset-field">
              <label htmlFor="newPassword">New password</label>
              <div className="reset-input-wrap">
                <span className="material-symbols-outlined">lock</span>
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="reset-toggle-password"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="reset-field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <div className="reset-input-wrap">
                <span className="material-symbols-outlined">lock</span>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {errorMessage && <p className="reset-error">{errorMessage}</p>}
            {infoMessage && <p className="reset-info">{infoMessage}</p>}

            <button className="reset-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Resetting...' : 'Update password'}
            </button>
          </form>
        )}

        <footer className="reset-footer">
          <Link to="/login">← Back to login</Link>
        </footer>
      </div>
    </section>
  );
}

export default ResetPasswordPage;

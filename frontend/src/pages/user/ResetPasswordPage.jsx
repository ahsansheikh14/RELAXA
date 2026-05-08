import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/auth.js';
import './ResetPasswordPage.css';

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const handleResetPassword = async () => {
    setErrorMessage('');
    setInfoMessage('');

    if (!email || !token) {
      setErrorMessage('Invalid reset link. Request a new one from Login page.');
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
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Unable to reset password.');
      }
      setInfoMessage('Password reset complete. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="reset-password-page">
      <div className="reset-card">
        <h1>Reset Your Password</h1>
        <p>{email || 'Secure password reset'}</p>

        <label htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="Enter new password"
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirm new password"
        />

        {errorMessage && <p className="reset-error">{errorMessage}</p>}
        {infoMessage && <p className="reset-info">{infoMessage}</p>}

        <button type="button" onClick={handleResetPassword} disabled={isSubmitting}>
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </section>
  );
}

export default ResetPasswordPage;

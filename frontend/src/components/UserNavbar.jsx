import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { API_BASE_URL, clearUserSession } from '../utils/auth.js';
import { toggleZenMode } from '../utils/zenMode.js';
import './UserNavbar.css';

function UserNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [settingsMessage, setSettingsMessage] = useState('');
  const [settingsError, setSettingsError] = useState('');

  const handleLogout = () => {
    clearUserSession();
    navigate('/login');
  };

  const handleSubmitPasswordChange = async () => {
    setSettingsError('');
    setSettingsMessage('');
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setSettingsError('Please fill all password fields.');
      return;
    }
    if (newPassword.length < 6) {
      setSettingsError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setSettingsError('New password and confirm password do not match.');
      return;
    }
    try {
      const token = localStorage.getItem('relaxaToken');
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Unable to change password.');
      }
      setSettingsMessage(result.message);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setChangePasswordOpen(false);
    } catch (error) {
      setSettingsError(error.message);
    }
  };

  return (
    <header className="user-navbar">
      <div className="user-navbar__left">
        <Link to="/dashboard" className="user-navbar__brand">
          Relaxa
        </Link>

        <nav className="user-navbar__links">
          <NavLink to="/dashboard" className={({ isActive }) => `user-navbar__link ${isActive ? 'active' : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/exercises" className={({ isActive }) => `user-navbar__link ${isActive ? 'active' : ''}`}>
            Exercises
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => `user-navbar__link ${isActive ? 'active' : ''}`}>
            Reports
          </NavLink>
        </nav>
      </div>

      <div className="user-navbar__icons">
        <button type="button" className="icon-btn" aria-label="Notifications">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-label="Settings"
          onClick={() => setSettingsOpen((prev) => !prev)}
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div className="user-menu-wrap">
          <button
            type="button"
            className="avatar-btn"
            aria-label="Account"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>
          {menuOpen && (
            <div className="user-menu">
              <button type="button" onClick={() => navigate('/dashboard')}>
                Account
              </button>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {settingsOpen && (
        <>
          <div className="settings-overlay" onClick={() => setSettingsOpen(false)} />
          <aside className="settings-panel">
            <div className="settings-panel__head">
              <h3>Settings</h3>
              <button type="button" onClick={() => setSettingsOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="settings-panel__section">
              <p className="settings-label">Account</p>
              <button type="button" onClick={() => navigate('/dashboard')}>
                <span className="material-symbols-outlined">account_circle</span>
                Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  setChangePasswordOpen((prev) => !prev);
                  setSettingsError('');
                  setSettingsMessage('');
                }}
              >
                <span className="material-symbols-outlined">lock</span>
                Change Password
              </button>
              {changePasswordOpen && (
                <div className="change-password-form">
                  <input
                    type="password"
                    placeholder="Current password"
                    value={passwordForm.currentPassword}
                    onChange={(event) =>
                      setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
                    }
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    value={passwordForm.newPassword}
                    onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordForm.confirmPassword}
                    onChange={(event) =>
                      setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                    }
                  />
                  <button type="button" className="save-password-btn" onClick={handleSubmitPasswordChange}>
                    Save Password
                  </button>
                </div>
              )}
            </div>

            <div className="settings-panel__section">
              <p className="settings-label">Preferences</p>
              <button type="button" onClick={toggleZenMode}>
                <span className="material-symbols-outlined">self_improvement</span>
                Toggle Zen Mode
              </button>
            </div>

            <div className="settings-panel__footer">
              {settingsError && <p className="settings-error">{settingsError}</p>}
              {settingsMessage && <p className="settings-message">{settingsMessage}</p>}
              <button type="button" className="danger" onClick={handleLogout}>
                <span className="material-symbols-outlined">logout</span>
                Logout
              </button>
            </div>
          </aside>
        </>
      )}
    </header>
  );
}

export default UserNavbar;

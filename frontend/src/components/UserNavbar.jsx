import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { clearUserSession } from '../utils/auth.js';
import { aiApi, moodApi, userApi } from '../services/relaxaApi.js';
import { toggleZenMode } from '../utils/zenMode.js';
import './UserNavbar.css';

function ProfileDetailsCard({ loading, data, error }) {
  if (loading) {
    return <p className="profile-details-card__state">Loading profile...</p>;
  }
  if (error) {
    return <p className="settings-error">{error}</p>;
  }
  if (!data) {
    return <p className="profile-details-card__state">No profile data available.</p>;
  }

  return (
    <>
      <div className="profile-detail-row">
        <span>Name</span>
        <strong>{data.name}</strong>
      </div>
      <div className="profile-detail-row">
        <span>Email</span>
        <strong>{data.email}</strong>
      </div>
      <div className="profile-detail-row">
        <span>Role</span>
        <strong>{data.role}</strong>
      </div>
      <div className="profile-detail-row">
        <span>Member Since</span>
        <strong>{new Date(data.createdAt).toLocaleDateString()}</strong>
      </div>
    </>
  );
}

const isSameDay = (left, right) => left.toDateString() === right.toDateString();

const buildNotifications = (moods, conversations) => {
  const items = [];
  const now = new Date();
  const latestMood = moods?.[0];

  if (!latestMood || !isSameDay(new Date(latestMood.createdAt), now)) {
    items.push({
      id: 'mood-reminder',
      icon: 'mood',
      title: 'Log your mood today',
      message: 'A quick check-in helps Relaxa personalize your exercises and insights.',
      actionPath: '/dashboard',
      actionLabel: 'Log mood',
      createdAt: now.toISOString(),
      unread: true,
    });
  } else {
    items.push({
      id: 'mood-latest',
      icon: 'check_circle',
      title: `Today's mood: ${latestMood.mood}`,
      message: latestMood.note?.trim() || 'Thanks for checking in today.',
      actionPath: '/dashboard',
      actionLabel: 'View dashboard',
      createdAt: latestMood.createdAt,
      unread: false,
    });
  }

  if (conversations?.length) {
    const latestChat = conversations[0];
    items.push({
      id: `chat-${latestChat.id}`,
      icon: 'forum',
      title: latestChat.title || 'Continue your AI chat',
      message: latestChat.lastMessagePreview || 'Pick up your saved wellness conversation.',
      actionPath: '/chat',
      actionLabel: 'Open chat',
      createdAt: latestChat.updatedAt || latestChat.createdAt,
      unread: false,
    });
  } else {
    items.push({
      id: 'chat-invite',
      icon: 'auto_awesome',
      title: 'AI psychologist is ready',
      message: 'Start a private conversation when you want support beyond exercises.',
      actionPath: '/chat',
      actionLabel: 'Start chatting',
      createdAt: now.toISOString(),
      unread: true,
    });
  }

  items.push({
    id: 'reports-weekly',
    icon: 'monitoring',
    title: 'Review your wellness trends',
    message: 'See how your mood has changed over the last few days in Reports.',
    actionPath: '/reports',
    actionLabel: 'View reports',
    createdAt: now.toISOString(),
    unread: false,
  });

  return items;
};

function UserNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileError, setProfileError] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState('');
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [settingsMessage, setSettingsMessage] = useState('');
  const [settingsError, setSettingsError] = useState('');

  const getToken = () => localStorage.getItem('relaxaToken');

  const loadProfile = useCallback(async () => {
    const token = getToken();
    if (!token) {
      return null;
    }

    setProfileLoading(true);
    setProfileError('');

    try {
      const result = await userApi.getMe({ token });
      setProfileData(result.user);
      if (result.user?.name) {
        localStorage.setItem('relaxaUserName', result.user.name);
      }
      return result.user;
    } catch (error) {
      setProfileError(error.message);
      return null;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    const token = getToken();
    if (!token) {
      return;
    }

    setNotificationsLoading(true);
    setNotificationsError('');

    try {
      const [moodResult, chatResult] = await Promise.all([
        moodApi.history({ token, limit: 5 }),
        aiApi.listConversations({ token }),
      ]);
      const moods = Array.isArray(moodResult.moods) ? moodResult.moods : [];
      const conversations = Array.isArray(chatResult.items) ? chatResult.items : [];
      setNotifications(buildNotifications(moods, conversations));
    } catch (error) {
      setNotificationsError(error.message);
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  const closeAllPanels = () => {
    setMenuOpen(false);
    setSettingsOpen(false);
    setNotificationsOpen(false);
  };

  const handleLogout = () => {
    clearUserSession();
    navigate('/login');
  };

  const handleToggleProfileMenu = async () => {
    const nextOpen = !menuOpen;
    setMenuOpen(nextOpen);
    setNotificationsOpen(false);
    setSettingsOpen(false);

    if (nextOpen && !profileData && !profileLoading) {
      await loadProfile();
    }
  };

  const handleToggleNotifications = async () => {
    const nextOpen = !notificationsOpen;
    setNotificationsOpen(nextOpen);
    setMenuOpen(false);
    setSettingsOpen(false);

    if (nextOpen) {
      await loadNotifications();
    }
  };

  const handleOpenSettings = () => {
    setSettingsOpen((prev) => !prev);
    setMenuOpen(false);
    setNotificationsOpen(false);
  };

  const handleToggleProfile = async () => {
    const nextOpen = !profileOpen;
    setProfileOpen(nextOpen);
    setChangePasswordOpen(false);
    setSettingsError('');
    setSettingsMessage('');

    if (nextOpen && !profileData && !profileLoading) {
      await loadProfile();
    }
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
      const token = getToken();
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/auth/change-password`, {
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

  const handleNotificationAction = (path) => {
    setNotificationsOpen(false);
    navigate(path);
  };

  const unreadCount = notifications.filter((item) => item.unread).length;

  useEffect(() => {
    if (!notificationsOpen && !menuOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeAllPanels();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [notificationsOpen, menuOpen]);

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
        <div className="notifications-wrap">
          <button
            type="button"
            className={`icon-btn ${notificationsOpen ? 'active' : ''}`}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={handleToggleNotifications}
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {notificationsOpen && (
            <div className="notifications-panel">
              <div className="notifications-panel__head">
                <h4>Notifications</h4>
                <button type="button" aria-label="Close notifications" onClick={() => setNotificationsOpen(false)}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {notificationsLoading ? (
                <p className="notifications-panel__state">Loading updates...</p>
              ) : notificationsError ? (
                <p className="settings-error notifications-panel__state">{notificationsError}</p>
              ) : notifications.length ? (
                <ul className="notifications-list">
                  {notifications.map((item) => (
                    <li key={item.id} className={`notification-item ${item.unread ? 'unread' : ''}`}>
                      <div className="notification-item__icon">
                        <span className="material-symbols-outlined">{item.icon}</span>
                      </div>
                      <div className="notification-item__body">
                        <strong>{item.title}</strong>
                        <p>{item.message}</p>
                        <button type="button" onClick={() => handleNotificationAction(item.actionPath)}>
                          {item.actionLabel}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="notifications-panel__state">You are all caught up.</p>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          className={`icon-btn ${settingsOpen ? 'active' : ''}`}
          aria-label="Settings"
          onClick={handleOpenSettings}
        >
          <span className="material-symbols-outlined">settings</span>
        </button>

        <div className="user-menu-wrap">
          <button
            type="button"
            className={`avatar-btn ${menuOpen ? 'active' : ''}`}
            aria-label="Account"
            aria-expanded={menuOpen}
            onClick={handleToggleProfileMenu}
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>
          {menuOpen && (
            <div className="user-menu user-menu--profile">
              <div className="user-menu__profile-head">
                <span className="material-symbols-outlined">account_circle</span>
                <div>
                  <strong>{profileData?.name || localStorage.getItem('relaxaUserName') || 'Your account'}</strong>
                  <span>{profileData?.email || 'Profile details'}</span>
                </div>
              </div>

              <div className="profile-details-card profile-details-card--menu">
                <ProfileDetailsCard loading={profileLoading} data={profileData} error={profileError} />
              </div>

              <button type="button" onClick={() => { setMenuOpen(false); navigate('/dashboard'); }}>
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setSettingsOpen(true);
                }}
              >
                Settings
              </button>
              <button type="button" className="danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {(notificationsOpen || menuOpen) && (
        <button type="button" className="navbar-dismiss-overlay" aria-label="Close menu" onClick={closeAllPanels} />
      )}

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
              <button type="button" onClick={handleToggleProfile}>
                <span className="material-symbols-outlined">account_circle</span>
                Profile
              </button>
              {profileOpen && (
                <div className="profile-details-card">
                  <ProfileDetailsCard loading={profileLoading} data={profileData} error={profileError} />
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
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

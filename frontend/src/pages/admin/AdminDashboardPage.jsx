import './AdminDashboardPage.css';
import AdminLayout from '../../components/AdminLayout';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { adminApi } from '../../services/relaxaApi.js';

function AdminDashboardPage() {
  const adminToken = localStorage.getItem('relaxaAdminToken');
  const [summary, setSummary] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalExercises: 0,
    platformHealth: 99.9,
  });
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 10 });
  const [isLoading, setIsLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const [summaryResult, usersResult] = await Promise.all([
        adminApi.getAnalyticsSummary({ token: adminToken }),
        adminApi.getUsers({ token: adminToken, page, limit: 10, search }),
      ]);

      setSummary(summaryResult.data || {});
      setUsers(usersResult.data || []);
      setPagination(usersResult.pagination || { page: 1, totalPages: 1, total: 0, limit: 10 });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [adminToken, page, search]);

  const handleDeleteUser = async (user) => {
    if (user.role === 'admin') {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${user.name} (${user.email})? This will also remove their mood logs and AI chat history.`
    );
    if (!confirmed) {
      return;
    }

    try {
      setDeletingUserId(user._id);
      setErrorMessage('');
      setInfoMessage('');
      await adminApi.deleteUser({ token: adminToken, userId: user._id });
      setInfoMessage('User deleted successfully.');
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setDeletingUserId('');
    }
  };

  return (
    <AdminLayout layoutClass="admin-dashboard">
      <main className="admin-main">
        <header className="admin-main-head">
          <div>
            <h2>User Management</h2>
            <p>Manage your community and content curation from one place.</p>
          </div>

          <Link to="/admin/exercises/new" className="add-exercise-btn">
            <span className="material-symbols-outlined">add</span>
            Add Exercise
          </Link>
        </header>

        <section className="admin-stats-grid">
          <article className="admin-stat-card">
            <div className="card-head">
              <span>Total Users</span>
              <div className="icon-circle">
                <span className="material-symbols-outlined">group</span>
              </div>
            </div>
            <h3>{summary.totalUsers || 0}</h3>
            <p className="trend">
              <span className="material-symbols-outlined">trending_up</span>
              <strong>{pagination.total || 0}</strong> records in database
            </p>
          </article>

          <article className="admin-stat-card">
            <div className="card-head">
              <span>Active Users</span>
              <div className="icon-circle alt">
                <span className="material-symbols-outlined">bolt</span>
              </div>
            </div>
            <h3>{summary.activeUsers || 0}</h3>
            <p>Users active in the last 30 days</p>
          </article>

          <article className="admin-stat-card">
            <div className="card-head">
              <span>Total Exercises</span>
              <div className="icon-circle alt">
                <span className="material-symbols-outlined">subscriptions</span>
              </div>
            </div>
            <h3>{summary.totalExercises || 0}</h3>
            <p>Guided sessions available to users</p>
          </article>

          <article className="admin-stat-card health">
            <div className="card-head">
              <span>Platform Health</span>
              <div className="icon-circle health-icon">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
            </div>
            <h3>{summary.platformHealth || 99.9}%</h3>
            <div className="health-track">
              <span />
            </div>
          </article>
        </section>

        <section className="admin-table-card">
          <div className="table-head">
            <h3>Registered Users</h3>
            <div className="table-actions">
              <div className="search-box">
                <span className="material-symbols-outlined">search</span>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <button type="button" className="filter-btn" onClick={() => window.location.reload()}>
                <span className="material-symbols-outlined">refresh</span>
                Refresh
              </button>
            </div>
          </div>

          {errorMessage && <p className="admin-inline-error">{errorMessage}</p>}
          {infoMessage && <p className="admin-inline-success">{infoMessage}</p>}

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Access</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="admin-table-empty">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length ? (
                  users.map((user) => (
                    <tr key={user._id || user.email}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar-fallback">
                            {(user.name || 'U').slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <strong>{user.name}</strong>
                            <small>{user.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{user.role}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-pill ${user.role === 'admin' ? 'admin' : 'active'}`}>
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="action-cell">
                        {user.role === 'admin' ? (
                          <span className="action-muted">Protected</span>
                        ) : (
                          <button
                            type="button"
                            className="danger-btn table-danger-btn"
                            disabled={deletingUserId === user._id}
                            onClick={() => handleDeleteUser(user)}
                          >
                            <span className="material-symbols-outlined">delete</span>
                            {deletingUserId === user._id ? 'Deleting...' : 'Delete'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="admin-table-empty">
                      No users found for this search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span>
              Showing page {pagination.page || 1} of {pagination.totalPages || 1} ({pagination.total || 0} users)
            </span>
            <div className="table-pager">
              <button type="button" disabled={page <= 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                type="button"
                disabled={page >= (pagination.totalPages || 1)}
                onClick={() => setPage((prev) => prev + 1)}
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </AdminLayout>
  );
}

export default AdminDashboardPage;

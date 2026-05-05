import './AdminDashboardPage.css';
import AdminSidebar from '../../components/AdminSidebar';
import { Link } from 'react-router-dom';

function AdminDashboardPage() {
  const users = [
    {
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      status: 'Active',
      role: 'Premium Member',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAFU-TKOvYDDl2p8k1GDK1IMy7LCROcj_pFx6pWIRWG-3ijJY7CgzTteP7WssizwYA5gShGrFE9Ya-DWE8ut2fH1aNgXQeqJ6k4UjE4_aZQqoT7vD5z_15ElIi2Rf18fsxZv4Tm4ttBMXeYdC-H4jAbVRMt6jiiPM7ZU9C1Ybb1bns9k-ug_HMzKYTFRTg0vtwBp0Hv6RkMWbv1ATrRKD73kg2qUhRy_laFlRVI7rvjcEapRLuvOrSC9x1Zo7c4vI1EExYY2a-De-7P',
    },
    {
      name: 'Marcus Kinsley',
      email: 'm.kinsley@site.co',
      status: 'Away',
      role: 'Free Tier',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC4y250N1Skxmay4elsdgdffyLS8KZ3GcO8qShMJFvi2Pe_wFXjh0CxvxQsiJ0Sla0iT6kfVVFInYTCLSXnX8BFD7T7q6QIJ4O7h13fKwMWxqoPFhxlO5MsI8PDwrTO4EcG-wqtWVSUldhh2OZsfjJo6PvOjzc3YXMgA4xCYUUXmg3Sli1zea28do3jQFbOyp9gv9d8JQ6acyjSkmk0-s0s38HwNMx9ypRAe6tY8XHAOz8Fg2zE0C8XBKiUp_uaBTrpFZ_Rs1C_MP-f',
    },
    {
      name: 'Elena Volkov',
      email: 'elena.v@cloud.net',
      status: 'Active',
      role: 'Coach',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCgHxK1ZaaFLUTYluUHPz0AbMBvU1tvDZYhciRqqmaxl6QPOTZA2Z451TyWn7QXvoXT8VInNlwk-0d2HD5aBifqLEOmHlgEwm3ZOIHB_ZhvETvySAOBNtDckB4SkDiLYwbjyh_wodEJuseX8qZp6XLTihD4QcHR4OYxBOQhXxzldx7ROWH5yWidvtYMZx47xK6rblO5oJS_B3csXI1vOUuS--pXTGQryd75B7csiWj1-kSb-asPsS5MvkkkTv7TPKG8sDUo3hYMQ92g',
    },
  ];

  return (
    <div className="admin-dashboard">
      <AdminSidebar />

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
            <h3>12,842</h3>
            <p className="trend">
              <span className="material-symbols-outlined">trending_up</span>
              <strong>+12%</strong> vs last month
            </p>
          </article>

          <article className="admin-stat-card">
            <div className="card-head">
              <span>Active Users</span>
              <div className="icon-circle alt">
                <span className="material-symbols-outlined">bolt</span>
              </div>
            </div>
            <h3>4,291</h3>
            <p>Real-time engagement tracking</p>
          </article>

          <article className="admin-stat-card health">
            <div className="card-head">
              <span>Platform Health</span>
              <div className="icon-circle health-icon">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
            </div>
            <h3>99.9%</h3>
            <div className="health-track">
              <span />
            </div>
          </article>
        </section>

        <section className="admin-table-card">
          <div className="table-head">
            <h3>Recent Registrations</h3>
            <div className="table-actions">
              <div className="search-box">
                <span className="material-symbols-outlined">search</span>
                <input type="text" placeholder="Search users..." />
              </div>
              <button type="button" className="filter-btn">
                <span className="material-symbols-outlined">filter_list</span>
                Filter
              </button>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Status</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email}>
                    <td>
                      <div className="user-cell">
                        <img src={user.avatar} alt={user.name} />
                        <div>
                          <strong>{user.name}</strong>
                          <small>{user.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${user.status.toLowerCase()}`}>{user.status}</span>
                    </td>
                    <td>{user.role}</td>
                    <td className="action-cell">
                      <button type="button">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span>Showing 1-10 of 12,842 users</span>
            <div className="table-pager">
              <button type="button" disabled>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button type="button">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboardPage;

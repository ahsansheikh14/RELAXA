import { NavLink, useNavigate } from 'react-router-dom';
import { clearAdminSession } from '../utils/auth.js';
import './AdminSidebar.css';

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminSession();
    navigate('/admin/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-head">
        <h1>Admin Panel</h1>
        <p>System Overview</p>
      </div>

      <nav className="admin-nav">
        <NavLink to="/admin/dashboard" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">group</span>
          <span>Users</span>
        </NavLink>
        <NavLink to="/admin/content" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">library_books</span>
          <span>Exercises</span>
        </NavLink>
        <NavLink to="/admin/analytics" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">insights</span>
          <span>Analytics</span>
        </NavLink>
        <NavLink
          to="/admin/exercises/new"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span>Add Exercise</span>
        </NavLink>
      </nav>

      <button type="button" className="admin-logout" onClick={handleLogout}>
        <span className="material-symbols-outlined">logout</span>
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default AdminSidebar;

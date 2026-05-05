import { Link, NavLink } from 'react-router-dom';
import './UserNavbar.css';

function UserNavbar() {
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
        <button type="button" className="icon-btn" aria-label="Settings">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <img
          className="avatar-image"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoPwab6VTsITFFeOrFhlUwvLws6fBbpjcTchjUR_7keVlzgU8VlEWrlpntGE2Q9iiajPHO5VDeSCpQ1_5EZUHlsCuYGr68lc4WjuGYqNnPjsm-k-XP_d4tvFABEkcIi5F6Hxyi5N4Tsn4dVA592xQfXKGDIMM1hseM4ZSBdtSdG5822yjw5FBxzloMt7jt5lrPPaKAAZ5etYfQEplhhZRC6rIxU5HiNbr_0o_PyIEq98OYBXgUzo4uPUN2Iy1itftqyKrZOzp6HmQ1"
          alt="User profile"
        />
      </div>
    </header>
  );
}

export default UserNavbar;

import { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar.jsx';
import './AdminLayout.css';

const MOBILE_BREAKPOINT = 1024;

function AdminLayout({ children, layoutClass = 'admin-dashboard' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }

    document.body.style.overflow = '';
    return undefined;
  }, [isMobile, sidebarOpen]);

  return (
    <div className={`admin-layout ${layoutClass}`}>
      {isMobile && sidebarOpen ? (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <AdminSidebar
        isMobile={isMobile}
        isOpen={!isMobile || sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-layout-body">
        {isMobile ? (
          <header className="admin-mobile-bar">
            <button
              type="button"
              className="admin-menu-btn"
              aria-label="Open navigation menu"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="admin-mobile-bar-title">
              <strong>Relaxa Admin</strong>
              <span>Management portal</span>
            </div>
          </header>
        ) : null}
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;

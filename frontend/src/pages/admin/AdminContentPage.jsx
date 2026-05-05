import AdminSidebar from '../../components/AdminSidebar';
import './AdminSectionPage.css';

function AdminContentPage() {
  return (
    <div className="admin-section-layout">
      <AdminSidebar />
      <main className="admin-section-main">
        <h2>Content Management</h2>
        <p>Manage exercises, journal prompts, and guided content from this section.</p>
      </main>
    </div>
  );
}

export default AdminContentPage;

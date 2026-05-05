import AdminSidebar from '../../components/AdminSidebar';
import './AdminSectionPage.css';

function AdminAnalyticsPage() {
  return (
    <div className="admin-section-layout">
      <AdminSidebar />
      <main className="admin-section-main">
        <h2>Analytics</h2>
        <p>Track platform metrics, engagement trends, and wellness outcomes here.</p>
      </main>
    </div>
  );
}

export default AdminAnalyticsPage;

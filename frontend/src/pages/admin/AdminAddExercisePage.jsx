import AdminSidebar from '../../components/AdminSidebar';
import './AdminSectionPage.css';

function AdminAddExercisePage() {
  return (
    <div className="admin-section-layout">
      <AdminSidebar />
      <main className="admin-section-main">
        <h2>Add Exercise</h2>
        <p>Create a new exercise entry. Form integration can be added in the next step.</p>
      </main>
    </div>
  );
}

export default AdminAddExercisePage;

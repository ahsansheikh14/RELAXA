import AdminSidebar from '../../components/AdminSidebar';
import './AdminSectionPage.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { exerciseApi } from '../../services/relaxaApi.js';

function AdminContentPage() {
  const adminToken = localStorage.getItem('relaxaAdminToken');
  const [search, setSearch] = useState('');
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    const loadExercises = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const result = await exerciseApi.list({
          token: adminToken,
          search,
        });
        setExercises(result.data || []);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadExercises();
  }, [adminToken, search]);

  const handleDeleteExercise = async (exerciseId) => {
    const confirmDelete = window.confirm('Delete this exercise from the library?');
    if (!confirmDelete) {
      return;
    }

    try {
      setErrorMessage('');
      setInfoMessage('');
      await exerciseApi.remove({ token: adminToken, id: exerciseId });
      setExercises((prev) => prev.filter((exercise) => exercise._id !== exerciseId));
      setInfoMessage('Exercise deleted successfully.');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="admin-section-layout">
      <AdminSidebar />
      <main className="admin-section-main">
        <div className="admin-page-head">
          <div>
            <h2>Exercise Management</h2>
            <p>Manage your guided exercises, including links and video-based sessions.</p>
          </div>
          <Link to="/admin/exercises/new" className="admin-primary-link">
            <span className="material-symbols-outlined">add</span>
            Add Exercise
          </Link>
        </div>

        <section className="admin-data-card">
          <div className="admin-toolbar">
            <div>
              <h3>Exercise Library</h3>
              <p>Search, review, edit, and delete uploaded exercises.</p>
            </div>

            <div className="admin-search-box">
              <span className="material-symbols-outlined">search</span>
              <input
                type="text"
                placeholder="Search exercises..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          {errorMessage && <p className="admin-section-error">{errorMessage}</p>}
          {infoMessage && <p className="admin-section-info">{infoMessage}</p>}

          {isLoading ? (
            <p className="admin-empty-state">Loading exercises...</p>
          ) : exercises.length ? (
            <div className="exercise-grid">
              {exercises.map((exercise) => (
                <article className="exercise-card" key={exercise._id}>
                  <div className="exercise-card__head">
                    <span className="exercise-category">{exercise.category}</span>
                    <span className="exercise-duration">{exercise.durationMinutes} min</span>
                  </div>

                  <h3>{exercise.title}</h3>
                  <p>{exercise.description || 'No description added yet.'}</p>

                  <div className="exercise-meta-list">
                    <span>
                      <strong>Media:</strong> {exercise.mediaType || 'none'}
                    </span>
                    {exercise.mediaUrl && (
                      <a href={exercise.mediaUrl} target="_blank" rel="noreferrer">
                        Open resource
                      </a>
                    )}
                  </div>

                  <div className="exercise-card__actions">
                    <Link to={`/admin/exercises/${exercise._id}/edit`} className="ghost-link-btn">
                      Edit
                    </Link>
                    <button type="button" className="danger-btn" onClick={() => handleDeleteExercise(exercise._id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="admin-empty-state">No exercises found. Add your first exercise to get started.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminContentPage;

import AdminSidebar from '../../components/AdminSidebar';
import './AdminSectionPage.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { exerciseApi } from '../../services/relaxaApi.js';

function AdminAddExercisePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const adminToken = localStorage.getItem('relaxaAdminToken');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    durationMinutes: 10,
    description: '',
    mediaType: 'none',
    mediaUrl: '',
  });
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadExercise = async () => {
      try {
        setIsLoading(true);
        const result = await exerciseApi.getById({ token: adminToken, id });
        setFormData({
          title: result.data?.title || '',
          category: result.data?.category || '',
          durationMinutes: result.data?.durationMinutes || 10,
          description: result.data?.description || '',
          mediaType: result.data?.mediaType || 'none',
          mediaUrl: result.data?.mediaUrl || '',
        });
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadExercise();
  }, [adminToken, id, isEditMode]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'durationMinutes' ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setInfoMessage('');

      const payload = {
        ...formData,
        mediaUrl: formData.mediaType === 'none' ? '' : formData.mediaUrl.trim(),
      };

      if (isEditMode) {
        await exerciseApi.update({ token: adminToken, id, data: payload });
        setInfoMessage('Exercise updated successfully.');
      } else {
        await exerciseApi.create({ token: adminToken, data: payload });
        setInfoMessage('Exercise created successfully.');
        setFormData({
          title: '',
          category: '',
          durationMinutes: 10,
          description: '',
          mediaType: 'none',
          mediaUrl: '',
        });
      }

      setTimeout(() => navigate('/admin/content'), 900);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-section-layout">
      <AdminSidebar />
      <main className="admin-section-main">
        <h2>{isEditMode ? 'Edit Exercise' : 'Add Exercise'}</h2>
        <p>Create guided sessions with optional links or videos for users.</p>

        <section className="admin-data-card">
          {isLoading ? (
            <p className="admin-empty-state">Loading exercise details...</p>
          ) : (
            <div className="exercise-form-grid">
              <label>
                Title
                <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Ocean Breath" />
              </label>

              <label>
                Category
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Meditation"
                />
              </label>

              <label>
                Duration (minutes)
                <input
                  name="durationMinutes"
                  type="number"
                  min="1"
                  value={formData.durationMinutes}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Media Type
                <select name="mediaType" value={formData.mediaType} onChange={handleInputChange}>
                  <option value="none">None</option>
                  <option value="link">Link</option>
                  <option value="video">Video</option>
                </select>
              </label>

              <label className="full-span">
                Description
                <textarea
                  name="description"
                  rows="5"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the goal of this exercise..."
                />
              </label>

              <label className="full-span">
                Resource URL
                <input
                  name="mediaUrl"
                  value={formData.mediaUrl}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/... or https://drive.google.com/..."
                  disabled={formData.mediaType === 'none'}
                />
              </label>

              {errorMessage && <p className="admin-section-error full-span">{errorMessage}</p>}
              {infoMessage && <p className="admin-section-info full-span">{infoMessage}</p>}

              <div className="exercise-form-actions full-span">
                <button type="button" className="ghost-link-btn" onClick={() => navigate('/admin/content')}>
                  Cancel
                </button>
                <button type="button" className="admin-primary-btn" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : isEditMode ? 'Update Exercise' : 'Create Exercise'}
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminAddExercisePage;

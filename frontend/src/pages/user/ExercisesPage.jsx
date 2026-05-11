import UserNavbar from '../../components/UserNavbar';
import './ExercisesPage.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { toggleZenMode } from '../../utils/zenMode.js';
import { exerciseApi } from '../../services/relaxaApi.js';
import { getExerciseVisual } from '../../utils/exerciseDisplay.js';

function ExercisesPage() {
  const navigate = useNavigate();
  const userToken = localStorage.getItem('relaxaToken');
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const loadExercises = async () => {
      if (!userToken) {
        setLoading(false);
        setLoadError('Please login again to view your exercise library.');
        return;
      }

      try {
        setLoading(true);
        setLoadError('');
        const result = await exerciseApi.list({ token: userToken, search });
        setExercises(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        setLoadError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, [search, userToken]);

  const mediaReadyCount = useMemo(
    () => exercises.filter((exercise) => exercise.mediaType === 'link' || exercise.mediaType === 'video').length,
    [exercises]
  );

  const handleExerciseAction = (exercise) => {
    if (exercise.mediaUrl) {
      window.open(exercise.mediaUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    navigate('/chat');
  };

  return (
    <div className="exercises-page">
      <UserNavbar />

      <div className="exercises-layout">
        <aside className="exercises-sidenav">
          <div className="zen-head">
            <div className="zen-icon-wrap">
              <span className="material-symbols-outlined">spa</span>
            </div>
            <div>
              <h3>Zen Assistant</h3>
              <p>Your digital sanctuary</p>
            </div>
          </div>

          <button type="button" className="side-btn active" onClick={() => navigate('/chat')}>
            <span className="material-symbols-outlined">add_comment</span>
            New Chat
          </button>
          <button type="button" className="side-btn">
            <span className="material-symbols-outlined">history</span>
            Chat History
          </button>

          <div className="breath-widget">
            <p>Exercise Library</p>
            <h4>{exercises.length} sessions available</h4>
            <div className="breath-progress">
              <span style={{ width: `${Math.min(100, Math.max(12, mediaReadyCount * 12))}%` }} />
            </div>
          </div>
        </aside>

        <main className="exercises-main">
          <header className="exercises-header">
            <span>Mindfulness Library</span>
            <h1>Daily Exercises</h1>
            <p>
              Take a moment for yourself. Choose a journey that resonates with your current state of being and let us
              guide you back to center.
            </p>
            <div className="exercise-search">
              <span className="material-symbols-outlined">search</span>
              <input
                type="text"
                placeholder="Search exercises..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </header>

          <section className="exercise-grid">
            {loading ? (
              <p className="exercise-page-message">Loading exercises...</p>
            ) : loadError ? (
              <p className="exercise-page-message exercise-page-message--error">{loadError}</p>
            ) : exercises.length ? (
              exercises.map((exercise, index) => {
                const visual = getExerciseVisual(exercise, index);

                return (
                  <article key={exercise._id || exercise.title} className="exercise-card">
                    <div className="exercise-image-wrap">
                      <img src={visual.image} alt={exercise.title} />
                    </div>
                    <div className="exercise-content">
                      <div className="exercise-meta">
                        <span>{exercise.durationMinutes} MIN</span>
                        <span className="material-symbols-outlined">{visual.icon}</span>
                      </div>
                      <h2>{exercise.title}</h2>
                      <p>{exercise.description || 'A guided wellness practice added by your admin team.'}</p>
                      <div className="exercise-resource">{visual.mediaLabel}</div>
                      <button type="button" onClick={() => handleExerciseAction(exercise)}>
                        {exercise.mediaUrl ? 'Open Session' : 'Begin Session'}
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <p className="exercise-page-message">No exercises found yet. Admin-added sessions will appear here.</p>
            )}
          </section>

          <section className="integration-card">
            <div className="integration-content">
              <h3>Deep Breath Integration</h3>
              <p>
                {mediaReadyCount
                  ? `${mediaReadyCount} exercise sessions now include video or guided links from the admin library.`
                  : 'As your admin uploads new guided sessions, they will appear here automatically.'}
              </p>
              <button type="button" onClick={toggleZenMode}>Explore Zen Mode</button>
            </div>

            <div className="integration-visual">
              <div className="ring ring-outer" />
              <div className="ring ring-inner" />
              <span className="material-symbols-outlined">favorite</span>
            </div>
          </section>
        </main>
      </div>

      <button className="exercise-zen-toggle" type="button" onClick={toggleZenMode}>
        <span className="material-symbols-outlined">filter_vintage</span>
        <span>Zen Mode</span>
      </button>
    </div>
  );
}

export default ExercisesPage;

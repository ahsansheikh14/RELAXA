import UserNavbar from '../../components/UserNavbar';
import './ExercisesPage.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { toggleZenMode } from '../../utils/zenMode.js';
import { aiApi, moodApi } from '../../services/relaxaApi.js';
import { getExerciseVisual } from '../../utils/exerciseDisplay.js';
import { USER_MOOD_OPTIONS } from '../../constants/moodOptions.js';

const getAlgorithmLabel = (algorithm) => (algorithm === 'bfs' ? 'BFS' : 'A*');

function ExercisesPage() {
  const navigate = useNavigate();
  const userToken = localStorage.getItem('relaxaToken');
  const [currentMood, setCurrentMood] = useState(localStorage.getItem('relaxaCurrentMood') || '');
  const [allExercises, setAllExercises] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [aiSummary, setAiSummary] = useState({
    algorithmUsed: 'a_star',
    goalMood: '',
    bfsSteps: 0,
    aStarSteps: 0,
  });

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
        const historyResult = await moodApi.history({ token: userToken, limit: 1 });
        const latestMood = historyResult.moods?.[0]?.mood || localStorage.getItem('relaxaCurrentMood') || '';

        if (!USER_MOOD_OPTIONS.includes(latestMood)) {
          setCurrentMood('');
          setAllExercises([]);
          setLoadError('Choose your mood on the dashboard first to see exercises matched to that mood.');
          return;
        }

        setCurrentMood(latestMood);
        localStorage.setItem('relaxaCurrentMood', latestMood);

        const result = await aiApi.recommendations({
          token: userToken,
          currentMood: latestMood,
          algorithm: 'a_star',
          limit: 12,
        });
        setAllExercises(Array.isArray(result.data?.recommendedExercises) ? result.data.recommendedExercises : []);
        setAiSummary({
          algorithmUsed: result.data?.algorithmUsed || 'a_star',
          goalMood: result.data?.goalMood || '',
          bfsSteps: result.data?.bfs?.totalSteps || 0,
          aStarSteps: result.data?.aStar?.totalSteps || 0,
        });
      } catch (error) {
        setLoadError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, [userToken]);

  const exercises = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return allExercises;
    }

    return allExercises.filter((exercise) =>
      [exercise.title, exercise.description, exercise.category].some((value) =>
        String(value || '')
          .toLowerCase()
          .includes(query)
      )
    );
  }, [allExercises, search]);

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
              {currentMood
                ? `Showing AI-picked exercises matched to your current mood: ${currentMood}.`
                : 'Choose your mood on the dashboard and your matching exercises will appear here.'}
            </p>
            {currentMood && (
              <p className="exercise-ai-note">
                Using {getAlgorithmLabel(aiSummary.algorithmUsed)} toward {aiSummary.goalMood || 'Calm'}.
                BFS path steps: {aiSummary.bfsSteps} | A* path steps: {aiSummary.aStarSteps}
              </p>
            )}
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
                {currentMood
                  ? mediaReadyCount
                    ? `${mediaReadyCount} ${currentMood.toLowerCase()} mood AI recommendations include video or guided links.`
                    : `Your ${currentMood.toLowerCase()} mood AI recommendations are text-based for now.`
                  : 'As your admin uploads mood-targeted sessions, AI recommendations will appear here automatically.'}
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

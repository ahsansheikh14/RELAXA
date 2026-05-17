import UserNavbar from '../../components/UserNavbar';
import './DashboardPage.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toggleZenMode } from '../../utils/zenMode.js';
import { API_BASE_URL } from '../../utils/auth.js';
import { aiApi, moodApi, reportApi } from '../../services/relaxaApi.js';
import { getExerciseVisual } from '../../utils/exerciseDisplay.js';
import { USER_MOOD_OPTIONS } from '../../constants/moodOptions.js';

function DashboardPage() {
  const navigate = useNavigate();
  const userToken = localStorage.getItem('relaxaToken');
  const [userName, setUserName] = useState(localStorage.getItem('relaxaUserName') || 'there');
  const [currentMood, setCurrentMood] = useState(localStorage.getItem('relaxaCurrentMood') || '');
  const [moodNote, setMoodNote] = useState('');
  const [exercises, setExercises] = useState([]);
  const [insightText, setInsightText] = useState('Your next calm session is waiting for you.');
  const [dashboardError, setDashboardError] = useState('');
  const [savingMood, setSavingMood] = useState('');
  const moods = [
    { label: 'Radiant', icon: 'sentiment_very_satisfied', stressLevel: 2 },
    { label: 'Calm', icon: 'sentiment_satisfied', stressLevel: 3 },
    { label: 'Steady', icon: 'sentiment_neutral', stressLevel: 5 },
    { label: 'Tired', icon: 'sentiment_dissatisfied', stressLevel: 7 },
    { label: 'Overwhelmed', icon: 'sentiment_extremely_dissatisfied', stressLevel: 9 },
  ];

  useEffect(() => {
    if (!userToken) {
      return;
    }

    const loadDashboardData = async () => {
      try {
        const [profileResponse, moodTrendResult, moodHistoryResult] = await Promise.all([
          fetch(`${API_BASE_URL}/api/v1/users/me`, {
            headers: { Authorization: `Bearer ${userToken}` },
          }),
          reportApi.moodTrends({ token: userToken, days: 7 }),
          moodApi.history({ token: userToken, limit: 1 }),
        ]);

        const profileResult = await profileResponse.json();
        if (profileResponse.ok && profileResult.user?.name) {
          setUserName(profileResult.user.name);
          localStorage.setItem('relaxaUserName', profileResult.user.name);
        }

        const latestMood = moodHistoryResult.moods?.[0]?.mood || localStorage.getItem('relaxaCurrentMood') || '';
        if (USER_MOOD_OPTIONS.includes(latestMood)) {
          setCurrentMood(latestMood);
          setMoodNote(`Today's mood: ${latestMood}.`);
          localStorage.setItem('relaxaCurrentMood', latestMood);
          const recommendationResult = await aiApi.recommendations({
            token: userToken,
            currentMood: latestMood,
            algorithm: 'a_star',
            limit: 3,
          });
          const exerciseItems = Array.isArray(recommendationResult.data?.recommendedExercises)
            ? recommendationResult.data.recommendedExercises
            : [];
          setExercises(exerciseItems.slice(0, 3));
          setInsightText(
            exerciseItems.length
              ? `${exerciseItems.length} exercise${exerciseItems.length > 1 ? 's are' : ' is'} ready for your ${latestMood.toLowerCase()} mood.`
              : `No exercises are assigned to the ${latestMood.toLowerCase()} mood yet.`
          );
        } else {
          setCurrentMood('');
          setExercises([]);
          setMoodNote('Choose your mood to see matching exercises.');
          setInsightText('Choose your mood to unlock personalized exercise recommendations.');
        }

        const trendItems = Array.isArray(moodTrendResult.data) ? moodTrendResult.data : [];
        if (trendItems.length) {
          const totalEntries = trendItems.reduce((sum, item) => sum + (item.entries || 0), 0);
          setInsightText(`You captured ${totalEntries} mood check-ins this week. Keep the momentum going.`);
        }
      } catch {
        // Keep existing UI if dashboard fetch fails.
      }
    };

    loadDashboardData();
  }, [userToken]);

  const featuredExercise = exercises[0];
  const supportingExercise = exercises[1];
  const latestExercise = exercises[2] || exercises[1] || exercises[0];
  const featuredVisual = getExerciseVisual(featuredExercise, 0);

  const handleMoodSave = async (mood) => {
    if (!userToken) {
      setDashboardError('Please login again to save your mood.');
      return;
    }

    try {
      setDashboardError('');
      setSavingMood(mood.label);

      await moodApi.create({
        token: userToken,
        data: {
          mood: mood.label,
          stressLevel: mood.stressLevel,
          note: `${mood.label} selected from dashboard.`,
        },
      });

      localStorage.setItem('relaxaCurrentMood', mood.label);
      setCurrentMood(mood.label);
      setMoodNote(`${mood.label} mood saved for today.`);

      const recommendationResult = await aiApi.recommendations({
        token: userToken,
        currentMood: mood.label,
        algorithm: 'a_star',
        limit: 3,
      });
      const exerciseItems = Array.isArray(recommendationResult.data?.recommendedExercises)
        ? recommendationResult.data.recommendedExercises
        : [];
      setExercises(exerciseItems.slice(0, 3));
      setInsightText(
        exerciseItems.length
          ? `${exerciseItems.length} exercise${exerciseItems.length > 1 ? 's are' : ' is'} ready for your ${mood.label.toLowerCase()} mood.`
          : `No exercises are assigned to the ${mood.label.toLowerCase()} mood yet.`
      );
    } catch (error) {
      setDashboardError(error.message);
    } finally {
      setSavingMood('');
    }
  };

  return (
    <div className="dashboard-page">
      <UserNavbar />

      <main className="dashboard-main">
        <p className="dashboard-kicker">HI {userName.toUpperCase()}</p>
        <h1 className="dashboard-title">
          Finding peace in the <em>present moment.</em>
        </h1>
        <p className="dashboard-subtitle">
          Take a deep breath. Today is a new opportunity to nurture your mind and find your inner sanctuary.
        </p>
        {moodNote && <p className="dashboard-mood-note">{moodNote}</p>}

        <section className="mood-section">
          <h2 className="section-title">How are you feeling right now?</h2>
          <div className="mood-grid">
            {moods.map((mood) => (
              <button key={mood.label} className="mood-card" type="button" onClick={() => handleMoodSave(mood)}>
                <span className="mood-icon">
                  <span className="material-symbols-outlined">{mood.icon}</span>
                </span>
                <span>{savingMood === mood.label ? 'Saving...' : mood.label}</span>
              </button>
            ))}
          </div>
          {dashboardError && <p className="dashboard-feedback dashboard-feedback--error">{dashboardError}</p>}
        </section>

        <section className="focus-grid">
          <article className="featured-session">
            <img
              className="featured-image"
              src={featuredVisual.image}
              alt={featuredExercise?.title || 'Featured wellness session'}
            />
            <div className="featured-overlay" />
            <div className="featured-content">
              <div className="featured-tags">
                <span>RECOMMENDED</span>
                <span>{currentMood || (featuredExercise ? `${featuredExercise.durationMinutes} MIN` : 'CHOOSE MOOD')}</span>
              </div>
              <h3>{featuredExercise?.title || 'Your next calm session'}</h3>
              <p>
                {featuredExercise?.description ||
                  'Admin-added guided exercises will appear here so the dashboard always reflects your latest library.'}
              </p>
              <button type="button" onClick={() => navigate('/exercises')}>
                Begin Journey
              </button>
            </div>
          </article>

          <div className="floating-cards">
            <article className="float-card reflection">
              <span className="material-symbols-outlined float-icon">auto_awesome</span>
              <h4>Weekly Reflection</h4>
              <p>{insightText}</p>
              <button type="button" className="inline-link" onClick={() => navigate('/reports')}>
                View Reports
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </article>

            <article className="float-card gratitude">
              <div className="float-top">
                <span className="material-symbols-outlined float-icon">self_improvement</span>
              </div>
              <div className="float-content">
                <h4>{supportingExercise?.title || 'Daily Gratitude'}</h4>
                <p>
                  {supportingExercise?.description ||
                    latestExercise?.description ||
                    'What is one thing that brought you peace today?'}
                </p>
              </div>
              <button type="button" className="record-btn" onClick={() => navigate('/exercises')}>
                {supportingExercise ? 'Open Exercise' : 'Record Entry'}
              </button>
            </article>
          </div>
        </section>

        <section className="chat-cta">
          <div className="chat-bg-circle left" />
          <div className="chat-bg-circle right" />
          <div className="chat-icon">
            <span className="material-symbols-outlined">forum</span>
          </div>
          <h3>Need someone to talk to?</h3>
          <p>Our AI psychologist is available 24/7 to provide a safe space for your thoughts and feelings.</p>
          <button type="button" onClick={() => navigate('/chat')}>
            Chat with AI Psychologist
            <span className="material-symbols-outlined">bolt</span>
          </button>
        </section>
      </main>

      <button className="zen-floating-btn" type="button" onClick={toggleZenMode}>
        <span className="material-symbols-outlined">nights_stay</span>
        Zen Mode
      </button>
    </div>
  );
}

export default DashboardPage;

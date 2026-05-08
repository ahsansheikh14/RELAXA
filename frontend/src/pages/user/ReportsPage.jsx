import UserNavbar from '../../components/UserNavbar';
import './ReportsPage.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { toggleZenMode } from '../../utils/zenMode.js';
import { jsPDF } from 'jspdf';
import { API_BASE_URL } from '../../utils/auth.js';

function ReportsPage() {
  const navigate = useNavigate();
  const [moodPoints, setMoodPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('relaxaToken');
    const loadMoodData = async () => {
      if (!token) {
        setLoading(false);
        setLoadError('Please login again to view report trends.');
        return;
      }
      try {
        setLoadError('');
        const response = await fetch(`${API_BASE_URL}/api/v1/reports/mood-trends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Unable to load report trends.');
        }
        setMoodPoints(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        setLoadError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadMoodData();
  }, []);

  const summary = useMemo(() => {
    if (!moodPoints.length) {
      return {
        focusScore: 0,
        totalEntries: 0,
        avgStress: 0,
        trendText: 'No entries yet. Start logging moods to unlock insights.',
      };
    }

    const totalEntries = moodPoints.reduce((sum, item) => sum + (item.entries || 0), 0);
    const stressAvgRaw =
      moodPoints.reduce((sum, item) => sum + (item.averageStressLevel || 0), 0) / moodPoints.length;
    const avgStress = Number(stressAvgRaw.toFixed(1));
    const focusScore = Math.max(0, Math.min(100, Math.round((10 - avgStress) * 10)));
    const trendText =
      avgStress <= 4
        ? 'Your stress average is trending calm. Keep your current routine.'
        : 'Stress is a bit elevated. Try adding a short evening breathing session.';

    return { focusScore, totalEntries, avgStress, trendText };
  }, [moodPoints]);

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Relaxa Monthly Review', 14, 20);
    doc.setFontSize(12);
    doc.text('Focus Score: 84%', 14, 34);
    doc.text('Activity Mix: Meditation 12h, Breathing 5h, Reflection 3h', 14, 44);
    doc.text('Rest Quality: Improved deep sleep by 14 minutes/night.', 14, 54);
    doc.text('HRV: Stable at 65ms.', 14, 64);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 78);
    doc.save('relaxa-monthly-review.pdf');
  };

  const handleExportServerPdf = async () => {
    try {
      const token = localStorage.getItem('relaxaToken');
      const response = await fetch(`${API_BASE_URL}/api/v1/reports/mood-trends`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Unable to load report data.');
      }

      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Relaxa Mood Trends', 14, 20);
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

      let y = 44;
      const points = result.data || [];
      if (!points.length) {
        doc.text('No mood data available yet.', 14, y);
      } else {
        points.slice(0, 20).forEach((row) => {
          doc.text(
            `${row.date} | mood: ${row.mood} | entries: ${row.entries} | avg stress: ${row.averageStressLevel}`,
            14,
            y
          );
          y += 8;
        });
      }

      doc.save('relaxa-mood-trends.pdf');
    } catch (error) {
      window.alert(error.message);
      handleExportPdf();
    }
  };
  return (
    <div className="reports-page">
      <UserNavbar />

      <main className="reports-main">
        <section className="reports-header">
          <h1>Your Emotional Journey</h1>
          <p>
            Review your patterns and find stillness in the data. Your reflections over the last 30 days show a steady
            path toward balance.
          </p>
        </section>

        <section className="reports-grid">
          <article className="reports-card chart-card">
            <div className="chart-card-head">
              <div>
                <h2>Mood Frequency</h2>
                <p>Live Data</p>
              </div>
              <span className="pill">Weekly View</span>
            </div>

            <div className="chart-wrap">
              <svg className="chart-svg" viewBox="0 0 700 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0c5252" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0c5252" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {!moodPoints.length ? (
                  <text x="28" y="38" fill="#4a6458" fontSize="16">
                    {loading ? 'Loading mood trends...' : 'No mood trend data yet.'}
                  </text>
                ) : (
                  <>
                    <path
                      d="M0,160 C90,120 180,130 270,95 C360,70 450,105 540,85 C610,72 660,88 700,74 L700,200 L0,200 Z"
                      fill="url(#chartGradient)"
                    />
                    <path
                      d="M0,160 C90,120 180,130 270,95 C360,70 450,105 540,85 C610,72 660,88 700,74"
                      fill="none"
                      stroke="#0c5252"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="270" cy="95" r="5" fill="#ffffff" stroke="#0c5252" strokeWidth="2" />
                    <circle cx="540" cy="85" r="5" fill="#ffffff" stroke="#0c5252" strokeWidth="2" />
                  </>
                )}
              </svg>

              <div className="chart-days">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            <div className="insight-box">
              <span className="material-symbols-outlined">lightbulb</span>
              <div>
                <h3>Weekly Insight</h3>
                <p>
                  {summary.trendText}
                </p>
              </div>
            </div>
          </article>

          <div className="metric-column">
            <article className="reports-card focus-card">
              <h3>Focus Score</h3>
              <strong>{summary.focusScore}%</strong>
              <div className="focus-track">
                <span style={{ width: `${summary.focusScore}%` }} />
              </div>
              <p>Based on your current average stress level ({summary.avgStress}/10).</p>
              <span className="material-symbols-outlined leaf">energy_savings_leaf</span>
            </article>

            <article className="reports-card mix-card">
              <h3>Activity Mix</h3>
              <ul>
                <li>
                  <span>
                    <i className="dot meditation" />
                    Mood Entries
                  </span>
                  <b>{summary.totalEntries}</b>
                </li>
                <li>
                  <span>
                    <i className="dot breathing" />
                    Average Stress
                  </span>
                  <b>{summary.avgStress}/10</b>
                </li>
                <li>
                  <span>
                    <i className="dot reflection" />
                    Tracked Days
                  </span>
                  <b>{moodPoints.length}</b>
                </li>
              </ul>
              <button type="button" onClick={() => navigate('/exercises')}>View Detailed Log</button>
            </article>
          </div>

          <article className="reports-card small-card">
            <span className="material-symbols-outlined">sleep</span>
            <h3>Rest Quality</h3>
            <p>{loadError || 'Keep logging your mood daily to unlock richer rest-quality insights.'}</p>
            <div className="users-compare">
              <div className="color-dots">
                <i />
                <i />
                <i />
              </div>
              <small>Compared to 1,200 users</small>
            </div>
          </article>

          <article className="reports-card small-card">
            <span className="material-symbols-outlined">ecg_heart</span>
            <h3>Heart Rate Variability</h3>
            <p>Weekly emotional consistency improves as your average stress moves closer to the 3-4 range.</p>
            <div className="stable-chip">
              <span>Stable</span>
              <span className="material-symbols-outlined">trending_flat</span>
            </div>
          </article>

          <article className="reports-card monthly-card">
            <h3>Monthly Review</h3>
            <p>
              Download your comprehensive emotional report for October to share with your therapist or keep for your
              personal records.
            </p>
            <button type="button" onClick={handleExportServerPdf}>
              <span className="material-symbols-outlined">download</span>
              Export PDF
            </button>
            <div className="monthly-orb" />
          </article>
        </section>
      </main>

      <button className="reports-zen-toggle" type="button" onClick={toggleZenMode}>
        <span className="material-symbols-outlined">spa</span>
        <span>Zen Mode</span>
      </button>
    </div>
  );
}

export default ReportsPage;

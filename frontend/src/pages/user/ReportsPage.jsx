import UserNavbar from '../../components/UserNavbar';
import './ReportsPage.css';

function ReportsPage() {
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
                <p>Last 7 Days</p>
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
                <path
                  d="M0,150 C50,140 100,160 150,110 C200,60 250,90 300,70 C350,50 400,100 450,90 C500,80 550,130 600,100 C650,70 700,80 L700,200 L0,200 Z"
                  fill="url(#chartGradient)"
                />
                <path
                  d="M0,150 C50,140 100,160 150,110 C200,60 250,90 300,70 C350,50 400,100 450,90 C500,80 550,130 600,100 C650,70 700,80"
                  fill="none"
                  stroke="#0c5252"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="150" cy="110" r="5" fill="#ffffff" stroke="#0c5252" strokeWidth="2" />
                <circle cx="300" cy="70" r="5" fill="#ffffff" stroke="#0c5252" strokeWidth="2" />
                <circle cx="450" cy="90" r="5" fill="#ffffff" stroke="#0c5252" strokeWidth="2" />
                <circle cx="600" cy="100" r="5" fill="#ffffff" stroke="#0c5252" strokeWidth="2" />
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
                  You feel more stressed after work. Consider a 5-minute breathing exercise at 5:00 PM to transition
                  into your evening sanctuary.
                </p>
              </div>
            </div>
          </article>

          <div className="metric-column">
            <article className="reports-card focus-card">
              <h3>Focus Score</h3>
              <strong>84%</strong>
              <div className="focus-track">
                <span />
              </div>
              <p>12% higher than last month. Your consistency is paying off.</p>
              <span className="material-symbols-outlined leaf">energy_savings_leaf</span>
            </article>

            <article className="reports-card mix-card">
              <h3>Activity Mix</h3>
              <ul>
                <li>
                  <span>
                    <i className="dot meditation" />
                    Meditation
                  </span>
                  <b>12h</b>
                </li>
                <li>
                  <span>
                    <i className="dot breathing" />
                    Breathing
                  </span>
                  <b>5h</b>
                </li>
                <li>
                  <span>
                    <i className="dot reflection" />
                    Reflection
                  </span>
                  <b>3h</b>
                </li>
              </ul>
              <button type="button">View Detailed Log</button>
            </article>
          </div>

          <article className="reports-card small-card">
            <span className="material-symbols-outlined">sleep</span>
            <h3>Rest Quality</h3>
            <p>
              Your average deep sleep has increased by 14 minutes per night since starting the Evening Release
              protocol.
            </p>
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
            <p>
              HRV remains stable at 65ms, indicating a healthy autonomic nervous system and readiness for moderate
              exercise.
            </p>
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
            <button type="button">
              <span className="material-symbols-outlined">download</span>
              Export PDF
            </button>
            <div className="monthly-orb" />
          </article>
        </section>
      </main>

      <button className="reports-zen-toggle" type="button">
        <span className="material-symbols-outlined">spa</span>
        <span>Zen Mode</span>
      </button>
    </div>
  );
}

export default ReportsPage;

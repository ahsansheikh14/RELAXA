import UserNavbar from '../../components/UserNavbar';
import './DashboardPage.css';

function DashboardPage() {
  const moods = [
    { label: 'Radiant', icon: 'sentiment_very_satisfied' },
    { label: 'Calm', icon: 'sentiment_satisfied' },
    { label: 'Steady', icon: 'sentiment_neutral' },
    { label: 'Tired', icon: 'sentiment_dissatisfied' },
    { label: 'Overwhelmed', icon: 'sentiment_extremely_dissatisfied' },
  ];

  return (
    <div className="dashboard-page">
      <UserNavbar />

      <main className="dashboard-main">
        <p className="dashboard-kicker">GOOD MORNING, ELENA</p>
        <h1 className="dashboard-title">
          Finding peace in the <em>present moment.</em>
        </h1>
        <p className="dashboard-subtitle">
          Take a deep breath. Today is a new opportunity to nurture your mind and find your inner sanctuary.
        </p>

        <section className="mood-section">
          <h2 className="section-title">How are you feeling right now?</h2>
          <div className="mood-grid">
            {moods.map((mood) => (
              <button key={mood.label} className="mood-card" type="button">
                <span className="mood-icon">
                  <span className="material-symbols-outlined">{mood.icon}</span>
                </span>
                <span>{mood.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="focus-grid">
          <article className="featured-session">
            <img
              className="featured-image"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOf0HXS1T5rktylA_eOEAaaNt04R6A95GHZRzrMxksQYVHR6l2OQzWXscUc5sUTcJFmjqgy7v7_hVo9VE__oSb_grO7KES-JtLWWQEpztHlX0MU46U--fhW2-XuvPJDLEXbdnwpQ1dCpFMNU-ZmI_DPC_WYUeDIU9qrrU5nI3f-wmL9iXaYRzGifZLCuDz_roYPZzXrS6q8Qj6qWw8rYRIdVplJpxj0htua-yALBHF2jMX7FcpJc7ONGqZ43c3tD-zPoyilqI-uZ76"
              alt="Meditation by a calm lake"
            />
            <div className="featured-overlay" />
            <div className="featured-content">
              <div className="featured-tags">
                <span>RECOMMENDED</span>
                <span>12 MIN</span>
              </div>
              <h3>Ocean Breath Meditation</h3>
              <p>Synchronize your awareness with the rhythmic flow of the sea to dissolve anxiety and tension.</p>
              <button type="button">Begin Journey</button>
            </div>
          </article>

          <div className="floating-cards">
            <article className="float-card reflection">
              <span className="material-symbols-outlined float-icon">auto_awesome</span>
              <h4>Weekly Reflection</h4>
              <p>You've maintained your streak for 5 days. You're doing amazing.</p>
              <button type="button" className="inline-link">
                View Reports
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </article>

            <article className="float-card gratitude">
              <div className="float-top">
                <span className="material-symbols-outlined float-icon">self_improvement</span>
              </div>
              <div className="float-content">
                <h4>Daily Gratitude</h4>
                <p>What is one thing that brought you peace today?</p>
              </div>
              <button type="button" className="record-btn">
                Record Entry
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
          <button type="button">
            Chat with AI Psychologist
            <span className="material-symbols-outlined">bolt</span>
          </button>
          <div className="chat-live">
            <div className="chat-live-avatars">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuACwpij8gk-hFTCKst6RJuJnQMNEmlEd9VpDDuj_YfDffqeZCRx4W_lfaleJw-n1xHd2h0yCpCE1a5axUcUn6T7pBtg4tW7wXawA2SIVBJGsLJG-zKn4DA_tKZzgRVlLZcSIxUXhjzwgB2bnuPHzNQ-PZlSEK9SwhG0Ufk8Sy_FAQ76j8PsvOjEvu38Qpelocm3I_OuzzT0Syhq464nu6sJfxt6lAewRxYZigteyR1gpNNfOt2DUnS5xp767hJSt9AEOTLhuHbmk079"
                alt="Active user one"
              />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeRegHvIrWg1LcgckQw9p0yOAgknzrwyhXgQSFWzZPTI6O4_Up29Tj5OGHTkoWxVQrCO0Z89uTnVZ3ht_a2GhdDnZWVxqFhNN1Qx7ps9opGxFk9UKuf3UowK4M1E-cIKL_73nzzaACMmGqyukT3gDAf4Pnu38WhKPxM75D_PZKRhL67N2iAtc1Z8VyY96Bac7XKV1pGwU1DnFZ2q5a-C7Rrh8Vk35MnLEF9P814peQ1jwOoLbSpwh3WdGNf-drx-i905VsDuo9RsM1"
                alt="Active user two"
              />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_XeRasAi97FMVdRwfcaKStupMOzabUBxaLdzajL82D-creoOwFlh8DygAQOt0LuJqJ8vB5y1GLrlKDCAT-PjP6yHnBkEip34y-oSMeoI96y3HPrNnymmhp2okF3uuESRryjPeNuCtDH6DXFCTTcdfRqP5zJlpp4dZzxuFn3ase0Lefmx8u7mLgUf1VbLUiG2M1cjTrMykpTB6hQXpBvuBFhsROMv9WYO2KqS_Yrl4aWxa0uDLKkrNda_0kNWVa4fJlpBT-3eYcER5"
                alt="Active user three"
              />
            </div>
            <p>1.2k people chatting now</p>
          </div>
        </section>
      </main>

      <button className="zen-floating-btn" type="button">
        <span className="material-symbols-outlined">nights_stay</span>
        Zen Mode
      </button>
    </div>
  );
}

export default DashboardPage;

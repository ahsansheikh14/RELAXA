import UserNavbar from '../../components/UserNavbar';
import './ExercisesPage.css';
import { useNavigate } from 'react-router-dom';
import { toggleZenMode } from '../../utils/zenMode.js';

function ExercisesPage() {
  const navigate = useNavigate();
  const exerciseCards = [
    {
      title: 'Work Stress',
      duration: '10 MIN',
      icon: 'laptop_mac',
      description: 'Gently release tension from the shoulders and mind after a demanding day at the desk.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB_kf2lpvT0db-z7g_4HtCasKJjjKQIK406J7SUlXQjRm8UDnN8pjsHhbGHD61hCfhMEYSnGg7y4pQ0od9MlZj8mXYdN6EndakdpIR8MuubLENXQg2RbzhfJ2kDdeMxQjMHWUmMe3ueADZ3lnxD0lfJ4Vk2j-DSDpuR4YiVJOcNUismNdvGWOZuF2DiSiUqa9Cb9NkcDohcrEhj5UbXawwklfkVLR4Kr9-I4yjCyxEqkQR2VkWnSRh258ai0hi18R5zZNO_AfQhX2tr',
    },
    {
      title: 'Anxiety Relief',
      duration: '15 MIN',
      icon: 'air',
      description: 'Ground your thoughts with tactile breathing techniques designed to calm the nervous system.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCVhvIO8mycvhVcqWlBMu6y3ZzE6PAoxc-Pz_5UTfKQGybABScojbTgzT5FhGh817WwuR-VI1VGCtOlUFSIaAHBnyrQimtcvD6PlWVRW610DfS9DeHvtGW_-Ql6EyvoYx7Z7gIJiCG9GKLVaw9be5rnjNpcMkLru2ZnIiF-Zwm12-P-5P03sk178CiIh5_iWCz4O9yQki-uSc3kRh3geeHrukHFPqwwDtbsAWRKwhdDFAOG-bxQJcXV2q3c7D8aUYFnWwkmc4ItjJgj',
    },
    {
      title: 'Sleep Relaxation',
      duration: '25 MIN',
      icon: 'bedtime',
      description: 'A deep auditory journey to help you drift into a restful, restorative sleep naturally.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAeww9CREOi2wB0f-MJfMq-Rlb4woJ4S-n410GLxp7dbeuPOl-IwZUKHdo_Q44RtplTr4wHFnfnwcgUdE39Ed_0wUkssDCW7GcJ-Z6HJY-3_1eln4x4jPf8brOFCjIaWbc_5i_DGx2_gcvpOc2_gugA5oGkTW-lnXpuN_h6Iq6zHSSGOm1bErIjNzMVu_Y19E9g_Ndkw40NzEvY2beD8QubJo9sva8Hwq-EMQsy8NQUrZwDcwfcxNckA5DYXkieooIWgYs8Kd5sq8zN',
    },
  ];

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
            <p>Feeling stressed?</p>
            <h4>Start Breathing Exercise</h4>
            <div className="breath-progress">
              <span />
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
          </header>

          <section className="exercise-grid">
            {exerciseCards.map((card) => (
              <article key={card.title} className="exercise-card">
                <div className="exercise-image-wrap">
                  <img src={card.image} alt={card.title} />
                </div>
                <div className="exercise-content">
                  <div className="exercise-meta">
                    <span>{card.duration}</span>
                    <span className="material-symbols-outlined">{card.icon}</span>
                  </div>
                  <h2>{card.title}</h2>
                  <p>{card.description}</p>
                  <button type="button" onClick={() => navigate('/chat')}>
                    Begin Session
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </article>
            ))}
          </section>

          <section className="integration-card">
            <div className="integration-content">
              <h3>Deep Breath Integration</h3>
              <p>
                Our latest AI-driven breathing assistant syncs with your heart rate to provide personalized pacing for
                every session.
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

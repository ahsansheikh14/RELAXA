import UserNavbar from '../../components/UserNavbar';
import './ChatPage.css';
import { toggleZenMode } from '../../utils/zenMode.js';

function ChatPage() {
  return (
    <div className="chat-page">
      <UserNavbar />

      <div className="chat-layout">
        <aside className="chat-sidenav">
          <div className="chat-sidenav-head">
            <div className="assistant-icon">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <div>
              <h2>Zen Assistant</h2>
              <p>Your digital sanctuary</p>
            </div>
          </div>

          <button type="button" className="chat-side-btn active">
            <span className="material-symbols-outlined">add_comment</span>
            New Chat
          </button>
          <button type="button" className="chat-side-btn">
            <span className="material-symbols-outlined">history</span>
            Chat History
          </button>

          <div className="chat-breath-widget">
            <p>DAILY MINDFULNESS</p>
            <h4>Ready for your afternoon pause?</h4>
            <button type="button">
              <span className="material-symbols-outlined">air</span>
              Start Breathing Exercise
            </button>
          </div>
        </aside>

        <main className="chat-main">
          <div className="chat-scroll">
            <div className="message-row user">
              <div className="message-bubble user-bubble">
                Hi Relaxa, I&apos;ve been feeling a bit overwhelmed with work lately. Can we talk about some quick
                grounding techniques?
              </div>
              <img
                className="message-avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtw8_A0-48brwCsOSqQ1I2fjz_Rx7WXEeyQ0DycdxivtzJntxwplJVV886ktLJFOjYgYHZtDnga4BBJEeZ58e5CV4lj61mbGkEylaId_uvVnq6UddNouCMpQdcxmYw21Twy7wImNrBJHaka8KTHjytAXNrZPo_Ng2OLMoqhmjrCGxV394Rx7hJ-WQPS-XmZR6RK74uY5WD9zAXasg0XRicxb2qCR6ocPZSxjrS1p7wKnp7rxtvgUfcQq5HO-8TLE5TJ5SgAdFJUqq2"
                alt="User profile"
              />
            </div>

            <div className="message-row ai">
              <div className="assistant-avatar">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <div className="message-bubble ai-bubble">
                <p>
                  I&apos;m sorry to hear you&apos;re feeling overwhelmed, but I&apos;m here to help you find your
                  center. Grounding is a beautiful way to bring yourself back to the present moment when the mind
                  starts to race.
                </p>

                <div className="technique-box">
                  <p className="technique-title">
                    <span className="material-symbols-outlined">psychology</span>
                    The 5-4-3-2-1 Technique
                  </p>
                  <ul>
                    <li>Name 5 things you can see around you.</li>
                    <li>Name 4 things you can touch.</li>
                    <li>Name 3 things you can hear.</li>
                    <li>Name 2 things you can smell.</li>
                    <li>Name 1 thing you can taste.</li>
                  </ul>
                </div>

                <p>Shall we try the first step together? Tell me 5 things you can see in your environment right now.</p>
              </div>
            </div>

            <div className="suggestion-grid">
              <article className="guided-card">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLsAsOvRa6Eczbb_tStS5ct45Wil0f09YSfVTBSCG6eF0xs_zfjuxEIrL3_TX7FTYBj5czSN5gcNUfWiHKeZXqJekoORF2TacxMCAXUC1YowYGanV01qXF_1x22Go7saWxJblBPgUkCWJ_zi1Dn-Xw6N8GECzk0M1xoVYMGsIWNrmHHjUCZCTilGB6cEQD0C0wBlvHLQ7yB3VChOCEfUuTZy7ejVvCzFQtac18OCK6FQu7jC-Ium6wIroeLiy4MZJtIqbUyC0embW_"
                  alt="Calm lake audio"
                />
                <div className="guided-overlay" />
                <div className="guided-content">
                  <p>Guided Audio</p>
                  <h4>Quick 2-min Calm</h4>
                </div>
              </article>

              <article className="journal-card">
                <span className="material-symbols-outlined">spa</span>
                <div>
                  <p>Journal Prompt</p>
                  <h4>Reflection on Stillness</h4>
                </div>
              </article>
            </div>
          </div>

          <div className="chat-input-area">
            <div className="chat-input-wrap">
              <textarea rows="1" placeholder="Ask Relaxa AI..." />
              <div className="input-actions">
                <button type="button">
                  <span className="material-symbols-outlined">mic</span>
                </button>
                <button type="button">
                  <span className="material-symbols-outlined">attach_file</span>
                </button>
                <button type="button" className="send-btn">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
            <p className="chat-disclaimer">
              Relaxa AI can help guide your wellness journey but is not a substitute for professional health advice.
            </p>
          </div>
        </main>
      </div>

      <button className="chat-zen-fab" type="button" onClick={toggleZenMode}>
        <span className="material-symbols-outlined">self_improvement</span>
      </button>
    </div>
  );
}

export default ChatPage;

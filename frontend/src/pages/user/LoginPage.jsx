 import './LoginPage.css';
import { useState } from 'react';

function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <section className="login-page">
      <div className="login-bg-orb top" />
      <div className="login-bg-orb bottom" />

      <main className="login-main">
        <div className="login-content">
          <header className="login-header">
            <h1 className="brand">Relaxa</h1>
            <p className="tagline">Your digital sanctuary awaits.</p>
          </header>

          <div className="login-card">
            <div className="auth-tabs">
              <button
                className={`tab ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => setActiveTab('login')}
                type="button"
              >
                Login
              </button>
              <button
                className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => setActiveTab('signup')}
                type="button"
              >
                Sign Up
              </button>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <div className="input-wrap">
                <span className="material-symbols-outlined input-icon">mail</span>
                <input
                  id="email"
                  className="form-input"
                  type="email"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <button className="forgot-link" type="button">
                  Forgot?
                </button>
              </div>
              <div className="input-wrap">
                <span className="material-symbols-outlined input-icon">lock</span>
                <input
                  id="password"
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                />
                <button className="input-trailing" type="button" aria-label="Toggle password visibility">
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            </div>

            <button className="submit-btn" type="button">
              Enter Sanctuary
            </button>

            <div className="continue-row">
              <span className="continue-line" />
              <span>Or continue with</span>
              <span className="continue-line" />
            </div>

            <div className="social-row">
              <button className="social-btn" type="button">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgSRzyEaRZ0bUuywC4iStQscYKVfxp8jLNXOmUTHEAKp0a8GVw2H3JskUFAiGz7x8VIMOgUKUJB67leOnhw3SDMsH6qhRfcdWUg23v3Y92CGn4zLEcHlFaG9N74QBVVip-o6BEflOgdN9XkaJDdOUUMDAwpKgkBzqjOAlYF80F8pKroxafow3x6io4Tpe9SNNZv0WJo11VJhj3HjLb87xtZAYIEzjnOSCM9OI42vDJ-iSTLimhivjCaaoG_kPMGSOBQzvPstn2yH4W"
                  alt="Google"
                />
                Google
              </button>
              <button className="social-btn" type="button">
                <span className="material-symbols-outlined">ios</span>
                Apple
              </button>
            </div>
          </div>
        </div>

        <aside className="zen-sidebar">
          <div className="zen-progress">
            <div className="zen-progress-fill" />
          </div>
          <p>MINDFULNESS PHASE 01</p>
        </aside>
      </main>

      <footer className="login-footer">
        <p className="terms">
          By entering, you agree to our <a href="#/">Terms of Service</a> and <a href="#/">Privacy Policy</a>
        </p>

        <div className="reflection">
          <div className="reflection-icon">
            <span className="material-symbols-outlined">spa</span>
          </div>
          <div>
            <p className="reflection-title">Daily Reflection</p>
            <p className="reflection-sub">"Calm is a superpower."</p>
          </div>
        </div>
      </footer>

      <img
        className="login-illustration"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyVN77jCHhWehnQXxYGYMFlHTooIPMz4bBdnoTh6tQf67AHbALu-avNbfMj5cyW8eeg9Zw5pv5ytgUTG7kfmDlwmSrXQ4E-EINsSct4C76j4n4mY_QoH-R2E0kgc_BeWEqPolM7b0SWPF3NWfSdTXBrwNuP_4kl9DLqIN2lLcTXSqPF-rsGkonClgf2nlR7oJQPykXy7yX8hWLfTeZ0EsGJl7fB7WMnCWboqvYsHEIy1Ij2AZFy7f23XI7vyUblXa539Nufhz4-ZSu"
        alt="Serene mountain illustration"
      />
    </section>
  );
}

export default LoginPage;

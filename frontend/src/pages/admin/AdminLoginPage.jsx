import './AdminLoginPage.css';

function AdminLoginPage() {
  return (
    <section className="admin-login-page">
      <div className="admin-login-container">
        <header className="admin-login-brand">
          <h1>Relaxa</h1>
          <p>Admin Portal</p>
        </header>

        <article className="admin-login-card">
          <header className="admin-login-head">
            <h2>Admin Login</h2>
            <p>Secure access for system administrators only.</p>
          </header>

          <form className="admin-login-form">
            <div className="field-group">
              <label htmlFor="admin-email">Admin Email</label>
              <div className="field-wrap">
                <span className="material-symbols-outlined">admin_panel_settings</span>
                <input id="admin-email" type="email" placeholder="admin@relaxa.com" />
              </div>
            </div>

            <div className="field-group">
              <div className="field-label-row">
                <label htmlFor="admin-password">Password</label>
                <button type="button">Forgot?</button>
              </div>
              <div className="field-wrap">
                <span className="material-symbols-outlined">lock</span>
                <input id="admin-password" type="password" placeholder="••••••••" />
              </div>
            </div>

            <button className="admin-login-submit" type="button">
              Login to Dashboard
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <div className="secure-session">
            <span className="material-symbols-outlined">shield</span>
            <p>Encrypted Secure Session</p>
          </div>
        </article>

        <footer className="admin-login-footer">
          <p>
            Not an administrator? <a href="#/">Return to Home</a>
          </p>
        </footer>
      </div>

      <div className="admin-login-orb top" />
      <div className="admin-login-orb bottom" />
    </section>
  );
}

export default AdminLoginPage;

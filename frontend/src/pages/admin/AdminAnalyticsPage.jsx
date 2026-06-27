import AdminLayout from '../../components/AdminLayout';
import './AdminSectionPage.css';
import { useEffect, useState } from 'react';
import { adminApi } from '../../services/relaxaApi.js';

function AdminAnalyticsPage() {
  const adminToken = localStorage.getItem('relaxaAdminToken');
  const [summary, setSummary] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalExercises: 0,
    totalMoodEntries: 0,
    platformHealth: 99.9,
  });
  const [activityMix, setActivityMix] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const [summaryResult, activityResult] = await Promise.all([
          adminApi.getAnalyticsSummary({ token: adminToken }),
          adminApi.getActivityMix({ token: adminToken }),
        ]);
        setSummary(summaryResult.data || {});
        setActivityMix(activityResult.data || []);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [adminToken]);

  return (
    <AdminLayout layoutClass="admin-section-layout">
      <main className="admin-section-main">
        <h2>Analytics</h2>
        <p>Track platform metrics, engagement trends, and exercise distribution in one place.</p>

        {errorMessage && <p className="admin-section-error">{errorMessage}</p>}

        <section className="analytics-card-grid">
          <article className="analytics-card">
            <span>Total Users</span>
            <strong>{summary.totalUsers || 0}</strong>
            <p>Registered users using Relaxa</p>
          </article>
          <article className="analytics-card">
            <span>Active Users</span>
            <strong>{summary.activeUsers || 0}</strong>
            <p>Users active in the last 30 days</p>
          </article>
          <article className="analytics-card">
            <span>Total Exercises</span>
            <strong>{summary.totalExercises || 0}</strong>
            <p>Content available across all categories</p>
          </article>
          <article className="analytics-card health">
            <span>Platform Health</span>
            <strong>{summary.platformHealth || 99.9}%</strong>
            <p>Current operational score</p>
          </article>
        </section>

        <section className="admin-data-card">
          <div className="admin-toolbar">
            <div>
              <h3>Exercise Activity Mix</h3>
              <p>Category distribution based on uploaded exercises.</p>
            </div>
          </div>

          {isLoading ? (
            <p className="admin-empty-state">Loading analytics...</p>
          ) : activityMix.length ? (
            <div className="mix-list">
              {activityMix.map((item) => {
                const maxCount = activityMix[0]?.count || 1;
                const width = Math.max(12, Math.round((item.count / maxCount) * 100));

                return (
                  <div className="mix-row" key={item.category}>
                    <div className="mix-row__meta">
                      <strong>{item.category || 'Uncategorized'}</strong>
                      <span>{item.count} exercises</span>
                    </div>
                    <div className="mix-bar">
                      <span style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="admin-empty-state">No exercise analytics yet. Add exercises to populate this section.</p>
          )}
        </section>

        <section className="analytics-card-grid secondary">
          <article className="analytics-card soft">
            <span>Mood Entries</span>
            <strong>{summary.totalMoodEntries || 0}</strong>
            <p>Total mood logs submitted by users</p>
          </article>
          <article className="analytics-card soft">
            <span>Insight</span>
            <strong>{activityMix[0]?.category || 'No Data'}</strong>
            <p>Top exercise category currently leading usage mix</p>
          </article>
        </section>
      </main>
    </AdminLayout>
  );
}

export default AdminAnalyticsPage;

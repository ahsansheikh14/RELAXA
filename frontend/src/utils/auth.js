const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/v1\/?$/, '') || 'http://localhost:5000';

const setUserToken = (token) => {
  localStorage.setItem('relaxaToken', token);
};

const clearUserSession = () => {
  localStorage.removeItem('relaxaToken');
  localStorage.removeItem('relaxaUserName');
};

const setAdminToken = (token) => {
  localStorage.setItem('relaxaAdminToken', token);
};

const clearAdminSession = () => {
  localStorage.removeItem('relaxaAdminToken');
};

export { API_BASE_URL, setUserToken, clearUserSession, setAdminToken, clearAdminSession };

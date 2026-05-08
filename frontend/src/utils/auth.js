const API_BASE_URL = 'http://localhost:5000';

const setUserToken = (token) => {
  localStorage.setItem('relaxaToken', token);
};

const clearUserSession = () => {
  localStorage.removeItem('relaxaToken');
};

const setAdminToken = (token) => {
  localStorage.setItem('relaxaAdminToken', token);
};

const clearAdminSession = () => {
  localStorage.removeItem('relaxaAdminToken');
};

export { API_BASE_URL, setUserToken, clearUserSession, setAdminToken, clearAdminSession };

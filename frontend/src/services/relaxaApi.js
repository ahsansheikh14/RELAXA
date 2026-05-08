const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const buildHeaders = (token, extraHeaders = {}) => {
  const headers = { 'Content-Type': 'application/json', ...extraHeaders };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = { success: false, message: 'Invalid JSON response from server.' };
  }

  if (!response.ok) {
    throw new Error(payload?.message || 'Request failed.');
  }

  return payload;
};

export const adminApi = {
  login: ({ email, password }) =>
    request('/admin/login', {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ email, password }),
    }),

  getUsers: ({ token, page = 1, limit = 10, search = '' } = {}) =>
    request(`/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`, {
      method: 'GET',
      headers: buildHeaders(token),
    }),
};

export const exerciseApi = {
  list: ({ token, category = '' } = {}) =>
    request(`/exercises${category ? `?category=${encodeURIComponent(category)}` : ''}`, {
      method: 'GET',
      headers: buildHeaders(token),
    }),

  create: ({ token, data }) =>
    request('/exercises', {
      method: 'POST',
      headers: buildHeaders(token),
      body: JSON.stringify(data),
    }),

  update: ({ token, id, data }) =>
    request(`/exercises/${id}`, {
      method: 'PATCH',
      headers: buildHeaders(token),
      body: JSON.stringify(data),
    }),

  remove: ({ token, id }) =>
    request(`/exercises/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(token),
    }),
};

export const reportApi = {
  moodTrends: ({ token, days = 30 } = {}) =>
    request(`/reports/mood-trends?days=${days}`, {
      method: 'GET',
      headers: buildHeaders(token),
    }),
};

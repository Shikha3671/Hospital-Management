const API_BASE_URL = 'http://3.111.33.46:5001/api';

function getToken() {
  return localStorage.getItem('token');
}

function saveAuth(data) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.admin || data.user || data));
}

function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function isLoggedIn() {
  return Boolean(getToken());
}

function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: getAuthHeaders(),
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

function showMessage(element, message, type = 'error') {
  if (!element) return;
  element.textContent = message;
  element.className = `message ${type}`;
}

function requireAuth(redirectPath = '../pages/login.html') {
  if (!isLoggedIn()) {
    window.location.href = redirectPath;
    return false;
  }
  return true;
}

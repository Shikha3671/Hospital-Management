document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth('../pages/login.html')) return;

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const welcome = document.getElementById('welcome-user');
  if (welcome) {
    welcome.textContent = `Welcome, ${user.fullName || user.name || 'Admin'}`;
  }
});

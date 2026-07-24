document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const logoutBtn = document.getElementById('logout-btn');
  const messageBox = document.getElementById('message-box');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      try {
        const data = await apiRequest('/admin/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
        saveAuth(data);
        showMessage(messageBox, 'Login successful', 'success');
        setTimeout(() => {
          window.location.href = '../pages/admin-dashboard.html';
        }, 800);
      } catch (error) {
        showMessage(messageBox, error.message, 'error');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const fullName = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const phone = document.getElementById('register-phone').value;

      try {
        await apiRequest('/admin/register', {
          method: 'POST',
          body: JSON.stringify({ fullName, email, password, phone })
        });
        showMessage(messageBox, 'Registration successful. Please login.', 'success');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 800);
      } catch (error) {
        showMessage(messageBox, error.message, 'error');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearAuth();
      window.location.href = '../index.html';
    });
  }
});

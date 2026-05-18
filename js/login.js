
redirectIfLoggedIn();

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');

  loginForm.addEventListener('submit', event => {
    event.preventDefault();
    const email = loginEmail.value.trim().toLowerCase();
    const password = loginPassword.value;

    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    const result = loginUser(email, password);
    if (!result.success) {
      alert(result.message);
      return;
    }
    window.location.href = 'home.html';
  });
});

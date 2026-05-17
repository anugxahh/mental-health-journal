document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const nameInput = document.getElementById('registerName');
  const emailInput = document.getElementById('registerEmail');
  const passwordInput = document.getElementById('registerPassword');
  const confirmInput = document.getElementById('registerConfirm');

  registerForm.addEventListener('submit', event => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    if (!name || !email || !password || !confirm) {
      alert('Please fill in all fields.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      alert('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirm) {
      alert('Passwords do not match.');
      return;
    }

    const result = registerUser(name, email, password);
    if (!result.success) {
      alert(result.message);
      return;
    }

    alert('Registration successful! You are now logged in.');
    window.location.href = 'home.html';
  });
});

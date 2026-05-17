function getUsers() {
  return JSON.parse(localStorage.getItem('mhj_users') || '{}');
}

function saveUsers(users) {
  localStorage.setItem('mhj_users', JSON.stringify(users));
}

function getCurrentUserEmail() {
  return localStorage.getItem('mhj_currentUser') || '';
}

function setCurrentUserEmail(email) {
  if (email) {
    localStorage.setItem('mhj_currentUser', email);
  } else {
    localStorage.removeItem('mhj_currentUser');
  }
}

function getCurrentUser() {
  const email = getCurrentUserEmail();
  if (!email) return null;
  const users = getUsers();
  return users[email] || null;
}

function isLoggedIn() {
  return localStorage.getItem('mhj_loggedIn') === 'true' && Boolean(getCurrentUserEmail());
}

function requireLogin() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = 'home.html';
  }
}

function loginUser(email, password) {
  const users = getUsers();
  const account = users[email];
  if (!account) {
    return { success: false, message: 'No account found with that email.' };
  }
  if (account.password !== password) {
    return { success: false, message: 'Incorrect password.' };
  }
  setCurrentUserEmail(email);
  localStorage.setItem('mhj_name', account.name);
  localStorage.setItem('mhj_loggedIn', 'true');
  return { success: true };
}

function registerUser(name, email, password) {
  const users = getUsers();
  if (users[email]) {
    return { success: false, message: 'An account already exists with that email.' };
  }
  users[email] = { name, email, password };
  saveUsers(users);
  setCurrentUserEmail(email);
  localStorage.setItem('mhj_name', name);
  localStorage.setItem('mhj_loggedIn', 'true');
  return { success: true };
}

function updateCurrentUserName(name) {
  const email = getCurrentUserEmail();
  if (!email) return;
  const users = getUsers();
  if (!users[email]) return;
  users[email].name = name;
  saveUsers(users);
  localStorage.setItem('mhj_name', name);
}

function logoutUser() {
  localStorage.setItem('mhj_loggedIn', 'false');
  setCurrentUserEmail('');
  window.location.href = 'login.html';
}

requireLogin();

const moodScore  = { awful: 1, sad: 2, neutral: 3, good: 4, great: 5 };
const moodEmoji  = { 1: '😞', 2: '😔', 3: '😐', 4: '😊', 5: '😄' };
const avatarByMood = { 1: '😞', 2: '😔', 3: '😐', 4: '😊', 5: '😄' };

const entries = getAllEntries();

function calcStreak() {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const str = d.toISOString().split('T')[0];
    if (entries.find(e => e.date === str)) streak++;
    else break;
  }
  return streak;
}

function calcAvg() {
  if (entries.length === 0) return 3;
  const total = entries.reduce((sum, e) => sum + (moodScore[e.mood] || 3), 0);
  return Math.round(total / entries.length);
}

function calcHappy() {
  if (entries.length === 0) return 0;
  const happy = entries.filter(e => e.mood === 'good' || e.mood === 'great').length;
  return Math.round((happy / entries.length) * 100);
}

const avg = calcAvg();

function animateValue(id, end, duration, suffix) {
  duration = duration || 900;
  suffix = suffix || '';
  const element = document.getElementById(id);
  if (!element) return;
  if (end <= 0) {
    element.textContent = '0' + suffix;
    return;
  }
  const range = end;
  const stepTime = Math.max(Math.floor(duration / range), 16);
  let current = 0;
  const timer = setInterval(function() {
    current += 1;
    element.textContent = current + suffix;
    if (current >= end) {
      clearInterval(timer);
    }
  }, stepTime);
}

document.getElementById('profileAvg').textContent = moodEmoji[avg];
document.getElementById('avatarEmoji').textContent = avatarByMood[avg];
animateValue('profileStreak', calcStreak());
animateValue('profileHappy', calcHappy(), 1100, '%');

function loadName() {
  const user = getCurrentUser();
  const name = (user && user.name) || localStorage.getItem('mhj_name') || '';
  document.getElementById('nameInput').value = name;
  document.getElementById('displayName').textContent = name || 'Your Name';
}

document.getElementById('saveNameBtn').addEventListener('click', function() {
  const name = document.getElementById('nameInput').value.trim();
  if (!name) { alert('Please enter a name!'); return; }
  updateCurrentUserName(name);
  document.getElementById('displayName').textContent = name;
  alert('Name saved! ✅');
});

loadName();

function getIntentions() {
  return JSON.parse(localStorage.getItem('mhj_intentions') || '[]');
}

function saveIntentions(list) {
  localStorage.setItem('mhj_intentions', JSON.stringify(list));
}

function loadIntentions() {
  const list = getIntentions();
  const container = document.getElementById('intentionList');
  if (list.length === 0) {
    container.innerHTML = '<p style="color:var(--subtext);font-size:13px;">No intentions yet. Add one below!</p>';
    return;
  }
  container.innerHTML = list.map(function(item, i) {
    return `
      <div class="intention-item">
        <input type="checkbox" ${item.done ? 'checked' : ''}
          onchange="toggleIntention(${i})">
        <span class="${item.done ? 'done' : ''}">${item.text}</span>
      </div>
    `;
  }).join('');
}

function toggleIntention(index) {
  const list = getIntentions();
  list[index].done = !list[index].done;
  saveIntentions(list);
  loadIntentions();
}

document.getElementById('addIntentionBtn').addEventListener('click', function() {
  const text = document.getElementById('intentionInput').value.trim();
  if (!text) return;
  const list = getIntentions();
  list.push({ text: text, done: false });
  saveIntentions(list);
  document.getElementById('intentionInput').value = '';
  loadIntentions();
});

loadIntentions();

function loadInsights() {
  const streak = calcStreak();
  const happy = calcHappy();
  const insights = [
    streak >= 3 ? '🔥 You\'ve logged ' + streak + ' days in a row. Keep going!' : null,
    happy >= 50 ? '😊 You feel happy ' + happy + '% of the time. That\'s great!' : null,
    entries.length >= 5 ? '📓 You\'ve written ' + entries.length + ' journal entries so far.' : null,
    '🚶 Walking before stressful tasks helps improve mood.',
    '✅ Finishing weekly task lists gives you a sprint boost.'
  ].filter(Boolean);

  const box = document.getElementById('recentInsights');
  box.innerHTML = insights.map(function(i) {
    return '<div class="insight-item">• ' + i + '</div>';
  }).join('');
}

loadInsights();

document.getElementById('logoutBtn').addEventListener('click', function() {
  if (confirm('Logout will take you back to the login screen.')) {
    logoutUser();
  }
});

document.getElementById('clearBtn').addEventListener('click', function() {
  if (confirm('This will delete ALL your entries and data. Are you sure?')) {
    const users = JSON.parse(localStorage.getItem('mhj_users') || '{}'); 
    localStorage.clear();
    localStorage.setItem('mhj_users', JSON.stringify(users)); 
    alert('All data cleared!');
    window.location.href = 'login.html';
  }
});

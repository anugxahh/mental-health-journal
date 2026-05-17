requireLogin();

const moodEmojis = {
  awful: '😞', sad: '😔', neutral: '😐', good: '😊', great: '😄'
};

let selectedMood = null;

// Dynamic greeting based on time of day
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Mood button selection
document.querySelectorAll('.mood-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedMood = btn.dataset.mood;
  });
});

// Save mood button
document.getElementById('checkinBtn').addEventListener('click', () => {
  if (!selectedMood) {
    alert('Please select a mood first!');
    return;
  }

  // Check if today already logged
  const entries = getAllEntries();
  const alreadyLogged = entries.find(e => e.date === getTodayStr());
  if (alreadyLogged) {
    alert('You already checked in today!');
    return;
  }

  const entry = {
    date: getTodayStr(),
    mood: selectedMood,
    text: ''
  };
  saveEntry(entry);
  alert('Mood saved! ✅ Now go write a journal entry.');
  window.location.href = 'journal.html';
});

// Load streak row
function loadStreak() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const entries = getAllEntries();
  const dates = entries.map(e => e.date);
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  const row = document.getElementById('streakRow');
  row.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const str = d.toISOString().split('T')[0];
    const isToday = str === getTodayStr();
    const done = dates.includes(str);

    row.innerHTML += `
      <div class="streak-day">
        <div class="streak-dot ${done ? (isToday ? 'today' : 'done') : ''}"></div>
        ${days[i]}
      </div>`;
  }
}

// Load yesterday's note
function loadYesterdayNote() {
  const entries = getAllEntries();
  const yest = entries.find(e => e.date === getYesterdayStr());
  if (yest) {
    document.getElementById('yesterdayNote').textContent =
      yest.text ? '"' + yest.text + '"' : 'Mood: ' + moodEmojis[yest.mood];
    document.getElementById('yesterdayDate').textContent = yest.date;
  }
}

function loadUserName() {
  const user = getCurrentUser();
  const name = (user && user.name) || localStorage.getItem('mhj_name') || '';
  const greeting = getGreeting();
  if (name) {
    document.querySelector('.header p').textContent = greeting + ', ' + name + ' 👋';
  } else {
    document.querySelector('.header p').textContent = greeting + ' 👋';
  }
}

loadUserName();
loadStreak();
loadYesterdayNote();

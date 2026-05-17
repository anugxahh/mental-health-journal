requireLogin();

const moodScore = { awful: 1, sad: 2, neutral: 3, good: 4, great: 5 };
const moodEmoji = { 1: '😞', 2: '😔', 3: '😐', 4: '😊', 5: '😄' };
const moodColors = {
  awful: '#EF4444', sad: '#F97316',
  neutral: '#EAB308', good: '#22C55E', great: '#6C63FF'
};

const entries = getAllEntries();

function getLastNDates(n) {
  const today = new Date();
  return Array.from({ length: n }, (_, index) => {
    const d = new Date(today);
    d.setDate(today.getDate() - index);
    return d.toISOString().split('T')[0];
  }).reverse();
}

function getWeeklyMetrics() {
  const metrics = getAllMetrics();
  return getLastNDates(7).map(date => metrics[date] || null);
}

function averageMetric(values) {
  const valid = values.filter(v => typeof v === 'number' && !isNaN(v));
  if (!valid.length) return 0;
  return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
}

// --- Stats ---
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

function calcAvgMood() {
  if (entries.length === 0) return 3;
  const total = entries.reduce((sum, e) => sum + (moodScore[e.mood] || 3), 0);
  return Math.round(total / entries.length);
}

function calcHappyPct() {
  if (entries.length === 0) return 0;
  const happy = entries.filter(e => e.mood === 'good' || e.mood === 'great').length;
  return Math.round((happy / entries.length) * 100);
}

document.getElementById('statStreak').textContent = calcStreak();
document.getElementById('statAvg').textContent = moodEmoji[calcAvgMood()];
document.getElementById('statHappy').textContent = calcHappyPct() + '%';

// --- Key Metrics (moved ABOVE loadBreakdown so it's defined before being called) ---
function loadKeyMetrics() {
  const weekMetrics = getWeeklyMetrics();
  const completedEntries = entries.length;
  const daysLogged = entries.filter(entry => getLastNDates(7).includes(entry.date)).length;
  const weeklyProgress = Math.round((daysLogged / 7) * 100);
  const avgStress = averageMetric(weekMetrics.map(item => item ? item.stress : undefined).filter(v => v !== undefined));
  const avgSleep = averageMetric(weekMetrics.map(item => item ? item.sleep : undefined).filter(v => v !== undefined));
  const avgProductivity = averageMetric(weekMetrics.map(item => item ? item.productivity : undefined).filter(v => v !== undefined));
  const avgWater = averageMetric(weekMetrics.map(item => item ? item.water : undefined).filter(v => v !== undefined));
  const exerciseDays = weekMetrics.filter(item => item && item.exerciseDays > 0).length;
  const goalsCompleted = weekMetrics.reduce((sum, item) => sum + (item ? (item.goalsCompleted || 0) : 0), 0);

  const cards = [
    { title: 'Total Journal Entries', value: completedEntries },
    { title: 'Weekly Progress', value: weeklyProgress + '%' },
    { title: 'Stress Level', value: avgStress || '-' },
    { title: 'Sleep Quality', value: avgSleep || '-' },
    { title: 'Productivity Score', value: avgProductivity || '-' },
    { title: 'Water Intake', value: avgWater ? avgWater + ' cups' : '-' },
    { title: 'Exercise Days', value: exerciseDays },
    { title: 'Goals Completed', value: goalsCompleted }
  ];

  const container = document.getElementById('keyMetrics');
  container.innerHTML = cards.map(card => `
    <div class="metric-card">
      <div class="metric-title">${card.title}</div>
      <div class="metric-value">${card.value}</div>
    </div>
  `).join('');
}

// --- Bar Chart (this week) ---
function getWeekData() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = [];
  const colors = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const str = d.toISOString().split('T')[0];
    const entry = entries.find(e => e.date === str);
    if (entry) {
      data.push(moodScore[entry.mood]);
      colors.push(moodColors[entry.mood]);
    } else {
      data.push(0);
      colors.push('#E5E7EB');
    }
  }
  return { labels, data, colors };
}

const weekData = getWeekData();
const ctx = document.getElementById('moodChart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: weekData.labels,
    datasets: [{
      data: weekData.data,
      backgroundColor: weekData.colors,
      borderRadius: 8,
      borderSkipped: false
    }]
  },
  options: {
    plugins: { legend: { display: false } },
    scales: {
      y: {
        min: 0, max: 5,
        ticks: {
          stepSize: 1,
          callback: function(val) {
            return ['', '😞', '😔', '😐', '😊', '😄'][val] || '';
          }
        },
        grid: { color: '#F3F4F6' }
      },
      x: { grid: { display: false } }
    }
  }
});

// --- Emotion Breakdown ---
function loadBreakdown() {
  const moods = ['great', 'good', 'neutral', 'sad', 'awful'];
  const moodLabels = { great: '😄 Great', good: '😊 Good', neutral: '😐 Neutral', sad: '😔 Sad', awful: '😞 Awful' };
  const total = entries.length || 1;
  const row = document.getElementById('breakdownRow');
  row.innerHTML = moods.map(m => {
    const count = entries.filter(e => e.mood === m).length;
    const pct = Math.round((count / total) * 100);
    return `
      <div class="breakdown-item">
        <span class="breakdown-label">${moodLabels[m]}</span>
        <div class="breakdown-bar-bg">
          <div class="breakdown-bar" style="width:${pct}%; background:${moodColors[m]}"></div>
        </div>
        <span class="breakdown-pct">${pct}%</span>
      </div>`;
  }).join('');
}

// --- Insight ---
function loadInsight() {
  const streak = calcStreak();
  const avg = calcAvgMood();
  const happy = calcHappyPct();
  let insight = '';

  if (entries.length < 3) {
    insight = 'Keep logging daily to unlock personalized insights!';
  } else if (streak >= 5) {
    insight = 'Amazing! You\'ve logged ' + streak + ' days in a row. Consistency is key to self-awareness. 🔥';
  } else if (happy >= 60) {
    insight = 'You\'ve been feeling positive ' + happy + '% of the time this week. Keep it up! 😄';
  } else if (avg <= 2) {
    insight = 'It looks like this has been a tough week. Remember to take breaks and practice self-care. 💙';
  } else {
    insight = 'Your average mood is ' + moodEmoji[avg] + '. Try journaling about what made you feel good this week!';
  }

  document.getElementById('insightText').textContent = insight;
}

// --- Init (correct call order) ---
loadKeyMetrics();
loadBreakdown();
loadInsight();

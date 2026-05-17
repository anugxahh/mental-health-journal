requireLogin();

function getMetricsForDate(date) {
  return getDailyMetrics(date) || {
    stress: 5,
    sleep: 7,
    productivity: 6,
    water: 8,
    exerciseDays: 0,
    goalsCompleted: 0
  };
}

function loadMetrics() {
  const today = getTodayStr();
  const metrics = getMetricsForDate(today);
  document.getElementById('stressInput').value = metrics.stress;
  document.getElementById('sleepInput').value = metrics.sleep;
  document.getElementById('productivityInput').value = metrics.productivity;
  document.getElementById('waterInput').value = metrics.water;
  document.getElementById('exerciseInput').value = metrics.exerciseDays;
  document.getElementById('goalsInput').value = metrics.goalsCompleted;
  document.getElementById('stressValue').textContent = metrics.stress;
  document.getElementById('sleepValue').textContent = metrics.sleep;
  document.getElementById('productivityValue').textContent = metrics.productivity;
}

document.getElementById('stressInput').addEventListener('input', () => {
  document.getElementById('stressValue').textContent = document.getElementById('stressInput').value;
});

document.getElementById('sleepInput').addEventListener('input', () => {
  document.getElementById('sleepValue').textContent = document.getElementById('sleepInput').value;
});

document.getElementById('productivityInput').addEventListener('input', () => {
  document.getElementById('productivityValue').textContent = document.getElementById('productivityInput').value;
});

function renderSessions() {
  const metrics = getAllMetrics();
  const dates = Object.keys(metrics).sort((a, b) => new Date(b) - new Date(a));
  const list = document.getElementById('sessionList');
  if (dates.length === 0) {
    list.innerHTML = '<p style="color:var(--subtext);font-size:13px;">No wellness sessions yet. Save your metrics to start tracking.</p>';
    return;
  }
  list.innerHTML = dates.map(date => {
    const session = metrics[date];
    return `
      <div class="session-card">
        <div class="session-header"><strong>${date}</strong></div>
        <div class="session-grid">
          <span>Stress</span><span>${session.stress}/10</span>
          <span>Sleep</span><span>${session.sleep}/10</span>
          <span>Productivity</span><span>${session.productivity}/10</span>
          <span>Water</span><span>${session.water} cups</span>
          <span>Exercise</span><span>${session.exerciseDays} days</span>
          <span>Goals</span><span>${session.goalsCompleted}</span>
        </div>
      </div>
    `;
  }).join('');
}

document.getElementById('saveMetricsBtn').addEventListener('click', () => {
  const metrics = {
    stress: Number(document.getElementById('stressInput').value),
    sleep: Number(document.getElementById('sleepInput').value),
    productivity: Number(document.getElementById('productivityInput').value),
    water: Number(document.getElementById('waterInput').value),
    exerciseDays: Number(document.getElementById('exerciseInput').value),
    goalsCompleted: Number(document.getElementById('goalsInput').value)
  };
  saveDailyMetrics(getTodayStr(), metrics);
  renderSessions();
  loadInsights();
  alert('Wellness metrics saved!');
});

function loadInsights() {
  const metrics = getMetricsForDate(getTodayStr());
  const entries = getAllEntries();
  const sessionsToday = getAllMetrics()[getTodayStr()] ? 1 : 0;
  const weeklyDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  });
  const weeklyProgress = weeklyDates.reduce((count, date) => count + (getDailyMetrics(date) ? 1 : 0), 0);
  const insights = [
    `📈 Weekly progress: ${weeklyProgress} days tracked this week.`,
    metrics.stress <= 4 ? '😌 Your stress level is low today — nice work.' : '⚠️ Consider a calm break if stress is high.',
    metrics.sleep >= 7 ? '🌙 Your sleep quality is strong today.' : '💤 Aim for 7+ hours for better recovery.',
    entries.length > 0 ? `✍️ You have written ${entries.length} journal entries so far.` : '✍️ Add a journal entry to strengthen your wellness habit.'
  ];
  document.getElementById('recentInsights').innerHTML = insights.map(i => `<div class="insight-item">• ${i}</div>`).join('');
}

loadMetrics();
renderSessions();
loadInsights();


function saveEntry(entry) {
  const entries = getAllEntries();
  if (!entry.id) entry.id = Date.now();
  entries.push(entry);
  localStorage.setItem('mhj_entries', JSON.stringify(entries));
}

function getAllEntries() {
  return JSON.parse(localStorage.getItem('mhj_entries') || '[]');
}

function deleteEntry(index) {
  const entries = getAllEntries();
  entries.splice(index, 1);
  localStorage.setItem('mhj_entries', JSON.stringify(entries));
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function getYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function getAllMetrics() {
  return JSON.parse(localStorage.getItem('mhj_metrics') || '{}');
}

function getDailyMetrics(date) {
  return getAllMetrics()[date] || null;
}

function saveDailyMetrics(date, metrics) {
  const all = getAllMetrics();
  all[date] = metrics;
  localStorage.setItem('mhj_metrics', JSON.stringify(all));
}

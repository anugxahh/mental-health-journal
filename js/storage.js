// Save a journal entry (prevents duplicate for same date+time via timestamp id)
function saveEntry(entry) {
  const entries = getAllEntries();
  if (!entry.id) entry.id = Date.now();
  entries.push(entry);
  localStorage.setItem('mhj_entries', JSON.stringify(entries));
}

// Get all entries
function getAllEntries() {
  return JSON.parse(localStorage.getItem('mhj_entries') || '[]');
}

// Delete an entry by index
function deleteEntry(index) {
  const entries = getAllEntries();
  entries.splice(index, 1);
  localStorage.setItem('mhj_entries', JSON.stringify(entries));
}

// Get today's date as string YYYY-MM-DD
function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

// Get yesterday's date as string
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

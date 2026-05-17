requireLogin();

const moodEmojis = {
  awful: '😞', sad: '😔', neutral: '😐', good: '😊', great: '😄'
};

let selectedMood = null;
let selectedTags = [];

// Mood picker
document.querySelectorAll('.mood-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mood-opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedMood = btn.dataset.mood;
  });
});

// Tag picker
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('click', () => {
    tag.classList.toggle('selected');
    const t = tag.dataset.tag;
    if (selectedTags.includes(t)) {
      selectedTags = selectedTags.filter(x => x !== t);
    } else {
      selectedTags.push(t);
    }
  });
});

// Save entry
document.getElementById('saveEntryBtn').addEventListener('click', () => {
  const text = document.getElementById('journalText').value.trim();
  if (!selectedMood) { alert('Please select a mood!'); return; }
  if (!text) { alert('Please write something!'); return; }

  const entry = {
    date: getTodayStr(),
    mood: selectedMood,
    text: text,
    tags: [...selectedTags]
  };

  saveEntry(entry);

  // Reset form
  selectedMood = null;
  selectedTags = [];
  document.getElementById('journalText').value = '';
  document.querySelectorAll('.mood-opt').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.tag').forEach(t => t.classList.remove('selected'));

  loadEntries();
});

// Load past entries
function loadEntries() {
  // Get entries and keep original indices before reversing for display
  const allEntries = getAllEntries();
  const list = document.getElementById('entriesList');

  if (allEntries.length === 0) {
    list.innerHTML = '<p class="no-entries">No entries yet. Write your first one! ✍️</p>';
    return;
  }

  // Build display in reverse order but track the REAL index in the storage array
  list.innerHTML = allEntries.slice().reverse().map((e, displayIndex) => {
    const realIndex = allEntries.length - 1 - displayIndex; // correct original index
    return `
      <div class="entry-card">
        <div class="entry-top">
          <span class="entry-date">${e.date}</span>
          <span class="entry-mood">${moodEmojis[e.mood] || '😐'}</span>
        </div>
        <p class="entry-text">${e.text}</p>
        <div class="entry-tags">
          ${(e.tags || []).map(t => `<span class="entry-tag">${t}</span>`).join('')}
        </div>
        <div class="entry-actions">
          <button class="del-btn" onclick="removeEntry(${realIndex})">🗑 Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function removeEntry(index) {
  if (confirm('Delete this entry?')) {
    deleteEntry(index);
    loadEntries();
  }
}

loadEntries();

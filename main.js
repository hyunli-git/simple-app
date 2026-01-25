// LP Collection Data
const lpCollection = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "The Neon Waves",
    color: "linear-gradient(135deg, #667eea, #764ba2)",
    labelColor: "#667eea",
    duration: 245
  },
  {
    id: 2,
    title: "Sunset Boulevard",
    artist: "Jazz Quartet",
    color: "linear-gradient(135deg, #f093fb, #f5576c)",
    labelColor: "#f5576c",
    duration: 312
  },
  {
    id: 3,
    title: "Ocean Breeze",
    artist: "Chill Vibes",
    color: "linear-gradient(135deg, #4facfe, #00f2fe)",
    labelColor: "#4facfe",
    duration: 198
  },
  {
    id: 4,
    title: "Urban Nights",
    artist: "Electric Soul",
    color: "linear-gradient(135deg, #fa709a, #fee140)",
    labelColor: "#fa709a",
    duration: 267
  },
  {
    id: 5,
    title: "Mountain Echo",
    artist: "Acoustic Dreams",
    color: "linear-gradient(135deg, #a8edea, #fed6e3)",
    labelColor: "#a8edea",
    duration: 224
  },
  {
    id: 6,
    title: "Retro Funk",
    artist: "Groove Masters",
    color: "linear-gradient(135deg, #ff9a9e, #fecfef)",
    labelColor: "#ff9a9e",
    duration: 289
  },
  {
    id: 7,
    title: "Starlight",
    artist: "Cosmic Orchestra",
    color: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
    labelColor: "#a18cd1",
    duration: 356
  },
  {
    id: 8,
    title: "City Lights",
    artist: "Metro Beats",
    color: "linear-gradient(135deg, #ffecd2, #fcb69f)",
    labelColor: "#fcb69f",
    duration: 203
  }
];

// Player State
let currentLpIndex = -1;
let isPlaying = false;
let currentTime = 0;
let progressInterval = null;

// DOM Elements
const lpGrid = document.getElementById('lpGrid');
const vinyl = document.getElementById('vinyl');
const vinylLabel = document.getElementById('vinylLabel');
const labelText = document.getElementById('labelText');
const tonearm = document.getElementById('tonearm');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const progressBar = document.querySelector('.progress-bar');

// Initialize LP Grid
function initLpGrid() {
  lpGrid.innerHTML = lpCollection.map((lp, index) => `
    <div class="lp-card" data-index="${index}">
      <div class="lp-cover" style="background: ${lp.color}">
        <div class="lp-mini-vinyl"></div>
      </div>
      <div class="lp-title">${lp.title}</div>
      <div class="lp-artist">${lp.artist}</div>
    </div>
  `).join('');

  // Add click listeners to LP cards
  document.querySelectorAll('.lp-card').forEach(card => {
    card.addEventListener('click', () => {
      const index = parseInt(card.dataset.index);
      selectLp(index);
    });
  });
}

// Select an LP
function selectLp(index) {
  if (index < 0 || index >= lpCollection.length) return;

  // Update active state
  document.querySelectorAll('.lp-card').forEach((card, i) => {
    card.classList.toggle('active', i === index);
  });

  currentLpIndex = index;
  const lp = lpCollection[index];

  // Update vinyl appearance
  vinylLabel.style.background = `linear-gradient(135deg, ${lp.labelColor}, ${adjustColor(lp.labelColor, -20)})`;
  labelText.textContent = lp.title.substring(0, 10);

  // Update track info
  trackTitle.textContent = lp.title;
  trackArtist.textContent = lp.artist;
  durationEl.textContent = formatTime(lp.duration);

  // Reset progress
  currentTime = 0;
  updateProgress();

  // Auto-play when selecting a new LP
  if (!isPlaying) {
    togglePlay();
  }
}

// Toggle Play/Pause
function togglePlay() {
  if (currentLpIndex === -1) {
    // No LP selected, select the first one
    selectLp(0);
    return;
  }

  isPlaying = !isPlaying;

  if (isPlaying) {
    vinyl.classList.add('spinning');
    tonearm.classList.add('playing');
    playBtn.classList.add('playing');
    startProgress();
  } else {
    vinyl.classList.remove('spinning');
    tonearm.classList.remove('playing');
    playBtn.classList.remove('playing');
    stopProgress();
  }
}

// Previous Track
function prevTrack() {
  if (currentLpIndex <= 0) {
    selectLp(lpCollection.length - 1);
  } else {
    selectLp(currentLpIndex - 1);
  }
}

// Next Track
function nextTrack() {
  if (currentLpIndex >= lpCollection.length - 1) {
    selectLp(0);
  } else {
    selectLp(currentLpIndex + 1);
  }
}

// Progress Functions
function startProgress() {
  stopProgress();
  progressInterval = setInterval(() => {
    if (currentLpIndex === -1) return;

    const lp = lpCollection[currentLpIndex];
    currentTime += 1;

    if (currentTime >= lp.duration) {
      nextTrack();
    } else {
      updateProgress();
    }
  }, 1000);
}

function stopProgress() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

function updateProgress() {
  if (currentLpIndex === -1) {
    progress.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    return;
  }

  const lp = lpCollection[currentLpIndex];
  const percentage = (currentTime / lp.duration) * 100;
  progress.style.width = `${percentage}%`;
  currentTimeEl.textContent = formatTime(currentTime);
}

// Seek functionality
function seek(e) {
  if (currentLpIndex === -1) return;

  const rect = progressBar.getBoundingClientRect();
  const percentage = (e.clientX - rect.left) / rect.width;
  const lp = lpCollection[currentLpIndex];

  currentTime = Math.floor(percentage * lp.duration);
  updateProgress();
}

// Utility Functions
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function adjustColor(hex, amount) {
  // Simple color adjustment for gradient effect
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);
progressBar.addEventListener('click', seek);

// Keyboard Controls
document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'Space':
      e.preventDefault();
      togglePlay();
      break;
    case 'ArrowLeft':
      prevTrack();
      break;
    case 'ArrowRight':
      nextTrack();
      break;
  }
});

// Cookie Consent
const cookieConsent = document.getElementById('cookieConsent');
const acceptCookies = document.getElementById('acceptCookies');
const declineCookies = document.getElementById('declineCookies');

function checkCookieConsent() {
  const consent = localStorage.getItem('cookieConsent');
  if (consent) {
    cookieConsent.classList.add('hidden');
  }
}

function setCookieConsent(accepted) {
  localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'declined');
  cookieConsent.classList.add('hidden');
}

if (acceptCookies) {
  acceptCookies.addEventListener('click', () => setCookieConsent(true));
}

if (declineCookies) {
  declineCookies.addEventListener('click', () => setCookieConsent(false));
}

// Initialize
checkCookieConsent();
initLpGrid();

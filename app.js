// Lucide external link SVG icon
const LUCIDE_EXTERNAL_LINK_SVG = `
  <svg class="link-icon" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M15 3h6v6"></path>
    <path d="M10 14L21 3"></path>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
  </svg>
`;

let CURRENT_INSIGHTS = [];
let celebrationStarted = false;

function updateLiveBannerDate() {
  const dateSlot = document.getElementById('currentDateSlot');
  if (dateSlot) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    dateSlot.textContent = `${day}.${month}`;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Set current day.month dynamically (e.g. 24.11, 25.11...)
  updateLiveBannerDate();

  // Load dynamic configuration from GitHub (or local fallback)
  await loadDynamicConfig();

  // Setup search and filter interactions
  setupInsightsFilters();

  // Setup click-to-expand on Status Cards
  setupStatusCardsExpand();
});

// Direct GitHub raw URL with timestamp anti-cache
const GITHUB_REPO_PATH = 'gloomy-qmark/isgtavionpc-news';

async function loadDynamicConfig() {
  try {
    const timestamp = Date.now();
    let cfg = null;

    // 1. Fetch live directly from raw.githubusercontent.com (clean non-cached JSON)
    try {
      const res = await fetch(`https://raw.githubusercontent.com/${GITHUB_REPO_PATH}/main/news.json?t=${timestamp}`);
      if (res.ok) cfg = await res.json();
    } catch (e) {
      console.warn('GitHub raw fetch failed, trying local config:', e);
    }

    // 2. Fallback to local config.json
    if (!cfg) {
      const res = await fetch(`config.json?t=${timestamp}`);
      if (res.ok) cfg = await res.json();
    }

    if (!cfg) throw new Error('Could not load config from any source');

    // ==========================================
    // MODE SWITCH: "no" vs "yes"
    // ==========================================
    const isYes = cfg.mode === 'yes';
    applySiteMode(isYes, cfg);

    // 1. Progress Bar Fill (only active in NO mode)
    const progressWrapper = document.getElementById('progressNoWrapper');
    if (progressWrapper && cfg.progressPercent !== undefined) {
      const clampedPercent = Math.min(Math.max(cfg.progressPercent, 0), 100);
      progressWrapper.style.setProperty('--fill-percent', `${clampedPercent}%`);
    }

    // 2. Banner Text
    const bannerSummaryText = document.getElementById('bannerSummaryText');
    const bannerContent = document.getElementById('bannerDetailsText');
    if (bannerSummaryText && cfg.topBanner?.summary) {
      bannerSummaryText.innerHTML = cfg.topBanner.summary;
    }
    if (bannerContent && cfg.topBanner?.details) {
      bannerContent.textContent = cfg.topBanner.details;
    }

    // 3. Take-Two and Fan-Made Cards
    const cardTakeTwo = document.getElementById('cardTakeTwo');
    const cardFanMade = document.getElementById('cardFanMade');
    if (cardTakeTwo && cfg.takeTwoCard?.text) {
      const val = cardTakeTwo.querySelector('.status-value');
      if (val) val.textContent = cfg.takeTwoCard.text;
    }
    if (cardFanMade && cfg.fanProjectCard?.text) {
      const desc = cardFanMade.querySelector('.status-desc');
      if (desc) desc.textContent = cfg.fanProjectCard.text;
    }

    // 4. Render Insights
    if (cfg.insights && Array.isArray(cfg.insights)) {
      CURRENT_INSIGHTS = cfg.insights;
      renderInsights(cfg.insights);
    }
  } catch (err) {
    console.warn('Could not load dynamic config, using fallback.', err);
  }
}

function applySiteMode(isYes, cfg) {
  const pageTitle = document.getElementById('pageTitle');
  const progressNoWrapper = document.getElementById('progressNoWrapper');
  const celebrationYesWrapper = document.getElementById('celebrationYesWrapper');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const fireworksCanvas = document.getElementById('fireworksCanvas');
  const bannerUnderline = document.getElementById('bannerUnderline');

  if (isYes) {
    // YES Mode: Celebration
    if (pageTitle) pageTitle.textContent = 'YES! GTA VI is on PC!';
    if (progressNoWrapper) progressNoWrapper.style.display = 'none';
    if (celebrationYesWrapper) celebrationYesWrapper.style.display = 'inline-block';
    if (audioToggleBtn) audioToggleBtn.style.display = 'flex';
    if (fireworksCanvas) fireworksCanvas.style.display = 'block';
    if (bannerUnderline) bannerUnderline.textContent = 'IS FINALLY WORKING ON PC!';

    if (!celebrationStarted) {
      celebrationStarted = true;
      initCelebrationFeatures();
    }
  } else {
    // NO Mode: Strict Minimalist Tracker
    if (pageTitle) pageTitle.textContent = 'Is GTA VI on PC already?';
    if (progressNoWrapper) progressNoWrapper.style.display = 'inline-block';
    if (celebrationYesWrapper) celebrationYesWrapper.style.display = 'none';
    if (audioToggleBtn) audioToggleBtn.style.display = 'none';
    if (fireworksCanvas) fireworksCanvas.style.display = 'none';
    if (bannerUnderline) bannerUnderline.textContent = 'IS NOT WORKING ON PC!';
  }
}

function initCelebrationFeatures() {
  // 1. Fireworks
  triggerGrandCelebration();
  startFireworks();

  // 2. Audio Player
  const bgAudio = document.getElementById('bgAudio');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioIconPlaying = document.getElementById('audioIconPlaying');
  const audioIconMuted = document.getElementById('audioIconMuted');
  const audioStatusText = document.getElementById('audioStatusText');

  let isPlaying = false;

  function updateAudioUI(playing) {
    isPlaying = playing;
    if (playing) {
      audioIconPlaying.style.display = 'block';
      audioIconMuted.style.display = 'none';
      audioStatusText.textContent = 'MUSIC ON';
    } else {
      audioIconPlaying.style.display = 'none';
      audioIconMuted.style.display = 'block';
      audioStatusText.textContent = 'MUSIC OFF';
    }
  }

  function playAudio() {
    bgAudio.play().then(() => updateAudioUI(true)).catch(() => updateAudioUI(false));
  }

  function pauseAudio() {
    bgAudio.pause();
    updateAudioUI(false);
  }

  playAudio();

  const unlockAudio = () => {
    if (!isPlaying) playAudio();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio);
  window.addEventListener('keydown', unlockAudio);

  audioToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) pauseAudio();
    else playAudio();
  });

  window.addEventListener('click', (e) => {
    if (e.target.closest('a') || e.target.closest('button')) return;
    confetti({
      particleCount: 50,
      angle: 90,
      spread: 80,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: ['#ff3998', '#ffd200', '#00f0ff', '#ff6e3a', '#ffffff']
    });
  });
}

function triggerGrandCelebration() {
  const duration = 4.5 * 1000;
  const animationEnd = Date.now() + duration;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 45 * (timeLeft / duration);
    confetti({
      particleCount, angle: 60, spread: 65, origin: { x: 0, y: 0.8 },
      colors: ['#ff3998', '#ffd200', '#00f0ff', '#ff6e3a', '#ffffff']
    });
    confetti({
      particleCount, angle: 120, spread: 65, origin: { x: 1, y: 0.8 },
      colors: ['#ff3998', '#ffd200', '#00f0ff', '#ff6e3a', '#ffffff']
    });
  }, 350);
}

function startFireworks() {
  setInterval(() => {
    const x = 0.2 + Math.random() * 0.6;
    const y = 0.15 + Math.random() * 0.35;
    confetti({
      particleCount: 40, spread: 100, startVelocity: 30, origin: { x, y },
      colors: ['#ff3998', '#ffd200', '#00f0ff', '#ffffff']
    });
  }, 2500);
}

function renderInsights(insights) {
  const insightsList = document.getElementById('insightsList');
  if (!insightsList) return;

  insightsList.innerHTML = insights.map(item => {
    const buttonsHtml = item.links && item.links.length > 0 ? `
      <div class="inline-keyboard">
        ${item.links.map(link => {
          if (link.disabled) {
            return `
              <div class="inline-btn disabled-btn">
                <span>${link.text}</span>
              </div>
            `;
          }
          return `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="inline-btn">
              <span>${link.text}</span>
              ${LUCIDE_EXTERNAL_LINK_SVG}
            </a>
          `;
        }).join('')}
      </div>
    ` : '';

    return `
      <article class="insight-card" data-category="${item.category}">
        <div class="insight-meta">
          <span class="insight-date">${item.date}</span>
          <span class="insight-tag">${item.category}</span>
        </div>
        <h4 class="insight-title">${item.title}</h4>
        <p class="insight-text">${item.text}</p>
        ${buttonsHtml}
      </article>
    `;
  }).join('');
}

function setupInsightsFilters() {
  const searchInput = document.getElementById('searchInput');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const noResults = document.getElementById('noResults');

  let activeCategory = 'ALL';
  let searchQuery = '';

  function filterCards() {
    const insightCards = document.querySelectorAll('.insight-card');
    let visibleCount = 0;

    insightCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const title = card.querySelector('.insight-title')?.textContent.toLowerCase() || '';
      const text = card.querySelector('.insight-text')?.textContent.toLowerCase() || '';
      const meta = card.querySelector('.insight-meta')?.textContent.toLowerCase() || '';

      const matchesCategory = (activeCategory === 'ALL' || cardCategory === activeCategory);
      const matchesSearch = !searchQuery || title.includes(searchQuery) || text.includes(searchQuery) || meta.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      filterCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      filterCards();
    });
  }
}

function setupStatusCardsExpand() {
  const statusCards = document.querySelectorAll('.status-card');
  statusCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('expanded');
    });
  });
}

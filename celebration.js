document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Confetti Cannon on page load
  triggerGrandCelebration();

  // 2. Continuous Fireworks Canvas Animation
  startFireworks();

  // 3. Audio Player Setup (Looping Flower In A Hurricane)
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
      audioToggleBtn.style.borderColor = 'rgba(255, 255, 255, 0.4)';
    } else {
      audioIconPlaying.style.display = 'none';
      audioIconMuted.style.display = 'block';
      audioStatusText.textContent = 'MUSIC OFF';
      audioToggleBtn.style.borderColor = 'rgba(255, 255, 255, 0.15)';
    }
  }

  function playAudio() {
    bgAudio.play().then(() => {
      updateAudioUI(true);
    }).catch(() => {
      updateAudioUI(false);
    });
  }

  function pauseAudio() {
    bgAudio.pause();
    updateAudioUI(false);
  }

  // Attempt auto-play on load
  playAudio();

  // Browsers block unmuted autoplay without prior interaction:
  // on the very first user interaction anywhere on the page, kick off music!
  const unlockAudio = () => {
    if (!isPlaying) {
      playAudio();
    }
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio);
  window.addEventListener('keydown', unlockAudio);

  // Manual Toggle button
  audioToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  });

  // 4. Click anywhere to launch a personal firework explosion!
  window.addEventListener('click', (e) => {
    if (e.target.closest('a') || e.target.closest('button')) return;
    confetti({
      particleCount: 50,
      angle: 90,
      spread: 80,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      },
      colors: ['#ff3998', '#ffd200', '#00f0ff', '#ff6e3a', '#ffffff']
    });
  });
});

function triggerGrandCelebration() {
  const duration = 4.5 * 1000;
  const animationEnd = Date.now() + duration;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 45 * (timeLeft / duration);

    // Left cannon
    confetti({
      particleCount,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.8 },
      colors: ['#ff3998', '#ffd200', '#00f0ff', '#ff6e3a', '#ffffff']
    });

    // Right cannon
    confetti({
      particleCount,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.8 },
      colors: ['#ff3998', '#ffd200', '#00f0ff', '#ff6e3a', '#ffffff']
    });
  }, 350);
}

function startFireworks() {
  setInterval(() => {
    const x = 0.2 + Math.random() * 0.6;
    const y = 0.15 + Math.random() * 0.35;
    confetti({
      particleCount: 40,
      spread: 100,
      startVelocity: 30,
      origin: { x, y },
      colors: ['#ff3998', '#ffd200', '#00f0ff', '#ffffff']
    });
  }, 2500);
}

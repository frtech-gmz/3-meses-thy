const openLetterBtn = document.getElementById('openLetterBtn');
const letterSection = document.getElementById('letterSection');
const musicToggle = document.getElementById('musicToggle');
const messageBox = document.getElementById('messageBox');
const messageTriggers = document.querySelectorAll('.message-trigger');
const floatingHearts = document.querySelector('.floating-hearts');

let audioContext = null;
let musicIntervalId = null;
let musicIsPlaying = false;

function openLetter() {
  document.body.classList.add('letter-open');
  letterSection.classList.add('visible');
  openLetterBtn.setAttribute('aria-expanded', 'true');
  setTimeout(() => {
    letterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 150);
}

function createHeart() {
  const heart = document.createElement('span');
  heart.className = 'float-heart';
  heart.textContent = '❤';

  const left = Math.random() * 100;
  const size = 18 + Math.random() * 18;
  const duration = 8 + Math.random() * 8;
  const delay = Math.random() * 4;

  heart.style.left = `${left}%`;
  heart.style.fontSize = `${size}px`;
  heart.style.animationDuration = `${duration}s`;
  heart.style.animationDelay = `${delay}s`;
  heart.style.opacity = '0';

  floatingHearts.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, (duration + delay) * 1000);
}

function animateHearts() {
  for (let i = 0; i < 3; i += 1) {
    createHeart();
  }
}

function startMusic() {
  if (!window.AudioContext && !window.webkitAudioContext) {
    return;
  }

  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioCtx();
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const melody = [261.63, 329.63, 392.0, 349.23, 440.0, 392.0, 329.63, 293.66];
  let index = 0;

  if (musicIntervalId) {
    clearInterval(musicIntervalId);
  }

  musicIntervalId = setInterval(() => {
    if (audioContext.state !== 'running') {
      return;
    }

    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.value = melody[index % melody.length];

    gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.04, audioContext.currentTime + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.8);

    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + 0.85);

    index += 1;
  }, 480);

  musicIsPlaying = true;
  musicToggle.textContent = '⏸ música';
}

function stopMusic() {
  if (musicIntervalId) {
    clearInterval(musicIntervalId);
    musicIntervalId = null;
  }

  musicIsPlaying = false;
  musicToggle.textContent = '🎵 música';
}

openLetterBtn.addEventListener('click', openLetter);

messageTriggers.forEach((button) => {
  button.addEventListener('click', () => {
    const message = button.dataset.message;
    messageBox.textContent = message;
  });
});

musicToggle.addEventListener('click', () => {
  if (musicIsPlaying) {
    stopMusic();
    return;
  }

  startMusic();
});

setInterval(animateHearts, 1300);
animateHearts();

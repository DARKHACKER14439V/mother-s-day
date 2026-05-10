/* =============================
   Mother's Day Website - JS
   - Floating hearts/flowers
   - Particle canvas
   - Typewriter animation
   - Surprise: letter open + heart burst + confetti + music
   - Time counter since birth/mother day (configurable)
   ============================= */

(() => {
  const $ = (sel) => document.querySelector(sel);

  // ---------- Typewriter ----------
  const typeEl = $('#typewriterText');
  const messages = [
    'Maa, you are my whole universe.',
    'Your smile is my safest place.',
    'With you, every day feels like love.'
  ];

  let msgIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typewriterTick() {
    const current = messages[msgIndex];
    if (!typeEl) return;

    if (!deleting) {
      charIndex++;
      typeEl.textContent = current.slice(0, charIndex);
      if (charIndex >= current.length) {
        deleting = true;
        setTimeout(typewriterTick, 900);
        return;
      }
      setTimeout(typewriterTick, 45);
    } else {
      charIndex--;
      typeEl.textContent = current.slice(0, charIndex);
      if (charIndex <= 0) {
        deleting = false;
        msgIndex = (msgIndex + 1) % messages.length;
        setTimeout(typewriterTick, 350);
        return;
      }
      setTimeout(typewriterTick, 22);
    }
  }

  // ---------- Floating layer generator ----------
  const floatingLayer = $('#floatingLayer');

  function spawnFloaty() {
    if (!floatingLayer) return;
    const el = document.createElement('div');
    const icons = ['❤️', '💗', '✨', '🌸', '🌺', '💐'];

    const icon = icons[Math.floor(Math.random() * icons.length)];
    el.className = 'floaty';
    el.textContent = icon;

    if (icon === '🌸' || icon === '🌺' || icon === '💐') el.classList.add('floaty--flower');

    // random color accent
    const accents = ['floaty--pink', 'floaty--purple', 'floaty--gold'];
    el.classList.add(accents[Math.floor(Math.random() * accents.length)]);

    const left = Math.random() * 100;
    const drift = (Math.random() * 70 - 35);
    const dur = (7 + Math.random() * 8);

    el.style.left = `${left}%`;
    el.style.setProperty('--drift', `${drift}px`);
    el.style.setProperty('--dur', `${dur}s`);

    el.style.fontSize = `${24 + Math.random() * 14}px`;

    floatingLayer.appendChild(el);

    // cleanup after it goes away
    const timeout = (dur * 1000) + 2000;
    setTimeout(() => el.remove(), timeout);
  }

  function startFloating() {
    spawnFloaty();
    setInterval(spawnFloaty, 900);
  }

  // ---------- Particle Canvas ----------
  const canvas = $('#particleCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  let w = 0, h = 0;
  const particles = [];

  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function initParticles() {
    if (!ctx) return;
    particles.length = 0;
    const count = Math.floor(Math.min(180, Math.max(90, (w * h) / 14000)));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: rand(0.8, 2.4),
        vx: rand(-0.2, 0.2),
        vy: rand(-0.25, 0.25),
        a: rand(0.25, 0.95),
        hue: Math.random() < 0.5 ? rand(320, 345) : rand(240, 285)
      });
    }
  }

  function drawParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);

    // subtle glow
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      // wrap
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 95%, 75%, ${p.a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(drawParticles);
  }

  // ---------- Surprise (letter + music + burst) ----------
  const surpriseBtn = $('#surpriseBtn');
  const loveLetter = $('#loveLetter');
  const burstLayer = $('#burstLayer');
  const bgMusic = $('#bgMusic');

  function makeConfettiAndHearts() {
    if (!burstLayer) return;
    burstLayer.innerHTML = '';

    const colors = ['#ff4fd8', '#7c3aed', '#ffcc66', '#ffffff'];
    const count = 90;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'burst__particle';

      const angle = rand(0, Math.PI * 2);
      const dist = rand(120, 360);

      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;

      p.style.setProperty('--dx', `${dx}px`);
      p.style.setProperty('--dy', `${dy}px`);
      p.style.setProperty('--rot', `${rand(-180, 180)}deg`);

      p.style.left = `50%`;
      p.style.top = `42%`;

      // size + shape
      const size = rand(6, 12);
      p.style.width = `${size}px`;
      p.style.height = `${size * (Math.random() < 0.5 ? 1 : 0.75)}px`;

      const isHeart = Math.random() < 0.22;
      if (isHeart) {
        // hearts as text particles
        p.style.background = 'transparent';
        p.style.borderRadius = '0';
        p.textContent = '❤️';
        p.style.fontSize = `${size + 4}px`;
        p.style.color = colors[0];
        p.style.display = 'grid';
        p.style.placeItems = 'center';
      } else {
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.borderRadius = `${Math.random() < 0.35 ? 999 : 2}px`;
      }

      p.style.animationDuration = `${rand(880, 1300)}ms`;
      burstLayer.appendChild(p);
    }

    setTimeout(() => {
      if (burstLayer) burstLayer.innerHTML = '';
    }, 1600);
  }

  function openLetter() {
    if (!loveLetter) return;
    loveLetter.classList.add('is-open');
    loveLetter.setAttribute('aria-hidden', 'false');
  }

  async function playMusic() {
    if (!bgMusic) return;
    try {
      bgMusic.volume = 0.65;
      await bgMusic.play();
    } catch (e) {
      // Autoplay might still be blocked; user interaction should allow though.
      console.warn('Music playback blocked:', e);
    }
  }

  if (surpriseBtn) {
    surpriseBtn.addEventListener('click', async () => {
      openLetter();
      makeConfettiAndHearts();
      await playMusic();

      // scroll to letter for better experience on mobile
      loveLetter?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

 // ---------- Time counter ----------
// Set your birth date (for "since my birth") or motherhood date.
// Your Date of Birth: 10 March 2009
const BIRTH_DATE_ISO = '2009-03-10T00:00:00';

  function formatNum(n) {
    return n < 10 ? `0${n}` : String(n);
  }
  function formatUnit(n) {
    return String(n);
  }

  function getYMD(fromDate, toDate) {
    // Calculate years/months/days using calendar math.
    let years = toDate.getFullYear() - fromDate.getFullYear();
    let months = toDate.getMonth() - fromDate.getMonth();
    let days = toDate.getDate() - fromDate.getDate();

    if (days < 0) {
      // borrow days from previous month
      const prevMonth = new Date(toDate.getFullYear(), toDate.getMonth(), 0);
      days += prevMonth.getDate();
      months -= 1;
    }

    if (months < 0) {
      months += 12;
      years -= 1;
    }

    return { years, months, days };
  }

  function startCounter() {
    const yearsEl = $('#years');
    const monthsEl = $('#months');
    const daysEl = $('#days');

    if (!yearsEl || !monthsEl || !daysEl) return;

    const from = new Date(BIRTH_DATE_ISO);
    if (Number.isNaN(from.getTime())) return;

    const tick = () => {
      const now = new Date();
      let { years, months, days } = getYMD(from, now);

      if (years < 0) {
        years = 0; months = 0; days = 0;
      }

      yearsEl.textContent = formatUnit(years);
      monthsEl.textContent = formatUnit(months);
      daysEl.textContent = formatUnit(days);
    };

    tick();
    setInterval(tick, 1000 * 30);
  }

  // ---------- Scroll shortcuts ----------
  const scrollBtn = $('#scrollToGallery');
  const gallery = $('#gallery');
  if (scrollBtn && gallery) {
    scrollBtn.addEventListener('click', () => {
      gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ---------- Init ----------
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  resizeCanvas();
  initParticles();
  requestAnimationFrame(drawParticles);

  typewriterTick();
  startFloating();
  startCounter();
})();


// =========================================================
// Theme toggle — dark / light
// =========================================================

const themeToggle = document.getElementById('themeToggle');
const rootEl = document.documentElement;

function applyTheme(theme) {
  if (theme === 'light') {
    rootEl.setAttribute('data-theme', 'light');
  } else {
    rootEl.removeAttribute('data-theme');
  }

  try {
    localStorage.setItem('theme', theme);
  } catch (e) {}
}

const savedTheme = (() => {
  try {
    return localStorage.getItem('theme');
  } catch (e) {
    return null;
  }
})();

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

const initialTheme =
  savedTheme === 'dark' || (!savedTheme && prefersDark)
    ? 'dark'
    : 'light';

applyTheme(initialTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = rootEl.getAttribute('data-theme') === 'light';
    applyTheme(isLight ? 'dark' : 'light');
  });
}

(function () {
  const el = document.getElementById('heroNameLetters');
  const text = 'TÜLİN EREN';
  el.innerHTML = '';
  [...text].forEach((char, i) => {
    const span = document.createElement('span');
    span.className = char === ' ' ? 'anim-letter anim-space' : 'anim-letter';
    span.style.animationDelay = (0.18 + i * 0.045) + 's';
    span.textContent = char === ' ' ? '\u00A0' : char;
    el.appendChild(span);
  });
})();

// =========================================================
// Language toggle (TR / EN) — preference kept in memory + localStorage
// =========================================================
const translatable = document.querySelectorAll('[data-tr]');
const langToggle = document.getElementById('langToggle');
const langOpts = langToggle.querySelectorAll('.lang-opt');

function applyLang(lang){
  document.documentElement.lang = lang;
  translatable.forEach(el => { el.textContent = el.dataset[lang]; });
  langOpts.forEach(o => o.classList.toggle('is-active', o.dataset.lang === lang));
  document.title = lang === 'tr'
    ? "Tülin Eren — Bilgisayar Mühendisliği Öğrencisi"
    : "Tülin Eren — Computer Engineering Student";
  try{ localStorage.setItem('site-lang', lang); }catch(e){}
  renderRepos(lang);
  runTerminal(lang);
}

langToggle.addEventListener('click', () => {
  const current = document.documentElement.lang === 'en' ? 'en' : 'tr';
  applyLang(current === 'tr' ? 'en' : 'tr');
});


(function () {
  const canvas = document.getElementById('heroNodes');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const section = canvas.closest('.hero');
  let nodes = [];
  let width, height;
  let animId;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getAccentColor() {
    const style = getComputedStyle(document.documentElement);
    return style.getPropertyValue('--accent').trim() || '#4FD1C5';
  }

  function resize() {
    width = section.offsetWidth;
    height = section.offsetHeight;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function createNodes() {
    const count = Math.min(28, Math.floor((width * height) / 38000));
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.4 + 1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const accent = getAccentColor();

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx;
      a.y += a.vy;
      if (a.x < 0 || a.x > width) a.vx *= -1;
      if (a.y < 0 || a.y > height) a.vy *= -1;

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 160;
        if (dist < maxDist) {
          ctx.strokeStyle = accent;
          ctx.globalAlpha = (1 - dist / maxDist) * 0.25;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 0.75;
    nodes.forEach(n => {
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    animId = requestAnimationFrame(draw);
  }

  function start() {
    resize();
    createNodes();
    if (!prefersReduced) {
      draw();
    } else {
      ctx.clearRect(0, 0, width, height);
      nodes.forEach(n => {
        ctx.fillStyle = getAccentColor();
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    start();
  });

  start();
})();  


// =========================================================
// Mobile menu
// =========================================================
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('primaryNav');
if (menuBtn){
  menuBtn.addEventListener('click', () => nav.classList.toggle('is-open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('is-open')));
}

// =========================================================
// Terminal typing effect
// =========================================================
let terminalTimeouts = [];
function runTerminal(lang){
  terminalTimeouts.forEach(t => clearTimeout(t));
  terminalTimeouts = [];

  const line1 = document.getElementById('typeLine1');
  const line2 = document.getElementById('typeLine2'); 
  
  if (!line1 || !line2) return;

  const texts = lang === 'tr'
    ? ["Tülin Eren", "Bilgisayar Mühendisliği Öğrencisi — 4. sınıf"]
    : ["Tülin Eren", "Computer Engineering Student — 4th year"];

  line1.textContent = '';
  line2.textContent = '';

  typeText(line1, texts[0], 0, () => {
    terminalTimeouts.push(setTimeout(() => {
      typeText(line2, texts[1], 0);
    }, 220));
  });
}
function typeText(el, text, i, done){
  if (i <= text.length){
    el.textContent = text.slice(0, i);
    terminalTimeouts.push(setTimeout(() => typeText(el, text, i + 1, done), 28));
  } else if (done){ done(); }
}

// =========================================================
// Projects data + render
// =========================================================
const LANG_COLORS = {
  Python: "#3572A5", JavaScript: "#f1e05a", TypeScript: "#2b7489",
  "C#": "#178600", PHP: "#4F5D95", R: "#198CE7", HTML: "#e34c26",
  "Jupyter Notebook": "#DA5B0B", TSQL: "#e38c00", MATLAB: "#e16737"
};

const repos = [
  {
  nameTr: "Hacker News Teknoloji Depremleri Analizi",
  nameEn: "Hacker News Technology Earthquakes Analysis",
  lang: "Python",
  tr: "120.000+ Hacker News verisi üzerinde Python ile olay etiketleme, zaman serisi ve etkileşim analizi. DuckDB, Pandas, Plotly ve Scikit-learn kullanıldı.",
  en: "Event labeling, time-series, and engagement analysis on 120,000+ Hacker News stories using Python, DuckDB, Pandas, Plotly, and Scikit-learn.",
  url: "https://github.com/tulineren/Hacker_News_Technology_Earthquakes_Analysis.git"
  },
  {
  nameTr: "Turkcell IoT SIM Filosu Koruyucu",
  nameEn: "Turkcell IoT SIM Fleet Protector",
  lang: "Python",
  tr: "IoT SIM kartlarının veri kullanımını analiz ederek anormal kullanımları tespit eden ve maliyet simülasyonu yapan Python tabanlı uygulama.",
  en: "A Python-based application that analyzes IoT SIM data usage, detects anomalies, and simulates potential costs.",
  url: "https://github.com/tulineren/SimShield.git"
  },
  {
  nameTr: "Lara Pilates Yönetim Sistemi",
  nameEn: "Lara Pilates Management System",
  lang: "JavaScript",
  tr: "Gerçek bir stüdyonun manuel üye ve seans takibi sorununu dijitalleştirmek amacıyla geliştirildi. React, Node.js ve Microsoft SQL Server ile üye, seans, ödeme ve katılım süreçleri yönetiliyor.",
  en: "Developed to digitize the manual member and session tracking of a real studio. Built with React, Node.js, and Microsoft SQL Server to manage members, sessions, payments, and attendance.",
  private: true
  },
  {
  nameTr: "Kampanya Optimizasyon Uygulaması",
  nameEn: "Campaign Optimizer App",
  lang: "Python",
  tr: "Gerçek bir şirketten sağlanan reklam kampanyası verilerini label ve KPI hedeflerine göre analiz ederek günlük bütçe ve hedef CPA değerlerini hesaplayan uygulama. Python, Pandas, Gradio ve OpenPyXL kullanıldı.",
  en: "An application that analyzes real-world advertising campaign data provided by a company based on labels and KPI targets to calculate new daily budgets and target CPA values. Built with Python, Pandas, Gradio, and OpenPyXL.",
  private: true
  },
  {
  nameTr: "Görev ve Hatırlatma Uygulaması",
  nameEn: "Task & Reminder Application",
  lang: "Python",
  tr: "PyQt5 ve SQLite ile geliştirilen çok pencereli masaüstü uygulaması. Görev ekleme, hatırlatma, görev durumu takibi, kullanıcı ayarları ve giriş işlemlerini destekler.",
  en: "A multi-window desktop application built with PyQt5 and SQLite. Supports task creation, reminders, task status tracking, user settings, and user login.",
  url: "https://github.com/tulineren/pyqt-task-reminder-app.git"
  },
  {
  nameTr: "10th Lightyear",
  nameEn: "10th Lightyear",
  lang: "C#",
  tr: "3 kişilik ekip ile Unity kullanılarak geliştirilen 3D Action-RPG / Hack and Slash oyunu. UI geliştiricisi olarak responsive arayüz, menü etkileşimleri, TextMeshPro ve sahne geçişlerini geliştirdim.",
  en: "A 3D Action-RPG / Hack and Slash game developed by a 3-person team using Unity. As the UI Developer, I developed the responsive interface, menu interactions, TextMeshPro integration, and scene transitions.",
  url: "https://github.com/tulineren/GameJam2025.git"
  },
];

const repoGrid = document.getElementById('repoGrid');

const GITHUB_SVG = `<svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
    0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58
    1.25.82.73 1.23 1.91.88 2.38.67.07-.53.29-.88.53-1.08-1.85-.21-3.79-.93-3.79-4.13 0-.91.32-1.65.85-2.24-.09-.21-.37-1.06.08-2.2
    0 0 .69-.22 2.27.84.66-.18 1.36-.28 2.06-.28.7 0 1.4.1 2.06.28 1.58-1.06 2.27-.84 2.27-.84.45 1.14.17 1.99.08 2.2.53.59.85 1.32.85
    2.24 0 3.21-1.94 3.92-3.8 4.13.3.26.56.76.56 1.54 0 1.11-.01 2-.01 2.27 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>`;

function renderRepos(lang) {
  repoGrid.innerHTML = '';

  repos.forEach(r => {

    const card = document.createElement(r.private ? 'div' : 'a');

    card.className = 'repo-card';

    // Sadece public projelerde GitHub bağlantısı
    if (!r.private) {
      card.href = r.url.replace(/\.git$/, '');
      card.target = '_blank';
      card.rel = 'noopener';
    }

    const color = LANG_COLORS[r.lang] || '#888';
    const repoName = lang === 'tr' ? r.nameTr : r.nameEn;

    card.innerHTML = `
      <div class="repo-top">
        <p class="repo-name">${repoName}</p>

        ${
          r.private
            ? `<span class="repo-private">Private</span>`
            : `<span class="repo-gh-icon">${GITHUB_SVG}</span>`
        }
      </div>

      <p class="repo-desc">${lang === 'tr' ? r.tr : r.en}</p>

      <div class="repo-meta">
        <span>
          <span class="lang-dot" style="background:${color}"></span>${r.lang}
        </span>
      </div>
    `;

    repoGrid.appendChild(card);
  });
}

// =========================================================
// Init
// =========================================================
document.getElementById('year').textContent = new Date().getFullYear();

let savedLang = 'tr';
try{ savedLang = localStorage.getItem('site-lang') || 'tr'; }catch(e){}
applyLang(savedLang);
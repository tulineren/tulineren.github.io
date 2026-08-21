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
  C: "#555555", PHP: "#4F5D95", R: "#198CE7", HTML: "#e34c26",
  "Jupyter Notebook": "#DA5B0B", TSQL: "#e38c00", MATLAB: "#e16737"
};

const repos = [
  {
    name: "SimShield",
    lang: "Python",
    tr: "Turkcell Code Night 2025 için geliştirilen IoT SIM filo koruma sistemi. Veri kullanımını analiz ederek anomali tespiti yapar — 19 takım arasından 5. oldu.",
    en: "IoT SIM fleet protection system built for Turkcell Code Night 2025. Detects anomalies by analyzing data usage — placed 5th out of 19 teams.",
    url: "https://github.com/tulineren/SimShield.git"
  },
  {
    name: "lara-pilates-management-system",
    lang: "JavaScript",
    tr: "Node.js ve React ile geliştirilmiş, bir pilates stüdyosu için randevu ve üye takip sistemi.",
    en: "An appointment and member tracking system for a pilates studio, built with Node.js and React.",
    url: "https://github.com/tulineren/lara-pilates-management-system.git"
  },
  {
    name: "GameJam2025",
    lang: "C",
    tr: "Balıkesir Teknokent Game Jam 2025 için Unity'de geliştirilen '10th Light Year' oyunu — UI tasarım ve entegrasyon.",
    en: "'10th Light Year', a Unity game built for Balıkesir Teknokent Game Jam 2025 — UI design and integration.",
    url: "https://github.com/tulineren/GameJam2025.git"
  },
  {
    name: "data_analysis",
    lang: "R",
    tr: "R, tidyverse ve ggplot2 kullanılarak çeşitli veri setleri üzerinde yapılan veri analizi ve görselleştirme çalışmaları.",
    en: "Data analysis and visualization work across various datasets, using R with tidyverse and ggplot2.",
    url: "https://github.com/tulineren/data_analysis.git"
  },
  {
    name: "pyqt-task-reminder-app",
    lang: "Python",
    tr: "PyQt ile geliştirilmiş masaüstü görev hatırlatıcı uygulaması.",
    en: "A desktop task-reminder application built with PyQt.",
    url: "https://github.com/tulineren/pyqt-task-reminder-app.git"
  },
  {
    name: "Hacker_News_Technology_Earthquakes_Analysis",
    lang: "Jupyter Notebook",
    tr: "Hacker News teknoloji haberleri ve deprem verileri üzerine yapılan Jupyter Notebook tabanlı analiz çalışması.",
    en: "A Jupyter Notebook-based analysis of Hacker News technology posts and earthquake data.",
    url: "https://github.com/tulineren/Hacker_News_Technology_Earthquakes_Analysis.git"
  }
];

const repoGrid = document.getElementById('repoGrid');

const GITHUB_SVG = `<svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
    0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58
    1.25.82.73 1.23 1.91.88 2.38.67.07-.53.29-.88.53-1.08-1.85-.21-3.79-.93-3.79-4.13 0-.91.32-1.65.85-2.24-.09-.21-.37-1.06.08-2.2
    0 0 .69-.22 2.27.84.66-.18 1.36-.28 2.06-.28.7 0 1.4.1 2.06.28 1.58-1.06 2.27-.84 2.27-.84.45 1.14.17 1.99.08 2.2.53.59.85 1.32.85
    2.24 0 3.21-1.94 3.92-3.8 4.13.3.26.56.76.56 1.54 0 1.11-.01 2-.01 2.27 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>`;

function renderRepos(lang){
  repoGrid.innerHTML = '';
  repos.forEach(r => {
    const card = document.createElement('a');
    card.className = 'repo-card';
    card.href = r.url.replace(/\.git$/, '');
    card.target = '_blank';
    card.rel = 'noopener';
    const color = LANG_COLORS[r.lang] || '#888';
    card.innerHTML = `
      <div class="repo-top">
        <p class="repo-name">${r.name}</p>
        <span class="repo-gh-icon">${GITHUB_SVG}</span>
      </div>
      <p class="repo-desc">${lang === 'tr' ? r.tr : r.en}</p>
      <div class="repo-meta">
        <span><span class="lang-dot" style="background:${color}"></span>${r.lang}</span>
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
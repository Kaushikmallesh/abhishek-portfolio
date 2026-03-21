// ============================================================
// ADMIN PASSWORD — change this to something only you know
// ============================================================
const ADMIN_PASSWORD = 'ahishek@admin';

// ============================================================
// CURSOR
// ============================================================
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});
function animateCursor() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// ============================================================
// NAVBAR SCROLL + ACTIVE LINKS
// ============================================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// ============================================================
// HAMBURGER MENU
// ============================================================
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const isOpen = navLinksEl.classList.contains('open');
  spans[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
  spans[1].style.opacity = isOpen ? '0' : '1';
  spans[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
});
navLinksEl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ============================================================
// HERO PARTICLE CANVAS
// ============================================================
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.size = Math.random() * 2 + 0.5;
    this.alpha = Math.random() * 0.6 + 0.1;
    this.color = Math.random() > 0.5 ? '0,245,255' : '160,32,240';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}
const particles = Array.from({ length: 120 }, () => new Particle());

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,245,255,${(1 - dist / 100) * 0.15})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ============================================================
// AOS — Scroll Reveal
// ============================================================
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('aos-animate'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => obs.observe(el));
}

// ============================================================
// COUNT-UP STATS
// ============================================================
function countUp(el, target, duration = 1800) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(el => countUp(el, parseInt(el.dataset.target)));
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const statsEl = document.querySelector('.about-stats');
if (statsEl) statsObserver.observe(statsEl);

// ============================================================
// SKILL BAR ANIMATION
// ============================================================
const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
      skillsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
const skillsEl = document.querySelector('.skills-grid');
if (skillsEl) skillsObserver.observe(skillsEl);

// ============================================================
// FIREBASE CONFIGURATION & INIT
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBPOW6qWT-ch5NGYjqSCSWWJ1fCYLhtJnk",
  authDomain: "abhishek-portfolio-aa70a.firebaseapp.com",
  projectId: "abhishek-portfolio-aa70a",
  storageBucket: "abhishek-portfolio-aa70a.firebasestorage.app",
  messagingSenderId: "945657549210",
  appId: "1:945657549210:web:a59033d3c2318614afaa23",
  measurementId: "G-64K2FRQN11"
};

let app, db;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase config is missing or invalid. Please paste your config at the top of script.js.");
}

// ============================================================
// PORTFOLIO — DATA + RENDER
// ============================================================
const CAT_LABELS = { environment: 'ENVIRONMENT', character: 'CHARACTER', abstract: 'ABSTRACT', product: 'PRODUCT VIZ' };

let PROJECTS = [];
let isAdmin = false;
let pendingDeleteId = null;

// Load projects: from Firebase Firestore
async function loadProjects() {
  if (!db) return; // Firewall if config is missing

  try {
    const querySnapshot = await getDocs(collection(db, "projects"));
    PROJECTS = [];
    querySnapshot.forEach((docSnapshot) => {
      PROJECTS.push({ id: docSnapshot.id, ...docSnapshot.data() });
    });
    // Sort logic can go here if needed
  } catch (e) {
    console.error("Error loading projects from Firebase:", e);
  }
}


function renderPortfolio(filter = 'all') {
  const grid = document.getElementById('portfolioGrid');
  grid.innerHTML = '';

  const filtered = filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.category === filter);

  filtered.forEach((project, index) => {
    const delay = (index % 3) * 100;
    const catLabel = CAT_LABELS[project.category] || project.category.toUpperCase();

    const item = document.createElement('div');
    item.className = 'portfolio-item' + (isAdmin ? ' admin-mode' : '');
    item.dataset.category = project.category;
    item.dataset.aos = 'zoom-in';
    if (delay) item.dataset.aosDelay = delay;

    item.innerHTML = `
      <div class="portfolio-img-wrap">
        <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" loading="lazy" />
        <div class="portfolio-overlay">
          <div class="overlay-content">
            <span class="overlay-cat">${catLabel}</span>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.tools || '')}</p>
            <button class="overlay-btn view-btn"
              data-img="${escapeHtml(project.image)}"
              data-title="${escapeHtml(project.title)}"
              data-desc="${escapeHtml(project.description || '')}">
              VIEW →
            </button>
          </div>
        </div>
        ${isAdmin ? `
        <div class="card-admin-btns">
          <button class="card-admin-btn card-edit-btn" data-id="${project.id}" title="Edit project" aria-label="Edit ${project.title}">✎</button>
          <button class="card-admin-btn card-delete-btn" data-id="${project.id}" title="Delete project" aria-label="Delete ${project.title}">✕</button>
        </div>` : ''}
      </div>`;

    grid.appendChild(item);
  });

  // Re-bind lightbox buttons
  grid.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => openLightbox(btn.dataset.img, btn.dataset.title, btn.dataset.desc));
  });

  // Admin card buttons
  if (isAdmin) {
    grid.querySelectorAll('.card-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => openProjectModal('edit', btn.dataset.id));
    });
    grid.querySelectorAll('.card-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => openDeleteModal(btn.dataset.id));
    });
  }

  // Re-init AOS on new elements
  initAOS();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ============================================================
// PORTFOLIO FILTER
// ============================================================
const filterBtns = document.querySelectorAll('.filter-btn');
let activeFilter = 'all';
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderPortfolio(activeFilter);
  });
});

// ============================================================
// LIGHTBOX
// ============================================================
const lightbox = document.getElementById('lightbox');
const lightboxBg = document.getElementById('lightboxBg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');

function openLightbox(img, title, desc) {
  lightboxImg.src = img;
  lightboxImg.alt = title;
  lightboxTitle.textContent = title;
  lightboxDesc.textContent = desc;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}
lightboxClose.addEventListener('click', closeLightbox);
lightboxBg.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ============================================================
// CONTACT FORM
// ============================================================
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = document.getElementById('btnSubmit');
  btn.querySelector('span').textContent = 'SENDING...';
  btn.disabled = true;
  setTimeout(() => {
    formSuccess.classList.add('show');
    contactForm.reset();
    btn.querySelector('span').textContent = 'SEND MESSAGE';
    btn.disabled = false;
    setTimeout(() => formSuccess.classList.remove('show'), 4000);
  }, 1200);
});

// ============================================================
// ACTIVE SECTION TRACKING
// ============================================================
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + id));
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('section').forEach(s => sectionObserver.observe(s));

// ============================================================
// ADMIN — TOAST
// ============================================================
const adminToast = document.getElementById('adminToast');
function showToast(msg, duration = 3000) {
  adminToast.textContent = msg;
  adminToast.classList.add('show');
  setTimeout(() => adminToast.classList.remove('show'), duration);
}

// ============================================================
// ADMIN — AUTH
// ============================================================
const adminToolbar = document.getElementById('adminToolbar');
const adminLoginModal = document.getElementById('adminLoginModal');
const loginError = document.getElementById('loginError');
const adminPwInput = document.getElementById('adminPassword');

function enterAdminMode() {
  isAdmin = true;
  sessionStorage.setItem('admin_session', '1');
  adminToolbar.style.display = 'block';
  // Add bottom padding so toolbar doesn't cover content
  document.body.style.paddingBottom = '64px';
  renderPortfolio(activeFilter);
  showToast('✓ Admin mode active — welcome back!');
}

function exitAdminMode() {
  isAdmin = false;
  sessionStorage.removeItem('admin_session');
  adminToolbar.style.display = 'none';
  document.body.style.paddingBottom = '';
  renderPortfolio(activeFilter);
}

function openLoginModal() {
  adminPwInput.value = '';
  loginError.style.display = 'none';
  adminLoginModal.style.display = 'flex';
  setTimeout(() => adminPwInput.focus(), 100);
}
function closeLoginModal() { adminLoginModal.style.display = 'none'; }

document.getElementById('btnLoginSubmit').addEventListener('click', () => {
  if (adminPwInput.value === ADMIN_PASSWORD) {
    closeLoginModal();
    enterAdminMode();
  } else {
    loginError.style.display = 'block';
    adminPwInput.value = '';
    adminPwInput.focus();
  }
});
document.getElementById('btnLoginCancel').addEventListener('click', closeLoginModal);
document.getElementById('loginModalBg').addEventListener('click', closeLoginModal);

// Password field: Enter key
adminPwInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('btnLoginSubmit').click();
  if (e.key === 'Escape') closeLoginModal();
});

// Toggle password visibility
document.getElementById('togglePw').addEventListener('click', () => {
  const type = adminPwInput.type === 'password' ? 'text' : 'password';
  adminPwInput.type = type;
  document.getElementById('togglePw').textContent = type === 'password' ? '👁' : '🙈';
});

// Logout
document.getElementById('btnLogout').addEventListener('click', () => {
  exitAdminMode();
  showToast('Logged out of admin mode.');
});

// HIDDEN TRIGGER: triple-click footer brand
let footerClickCount = 0, footerClickTimer = null;
const footerBrand = document.querySelector('.footer-brand');
footerBrand.addEventListener('click', () => {
  footerClickCount++;
  if (footerClickTimer) clearTimeout(footerClickTimer);
  footerClickTimer = setTimeout(() => { footerClickCount = 0; }, 1200);
  if (footerClickCount >= 3) {
    footerClickCount = 0;
    if (isAdmin) { exitAdminMode(); showToast('Admin mode off.'); }
    else openLoginModal();
  }
});

// Restore session on page reload
if (sessionStorage.getItem('admin_session') === '1') {
  // Deferred until after projects load
}

// ============================================================
// ADMIN — ADD / EDIT PROJECT MODAL
// ============================================================
const projectModal = document.getElementById('projectModal');
const projectModalTitle = document.getElementById('projectModalTitle');
const projectEditId = document.getElementById('projectEditId');
const projectTitle = document.getElementById('projectTitle');
const projectCategory = document.getElementById('projectCategory');
const projectTools = document.getElementById('projectTools');
const projectDesc = document.getElementById('projectDesc');
const projectImage = document.getElementById('projectImage');
const projectImgPreview = document.getElementById('projectImgPreview');
const previewPlaceholder = document.getElementById('previewPlaceholder');
const projectModalError = document.getElementById('projectModalError');

function openProjectModal(mode, id = null) {
  projectModalError.style.display = 'none';
  if (mode === 'add') {
    projectModalTitle.textContent = 'ADD PROJECT';
    projectEditId.value = '';
    projectTitle.value = '';
    projectCategory.value = 'environment';
    projectTools.value = '';
    projectDesc.value = '';
    projectImage.value = '';
    projectImgPreview.style.display = 'none';
    previewPlaceholder.style.display = 'block';
  } else {
    const proj = PROJECTS.find(p => String(p.id) === String(id));
    if (!proj) return;
    projectModalTitle.textContent = 'EDIT PROJECT';
    projectEditId.value = proj.id;
    projectTitle.value = proj.title;
    projectCategory.value = proj.category;
    projectTools.value = proj.tools || '';
    projectDesc.value = proj.description || '';
    projectImage.value = proj.image;
    updateImgPreview(proj.image);
  }
  projectModal.style.display = 'flex';
  setTimeout(() => projectTitle.focus(), 100);
}
function closeProjectModal() { projectModal.style.display = 'none'; }

function updateImgPreview(src) {
  if (src) {
    projectImgPreview.src = src;
    projectImgPreview.style.display = 'block';
    previewPlaceholder.style.display = 'none';
  } else {
    projectImgPreview.style.display = 'none';
    previewPlaceholder.style.display = 'block';
  }
}

projectImage.addEventListener('input', () => updateImgPreview(projectImage.value.trim()));

document.getElementById('btnAddProject').addEventListener('click', () => openProjectModal('add'));
document.getElementById('btnProjectCancel').addEventListener('click', closeProjectModal);
document.getElementById('projectModalBg').addEventListener('click', closeProjectModal);

document.getElementById('btnProjectSave').addEventListener('click', async () => {
  const title = projectTitle.value.trim();
  const category = projectCategory.value;
  const tools = projectTools.value.trim();
  const desc = projectDesc.value.trim();
  const image = projectImage.value.trim();

  if (!title) {
    projectModalError.textContent = '⚠ Project title is required.';
    projectModalError.style.display = 'block';
    projectTitle.focus();
    return;
  }
  if (!image) {
    projectModalError.textContent = '⚠ Image URL or path is required.';
    projectModalError.style.display = 'block';
    projectImage.focus();
    return;
  }
  projectModalError.style.display = 'none';

  const editId = projectEditId.value;

  const btn = document.getElementById('btnProjectSave');
  const originalText = btn.innerHTML;
  btn.innerHTML = "SAVING...";
  btn.disabled = true;

  try {
    if (editId) {
      // Edit existing in Firestore
      const docRef = doc(db, "projects", String(editId));
      await updateDoc(docRef, { title, category, tools, description: desc, image });
      const idx = PROJECTS.findIndex(p => String(p.id) === String(editId));
      if (idx !== -1) {
        PROJECTS[idx] = { ...PROJECTS[idx], title, category, tools, description: desc, image };
      }
      showToast('✓ Project updated successfully!');
    } else {
      // Add new to Firestore
      const docRef = await addDoc(collection(db, "projects"), { title, category, tools, description: desc, image, createdAt: new Date() });
      PROJECTS.push({ id: docRef.id, title, category, tools, description: desc, image });
      showToast('✓ New project added!');
    }
    closeProjectModal();
    renderPortfolio(activeFilter);
  } catch (e) {
    projectModalError.textContent = '❌ Error saving to database: ' + e.message;
    projectModalError.style.display = 'block';
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
});

// ============================================================
// ADMIN — DELETE PROJECT
// ============================================================
const deleteModal = document.getElementById('deleteModal');
const deleteModalMsg = document.getElementById('deleteModalMsg');

function openDeleteModal(id) {
  const proj = PROJECTS.find(p => p.id === id);
  if (!proj) return;
  pendingDeleteId = id;
  deleteModalMsg.textContent = `Delete "${proj.title}" from your gallery? This cannot be undone (unless you restore from an exported backup JSON).`;
  deleteModal.style.display = 'flex';
}
function closeDeleteModal() { deleteModal.style.display = 'none'; pendingDeleteId = null; }

document.getElementById('btnDeleteConfirm').addEventListener('click', async () => {
  if (pendingDeleteId === null) return;

  const btn = document.getElementById('btnDeleteConfirm');
  btn.textContent = "DELETING...";
  btn.disabled = true;

  try {
    // Delete from Firestore
    await deleteDoc(doc(db, "projects", String(pendingDeleteId)));
    PROJECTS = PROJECTS.filter(p => String(p.id) !== String(pendingDeleteId));
    closeDeleteModal();
    renderPortfolio(activeFilter);
    showToast('Project deleted.');
  } catch (e) {
    showToast('❌ Error deleting: ' + e.message);
  } finally {
    btn.textContent = "YES, DELETE";
    btn.disabled = false;
  }
});
document.getElementById('btnDeleteCancel').addEventListener('click', closeDeleteModal);
document.getElementById('deleteModalBg').addEventListener('click', closeDeleteModal);

// Admin functionality end
// ============================================================
// INIT
// ============================================================
(async () => {
  await loadProjects();
  // Restore admin session if still active
  if (sessionStorage.getItem('admin_session') === '1') {
    isAdmin = true;
    adminToolbar.style.display = 'block';
    document.body.style.paddingBottom = '64px';
  } else if (window.location.search.includes('admin') || window.location.hash.includes('admin')) {
    // If URL contains ?admin or #admin, open login modal automatically
    openLoginModal();
  }
  renderPortfolio();
  initAOS();
})();

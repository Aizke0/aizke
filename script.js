/* =========================
   EDITAR AQUI (SEUS PROJETOS)
   - Troque títulos, descrições, tags e links.
   - Para vídeo:
     type: "youtube" + youtubeId
     ou type: "mp4" + src + poster (opcional)
========================= */

const PROJECTS = [
  {
    title: "Sistema de abrir cadeado 3D ( Profissional ) ",
    desc: "Sistema 3D",
    tags: ["LuaU", "Scripting"],
  video: { type: "mp4", src: "Cadeado.mp4" }, // troque pelo seu ID
    links: {
      play: "https://www.roblox.com/",
      repo: "https://github.com/"
    }
  },
  {
    title: "Sistema Jogo Maquinas",
    desc: "Maquinas e Compras",
    tags: ["LuaU", "Scripting"],
    video: {type: "mp4", src: "Jogo.mp4" },
    links: {
      play: "https://www.roblox.com/",
      repo: "https://github.com/"
    }
  },
      {
    title: "Sistema de Tiro ",
    desc: "Sistema Tiro / Fps",
    tags: ["LuaU", "Scripting"],
  video: { type: "mp4", src: "fps.mp4" }, // troque pelo seu ID
    links: {
      play: "https://www.roblox.com/",
      repo: "https://github.com/"
    }
  },
];

/* =========================
   Helpers
========================= */
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q)];

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalize(str) {
  return String(str).toLowerCase().trim();
}

/* =========================
   Render projects + filters
========================= */
const gridEl = document.querySelector("[data-projects-grid]");
const filtersEl = document.querySelector(".filters");
const searchInput = $("#searchInput");

let currentFilter = "all";
let currentQuery = "";

function projectMatches(project) {
  const q = normalize(currentQuery);

  const inText =
    !q ||
    normalize(project.title).includes(q) ||
    normalize(project.desc).includes(q) ||
    project.tags.some(t => normalize(t).includes(q));

  const inTag =
    currentFilter === "all" ||
    project.tags.map(normalize).includes(normalize(currentFilter));

  return inText && inTag;
}

function renderProjects() {
  const visible = PROJECTS.filter(projectMatches);

  gridEl.innerHTML = visible.map((p) => {
    const tagsHtml = p.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");

    const videoHtml = (() => {
      if (p.video?.type === "youtube" && p.video.youtubeId) {
        const id = encodeURIComponent(p.video.youtubeId);
        const src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
        return `
          <div class="video" aria-label="Vídeo do projeto: ${escapeHtml(p.title)}">
            <div class="ratio">
              <iframe
                src="${src}"
                title="YouTube - ${escapeHtml(p.title)}"
                loading="lazy"
                referrerpolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        `;
      }

      if (p.video?.type === "mp4" && p.video.src) {
        const posterAttr = p.video.poster ? ` poster="${escapeHtml(p.video.poster)}"` : "";
        return `
          <div class="video" aria-label="Vídeo do projeto: ${escapeHtml(p.title)}">
            <div class="ratio">
              <video controls preload="metadata" playsinline${posterAttr}>
                <source src="${escapeHtml(p.video.src)}" type="video/mp4" />
                Seu navegador não suporta vídeo HTML5.
              </video>
            </div>
          </div>
        `;
      }

      return "";
    })();

    const playLink = p.links?.play
      ? `<a class="btn btn--small" href="${escapeHtml(p.links.play)}" target="_blank" rel="noreferrer">Jogar no Roblox</a>`
      : "";

    const repoLink = p.links?.repo
      ? `<a class="btn btn--small btn--ghost" href="${escapeHtml(p.links.repo)}" target="_blank" rel="noreferrer">Devlog/Repo</a>`
      : "";

    return `
      <article class="card reveal" data-tags="${p.tags.map(normalize).join(",")}">
        <h3 class="card__title">${escapeHtml(p.title)}</h3>
        <p class="card__desc">${escapeHtml(p.desc)}</p>

        <div class="tags" aria-label="Tags do projeto">${tagsHtml}</div>

        ${videoHtml}

        <div class="card__actions" aria-label="Links do projeto">
          ${playLink}
          ${repoLink}
        </div>
      </article>
    `;
  }).join("");

  setupRevealObservers();
}

function buildFilters() {
  const tagSet = new Set();
  PROJECTS.forEach(p => p.tags.forEach(t => tagSet.add(t)));
  const tags = [...tagSet].sort((a, b) => a.localeCompare(b, "pt-BR"));

  filtersEl.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.className = "chip is-active";
  allBtn.dataset.filter = "all";
  allBtn.textContent = "Todos";
  filtersEl.appendChild(allBtn);

  tags.forEach(tag => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.dataset.filter = tag;
    btn.textContent = tag;
    filtersEl.appendChild(btn);
  });
}

function setActiveFilter(filter) {
  currentFilter = filter;
  $$(".chip", filtersEl).forEach(b => b.classList.toggle("is-active", b.dataset.filter === filter));
  renderProjects();
}

/* =========================
   Navbar interactions
========================= */
const toggleBtn = $(".nav__toggle");
const linksWrap = $("[data-nav-links]");
const navLinks = $$("[data-nav-link]");

function closeMenu() {
  linksWrap.classList.remove("is-open");
  toggleBtn.setAttribute("aria-expanded", "false");
}

toggleBtn?.addEventListener("click", () => {
  const isOpen = linksWrap.classList.toggle("is-open");
  toggleBtn.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach(link => link.addEventListener("click", () => closeMenu()));

document.addEventListener("click", (e) => {
  if (!linksWrap.classList.contains("is-open")) return;
  const inside = e.target.closest(".nav");
  if (!inside) closeMenu();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

/* Highlight seção ativa */
const sections = ["home", "projects", "about", "contact"].map(id => document.getElementById(id));

const activeObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;

  const id = visible.target.id;
  navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
}, { threshold: [0.2, 0.35, 0.5, 0.65] });

sections.forEach(s => s && activeObserver.observe(s));

/* =========================
   Reveal animations
========================= */
let revealObserver;

function setupRevealObservers() {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    $$(".reveal").forEach(el => el.classList.add("is-visible"));
    return;
  }

  if (revealObserver) revealObserver.disconnect();

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  $$(".reveal").forEach(el => {
    if (!el.classList.contains("is-visible")) revealObserver.observe(el);
  });
}

/* =========================
   Filters + Search
========================= */
filtersEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  setActiveFilter(btn.dataset.filter);
});

searchInput.addEventListener("input", (e) => {
  currentQuery = e.target.value;
  renderProjects();
});

/* =========================
   Copy buttons
========================= */
const copyHint = document.querySelector("[data-copy-hint]");

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-copy]");
  if (!btn) return;

  const text = btn.getAttribute("data-copy") || "";
  const ok = await copyText(text);

  if (copyHint) {
    copyHint.textContent = ok ? `Copiado: ${text}` : "Não foi possível copiar.";
    window.setTimeout(() => (copyHint.textContent = ""), 2200);
  }
});

/* =========================
   Form demo (sem backend)
========================= */
document.addEventListener("submit", (e) => {
  const form = e.target.closest("form");
  if (!form) return;
  e.preventDefault();

  const btn = form.querySelector('button[type="submit"]');
  if (btn) {
    const old = btn.textContent;
    btn.textContent = "Enviado (demo)";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = old;
      btn.disabled = false;
      form.reset();
    }, 1200);
  }
});

/* Footer year */
$("#year").textContent = new Date().getFullYear();

/* =========================
   Canvas background (floating shapes)
   - Canvas 2D, leve
   - Baixa opacidade
   - Parallax leve com mouse
   - Respeita prefers-reduced-motion
========================= */
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d", { alpha: true });

let w = 0, h = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
let shapes = [];
let mouse = { x: 0.5, y: 0.5 };
let parallax = { x: 0, y: 0 };

const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function rand(min, max) { return Math.random() * (max - min) + min; }

function resize() {
  w = window.innerWidth;
  h = window.innerHeight;
  dpr = Math.min(2, window.devicePixelRatio || 1);

  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.max(16, Math.min(40, Math.floor((w * h) / 48000)));
  shapes = createShapes(count);

  if (reducedMotion) draw(); // desenha uma vez
}

function createShapes(count) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    const typeRoll = Math.random();
    const type = typeRoll < 0.48 ? "circle" : typeRoll < 0.82 ? "square" : "line";

    arr.push({
      type,
      x: rand(0, w),
      y: rand(0, h),
      r: rand(6, 44),
      vx: rand(-0.16, 0.16),
      vy: rand(-0.12, 0.12),
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.0025, 0.0025),
      alpha: rand(0.03, 0.09),
      stroke: Math.random() < 0.62,
      depth: rand(0.28, 1.0),
    });
  }
  return arr;
}

function draw() {
  ctx.clearRect(0, 0, w, h);

  // leve haze central (ajuda legibilidade)
  const g = ctx.createRadialGradient(w * 0.5, h * 0.25, 40, w * 0.5, h * 0.25, Math.max(w, h));
  g.addColorStop(0, "rgba(255,255,255,0.025)");
  g.addColorStop(1, "rgba(255,255,255,0.00)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // parallax suave
  parallax.x += ((mouse.x - 0.5) * 16 - parallax.x) * 0.06;
  parallax.y += ((mouse.y - 0.5) * 10 - parallax.y) * 0.06;

  for (const s of shapes) {
    if (!reducedMotion) {
      s.x += s.vx;
      s.y += s.vy;
      s.rot += s.vr;

      if (s.x < -60) s.x = w + 60;
      if (s.x > w + 60) s.x = -60;
      if (s.y < -60) s.y = h + 60;
      if (s.y > h + 60) s.y = -60;
    }

    const px = s.x + parallax.x * s.depth;
    const py = s.y + parallax.y * s.depth;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(s.rot);

    const strokeColor = `rgba(242,242,242,${s.alpha})`;
    const fillColor = `rgba(242,242,242,${s.alpha * 0.5})`;

    if (s.type === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, s.r, 0, Math.PI * 2);
      if (s.stroke) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
    } else if (s.type === "square") {
      const size = s.r * 1.15;
      if (s.stroke) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(-size / 2, -size / 2, size, size);
      } else {
        ctx.fillStyle = fillColor;
        ctx.fillRect(-size / 2, -size / 2, size, size);
      }
    } else {
      const len = s.r * 2.2;
      ctx.beginPath();
      ctx.moveTo(-len / 2, 0);
      ctx.lineTo(len / 2, 0);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  }
}

let rafId = null;

function loop() {
  draw();
  rafId = requestAnimationFrame(loop);
}

function startCanvas() {
  if (reducedMotion) { draw(); return; }
  if (!rafId) loop();
}
function stopCanvas() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
}

window.addEventListener("resize", resize);
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX / Math.max(1, w);
  mouse.y = e.clientY / Math.max(1, h);
}, { passive: true });

document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopCanvas();
  else startCanvas();
});

/* =========================
   Init
========================= */
buildFilters();
setActiveFilter("all");
renderProjects();
setupRevealObservers();

resize();

startCanvas();



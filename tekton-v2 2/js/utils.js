/**
 * ============================================================
 * TEKTON — Utilidades compartidas (utils.js)
 * ============================================================
 * Funciones helper puras, sin efectos secundarios.
 * No dependen de estado global ni del DOM.
 * Se pueden reutilizar en cualquier página.
 * ============================================================
 */

// ── Trabajadores / Trabajos ───────────────────────────────────

/**
 * Obtiene el objeto completo de un oficio por su valor.
 * @param {string} value — ej: "electricien"
 * @returns {Object} — { value, label, emoji }
 */
function getTrade(value) {
  return APP_CONFIG.trades.find(t => t.value === value) || { value, label: value, emoji: "🛠️" };
}

/**
 * Obtiene solo el label de un oficio.
 * @param {string} value
 * @returns {string}
 */
function getTradeLabel(value) {
  return getTrade(value).label;
}

/**
 * Genera las iniciales de un nombre para el avatar por defecto.
 * @param {string} name — "Jean-Pierre Moreau"
 * @returns {string} — "JM"
 */
function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

/**
 * Formatea una fecha ISO a formato legible en francés.
 * @param {string} dateStr — "2024-01-15"
 * @returns {string} — "janvier 2024"
 */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

/**
 * Trunca un texto a un máximo de caracteres, añadiendo "...".
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
function truncate(text, maxLength = 160) {
  if (!text || text.length <= maxLength) return text || "";
  return text.substring(0, maxLength).trim() + "…";
}

/**
 * Genera el HTML de estrellas de rating.
 * @param {number} rating — 0 a 5
 * @returns {string} HTML con estrellas
 */
function renderStars(rating) {
  if (!rating || rating === 0) return '<span style="color:#ccc;">Sin reseñas</span>';
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    "★".repeat(full) +
    (half ? "½" : "") +
    "☆".repeat(empty)
  );
}

/**
 * Genera el badge HTML de un plan.
 * @param {string} plan — "free" | "pro" | "premium"
 * @returns {string} HTML del badge o ""
 */
function renderPlanBadge(plan) {
  if (plan === "pro") {
    return `<span class="badge badge-pro">PRO</span>`;
  }
  if (plan === "premium") {
    return `<span class="badge badge-premium">⭐ PREMIUM</span>`;
  }
  return "";
}

/**
 * Construye el HTML completo de una card de trabajador.
 * Centralizado aquí para que todas las páginas muestren lo mismo.
 * @param {Object} worker
 * @param {string} basePath — ruta relativa para llegar a pages/
 * @returns {string} HTML de la card
 */
function buildWorkerCard(worker, basePath = "pages/") {
  const trade = getTrade(worker.trade);
  const photoHTML = worker.photo
    ? `<img src="${worker.photo}" alt="${worker.name}" class="card-photo" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
       <div class="card-photo-placeholder" style="display:none;">${getInitials(worker.name)}</div>`
    : `<div class="card-photo-placeholder">${getInitials(worker.name)}</div>`;

  const starsHTML = worker.rating > 0
    ? `<span class="stars" title="${worker.rating}/5">${renderStars(worker.rating)}</span>
       <span class="review-count">(${worker.reviewCount})</span>`
    : `<span class="no-reviews">Nouveau</span>`;

  return `
    <article class="worker-card${worker.plan !== 'free' ? ' worker-card--featured' : ''}">
      <div class="card-photo-wrap">
        ${photoHTML}
        <div class="card-badges">
          ${worker.verified ? '<span class="badge badge-verified">✓ Vérifié</span>' : ''}
          ${renderPlanBadge(worker.plan)}
        </div>
      </div>
      <div class="card-body">
        <div class="card-trade">
          <span class="trade-icon">${trade.emoji}</span>
          <span class="trade-label">${trade.label}</span>
        </div>
        <h3 class="card-name">${worker.name}</h3>
        <div class="card-location">📍 ${worker.city}</div>
        <div class="card-rating">${starsHTML}</div>
        <p class="card-desc">${truncate(worker.description, 130)}</p>
        <a href="${basePath}profile.html?id=${worker.id}" class="btn btn-card">
          Voir le profil →
        </a>
      </div>
    </article>
  `;
}

// ── URL / Navegación ──────────────────────────────────────────

/**
 * Obtiene el valor de un parámetro de la URL.
 * @param {string} key
 * @returns {string|null}
 */
function getUrlParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

/**
 * Actualiza los params de la URL sin recargar la página.
 * @param {Object} params — { key: value, ... }. Null para borrar.
 */
function updateUrlParams(params) {
  const url = new URL(window.location);
  Object.entries(params).forEach(([key, val]) => {
    if (val === null || val === "") {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, val);
    }
  });
  history.replaceState(null, "", url);
}

// ── Renderizado de estado vacío / carga ───────────────────────

/**
 * HTML para estado de carga.
 * @param {string} mensaje
 * @returns {string}
 */
function renderLoading(mensaje = "Chargement…") {
  return `
    <div class="state-box state-loading">
      <div class="spinner"></div>
      <p>${mensaje}</p>
    </div>
  `;
}

/**
 * HTML para estado vacío (sin resultados).
 * @param {string} titulo
 * @param {string} desc
 * @param {string} ctaHtml — HTML opcional con botón de acción
 * @returns {string}
 */
function renderEmpty(titulo = "Aucun résultat", desc = "", ctaHtml = "") {
  return `
    <div class="state-box state-empty">
      <div class="state-icon">🔍</div>
      <h3>${titulo}</h3>
      ${desc ? `<p>${desc}</p>` : ""}
      ${ctaHtml}
    </div>
  `;
}

// ── Navbar dinámica ───────────────────────────────────────────

/**
 * Actualiza la navbar según si hay sesión activa o no.
 * Llamar en cada página después de inicializar auth.
 * @param {string} basePath — ruta para llegar a pages/
 */
function updateNavbar(basePath = "") {
  const user = getCurrentUser();
  const navAuth = document.getElementById("nav-auth");
  if (!navAuth) return;

  if (user) {
    navAuth.innerHTML = `
      <a href="${basePath}pages/dashboard.html" class="nav-link">${getInitials(user.name)} Mon espace</a>
      <button onclick="logoutUser(); window.location.href='${basePath}index.html'" class="btn btn-nav-outline">
        Déconnexion
      </button>
    `;
  } else {
    navAuth.innerHTML = `
      <a href="${basePath}pages/login.html" class="nav-link hide-mobile">Connexion</a>
      <a href="${basePath}pages/register.html" class="btn btn-nav">
        Je suis professionnel
      </a>
    `;
  }
}

// ── Notificaciones (toast) ────────────────────────────────────

/**
 * Muestra una notificación flotante.
 * @param {string} mensaje
 * @param {"success"|"error"|"info"} tipo
 * @param {number} duracion — ms
 */
function showToast(mensaje, tipo = "success", duracion = 3500) {
  // Remover toast existente
  const existing = document.getElementById("tekton-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "tekton-toast";
  toast.className = `toast toast--${tipo}`;
  toast.textContent = mensaje;

  document.body.appendChild(toast);

  // Mostrar con animación
  requestAnimationFrame(() => {
    toast.classList.add("toast--visible");
  });

  setTimeout(() => {
    toast.classList.remove("toast--visible");
    setTimeout(() => toast.remove(), 300);
  }, duracion);
}

// ── Validación de formularios ─────────────────────────────────

/**
 * Valida un email.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Valida un teléfono francés (flexible).
 * @param {string} phone
 * @returns {boolean}
 */
function isValidFrenchPhone(phone) {
  const cleaned = phone.replace(/[\s.-]/g, "");
  return /^(\+33|0033|0)[1-9](\d{8})$/.test(cleaned);
}

/**
 * ============================================================
 * TEKTON — Configuración Central
 * ============================================================
 * Este es el archivo principal de configuración.
 * Edita aquí para cambiar comportamientos globales sin tocar
 * el resto del código.
 *
 * Orden de lectura recomendado para nuevos desarrolladores:
 * 1. config.js (este archivo)
 * 2. data.js
 * 3. auth.js
 * 4. utils.js
 * ============================================================
 */

const APP_CONFIG = {

  // ── Información de la app ──────────────────────────────────
  name:        "Tekton",
  tagline:     "La plateforme de construction à Paris",
  description: "Connectez-vous avec les meilleurs professionnels du bâtiment en Île-de-France.",
  version:     "1.0.0",
  region:      "Paris & Île-de-France",
  contactEmail:"contact@tekton.fr",

  // ── API / Backend ──────────────────────────────────────────
  // Cuando tengas backend, cambia useMockData a false
  // y configura apiUrl con tu endpoint real.
  api: {
    useMockData: true,                    // true = localStorage, false = API real
    apiUrl:      "https://api.tekton.fr/v1", // Tu API cuando esté lista
    timeout:     8000,                    // ms antes de mostrar error
  },

  // ── Autenticación ──────────────────────────────────────────
  // provider: "local"    → localStorage (MVP, no producción)
  // provider: "firebase" → Firebase Auth
  // provider: "auth0"    → Auth0
  auth: {
    provider:    "local",
    requireEmailVerification: false,      // Cambiar a true en producción
    sessionDuration: 7,                   // días

    // Configuración Firebase (rellenar cuando sea el momento)
    firebase: {
      apiKey:            "TU_API_KEY",
      authDomain:        "tekton.firebaseapp.com",
      projectId:         "tekton",
      storageBucket:     "tekton.appspot.com",
      messagingSenderId: "TU_SENDER_ID",
      appId:             "TU_APP_ID",
    },

    // Configuración Auth0 (alternativa enterprise)
    auth0: {
      domain:   "tekton.eu.auth0.com",
      clientId: "TU_CLIENT_ID",
    },
  },

  // ── Pagos ──────────────────────────────────────────────────
  // Desactivado en v1. Activar cuando el backend esté listo.
  payments: {
    enabled:          false,
    provider:         "stripe",           // "stripe" | "paypal"
    stripePublicKey:  "pk_test_...",      // Clave pública de Stripe (safe en frontend)
    // ⚠️ NUNCA pongas la secret key aquí — solo en el servidor

    // Modelo de comisiones
    commission: {
      clientFee:  0.05,                   // 5% al cliente
      workerFee:  0.10,                   // 10% al trabajador
    },

    // Planes de suscripción (trabajadores destacados)
    plans: {
      free: {
        name:           "Gratuit",
        price:          0,
        maxProjects:    3,
        featured:       false,
        badge:          null,
      },
      pro: {
        name:           "Pro",
        price:          29,               // €/mes
        maxProjects:    null,             // ilimitado
        featured:       true,
        badge:          "PRO",
      },
      premium: {
        name:           "Premium",
        price:          59,
        maxProjects:    null,
        featured:       true,
        badge:          "PREMIUM",
        prioritySupport: true,
      },
    },
  },

  // ── Oficios disponibles ────────────────────────────────────
  // Para añadir un nuevo oficio: agrega un objeto aquí.
  // El resto de la app lo toma automáticamente.
  trades: [
    { value: "electricien",  label: "Électricien",   emoji: "⚡" },
    { value: "plombier",     label: "Plombier",       emoji: "🔧" },
    { value: "peintre",      label: "Peintre",        emoji: "🖌️" },
    { value: "menuisier",    label: "Menuisier",      emoji: "🪵" },
    { value: "carreleur",    label: "Carreleur",      emoji: "🪨" },
    { value: "macon",        label: "Maçon",          emoji: "🧱" },
    { value: "charpentier",  label: "Charpentier",    emoji: "🏗️" },
    { value: "couvreur",     label: "Couvreur",       emoji: "🏠" },
    { value: "plaquier",     label: "Plaquiste",      emoji: "📋" },
    { value: "serrurier",    label: "Serrurier",      emoji: "🔑" },
    { value: "chauffagiste", label: "Chauffagiste",   emoji: "🔥" },
    { value: "paysagiste",   label: "Paysagiste",     emoji: "🌿" },
    { value: "autre",        label: "Autre",           emoji: "🛠️" },
  ],

  // ── Validación de formularios ──────────────────────────────
  validation: {
    maxDescriptionLength: 800,
    minDescriptionLength: 50,
    maxNameLength:        80,
    allowedPhotoFormats:  ["jpg", "jpeg", "png", "webp"],
    maxPhotoSizeMB:       5,
  },

  // ── UI / Paginación ────────────────────────────────────────
  ui: {
    workersPerPage:   12,
    featuredOnHome:   3,
    defaultAvatarBg:  "#2c2c2c",
  },

  // ── Almacenamiento (localStorage keys) ────────────────────
  // Centralizado para evitar colisiones y facilitar migración
  storageKeys: {
    workers:    "tekton_workers",
    currentUser:"tekton_current_user",
    session:    "tekton_session",
  },

};

// Congelar el objeto para evitar mutaciones accidentales
// (en producción con bundler, usar Object.freeze en profundidad)
Object.freeze(APP_CONFIG.api);
Object.freeze(APP_CONFIG.auth);
Object.freeze(APP_CONFIG.payments.commission);

// Exportar para uso en módulos (descomentar si usas bundler)
// export default APP_CONFIG;

/**
 * ============================================================
 * TEKTON — Capa de Datos (data.js)
 * ============================================================
 * Esta capa abstrae el almacenamiento de datos.
 * Actualmente usa localStorage (MVP).
 *
 * PARA MIGRAR A UNA API REAL:
 * - Cambia APP_CONFIG.api.useMockData = false
 * - Implementa las funciones async con fetch()
 * - El resto de la app no necesita cambios
 *
 * Schema de un trabajador (Worker):
 * {
 *   id:          number   — generado automáticamente
 *   name:        string   — nombre completo
 *   trade:       string   — valor de APP_CONFIG.trades[].value
 *   city:        string   — ciudad/arrondissement
 *   description: string   — presentación profesional
 *   phone:       string   — teléfono (opcional)
 *   email:       string   — email de contacto
 *   photo:       string   — URL de foto (opcional)
 *   userId:      string   — vinculado a la cuenta de auth
 *   plan:        string   — "free" | "pro" | "premium"
 *   verified:    boolean  — cuenta verificada
 *   rating:      number   — promedio de reseñas (0-5)
 *   reviewCount: number   — número de reseñas
 *   createdAt:   string   — ISO date
 *   updatedAt:   string   — ISO date
 * }
 * ============================================================
 */

// ── Datos de demostración ─────────────────────────────────────
// Estos datos se cargan solo si la base está vacía (primer uso)
const DEMO_WORKERS = [
  {
    id: 1,
    name: "Mohammed Benali",
    trade: "electricien",
    city: "Paris 18e",
    description: "Électricien certifié RGE avec 12 ans d'expérience en Île-de-France. Spécialisé dans la mise aux normes, installation de tableaux électriques, domotique et bornes de recharge VE. Intervention rapide, devis gratuit sous 24h. Travail soigné et garanti.",
    phone: "06 12 34 56 78",
    email: "m.benali@email.com",
    photo: "",
    userId: "demo-1",
    plan: "pro",
    verified: true,
    rating: 4.8,
    reviewCount: 24,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
  },
  {
    id: 2,
    name: "Jean-Pierre Moreau",
    trade: "plombier",
    city: "Paris 11e",
    description: "Plombier chauffagiste indépendant depuis 8 ans. Dépannage fuite, remplacement chaudière, installation complète salle de bain, robinetterie. Certifié PGN. Disponible week-ends. Devis gratuit, facturation claire.",
    phone: "06 98 76 54 32",
    email: "jp.moreau@email.fr",
    photo: "",
    userId: "demo-2",
    plan: "free",
    verified: true,
    rating: 4.5,
    reviewCount: 11,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12",
  },
  {
    id: 3,
    name: "Carlos Ferreira",
    trade: "peintre",
    city: "Boulogne-Billancourt",
    description: "Peintre en bâtiment avec 15 ans de métier. Intérieur et extérieur, enduits décoratifs, papier peint, rénovation d'appartements haussmanniens. Travail méticuleux, respect des délais. Matériaux haut de gamme fournis sur demande.",
    phone: "07 45 23 89 10",
    email: "carlos.ferreira@gmail.com",
    photo: "",
    userId: "demo-3",
    plan: "pro",
    verified: true,
    rating: 4.9,
    reviewCount: 38,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: 4,
    name: "Sophie Durand",
    trade: "menuisier",
    city: "Paris 14e",
    description: "Menuisière artisanale indépendante. Fabrication sur mesure : placards, escaliers, parquet, fenêtres bois. Restauration de menuiseries anciennes et classées. Atelier en banlieue parisienne. Devis sur plan.",
    phone: "06 33 44 55 66",
    email: "sophie.durand.bois@email.com",
    photo: "",
    userId: "demo-4",
    plan: "free",
    verified: false,
    rating: 4.6,
    reviewCount: 7,
    createdAt: "2024-01-18",
    updatedAt: "2024-01-18",
  },
  {
    id: 5,
    name: "Youssef Khalil",
    trade: "carreleur",
    city: "Saint-Denis",
    description: "Poseur de carrelage, faïence et mosaïque depuis 10 ans. Salles de bain, cuisines, terrasses et espaces extérieurs. Garantie décennale. Travail soigné, joints parfaits. Petite équipe sérieuse.",
    phone: "06 77 88 99 00",
    email: "y.khalil@artisan.fr",
    photo: "",
    userId: "demo-5",
    plan: "free",
    verified: true,
    rating: 4.7,
    reviewCount: 15,
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
  {
    id: 6,
    name: "Arnaud Petit",
    trade: "macon",
    city: "Vincennes",
    description: "Maçon général avec équipe de 3 personnes. Démolition, construction neuve, rénovation lourde. Extension maison, ouverture de murs porteurs, ravalement de façade. Assurance décennale. Références disponibles.",
    phone: "06 55 44 33 22",
    email: "arnaud.petit.macon@email.com",
    photo: "",
    userId: "demo-6",
    plan: "premium",
    verified: true,
    rating: 4.4,
    reviewCount: 29,
    createdAt: "2024-01-22",
    updatedAt: "2024-01-22",
  },
];

// ── Funciones de la capa de datos ─────────────────────────────

/**
 * Obtiene todos los trabajadores.
 * En producción: reemplazar por fetch(`${APP_CONFIG.api.apiUrl}/workers`)
 * @returns {Array} Lista de trabajadores
 */
function getAllWorkers() {
  const raw = localStorage.getItem(APP_CONFIG.storageKeys.workers);
  if (!raw) {
    // Primer uso → cargar datos de demo
    saveAllWorkers(DEMO_WORKERS);
    return [...DEMO_WORKERS];
  }
  return JSON.parse(raw);
}

/**
 * Guarda la lista completa de trabajadores.
 * En producción: esta función desaparece (el servidor maneja el estado).
 * @param {Array} workers
 */
function saveAllWorkers(workers) {
  localStorage.setItem(APP_CONFIG.storageKeys.workers, JSON.stringify(workers));
}

/**
 * Obtiene un trabajador por su ID.
 * En producción: fetch(`${APP_CONFIG.api.apiUrl}/workers/${id}`)
 * @param {number|string} id
 * @returns {Object|undefined}
 */
function getWorkerById(id) {
  return getAllWorkers().find(w => w.id === parseInt(id));
}

/**
 * Obtiene el perfil del trabajador vinculado a una cuenta de usuario.
 * @param {string} userId
 * @returns {Object|undefined}
 */
function getWorkerByUserId(userId) {
  return getAllWorkers().find(w => w.userId === userId);
}

/**
 * Crea un nuevo trabajador.
 * En producción: POST a /workers con autenticación JWT
 * @param {Object} workerData — sin id ni createdAt (se generan aquí)
 * @returns {Object} El trabajador creado
 */
function addWorker(workerData) {
  const workers = getAllWorkers();
  const newWorker = {
    ...workerData,
    id:          Date.now(),
    plan:        "free",
    verified:    false,
    rating:      0,
    reviewCount: 0,
    createdAt:   new Date().toISOString().split("T")[0],
    updatedAt:   new Date().toISOString().split("T")[0],
  };
  workers.unshift(newWorker);
  saveAllWorkers(workers);
  return newWorker;
}

/**
 * Actualiza un trabajador existente.
 * En producción: PUT/PATCH a /workers/:id con JWT
 * @param {number} id
 * @param {Object} updates
 * @returns {Object|null}
 */
function updateWorker(id, updates) {
  const workers = getAllWorkers();
  const index = workers.findIndex(w => w.id === parseInt(id));
  if (index === -1) return null;
  workers[index] = {
    ...workers[index],
    ...updates,
    updatedAt: new Date().toISOString().split("T")[0],
  };
  saveAllWorkers(workers);
  return workers[index];
}

/**
 * Busca trabajadores con filtros opcionales.
 * En producción: GET /workers?trade=X&city=Y&page=Z
 * @param {Object} filters — { trade, city, page, perPage }
 * @returns {Object} — { results, total, page, totalPages }
 */
function searchWorkers({ trade = "", city = "", page = 1, perPage = APP_CONFIG.ui.workersPerPage } = {}) {
  let results = getAllWorkers();

  // Filtro por oficio
  if (trade && trade !== "") {
    results = results.filter(w => w.trade === trade);
  }

  // Filtro por ciudad (búsqueda parcial, insensible a mayúsculas)
  if (city && city.trim() !== "") {
    const q = city.toLowerCase().trim();
    results = results.filter(w => w.city.toLowerCase().includes(q));
  }

  // Ordenar: plan premium primero, luego por rating
  results.sort((a, b) => {
    const planOrder = { premium: 0, pro: 1, free: 2 };
    const planDiff = (planOrder[a.plan] ?? 2) - (planOrder[b.plan] ?? 2);
    if (planDiff !== 0) return planDiff;
    return (b.rating || 0) - (a.rating || 0);
  });

  const total = results.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const paginatedResults = results.slice(start, start + perPage);

  return { results: paginatedResults, total, page, totalPages };
}

/**
 * ============================================================
 * TEKTON — Capa de Autenticación (auth.js)
 * ============================================================
 * Actualmente: auth simulada con localStorage (MVP).
 *
 * PARA MIGRAR A FIREBASE:
 * 1. npm install firebase
 * 2. Rellenar APP_CONFIG.auth.firebase con tu config
 * 3. Cambiar APP_CONFIG.auth.provider = "firebase"
 * 4. Las funciones de abajo ya tienen la estructura correcta
 *    — solo reemplaza el cuerpo con las llamadas de Firebase SDK
 *
 * Schema de usuario:
 * {
 *   id:        string  — UUID generado
 *   email:     string
 *   name:      string
 *   role:      "worker" | "client" | "admin"
 *   verified:  boolean — email verificado
 *   createdAt: string
 * }
 * ============================================================
 */

// ── Estado de sesión en memoria ───────────────────────────────
// En producción con Firebase, esto lo maneja el SDK automáticamente
let _currentUser = null;

// ── Inicialización ────────────────────────────────────────────

/**
 * Inicializa la capa de auth. Llamar al cargar cada página.
 * En Firebase: onAuthStateChanged(auth, callback)
 */
function initAuth() {
  const sessionRaw = localStorage.getItem(APP_CONFIG.storageKeys.session);
  if (sessionRaw) {
    try {
      const session = JSON.parse(sessionRaw);
      // Verificar que la sesión no ha expirado
      const expiry = new Date(session.expiresAt);
      if (expiry > new Date()) {
        _currentUser = session.user;
      } else {
        logoutUser(); // Sesión expirada → limpiar
      }
    } catch {
      logoutUser();
    }
  }
}

// ── Funciones públicas de auth ────────────────────────────────

/**
 * Registra un nuevo usuario.
 *
 * EN FIREBASE:
 * const cred = await createUserWithEmailAndPassword(auth, email, password);
 * await sendEmailVerification(cred.user);
 *
 * @param {string} email
 * @param {string} password
 * @param {string} name
 * @param {string} role — "worker" | "client"
 * @returns {{ success: boolean, user?: Object, error?: string }}
 */
async function registerUser(email, password, name, role = "worker") {
  // Validaciones básicas
  if (!email || !password || !name) {
    return { success: false, error: "Tous les champs sont requis." };
  }
  if (password.length < 8) {
    return { success: false, error: "Le mot de passe doit comporter au moins 8 caractères." };
  }

  // Verificar si el email ya existe (simulado)
  const users = _getStoredUsers();
  if (users.find(u => u.email === email)) {
    return { success: false, error: "Cet e-mail est déjà utilisé." };
  }

  // Crear usuario
  const newUser = {
    id:        `user_${Date.now()}`,
    email:     email.toLowerCase().trim(),
    name:      name.trim(),
    role,
    verified:  false, // En producción: false hasta verificar email
    createdAt: new Date().toISOString(),
  };

  // Guardar (en producción esto lo hace Firebase/tu backend)
  users.push(newUser);
  _saveStoredUsers(users);

  // Iniciar sesión automáticamente tras registro
  _createSession(newUser);

  return { success: true, user: newUser };
}

/**
 * Inicia sesión con email y contraseña.
 *
 * EN FIREBASE:
 * const cred = await signInWithEmailAndPassword(auth, email, password);
 * return { success: true, user: cred.user };
 *
 * @param {string} email
 * @param {string} password
 * @returns {{ success: boolean, user?: Object, error?: string }}
 */
async function loginUser(email, password) {
  if (!email || !password) {
    return { success: false, error: "E-mail et mot de passe requis." };
  }

  const users = _getStoredUsers();
  // NOTA: En producción NUNCA guardas contraseñas en texto plano.
  // Firebase o tu backend manejan el hash. Aquí es solo simulación.
  const user = users.find(u => u.email === email.toLowerCase().trim());

  if (!user) {
    return { success: false, error: "Identifiants incorrects." };
  }

  // Simulación: en MVP aceptamos cualquier password si el email existe
  // EN PRODUCCIÓN: Firebase compara el hash automáticamente
  _createSession(user);
  return { success: true, user };
}

/**
 * Cierra la sesión actual.
 *
 * EN FIREBASE:
 * await signOut(auth);
 */
function logoutUser() {
  _currentUser = null;
  localStorage.removeItem(APP_CONFIG.storageKeys.session);
}

/**
 * Retorna el usuario actualmente autenticado, o null.
 * @returns {Object|null}
 */
function getCurrentUser() {
  return _currentUser;
}

/**
 * Verifica si hay un usuario autenticado.
 * @returns {boolean}
 */
function isAuthenticated() {
  return _currentUser !== null;
}

/**
 * Protege una página: redirige al login si no hay sesión.
 * Llamar al inicio de páginas protegidas (dashboard, etc.)
 * @param {string} redirectUrl — página protegida actual, para volver después del login
 */
function requireAuth(redirectUrl = "") {
  if (!isAuthenticated()) {
    const returnTo = redirectUrl || window.location.href;
    window.location.href = `login.html?returnTo=${encodeURIComponent(returnTo)}`;
  }
}

// ── Funciones privadas (internas) ─────────────────────────────

/**
 * Crea y persiste una sesión de usuario.
 * @param {Object} user
 */
function _createSession(user) {
  _currentUser = user;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + APP_CONFIG.auth.sessionDuration);

  localStorage.setItem(APP_CONFIG.storageKeys.session, JSON.stringify({
    user,
    expiresAt: expiresAt.toISOString(),
  }));
}

/**
 * Obtiene todos los usuarios del almacenamiento local.
 * En producción: el backend maneja esto.
 */
function _getStoredUsers() {
  const raw = localStorage.getItem("tekton_users");
  return raw ? JSON.parse(raw) : [];
}

/**
 * Guarda la lista de usuarios.
 * En producción: no existe, lo maneja el backend.
 */
function _saveStoredUsers(users) {
  localStorage.setItem("tekton_users", JSON.stringify(users));
}

// ── Inicializar al cargar el script ──────────────────────────
initAuth();

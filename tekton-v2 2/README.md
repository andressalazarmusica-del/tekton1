# TEKTON — Marketplace de Construction 🏗️
> Conecta profesionales de la construcción con clientes en París e Île-de-France.
> Inspirado en Upwork, Superprof y Airbnb — pero para la industria de la construcción.

---

## 📋 Estado del proyecto

**Versión actual: MVP v1.0 — Frontend estático con localStorage**

| Función | Estado | Notas |
|---|---|---|
| Listado de trabajadores | ✅ Listo | |
| Perfil detallado | ✅ Listo | |
| Registro de trabajadores | ✅ Listo | Con validación |
| Autenticación real | 🔜 Próxima versión | Ver sección Backend |
| Pagos / Comisiones | 🔜 Próxima versión | Ver sección Monetización |
| Panel de usuario | 🔜 Próxima versión | |
| Sistema de reseñas | 🔜 Próxima versión | |
| Chat en tiempo real | 🔜 Futura | |

---

## 🗂️ Estructura del proyecto

```
tekton/
│
├── index.html                  ← Página de inicio
├── README.md                   ← Este archivo
│
├── css/
│   ├── style.css               ← Estilos globales + variables CSS
│   └── components.css          ← Componentes reutilizables (cards, modals, forms)
│
├── js/
│   ├── config.js               ← ⚙️ CONFIGURACIÓN CENTRAL — edita aquí primero
│   ├── data.js                 ← Capa de datos (localStorage → reemplazar por API)
│   ├── auth.js                 ← Autenticación (simulada → reemplazar por Firebase/Auth0)
│   ├── router.js               ← Navegación SPA simple
│   └── utils.js                ← Funciones helper reutilizables
│
└── pages/
    ├── workers.html            ← Lista + búsqueda de trabajadores
    ├── profile.html            ← Perfil individual (?id=XXX)
    ├── register.html           ← Registro trabajador (con auth)
    ├── login.html              ← Login
    └── dashboard.html          ← Panel del trabajador (protegido)
```

---

## ⚙️ Configuración rápida

**Todo lo que necesitas editar está en `js/config.js`:**

```javascript
// Cambia el nombre/región
APP_CONFIG.name = "Tekton";
APP_CONFIG.region = "Paris";

// Cambia la API (cuando tengas backend)
APP_CONFIG.apiUrl = "https://tu-api.com/v1";

// Activa Firebase Auth
APP_CONFIG.auth.provider = "firebase"; // "local" | "firebase" | "auth0"
```

---

## 🔐 Autenticación — Roadmap

### Fase actual (MVP): Auth simulada con localStorage
- El usuario se registra → se guarda en localStorage
- Sin verificación real de email
- **SOLO para prototipar, no para producción**

### Fase 2: Firebase Auth (recomendado para startup)
1. Crear proyecto en [firebase.google.com](https://firebase.google.com)
2. Activar Authentication → Email/Password + Google
3. Copiar config en `js/config.js` → `auth.firebase`
4. Cambiar `APP_CONFIG.auth.provider = "firebase"`
5. Las funciones en `js/auth.js` ya están preparadas para este switch

### Fase 3: Auth0 (si escala mucho)
- Multi-tenant, enterprise-ready
- Cambiar provider a `"auth0"` en config

---

## 💰 Monetización — Roadmap

### Modelo híbrido (recomendado para construcción)

| Fuente | Descripción | Implementación |
|---|---|---|
| **Comisión por proyecto** | 8-12% del valor del trabajo | Stripe Connect → `js/payments.js` (próximo) |
| **Suscripción Pro** | Trabajadores destacados €29/mes | Stripe Subscriptions |
| **Leads verificados** | Clientes pagan por contacto premium | Créditos |
| **Anuncios internos** | Proveedores de materiales | Google Ad Manager |

### Para integrar Stripe (pagos):
1. Crear cuenta en [stripe.com](https://stripe.com)
2. Añadir claves en `js/config.js` → `payments.stripeKey`
3. Necesitarás un backend (mínimo serverless) para manejar webhooks

---

## 🚀 Deploy

### Opción 1: Netlify (recomendado — gratis)
```bash
# Arrastra la carpeta tekton/ a netlify.com/drop
# O instala la CLI:
npm install -g netlify-cli
netlify deploy --dir=tekton
```

### Opción 2: GitHub Pages (gratis)
```bash
git init && git add . && git commit -m "init"
git remote add origin https://github.com/tu-usuario/tekton.git
git push -u origin main
# Activar GitHub Pages en Settings → Pages
```

### Opción 3: VPS clásico (escalable)
- Nginx sirviendo archivos estáticos
- Cuando tengas backend: Node.js / Python FastAPI detrás de Nginx

---

## 🛠️ Stack Tecnológico

### Actual (MVP)
- HTML5 semántico
- CSS3 con variables CSS (sin framework)
- Vanilla JavaScript ES6+
- localStorage para datos

### Próxima versión recomendada
| Capa | Tecnología | Por qué |
|---|---|---|
| Frontend | Next.js o Astro | SEO, rendimiento |
| Backend | Node.js + Express o Python FastAPI | API REST |
| Base de datos | PostgreSQL + Prisma | Relacional, escalable |
| Auth | Firebase Auth o Auth0 | Verificación email, OAuth |
| Pagos | Stripe Connect | Marketplace payments |
| Storage | Cloudinary o S3 | Fotos de perfil |
| Deploy | Vercel + Railway | Simple, escalable |

---

## 📝 Convenciones de código

- **Variables**: camelCase
- **Clases CSS**: kebab-case
- **IDs**: kebab-case
- **Funciones**: camelCase, comentadas en JSDoc
- **Constantes de config**: UPPER_SNAKE_CASE
- Cada función debe hacer UNA sola cosa
- Comentarios en español para contexto de negocio, inglés para código técnico

---

## 👥 Contribuir (para el equipo)

1. Crea una rama: `git checkout -b feature/nombre-feature`
2. Edita solo los archivos necesarios
3. Prueba en local antes de hacer PR
4. La capa de datos está en `js/data.js` — si cambias el schema de un trabajador, actualiza también `js/utils.js → WORKER_SCHEMA`

---

*Tekton MVP — Construido para iterar rápido y escalar bien.*

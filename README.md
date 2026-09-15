# Animigos 🌸

Plataforma social y colaborativa para entusiastas del anime. Permite organizar listas personales, crear carpetas temáticas, compartir listas sincronizadas en tiempo real con amigos, descubrir títulos mediante un algoritmo inteligente de afinidad (*Happiness Score*) e interactuar a través de un feed de actividad social dinámico.

---

## ✨ Características Principales

- **Gestión de Listas y Carpetas:** Organiza tus animes vistos, pendientes o favoritos en carpetas personalizadas con tags y descripciones.
- **Listas Compartidas en Tiempo Real:** Crea listas grupales con tus amigos mediante códigos de invitación y permisos colaborativos.
- **Algoritmo de Compatibilidad (*Happiness Score*):** Calcula el índice de satisfacción grupal y afinidad temática entre miembros para decidir qué ver juntos.
- **Explorador & Recomendaciones:** Catálogo con filtros avanzados por géneros, temporadas, popularidad en IMDb/MAL y sugerencias directas de tus amigos.
- **Feed Social y Actividad:** Entérate de lo que ven tus amigos, sus calificaciones e hitos en tiempo real.
- **Interfaz Reactiva y Temas Dinámicos:** Diseño premium con soporte para modo oscuro/claro y efectos visuales personalizables.

---

## 🛠️ Tecnologías

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Frontend:** [React 19](https://react.dev/), [TailwindCSS](https://tailwindcss.com/)
- **Base de Datos & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Realtime)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Iconos & Componentes:** Lucide React

---

## 🚀 Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone git@github.com:TheFalconZ21/Animigos.git
cd Animigos
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto tomando como base `.env.example`:

```bash
cp .env.example .env.local
```

Define tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

---

## 📦 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo con Turbopack.
- `npm run build`: Genera el build optimizado para producción.
- `npm run start`: Inicia el servidor de producción.
- `npm run lint`: Ejecuta el linter para revisar el código.

---

## 🤝 Colaboración
¡Las contribuciones y sugerencias son bienvenidas! Abre un issue o un pull request para proponer mejoras.

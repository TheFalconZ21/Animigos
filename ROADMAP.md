# 🗺️ Roadmap del Producto — Animigos

Este documento establece la hoja de ruta oficial para el desarrollo de **Animigos**, estructurado en fases de validación y crecimiento según lo especificado en [ANIMIGOS_PROJECT_CONTEXT.md](file:///d:/Codigos/Animigos/ANIMIGOS_PROJECT_CONTEXT.md).

---

## 🚀 MVP 1: Coordinación Grupal y Listas Personales (Fase Actual)

> **Objetivo del MVP 1:** Responder con datos reales a la pregunta central:  
> *¿Animigos facilita que un grupo de amigos (incluyendo personas que no ven anime) decida qué anime ver sin discusiones?*

### 1. Sistema de Usuarios y Autenticación
- [x] Registro e Inicio de Sesión con Supabase Auth.
- [x] Perfil de usuario básico (Avatar, Nombre visible, Biografía).
- [x] **Onboarding Flexible:** Test inicial rápido de gustos (posible omitirlo) y versión "en profundidad" ejecutable en cualquier momento desde el perfil.

### 2. Catálogo de Anime y Caché Autónomo
- [x] Buscador de animes integrado con la API de MyAnimeList (vía Jikan v4 REST API).
- [x] **Caché local en Supabase (`anime_cache`):** Almacenamiento local para garantizar velocidad y eliminar cuellos de botella por rate-limiting.
- [x] Ficha de anime con portada, nota global de MAL, sinopsis, géneros y episodios.

### 3. Listas Personales (100% Independientes de MAL)
- [x] Creación, edición y eliminación de listas privadas propias (*Vistos*, *Viendo*, *Pendientes*, *Favoritos*).
- [x] Gestión de estados por anime (*completed*, *watching*, *plan_to_watch*, *dropped*).
- [x] Puntuación personal (1-10), contador de episodios vistos y notas personales.

### 4. Listas Compartidas (Grupales)
- [x] Creación de salas/listas compartidas.
- [x] **Enlaces de invitación (`/join/[code]`):** Acceso para amigos registrados Y soporte exclusivo para **Usuarios Invitados (Guests sin cuenta)**.
- [x] Postulación de animes candidatos por parte de los integrantes.
- [x] Indicador visual transparente de "ya visto por X integrante" sin penalizar el candidato.

### 5. Votación y Algoritmo de Felicidad Grupal (v1)
- [x] **Votación numérica de interés (0 a 10):** Sincronización transparente y en tiempo real.
- [x] **Algoritmo de Felicidad (v1):** Fórmula pura basada en media de interés ($\mu$), penalización por dispersión/polarización ($\sigma^2$), nota de MAL y popularidad.
- [x] **Explicabilidad:** Generación automática de razones en lenguaje natural sobre por qué cada anime lidera el ranking.

### 6. Seguimiento Grupal de Episodios
- [x] Selección del anime ganador por el grupo.
- [x] Registro del episodio actual visto en conjunto (`group_watch_progress`).

### 7. Dashboards
- [x] **Dashboard de Usuario (Vista Híbrida Feed):** Actividad reciente de amigos + accesos directos a listas personales y grupales.
### 8. Nuevos Requerimientos de UX/UI y Catálogo (Próxima Actualización del MVP)
- [ ] **Búsqueda Avanzada con Filtros en Catálogo (`/anime`):** Filtrar por Género, Año de estreno, Rango de Puntuación y Animes ya Vistos por Amigos.
- [ ] **Sección Principal de Navegación "Temporada" (`/seasonal`):** Ubicada en la barra principal entre Dashboard y Listas Grupales. Muestra los animes más destacados de la temporada actual (estilo MAL) con selector para navegar hacia temporadas pasadas/futuras.
- [ ] **Reorganización de Navbar & Perfil de Usuario (`/profile`):**
  - Reemplazar "Test de Gustos" y "Crear Grupo" en el extremo superior derecho por un botón/avatar único de **Perfil de Usuario**.
  - La vista `/profile` permitirá cambiar avatar/foto de perfil, gestionar amigos, editar la biografía y realizar/repetir el **Test de Gustos**.
  - Mover el botón de acción **"+ Crear Grupo"** exclusivamente al interior de la vista de **Listas Grupales (`/shared-lists`)**.

---

## 📈 Versión 2: Sinergia, Experiencia Social y Personalización (Fase 2)

> **Objetivo:** Aumentar la retención mediante métricas de compatibilidad social y personalización avanzada.

### 1. Algoritmo de Sinergia entre Usuarios
- [ ] Cálculo del % de compatibilidad de gustos entre dos amigos o un grupo entero.
- [ ] Visualización con mapa de colores (Rojo $\rightarrow$ Naranjo $\rightarrow$ Amarillo $\rightarrow$ Verde).

### 2. Feed Social Enriquecido
- [ ] Feed interactivo con comentarios, reacciones a logros de amigos y actividades.
- [ ] Sistema de notificaciones en tiempo real (invitaciones a grupos, nuevos votos).

### 3. Sistema de Reseñas
- [ ] Creación de reseñas de animes con marcado de spoilers y valoraciones comunitarias.

### 4. Filtros Restrictivos por Lista Compartida
- [ ] Aplicación de restricciones grupales previas al algoritmo (ej. *"Solo películas"*, *"Máximo 24 episodios"*, *"Excluir terror"*).

### 5. Motor de Recomendaciones Personales
- [ ] Sistema de recomendaciones 1:1 para listas individuales según el perfil de onboarding e historial visto.

---

## 🔮 Versión 3: Integraciones Bidireccionales y Ecosistema (Fase 3)

> **Objetivo:** Integración fluida con plataformas externas y estadísticas comunitarias de largo plazo.

### 1. Integración Bidireccional con MyAnimeList (Opcional)
- [ ] Importación de listas existentes desde MAL a Animigos.
- [ ] Exportación opcional de estados y notas desde Animigos hacia MAL.

### 2. Estadísticas Sociales Profundas
- [ ] Horas/días totales de anime disfrutados en grupo.
- [ ] Géneros y estudios de animación más vistos en conjunto.
- [ ] Historial de animes con mayor consenso y mayor discrepancia en el grupo.

### 3. Dashboard Administrativo Completo
- [ ] Analíticas de retención (DAU / WAU / MAU), funnels de uso y herramientas de moderación.

### 4. Compartición en Redes Sociales
- [ ] Tarjetas gráficas compartibles (ej. *"Mi grupo eligió Frieren con 9.4 de Felicidad"*).

# Animigos — Documento Base del Proyecto

## 1. Objetivo general

**Animigos** es una plataforma web social orientada a coordinar qué anime ver entre amigos y mejorar las recomendaciones para personas que no están familiarizadas con el mundo del anime.

El público objetivo principal son usuarios que:

- No consumen anime habitualmente o tienen poco conocimiento del medio.
- Tienen amigos que sí consumen anime.
- Quieren recibir recomendaciones más accesibles y contextualizadas.
- Quieren coordinar con un grupo de amigos qué anime ver a continuación.
- Quieren mantener listas propias y compartidas separadas de MyAnimeList.

La plataforma utilizará los datos de anime de **MyAnimeList** como fuente principal de catálogo e información pública de cada anime.

MyAnimeList no será obligatorio para utilizar Animigos. La integración con MAL será opcional y estará orientada principalmente a:

- Importar listas.
- Exportar listas.
- Sincronizar información en funcionalidades futuras.

Las listas internas de Animigos serán independientes de MyAnimeList.

---

# 2. Stack tecnológico

El proyecto debe utilizar:

- **Frontend / Full-stack Framework:** Next.js 16.3.4
- **Base de datos / Backend services:** Supabase
- **CSS / UI:** Tailwind CSS
- **Hosting:** Vercel

Supabase será responsable inicialmente de:

- PostgreSQL
- Autenticación
- Persistencia de usuarios
- Relaciones sociales
- Listas personales
- Listas compartidas
- Votaciones
- Comentarios
- Reacciones
- Actividad
- Preferencias
- Progreso de visualización

La arquitectura debe mantenerse preparada para separar responsabilidades o incorporar nuevos servicios si el proyecto aumenta significativamente de escala.

---

# 3. Principios generales de desarrollo

El proyecto debe priorizar:

1. Código limpio.
2. Modularidad.
3. Mantenibilidad.
4. Escalabilidad razonable.
5. Separación de responsabilidades.
6. Tipado estricto.
7. Seguridad.
8. Consistencia.
9. Documentación.
10. Facilidad para que otro desarrollador pueda comprender el proyecto.

No implementar soluciones rápidas que generen deuda técnica innecesaria cuando exista una alternativa razonablemente mantenible.

---

# 4. REGLA OBLIGATORIA DE DOCUMENTACIÓN DEL CÓDIGO

**Todo código desarrollado para Animigos debe estar acompañado por notas, comentarios o documentación que expliquen su funcionamiento cuando sea necesario para comprender su propósito.**

La documentación debe permitir que un desarrollador pueda mantener el proyecto en el futuro sin tener que reconstruir mentalmente toda la lógica.

En particular:

- Funciones con lógica relevante deben explicar su propósito.
- Algoritmos deben explicar qué intentan optimizar.
- Fórmulas deben explicar sus variables.
- Queries complejas deben explicar qué buscan obtener.
- Componentes complejos deben explicar sus responsabilidades.
- Hooks personalizados deben explicar qué abstraen.
- Servicios externos deben explicar el flujo de integración.
- Decisiones no obvias deben documentar el motivo.
- Tablas y relaciones importantes deben quedar documentadas.
- Variables deben utilizar nombres descriptivos.
- Evitar comentarios redundantes que simplemente repitan el código.

Ejemplo incorrecto:

```ts
// suma 1
counter++;
```

Ejemplo correcto:

```ts
/**
 * Incrementa la cantidad de votos procesados.
 * Este valor se utiliza posteriormente para calcular
 * la media de interés del grupo.
 */
processedVotes++;
```

También deben utilizarse archivos README o documentación Markdown cuando un módulo o arquitectura requiera una explicación mayor.

---

# 5. Organización del código

Mantener una estructura clara y consistente.

Evitar:

- Archivos gigantes.
- Componentes con múltiples responsabilidades.
- Queries SQL distribuidas sin criterio.
- Duplicación de lógica.
- Valores mágicos.
- Tipos `any` salvo casos debidamente justificados.
- Lógica de negocio importante directamente en componentes visuales.

Separar cuando corresponda:

- UI
- lógica de negocio
- acceso a datos
- validaciones
- tipos
- servicios
- algoritmos
- integraciones externas
- configuración

Los nombres de archivos, variables, componentes y funciones deben ser descriptivos.

---

# 6. Sistema de usuarios

Todos los usuarios que participen activamente en funcionalidades sociales deberán tener una cuenta.

El sistema deberá soportar:

- Registro.
- Inicio de sesión.
- Perfil.
- Avatar.
- Nombre visible.
- Preferencias.
- Amigos.
- Actividad reciente.
- Listas personales.
- Listas compartidas.
- Comentarios.
- Reacciones.
- Reseñas.

La integración con MyAnimeList será opcional.

---

# 7. Catálogo de anime

Los animes buscados o seleccionados dentro de la plataforma deben provenir del catálogo de MyAnimeList.

Se utilizará preferentemente la API de MyAnimeList.

Si las limitaciones de la API afectan significativamente al producto, se podrá evaluar:

- Mantener una caché local.
- Sincronizar una copia parcial de datos.
- Importar un dataset.
- Mantener una base de datos propia sincronizada periódicamente.

Esto debe analizarse antes de implementar una descarga completa del catálogo.

Animigos nunca debe permitir crear manualmente un anime inexistente en el catálogo utilizado.

---

# 8. Listas personales

Cada usuario podrá crear listas propias independientes de MyAnimeList.

Ejemplos:

- Quiero ver.
- Recomendados por amigos.
- Películas pendientes.
- Anime corto.
- Favoritos.
- Para ver este año.

El usuario podrá crear múltiples listas personalizadas.

Las listas podrán contener:

- Anime.
- Estado.
- Puntuación personal.
- Nivel de ganas/interés.
- Notas.
- Fecha añadida.
- Progreso.

En el futuro se podrá permitir importar/exportar estas listas con MyAnimeList.

---

# 9. Listas compartidas

Las listas compartidas son una de las funcionalidades centrales de Animigos.

Una lista compartida representa un grupo de personas intentando decidir qué anime ver.

Ejemplos:

- Qué vemos después.
- Anime de los viernes.
- Películas con amigos.
- Vacaciones.
- Maratón.

Una lista puede incluir muchos usuarios.

Todos los participantes deben tener una cuenta de Animigos.

---

# 10. Flujo de una lista compartida

Una lista compartida puede utilizar estados similares a:

1. **Candidatos**
2. **Votación**
3. **Seleccionado**
4. **Viendo**
5. **Terminado**

Los nombres exactos pueden cambiar durante el diseño.

## Candidatos

Cada participante puede postular animes.

Los animes postulados pueden haber sido vistos anteriormente por uno, varios o todos los integrantes.

**Un anime NO debe ser penalizado automáticamente porque algún usuario ya lo haya visto.**

El sistema debe indicar visualmente quién lo ha visto.

---

# 11. Sistema de votación

Cada usuario podrá expresar cuánto quiere ver cada anime.

La escala exacta deberá definirse posteriormente.

Ejemplo:

- 0–10
- 1–5
- porcentaje
- controles visuales

La puntuación representa las **ganas de ver ese anime**, no necesariamente una valoración de calidad.

Estas puntuaciones serán utilizadas por el algoritmo de felicidad grupal.

---

# 12. Algoritmo de felicidad grupal

Una pieza central del producto será un algoritmo que determine qué anime tiene mayor probabilidad de generar satisfacción en el grupo.

Debe considerar al menos:

### A. Media de ganas del grupo

Qué tan alto es el interés general en ver el anime.

### B. Dispersión de las ganas

Debe evitar situaciones donde:

- algunos usuarios quieren muchísimo verlo;
- otros no quieren verlo en absoluto.

Una menor dispersión puede representar mayor consenso.

### C. Nota media de MyAnimeList

Se utilizará como indicador externo de calidad percibida.

### D. Cantidad de usuarios de MyAnimeList que han visto/interactuado con el anime

Se utilizará como indicador de confianza/popularidad.

---

## Ejemplo conceptual

No implementar todavía esta fórmula como definitiva:

```txt
HappinessScore =
    InterestMean
    - InterestDispersionPenalty
    + MALScoreWeight
    + PopularityConfidenceWeight
```

La fórmula final debe definirse y validarse posteriormente.

**IMPORTANTE:**

La lógica del algoritmo debe quedar altamente documentada.

Cada variable, ponderación, normalización y penalización debe estar explicada.

Nunca utilizar números arbitrarios sin documentar por qué existen.

---

# 13. Explicabilidad de las recomendaciones

Las recomendaciones no deben limitarse a mostrar un ranking.

Animigos debe explicar por qué recomienda un anime.

Ejemplos:

> "Este anime tiene una puntuación alta porque todos mostraron interés y existe muy poca diferencia entre las valoraciones del grupo."

> "Aunque su puntuación en MyAnimeList es menor, es la opción con mayor consenso entre los integrantes."

> "Tres integrantes mostraron interés muy alto y ninguno lo calificó negativamente."

La explicabilidad es una característica importante del producto.

---

# 14. Preferencias personales

Cada usuario podrá registrar preferencias.

Especialmente:

- Duración preferida.
- Cantidad máxima o ideal de episodios.
- Preferencia por películas.
- Géneros.
- Temáticas.
- Otras preferencias futuras.

Estas preferencias podrán utilizarse posteriormente para recomendaciones.

---

# 15. Filtros por lista

Cada lista compartida podrá establecer condiciones adicionales.

Ejemplos:

- Solo romance.
- Solo películas.
- Máximo 24 episodios.
- Solo animes terminados.
- Excluir determinados géneros.

Estas restricciones deben aplicarse antes del algoritmo de felicidad.

Conceptualmente:

```txt
Catálogo / candidatos
        ↓
Filtros de la lista
        ↓
Animes válidos
        ↓
Algoritmo de felicidad
        ↓
Ranking
```

---

# 16. Recomendaciones personales

Las listas personales podrán utilizar un sistema de recomendaciones distinto al de las listas grupales.

El objetivo será recomendar anime basándose en señales como:

- Gustos del usuario.
- Historial.
- Ratings.
- Listas.
- Preferencias.
- Géneros.
- Duración.
- Popularidad.
- Similitud con contenido visto.

Este sistema deberá diseñarse posteriormente.

---

# 17. Recomendaciones para usuarios nuevos en anime

Una prioridad del producto es ayudar a usuarios que **no conocen anime**.

La experiencia no debe asumir conocimientos previos.

Evitar depender exclusivamente de preguntas como:

> "¿Cuál es tu anime favorito?"

porque el usuario objetivo puede no haber visto ninguno.

En versiones futuras se podrán utilizar señales como:

- Series favoritas.
- Películas favoritas.
- Libros.
- Música.
- Géneros narrativos.
- Temáticas.
- Épocas.
- Tolerancia a series largas.
- Preferencia por animación/acción/drama/etc.

---

# 18. Sinergia entre usuarios

Animigos deberá permitir visualizar qué tan compatibles son los gustos de dos personas.

La visualización ideal debe utilizar colores para representar niveles de sinergia.

Ejemplo conceptual:

```txt
Rojo        → gustos muy diferentes
Naranjo     → compatibilidad baja
Amarillo    → compatibilidad media
Verde       → compatibilidad alta
```

Los colores y metodología exacta serán definidos posteriormente.

La sinergia podrá mostrarse:

- Entre amigos.
- Entre integrantes de una lista.
- Para todo un grupo.

---

# 19. Estadísticas sociales

Interesa incorporar estadísticas como:

- Compatibilidad entre amigos.
- Géneros favoritos compartidos.
- Anime favorito compartido.
- Animes con mayor consenso.
- Animes con mayor desacuerdo.
- Estudios preferidos.
- Cantidad de anime visto juntos.
- Horas estimadas viendo anime.
- Historial de listas compartidas.
- Tasas de coincidencia.

Estas funcionalidades no necesariamente forman parte del MVP.

---

# 20. Seguimiento grupal de episodios

Cuando una lista seleccione un anime para verlo, el grupo deberá poder registrar su progreso.

Ejemplo:

```txt
Frieren
Episodio grupal: 14 / 28
```

Este progreso será independiente del progreso individual.

Cada usuario puede:

- ir exactamente con el grupo;
- haber visto episodios previamente;
- haber terminado el anime anteriormente.

El progreso grupal representa hasta dónde llegó el grupo en conjunto.

---

# 21. Integración futura con MyAnimeList

En una versión posterior se podrá permitir:

- Importar listas.
- Exportar listas.
- Sincronizar estado.
- Sincronizar ratings.
- Actualizar episodios vistos.

No constituye una prioridad para el primer MVP.

La arquitectura debe evitar bloquear esta posibilidad futura.

---

# 22. Sistema social

La visión completa incluye:

- Amigos.
- Solicitudes de amistad.
- Perfiles.
- Actividad reciente.
- Comentarios.
- Reacciones.
- Reseñas.
- Listas compartidas.
- Historial de actividad.

Ejemplo de feed:

```txt
Mauricio terminó Death Note.

Maximiliano agregó Monster a "Qué vemos después".

Sofía puntuó Frieren con 9/10.

El grupo eligió Steins;Gate como próximo anime.
```

---

# 23. Reseñas

Los usuarios podrán escribir reseñas de animes.

Debe definirse posteriormente:

- sistema de puntuación;
- spoilers;
- comentarios;
- reacciones;
- privacidad.

---

# 24. Dashboard de usuario

El dashboard deberá mostrar información relevante como:

- Listas propias.
- Listas compartidas.
- Animes actualmente viendo.
- Actividad de amigos.
- Invitaciones.
- Recomendaciones.
- Próximas votaciones.
- Progreso grupal.

El diseño exacto se definirá posteriormente.

---

# 25. Dashboard administrativo

El MVP debe incluir un dashboard administrativo que permita observar el funcionamiento y uso de la plataforma.

Debe contemplar al menos:

- Usuarios registrados.
- Usuarios activos.
- Listas creadas.
- Listas compartidas.
- Anime añadido.
- Votaciones realizadas.
- Errores relevantes.
- Actividad de la plataforma.

Posteriormente se podrán agregar:

- métricas de retención;
- DAU / WAU / MAU;
- funnels;
- sesiones;
- reportes;
- moderación;
- gestión de contenido.

---

# 26. MVP

El MVP debe concentrarse en validar principalmente la coordinación grupal.

## Funcionalidades indispensables

### Usuarios

- Registro.
- Login.
- Perfil básico.

### Amigos

- Agregar amigos.
- Aceptar/rechazar solicitudes.
- Lista de amigos.

### Anime

- Buscar anime desde catálogo basado en MyAnimeList.
- Visualizar información relevante.

### Listas personales

- Crear.
- Editar.
- Eliminar.
- Añadir/quitar anime.

### Listas compartidas

- Crear lista.
- Invitar participantes.
- Postular anime.
- Votar.
- Calcular ranking.
- Seleccionar anime.
- Registrar progreso.

### Algoritmo inicial

Primera versión del Happiness Score utilizando:

- media de interés;
- dispersión;
- rating MAL;
- cantidad de usuarios MAL.

### Dashboard usuario

Vista funcional de:

- listas;
- amigos;
- actividad relevante.

### Dashboard administrador

Vista básica de uso y funcionamiento.

---

# 27. Fuera del MVP inicial

No priorizar inicialmente:

- Sincronización bidireccional completa con MyAnimeList.
- Manga.
- Monetización.
- Sistema avanzado de recomendaciones por IA.
- Feed social extremadamente complejo.
- Gamificación.
- Chat privado.
- Aplicación móvil nativa.
- Sistema completo de moderación.
- Machine Learning avanzado.

Estas funcionalidades podrán evaluarse posteriormente.

---

# 28. Monetización

Actualmente **no se planea monetizar Animigos**.

No diseñar funcionalidades artificialmente alrededor de:

- suscripciones;
- planes premium;
- anuncios;
- paywalls.

La prioridad es:

1. Producto.
2. Validación.
3. Usuarios.
4. Retención.
5. Calidad de las recomendaciones.

---

# 29. Diseño UX/UI

Todavía no existe una dirección visual definitiva.

No asumir que debe copiar MyAnimeList, AniList o Netflix.

La interfaz debe priorizar:

- facilidad de uso;
- claridad;
- descubrimiento;
- experiencia social;
- accesibilidad para usuarios que no conocen anime.

Especialmente importante:

**No diseñar la interfaz únicamente para usuarios expertos en anime.**

Los nombres, filtros y recomendaciones deben ser comprensibles para alguien nuevo.

---

# 30. Seguridad

Toda funcionalidad debe diseñarse considerando:

- Row Level Security de Supabase.
- Validación server-side.
- Permisos por usuario.
- Permisos por lista.
- Protección de rutas.
- Sanitización de inputs.
- Rate limiting cuando corresponda.
- Protección de claves API.

NUNCA exponer:

- Supabase service role key.
- Secretos de MyAnimeList.
- Tokens privados.
- Credenciales administrativas.

Los secretos deben mantenerse exclusivamente en variables de entorno server-side.

---

# 31. Supabase

Utilizar Supabase siguiendo buenas prácticas.

Las tablas deberán diseñarse después de definir correctamente los dominios.

Posibles entidades iniciales:

```txt
users
profiles
friendships

anime
anime_external_data

personal_lists
personal_list_items

shared_lists
shared_list_members
shared_list_candidates

votes

group_watch_progress

reviews
comments
reactions

activity_events

user_preferences

admin_events
```

Esto es únicamente una propuesta conceptual.

**No implementar el esquema completo sin antes revisar y normalizar las relaciones.**

---

# 32. MyAnimeList

La integración debe estar abstraída detrás de un servicio.

Evitar llamadas directas a MAL desde múltiples componentes.

Ejemplo conceptual:

```txt
UI
 ↓
Anime Service
 ↓
MAL Adapter
 ↓
MyAnimeList API
```

Esto permite sustituir o complementar MyAnimeList posteriormente sin reescribir toda la aplicación.

Por ejemplo:

```txt
AnimeService.search()
AnimeService.getById()
AnimeService.getRanking()
AnimeService.getStatistics()
```

Internamente podrá utilizar:

```txt
MyAnimeList API
        +
Cache Supabase
```

---

# 33. Estrategia de caché

Debe evaluarse almacenar localmente información de anime consultada frecuentemente.

Ejemplo:

```txt
Usuario busca anime
        ↓
¿Existe información reciente en Supabase?
     ↙          ↘
   Sí            No
   ↓             ↓
Cache          MAL API
                 ↓
              guardar
```

Esto puede:

- reducir llamadas a la API;
- mejorar rendimiento;
- reducir dependencia externa;
- facilitar estadísticas propias.

La estrategia exacta deberá diseñarse posteriormente.

---

# 34. Arquitectura sugerida

Ejemplo conceptual:

```txt
Next.js 16
│
├── App Router
│
├── Server Components
│
├── Client Components
│
├── Server Actions / Route Handlers
│
├── Services
│
│   ├── AnimeService
│   ├── ListService
│   ├── RecommendationService
│   ├── FriendshipService
│   └── ActivityService
│
├── Algorithms
│   └── HappinessScore
│
└── Supabase
    ├── PostgreSQL
    ├── Auth
    ├── RLS
    └── Storage
```

La arquitectura final deberá evaluarse antes de implementarla completamente.

---

# 35. Regla para decisiones técnicas

Antigravity NO debe asumir silenciosamente decisiones importantes.

Cuando existan múltiples alternativas relevantes, debe documentar:

1. alternativas;
2. ventajas;
3. desventajas;
4. decisión elegida;
5. motivo.

Especialmente para:

- arquitectura;
- base de datos;
- autenticación;
- caching;
- algoritmos;
- APIs externas;
- seguridad;
- modelado social.

---

# 36. Calidad

Antes de considerar terminada una funcionalidad:

- Debe compilar.
- Debe pasar lint.
- Debe respetar tipos.
- Debe manejar errores.
- Debe considerar estados de carga.
- Debe considerar estados vacíos.
- Debe considerar permisos.
- Debe tener nombres claros.
- Debe estar documentada cuando corresponda.

---

# 37. Testing

Incorporar testing progresivamente.

Priorizar tests especialmente para:

- Happiness Score.
- Permisos.
- Listas compartidas.
- Votaciones.
- Relaciones entre usuarios.
- Filtros.
- Transformación de datos MAL.

La lógica de negocio crítica debe poder probarse sin depender de componentes UI.

---

# 38. Git

Mantener commits descriptivos.

Ejemplo:

```txt
feat(shared-lists): add candidate voting system
fix(auth): prevent unauthorized list access
refactor(recommendations): extract happiness scoring service
docs(architecture): document MAL caching strategy
```

Evitar commits como:

```txt
changes
fix
update
cosas
test123
```

---

# 39. Prioridad actual

La prioridad actual del proyecto es:

```txt
Usuarios
   ↓
Amigos
   ↓
Catálogo anime
   ↓
Listas personales
   ↓
Listas compartidas
   ↓
Postulación
   ↓
Votación
   ↓
Happiness Score
   ↓
Selección
   ↓
Progreso grupal
   ↓
Dashboard
```

No comenzar desarrollando funcionalidades secundarias antes de construir correctamente este flujo.

---

# 40. Objetivo de validación

La pregunta principal que debe responder el MVP es:

> **¿Animigos facilita realmente que un grupo de amigos decida qué anime ver, especialmente cuando algunos integrantes no conocen anime?**

Preguntas secundarias:

- ¿Los usuarios entienden el sistema de ganas?
- ¿Confían en el ranking?
- ¿Las explicaciones ayudan?
- ¿La votación reduce la fricción?
- ¿Los usuarios nuevos descubren anime que realmente quieren ver?
- ¿Los grupos vuelven a utilizar Animigos para elegir el siguiente anime?

---

# 41. Filosofía del producto

Animigos NO debe convertirse simplemente en:

> "otro MyAnimeList".

Su valor diferencial está en:

**MyAnimeList**

```txt
"¿Qué anime viste?"
```

**Animigos**

```txt
"¿Qué deberíamos ver juntos ahora?"
```

El producto debe diseñarse alrededor de esa diferencia.

---

# 42. Ajustes de UX/UI y Navegación Registrados

Se incorporan los siguientes requerimientos aprobados para la evolución de la interfaz:

1. **Filtros Avanzados en Catálogo (`/anime`):**
   - Permitir filtrar por Género, Año de estreno, Rango de puntuación y Animes ya vistos por amigos.

2. **Sección Principal "Temporada" (`/seasonal`):**
   - Ubicada en la barra principal de navegación entre Dashboard y Listas Grupales.
   - Muestra los animes más populares y destacados de la temporada actual (estilo MyAnimeList / Jikan API) con posibilidad de navegar hacia temporadas anteriores o futuras.

3. **Reorganización del Header y Perfil de Usuario (`/profile`):**
   - El extremo superior derecho de la barra reemplaza los botones dispersos por un **acceso único al Perfil de Usuario**.
   - Desde la pantalla `/profile`, el usuario podrá cambiar su foto/avatar, editar su biografía, gestionar amigos y ejecutar o repetir el "Test de Gustos".
   - El botón **"+ Crear Grupo"** se traslada exclusivamente al interior de la pantalla de **Listas Compartidas (`/shared-lists`)**.


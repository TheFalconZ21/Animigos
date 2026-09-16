import Link from "next/link";
import LandingNavbar from "@/components/common/LandingNavbar";
import {
  Sparkles,
  Users,
  Vote,
  BrainCircuit,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Star,
  Zap,
  EyeOff,
  Flame,
  UserCheck,
  Palette,
  Clock,
  Tv,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 flex flex-col selection:bg-white selection:text-black">
      {/* Header específico de la Landing (solo Animes, Lista Grupal, Login, Register) */}
      <LandingNavbar />

      <main className="flex-1 w-full">
        {/* ============================================================ */}
        {/* 1. HERO SECTION */}
        {/* ============================================================ */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Subtle Ambient Radial Spotlight (Monochrome) */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-white/[0.03] rounded-full blur-3xl pointer-events-none -z-10"
          />

          {/* Announcement Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-slate-200 text-xs font-semibold uppercase tracking-wider mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Coordinación Social de Anime & Algoritmo de Consenso</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-5xl mb-6">
            Decide qué anime ver juntos. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Sin discusiones ni dramas.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-400 max-w-3xl mb-10 leading-relaxed font-normal">
            Coordina maratones y sesiones semanales con tu grupo. Cada integrante califica su nivel real de ganas (0 a 10) y nuestro{" "}
            <strong className="text-white font-semibold">Algoritmo de Felicidad Grupal</strong> calcula la opción ideal para maximizar la satisfacción colectiva.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 text-sm font-extrabold text-black bg-white hover:bg-slate-200 rounded-2xl shadow-xl shadow-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
            >
              <span>Crear Cuenta Gratis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/anime"
              className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-white bg-white/[0.05] hover:bg-white/10 border border-white/15 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-300" />
              <span>Explorar Catálogo de Animes</span>
            </Link>

            <Link
              href="/shared-lists"
              className="w-full sm:w-auto px-6 py-4 text-sm font-semibold text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2 underline underline-offset-4"
            >
              <Users className="w-4 h-4" />
              <span>Entrar como Invitado con Código</span>
            </Link>
          </div>

          {/* ============================================================ */}
          {/* HERO VISUAL PREVIEW: LIVE VOTING ROOM MOCKUP */}
          {/* ============================================================ */}
          <div className="w-full max-w-4xl rounded-3xl bg-[#090D15] border border-white/15 shadow-[0_20px_70px_rgba(0,0,0,0.8)] p-4 sm:p-7 text-left space-y-5">
            {/* Window header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    🍿 Maratón Anime de los Viernes
                    <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded-full border border-white/15 font-mono">
                      Sala #viernes2026
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    4 miembros votando en vivo • Algoritmo activo
                  </p>
                </div>
              </div>

              {/* Group happiness score pill */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 shrink-0">
                <BrainCircuit className="w-4 h-4 text-white" />
                <span className="text-xs font-black text-white">96% Felicidad Grupal</span>
                <span className="text-[10px] text-slate-300 font-medium">| 0 Vetos</span>
              </div>
            </div>

            {/* Candidate cards in room */}
            <div className="space-y-3">
              {/* Winner Anime Candidate */}
              <div className="p-4 rounded-2xl bg-white/[0.06] border-2 border-white/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
                <div className="flex items-center gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-white text-black font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div className="w-12 h-16 rounded-lg bg-slate-800 shrink-0 overflow-hidden border border-white/20">
                    <img
                      src="https://cdn.myanimelist.net/images/anime/1015/138025.jpg"
                      alt="Sousou no Frieren"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">Sousou no Frieren</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-black">
                        ⭐ Opción Recomendada
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Fantasía, Aventura • Todos puntuaron ≥ 9.0 (Consenso total)
                    </p>
                  </div>
                </div>

                {/* Score & Member Votes */}
                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="flex -space-x-2">
                    <span className="w-7 h-7 rounded-full bg-slate-800 border border-white/20 text-[10px] font-bold flex items-center justify-center text-white" title="Maxi: 10">10</span>
                    <span className="w-7 h-7 rounded-full bg-slate-800 border border-white/20 text-[10px] font-bold flex items-center justify-center text-white" title="Sofi: 9.5">9.5</span>
                    <span className="w-7 h-7 rounded-full bg-slate-800 border border-white/20 text-[10px] font-bold flex items-center justify-center text-white" title="Mateo: 9.5">9.5</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-white">9.7</span>
                    <span className="text-[10px] text-slate-400 block font-mono">Score Grupal</span>
                  </div>
                </div>
              </div>

              {/* Second candidate */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-white/10 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div className="w-12 h-16 rounded-lg bg-slate-800 shrink-0 overflow-hidden border border-white/10">
                    <img
                      src="https://cdn.myanimelist.net/images/anime/1171/109222.jpg"
                      alt="Jujutsu Kaisen"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Jujutsu Kaisen Season 2</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Acción, Shonen • Puntuaciones: 9.0, 8.5, 8.0
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-base font-bold text-slate-200">8.5</span>
                    <span className="text-[10px] text-slate-400 block font-mono">Score Grupal</span>
                  </div>
                </div>
              </div>

              {/* Third candidate */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-white/10 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div className="w-12 h-16 rounded-lg bg-slate-800 shrink-0 overflow-hidden border border-white/10">
                    <img
                      src="https://cdn.myanimelist.net/images/anime/1448/127956.jpg"
                      alt="Bocchi the Rock!"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Bocchi the Rock!</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Comedia, Música • Puntuaciones: 8.5, 9.0, 7.5
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-base font-bold text-slate-200">8.3</span>
                    <span className="text-[10px] text-slate-400 block font-mono">Score Grupal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. CÓMO FUNCIONA EN 3 PASOS */}
        {/* ============================================================ */}
        <section id="features" className="py-20 border-t border-white/10 bg-[#070B12]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
                Flujo Simple y sin Fricción
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                ¿Cómo funciona Animigos?
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Tres pasos diseñados para transformar horas de discusión indecisa en una decisión unánime en menos de 2 minutos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Paso 1 */}
              <div className="p-8 rounded-3xl bg-[#0D121E] border border-white/15 space-y-4 relative group hover:border-white/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white text-black font-black text-lg flex items-center justify-center">
                  1
                </div>
                <h3 className="text-xl font-bold text-white">Crea tu Sala o Lista Grupal</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Crea una lista compartida y añade animes candidatos. Genera un enlace o código de invitación para compartir por WhatsApp o Discord.
                </p>
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-white" /> Tus amigos no necesitan registrarse
                  </span>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="p-8 rounded-3xl bg-[#0D121E] border border-white/15 space-y-4 relative group hover:border-white/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white text-black font-black text-lg flex items-center justify-center">
                  2
                </div>
                <h3 className="text-xl font-bold text-white">Voten sus Ganas Reales (0 a 10)</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Cada integrante califica su apetito por cada título: desde "Ni loco" (0) hasta "Obra Maestra Imprescindible" (10). Las votaciones se reflejan al instante.
                </p>
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <EyeOff className="w-4 h-4 text-white" /> Modo de voto secreto opcional
                  </span>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="p-8 rounded-3xl bg-[#0D121E] border border-white/15 space-y-4 relative group hover:border-white/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white text-black font-black text-lg flex items-center justify-center">
                  3
                </div>
                <h3 className="text-xl font-bold text-white">El Algoritmo de Felicidad Decide</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  El sistema detecta consensos, penaliza desacuerdos extremos y calcula el ganador matemático garantizando que nadie termine frustrado.
                </p>
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4 text-white" /> Justificación transparente de resultados
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. ALGORITMO DE FELICIDAD GRUPAL (DEEP DIVE) */}
        {/* ============================================================ */}
        <section id="algoritmo" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#0B0F18] border border-white/15 p-8 sm:p-12 lg:p-16">
            <div className="max-w-3xl mb-12 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-white" /> Ciencia y Psicología de Decisiones
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                ¿Por qué un promedio simple no funciona en un grupo?
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Si un amigo vota 10 y otro vota 1, el promedio matemático es 5.5. Pero en la vida real, ese amigo del "1" pasará 3 horas aburrido y frustrado. Nuestro algoritmo resuelve este dilema.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <Vote className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Consenso sobre Extremos</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Premiamos los animes donde todos tienen un interés homogéneo (ej. 8, 8 y 9) por encima de títulos con opiniones polarizadas y divididas.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Detección Activa de Veto</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cualquier voto inferior a 4 activa una bandera de incompatibilidad, asegurando que ningún miembro sea forzado a ver contenido que detesta.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Explicabilidad 100% Abierta</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No es un misterio de caja negra: la plataforma muestra detalladamente qué géneros compartidos y coincidencias llevaron a la sugerencia ganadora.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. EXPLORADOR DE ANIMES Y CALENDARIO SEMANAL */}
        {/* ============================================================ */}
        <section className="py-20 border-t border-white/10 bg-[#070B12]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-3 max-w-2xl">
                <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
                  Catálogo Siempre Actualizado
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Top Animes & Calendario de Temporada
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Explora el catálogo histórico o revisa el calendario interactivo de emisiones semanales para saber con exactitud qué animes se estrenan de Lunes a Domingo.
                </p>
              </div>

              <Link
                href="/anime"
                className="px-6 py-3 rounded-2xl bg-white text-black font-bold text-xs hover:bg-slate-200 transition-all flex items-center gap-2 self-start md:self-auto shrink-0"
              >
                <span>Ver Catálogo Completo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Visual Schedule Preview */}
            <div className="p-6 rounded-3xl bg-[#0D121F] border border-white/15 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-white" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Emisiones Semanales de Temporada</h4>
                    <span className="text-xs text-slate-400">Distribución organizada por día de emisión</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Horarios sincronizados con Japón</span>
                </div>
              </div>

              {/* Day badges preview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((day, idx) => (
                  <div
                    key={day}
                    className={`p-3.5 rounded-2xl border text-center transition-all ${
                      idx === 4
                        ? "bg-white text-black border-white font-bold"
                        : "bg-white/[0.03] border-white/10 text-slate-300"
                    }`}
                  >
                    <span className="text-xs block font-bold">{day}</span>
                    <span className={`text-[10px] block mt-1 ${idx === 4 ? "text-slate-800" : "text-slate-500"}`}>
                      {idx === 4 ? "Día Activo" : "Emisiones"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. INVITADOS TEMPORALES & SALAS */}
        {/* ============================================================ */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-white" /> Acceso para Invitados Temporales
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                ¿Tus amigos no quieren registrarse? <br />
                Pueden votar igual.
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Sabemos lo tedioso que es pedirle a un grupo de amigos que todos creen una cuenta solo para elegir una serie. Con Animigos, el anfitrión crea la sala y cualquier persona puede entrar con un apodo provisional para votar al instante desde su móvil o PC.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  <span>Sin formularios largos ni contraseñas obligatorias para invitados</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  <span>Resultados guardados permanentemente por el creador de la sala</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  <span>Posibilidad de convertir el perfil temporal en cuenta completa cuando quieran</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/shared-lists"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-black font-bold text-xs hover:bg-slate-200 transition-all shadow-md"
                >
                  <Users className="w-4 h-4" />
                  <span>Ver Listas Grupales</span>
                </Link>
              </div>
            </div>

            {/* Invite card simulation */}
            <div className="p-8 rounded-3xl bg-[#0C101A] border border-white/15 space-y-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center mx-auto font-black text-xl">
                ✉️
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Invitación Rápida</span>
                <h3 className="text-xl font-bold text-white mt-1">Únete a una sala de votación</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Si un amigo te compartió un código de sala, ingresa directamente para calificar las opciones del grupo.
                </p>
              </div>

              <div className="flex items-center gap-2 max-w-sm mx-auto">
                <input
                  type="text"
                  placeholder="Código de sala (ej. viernes2026)"
                  readOnly
                  value="viernes2026"
                  className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-mono text-center"
                />
                <Link
                  href="/shared-lists"
                  className="px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-slate-200 transition-all"
                >
                  Unirse
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6. TEMAS PERSONALIZADOS AL REGISTRARTE */}
        {/* ============================================================ */}
        <section className="py-20 border-t border-white/10 bg-[#070B12]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto space-y-3 mb-12">
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400 flex items-center justify-center gap-2">
                <Palette className="w-4 h-4 text-white" /> Personalización por Cuenta
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Al crear tu cuenta, la plataforma cobra vida
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Los visitantes navegan con la paleta neutra y elegante de la plataforma. Pero al registrarte, desbloqueas temas visuales dinámicos que se adaptan a tus géneros de anime favoritos.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
              {[
                { name: "Romance Yuri", emoji: "🌸", desc: "Pétalos de cerezo flotantes" },
                { name: "Romance Yaoi", emoji: "🖤", desc: "Estilo nocturno oscuro" },
                { name: "Sci-Fi / Mecha", emoji: "⚡", desc: "Naves y luces cibernéticas" },
                { name: "Acción / Shonen", emoji: "🔥", desc: "Llamas y energía ardiente" },
                { name: "Comedia", emoji: "✨", desc: "Fuegos artificiales festivos" },
                { name: "Slice of Life", emoji: "🌿", desc: "Hojas llevadas por el viento" },
                { name: "Fantasía / Magia", emoji: "🔮", desc: "Círculos arcanos rúnicos" },
                { name: "Terror / Misterio", emoji: "👁️", desc: "Niebla y bosque tétrico" },
                { name: "Deportes", emoji: "⚽", desc: "Flashes de estadio y confeti" },
                { name: "Drama", emoji: "🌧️", desc: "Lluvia sobre rascacielos" },
              ].map((th) => (
                <div
                  key={th.name}
                  className="p-4 rounded-2xl bg-[#0D121E] border border-white/10 flex flex-col items-center text-center space-y-2 hover:border-white/30 transition-all"
                >
                  <span className="text-2xl">{th.emoji}</span>
                  <h4 className="text-xs font-bold text-white">{th.name}</h4>
                  <p className="text-[10px] text-slate-400">{th.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 7. FINAL CALL TO ACTION */}
        {/* ============================================================ */}
        <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              ¿Listo para terminar con el <br className="hidden sm:inline" />
              "no sé, elijan ustedes"?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Empieza ahora. Crea tu primera lista grupal o explora el catálogo sin costo alguno.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-black font-extrabold text-sm hover:bg-slate-200 transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2"
            >
              <span>Comenzar Gratis en Segundos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/anime"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/15 text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ver Animes Disponibles</span>
            </Link>
          </div>
        </section>
      </main>

      {/* ============================================================ */}
      {/* 8. FOOTER NEUTRO */}
      {/* ============================================================ */}
      <footer className="border-t border-white/10 py-12 bg-[#030508] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white">Animigos</span>
              <span className="text-slate-500 block text-[11px]">
                Plataforma Social de Coordinación de Anime & Decisiones Grupales
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/anime" className="hover:text-white transition-colors">
              Animes
            </Link>
            <Link href="/shared-lists" className="hover:text-white transition-colors">
              Listas Grupales
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/register" className="hover:text-white transition-colors">
              Registrarse
            </Link>
          </div>

          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} Animigos. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import { Sparkles, Users, Vote, Heart, ArrowRight, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-500 relative"
      style={{
        background: "linear-gradient(to bottom, var(--theme-bg-start), var(--theme-bg-end))",
      }}
    >
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 flex flex-col items-center justify-center text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-8 animate-pulse">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Plataforma Social de Anime & Algoritmo de Felicidad</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mb-6">
          ¿Qué deberíamos ver <br className="hidden sm:inline" />
          <span className="gradient-text">juntos hoy?</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          Decide con tu grupo de amigos qué anime ver sin discusiones. Vota tu nivel de ganas (0-10) y deja que nuestro <strong className="text-purple-300">Algoritmo de Felicidad Grupal</strong> calcule el ranking ideal con explicaciones transparentes.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 rounded-2xl shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Ir al Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/shared-lists/new"
            className="w-full sm:w-auto px-8 py-4 text-base font-bold text-gray-200 glass-card rounded-2xl hover:bg-gray-800/80 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5 text-cyan-400" />
            <span>Crear Lista Compartida</span>
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          {/* Feature 1 */}
          <div className="glass-card p-6 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-800/50 flex items-center justify-center mb-4">
              <Vote className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Votación en Tiempo Real (0-10)</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Expresa tus ganas reales de ver cada opción. La escala de 0 a 10 se sincroniza al instante entre todos los integrantes.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card p-6 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Algoritmo de Felicidad</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premia las opciones con alto consenso y penaliza el desacuerdo o la polarización, fundamentando siempre cada recomendación.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card p-6 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Listas 100% Independientes</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Tus listas personales permanecen separadas. No requieres MyAnimeList para calificar y guardar tu historial.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 py-8 text-center text-xs text-gray-500">
        <p>© 2026 Animigos — Plataforma Social de Coordinación de Anime.</p>
      </footer>
    </div>
  );
}

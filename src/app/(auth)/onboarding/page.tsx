"use client";

import { useState } from "react";
import Navbar from "@/components/common/Navbar";
import Link from "next/link";
import { Sparkles, Check, ArrowRight, RotateCcw } from "lucide-react";

export default function OnboardingPage() {
  const [stage, setStage] = useState<"quick" | "deep">("quick");
  const [experienceLevel, setExperienceLevel] = useState<string>("beginner");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [preferredDuration, setPreferredDuration] = useState<string>("short");
  const [completed, setCompleted] = useState<boolean>(false);

  const genreOptions = [
    "Acción / Aventuras",
    "Ciencia Ficción",
    "Comedia",
    "Drama / Romance",
    "Fantasía / Magia",
    "Suspenso / Misterio",
    "Deportes",
    "Slice of Life (Vida cotidiana)",
  ];

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSave = () => {
    setCompleted(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12 flex flex-col justify-center">
        {!completed ? (
          <div className="glass-panel p-8 rounded-3xl border border-gray-800 shadow-2xl">
            {/* Stage Selector */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-6 mb-6">
              <div>
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block mb-1">
                  Test de Preferencias
                </span>
                <h1 className="text-2xl font-bold text-white">
                  {stage === "quick" ? "Configuración Rápida" : "Test en Profundidad"}
                </h1>
              </div>

              <div className="flex items-center gap-2 bg-gray-900 p-1 rounded-xl border border-gray-800">
                <button
                  onClick={() => setStage("quick")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    stage === "quick" ? "bg-purple-600 text-white shadow-md" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Rápido
                </button>
                <button
                  onClick={() => setStage("deep")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    stage === "deep" ? "bg-purple-600 text-white shadow-md" : "text-gray-400 hover:text-white"
                  }`}
                >
                  En Profundidad
                </button>
              </div>
            </div>

            {/* Question 1: Experience Level */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                1. ¿Qué tanto conoces o consumes anime actualmente?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "beginner", title: "Cero o Novato", desc: "He visto muy poco o nada." },
                  { id: "intermediate", title: "Ocasional", desc: "Veo algunas series populares." },
                  { id: "expert", title: "Experimentado", desc: "Consumo anime con frecuencia." },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setExperienceLevel(item.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      experienceLevel === item.id
                        ? "border-purple-500 bg-purple-950/40 text-white shadow-lg shadow-purple-950/50"
                        : "border-gray-800 bg-gray-900/40 text-gray-400 hover:border-gray-700 hover:text-gray-200"
                    }`}
                  >
                    <span className="font-bold text-sm block mb-0.5">{item.title}</span>
                    <span className="text-xs text-gray-500 block">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Genres */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                2. ¿Qué géneros narrativos te atraen más? (Selecciona varios)
              </label>
              <div className="flex flex-wrap gap-2.5">
                {genreOptions.map((genre) => {
                  const isSelected = selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? "border-cyan-500 bg-cyan-950/50 text-cyan-200"
                          : "border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 3: Additional Deep Questions if Deep Stage */}
            {stage === "deep" && (
              <div className="mb-8 p-5 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    3. ¿Qué duración de serie prefieres para empezar?
                  </label>
                  <select
                    value={preferredDuration}
                    onChange={(e) => setPreferredDuration(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="short">Corta (12 episodios o películas)</option>
                    <option value="medium">Mediana (24 - 50 episodios)</option>
                    <option value="long">Larga (Más de 50 episodios)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-800">
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Omitir por ahora
              </Link>

              <button
                onClick={handleSave}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
              >
                Guardar Preferencias <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">¡Preferencias Guardadas!</h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
              Tus recomendaciones individuales y aportes a las listas compartidas ahora se adaptarán a tus gustos.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/dashboard"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all"
              >
                Ir al Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

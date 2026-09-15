"use client";

import { useState } from "react";
import { SlidersHorizontal, X, Check, RefreshCw, Film, Calendar, Building2, EyeOff, Clock, Sparkles } from "lucide-react";

export interface GroupCriteriaState {
  minEpisodes: number;
  maxEpisodes: number;
  genres: string[];
  minYear: number;
  maxYear: number;
  studios: string[];
  formats: string[];
  unseenByMembersOnly: boolean;
}

interface GroupCriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCriteria: GroupCriteriaState;
  onSaveCriteria: (criteria: GroupCriteriaState) => void;
}

const AVAILABLE_GENRES = [
  "Acción",
  "Sci-Fi",
  "Fantasía",
  "Misterio",
  "Romance",
  "Drama",
  "Suspenso",
  "Comedia",
  "Recuentos de vida",
  "Sobrenatural",
  "Aventura",
  "Psicológico",
];

const AVAILABLE_STUDIOS = [
  "Madhouse",
  "Wit Studio",
  "MAPPA",
  "White Fox",
  "Kyoto Animation",
  "Bones",
  "CloverWorks",
  "Ufotable",
  "A-1 Pictures",
];

const AVAILABLE_FORMATS = ["TV", "Película", "OVA", "Especial"];

export default function GroupCriteriaModal({
  isOpen,
  onClose,
  initialCriteria,
  onSaveCriteria,
}: GroupCriteriaModalProps) {
  const [criteria, setCriteria] = useState<GroupCriteriaState>(initialCriteria);

  if (!isOpen) return null;

  const toggleGenre = (genre: string) => {
    setCriteria((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const toggleStudio = (studio: string) => {
    setCriteria((prev) => ({
      ...prev,
      studios: prev.studios.includes(studio)
        ? prev.studios.filter((s) => s !== studio)
        : [...prev.studios, studio],
    }));
  };

  const toggleFormat = (format: string) => {
    setCriteria((prev) => ({
      ...prev,
      formats: prev.formats.includes(format)
        ? prev.formats.filter((f) => f !== format)
        : [...prev.formats, format],
    }));
  };

  const handleReset = () => {
    const defaultState: GroupCriteriaState = {
      minEpisodes: 1,
      maxEpisodes: 28,
      genres: ["Sci-Fi", "Fantasía", "Misterio"],
      minYear: 2010,
      maxYear: 2026,
      studios: ["Madhouse", "White Fox"],
      formats: ["TV", "Película"],
      unseenByMembersOnly: false,
    };
    setCriteria(defaultState);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCriteria(criteria);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-[#0F172A] border border-purple-500/50 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-purple-950/80 border border-purple-800 text-purple-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Configurar Criterios Ideales del Grupo</h3>
              <p className="text-xs text-gray-400">Ajusta los parámetros para definir qué animes son ideales para este grupo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-xl hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Rango de Duración (Episodios) */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" /> Rango de Duración (Número de Capítulos)
            </label>
            <div className="grid grid-cols-2 gap-4 bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
              <div>
                <span className="text-xs text-gray-400 font-semibold block mb-1">Mínimo de Capitulos</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={criteria.minEpisodes}
                  onChange={(e) => setCriteria({ ...criteria, minEpisodes: parseInt(e.target.value) || 1 })}
                  className="w-full bg-gray-800 text-white font-extrabold text-sm px-3 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-semibold block mb-1">Máximo de Capítulos</span>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={criteria.maxEpisodes}
                  onChange={(e) => setCriteria({ ...criteria, maxEpisodes: parseInt(e.target.value) || 28 })}
                  className="w-full bg-gray-800 text-white font-extrabold text-sm px-3 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Géneros Preferidos (Multiselect) */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <Film className="w-4 h-4 text-purple-400" /> Géneros Preferidos (Selección Múltiple)
            </label>
            <div className="flex flex-wrap gap-2 bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
              {AVAILABLE_GENRES.map((genre) => {
                const isSelected = criteria.genres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30"
                        : "bg-gray-800 text-gray-400 border-gray-700 hover:text-white"
                    }`}
                  >
                    {isSelected ? `✓ ${genre}` : `+ ${genre}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Rango de Año de Estreno */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" /> Rango de Año de Estreno
            </label>
            <div className="grid grid-cols-2 gap-4 bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
              <div>
                <span className="text-xs text-gray-400 font-semibold block mb-1">Desde Año</span>
                <input
                  type="number"
                  min="1980"
                  max="2026"
                  value={criteria.minYear}
                  onChange={(e) => setCriteria({ ...criteria, minYear: parseInt(e.target.value) || 2010 })}
                  className="w-full bg-gray-800 text-white font-extrabold text-sm px-3 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-semibold block mb-1">Hasta Año</span>
                <input
                  type="number"
                  min="1980"
                  max="2026"
                  value={criteria.maxYear}
                  onChange={(e) => setCriteria({ ...criteria, maxYear: parseInt(e.target.value) || 2026 })}
                  className="w-full bg-gray-800 text-white font-extrabold text-sm px-3 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* 4. Estudios de Animación (Multiselect) */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" /> Estudios de Animación Preferidos
            </label>
            <div className="flex flex-wrap gap-2 bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
              {AVAILABLE_STUDIOS.map((studio) => {
                const isSelected = criteria.studios.includes(studio);
                return (
                  <button
                    key={studio}
                    type="button"
                    onClick={() => toggleStudio(studio)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30"
                        : "bg-gray-800 text-gray-400 border-gray-700 hover:text-white"
                    }`}
                  >
                    {isSelected ? `✓ ${studio}` : `+ ${studio}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Formato / Tipo & Switch de No Vistos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Formatos (TV, Película, OVA) */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-gray-200 uppercase tracking-wider block">
                Formato / Tipo
              </label>
              <div className="flex flex-wrap gap-2 bg-gray-900/60 p-3.5 rounded-2xl border border-gray-800">
                {AVAILABLE_FORMATS.map((fmt) => {
                  const isSelected = criteria.formats.includes(fmt);
                  return (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => toggleFormat(fmt)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isSelected
                          ? "bg-cyan-600 text-white border-cyan-500"
                          : "bg-gray-800 text-gray-400 border-gray-700"
                      }`}
                    >
                      {fmt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Switch: No visto por ningún integrante */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                <EyeOff className="w-4 h-4 text-rose-400" /> Filtro Exclusivo
              </label>
              <div className="bg-gray-900/60 p-3.5 rounded-2xl border border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-300 font-semibold leading-tight pr-2">
                  No vistos por ningún miembro del grupo
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCriteria((prev) => ({
                      ...prev,
                      unseenByMembersOnly: !prev.unseenByMembersOnly,
                    }))
                  }
                  className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                    criteria.unseenByMembersOnly ? "bg-purple-600" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      criteria.unseenByMembersOnly ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-between border-t border-gray-800 pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-800 border border-gray-800 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Restablecer Criterios
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" /> Guardar Criterios Grupales
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

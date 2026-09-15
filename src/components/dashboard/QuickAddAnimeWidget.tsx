"use client";

import { useState, useEffect, useRef } from "react";
import { MOCK_TOP_ANIMES, ExtendedAnime } from "@/core/services/catalog-data";
import { Search, Plus, FolderPlus, Star, Check, Sparkles, X } from "lucide-react";

import { getScoreBadgeStyle, MAL_SCORE_OPTIONS } from "@/core/utils/score-theme";

interface QuickAddAnimeWidgetProps {
  onAddAnime: (
    anime: ExtendedAnime,
    status: "vistos" | "viendo" | "pendientes" | "favoritos",
    userScore?: number
  ) => void;
  onCreateFolder: (folderName: string) => void;
}

export default function QuickAddAnimeWidget({ onAddAnime, onCreateFolder }: QuickAddAnimeWidgetProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ExtendedAnime[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"vistos" | "viendo" | "pendientes" | "favoritos">("vistos");
  const [userScore, setUserScore] = useState<number>(10);
  
  // Folder creation modal state
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length > 0) {
      const matches = MOCK_TOP_ANIMES.filter(
        (a) =>
          a.title.toLowerCase().includes(trimmed) ||
          (a.titleEnglish && a.titleEnglish.toLowerCase().includes(trimmed))
      );
      setSuggestions(matches.slice(0, 5));
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAdd = (anime: ExtendedAnime) => {
    onAddAnime(anime, selectedStatus, userScore);
    setQuery("");
    setIsOpen(false);
  };

  const handleFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    onCreateFolder(folderName.trim());
    setFolderName("");
    setIsCreatingFolder(false);
  };

  const showScoreSelector = selectedStatus === "vistos" || selectedStatus === "viendo" || selectedStatus === "favoritos";

  return (
    <div className="glass-panel p-5 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 bg-[#0F172A]">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-400" /> Agregar a Mi Lista
        </h3>
        <button
          onClick={() => setIsCreatingFolder(!isCreatingFolder)}
          className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-950/60 px-2.5 py-1 rounded-xl border border-purple-800/50 transition-all cursor-pointer"
        >
          <FolderPlus className="w-3.5 h-3.5" /> + Crear Carpeta
        </button>
      </div>

      {/* Modal / Form para Crear Carpeta */}
      {isCreatingFolder && (
        <form onSubmit={handleFolderSubmit} className="bg-slate-900 p-3.5 rounded-2xl border border-purple-500/40 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <FolderPlus className="w-3.5 h-3.5" /> Nueva Carpeta / Saga
            </label>
            <button
              type="button"
              onClick={() => setIsCreatingFolder(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Ej: Saga Steins;Gate, Franquicia AoT..."
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="w-full bg-slate-950 text-xs text-white placeholder-gray-500 px-3 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreatingFolder(false)}
              className="px-2.5 py-1 text-[11px] font-semibold text-gray-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold rounded-lg transition-all cursor-pointer"
            >
              Crear Carpeta
            </button>
          </div>
        </form>
      )}

      {/* Buscador Rápido de Anime */}
      <div ref={containerRef} className="space-y-3">
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Buscador Rápido de Anime
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Escribe un anime para agregar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-900 text-xs text-white placeholder-gray-400 pl-9 pr-3 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Estado predeterminado al agregar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[11px] text-gray-400 font-medium block mb-1">Estado al agregar:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full bg-slate-900 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="vistos">Visto</option>
              <option value="viendo">Viendo</option>
              <option value="pendientes">Pendiente</option>
              <option value="favoritos">Favorito</option>
            </select>
          </div>

          {/* Nota Personal Selector (1 a 10 estilo MAL) */}
          {showScoreSelector && (
            <div>
              <span className="text-[11px] font-bold block mb-1 text-gray-300">Tu Nota (1 - 10):</span>
              <select
                value={userScore}
                onChange={(e) => setUserScore(parseFloat(e.target.value))}
                className={`w-full text-xs font-extrabold px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${getScoreBadgeStyle(userScore).badgeClass}`}
              >
                {MAL_SCORE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-white font-semibold">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Autocomplete Dropdown - 100% Solid Opaque bg-[#0F172A] */}
        {isOpen && suggestions.length > 0 && (
          <div className="bg-[#0F172A] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden divide-y divide-gray-800 text-left">
            {suggestions.map((anime) => (
              <div
                key={anime.malId}
                onClick={() => handleAdd(anime)}
                className="p-2.5 hover:bg-slate-800 flex items-center justify-between gap-3 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={anime.imageUrl}
                    alt={anime.title}
                    className="w-8 h-11 object-cover rounded-lg border border-gray-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                      {anime.title}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      ★ {userScore}/10 (Tu Nota) • MAL: {anime.score}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold shrink-0 flex items-center gap-1 hover:bg-emerald-500"
                >
                  <Plus className="w-3 h-3" /> Agregar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { ExtendedAnime, MOCK_TOP_ANIMES } from "@/core/services/catalog-data";
import { getScoreBadgeStyle, MAL_SCORE_OPTIONS } from "@/core/utils/score-theme";
import {
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronUp,
  Star,
  Plus,
  Trash2,
  Building2,
  Tv,
  CheckCircle,
  Clock,
  Eye,
  Heart,
  Search,
  X,
  Layers,
  Edit,
  Send,
  Globe,
} from "lucide-react";

export interface PersonalItem {
  malId: number;
  title: string;
  imageUrl: string;
  score: number; // compatibilidad
  userScore: number; // Puntuación personal asignada por el usuario (1 a 10)
  malScore: number; // Calificación global en MyAnimeList
  episodesWatched: number;
  totalEpisodes: number;
  statusCategory: "vistos" | "viendo" | "pendientes" | "favoritos";
  notes?: string;
  studio: string;
  synopsis: string;
  genres: string[];
  type?: "TV" | "Película" | "OVA" | "ONA" | "Especial";
  tags?: string[]; // Tag IDs asignados
}

export interface PersonalFolder {
  id: string;
  title: string;
  description?: string;
  animes: PersonalItem[];
  createdAt: string;
}

interface FolderCardProps {
  folder: PersonalFolder;
  onEditFolder: (folder: PersonalFolder) => void;
  onRecommendFolder: (folder: PersonalFolder) => void;
  onRemoveFolder: (folderId: string) => void;
  onRemoveAnimeFromFolder: (folderId: string, malId: number) => void;
  onAddAnimeToFolder: (folderId: string, anime: ExtendedAnime) => void;
  onSelectAnimeModal: (anime: ExtendedAnime) => void;
  onUpdateAnimeUserScore?: (malId: number, newUserScore: number) => void;
}

export default function FolderCard({
  folder,
  onEditFolder,
  onRecommendFolder,
  onRemoveFolder,
  onRemoveAnimeFromFolder,
  onAddAnimeToFolder,
  onSelectAnimeModal,
  onUpdateAnimeUserScore,
}: FolderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingAnime, setIsAddingAnime] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ExtendedAnime[]>([]);

  const addSearchRef = useRef<HTMLDivElement>(null);

  // Estadísticas acumuladas de la carpeta
  const totalAnimes = folder.animes.length;

  // Promedio de puntuación personal del usuario para la carpeta
  const averageUserScore =
    totalAnimes > 0
      ? (
          folder.animes.reduce((acc, curr) => acc + (curr.userScore || curr.score || 0), 0) / totalAnimes
        ).toFixed(1)
      : "N/A";

  // Promedio de nota global MAL para la carpeta
  const averageMalScore =
    totalAnimes > 0
      ? (
          folder.animes.reduce((acc, curr) => acc + (curr.malScore || curr.score || 0), 0) / totalAnimes
        ).toFixed(1)
      : "N/A";

  const totalEpisodesWatched = folder.animes.reduce((acc, curr) => acc + (curr.episodesWatched || 0), 0);
  const totalEpisodes = folder.animes.reduce((acc, curr) => acc + (curr.totalEpisodes || 0), 0);

  useEffect(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (trimmed.length > 0) {
      const matches = MOCK_TOP_ANIMES.filter(
        (a) =>
          !folder.animes.some((fa) => fa.malId === a.malId) &&
          (a.title.toLowerCase().includes(trimmed) || (a.titleEnglish && a.titleEnglish.toLowerCase().includes(trimmed)))
      );
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, folder.animes]);

  const handleSelectAddAnime = (anime: ExtendedAnime) => {
    onAddAnimeToFolder(folder.id, anime);
    setSearchQuery("");
    setIsAddingAnime(false);
  };

  return (
    <div className="glass-card rounded-3xl border-2 border-purple-500/40 bg-gradient-to-r from-slate-900/90 via-[#0F172A] to-purple-950/40 overflow-hidden shadow-2xl transition-all space-y-3">
      {/* Folder Header Banner */}
      <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-500/20">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-purple-900/60 border border-purple-500/50 flex items-center justify-center text-purple-300 shrink-0 shadow-lg shadow-purple-950">
            {isExpanded ? <FolderOpen className="w-6 h-6 text-purple-300" /> : <Folder className="w-6 h-6 text-purple-400" />}
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-purple-950 text-purple-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-purple-700/50 uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3 h-3 text-purple-400" /> Carpeta Saga ({totalAnimes} {totalAnimes === 1 ? "anime" : "animes"})
              </span>

              {totalAnimes > 0 && (
                <>
                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      getScoreBadgeStyle(Number(averageUserScore)).badgeClass
                    }`}
                  >
                    <Star className="w-3 h-3 fill-current" /> {averageUserScore} (Tu Nota Promedio)
                  </span>
                  <span className="bg-slate-900 text-gray-400 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-gray-800 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-purple-400" /> {averageMalScore} MAL
                  </span>
                </>
              )}
            </div>

            <h3 className="text-lg font-black text-white truncate">{folder.title}</h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 flex-wrap self-end sm:self-auto shrink-0">
          <button
            onClick={() => onEditFolder(folder)}
            className="px-2.5 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-800 text-purple-300 hover:text-white text-xs font-bold border border-purple-700/50 transition-all flex items-center gap-1"
            title="Editar nombre, animes y orden"
          >
            <Edit className="w-3.5 h-3.5" /> Editar
          </button>

          <button
            onClick={() => onRecommendFolder(folder)}
            className="px-2.5 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-800 text-indigo-300 hover:text-white text-xs font-bold border border-indigo-700/50 transition-all flex items-center gap-1"
            title="Recomendar esta carpeta completa a un amigo"
          >
            <Send className="w-3.5 h-3.5" /> Recomendar
          </button>

          <button
            onClick={() => setIsAddingAnime(!isAddingAnime)}
            className="px-2.5 py-1.5 rounded-xl bg-purple-600/40 hover:bg-purple-600 text-purple-200 hover:text-white text-xs font-bold border border-purple-500/40 transition-all flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> + Anime
          </button>

          <button
            onClick={() => onRemoveFolder(folder.id)}
            title="Eliminar carpeta (los animes regresan a la lista general)"
            className="p-1.5 rounded-xl bg-gray-900/80 hover:bg-rose-950 text-gray-400 hover:text-rose-400 border border-gray-800 hover:border-rose-800 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold transition-all flex items-center gap-1"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>{isExpanded ? "Ocultar" : "Ver Animes"}</span>
          </button>
        </div>
      </div>

      {/* Quick Add Anime inside Folder Form */}
      {isAddingAnime && (
        <div ref={addSearchRef} className="px-5 py-3 bg-slate-900/90 border-b border-purple-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300">Buscar anime para añadir a "{folder.title}"</span>
            <button onClick={() => setIsAddingAnime(false)} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar anime para agregar a la carpeta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-xs text-white placeholder-gray-400 pl-9 pr-3 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500"
            />
          </div>

          {suggestions.length > 0 && (
            <div className="bg-[#0F172A] border border-purple-500/40 rounded-xl overflow-hidden divide-y divide-gray-800">
              {suggestions.map((item) => (
                <div
                  key={item.malId}
                  onClick={() => handleSelectAddAnime(item)}
                  className="p-2 hover:bg-slate-800 flex items-center justify-between gap-3 cursor-pointer text-xs transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={item.imageUrl} alt={item.title} className="w-7 h-10 object-cover rounded" />
                    <span className="font-bold text-white truncate">{item.title}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-purple-600 text-white font-bold text-[10px] rounded-lg shrink-0">
                    + Añadir a Carpeta
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expanded Contained Anime List */}
      {isExpanded && (
        <div className="p-5 space-y-3 bg-slate-950/60 border-t border-purple-900/30">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold border-b border-gray-800 pb-2">
            <span>Episodios acumulados de la saga: <strong className="text-white">{totalEpisodesWatched} / {totalEpisodes} eps</strong></span>
            <span>{totalAnimes} títulos en secuencia cronológica</span>
          </div>

          {folder.animes.length > 0 ? (
            <div className="space-y-2.5">
              {folder.animes.map((anime, idx) => (
                <div
                  key={anime.malId}
                  className="p-3 rounded-2xl bg-slate-900/80 border border-gray-800 hover:border-purple-500/30 flex items-center justify-between gap-3 transition-all group"
                >
                  <div
                    onClick={() => {
                      const full = MOCK_TOP_ANIMES.find((a) => a.malId === anime.malId);
                      if (full) onSelectAnimeModal(full);
                    }}
                    className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                  >
                    <span className="text-xs font-black text-purple-400 shrink-0 w-4 text-center">#{idx + 1}</span>
                    <img
                      src={anime.imageUrl}
                      alt={anime.title}
                      className="w-10 h-14 object-cover rounded-lg border border-gray-700 shrink-0 group-hover:scale-105 transition-transform"
                    />

                    <div className="min-w-0 space-y-0.5">
                      <h4 className="text-xs font-bold text-white group-hover:text-purple-300 truncate">
                        {anime.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${getScoreBadgeStyle(anime.userScore || anime.score).badgeClass}`}>
                          <Star className="w-3 h-3 fill-current" /> {anime.userScore || anime.score} (Tu Nota)
                        </span>
                        <span>•</span>
                        <span className="text-gray-400 font-semibold">🌐 {anime.malScore || anime.score} MAL</span>
                        <span>•</span>
                        <span>{anime.episodesWatched}/{anime.totalEpisodes} eps</span>
                        <span>•</span>
                        <span className="capitalize text-emerald-400">{anime.statusCategory}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="relative flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-xl border border-gray-700/80 shadow-inner">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                      <select
                        value={anime.userScore || anime.score || 10}
                        onChange={(e) => {
                          const newScore = Number(e.target.value);
                          if (onUpdateAnimeUserScore) {
                            onUpdateAnimeUserScore(anime.malId, newScore);
                          }
                        }}
                        className="bg-transparent text-[11px] font-bold text-white focus:outline-none cursor-pointer pr-1"
                        title="Cambiar tu nota personal"
                      >
                        {MAL_SCORE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                            {opt.value} - {opt.shortLabel}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => onRemoveAnimeFromFolder(folder.id, anime.malId)}
                      title="Quitar de esta carpeta (regresa a la lista general)"
                      className="px-2.5 py-1 text-[10px] font-bold text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-all shrink-0"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-gray-500 italic">
              Esta carpeta está vacía. Agrega animes usando el botón de arriba o mueve animes sueltos desde la lista.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

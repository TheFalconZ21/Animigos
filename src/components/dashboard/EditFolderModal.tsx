"use client";

import { useState, useRef, useEffect } from "react";
import { PersonalFolder, PersonalItem } from "@/components/dashboard/FolderCard";
import { MOCK_TOP_ANIMES, ExtendedAnime } from "@/core/services/catalog-data";
import { getScoreBadgeStyle, MAL_SCORE_OPTIONS } from "@/core/utils/score-theme";
import {
  X,
  Folder,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Search,
  Check,
  Sparkles,
  Layers,
  Star,
} from "lucide-react";

interface EditFolderModalProps {
  folder: PersonalFolder;
  onClose: () => void;
  onSave: (updatedFolder: PersonalFolder) => void;
}

export default function EditFolderModal({ folder, onClose, onSave }: EditFolderModalProps) {
  const [title, setTitle] = useState(folder.title);
  const [animes, setAnimes] = useState<PersonalItem[]>([...folder.animes]);

  // Search to add new anime to folder
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ExtendedAnime[]>([]);

  useEffect(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (trimmed.length > 0) {
      const matches = MOCK_TOP_ANIMES.filter(
        (a) =>
          !animes.some((fa) => fa.malId === a.malId) &&
          (a.title.toLowerCase().includes(trimmed) || (a.titleEnglish && a.titleEnglish.toLowerCase().includes(trimmed)))
      );
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, animes]);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newAnimes = [...animes];
    const temp = newAnimes[index - 1];
    newAnimes[index - 1] = newAnimes[index];
    newAnimes[index] = temp;
    setAnimes(newAnimes);
  };

  const handleMoveDown = (index: number) => {
    if (index === animes.length - 1) return;
    const newAnimes = [...animes];
    const temp = newAnimes[index + 1];
    newAnimes[index + 1] = newAnimes[index];
    newAnimes[index] = temp;
    setAnimes(newAnimes);
  };

  const handleRemoveItem = (malId: number) => {
    setAnimes(animes.filter((a) => a.malId !== malId));
  };

  const handleAddAnime = (anime: ExtendedAnime) => {
    const newItem: PersonalItem = {
      malId: anime.malId,
      title: anime.title,
      imageUrl: anime.imageUrl,
      score: anime.score,
      userScore: Math.round(anime.score) || 8,
      malScore: anime.score,
      episodesWatched: anime.episodes,
      totalEpisodes: anime.episodes,
      statusCategory: "vistos",
      notes: "Agregado a la carpeta.",
      studio: anime.studio,
      genres: anime.genres,
      synopsis: anime.synopsis,
      type: anime.status === "Película" ? "Película" : "TV",
    };
    setAnimes([...animes, newItem]);
    setSearchQuery("");
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      ...folder,
      title: title.trim(),
      animes,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0F172A] border border-purple-500/50 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-gray-800 space-y-1">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4" /> Edición de Carpeta
          </span>
          <h2 className="text-2xl font-black text-white">Editar Carpeta / Saga</h2>
          <p className="text-xs text-gray-400">
            Modifica el nombre de la carpeta, gestiona sus animes contenidos y reordena la secuencia visual/cronológica.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Nombre de Carpeta */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
              Nombre de la Carpeta
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 text-sm text-white px-4 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500"
              placeholder="Ej: Saga Steins;Gate..."
            />
          </div>

          {/* Buscador para agregar animes a esta carpeta */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
              Añadir Anime a la Carpeta
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar anime para agregar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 text-xs text-white placeholder-gray-400 pl-9 pr-3 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500"
              />
            </div>

            {suggestions.length > 0 && (
              <div className="bg-slate-900 border border-purple-500/40 rounded-xl overflow-hidden divide-y divide-gray-800">
                {suggestions.map((item) => (
                  <div
                    key={item.malId}
                    onClick={() => handleAddAnime(item)}
                    className="p-2.5 hover:bg-slate-800 flex items-center justify-between gap-3 cursor-pointer text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={item.imageUrl} alt={item.title} className="w-8 h-11 object-cover rounded" />
                      <span className="font-bold text-white truncate">{item.title}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-purple-600 text-white font-bold text-[10px] rounded-lg shrink-0 flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Añadir
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reordenamiento e ítems contenidos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-gray-300 uppercase tracking-wider">
              <span>Animes contenidos y orden cronológico/visual ({animes.length})</span>
              <span className="text-gray-500 text-[10px]">Usa ▲ ▼ para definir el orden</span>
            </div>

            {animes.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {animes.map((anime, idx) => (
                  <div
                    key={anime.malId}
                    className="p-3 rounded-2xl bg-slate-900 border border-gray-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="text-xs font-black text-purple-400 w-5 text-center shrink-0">#{idx + 1}</span>
                      <img src={anime.imageUrl} alt={anime.title} className="w-9 h-12 object-cover rounded-lg border border-gray-700 shrink-0" />
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-xs font-bold text-white truncate">{anime.title}</p>
                        <p className="text-[10px] text-gray-400">🌐 {anime.malScore || anime.score} MAL • {anime.studio}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="relative flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-gray-700">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                        <select
                          value={anime.userScore || anime.score || 10}
                          onChange={(e) => {
                            const newScore = Number(e.target.value);
                            setAnimes(
                              animes.map((a) => (a.malId === anime.malId ? { ...a, userScore: newScore, score: newScore } : a))
                            );
                          }}
                          className="bg-transparent text-[11px] font-bold text-white focus:outline-none cursor-pointer pr-1"
                        >
                          {MAL_SCORE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                              {opt.value} - {opt.shortLabel}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveUp(idx)}
                        className="p-1.5 rounded-lg bg-gray-800 hover:bg-purple-900 disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 hover:text-white"
                        title="Subir en el orden"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === animes.length - 1}
                        onClick={() => handleMoveDown(idx)}
                        className="p-1.5 rounded-lg bg-gray-800 hover:bg-purple-900 disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 hover:text-white"
                        title="Bajar en el orden"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(anime.malId)}
                        className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-800 text-rose-300 hover:text-white ml-0.5"
                        title="Quitar de esta carpeta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-gray-500 italic bg-slate-900/60 rounded-2xl border border-gray-800">
                La carpeta no contiene animes. Usa el buscador de arriba para agregar ítems.
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-950 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

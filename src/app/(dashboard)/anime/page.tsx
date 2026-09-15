"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import AnimeDetailModal from "@/components/common/AnimeDetailModal";
import {
  MOCK_TOP_ANIMES,
  MOCK_STUDIOS,
  ExtendedAnime,
} from "@/core/services/catalog-data";
import {
  Search,
  Star,
  Plus,
  Check,
  Send,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Award,
  Building2,
  Tv,
} from "lucide-react";

function TopAnimesContent() {
  const searchParams = useSearchParams();
  const initialStudio = searchParams.get("studio") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [query, setQuery] = useState(initialSearch);
  const [suggestions, setSuggestions] = useState<ExtendedAnime[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filters
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedStudio, setSelectedStudio] = useState<string>(initialStudio);
  const [minScore, setMinScore] = useState<number>(0);
  const [friendWatchedFilter, setFriendWatchedFilter] = useState<"all" | "watched" | "not_watched">("all");
  const [sortBy, setSortBy] = useState<"score" | "name" | "rank">("score");

  // Displayed Animes State - Defaults to Top 50 Animes
  const [displayedAnimes, setDisplayedAnimes] = useState<ExtendedAnime[]>(MOCK_TOP_ANIMES);

  // Pagination (Max 50 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 50;

  // Selected Anime for Modal Inspector
  const [selectedAnimeModal, setSelectedAnimeModal] = useState<ExtendedAnime | null>(null);
  const [addedMap, setAddedMap] = useState<Record<number, boolean>>({});

  const searchContainerRef = useRef<HTMLFormElement>(null);

  // Synchronize when searchParams change
  useEffect(() => {
    const sParam = searchParams.get("search");
    const stParam = searchParams.get("studio");
    if (sParam !== null || stParam !== null) {
      if (sParam) setQuery(sParam);
      if (stParam) setSelectedStudio(stParam);
      filterAndSort(sParam || query, stParam || selectedStudio, selectedGenre, minScore, friendWatchedFilter, sortBy);
    }
  }, [searchParams]);

  // Autocomplete Live (Suggestions dropdown as user types)
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length > 0) {
      const matches = MOCK_TOP_ANIMES.filter(
        (a) =>
          a.title.toLowerCase().includes(trimmed) ||
          (a.titleEnglish && a.titleEnglish.toLowerCase().includes(trimmed)) ||
          a.studio.toLowerCase().includes(trimmed)
      );
      setSuggestions(matches.slice(0, 8));
      setIsDropdownOpen(true);
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  }, [query]);

  // Click outside listener for suggestions dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter & Sort Logic
  const filterAndSort = (
    searchTerm = query,
    studioTerm = selectedStudio,
    genreTerm = selectedGenre,
    scoreTerm = minScore,
    friendTerm = friendWatchedFilter,
    sortTerm = sortBy
  ) => {
    const term = searchTerm.trim().toLowerCase();

    let results = MOCK_TOP_ANIMES.filter((anime) => {
      // Text match
      const matchesText =
        !term ||
        anime.title.toLowerCase().includes(term) ||
        (anime.titleEnglish && anime.titleEnglish.toLowerCase().includes(term)) ||
        anime.studio.toLowerCase().includes(term);

      // Studio filter
      const matchesStudio = studioTerm === "all" || anime.studio.toLowerCase() === studioTerm.toLowerCase();

      // Genre filter
      const matchesGenre = genreTerm === "all" || anime.genres.includes(genreTerm);

      // Min Score filter
      const matchesScore = scoreTerm === 0 || anime.score >= scoreTerm;

      // Friends Watched filter
      const hasWatched = anime.watchedByFriends && anime.watchedByFriends.length > 0;
      const matchesFriend =
        friendTerm === "all" ||
        (friendTerm === "watched" && hasWatched) ||
        (friendTerm === "not_watched" && !hasWatched);

      return matchesText && matchesStudio && matchesGenre && matchesScore && matchesFriend;
    });

    // Sorting
    if (sortTerm === "score") {
      results.sort((a, b) => b.score - a.score);
    } else if (sortTerm === "rank") {
      results.sort((a, b) => a.rank - b.rank);
    } else if (sortTerm === "name") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    }

    setDisplayedAnimes(results);
    setCurrentPage(1);
    setIsDropdownOpen(false);
  };

  const handleFormSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    filterAndSort();
  };

  const handleSelectSuggestion = (anime: ExtendedAnime) => {
    setQuery(anime.title);
    filterAndSort(anime.title);
  };

  const handleResetSearch = () => {
    setQuery("");
    setSelectedGenre("all");
    setSelectedStudio("all");
    setMinScore(0);
    setFriendWatchedFilter("all");
    setSortBy("score");
    setDisplayedAnimes(MOCK_TOP_ANIMES);
    setIsDropdownOpen(false);
  };

  const handleAddToListQuick = (e: React.MouseEvent, malId: number) => {
    e.stopPropagation();
    setAddedMap((prev) => ({ ...prev, [malId]: true }));
  };

  // Pagination Math
  const totalResults = displayedAnimes.length;
  const totalPages = Math.ceil(totalResults / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedResults = displayedAnimes.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500 bg-transparent">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        {/* Top Header Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 text-center max-w-4xl mx-auto space-y-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-950/80 text-amber-300 border border-amber-700/50 mb-2">
              <Award className="w-3.5 h-3.5" /> Ranking Mundial MyAnimeList
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              Top Animes <Sparkles className="w-7 h-7 text-amber-400" />
            </h1>
            <p className="text-xs text-gray-400 max-w-xl mx-auto mt-1">
              Explora los 50 animes más aclamados de la historia. Haz clic en cualquier tarjeta para ver su perfil completo, sinopsis y amigos que lo han visto.
            </p>
          </div>

          {/* 1. BARRA MULTI-FILTROS (POR ENCIMA DEL BUSCADOR) */}
          <div className="bg-gray-900/80 p-4 rounded-2xl border border-gray-800 text-left space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Filtro Estudio */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Estudio
                </label>
                <select
                  value={selectedStudio}
                  onChange={(e) => {
                    setSelectedStudio(e.target.value);
                    filterAndSort(query, e.target.value);
                  }}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="all">Todos los Estudios</option>
                  {MOCK_STUDIOS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro Género */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Género
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => {
                    setSelectedGenre(e.target.value);
                    filterAndSort(query, selectedStudio, e.target.value);
                  }}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="all">Todos los Géneros</option>
                  <option value="Sci-Fi">Sci-Fi & Ciencia Ficción</option>
                  <option value="Fantasía">Fantasía & Isekai</option>
                  <option value="Acción">Acción & Aventura</option>
                  <option value="Suspenso">Suspenso & Psicológico</option>
                  <option value="Misterio">Misterio</option>
                  <option value="Cyberpunk">Cyberpunk</option>
                  <option value="Drama">Drama</option>
                  <option value="Slice of Life">Slice of Life & Comedia</option>
                </select>
              </div>

              {/* Filtro Nota Mínima */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Nota Mínima
                </label>
                <select
                  value={minScore}
                  onChange={(e) => {
                    const score = Number(e.target.value);
                    setMinScore(score);
                    filterAndSort(query, selectedStudio, selectedGenre, score);
                  }}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value={0}>Todas las notas</option>
                  <option value={8.5}>★ 8.5 o mayor</option>
                  <option value={8.8}>★ 8.8 o mayor</option>
                  <option value={9.0}>★ 9.0 o mayor</option>
                </select>
              </div>

              {/* Actividad Amigos */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Actividad Amigos
                </label>
                <select
                  value={friendWatchedFilter}
                  onChange={(e) => {
                    const f = e.target.value as any;
                    setFriendWatchedFilter(f);
                    filterAndSort(query, selectedStudio, selectedGenre, minScore, f);
                  }}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="all">Todos los animes</option>
                  <option value="watched">👥 Vistos por mis amigos</option>
                  <option value="not_watched">✨ No vistos por amigos</option>
                </select>
              </div>

              {/* Ordenar por */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Ordenar Por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    const s = e.target.value as any;
                    setSortBy(s);
                    filterAndSort(query, selectedStudio, selectedGenre, minScore, friendWatchedFilter, s);
                  }}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="score">Puntuación MAL</option>
                  <option value="rank">Ranking (#1 - #50)</option>
                  <option value="name">Nombre A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. BARRA DE BÚSQUEDA (CON DESPLEGABLE FLOTANTE 100% SÓLIDO POR DEBAJO) */}
          <form ref={searchContainerRef} onSubmit={handleFormSearchSubmit} className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por título de anime, estudio..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-slate-900 text-white placeholder-gray-400 pl-11 pr-4 py-3 rounded-2xl border border-purple-500/30 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm shadow-inner"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-2xl transition-all shadow-lg shadow-purple-900/40 shrink-0"
              >
                Buscar
              </button>

              {(query || selectedGenre !== "all" || selectedStudio !== "all" || minScore !== 0 || friendWatchedFilter !== "all") && (
                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Restablecer
                </button>
              )}
            </div>

            {/* FLOATING AUTOCOMPLETE DROPDOWN - 100% SOLID OPAQUE bg-[#0F172A] */}
            {isDropdownOpen && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-[#0F172A] border border-purple-500/50 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-gray-800/80 text-left">
                <div className="px-4 py-2 bg-slate-900/90 text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Sugerencias en tiempo real</span>
                  <span className="text-gray-500">Selecciona para filtrar</span>
                </div>
                {suggestions.map((item) => (
                  <div
                    key={item.malId}
                    onClick={() => handleSelectSuggestion(item)}
                    className="p-3 hover:bg-slate-800 flex items-center gap-3 cursor-pointer transition-colors group"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-10 h-14 object-cover rounded-lg border border-gray-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-xs font-bold text-white group-hover:text-purple-300 truncate">
                          {item.title}
                        </h4>
                        <span className="text-[10px] font-extrabold text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800/60 shrink-0 flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-400" /> {item.score}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400">
                        {item.studio} • {item.episodes} eps • {item.genres.join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Results Info & Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-800 pb-4">
          <p className="text-xs text-gray-400 font-medium">
            Mostrando <span className="text-white font-bold">{paginatedResults.length}</span> de{" "}
            <span className="text-purple-400 font-bold">{totalResults}</span> animes clasificados
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-xs font-semibold text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 hover:text-white transition-all flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
              <span className="text-xs font-bold text-gray-400 px-2">
                Página {currentPage} de {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-xs font-semibold text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 hover:text-white transition-all flex items-center gap-1"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Grid de Top Animes (50 ítems por página) */}
        {paginatedResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {paginatedResults.map((anime) => {
              const isAdded = addedMap[anime.malId];
              return (
                <div
                  key={anime.malId}
                  onClick={() => setSelectedAnimeModal(anime)}
                  className="glass-card rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] flex flex-col group cursor-pointer shadow-lg hover:shadow-purple-950/40 relative"
                >
                  {/* Rank Badge */}
                  <div className="absolute top-2 left-2 z-10 bg-black/80 backdrop-blur-md text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-lg border border-amber-500/40 flex items-center gap-1 shadow-lg">
                    <Award className="w-3 h-3 text-amber-400" /> #{anime.rank}
                  </div>

                  {/* Poster Image */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-900">
                    <img
                      src={anime.imageUrl}
                      alt={anime.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Score Badge */}
                    <div className="absolute bottom-2 right-2 bg-slate-950/90 text-amber-300 px-2 py-1 rounded-lg border border-amber-800/60 font-extrabold text-xs flex items-center gap-1 shadow-lg">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {anime.score}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-purple-300 line-clamp-1 transition-colors">
                        {anime.title}
                      </h3>
                      <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-purple-400" /> {anime.studio}
                      </p>
                    </div>

                    <p className="text-[10px] text-gray-500 line-clamp-2 italic">
                      "{anime.synopsis}"
                    </p>

                    {/* Watched by Friends Badge */}
                    {anime.watchedByFriends && anime.watchedByFriends.length > 0 && (
                      <div className="bg-purple-950/40 border border-purple-800/40 px-2 py-1 rounded-lg text-[10px] text-purple-300 flex items-center gap-1 truncate">
                        <Users className="w-3 h-3 text-purple-400 shrink-0" />
                        <span className="truncate">{anime.watchedByFriends.join(", ")}</span>
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={(e) => handleAddToListQuick(e, anime.malId)}
                      className={`w-full mt-2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isAdded
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-700/60"
                          : "bg-purple-900/40 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-700/50"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> En tu lista
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" /> Agregar a Lista
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-3xl border border-gray-800 text-center space-y-3 max-w-md mx-auto">
            <p className="text-gray-400 text-sm">No se encontraron animes con los filtros seleccionados.</p>
            <button
              onClick={handleResetSearch}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-500 transition-all"
            >
              Restablecer Filtros
            </button>
          </div>
        )}
      </main>

      {/* Anime Profile Modal Inspector */}
      {selectedAnimeModal && (
        <AnimeDetailModal
          anime={selectedAnimeModal}
          onClose={() => setSelectedAnimeModal(null)}
        />
      )}
    </div>
  );
}

export default function TopAnimesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-white">Cargando Top Animes...</div>}>
      <TopAnimesContent />
    </Suspense>
  );
}

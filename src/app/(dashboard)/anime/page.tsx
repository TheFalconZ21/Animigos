"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import AnimeDetailModal from "@/components/common/AnimeDetailModal";
import {
  MOCK_TOP_ANIMES,
  MOCK_STUDIOS,
  ExtendedAnime,
  AiringDay,
} from "@/core/services/catalog-data";
import {
  SeasonName,
  SEASONS_METADATA,
  DAYS_OF_WEEK,
  AVAILABLE_YEARS,
  getCurrentSeasonAndYear,
  getCurrentDayOfWeek,
  getPreviousSeason,
  getNextSeason,
  getSeasonalAnimes,
  groupAnimesByDay,
} from "@/core/services/seasonal.service";
import {
  Search,
  Star,
  Plus,
  Check,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Award,
  Building2,
  Tv,
  Calendar as CalendarIcon,
  Clock,
  Layers,
  Flame,
} from "lucide-react";

function AnimesCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab = searchParams.get("tab") === "seasonal" ? "seasonal" : "top";
  const [activeTab, setActiveTab] = useState<"top" | "seasonal">(initialTab);

  // Synchronize tab state with URL query parameter
  const handleTabChange = (tab: "top" | "seasonal") => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/anime?${params.toString()}`, { scroll: false });
  };

  // -------------------------------------------------------------
  // STATE FOR "TOP ANIMES" VIEW
  // -------------------------------------------------------------
  const initialStudio = searchParams.get("studio") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [query, setQuery] = useState(initialSearch);
  const [suggestions, setSuggestions] = useState<ExtendedAnime[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filters for Top Animes
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedStudio, setSelectedStudio] = useState<string>(initialStudio);
  const [selectedSeason, setSelectedSeason] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [minScore, setMinScore] = useState<number>(0);
  const [friendWatchedFilter, setFriendWatchedFilter] = useState<"all" | "watched" | "not_watched">("all");
  const [sortBy, setSortBy] = useState<"score" | "name" | "rank">("score");

  // Displayed Animes State
  const [displayedAnimes, setDisplayedAnimes] = useState<ExtendedAnime[]>(MOCK_TOP_ANIMES);

  // Pagination (Max 50 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 50;

  // -------------------------------------------------------------
  // STATE FOR "DE TEMPORADA" (SEASONAL CALENDAR) VIEW
  // -------------------------------------------------------------
  const initialSeasonMeta = getCurrentSeasonAndYear();
  const [seasonalSeason, setSeasonalSeason] = useState<SeasonName>(initialSeasonMeta.season);
  const [seasonalYear, setSeasonalYear] = useState<number>(initialSeasonMeta.year);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<"all" | AiringDay>("all");
  const todayDay = getCurrentDayOfWeek();

  // Selected Anime for Modal Inspector & Added list tracking
  const [selectedAnimeModal, setSelectedAnimeModal] = useState<ExtendedAnime | null>(null);
  const [addedMap, setAddedMap] = useState<Record<number, boolean>>({});

  const searchContainerRef = useRef<HTMLFormElement>(null);

  // Synchronize when searchParams change from external nav
  useEffect(() => {
    const sParam = searchParams.get("search");
    const stParam = searchParams.get("studio");
    const tabParam = searchParams.get("tab");

    if (tabParam === "seasonal" || tabParam === "top") {
      setActiveTab(tabParam);
    }
    if (sParam !== null || stParam !== null) {
      if (sParam) setQuery(sParam);
      if (stParam) setSelectedStudio(stParam);
      filterAndSort(
        sParam || query,
        stParam || selectedStudio,
        selectedGenre,
        selectedSeason,
        selectedYear,
        minScore,
        friendWatchedFilter,
        sortBy
      );
    }
  }, [searchParams]);

  // Autocomplete Live (Suggestions dropdown as user types in Top Animes)
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

  // Filter & Sort Logic for Top Animes
  const filterAndSort = (
    searchTerm = query,
    studioTerm = selectedStudio,
    genreTerm = selectedGenre,
    seasonTerm = selectedSeason,
    yearTerm = selectedYear,
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

      // Season filter (Invierno, Primavera, Verano, Otoño)
      const matchesSeason =
        seasonTerm === "all" ||
        (anime.season && anime.season.toLowerCase() === seasonTerm.toLowerCase());

      // Year filter
      const matchesYear = yearTerm === "all" || anime.year === Number(yearTerm);

      // Min Score filter
      const matchesScore = scoreTerm === 0 || anime.score >= scoreTerm;

      // Friends Watched filter
      const hasWatched = anime.watchedByFriends && anime.watchedByFriends.length > 0;
      const matchesFriend =
        friendTerm === "all" ||
        (friendTerm === "watched" && hasWatched) ||
        (friendTerm === "not_watched" && !hasWatched);

      return (
        matchesText &&
        matchesStudio &&
        matchesGenre &&
        matchesSeason &&
        matchesYear &&
        matchesScore &&
        matchesFriend
      );
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
    setSelectedSeason("all");
    setSelectedYear("all");
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

  // Seasonal Navigation Handlers
  const handlePreviousSeason = () => {
    const prev = getPreviousSeason(seasonalYear, seasonalSeason);
    setSeasonalYear(prev.year);
    setSeasonalSeason(prev.season);
  };

  const handleNextSeason = () => {
    const next = getNextSeason(seasonalYear, seasonalSeason);
    setSeasonalYear(next.year);
    setSeasonalSeason(next.season);
  };

  // Seasonal data calculation
  const seasonalAnimes = getSeasonalAnimes(seasonalYear, seasonalSeason);
  const groupedSeasonalByDay = groupAnimesByDay(seasonalAnimes);

  // Pagination Math for Top Animes
  const totalResults = displayedAnimes.length;
  const totalPages = Math.ceil(totalResults / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedResults = displayedAnimes.slice(startIndex, startIndex + PAGE_SIZE);

  // Extract distinct years from catalog for filter dropdown
  const topCatalogYears = Array.from(
    new Set(MOCK_TOP_ANIMES.map((a) => a.year).filter(Boolean) as number[])
  ).sort((a, b) => b - a);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500 bg-transparent">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        {/* ========================================================================= */}
        {/* HEADER PRINCIPAL CON SWITCH DE VISTAS (TOP ANIMES VS DE TEMPORADA) */}
        {/* ========================================================================= */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 text-center max-w-5xl mx-auto space-y-6 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 blur-3xl -z-10" />

          <div className="flex flex-col items-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-purple-950/80 text-purple-300 border border-purple-700/50 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Catálogo Maestro de Animes
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight flex items-center justify-center gap-3">
              Animes <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-pink-400 to-purple-400">Animigos</span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto">
              Descubre los estrenos semanales organizados por día o explora el ranking histórico de los títulos más aclamados por la comunidad.
            </p>

            {/* SWITCH PROMINENTE: "TOP ANIMES" VS "DE TEMPORADA" */}
            <div className="pt-2">
              <div className="inline-flex p-1.5 bg-gray-950/90 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl">
                <button
                  type="button"
                  onClick={() => handleTabChange("top")}
                  className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                    activeTab === "top"
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-900/40 scale-[1.02]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  Top Animes
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange("seasonal")}
                  className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                    activeTab === "seasonal"
                      ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white shadow-lg shadow-purple-900/40 scale-[1.02]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <CalendarIcon className="w-4 h-4 text-purple-300" />
                  De Temporada (Calendario)
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* PANEL DE FILTROS PARA "TOP ANIMES" */}
          {/* ========================================================================= */}
          {activeTab === "top" && (
            <div className="space-y-4 pt-2">
              <div className="bg-gray-900/80 p-4 sm:p-5 rounded-2xl border border-gray-800 text-left space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-800/80 pb-2.5">
                  <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-purple-400" /> Filtros Avanzados
                  </span>
                  {(query ||
                    selectedGenre !== "all" ||
                    selectedStudio !== "all" ||
                    selectedSeason !== "all" ||
                    selectedYear !== "all" ||
                    minScore !== 0 ||
                    friendWatchedFilter !== "all") && (
                    <button
                      type="button"
                      onClick={handleResetSearch}
                      className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Restablecer filtros
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {/* 1. Filtro Estudio */}
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
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="all">Todos los Estudios</option>
                      {MOCK_STUDIOS.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Filtro Género */}
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
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
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
                      <option value="Romance">Romance</option>
                      <option value="Deportes">Deportes</option>
                    </select>
                  </div>

                  {/* 3. Filtro Temporada (Season) */}
                  <div>
                    <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <span>Temporada</span>
                    </label>
                    <select
                      value={selectedSeason}
                      onChange={(e) => {
                        const s = e.target.value;
                        setSelectedSeason(s);
                        filterAndSort(
                          query,
                          selectedStudio,
                          selectedGenre,
                          s,
                          selectedYear,
                          minScore,
                          friendWatchedFilter,
                          sortBy
                        );
                      }}
                      className="w-full bg-gray-950 border border-amber-500/50 rounded-xl px-2.5 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-400 transition-colors font-medium"
                    >
                      <option value="all">Todas las Temporadas</option>
                      <option value="Invierno">❄️ Invierno (Winter)</option>
                      <option value="Primavera">🌸 Primavera (Spring)</option>
                      <option value="Verano">☀️ Verano (Summer)</option>
                      <option value="Otoño">🍁 Otoño (Fall)</option>
                    </select>
                  </div>

                  {/* 4. Filtro Año de Emisión */}
                  <div>
                    <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <span>Año</span>
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        const y = e.target.value;
                        setSelectedYear(y);
                        filterAndSort(
                          query,
                          selectedStudio,
                          selectedGenre,
                          selectedSeason,
                          y,
                          minScore,
                          friendWatchedFilter,
                          sortBy
                        );
                      }}
                      className="w-full bg-gray-950 border border-amber-500/50 rounded-xl px-2.5 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-400 transition-colors font-medium"
                    >
                      <option value="all">Todos los Años</option>
                      {topCatalogYears.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 5. Filtro Nota Mínima */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Nota Mínima
                    </label>
                    <select
                      value={minScore}
                      onChange={(e) => {
                        const score = Number(e.target.value);
                        setMinScore(score);
                        filterAndSort(
                          query,
                          selectedStudio,
                          selectedGenre,
                          selectedSeason,
                          selectedYear,
                          score,
                          friendWatchedFilter,
                          sortBy
                        );
                      }}
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value={0}>Todas las notas</option>
                      <option value={8.5}>★ 8.5 o mayor</option>
                      <option value={8.8}>★ 8.8 o mayor</option>
                      <option value={9.0}>★ 9.0 o mayor</option>
                    </select>
                  </div>

                  {/* 6. Ordenar Por */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Ordenar Por
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        const s = e.target.value as any;
                        setSortBy(s);
                        filterAndSort(
                          query,
                          selectedStudio,
                          selectedGenre,
                          selectedSeason,
                          selectedYear,
                          minScore,
                          friendWatchedFilter,
                          s
                        );
                      }}
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="score">Puntuación MAL</option>
                      <option value="rank">Ranking (#1 - #50)</option>
                      <option value="name">Nombre A-Z</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Barra de Búsqueda con Autocompletado Flotante */}
              <form ref={searchContainerRef} onSubmit={handleFormSearchSubmit} className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar en Top Animes por título, estudio..."
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
                </div>

                {/* Dropdown flotante de sugerencias */}
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
                            {item.studio} • {item.season || "Temporada"} {item.year || ""} • {item.genres.join(", ")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* BARRA DE NAVEGACIÓN Y SELECTOR SUPERIOR PARA "DE TEMPORADA" */}
          {/* ========================================================================= */}
          {activeTab === "seasonal" && (
            <div className="space-y-4 pt-2">
              <div className="bg-gray-900/90 p-4 sm:p-5 rounded-2xl border border-purple-500/30 text-center space-y-4 shadow-xl">
                {/* Controles de Selección de Temporada y Año */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Botón Temporada Anterior */}
                  <button
                    type="button"
                    onClick={handlePreviousSeason}
                    className="px-3.5 py-2 rounded-xl bg-gray-950 border border-gray-700 hover:border-purple-400 text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1.5 transition-all shadow-md group"
                  >
                    <ChevronLeft className="w-4 h-4 text-purple-400 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Temporada Anterior</span>
                  </button>

                  {/* Pills de Selección Rápida de Estación */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 bg-black/50 p-1 rounded-xl border border-gray-800">
                    {SEASONS_METADATA.map((s) => {
                      const isSelected = seasonalSeason === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSeasonalSeason(s.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <span>{s.icon}</span>
                          <span>{s.label}</span>
                          <span className="text-[10px] opacity-70 hidden sm:inline">({s.months})</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selector de Año */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 font-semibold hidden sm:inline">Año:</label>
                    <select
                      value={seasonalYear}
                      onChange={(e) => setSeasonalYear(Number(e.target.value))}
                      className="bg-gray-950 border border-purple-500/40 rounded-xl px-3 py-2 text-xs font-bold text-purple-300 focus:outline-none focus:border-purple-400 shadow-md"
                    >
                      {AVAILABLE_YEARS.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>

                    {/* Botón Temporada Siguiente */}
                    <button
                      type="button"
                      onClick={handleNextSeason}
                      className="px-3.5 py-2 rounded-xl bg-gray-950 border border-gray-700 hover:border-purple-400 text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1.5 transition-all shadow-md group"
                    >
                      <span>Siguiente</span>
                      <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Subtítulo informativo */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Estás viendo:</span>
                    <span className="font-extrabold text-white bg-purple-950 px-2.5 py-0.5 rounded-lg border border-purple-800/50 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" /> {seasonalSeason} {seasonalYear}
                    </span>
                    <span className="text-purple-300 font-bold">({seasonalAnimes.length} animes en catálogo)</span>
                  </div>

                  {/* Filtro Rápido de Días */}
                  <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
                    <button
                      type="button"
                      onClick={() => setSelectedCalendarDay("all")}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                        selectedCalendarDay === "all"
                          ? "bg-purple-600 text-white"
                          : "text-gray-400 hover:text-white bg-gray-950/60"
                      }`}
                    >
                      Semana Completa
                    </button>
                    {DAYS_OF_WEEK.map((day) => {
                      const isSelected = selectedCalendarDay === day.key;
                      const isToday = day.key === todayDay;
                      const count = groupedSeasonalByDay[day.key]?.length || 0;
                      return (
                        <button
                          key={day.key}
                          type="button"
                          onClick={() => setSelectedCalendarDay(day.key)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                            isSelected
                              ? "bg-purple-600 text-white"
                              : isToday
                              ? "bg-amber-950/80 text-amber-300 border border-amber-700/50"
                              : "text-gray-400 hover:text-white bg-gray-950/60"
                          }`}
                        >
                          <span>{day.short}</span>
                          <span className="text-[9px] opacity-70">({count})</span>
                          {isToday && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* RENDERIZADO: VISTA "TOP ANIMES" */}
        {/* ========================================================================= */}
        {activeTab === "top" && (
          <div className="space-y-6">
            {/* Info de Resultados y Paginación */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-800 pb-4">
              <p className="text-xs text-gray-400 font-medium">
                Mostrando <span className="text-white font-bold">{paginatedResults.length}</span> de{" "}
                <span className="text-purple-400 font-bold">{totalResults}</span> animes clasificados
                {selectedSeason !== "all" && (
                  <span className="ml-2 text-amber-300 font-bold">• Temporada {selectedSeason}</span>
                )}
                {selectedYear !== "all" && (
                  <span className="ml-1 text-amber-300 font-bold">({selectedYear})</span>
                )}
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

                      {/* Season & Year Badge */}
                      {anime.season && anime.year && (
                        <div className="absolute top-2 right-2 z-10 bg-black/80 backdrop-blur-md text-slate-300 text-[9px] font-bold px-2 py-0.5 rounded-md border border-white/10 shadow-lg">
                          {anime.season} {anime.year}
                        </div>
                      )}

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
          </div>
        )}

        {/* ========================================================================= */}
        {/* RENDERIZADO: VISTA "DE TEMPORADA" (CALENDARIO SEMANAL POR DÍA) */}
        {/* ========================================================================= */}
        {activeTab === "seasonal" && (
          <div className="space-y-8">
            {/* Si se seleccionó "Semana Completa", mostramos las 7 columnas del calendario */}
            {selectedCalendarDay === "all" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 items-start">
                {DAYS_OF_WEEK.map((day) => {
                  const dayAnimes = groupedSeasonalByDay[day.key] || [];
                  const isToday = day.key === todayDay;

                  return (
                    <div
                      key={day.key}
                      className={`glass-panel rounded-2xl border flex flex-col transition-all overflow-hidden ${
                        isToday
                          ? "border-amber-500/60 bg-amber-950/10 shadow-xl shadow-amber-950/20 ring-1 ring-amber-500/40"
                          : "border-gray-800/80 bg-gray-950/40 hover:border-gray-700"
                      }`}
                    >
                      {/* Encabezado del Día */}
                      <div
                        className={`p-3.5 border-b flex items-center justify-between ${
                          isToday
                            ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-200"
                            : "bg-gray-900/80 border-gray-800 text-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-sm capitalize">{day.label}</span>
                          {isToday && (
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-400 text-black uppercase tracking-wider">
                              Hoy
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-800/40">
                          {dayAnimes.length}
                        </span>
                      </div>

                      {/* Lista de Animes del Día */}
                      <div className="p-2.5 space-y-3">
                        {dayAnimes.length > 0 ? (
                          dayAnimes.map((anime) => {
                            const isAdded = addedMap[anime.malId];
                            return (
                              <div
                                key={anime.malId}
                                onClick={() => setSelectedAnimeModal(anime)}
                                className="group relative bg-gray-900/90 hover:bg-slate-800/90 rounded-xl border border-gray-800/80 hover:border-purple-500/50 p-2 transition-all duration-300 cursor-pointer shadow-md hover:shadow-purple-950/30 flex flex-col space-y-2"
                              >
                                {/* Broadcast Time Tag */}
                                <div className="flex items-center justify-between text-[10px] text-gray-400">
                                  <span className="flex items-center gap-1 text-purple-300 font-mono font-medium">
                                    <Clock className="w-3 h-3 text-purple-400" />
                                    {anime.broadcastTime || "23:00 JST"}
                                  </span>
                                  <span className="text-amber-400 font-bold flex items-center gap-0.5">
                                    <Star className="w-3 h-3 fill-amber-400" /> {anime.score}
                                  </span>
                                </div>

                                {/* Poster & Mini Title */}
                                <div className="flex gap-2.5">
                                  <div className="w-14 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-800 relative">
                                    <img
                                      src={anime.imageUrl}
                                      alt={anime.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                    <div>
                                      <h4 className="text-xs font-bold text-white group-hover:text-purple-300 line-clamp-2 transition-colors">
                                        {anime.title}
                                      </h4>
                                      <p className="text-[10px] text-gray-400 truncate mt-0.5">
                                        {anime.studio}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1 overflow-hidden">
                                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-800/30 text-purple-300 truncate">
                                        {anime.genres[0] || "Anime"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Friends Tag (if any) */}
                                {anime.watchedByFriends && anime.watchedByFriends.length > 0 && (
                                  <div className="text-[9px] text-purple-300 bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-800/30 truncate flex items-center gap-1">
                                    <Users className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                                    <span className="truncate">{anime.watchedByFriends[0]}</span>
                                  </div>
                                )}

                                {/* Quick Add Button */}
                                <button
                                  type="button"
                                  onClick={(e) => handleAddToListQuick(e, anime.malId)}
                                  className={`w-full py-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                                    isAdded
                                      ? "bg-emerald-950 text-emerald-300 border border-emerald-700/50"
                                      : "bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white"
                                  }`}
                                >
                                  {isAdded ? (
                                    <>
                                      <Check className="w-2.5 h-2.5 text-emerald-400" /> Añadido
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-2.5 h-2.5" /> Mi Lista
                                    </>
                                  )}
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <div className="py-8 text-center text-gray-500 text-xs italic">
                            Sin emisiones registradas
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Vista focalizada de un solo día seleccionado */
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-900/80 p-4 rounded-2xl border border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white capitalize">
                      Emisiones del {DAYS_OF_WEEK.find((d) => d.key === selectedCalendarDay)?.label}
                    </span>
                    {selectedCalendarDay === todayDay && (
                      <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-400 text-black uppercase">
                        Hoy
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCalendarDay("all")}
                    className="text-xs text-purple-400 hover:text-purple-300 font-bold"
                  >
                    Ver Semana Completa →
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {(groupedSeasonalByDay[selectedCalendarDay] || []).map((anime) => {
                    const isAdded = addedMap[anime.malId];
                    return (
                      <div
                        key={anime.malId}
                        onClick={() => setSelectedAnimeModal(anime)}
                        className="glass-card rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] flex flex-col group cursor-pointer shadow-lg hover:shadow-purple-950/40 relative"
                      >
                        {/* Broadcast Time Badge */}
                        <div className="absolute top-2 left-2 z-10 bg-black/80 backdrop-blur-md text-purple-300 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-purple-500/40 flex items-center gap-1 shadow-lg font-mono">
                          <Clock className="w-3 h-3 text-purple-400" /> {anime.broadcastTime || "23:00 JST"}
                        </div>

                        {/* Poster Image */}
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-900">
                          <img
                            src={anime.imageUrl}
                            alt={anime.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute bottom-2 right-2 bg-slate-950/90 text-amber-300 px-2 py-1 rounded-lg border border-amber-800/60 font-extrabold text-xs flex items-center gap-1 shadow-lg">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {anime.score}
                          </div>
                        </div>

                        {/* Details */}
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
              </div>
            )}
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

export default function AnimesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-white">
          Cargando Catálogo de Animes...
        </div>
      }
    >
      <AnimesCatalogContent />
    </Suspense>
  );
}

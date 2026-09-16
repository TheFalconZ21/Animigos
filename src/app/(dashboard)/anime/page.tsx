"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import AnimeDetailModal from "@/components/common/AnimeDetailModal";
import { useTheme } from "@/core/contexts/ThemeContext";
import {
  MOCK_TOP_ANIMES,
  MOCK_STUDIOS,
  ExtendedAnime,
  AiringDay,
} from "@/core/services/catalog-data";
import {
  SeasonName,
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
  ChevronDown,
  RotateCcw,
  Sparkles,
  Award,
  Building2,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";

function AnimesCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

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

  // Autocomplete Live for Top Animes
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

      // Season filter
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10">
        {/* ========================================================================= */}
        {/* SWITCH SUPERIOR: "TOP ANIMES" VS "DE TEMPORADA" (ADAPTABLE AL TEMA) */}
        {/* ========================================================================= */}
        <div className="flex justify-center">
          <div
            className="inline-flex p-1.5 rounded-2xl border backdrop-blur-xl shadow-xl transition-all"
            style={{
              backgroundColor: "rgba(10, 15, 25, 0.75)",
              borderColor: `rgba(${theme.primaryRgb}, 0.25)`,
            }}
          >
            <button
              type="button"
              onClick={() => handleTabChange("top")}
              className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300"
              style={{
                background:
                  activeTab === "top"
                    ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                    : "transparent",
                color: activeTab === "top" ? "#ffffff" : "#9ca3af",
                boxShadow:
                  activeTab === "top"
                    ? `0 4px 20px rgba(${theme.primaryRgb}, 0.35)`
                    : "none",
              }}
            >
              <Award className="w-4 h-4" />
              Top Animes
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("seasonal")}
              className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300"
              style={{
                background:
                  activeTab === "seasonal"
                    ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                    : "transparent",
                color: activeTab === "seasonal" ? "#ffffff" : "#9ca3af",
                boxShadow:
                  activeTab === "seasonal"
                    ? `0 4px 20px rgba(${theme.primaryRgb}, 0.35)`
                    : "none",
              }}
            >
              <CalendarIcon className="w-4 h-4" />
              De Temporada (Calendario)
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VISTA: "DE TEMPORADA" (CALENDARIO MINIMALISTA SEGÚN BOCETO PAINT) */}
        {/* ========================================================================= */}
        {activeTab === "seasonal" && (
          <div className="space-y-5">
            {/* CARD SUPERIOR LIMPIA CON SELECTORES DE AÑO, TEMPORADA Y FLECHAS */}
            <div
              className="p-4 sm:p-5 rounded-3xl border backdrop-blur-xl flex items-center justify-between gap-4 max-w-lg mx-auto shadow-2xl transition-all"
              style={{
                backgroundColor: "var(--theme-card-bg, rgba(15, 23, 42, 0.65))",
                borderColor: `rgba(${theme.primaryRgb}, 0.35)`,
                boxShadow: `0 8px 30px rgba(0, 0, 0, 0.4), 0 0 25px rgba(${theme.primaryRgb}, 0.12)`,
              }}
            >
              {/* Flecha Izquierda (Temporada Anterior) */}
              <button
                type="button"
                onClick={handlePreviousSeason}
                title="Temporada anterior"
                className="p-3 rounded-2xl border border-white/10 hover:border-white/30 bg-black/40 text-white hover:scale-110 active:scale-95 transition-all shadow-md group"
                style={{ color: theme.primaryColor }}
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              {/* Centro: Input de Año y Selector de Temporada */}
              <div className="flex flex-col items-center gap-2">
                {/* Input de Año Directo con Lista Datalist */}
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={seasonalYear}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) setSeasonalYear(val);
                    }}
                    min={1970}
                    max={2035}
                    list="seasonal-years-datalist"
                    className="w-28 text-center font-black text-xl py-1 px-3 rounded-xl border bg-black/60 text-white focus:outline-none transition-all shadow-inner"
                    style={{
                      borderColor: `rgba(${theme.primaryRgb}, 0.45)`,
                      color: "white",
                    }}
                  />
                  <datalist id="seasonal-years-datalist">
                    {AVAILABLE_YEARS.map((yr) => (
                      <option key={yr} value={yr} />
                    ))}
                  </datalist>
                </div>

                {/* Selector de Temporada (4 Opciones) */}
                <div className="relative">
                  <select
                    value={seasonalSeason}
                    onChange={(e) => setSeasonalSeason(e.target.value as SeasonName)}
                    className="appearance-none font-bold text-xs py-1.5 pl-4 pr-8 rounded-xl border bg-black/70 cursor-pointer focus:outline-none transition-all shadow-md"
                    style={{
                      borderColor: `rgba(${theme.primaryRgb}, 0.5)`,
                      background: `linear-gradient(135deg, rgba(${theme.primaryRgb}, 0.25), rgba(${theme.primaryRgb}, 0.1))`,
                      color: theme.primaryColor,
                    }}
                  >
                    <option value="Invierno" className="bg-[#0f172a] text-white">❄️ Invierno</option>
                    <option value="Primavera" className="bg-[#0f172a] text-white">🌸 Primavera</option>
                    <option value="Verano" className="bg-[#0f172a] text-white">☀️ Verano</option>
                    <option value="Otoño" className="bg-[#0f172a] text-white">🍁 Otoño</option>
                  </select>
                  <ChevronDown
                    className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-80"
                    style={{ color: theme.primaryColor }}
                  />
                </div>
              </div>

              {/* Flecha Derecha (Temporada Siguiente) */}
              <button
                type="button"
                onClick={handleNextSeason}
                title="Temporada siguiente"
                className="p-3 rounded-2xl border border-white/10 hover:border-white/30 bg-black/40 text-white hover:scale-110 active:scale-95 transition-all shadow-md group"
                style={{ color: theme.primaryColor }}
              >
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* ========================================================================= */}
            {/* HORARIO: UNA ÚNICA CARD INTEGRAL CON LOS 7 DÍAS DE LA SEMANA */}
            {/* ========================================================================= */}
            <div
              className="rounded-3xl border backdrop-blur-xl overflow-hidden shadow-2xl transition-all"
              style={{
                backgroundColor: "var(--theme-card-bg, rgba(11, 15, 23, 0.8))",
                borderColor: `rgba(${theme.primaryRgb}, 0.3)`,
                boxShadow: `0 10px 40px rgba(0, 0, 0, 0.4), 0 0 25px rgba(${theme.primaryRgb}, 0.1)`,
              }}
            >
              {/* Rejilla de 7 Días integrada en un solo contenedor visual */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                {DAYS_OF_WEEK.map((day) => {
                  const dayAnimes = groupedSeasonalByDay[day.key] || [];
                  const isToday = day.key === todayDay;

                  return (
                    <div
                      key={day.key}
                      className={`flex flex-col transition-colors ${
                        isToday ? "bg-white/[0.04]" : ""
                      }`}
                    >
                      {/* Cabecera del Día */}
                      <div
                        className="p-3 border-b border-white/10 flex items-center justify-between"
                        style={{
                          background: isToday
                            ? `linear-gradient(135deg, rgba(${theme.primaryRgb}, 0.25), rgba(${theme.primaryRgb}, 0.08))`
                            : "rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-white capitalize">{day.label}</span>
                          {isToday && (
                            <span
                              className="text-[9px] font-black px-1.5 py-0.2 rounded text-black uppercase tracking-wider"
                              style={{ backgroundColor: theme.primaryColor }}
                            >
                              Hoy
                            </span>
                          )}
                        </div>
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border"
                          style={{
                            backgroundColor: `rgba(${theme.primaryRgb}, 0.15)`,
                            color: theme.primaryColor,
                            borderColor: `rgba(${theme.primaryRgb}, 0.3)`,
                          }}
                        >
                          {dayAnimes.length}
                        </span>
                      </div>

                      {/* Lista de Animes del Día (Visualmente centrada en la Imagen) */}
                      <div className="p-2 space-y-2.5 flex-1">
                        {dayAnimes.length > 0 ? (
                          dayAnimes.map((anime) => {
                            const isAdded = addedMap[anime.malId];
                            return (
                              <div
                                key={anime.malId}
                                onClick={() => setSelectedAnimeModal(anime)}
                                className="group relative rounded-xl border p-2 flex flex-col space-y-1.5 cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-md"
                                style={{
                                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                                  borderColor: isToday
                                    ? `rgba(${theme.primaryRgb}, 0.35)`
                                    : "rgba(255, 255, 255, 0.08)",
                                }}
                              >
                                {/* Fila Superior: Nombre del anime (inicio) + Nota MAL */}
                                <div className="flex items-center justify-between gap-1">
                                  <h4
                                    className="text-[11px] font-bold text-white group-hover:underline truncate flex-1 transition-colors"
                                    title={anime.title}
                                    style={{ color: "white" }}
                                  >
                                    {anime.title}
                                  </h4>
                                  <span className="text-[10px] font-extrabold text-amber-400 flex items-center gap-0.5 shrink-0 bg-black/60 px-1.5 py-0.5 rounded border border-amber-500/30">
                                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                                    {anime.score}
                                  </span>
                                </div>

                                {/* Centro: Imagen Principal (El elemento protagonista) */}
                                <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-gray-900 border border-white/5">
                                  <img
                                    src={anime.imageUrl}
                                    alt={anime.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />

                                  {/* Horario de emisión discreto en la imagen */}
                                  {anime.broadcastTime && (
                                    <div className="absolute bottom-1.5 left-1.5 bg-black/85 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-mono text-white/90 border border-white/10 flex items-center gap-1 shadow">
                                      <Clock className="w-2.5 h-2.5 text-amber-400" />
                                      {anime.broadcastTime}
                                    </div>
                                  )}
                                </div>

                                {/* Botón Inferior: Añadir a Mi Lista */}
                                <button
                                  type="button"
                                  onClick={(e) => handleAddToListQuick(e, anime.malId)}
                                  className="w-full py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow border"
                                  style={{
                                    background: isAdded
                                      ? "rgba(16, 185, 129, 0.25)"
                                      : `linear-gradient(135deg, rgba(${theme.primaryRgb}, 0.3), rgba(${theme.primaryRgb}, 0.1))`,
                                    color: isAdded ? "#6ee7b7" : "white",
                                    borderColor: isAdded
                                      ? "rgba(16, 185, 129, 0.5)"
                                      : `rgba(${theme.primaryRgb}, 0.35)`,
                                  }}
                                >
                                  {isAdded ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" /> En tu lista
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3 h-3" style={{ color: theme.primaryColor }} /> Mi Lista
                                    </>
                                  )}
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <div className="py-12 text-center text-gray-500 text-[11px] italic">
                            Sin emisiones
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VISTA: "TOP ANIMES" (ADAPTABLE AL TEMA) */}
        {/* ========================================================================= */}
        {activeTab === "top" && (
          <div className="space-y-6">
            {/* Panel de Filtros y Búsqueda */}
            <div
              className="p-5 sm:p-6 rounded-3xl border backdrop-blur-xl space-y-4 shadow-xl transition-all"
              style={{
                backgroundColor: "var(--theme-card-bg, rgba(15, 23, 42, 0.65))",
                borderColor: `rgba(${theme.primaryRgb}, 0.3)`,
              }}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} />
                  Filtros de Catálogo
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
                    className="text-[11px] font-semibold flex items-center gap-1 transition-colors hover:underline"
                    style={{ color: theme.primaryColor }}
                  >
                    <RotateCcw className="w-3 h-3" /> Restablecer filtros
                  </button>
                )}
              </div>

              {/* Rejilla de Selectores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* 1. Estudio */}
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
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none transition-colors"
                  >
                    <option value="all">Todos los Estudios</option>
                    {MOCK_STUDIOS.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Género */}
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
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none transition-colors"
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

                {/* 3. Temporada */}
                <div>
                  <label
                    className="block text-[11px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: theme.primaryColor }}
                  >
                    Temporada
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
                    className="w-full bg-black/60 border rounded-xl px-2.5 py-2 text-xs focus:outline-none transition-colors font-medium"
                    style={{
                      borderColor: `rgba(${theme.primaryRgb}, 0.5)`,
                      color: theme.primaryColor,
                    }}
                  >
                    <option value="all">Todas las Temporadas</option>
                    <option value="Invierno">❄️ Invierno (Winter)</option>
                    <option value="Primavera">🌸 Primavera (Spring)</option>
                    <option value="Verano">☀️ Verano (Summer)</option>
                    <option value="Otoño">🍁 Otoño (Fall)</option>
                  </select>
                </div>

                {/* 4. Año */}
                <div>
                  <label
                    className="block text-[11px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: theme.primaryColor }}
                  >
                    Año
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
                    className="w-full bg-black/60 border rounded-xl px-2.5 py-2 text-xs focus:outline-none transition-colors font-medium"
                    style={{
                      borderColor: `rgba(${theme.primaryRgb}, 0.5)`,
                      color: theme.primaryColor,
                    }}
                  >
                    <option value="all">Todos los Años</option>
                    {topCatalogYears.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Nota Mínima */}
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
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none transition-colors"
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
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none transition-colors"
                  >
                    <option value="score">Puntuación MAL</option>
                    <option value="rank">Ranking (#1 - #50)</option>
                    <option value="name">Nombre A-Z</option>
                  </select>
                </div>
              </div>

              {/* Barra de Búsqueda Adaptable */}
              <form ref={searchContainerRef} onSubmit={handleFormSearchSubmit} className="relative pt-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search
                      className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: theme.primaryColor }}
                    />
                    <input
                      type="text"
                      placeholder="Buscar en Top Animes por título, estudio..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full bg-black/50 text-white placeholder-gray-400 pl-11 pr-4 py-3 rounded-2xl border text-sm shadow-inner focus:outline-none transition-all"
                      style={{
                        borderColor: `rgba(${theme.primaryRgb}, 0.3)`,
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 text-white font-bold text-xs rounded-2xl transition-all shadow-lg shrink-0 hover:brightness-110 active:scale-95"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                      boxShadow: `0 4px 20px rgba(${theme.primaryRgb}, 0.35)`,
                    }}
                  >
                    Buscar
                  </button>
                </div>

                {/* Dropdown flotante de sugerencias */}
                {isDropdownOpen && suggestions.length > 0 && (
                  <div
                    className="absolute left-0 right-0 mt-2 bg-[#0B0F17] border rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-gray-800 text-left"
                    style={{ borderColor: `rgba(${theme.primaryRgb}, 0.4)` }}
                  >
                    <div className="px-4 py-2 bg-black/60 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between" style={{ color: theme.primaryColor }}>
                      <span>Sugerencias en tiempo real</span>
                      <span className="text-gray-500">Selecciona para filtrar</span>
                    </div>
                    {suggestions.map((item) => (
                      <div
                        key={item.malId}
                        onClick={() => handleSelectSuggestion(item)}
                        className="p-3 hover:bg-white/5 flex items-center gap-3 cursor-pointer transition-colors group"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-10 h-14 object-cover rounded-lg border border-gray-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="text-xs font-bold text-white truncate">
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

            {/* Contador de Resultados y Paginación */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-3">
              <p className="text-xs text-gray-400 font-medium">
                Mostrando <span className="text-white font-bold">{paginatedResults.length}</span> de{" "}
                <span className="font-bold" style={{ color: theme.primaryColor }}>{totalResults}</span> animes clasificados
                {selectedSeason !== "all" && (
                  <span className="ml-2 font-bold" style={{ color: theme.primaryColor }}>• Temporada {selectedSeason}</span>
                )}
                {selectedYear !== "all" && (
                  <span className="ml-1 font-bold" style={{ color: theme.primaryColor }}>({selectedYear})</span>
                )}
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-semibold text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 hover:text-white transition-all flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Anterior
                  </button>
                  <span className="text-xs font-bold text-gray-400 px-2">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-semibold text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 hover:text-white transition-all flex items-center gap-1"
                  >
                    Siguiente <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Grid de Top Animes (50 por página) */}
            {paginatedResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {paginatedResults.map((anime) => {
                  const isAdded = addedMap[anime.malId];
                  return (
                    <div
                      key={anime.malId}
                      onClick={() => setSelectedAnimeModal(anime)}
                      className="rounded-2xl overflow-hidden border transition-all duration-300 hover:scale-[1.02] flex flex-col group cursor-pointer shadow-lg relative backdrop-blur-md"
                      style={{
                        backgroundColor: "var(--theme-card-bg, rgba(15, 23, 42, 0.6))",
                        borderColor: "rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      {/* Rank Badge */}
                      <div className="absolute top-2 left-2 z-10 bg-black/80 backdrop-blur-md text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-lg border border-amber-500/40 flex items-center gap-1 shadow">
                        <Award className="w-3 h-3 text-amber-400" /> #{anime.rank}
                      </div>

                      {/* Season & Year Badge */}
                      {anime.season && anime.year && (
                        <div className="absolute top-2 right-2 z-10 bg-black/80 backdrop-blur-md text-slate-300 text-[9px] font-bold px-2 py-0.5 rounded-md border border-white/10 shadow">
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
                        <div className="absolute bottom-2 right-2 bg-slate-950/90 text-amber-300 px-2 py-0.5 rounded-lg border border-amber-800/60 font-extrabold text-xs flex items-center gap-1 shadow">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {anime.score}
                        </div>
                      </div>

                      {/* Card Details */}
                      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-white truncate transition-colors">
                            {anime.title}
                          </h3>
                          <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                            <Building2 className="w-3 h-3 text-gray-500 shrink-0" /> {anime.studio}
                          </p>
                        </div>

                        {/* Friends Tag */}
                        {anime.watchedByFriends && anime.watchedByFriends.length > 0 && (
                          <div className="bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-[10px] text-gray-300 flex items-center gap-1 truncate">
                            <Users className="w-3 h-3 shrink-0" style={{ color: theme.primaryColor }} />
                            <span className="truncate">{anime.watchedByFriends.join(", ")}</span>
                          </div>
                        )}

                        {/* Action Button */}
                        <button
                          onClick={(e) => handleAddToListQuick(e, anime.malId)}
                          className="w-full mt-2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border"
                          style={{
                            background: isAdded
                              ? "rgba(16, 185, 129, 0.25)"
                              : `linear-gradient(135deg, rgba(${theme.primaryRgb}, 0.25), rgba(${theme.primaryRgb}, 0.1))`,
                            color: isAdded ? "#6ee7b7" : "white",
                            borderColor: isAdded
                              ? "rgba(16, 185, 129, 0.5)"
                              : `rgba(${theme.primaryRgb}, 0.35)`,
                          }}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" /> En tu lista
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} /> Agregar a Lista
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 rounded-3xl border border-white/10 text-center space-y-3 max-w-md mx-auto bg-black/40">
                <p className="text-gray-400 text-sm">No se encontraron animes con los filtros seleccionados.</p>
                <button
                  onClick={handleResetSearch}
                  className="px-4 py-2 text-white rounded-xl text-xs font-bold transition-all shadow"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  Restablecer Filtros
                </button>
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

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MOCK_TOP_ANIMES,
  MOCK_STUDIOS,
  MOCK_USER_FRIENDS,
  ExtendedAnime,
  StudioInfo,
  UserFriendInfo,
} from "@/core/services/catalog-data";
import { Search, Film, Users, Building2, ChevronRight, X } from "lucide-react";
import AnimeDetailModal from "./AnimeDetailModal";

export default function GlobalSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAnimeModal, setSelectedAnimeModal] = useState<ExtendedAnime | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Search Results Categorized
  const [animeResults, setAnimeResults] = useState<ExtendedAnime[]>([]);
  const [userResults, setUserResults] = useState<UserFriendInfo[]>([]);
  const [studioResults, setStudioResults] = useState<StudioInfo[]>([]);

  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length > 0) {
      // 1. Search Animes
      const matchedAnimes = MOCK_TOP_ANIMES.filter(
        (a) =>
          a.title.toLowerCase().includes(trimmed) ||
          (a.titleEnglish && a.titleEnglish.toLowerCase().includes(trimmed)) ||
          a.genres.some((g) => g.toLowerCase().includes(trimmed))
      ).slice(0, 4);

      // 2. Search Users
      const matchedUsers = MOCK_USER_FRIENDS.filter(
        (u) =>
          u.name.toLowerCase().includes(trimmed) ||
          u.username.toLowerCase().includes(trimmed)
      ).slice(0, 3);

      // 3. Search Studios
      const matchedStudios = MOCK_STUDIOS.filter(
        (s) =>
          s.name.toLowerCase().includes(trimmed) ||
          s.popularAnime.toLowerCase().includes(trimmed)
      ).slice(0, 3);

      setAnimeResults(matchedAnimes);
      setUserResults(matchedUsers);
      setStudioResults(matchedStudios);
      setIsOpen(true);
    } else {
      setAnimeResults([]);
      setUserResults([]);
      setStudioResults([]);
      setIsOpen(false);
    }
  }, [query]);

  // Handle Click Outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectAnime = (anime: ExtendedAnime) => {
    setQuery("");
    setIsOpen(false);
    setSelectedAnimeModal(anime);
  };

  const handleSelectUser = (user: UserFriendInfo) => {
    setQuery("");
    setIsOpen(false);
    const cleanUsername = user.username.replace("@", "");
    router.push(`/profile?user=${encodeURIComponent(cleanUsername)}`);
  };

  const handleSelectStudio = (studio: StudioInfo) => {
    setQuery("");
    setIsOpen(false);
    router.push(`/anime?studio=${encodeURIComponent(studio.name)}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const term = query.trim();
    setQuery("");
    setIsOpen(false);
    router.push(`/anime?search=${encodeURIComponent(term)}`);
  };

  const totalResults = animeResults.length + userResults.length + studioResults.length;

  return (
    <>
      <div ref={containerRef} className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md">
        <form onSubmit={handleFormSubmit} className="relative flex items-center">
          <Search className="w-4 h-4 text-purple-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setIsOpen(true)}
            placeholder="Buscar animes, usuarios, estudios..."
            className="w-full bg-slate-900/90 text-xs text-white placeholder-gray-400 pl-9 pr-8 py-2 rounded-full border border-gray-700/80 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="absolute right-2.5 text-gray-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Floating Dropdown - 100% Solid Opaque bg-[#0F172A] */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#0F172A] border border-purple-500/50 rounded-2xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto p-3 space-y-3 divide-y divide-gray-800">
            {totalResults === 0 ? (
              <div className="p-4 text-center text-xs text-gray-400">
                No se encontraron coincidencias para "{query}".
              </div>
            ) : (
              <>
                {/* Categoría: ANIMES */}
                {animeResults.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-1.5 px-2 text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                      <Film className="w-3.5 h-3.5" /> Animes
                    </div>
                    {animeResults.map((anime) => (
                      <button
                        key={anime.malId}
                        onClick={() => handleSelectAnime(anime)}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/90 text-left transition-colors group"
                      >
                        <img
                          src={anime.imageUrl}
                          alt={anime.title}
                          className="w-9 h-12 object-cover rounded-lg border border-gray-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white group-hover:text-purple-300 truncate">
                            {anime.title}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            ★ {anime.score} • {anime.studio}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white shrink-0" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Categoría: USUARIOS */}
                {userResults.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center gap-1.5 px-2 text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                      <Users className="w-3.5 h-3.5" /> Usuarios
                    </div>
                    {userResults.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleSelectUser(user)}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/90 text-left transition-colors group"
                      >
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover border border-cyan-500/40 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-gray-400">{user.username}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white shrink-0" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Categoría: ESTUDIOS */}
                {studioResults.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center gap-1.5 px-2 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      <Building2 className="w-3.5 h-3.5" /> Estudios de Animación
                    </div>
                    {studioResults.map((studio) => (
                      <button
                        key={studio.id}
                        onClick={() => handleSelectStudio(studio)}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/90 text-left transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 font-extrabold text-xs shrink-0">
                          {studio.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                            {studio.name}
                          </p>
                          <p className="text-[10px] text-gray-400 truncate">
                            {studio.popularAnime}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Modal Profile Inspector */}
      {selectedAnimeModal && (
        <AnimeDetailModal
          anime={selectedAnimeModal}
          onClose={() => setSelectedAnimeModal(null)}
        />
      )}
    </>
  );
}

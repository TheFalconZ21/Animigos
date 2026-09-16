"use client";

import { useState, useMemo, useEffect } from "react";
import { ExtendedAnime, MOCK_USER_FRIENDS } from "@/core/services/catalog-data";
import { sendFriendRecommendation } from "@/core/services/recommendations.service";
import { useTheme } from "@/core/contexts/ThemeContext";
import { useAuth } from "@/core/contexts/AuthContext";
import {
  getGuestJoinedGroups,
  isGuestMemberOfAnyGroup,
  postulateAnimeToGroup,
  isAnimePostulatedInAnyGuestGroup,
} from "@/core/services/guest-session.service";
import GuestAddAnimeGuardModal from "./GuestAddAnimeGuardModal";
import {
  X,
  Star,
  Check,
  Send,
  Building2,
  Tv,
  Calendar,
  Layers,
  Sparkles,
  Users,
  Award,
  Heart,
  Eye,
  Clock,
  CheckCircle,
} from "lucide-react";

interface AnimeDetailModalProps {
  anime: ExtendedAnime | null;
  onClose: () => void;
  onAddToList?: (anime: ExtendedAnime, status: "vistos" | "viendo" | "pendientes" | "favoritos") => void;
}

export default function AnimeDetailModal({ anime, onClose, onAddToList }: AnimeDetailModalProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);

  const [selectedFriendId, setSelectedFriendId] = useState(MOCK_USER_FRIENDS[0]?.id || "");
  const [recNote, setRecNote] = useState("");
  const [recSuccess, setRecSuccess] = useState(false);
  const [addedStatus, setAddedStatus] = useState<string | null>(null);
  const [isRecommending, setIsRecommending] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Estados para modo invitado y guardián de listas grupales
  const [isGuestGuardOpen, setIsGuestGuardOpen] = useState(false);
  const [isGuestPostulated, setIsGuestPostulated] = useState(false);
  const [guestPostulatedToast, setGuestPostulatedToast] = useState<string | null>(null);

  // Calcular contraste alto para textos de botones
  const activeTextColor = useMemo(() => {
    const hex = (theme.primaryColor || "#FFFFFF").replace("#", "");
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 128 ? "#05070B" : "#FFFFFF";
    }
    return "#05070B";
  }, [theme.primaryColor]);

  // Verificar si el anime ya fue postulado previamente por el invitado
  useEffect(() => {
    if (!isAuthenticated && anime) {
      setIsGuestPostulated(isAnimePostulatedInAnyGuestGroup(anime.malId));
    }
  }, [anime, isAuthenticated]);

  if (!anime) return null;

  const handleSendRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recNote.trim()) return;

    await sendFriendRecommendation({
      animeTitle: anime.title,
      type: "direct",
      targetFriendId: selectedFriendId,
      note: recNote,
    });

    setRecSuccess(true);
    setTimeout(() => {
      setRecSuccess(false);
      setIsRecommending(false);
      setRecNote("");
    }, 2000);
  };

  const handleAddStatus = (status: "vistos" | "viendo" | "pendientes" | "favoritos") => {
    setAddedStatus(status);
    if (onAddToList) {
      onAddToList(anime, status);
    }
  };

  const handleGuestAddClick = () => {
    const groups = getGuestJoinedGroups();
    if (groups.length === 0) {
      // No pertenece a ninguna lista grupal -> Bloqueado, abrir modal explicativo
      setIsGuestGuardOpen(true);
    } else if (groups.length === 1) {
      // Pertenece a 1 lista grupal -> Postular directamente
      postulateAnimeToGroup(groups[0].id, {
        malId: anime.malId,
        title: anime.title,
        imageUrl: anime.imageUrl,
      });
      setIsGuestPostulated(true);
      setGuestPostulatedToast(`Postulado a ${groups[0].name}`);
      setTimeout(() => setGuestPostulatedToast(null), 3000);
    } else {
      // Pertenece a múltiples listas grupales -> Abrir selector
      setIsGuestGuardOpen(true);
    }
  };

  // Fallback image in case the CDN image fails
  const displayImageUrl = imageError
    ? "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80"
    : anime.imageUrl;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
        {/* Modal Container: Adaptable al tema */}
        <div
          className="rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-white border transition-all duration-300"
          style={{
            backgroundColor: "var(--theme-card-bg, #0B0F17)",
            borderColor: `rgba(${theme.primaryRgb}, 0.45)`,
            boxShadow: `0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(${theme.primaryRgb}, 0.2)`,
          }}
        >
          {/* Botón de Cierre */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 border border-white/15 flex items-center justify-center text-gray-300 hover:text-white hover:bg-black/90 transition-all hover:scale-105"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header Cover: Degradado ambiental del tema */}
          <div
            className="relative h-48 sm:h-64 w-full overflow-hidden flex items-center px-6 sm:px-10 transition-all"
            style={{
              background: `linear-gradient(135deg, rgba(${theme.primaryRgb}, 0.5) 0%, rgba(11, 15, 23, 0.95) 60%, rgba(${theme.primaryRgb}, 0.2) 100%)`,
            }}
          >
            {/* Patrón de puntos radiales con el color del tema */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: `radial-gradient(${theme.primaryColor} 1px, transparent 1px)`,
                backgroundSize: "16px 16px",
              }}
            />

            <div className="flex items-end gap-6 relative z-10">
              <div className="w-24 sm:w-36 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 shrink-0 bg-gray-900">
                <img
                  src={displayImageUrl}
                  alt={anime.title}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1.5 pb-2 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {anime.rank && (
                    <span className="bg-black/60 text-amber-300 text-xs font-extrabold px-2.5 py-1 rounded-lg border border-amber-500/40 flex items-center gap-1 shadow">
                      <Award className="w-3.5 h-3.5 text-amber-400" /> Rank #{anime.rank}
                    </span>
                  )}
                  <span className="bg-amber-500/20 text-amber-300 text-xs font-extrabold px-2.5 py-1 rounded-lg border border-amber-500/40 flex items-center gap-1 shadow">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {anime.score} MAL
                  </span>
                </div>

                <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {anime.title}
                </h2>
                {anime.titleJapanese && (
                  <p className="text-xs sm:text-sm text-gray-400 font-medium">{anime.titleJapanese}</p>
                )}
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Quick Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/40 border border-white/10 text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Estudio</p>
                  <p className="font-bold text-white truncate">{anime.studio}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <Tv className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Episodios</p>
                  <p className="font-bold text-white truncate">
                    {anime.episodes ? `${anime.episodes} eps` : "En emisión"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Estreno</p>
                  <p className="font-bold text-white truncate">
                    {anime.season || ""} {anime.year || ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Géneros</p>
                  <p className="font-bold text-white truncate">{anime.genres.join(", ")}</p>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: theme.primaryColor }} /> Sinopsis General
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed bg-black/30 p-4 rounded-2xl border border-white/10">
                {anime.synopsis}
              </p>
            </div>

            {/* Activity of Friends */}
            {anime.watchedByFriends && anime.watchedByFriends.length > 0 && (
              <div
                className="p-4 rounded-2xl flex items-center gap-3 border transition-all"
                style={{
                  backgroundColor: `rgba(${theme.primaryRgb}, 0.12)`,
                  borderColor: `rgba(${theme.primaryRgb}, 0.35)`,
                }}
              >
                <Users className="w-5 h-5 shrink-0" style={{ color: theme.primaryColor }} />
                <div className="text-xs">
                  <span className="font-bold" style={{ color: theme.primaryColor }}>
                    Visto por tus amigos:{" "}
                  </span>
                  <span className="text-gray-200">{anime.watchedByFriends.join(", ")}</span>
                </div>
              </div>
            )}

            {/* Action Buttons: Add to List & Recommend to Friend */}
            <div className="space-y-4 pt-2 border-t border-white/10">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* 1. SECCIÓN DE ADICIÓN A LISTA */}
                {isAuthenticated ? (
                  /* Usuario registrado: Opciones de lista personal */
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-gray-400 mr-1">Agregar a:</span>
                    <button
                      onClick={() => handleAddStatus("vistos")}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                        addedStatus === "vistos"
                          ? "bg-emerald-600 text-white border-emerald-500"
                          : "bg-black/40 text-gray-300 border-white/10 hover:border-emerald-500 hover:text-white"
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Vistos
                    </button>
                    <button
                      onClick={() => handleAddStatus("viendo")}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                        addedStatus === "viendo"
                          ? "bg-cyan-600 text-white border-cyan-500"
                          : "bg-black/40 text-gray-300 border-white/10 hover:border-cyan-500 hover:text-white"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" /> Viendo
                    </button>
                    <button
                      onClick={() => handleAddStatus("pendientes")}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                        addedStatus === "pendientes"
                          ? "bg-amber-600 text-white border-amber-500"
                          : "bg-black/40 text-gray-300 border-white/10 hover:border-amber-500 hover:text-white"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> Pendientes
                    </button>
                    <button
                      onClick={() => handleAddStatus("favoritos")}
                      className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border"
                      style={{
                        backgroundColor: addedStatus === "favoritos" ? theme.primaryColor : "rgba(0, 0, 0, 0.4)",
                        borderColor: addedStatus === "favoritos" ? theme.primaryColor : "rgba(255, 255, 255, 0.1)",
                        color: addedStatus === "favoritos" ? activeTextColor : "#d1d5db",
                      }}
                    >
                      <Heart
                        className="w-3.5 h-3.5"
                        style={{
                          color: addedStatus === "favoritos" ? activeTextColor : theme.primaryColor,
                          fill: addedStatus === "favoritos" ? activeTextColor : theme.primaryColor,
                        }}
                      />
                      Favoritos
                    </button>
                  </div>
                ) : (
                  /* Usuario invitado: Solo puede postular a Lista Grupal */
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-gray-400 mr-1">Lista Grupal:</span>
                    <button
                      type="button"
                      onClick={handleGuestAddClick}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 border"
                      style={{
                        background: isGuestPostulated ? "#059669" : theme.primaryColor,
                        color: isGuestPostulated ? "#FFFFFF" : activeTextColor,
                        borderColor: isGuestPostulated ? "#10B981" : "transparent",
                      }}
                    >
                      {isGuestPostulated ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" /> Postulado en Grupo
                        </>
                      ) : (
                        <>
                          <Users className="w-3.5 h-3.5" style={{ color: activeTextColor }} /> Postular a Lista Grupal
                        </>
                      )}
                    </button>
                    {guestPostulatedToast && (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-fadeIn">
                        <Check className="w-3.5 h-3.5" /> {guestPostulatedToast}
                      </span>
                    )}
                  </div>
                )}

                {/* 2. BOTÓN RECOMENDAR A UN AMIGO: Con alto contraste garantizado */}
                <button
                  type="button"
                  onClick={() => setIsRecommending(!isRecommending)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shrink-0 hover:brightness-110 active:scale-95"
                  style={{
                    background:
                      theme.primaryColor === "#FFFFFF"
                        ? "#FFFFFF"
                        : `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                    color: activeTextColor,
                    boxShadow: `0 4px 20px rgba(${theme.primaryRgb}, 0.35)`,
                  }}
                >
                  <Send className="w-3.5 h-3.5" style={{ color: activeTextColor }} /> Recomendar a un Amigo
                </button>
              </div>

              {/* Recommendation Form Drawer Adaptado al Tema */}
              {isRecommending && (
                <form
                  onSubmit={handleSendRecommendation}
                  className="bg-black/50 p-4 sm:p-5 rounded-2xl border space-y-3 animate-fadeIn"
                  style={{
                    borderColor: `rgba(${theme.primaryRgb}, 0.4)`,
                  }}
                >
                  <h4
                    className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                    style={{ color: theme.primaryColor }}
                  >
                    <Send className="w-3.5 h-3.5" /> Enviar recomendación personalizada
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Amigo Destinatario</label>
                      <select
                        value={selectedFriendId}
                        onChange={(e) => setSelectedFriendId(e.target.value)}
                        className="w-full bg-black/80 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        style={{
                          borderColor: `rgba(${theme.primaryRgb}, 0.3)`,
                        }}
                      >
                        {MOCK_USER_FRIENDS.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name} ({f.username})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Motivo / Mensaje</label>
                      <input
                        type="text"
                        placeholder="Ej: 'Tienes que ver la animación del episodio 10...'"
                        value={recNote}
                        onChange={(e) => setRecNote(e.target.value)}
                        className="w-full bg-black/80 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
                        style={{
                          borderColor: `rgba(${theme.primaryRgb}, 0.3)`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsRecommending(false)}
                      className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 text-xs font-semibold hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow hover:brightness-110"
                      style={{
                        background:
                          theme.primaryColor === "#FFFFFF"
                            ? "#FFFFFF"
                            : `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                        color: activeTextColor,
                      }}
                    >
                      {recSuccess ? (
                        <Check className="w-3.5 h-3.5" style={{ color: activeTextColor }} />
                      ) : (
                        <Send className="w-3.5 h-3.5" style={{ color: activeTextColor }} />
                      )}
                      {recSuccess ? "¡Enviado!" : "Enviar Recomendación"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Guardián para adición de animes por parte de Invitados */}
      <GuestAddAnimeGuardModal
        isOpen={isGuestGuardOpen}
        onClose={() => setIsGuestGuardOpen(false)}
        anime={anime}
        onSuccessPostulated={(groupName) => {
          setIsGuestPostulated(true);
          setGuestPostulatedToast(`Postulado a ${groupName}`);
          setTimeout(() => setGuestPostulatedToast(null), 3000);
        }}
      />
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  getFriendRecommendations,
  sendFriendRecommendation,
  FriendRecommendation,
} from "@/core/services/recommendations.service";
import { getFriendsList, FriendUser } from "@/core/services/friends.service";
import { getScoreBadgeStyle } from "@/core/utils/score-theme";
import {
  Sparkles,
  UserCheck,
  Globe,
  Plus,
  Bookmark,
  Heart,
  Send,
  Check,
  X,
  MessageSquare,
} from "lucide-react";

export default function FriendRecommendationsSection() {
  const [recommendations, setRecommendations] = useState<FriendRecommendation[]>([]);
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [filter, setFilter] = useState<"all" | "direct" | "general">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  // Form State para nueva recomendación
  const [animeTitle, setAnimeTitle] = useState("");
  const [recType, setRecType] = useState<"direct" | "general">("direct");
  const [targetFriendId, setTargetFriendId] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [filter]);

  async function loadData() {
    const data = await getFriendRecommendations("demo-user-1", filter);
    setRecommendations(data);
    const friendsData = await getFriendsList("demo-user-1");
    setFriends(friendsData);
    if (friendsData.length > 0) {
      setTargetFriendId(friendsData[0].id);
    }
  }

  const handleSaveToList = (recId: string) => {
    setSavedIds((prev) => ({ ...prev, [recId]: true }));
  };

  const handleToggleLike = (recId: string) => {
    setLikedIds((prev) => ({ ...prev, [recId]: !prev[recId] }));
  };

  const handleSubmitRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!animeTitle.trim() || !note.trim()) return;

    setIsSubmitting(true);
    const newRec = await sendFriendRecommendation({
      animeTitle,
      type: recType,
      targetFriendId: recType === "direct" ? targetFriendId : undefined,
      note,
    });

    setRecommendations((prev) => [newRec, ...prev]);
    setIsSubmitting(false);
    setIsModalOpen(false);
    setAnimeTitle("");
    setNote("");
  };

  return (
    <div className="space-y-4">
      {/* Header de la sección y Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" /> Recomendaciones de Amigos
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Descubre animes sugeridos directamente para ti o recomendados para el grupo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs de Filtro */}
          <div className="flex items-center bg-gray-900/80 p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === "all" ? "bg-purple-600 text-white shadow-md shadow-purple-600/30" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter("direct")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === "direct" ? "bg-purple-600 text-white shadow-md shadow-purple-600/30" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" /> 1 a 1 (Directas)
            </button>
            <button
              onClick={() => setFilter("general")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === "general" ? "bg-purple-600 text-white shadow-md shadow-purple-600/30" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Generales
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/20 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Recomendar</span>
          </button>
        </div>
      </div>

      {/* Lista de Tarjetas de Recomendación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const isSaved = savedIds[rec.id];
          const isLiked = likedIds[rec.id];

          return (
            <div
              key={rec.id}
              className={`glass-card p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                rec.type === "direct"
                  ? "border-purple-500/40 bg-gradient-to-br from-purple-950/20 via-gray-900/60 to-gray-950"
                  : "border-gray-800 bg-gray-900/40"
              }`}
            >
              <div>
                {/* User Header Info & Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rec.fromUser.avatarUrl}
                      alt={rec.fromUser.displayName}
                      className="w-8 h-8 rounded-full object-cover border border-purple-500/40"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1">
                        {rec.fromUser.displayName}
                      </h4>
                      <span className="text-[10px] text-gray-400">{rec.createdAt}</span>
                    </div>
                  </div>

                  {rec.type === "direct" ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-950/90 text-purple-300 border border-purple-700/60 flex items-center gap-1 shadow-sm">
                      <UserCheck className="w-3 h-3 text-purple-400" /> Directa 1-a-1
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-cyan-400" /> Recomendación General
                    </span>
                  )}
                </div>

                {/* Anime Content Grid */}
                <div className="flex gap-3 bg-gray-900/70 p-3 rounded-xl border border-gray-800/80 mb-3">
                  <img
                    src={rec.anime.imageUrl}
                    alt={rec.anime.title}
                    className="w-16 h-22 rounded-lg object-cover shadow-md shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-extrabold text-white truncate pr-2">{rec.anime.title}</h3>
                        <span className={`text-xs font-black px-2 py-0.5 rounded-lg flex items-center gap-1 shrink-0 ${getScoreBadgeStyle(rec.anime.score).badgeClass}`}>
                          ★ {rec.anime.score}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rec.anime.genres.slice(0, 3).map((g) => (
                          <span
                            key={g}
                            className="text-[9px] font-semibold text-gray-300 bg-gray-800/80 px-1.5 py-0.5 rounded"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-300 italic mt-2 line-clamp-2 bg-purple-950/30 p-1.5 rounded border border-purple-900/20">
                      "{rec.note}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-800/60">
                <button
                  onClick={() => handleSaveToList(rec.id)}
                  disabled={isSaved}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSaved
                      ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/50"
                      : "bg-gray-800/80 hover:bg-gray-700 text-gray-200"
                  }`}
                >
                  {isSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> En Pendientes
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5 text-purple-400" /> Guardar en Mi Lista
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleToggleLike(rec.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isLiked
                      ? "bg-rose-950/80 text-rose-300 border border-rose-800/50"
                      : "bg-gray-800/80 hover:bg-gray-700 text-gray-300"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-500 text-rose-500" : "text-gray-400"}`} />
                  <span>{isLiked ? "¡Gracias!" : "Agradecer"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal para Recomendar Anime */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#0F172A] border border-purple-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-purple-400" /> Recomendar un Anime
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRecommendation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Nombre del Anime</label>
                <input
                  type="text"
                  placeholder="ej. Steins;Gate, Monster, Jujutsu Kaisen..."
                  value={animeTitle}
                  onChange={(e) => setAnimeTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Tipo de Recomendación</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRecType("direct")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      recType === "direct"
                        ? "bg-purple-950/80 border-purple-500 text-purple-200"
                        : "bg-gray-900/60 border-gray-800 text-gray-400 hover:bg-gray-800"
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-purple-400" /> Directa (1 a 1)
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecType("general")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      recType === "general"
                        ? "bg-purple-950/80 border-purple-500 text-purple-200"
                        : "bg-gray-900/60 border-gray-800 text-gray-400 hover:bg-gray-800"
                    }`}
                  >
                    <Globe className="w-4 h-4 text-cyan-400" /> General (A todos)
                  </button>
                </div>
              </div>

              {recType === "direct" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Seleccionar Amigo</label>
                  <select
                    value={targetFriendId}
                    onChange={(e) => setTargetFriendId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    {friends.map((friend) => (
                      <option key={friend.id} value={friend.id}>
                        {friend.displayName} (@{friend.username})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Nota o Comentario de Recomendación</label>
                <textarea
                  rows={3}
                  placeholder="¿Por qué debería ver este anime? ¿Qué tiene de genial?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                  required
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Enviar Recomendación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

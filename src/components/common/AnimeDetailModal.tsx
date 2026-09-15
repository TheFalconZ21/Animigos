"use client";

import { useState } from "react";
import { ExtendedAnime, MOCK_USER_FRIENDS } from "@/core/services/catalog-data";
import { sendFriendRecommendation } from "@/core/services/recommendations.service";
import {
  X,
  Star,
  Plus,
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
  const [selectedFriendId, setSelectedFriendId] = useState(MOCK_USER_FRIENDS[0]?.id || "");
  const [recNote, setRecNote] = useState("");
  const [recSuccess, setRecSuccess] = useState(false);
  const [addedStatus, setAddedStatus] = useState<string | null>(null);
  const [isRecommending, setIsRecommending] = useState(false);

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Container 100% Sólido Opaco */}
      <div className="bg-[#0F172A] border border-purple-500/40 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gray-900/90 border border-gray-700 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Cover */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-gradient-to-r from-purple-950 via-slate-900 to-cyan-950 flex items-center px-6 sm:px-10">
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 flex items-center gap-6 mt-6">
            <img
              src={anime.imageUrl}
              alt={anime.title}
              className="w-28 sm:w-36 h-40 sm:h-52 object-cover rounded-2xl border-2 border-purple-500/50 shadow-2xl shrink-0 -mb-16 sm:-mb-20"
            />
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-purple-900/80 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-700/50 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> Rank #{anime.rank}
                </span>
                <span className="bg-amber-950/80 text-amber-300 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-700/50 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {anime.score} MAL
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight line-clamp-2">
                {anime.title}
              </h2>
              {anime.titleJapanese && (
                <p className="text-xs text-purple-300 font-medium tracking-wide">{anime.titleJapanese}</p>
              )}
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 pt-16 sm:pt-20 space-y-6">
          {/* Metadata Badges Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/90 p-4 rounded-2xl border border-gray-800 text-xs">
            <div className="flex items-center gap-2 text-gray-300">
              <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Estudio</p>
                <p className="font-bold text-white truncate">{anime.studio}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <Tv className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Episodios</p>
                <p className="font-bold text-white">{anime.episodes} eps ({anime.status})</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Estreno</p>
                <p className="font-bold text-white">{anime.season || "Año"} {anime.year || ""}</p>
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
              <Sparkles className="w-4 h-4 text-purple-400" /> Sinopsis General
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-gray-800">
              {anime.synopsis}
            </p>
          </div>

          {/* Activity of Friends */}
          {anime.watchedByFriends && anime.watchedByFriends.length > 0 && (
            <div className="bg-purple-950/30 border border-purple-800/40 p-4 rounded-2xl flex items-center gap-3">
              <Users className="w-5 h-5 text-purple-400 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-purple-300">Visto por tus amigos: </span>
                <span className="text-gray-300">{anime.watchedByFriends.join(", ")}</span>
              </div>
            </div>
          )}

          {/* Action Buttons: Add to List & Recommend to Friend */}
          <div className="space-y-4 pt-2 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Add to list options */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-400 mr-1">Agregar a:</span>
                <button
                  onClick={() => handleAddStatus("vistos")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                    addedStatus === "vistos"
                      ? "bg-emerald-600 text-white border-emerald-500"
                      : "bg-gray-900 text-gray-300 border-gray-700 hover:border-emerald-500 hover:text-white"
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Vistos
                </button>
                <button
                  onClick={() => handleAddStatus("viendo")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                    addedStatus === "viendo"
                      ? "bg-cyan-600 text-white border-cyan-500"
                      : "bg-gray-900 text-gray-300 border-gray-700 hover:border-cyan-500 hover:text-white"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" /> Viendo
                </button>
                <button
                  onClick={() => handleAddStatus("pendientes")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                    addedStatus === "pendientes"
                      ? "bg-amber-600 text-white border-amber-500"
                      : "bg-gray-900 text-gray-300 border-gray-700 hover:border-amber-500 hover:text-white"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Pendientes
                </button>
                <button
                  onClick={() => handleAddStatus("favoritos")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                    addedStatus === "favoritos"
                      ? "bg-purple-600 text-white border-purple-500"
                      : "bg-gray-900 text-gray-300 border-gray-700 hover:border-purple-500 hover:text-white"
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 text-purple-400 fill-purple-400" /> Favoritos
                </button>
              </div>

              {/* Toggle Recommend Form */}
              <button
                onClick={() => setIsRecommending(!isRecommending)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/50 shrink-0"
              >
                <Send className="w-3.5 h-3.5" /> Recomendar a un Amigo
              </button>
            </div>

            {/* Recommendation Form Drawer */}
            {isRecommending && (
              <form
                onSubmit={handleSendRecommendation}
                className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-purple-500/40 space-y-3 animate-fadeIn"
              >
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" /> Enviar recomendación personalizada
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Amigo Destinatario</label>
                    <select
                      value={selectedFriendId}
                      onChange={(e) => setSelectedFriendId(e.target.value)}
                      className="w-full bg-slate-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
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
                      className="w-full bg-slate-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
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
                    className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    {recSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Send className="w-3.5 h-3.5" />}
                    {recSuccess ? "¡Enviado!" : "Enviar Recomendación"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

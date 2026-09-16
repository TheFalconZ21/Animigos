"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getFeedActivities,
  createLookingForPost,
  createFriendPollPost,
  FeedActivityItem,
} from "@/core/services/feed-activity.service";
import { sendFriendRecommendation } from "@/core/services/recommendations.service";
import { getFriendsList, FriendUser } from "@/core/services/friends.service";
import { useAuth } from "@/core/contexts/AuthContext";
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
  Users,
  Trophy,
  BarChart2,
  Search,
  HelpCircle,
  Award,
  ArrowRight,
  PartyPopper,
} from "lucide-react";

export default function SocialActivityFeed() {
  const [activities, setActivities] = useState<FeedActivityItem[]>([]);
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [filter, setFilter] = useState<"all" | "recommendations" | "invites" | "posts">("all");

  // State para interacciones rápidas
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [votedPolls, setVotedPolls] = useState<Record<string, string>>({}); // pollId -> optionId

  // Modales
  const [isRecModalOpen, setIsRecModalOpen] = useState(false);
  const [isLookingForModalOpen, setIsLookingForModalOpen] = useState(false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [replyTargetFriend, setReplyTargetFriend] = useState<FriendUser | null>(null);

  // Form State Recomendar
  const [recAnimeTitle, setRecAnimeTitle] = useState("");
  const [recType, setRecType] = useState<"direct" | "general">("direct");
  const [targetFriendId, setTargetFriendId] = useState("");
  const [recNote, setRecNote] = useState("");

  // Form State Busco Anime Parecido a
  const [lookingPrompt, setLookingPrompt] = useState("");
  const [lookingRefAnime, setLookingRefAnime] = useState("");

  // Form State Encuesta
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOpt1, setPollOpt1] = useState("");
  const [pollOpt2, setPollOpt2] = useState("");
  const [pollOpt3, setPollOpt3] = useState("");

  const { user } = useAuth();
  const activeUserId = user?.id || "demo-user-1";

  useEffect(() => {
    loadFeed();
  }, [filter, activeUserId]);

  async function loadFeed() {
    const data = await getFeedActivities(filter);
    setActivities(data);
    const friendsData = await getFriendsList(activeUserId);
    setFriends(friendsData);
    if (friendsData.length > 0) setTargetFriendId(friendsData[0].id);
  }

  const handleSaveToList = (id: string) => {
    setSavedIds((prev) => ({ ...prev, [id]: true }));
  };

  const handleToggleLike = (id: string) => {
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleVotePoll = (actId: string, optionId: string) => {
    setVotedPolls((prev) => ({ ...prev, [actId]: optionId }));
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === actId && act.pollData) {
          const updatedOptions = act.pollData.options.map((opt) =>
            opt.id === optionId ? { ...opt, votesCount: opt.votesCount + 1 } : opt
          );
          return {
            ...act,
            pollData: {
              ...act.pollData,
              options: updatedOptions,
              totalVotes: act.pollData.totalVotes + 1,
            },
          };
        }
        return act;
      })
    );
  };

  // Submit Recomendar
  const handleSubmitRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recAnimeTitle.trim() || !recNote.trim()) return;

    await sendFriendRecommendation({
      animeTitle: recAnimeTitle,
      type: recType,
      targetFriendId: recType === "direct" ? targetFriendId : undefined,
      note: recNote,
    });

    setIsRecModalOpen(false);
    setRecAnimeTitle("");
    setRecNote("");
    loadFeed();
  };

  // Submit Busco Anime
  const handleSubmitLookingFor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookingPrompt.trim()) return;

    await createLookingForPost(lookingPrompt, lookingRefAnime);
    setIsLookingForModalOpen(false);
    setLookingPrompt("");
    setLookingRefAnime("");
    loadFeed();
  };

  // Submit Encuesta
  const handleSubmitPoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollQuestion.trim() || !pollOpt1.trim() || !pollOpt2.trim()) return;

    const options = [pollOpt1, pollOpt2];
    if (pollOpt3.trim()) options.push(pollOpt3);

    await createFriendPollPost(pollQuestion, options);
    setIsPollModalOpen(false);
    setPollQuestion("");
    setPollOpt1("");
    setPollOpt2("");
    setPollOpt3("");
    loadFeed();
  };

  return (
    <div className="glass-panel rounded-3xl border border-gray-800 overflow-hidden divide-y divide-gray-800/80">
      {/* Header Unificado de la Tira de Actividad Social */}
      <div className="p-5 sm:p-6 bg-slate-950/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-purple-950/80 border border-purple-800/60 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                Tira Continua de Actividad Social
              </h2>
              <p className="text-xs text-gray-400">Feed en vivo de recomendaciones, invitaciones y publicaciones de amigos</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            EN VIVO
          </span>
        </div>

        {/* Botones de Acción Rápida para Crear Post */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => {
              setRecType("direct");
              setIsRecModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 p-3 bg-purple-950/50 hover:bg-purple-900/60 border border-purple-800/60 rounded-2xl text-xs font-extrabold text-purple-200 transition-all cursor-pointer shadow-md hover:scale-[1.02]"
          >
            <Send className="w-4 h-4 text-purple-400" /> Recomendar Anime
          </button>

          <button
            onClick={() => setIsLookingForModalOpen(true)}
            className="flex items-center justify-center gap-2 p-3 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-2xl text-xs font-extrabold text-cyan-200 transition-all cursor-pointer shadow-md hover:scale-[1.02]"
          >
            <Search className="w-4 h-4 text-cyan-400" /> "Busco anime parecido a..."
          </button>

          <button
            onClick={() => setIsPollModalOpen(true)}
            className="flex items-center justify-center gap-2 p-3 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-800/60 rounded-2xl text-xs font-extrabold text-amber-200 transition-all cursor-pointer shadow-md hover:scale-[1.02]"
          >
            <BarChart2 className="w-4 h-4 text-amber-400" /> Crear Encuesta
          </button>
        </div>

        {/* Filtros de la Tira */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-800/80 overflow-x-auto scrollbar-none">
          <span className="text-xs text-gray-400 font-semibold shrink-0">Filtrar:</span>
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === "all" ? "bg-purple-600 text-white shadow-md" : "bg-gray-900 text-gray-400 hover:text-gray-200"
            }`}
          >
            🌐 Todo el Feed
          </button>
          <button
            onClick={() => setFilter("recommendations")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === "recommendations" ? "bg-purple-600 text-white shadow-md" : "bg-gray-900 text-gray-400 hover:text-gray-200"
            }`}
          >
            🎯 Recomendaciones
          </button>
          <button
            onClick={() => setFilter("invites")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === "invites" ? "bg-purple-600 text-white shadow-md" : "bg-gray-900 text-gray-400 hover:text-gray-200"
            }`}
          >
            📩 Invitaciones
          </button>
          <button
            onClick={() => setFilter("posts")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === "posts" ? "bg-purple-600 text-white shadow-md" : "bg-gray-900 text-gray-400 hover:text-gray-200"
            }`}
          >
            💬 Encuestas & Hitos
          </button>
        </div>
      </div>

      {/* Stream Unificado de Actividad (Items homogéneos divididos sin fragmentación) */}
      <div className="divide-y divide-gray-800/80">
        {activities.map((act) => {
          const isSaved = savedIds[act.id];
          const isLiked = likedIds[act.id];

          return (
            <div
              key={act.id}
              className="p-5 sm:p-6 hover:bg-slate-900/40 transition-colors space-y-4"
            >
              {/* Top Header of Activity Item */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={act.fromUser.avatarUrl}
                    alt={act.fromUser.displayName}
                    className="w-10 h-10 rounded-2xl object-cover border border-purple-500/40 shadow-sm"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {act.fromUser.displayName}
                      <span className="text-xs font-normal text-gray-400">@{act.fromUser.username}</span>
                    </h3>
                    <span className="text-[10px] text-gray-400">{act.createdAt}</span>
                  </div>
                </div>

                {/* Badge por tipo de actividad */}
                {act.type === "recommendation_direct" && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-950/90 text-purple-300 border border-purple-700/60 flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-purple-400" /> Recomendación 1-a-1
                  </span>
                )}
                {act.type === "recommendation_general" && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-cyan-400" /> Recomendación General
                  </span>
                )}
                {act.type === "group_invite" && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 flex items-center gap-1">
                    <Users className="w-3 h-3 text-emerald-400" /> Invitación a Grupo
                  </span>
                )}
                {act.type === "looking_for_anime" && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 flex items-center gap-1">
                    <Search className="w-3 h-3 text-indigo-400" /> Busco Recomendación
                  </span>
                )}
                {act.type === "friend_poll" && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-950/80 text-amber-300 border border-amber-800/50 flex items-center gap-1">
                    <BarChart2 className="w-3 h-3 text-amber-400" /> Encuesta entre Amigos
                  </span>
                )}
                {act.type === "achievement_milestone" && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-950/80 text-rose-300 border border-rose-800/50 flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-rose-400" /> Hito & Logro 🎉
                  </span>
                )}
              </div>

              {/* CONTENIDO SEGÚN TIPO DE ACTIVIDAD */}

              {/* 1 & 2: RECOMENDACIONES (Directa o General) */}
              {(act.type === "recommendation_direct" || act.type === "recommendation_general") && act.recommendationData && (
                <div className="space-y-3">
                  <div className="flex gap-4 bg-gray-900/70 p-3.5 rounded-2xl border border-gray-800/90">
                    <img
                      src={act.recommendationData.anime.imageUrl}
                      alt={act.recommendationData.anime.title}
                      className="w-16 h-24 rounded-xl object-cover shadow-md shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-extrabold text-white truncate pr-2">
                            {act.recommendationData.anime.title}
                          </h4>
                          <span className={`text-xs font-black px-2 py-0.5 rounded-lg flex items-center gap-1 shrink-0 ${getScoreBadgeStyle(act.recommendationData.anime.score).badgeClass}`}>
                            ★ {act.recommendationData.anime.score}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {act.recommendationData.anime.genres.slice(0, 3).map((g) => (
                            <span key={g} className="text-[10px] font-semibold text-gray-300 bg-gray-800 px-2 py-0.5 rounded-md">
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-gray-300 italic mt-2 bg-purple-950/30 p-2 rounded-xl border border-purple-900/30">
                        "{act.recommendationData.note}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => handleSaveToList(act.id)}
                      disabled={isSaved}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSaved
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/50"
                          : "bg-gray-800/80 hover:bg-gray-700 text-gray-200"
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> En Mis Pendientes
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5 text-purple-400" /> Guardar en Mi Lista
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleToggleLike(act.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isLiked ? "bg-rose-950/80 text-rose-300 border border-rose-800/50" : "bg-gray-800/80 hover:bg-gray-700 text-gray-300"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-500 text-rose-500" : "text-gray-400"}`} />
                      <span>{isLiked ? "¡Gracias!" : "Agradecer"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 3: INVITACIÓN A GRUPO / SALA COMPARTIDA */}
              {act.type === "group_invite" && act.groupInviteData && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-gray-900 to-gray-950 border border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-300 mb-1">
                      <strong className="text-white font-bold">{act.fromUser.displayName}</strong> te invitó a su grupo de votación:
                    </p>
                    <h4 className="text-base font-extrabold text-white">{act.groupInviteData.listName}</h4>
                    <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-2">
                      <span>👥 {act.groupInviteData.membersCount} integrantes</span>
                      {act.groupInviteData.topCandidateTitle && (
                        <span>• Ganador actual: <strong className="text-amber-400">{act.groupInviteData.topCandidateTitle}</strong></span>
                      )}
                    </p>
                  </div>

                  <Link
                    href={`/shared-lists/${act.groupInviteData.listId}`}
                    className="px-4 py-2.5 text-xs font-extrabold text-gray-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-400/20 transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    Unirme al Grupo <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* 4: BUSCO ANIME PARECIDO A... */}
              {act.type === "looking_for_anime" && act.lookingForData && (
                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 space-y-3">
                  <p className="text-sm font-semibold text-white leading-relaxed">
                    "{act.lookingForData.prompt}"
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-indigo-900/40">
                    <span className="text-[10px] text-indigo-300 font-medium">
                      Referencia: {act.lookingForData.referenceAnime || "Varias obras"}
                    </span>
                    <button
                      onClick={() => {
                        setReplyTargetFriend({
                          id: act.fromUser.id,
                          displayName: act.fromUser.displayName,
                          username: act.fromUser.username,
                          avatarUrl: act.fromUser.avatarUrl,
                          status: "online",
                          favoriteGenre: "General",
                          mutualFriendsCount: 1,
                        });
                        setRecType("direct");
                        setTargetFriendId(act.fromUser.id);
                        setRecNote(`Te sugiero este anime basándome en tu pedido: "${act.lookingForData?.prompt}"`);
                        setIsRecModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 text-xs font-bold text-indigo-200 bg-indigo-900/60 hover:bg-indigo-800/80 border border-indigo-700/50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-indigo-400" /> Responder con una Recomendación
                    </button>
                  </div>
                </div>
              )}

              {/* 5: ENCUESTA ENTRE AMIGOS */}
              {act.type === "friend_poll" && act.pollData && (
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-400" /> {act.pollData.question}
                  </h4>

                  <div className="space-y-2">
                    {act.pollData.options.map((opt) => {
                      const userVotedOpt = votedPolls[act.id];
                      const totalVotes = act.pollData?.totalVotes || 1;
                      const percentage = Math.round((opt.votesCount / Math.max(totalVotes, 1)) * 100);
                      const isSelected = userVotedOpt === opt.id;

                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleVotePoll(act.id, opt.id)}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold transition-all relative overflow-hidden flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? "bg-amber-500/20 border-amber-500 text-white"
                              : "bg-gray-900/80 border-gray-800 text-gray-200 hover:bg-gray-800"
                          }`}
                        >
                          <div
                            className="absolute left-0 top-0 bottom-0 bg-amber-500/15 transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                          <span className="relative z-10 flex items-center gap-2">
                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                            {opt.text}
                          </span>
                          <span className="relative z-10 text-[11px] font-extrabold text-amber-400">
                            {percentage}% ({opt.votesCount})
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[10px] text-gray-400 text-right font-medium">
                    Total de votos: {act.pollData.totalVotes} votos de amigos
                  </p>
                </div>
              )}

              {/* 6: HITO & LOGROS DE AMIGOS */}
              {act.type === "achievement_milestone" && act.milestoneData && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-rose-950/30 to-gray-900 border border-purple-800/40 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 shrink-0 shadow-lg shadow-amber-500/20">
                      <div className="w-full h-full bg-[#0B0F17] rounded-[14px] flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-amber-400" />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-white">{act.milestoneData.title}</h4>
                      <p className="text-xs text-gray-300 mt-0.5">{act.milestoneData.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleLike(act.id)}
                    className={`px-4 py-2 text-xs font-extrabold rounded-xl border transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      isLiked
                        ? "bg-rose-950/80 text-rose-300 border-rose-800"
                        : "bg-purple-900/40 hover:bg-purple-900/80 text-purple-200 border-purple-800/60"
                    }`}
                  >
                    <PartyPopper className="w-4 h-4 text-amber-400" />
                    <span>{isLiked ? "¡Felicidades! 🎉" : "Felicitar 🎉"}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL 1: RECOMENDAR ANIME */}
      {isRecModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#0F172A] border border-purple-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-purple-400" /> Recomendar un Anime
              </h3>
              <button onClick={() => setIsRecModalOpen(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRecommendation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Nombre del Anime</label>
                <input
                  type="text"
                  placeholder="ej. Steins;Gate, Monster, Jujutsu Kaisen..."
                  value={recAnimeTitle}
                  onChange={(e) => setRecAnimeTitle(e.target.value)}
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
                      recType === "direct" ? "bg-purple-950/80 border-purple-500 text-purple-200" : "bg-gray-900/60 border-gray-800 text-gray-400"
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-purple-400" /> Directa (1 a 1)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecType("general")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      recType === "general" ? "bg-purple-950/80 border-purple-500 text-purple-200" : "bg-gray-900/60 border-gray-800 text-gray-400"
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
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Nota de Recomendación</label>
                <textarea
                  rows={3}
                  placeholder="¿Por qué le encantará este anime?"
                  value={recNote}
                  onChange={(e) => setRecNote(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                  required
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsRecModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white">
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Enviar Recomendación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BUSCO ANIME PARECIDO A */}
      {isLookingForModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#0F172A] border border-cyan-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-cyan-400" /> Pedir Recomendación a Amigos
              </h3>
              <button onClick={() => setIsLookingForModalOpen(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitLookingFor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">¿Qué tipo de anime buscas?</label>
                <textarea
                  rows={3}
                  placeholder="ej. Busco animes de misterio y viajes en el tiempo parecidos a Steins;Gate..."
                  value={lookingPrompt}
                  onChange={(e) => setLookingPrompt(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Anime de Referencia (Opcional)</label>
                <input
                  type="text"
                  placeholder="ej. Monster, Death Note, Attack on Titan..."
                  value={lookingRefAnime}
                  onChange={(e) => setLookingRefAnime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsLookingForModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white">
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Publicar Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREAR ENCUESTA */}
      {isPollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#0F172A] border border-amber-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-amber-400" /> Crear Encuesta entre Amigos
              </h3>
              <button onClick={() => setIsPollModalOpen(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPoll} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Pregunta de la Encuesta</label>
                <input
                  type="text"
                  placeholder="ej. ¿Qué género deberíamos ver este fin de semana?"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-300">Opciones de Votación</label>
                <input
                  type="text"
                  placeholder="Opción 1 (ej. Sci-Fi & Suspenso)"
                  value={pollOpt1}
                  onChange={(e) => setPollOpt1(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900/80 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Opción 2 (ej. Fantasía Oscura)"
                  value={pollOpt2}
                  onChange={(e) => setPollOpt2(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900/80 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Opción 3 (Opcional)"
                  value={pollOpt3}
                  onChange={(e) => setPollOpt3(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900/80 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsPollModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white">
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 rounded-xl shadow-lg shadow-amber-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BarChart2 className="w-4 h-4" /> Lanzar Encuesta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

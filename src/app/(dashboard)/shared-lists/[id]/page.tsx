"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/common/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/core/contexts/ThemeContext";
import { removeGuestJoinedGroup } from "@/core/services/guest-session.service";
import ConfirmLeaveGroupModal from "@/components/shared-lists/ConfirmLeaveGroupModal";
import {
  Users,
  Vote,
  Sparkles,
  Share2,
  Plus,
  Info,
  Check,
  Trophy,
  BarChart3,
  LayoutGrid,
  List,
  CheckCheck,
  Star,
  Clock,
  SlidersHorizontal,
  LogOut,
} from "lucide-react";
import { calculateHappinessScore } from "@/core/algorithms/happiness-score";
import HappinessAnalyticsChart from "@/components/shared-lists/HappinessAnalyticsChart";
import GroupCriteriaModal, { GroupCriteriaState } from "@/components/shared-lists/GroupCriteriaModal";

export default function SharedListWorkspacePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { theme } = useTheme();

  // Pestaña principal y modo de visualización de candidatos
  const [mainTab, setMainTab] = useState<"voting" | "analytics">("voting");
  const [viewMode, setViewMode] = useState<"cards" | "compact">("cards");

  // Modal para abandonar la lista grupal
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Nombre de la sala según el ID
  const listName = params.id === "demo-list-2" ? "Maratón Vacaciones 🌴" : "Anime de los Viernes 🍿";

  // Verificar si es tema neutro (Default blanco y negro) o tema con acento activo
  const isNeutral = theme.id === "Default" || theme.primaryColor === "#FFFFFF";

  // Color de alto contraste para botones activos
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

  // Modal de Criterios Ideales del Grupo
  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const [groupCriteria, setGroupCriteria] = useState<GroupCriteriaState>({
    minEpisodes: 1,
    maxEpisodes: 28,
    genres: ["Sci-Fi", "Fantasía", "Misterio"],
    minYear: 2010,
    maxYear: 2026,
    studios: ["Madhouse", "White Fox"],
    formats: ["TV", "Película"],
    unseenByMembersOnly: false,
  });

  // Candidatos de demostración
  const [candidates, setCandidates] = useState([
    {
      id: "c1",
      malId: 52991,
      title: "Frieren: Beyond Journey's End",
      imageUrl: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg",
      malScore: 9.1,
      malScoredBy: 350000,
      suggestedBy: "Maximiliano",
      episodesCount: 28,
      votes: [
        { voterId: "u1", voterName: "Maximiliano", interestScore: 10 },
        { voterId: "u2", voterName: "Sofía", interestScore: 9 },
        { voterId: "u3", voterName: "Mauricio", interestScore: 9 },
        { voterId: "guest1", voterName: "Carlos (Invitado)", interestScore: 8 },
      ],
    },
    {
      id: "c2",
      malId: 31240,
      title: "Re:Zero − Starting Life in Another World",
      imageUrl: "https://cdn.myanimelist.net/images/anime/11/79410.jpg",
      malScore: 8.2,
      malScoredBy: 900000,
      suggestedBy: "Sofía",
      episodesCount: 25,
      votes: [
        { voterId: "u1", voterName: "Maximiliano", interestScore: 7 },
        { voterId: "u2", voterName: "Sofía", interestScore: 10 },
        { voterId: "u3", voterName: "Mauricio", interestScore: 4 },
        { voterId: "guest1", voterName: "Carlos (Invitado)", interestScore: 6 },
      ],
    },
    {
      id: "c3",
      malId: 9253,
      title: "Steins;Gate",
      imageUrl: "https://cdn.myanimelist.net/images/anime/1935/127974.jpg",
      malScore: 9.07,
      malScoredBy: 1400000,
      suggestedBy: "Mauricio",
      episodesCount: 24,
      votes: [
        { voterId: "u1", voterName: "Maximiliano", interestScore: 9 },
        { voterId: "u2", voterName: "Sofía", interestScore: 8 },
        { voterId: "u3", voterName: "Mauricio", interestScore: 10 },
        { voterId: "guest1", voterName: "Carlos (Invitado)", interestScore: 9 },
      ],
    },
    {
      id: "c4",
      malId: 16498,
      title: "Attack on Titan",
      imageUrl: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
      malScore: 8.55,
      malScoredBy: 2800000,
      suggestedBy: "Carlos",
      episodesCount: 87,
      votes: [
        { voterId: "u1", voterName: "Maximiliano", interestScore: 5 },
        { voterId: "u2", voterName: "Sofía", interestScore: 6 },
        { voterId: "u3", voterName: "Mauricio", interestScore: 8 },
        { voterId: "guest1", voterName: "Carlos (Invitado)", interestScore: 10 },
      ],
    },
  ]);

  // Votos en Borrador (draftVotes) y Votos Confirmados (confirmedVotes)
  const [draftVotes, setDraftVotes] = useState<Record<string, number>>({
    c1: 10,
    c2: 7,
    c3: 9,
    c4: 5,
  });

  const [confirmedVotes, setConfirmedVotes] = useState<Record<string, number>>({
    c1: 10,
    c2: 7,
    c3: 9,
    c4: 5,
  });

  const [confirmedFeedback, setConfirmedFeedback] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  // Manejar cambio en borrador (Slider o Input Numérico)
  const handleDraftChange = (candidateId: string, val: number) => {
    const clamped = isNaN(val) ? 0 : Math.max(0, Math.min(10, val));
    setDraftVotes((prev) => ({ ...prev, [candidateId]: clamped }));
  };

  // Confirmar voto individual mediante el botón "Votar"
  const handleConfirmVote = (candidateId: string) => {
    const score = draftVotes[candidateId] ?? 5;

    // Guardar voto confirmado
    setConfirmedVotes((prev) => ({ ...prev, [candidateId]: score }));

    // Actualizar votos del candidato en la lista
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const otherVotes = c.votes.filter((v) => v.voterId !== "u1");
          return {
            ...c,
            votes: [...otherVotes, { voterId: "u1", voterName: "Maximiliano (Tú)", interestScore: score }],
          };
        }
        return c;
      })
    );

    // Feedback de confirmación
    setConfirmedFeedback((prev) => ({ ...prev, [candidateId]: true }));
    setTimeout(() => {
      setConfirmedFeedback((prev) => ({ ...prev, [candidateId]: false }));
    }, 2500);
  };

  // Confirmar todos los votos a la vez
  const handleConfirmAllVotes = () => {
    setConfirmedVotes({ ...draftVotes });

    setCandidates((prev) =>
      prev.map((c) => {
        const score = draftVotes[c.id] ?? 5;
        const otherVotes = c.votes.filter((v) => v.voterId !== "u1");
        return {
          ...c,
          votes: [...otherVotes, { voterId: "u1", voterName: "Maximiliano (Tú)", interestScore: score }],
        };
      })
    );
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/join/viernes2026`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleConfirmLeaveGroup = () => {
    removeGuestJoinedGroup(params.id);
    router.push("/shared-lists");
  };

  // Ordenar candidatos únicamente según los votos CONFIRMADOS
  const rankedCandidates = candidates
    .map((c) => {
      const result = calculateHappinessScore({
        malId: c.malId,
        title: c.title,
        malScore: c.malScore,
        malScoredBy: c.malScoredBy,
        votes: c.votes,
        totalMembersCount: 4,
        episodesCount: c.episodesCount,
      });
      return { ...c, result };
    })
    .sort((a, b) => b.result.finalScore - a.result.finalScore);

  const hasUnconfirmedDrafts = candidates.some(
    (c) => draftVotes[c.id] !== confirmedVotes[c.id]
  );

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Group Header: Adaptativo al tema activo o neutro */}
        <div className="glass-panel p-6 rounded-3xl border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="px-3 py-1 text-xs font-bold rounded-full border flex items-center gap-1.5 transition-colors"
                style={{
                  backgroundColor: isNeutral ? "rgba(255, 255, 255, 0.1)" : `rgba(${theme.primaryRgb}, 0.15)`,
                  color: isNeutral ? "#F1F5F9" : theme.primaryColor,
                  borderColor: isNeutral ? "rgba(255, 255, 255, 0.2)" : `rgba(${theme.primaryRgb}, 0.35)`,
                }}
              >
                ● Votación en Tiempo Real
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-white" /> 4 integrantes (1 Invitado)
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {listName}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Ajusta tu puntuación por slider o número y presiona <strong className="text-white">Votar</strong> para confirmar y actualizar el ranking.
            </p>

            {/* Active Group Criteria Banner */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
              <span className="text-gray-300 font-semibold flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: isNeutral ? "#FFFFFF" : theme.primaryColor }} /> Criterios del Grupo:
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-white/5 text-slate-200 border border-white/15 font-bold">
                ⏱️ {groupCriteria.minEpisodes}-{groupCriteria.maxEpisodes} caps
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-white/5 text-slate-200 border border-white/15 font-bold">
                🎬 {groupCriteria.genres.join(", ")}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-white/5 text-slate-200 border border-white/15 font-bold">
                📅 {groupCriteria.minYear}-{groupCriteria.maxYear}
              </span>
              {groupCriteria.unseenByMembersOnly && (
                <span className="px-2.5 py-0.5 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800/50 font-bold">
                  👁️ No vistos
                </span>
              )}
            </div>
          </div>

          {/* Acciones de la Sala */}
          <div className="flex items-center gap-2.5 flex-wrap md:flex-nowrap">
            <button
              onClick={() => setIsCriteriaModalOpen(true)}
              className="px-4 py-2.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4 text-white" />
              <span>Criterios Ideales</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 text-sm font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? "¡Link Copiado!" : "Invitar Amigos"}</span>
            </button>

            <Link
              href="/anime"
              className="px-4 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-md hover:scale-[1.02] active:scale-95"
              style={{
                background: theme.primaryColor,
                color: activeTextColor,
                boxShadow: `0 4px 14px rgba(${theme.primaryRgb}, 0.25)`,
              }}
            >
              <Plus className="w-4 h-4" style={{ color: activeTextColor }} /> Postular Anime
            </Link>

            {/* BOTÓN ABANDONAR LISTA (VISUAL 1) */}
            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(true)}
              className="px-3.5 py-2.5 text-sm font-semibold text-rose-400 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 hover:border-rose-500/60 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
              title="Abandonar esta lista grupal"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Abandonar Lista</span>
            </button>
          </div>
        </div>

        {/* Control Bar: Pestañas Principales (Lista vs Gráfico) + Modos de Vista */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-gray-900/80 border border-white/15">
          {/* Main Tab Switcher */}
          <div className="flex items-center bg-black/70 p-1 rounded-2xl border border-white/15 text-xs font-bold">
            <button
              onClick={() => setMainTab("voting")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer font-bold ${
                mainTab === "voting"
                  ? isNeutral
                    ? "bg-white text-black shadow-md"
                    : "text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
              style={
                mainTab === "voting" && !isNeutral
                  ? {
                      background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                      color: activeTextColor,
                    }
                  : undefined
              }
            >
              <Vote
                className="w-4 h-4"
                style={{
                  color: mainTab === "voting" ? (isNeutral ? "#05070B" : activeTextColor) : undefined,
                }}
              />
              <span>📋 Lista de Votación</span>
            </button>
            <button
              onClick={() => setMainTab("analytics")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer font-bold ${
                mainTab === "analytics"
                  ? isNeutral
                    ? "bg-white text-black shadow-md"
                    : "text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
              style={
                mainTab === "analytics" && !isNeutral
                  ? {
                      background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                      color: activeTextColor,
                    }
                  : undefined
              }
            >
              <BarChart3
                className="w-4 h-4"
                style={{
                  color: mainTab === "analytics" ? (isNeutral ? "#05070B" : activeTextColor) : undefined,
                }}
              />
              <span>📊 Gráfico & Análisis de Felicidad</span>
            </button>
          </div>

          {/* Sub Control: Modo de Visualización (Tarjetas vs Lista Compacta) & Botón Confirmar Todos */}
          {mainTab === "voting" && (
            <div className="flex items-center gap-3 self-start sm:self-auto">
              {hasUnconfirmedDrafts && (
                <button
                  onClick={handleConfirmAllVotes}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-500 hover:bg-emerald-400 text-gray-950 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer animate-pulse"
                >
                  <CheckCheck className="w-4 h-4" /> Confirmar Todos los Votos
                </button>
              )}

              <div className="flex items-center bg-black/70 p-1 rounded-2xl border border-white/15 text-xs font-semibold">
                <button
                  onClick={() => setViewMode("cards")}
                  title="Vista Tarjetas (Detallada)"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    viewMode === "cards"
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-white" /> Tarjetas
                </button>
                <button
                  onClick={() => setViewMode("compact")}
                  title="Vista Lista Compacta (Rápida)"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    viewMode === "compact"
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <List className="w-3.5 h-3.5 text-white" /> Lista Compacta
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CONTENIDO DE LA SECCIÓN DE ANÁLISIS O VISTA DE CANDIDATOS */}
        {mainTab === "analytics" ? (
          <HappinessAnalyticsChart candidates={rankedCandidates} />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" /> Ranking por Felicidad Grupal
              </h2>
              <span className="text-xs text-gray-400 font-medium">
                {viewMode === "cards" ? "Vista Tarjetas Expandida" : "Vista Lista Compacta"}
              </span>
            </div>

            {/* MODO 1: VISTA TARJETAS (CARDS DETALLADAS) */}
            {viewMode === "cards" && (
              <div className="grid grid-cols-1 gap-6">
                {rankedCandidates.map((cand, index) => {
                  const draftScore = draftVotes[cand.id] ?? 5;
                  const confirmedScore = confirmedVotes[cand.id] ?? 5;
                  const isDirty = draftScore !== confirmedScore;
                  const isFeedback = confirmedFeedback[cand.id];
                  const isWinner = index === 0;

                  return (
                    <div
                      key={cand.id}
                      className={`glass-card p-6 rounded-3xl border transition-all ${
                        isWinner
                          ? "border-amber-500/50 bg-gradient-to-r from-amber-950/20 via-gray-900/60 to-gray-900/40 shadow-xl shadow-amber-950/20"
                          : "border-white/10 hover:border-white/25 bg-[#0C111D]/80"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Rank Badge & Cover Image */}
                        <div className="relative shrink-0">
                          <img
                            src={cand.imageUrl}
                            alt={cand.title}
                            className="w-28 h-40 object-cover rounded-2xl border border-white/15 shadow-md"
                          />
                          {/* Insignia de Ranking Adaptable */}
                          {isWinner ? (
                            <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg border border-amber-300">
                              #1
                            </span>
                          ) : (
                            <span
                              className="absolute -top-3 -left-3 w-8 h-8 rounded-full text-sm font-extrabold flex items-center justify-center shadow-lg border"
                              style={{
                                backgroundColor: isNeutral ? "rgba(255, 255, 255, 0.15)" : `rgba(${theme.primaryRgb}, 0.25)`,
                                color: isNeutral ? "#FFFFFF" : theme.primaryColor,
                                borderColor: isNeutral ? "rgba(255, 255, 255, 0.3)" : `rgba(${theme.primaryRgb}, 0.5)`,
                              }}
                            >
                              #{index + 1}
                            </span>
                          )}
                        </div>

                        {/* Candidate Details */}
                        <div className="flex-1 w-full space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h3 className="text-xl font-bold text-white">{cand.title}</h3>
                              <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                                <span>Postulado por: <strong>{cand.suggestedBy}</strong></span>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {cand.malScore} MAL
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-gray-300">
                                  <Clock className="w-3.5 h-3.5 text-white" /> {cand.episodesCount} eps
                                </span>
                              </div>
                            </div>

                            {/* Happiness Score Badge */}
                            <div className="flex items-center gap-2.5 bg-black/60 px-4 py-2 rounded-2xl border border-white/15 shrink-0">
                              <Sparkles className="w-5 h-5 text-amber-400" />
                              <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                                  Felicidad Grupal
                                </span>
                                <span className="text-lg font-black text-amber-400 leading-none">
                                  {cand.result.finalScore} <span className="text-xs font-normal text-gray-500">/ 10</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Explanations: Totalmente adaptativas al tema activo o neutro (adiós morado fijo) */}
                          <div className="space-y-1.5">
                            {cand.result.explanations.map((exp, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 text-xs px-3.5 py-2 rounded-xl border transition-all"
                                style={{
                                  backgroundColor: isNeutral
                                    ? "rgba(255, 255, 255, 0.05)"
                                    : `rgba(${theme.primaryRgb}, 0.12)`,
                                  borderColor: isNeutral
                                    ? "rgba(255, 255, 255, 0.15)"
                                    : `rgba(${theme.primaryRgb}, 0.35)`,
                                  color: isNeutral ? "#E2E8F0" : "white",
                                }}
                              >
                                <Info
                                  className="w-3.5 h-3.5 shrink-0"
                                  style={{ color: isNeutral ? "#FFFFFF" : theme.primaryColor }}
                                />
                                <span>{exp}</span>
                              </div>
                            ))}
                          </div>

                          {/* DUAL VOTING SECTION (Slider + Direct Numeric Input + Votar Button) */}
                          <div className="pt-4 border-t border-white/10 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <label className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                                <Vote className="w-4 h-4 text-white" /> Tu Nivel de Ganas (0 a 10):
                              </label>

                              {/* Direct Numeric Input + Votar Button */}
                              <div className="flex items-center gap-2 self-start sm:self-auto">
                                <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-xl border border-white/20">
                                  <span className="text-xs text-gray-400 font-semibold">Score:</span>
                                  <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.5"
                                    value={draftScore}
                                    onChange={(e) => handleDraftChange(cand.id, parseFloat(e.target.value))}
                                    className="w-14 bg-black text-white font-extrabold text-sm px-2 py-0.5 rounded-lg border border-white/30 text-center focus:outline-none focus:border-white"
                                  />
                                  <span className="text-xs text-gray-400 font-bold">/ 10</span>
                                </div>

                                {/* Button "Votar" / Confirmar Adaptativo */}
                                <button
                                  onClick={() => handleConfirmVote(cand.id)}
                                  className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 ${
                                    isFeedback
                                      ? "bg-emerald-500 text-gray-950 border border-emerald-400"
                                      : isDirty
                                      ? isNeutral
                                        ? "bg-white text-black hover:bg-slate-200 animate-pulse"
                                        : "text-white animate-pulse"
                                      : "bg-white/10 hover:bg-white/15 text-gray-300"
                                  }`}
                                  style={
                                    !isFeedback && isDirty && !isNeutral
                                      ? {
                                          background: theme.primaryColor,
                                          color: activeTextColor,
                                          boxShadow: `0 4px 14px rgba(${theme.primaryRgb}, 0.3)`,
                                        }
                                      : undefined
                                  }
                                >
                                  {isFeedback ? (
                                    <>
                                      <Check className="w-4 h-4 text-gray-950" /> ¡Voto Guardado!
                                    </>
                                  ) : isDirty ? (
                                    <>
                                      <Vote
                                        className="w-4 h-4"
                                        style={{ color: isNeutral ? "#05070B" : activeTextColor }}
                                      />{" "}
                                      Votar
                                    </>
                                  ) : (
                                    <>
                                      <Check className="w-4 h-4 text-emerald-400" /> Votado ({confirmedScore})
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Range Slider Adaptativo */}
                            <input
                              type="range"
                              min="0"
                              max="10"
                              step="0.5"
                              value={draftScore}
                              onChange={(e) => handleDraftChange(cand.id, parseFloat(e.target.value))}
                              className="w-full h-2.5 bg-black/60 rounded-lg appearance-none cursor-pointer"
                              style={{
                                accentColor: isNeutral ? "#FFFFFF" : theme.primaryColor,
                              }}
                            />
                            <div className="flex justify-between text-[10px] text-gray-500 font-semibold">
                              <span>0 (Paso)</span>
                              <span>5 (Neutral)</span>
                              <span>10 (¡Muchas ganas!)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* MODO 2: VISTA LISTA COMPACTA (RÁPIDA Y PANORÁMICA) */}
            {viewMode === "compact" && (
              <div className="glass-panel rounded-3xl border border-white/15 overflow-hidden divide-y divide-white/10">
                {rankedCandidates.map((cand, index) => {
                  const draftScore = draftVotes[cand.id] ?? 5;
                  const confirmedScore = confirmedVotes[cand.id] ?? 5;
                  const isDirty = draftScore !== confirmedScore;
                  const isFeedback = confirmedFeedback[cand.id];

                  return (
                    <div
                      key={cand.id}
                      className="p-4 hover:bg-white/[0.04] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      {/* Left: Rank + Thumbnail + Title + Metadata */}
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <span
                          className="w-7 h-7 rounded-full font-black text-xs flex items-center justify-center border shrink-0"
                          style={{
                            backgroundColor: isNeutral ? "rgba(255, 255, 255, 0.1)" : `rgba(${theme.primaryRgb}, 0.2)`,
                            color: isNeutral ? "#FFFFFF" : theme.primaryColor,
                            borderColor: isNeutral ? "rgba(255, 255, 255, 0.2)" : `rgba(${theme.primaryRgb}, 0.4)`,
                          }}
                        >
                          #{index + 1}
                        </span>

                        <img
                          src={cand.imageUrl}
                          alt={cand.title}
                          className="w-12 h-16 object-cover rounded-xl border border-white/15 shrink-0 shadow-sm"
                        />

                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-extrabold text-white truncate">{cand.title}</h4>
                          <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                            <span className="flex items-center gap-1 text-amber-400 font-bold">
                              ★ {cand.malScore}
                            </span>
                            <span>•</span>
                            <span>{cand.episodesCount} eps</span>
                            <span>•</span>
                            <span>Por {cand.suggestedBy}</span>
                          </div>
                        </div>
                      </div>

                      {/* Center: Happiness Badge */}
                      <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-white/15 shrink-0">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <div>
                          <span className="text-[9px] text-gray-400 uppercase font-bold block leading-none">
                            Felicidad
                          </span>
                          <span className="text-sm font-black text-amber-400">
                            {cand.result.finalScore} / 10
                          </span>
                        </div>
                      </div>

                      {/* Right: Inline Dual Input + Votar Button */}
                      <div className="flex items-center gap-3 shrink-0">
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.5"
                          value={draftScore}
                          onChange={(e) => handleDraftChange(cand.id, parseFloat(e.target.value))}
                          className="w-24 sm:w-32 h-2 bg-black/60 rounded-lg appearance-none cursor-pointer"
                          style={{
                            accentColor: isNeutral ? "#FFFFFF" : theme.primaryColor,
                          }}
                        />

                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          value={draftScore}
                          onChange={(e) => handleDraftChange(cand.id, parseFloat(e.target.value))}
                          className="w-12 bg-black text-white font-bold text-xs px-1.5 py-1 rounded-lg border border-white/20 text-center"
                        />

                        <button
                          onClick={() => handleConfirmVote(cand.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            isFeedback
                              ? "bg-emerald-500 text-gray-950"
                              : isDirty
                              ? isNeutral
                                ? "bg-white text-black font-extrabold animate-pulse"
                                : "text-white animate-pulse"
                              : "bg-white/10 text-gray-300 hover:bg-white/20"
                          }`}
                          style={
                            !isFeedback && isDirty && !isNeutral
                              ? {
                                  background: theme.primaryColor,
                                  color: activeTextColor,
                                }
                              : undefined
                          }
                        >
                          {isFeedback ? "¡Guardado!" : isDirty ? "Votar" : "Votado"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de Configuración de Criterios Ideales del Grupo */}
      <GroupCriteriaModal
        isOpen={isCriteriaModalOpen}
        onClose={() => setIsCriteriaModalOpen(false)}
        initialCriteria={groupCriteria}
        onSaveCriteria={(newCriteria) => setGroupCriteria(newCriteria)}
      />

      {/* Modal de Confirmación para Abandonar la Lista Grupal (Visual 1) */}
      <ConfirmLeaveGroupModal
        isOpen={isLeaveModalOpen}
        groupName={listName}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={handleConfirmLeaveGroup}
      />
    </div>
  );
}


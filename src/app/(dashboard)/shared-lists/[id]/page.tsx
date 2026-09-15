"use client";

import { useState } from "react";
import Navbar from "@/components/common/Navbar";
import Link from "next/link";
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
} from "lucide-react";
import { calculateHappinessScore } from "@/core/algorithms/happiness-score";
import HappinessAnalyticsChart from "@/components/shared-lists/HappinessAnalyticsChart";
import GroupCriteriaModal, { GroupCriteriaState } from "@/components/shared-lists/GroupCriteriaModal";

export default function SharedListWorkspacePage({ params }: { params: { id: string } }) {
  // Pestaña principal y modo de visualización de candidatos
  const [mainTab, setMainTab] = useState<"voting" | "analytics">("voting");
  const [viewMode, setViewMode] = useState<"cards" | "compact">("cards");

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

  // Manejar cambio en borrador (Slider o Input Numérico) - NO REORDENA EL RANKING
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
    navigator.clipboard.writeText("https://animigos.com/join/viernes2026");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
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
        {/* Group Header */}
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-bold bg-purple-950 text-purple-300 border border-purple-800 rounded-full">
                ● Votación en Tiempo Real
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-cyan-400" /> 4 integrantes (1 Invitado)
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Anime de los Viernes 🍿
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Ajusta tu puntuación por slider o número y presiona <strong className="text-purple-300">Votar</strong> para confirmar y actualizar el ranking.
            </p>

            {/* Active Group Criteria Banner */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
              <span className="text-gray-400 font-semibold flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" /> Criterios del Grupo:
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-gray-900 text-purple-300 border border-purple-800/40 font-bold">
                ⏱️ {groupCriteria.minEpisodes}-{groupCriteria.maxEpisodes} caps
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-gray-900 text-cyan-300 border border-cyan-800/40 font-bold">
                🎬 {groupCriteria.genres.join(", ")}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-gray-900 text-amber-300 border border-amber-800/40 font-bold">
                📅 {groupCriteria.minYear}-{groupCriteria.maxYear}
              </span>
              {groupCriteria.unseenByMembersOnly && (
                <span className="px-2.5 py-0.5 rounded-lg bg-rose-950 text-rose-300 border border-rose-800/40 font-bold">
                  👁️ No vistos
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap md:flex-nowrap">
            <button
              onClick={() => setIsCriteriaModalOpen(true)}
              className="px-4 py-2.5 text-sm font-semibold text-purple-200 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/50 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4 text-purple-400" />
              <span>Criterios Ideales</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 text-sm font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? "¡Link Copiado!" : "Invitar Amigos"}</span>
            </button>

            <Link
              href="/anime"
              className="px-4 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" /> Postular Anime
            </Link>
          </div>
        </div>

        {/* Control Bar: Pestañas Principales (Lista vs Gráfico) + Modos de Vista (Cards vs Lista Compacta) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-gray-900/80 border border-gray-800">
          {/* Main Tab Switcher */}
          <div className="flex items-center bg-gray-950 p-1 rounded-2xl border border-gray-800 text-xs font-bold">
            <button
              onClick={() => setMainTab("voting")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                mainTab === "voting"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Vote className="w-4 h-4 text-purple-300" /> 📋 Lista de Votación
            </button>
            <button
              onClick={() => setMainTab("analytics")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                mainTab === "analytics"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <BarChart3 className="w-4 h-4 text-amber-400" /> 📊 Gráfico & Análisis de Felicidad
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

              <div className="flex items-center bg-gray-950 p-1 rounded-2xl border border-gray-800 text-xs font-semibold">
                <button
                  onClick={() => setViewMode("cards")}
                  title="Vista Tarjetas (Detallada)"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    viewMode === "cards"
                      ? "bg-gray-800 text-white shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-purple-400" /> Tarjetas
                </button>
                <button
                  onClick={() => setViewMode("compact")}
                  title="Vista Lista Compacta (Rápida)"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    viewMode === "compact"
                      ? "bg-gray-800 text-white shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <List className="w-3.5 h-3.5 text-cyan-400" /> Lista Compacta
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
                          : "border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Rank Badge & Cover Image */}
                        <div className="relative shrink-0">
                          <img
                            src={cand.imageUrl}
                            alt={cand.title}
                            className="w-28 h-40 object-cover rounded-2xl border border-gray-700 shadow-md"
                          />
                          <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 text-white font-extrabold text-sm flex items-center justify-center shadow-lg">
                            #{index + 1}
                          </span>
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
                                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> {cand.episodesCount} eps
                                </span>
                              </div>
                            </div>

                            {/* Happiness Score Badge */}
                            <div className="flex items-center gap-2.5 bg-gray-900/90 px-4 py-2 rounded-2xl border border-gray-700/80 shrink-0">
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

                          {/* Explanations */}
                          <div className="space-y-1.5">
                            {cand.result.explanations.map((exp, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 text-xs text-purple-200 bg-purple-950/30 px-3 py-1.5 rounded-xl border border-purple-900/40"
                              >
                                <Info className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                <span>{exp}</span>
                              </div>
                            ))}
                          </div>

                          {/* DUAL VOTING SECTION (Slider + Direct Numeric Input + Votar Button) */}
                          <div className="pt-4 border-t border-gray-800/80 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <label className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                                <Vote className="w-4 h-4 text-cyan-400" /> Tu Nivel de Ganas (0 a 10):
                              </label>

                              {/* Direct Numeric Input + Votar Button */}
                              <div className="flex items-center gap-2 self-start sm:self-auto">
                                <div className="flex items-center gap-1.5 bg-gray-900 px-3 py-1 rounded-xl border border-gray-700">
                                  <span className="text-xs text-gray-400 font-semibold">Score:</span>
                                  <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.5"
                                    value={draftScore}
                                    onChange={(e) => handleDraftChange(cand.id, parseFloat(e.target.value))}
                                    className="w-14 bg-gray-800 text-white font-extrabold text-sm px-2 py-0.5 rounded-lg border border-cyan-500/50 text-center focus:outline-none focus:ring-1 focus:ring-cyan-400"
                                  />
                                  <span className="text-xs text-gray-400 font-bold">/ 10</span>
                                </div>

                                {/* Button "Votar" / Confirmar */}
                                <button
                                  onClick={() => handleConfirmVote(cand.id)}
                                  className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                                    isFeedback
                                      ? "bg-emerald-500 text-gray-950 border border-emerald-400"
                                      : isDirty
                                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30 animate-pulse"
                                      : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                                  }`}
                                >
                                  {isFeedback ? (
                                    <>
                                      <Check className="w-4 h-4 text-gray-950" /> ¡Voto Guardado!
                                    </>
                                  ) : isDirty ? (
                                    <>
                                      <Vote className="w-4 h-4 text-purple-300" /> Votar
                                    </>
                                  ) : (
                                    <>
                                      <Check className="w-4 h-4 text-emerald-400" /> Votado ({confirmedScore})
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Range Slider */}
                            <input
                              type="range"
                              min="0"
                              max="10"
                              step="0.5"
                              value={draftScore}
                              onChange={(e) => handleDraftChange(cand.id, parseFloat(e.target.value))}
                              className="w-full h-2.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
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
              <div className="glass-panel rounded-3xl border border-gray-800 overflow-hidden divide-y divide-gray-800/80">
                {rankedCandidates.map((cand, index) => {
                  const draftScore = draftVotes[cand.id] ?? 5;
                  const confirmedScore = confirmedVotes[cand.id] ?? 5;
                  const isDirty = draftScore !== confirmedScore;
                  const isFeedback = confirmedFeedback[cand.id];

                  return (
                    <div
                      key={cand.id}
                      className="p-4 hover:bg-slate-900/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      {/* Left: Rank + Thumbnail + Title + Metadata */}
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-purple-950 text-purple-300 font-black text-xs flex items-center justify-center border border-purple-800 shrink-0">
                          #{index + 1}
                        </span>

                        <img
                          src={cand.imageUrl}
                          alt={cand.title}
                          className="w-12 h-16 object-cover rounded-xl border border-gray-700 shrink-0 shadow-sm"
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
                      <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-xl border border-gray-800 shrink-0">
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
                          className="w-24 sm:w-32 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                        />

                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          value={draftScore}
                          onChange={(e) => handleDraftChange(cand.id, parseFloat(e.target.value))}
                          className="w-12 bg-gray-900 text-white font-bold text-xs px-1.5 py-1 rounded-lg border border-cyan-500/50 text-center"
                        />

                        <button
                          onClick={() => handleConfirmVote(cand.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            isFeedback
                              ? "bg-emerald-500 text-gray-950"
                              : isDirty
                              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white animate-pulse"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
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
    </div>
  );
}

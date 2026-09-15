"use client";

import { useState } from "react";
import { HappinessScoreResult } from "@/core/algorithms/happiness-score";
import { Sparkles, Trophy, BarChart3, Users, Star, Clock, Info, ShieldCheck, AlertTriangle, Filter, Target, Zap } from "lucide-react";

export interface CandidateWithResult {
  id: string;
  malId: number;
  title: string;
  imageUrl: string;
  malScore: number;
  malScoredBy: number;
  suggestedBy: string;
  episodesCount?: number;
  result: HappinessScoreResult;
}

interface HappinessAnalyticsChartProps {
  candidates: CandidateWithResult[];
}

// Colores armonizados para los candidatos
const CANDIDATE_COLORS = [
  { stroke: "#F59E0B", fill: "rgba(245, 158, 11, 0.25)", text: "text-amber-400", bg: "bg-amber-500" }, // #1 Gold/Amber
  { stroke: "#A855F7", fill: "rgba(168, 85, 247, 0.25)", text: "text-purple-400", bg: "bg-purple-500" }, // #2 Purple
  { stroke: "#06B6D4", fill: "rgba(6, 182, 212, 0.25)", text: "text-cyan-400", bg: "bg-cyan-500" },   // #3 Cyan
  { stroke: "#10B981", fill: "rgba(16, 185, 129, 0.25)", text: "text-emerald-400", bg: "bg-emerald-500" }, // #4 Emerald
];

export default function HappinessAnalyticsChart({ candidates }: HappinessAnalyticsChartProps) {
  const [selectedTab, setSelectedTab] = useState<"stacked" | "radar" | "quadrant">("quadrant");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  if (!candidates || candidates.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-gray-800 text-center text-gray-400">
        No hay candidatos disponibles para el análisis.
      </div>
    );
  }

  // Candidatos ordenados por Felicidad Final
  const ranked = [...candidates].sort((a, b) => b.result.finalScore - a.result.finalScore);
  const winner = ranked[0];

  // Cálculo para el Radar SVG
  const numAxes = 5;
  const radius = 90;
  const cx = 140;
  const cy = 130;
  const axesLabels = ["Ganas Grupo", "Nota MAL", "Consenso", "Duración", "Quórum"];

  const getPointCoordinates = (axisIndex: number, valueNormalized: number) => {
    const angle = (axisIndex * 2 * Math.PI) / numAxes - Math.PI / 2;
    const r = Math.max(5, Math.min(radius, radius * valueNormalized));
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Resumen Ejecutivo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ganador */}
        <div className="glass-card p-5 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-gray-900 to-gray-950 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shrink-0 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-[#0B0F17] rounded-[14px] flex items-center justify-center">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider block">
              Mejor Opción Grupal
            </span>
            <h3 className="text-sm font-extrabold text-white truncate">{winner.title}</h3>
            <span className="text-sm font-black text-amber-400">
              {winner.result.finalScore} <span className="text-[10px] text-gray-400 font-normal">/ 10 pts</span>
            </span>
          </div>
        </div>

        {/* Consenso del Grupo */}
        <div className="glass-card p-5 rounded-3xl border border-purple-800/40 bg-gradient-to-br from-purple-950/30 via-gray-900 to-gray-950 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-900/60 border border-purple-700/50 flex items-center justify-center text-purple-400 shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-purple-300 font-extrabold uppercase tracking-wider block">
              Dispersión Promedio
            </span>
            <span className="text-lg font-black text-white">
              ±{(ranked.reduce((sum, c) => sum + c.result.interestDispersion, 0) / ranked.length).toFixed(2)} SD
            </span>
            <p className="text-[10px] text-gray-400">Nivel de acuerdo en votos</p>
          </div>
        </div>

        {/* Participación / Quórum */}
        <div className="glass-card p-5 rounded-3xl border border-cyan-800/40 bg-gradient-to-br from-cyan-950/30 via-gray-900 to-gray-950 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-900/60 border border-cyan-700/50 flex items-center justify-center text-cyan-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-cyan-300 font-extrabold uppercase tracking-wider block">
              Quórum del Grupo
            </span>
            <span className="text-lg font-black text-white">
              {Math.round(ranked.reduce((sum, c) => sum + c.result.quorumPercentage, 0) / ranked.length)}%
            </span>
            <p className="text-[10px] text-gray-400">Votos emitidos vs esperados</p>
          </div>
        </div>
      </div>

      {/* 2. Selector de Modos de Gráfico Intuitivo */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800/80">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" /> Visualizador de Felicidad Grupal
            </h3>
            <p className="text-xs text-gray-400">
              Selecciona el tipo de gráfico para comparar las opciones de manera rápida e intuitiva
            </p>
          </div>

          {/* Subtabs del Gráfico */}
          <div className="flex bg-gray-950 p-1 rounded-2xl border border-gray-800 text-xs font-bold self-start sm:self-auto">
            <button
              onClick={() => setSelectedTab("quadrant")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedTab === "quadrant"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Matriz de Decisión (2D)
            </button>
            <button
              onClick={() => setSelectedTab("stacked")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedTab === "stacked"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" /> Desglose Apilado
            </button>
            <button
              onClick={() => setSelectedTab("radar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedTab === "radar"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Target className="w-3.5 h-3.5 text-pink-400" /> Gráfico Radar (5 Ejes)
            </button>
          </div>
        </div>

        {/* GRÁFICO TIPO 1: MATRIZ DE POSICIONAMIENTO 2D (CUADRANTES) */}
        {selectedTab === "quadrant" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="font-semibold">
                Eje X: <strong>Consenso Grupal</strong> (Baja Dispersión) | Eje Y: <strong>Ganas del Grupo</strong>
              </span>
              <span>Haz clic en un anime para resaltar</span>
            </div>

            {/* Cuadrante 2D Visual */}
            <div className="relative w-full h-[320px] bg-slate-950/80 rounded-2xl border border-gray-800 p-4 overflow-hidden flex flex-col justify-between">
              {/* Fondo con 4 Cuadrantes Etiquetados */}
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none divide-x divide-y divide-gray-800/60">
                {/* Cuadrante Superior Izquierdo: Amor u Odio */}
                <div className="p-3 bg-purple-950/10 flex flex-col justify-start items-start">
                  <span className="text-[10px] font-extrabold text-purple-400/70 uppercase tracking-wider bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/30">
                    ⚡ Amor u Odio (Polarizado)
                  </span>
                  <span className="text-[9px] text-gray-500 mt-0.5">Altas ganas pero desacuerdo</span>
                </div>

                {/* Cuadrante Superior Derecho: Ganador Seguro */}
                <div className="p-3 bg-amber-950/10 flex flex-col justify-start items-end text-right">
                  <span className="text-[10px] font-extrabold text-amber-400/90 uppercase tracking-wider bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/30">
                    🌟 Ganador Seguro
                  </span>
                  <span className="text-[9px] text-gray-500 mt-0.5">Altas ganas + Alto consenso</span>
                </div>

                {/* Cuadrante Inferior Izquierdo: Descartado */}
                <div className="p-3 bg-rose-950/10 flex flex-col justify-end items-start">
                  <span className="text-[10px] font-extrabold text-rose-400/70 uppercase tracking-wider bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/30">
                    ❌ Descartado
                  </span>
                  <span className="text-[9px] text-gray-500 mt-0.5">Pocas ganas + Desacuerdo</span>
                </div>

                {/* Cuadrante Inferior Derecho: Pasable */}
                <div className="p-3 bg-cyan-950/10 flex flex-col justify-end items-end text-right">
                  <span className="text-[10px] font-extrabold text-cyan-400/70 uppercase tracking-wider bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">
                    😴 Opción Segura
                  </span>
                  <span className="text-[9px] text-gray-500 mt-0.5">Ganas moderadas + Alto consenso</span>
                </div>
              </div>

              {/* Puntos Interactivos de los Candidatos */}
              <div className="relative w-full h-full">
                {ranked.map((cand, idx) => {
                  const colorConfig = CANDIDATE_COLORS[idx % CANDIDATE_COLORS.length];
                  
                  // X-axis: Consensus (0 to 10). Consensus = Math.max(0, 10 - dispersion * 2.5)
                  const consensusScore = Math.max(5, Math.min(95, (10 - cand.result.interestDispersion * 2.2) * 10));
                  // Y-axis: Interest Mean (0 to 10)
                  const interestY = Math.max(10, Math.min(90, (cand.result.interestMean / 10) * 100));

                  const isSelected = selectedCandidateId === cand.id;

                  return (
                    <div
                      key={cand.id}
                      onClick={() => setSelectedCandidateId(isSelected ? null : cand.id)}
                      style={{ left: `${consensusScore}%`, bottom: `${interestY}%` }}
                      className={`absolute -translate-x-1/2 translate-y-1/2 cursor-pointer transition-all duration-300 z-10 group ${
                        isSelected ? "scale-125 z-30" : "hover:scale-110"
                      }`}
                    >
                      {/* Circular Avatar Node with Anime Cover Image */}
                      <div
                        className="w-12 h-12 rounded-full relative shadow-xl border-2 transition-transform duration-200 group-hover:scale-110"
                        style={{
                          backgroundColor: "#0B0F17",
                          borderColor: colorConfig.stroke,
                          boxShadow: `0 0 18px ${colorConfig.stroke}80`,
                        }}
                      >
                        <img
                          src={cand.imageUrl}
                          alt={cand.title}
                          className="w-full h-full object-cover rounded-full"
                        />
                        <span
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#0B0F17] text-white border font-black text-[9px] flex items-center justify-center shadow-md"
                          style={{ borderColor: colorConfig.stroke }}
                        >
                          #{idx + 1}
                        </span>
                      </div>

                      {/* Tooltip Label */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center bg-[#0F172A] border border-purple-500/50 px-3 py-1.5 rounded-xl shadow-2xl z-40 whitespace-nowrap">
                        <span className="text-xs font-bold text-white">{cand.title}</span>
                        <span className="text-[10px] text-gray-300">
                          Ganas: {cand.result.interestMean} • SD: ±{cand.result.interestDispersion}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leyenda de Candidatos */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {ranked.map((cand, idx) => {
                const colorConfig = CANDIDATE_COLORS[idx % CANDIDATE_COLORS.length];
                const isSelected = selectedCandidateId === cand.id;

                return (
                  <button
                    key={cand.id}
                    onClick={() => setSelectedCandidateId(isSelected ? null : cand.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? "bg-gray-800 text-white border-white"
                        : "bg-gray-900/80 text-gray-300 border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: colorConfig.stroke }}
                    />
                    <span>#{idx + 1} {cand.title}</span>
                    <span className="text-[10px] text-amber-400 font-extrabold ml-1">
                      ({cand.result.finalScore})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* GRÁFICO TIPO 2: DESGLOSE APILADO DE PUNTUACIÓN (FACTOR STACKED BARS) */}
        {selectedTab === "stacked" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Desglose de contribución por cada factor del Algoritmo de Felicidad (0 - 10 pts)</span>
              <div className="flex items-center gap-3 text-[10px] font-bold">
                <span className="flex items-center gap-1 text-purple-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Ganas Grupo
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Nota MAL
                </span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Duración
                </span>
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Penalización Dispersión
                </span>
              </div>
            </div>

            <div className="space-y-5">
              {ranked.map((cand, idx) => {
                const interestPct = (cand.result.interestMean / 10) * 100;
                const malPct = (cand.result.malScoreContribution / 10) * 100;
                const durationPct = (Math.max(0, cand.result.durationContribution) / 10) * 100;
                const penaltyPct = (cand.result.dispersionPenalty / 10) * 100;

                return (
                  <div key={cand.id} className="p-4 rounded-2xl bg-slate-950/60 border border-gray-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-white flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-gray-800 text-purple-400 font-black text-[10px] flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        {cand.title}
                      </span>
                      <span className="font-black text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-lg border border-amber-800/40">
                        Score Final: {cand.result.finalScore} / 10
                      </span>
                    </div>

                    {/* Stacked Progress Bar */}
                    <div className="w-full h-4 bg-gray-900 rounded-full overflow-hidden flex border border-gray-800/80">
                      {/* Factor 1: Ganas del Grupo */}
                      <div
                        style={{ width: `${interestPct}%` }}
                        className="h-full bg-purple-500 hover:brightness-110 transition-all"
                        title={`Ganas del Grupo: ${cand.result.interestMean} pts`}
                      />
                      {/* Factor 2: Nota MAL */}
                      <div
                        style={{ width: `${malPct}%` }}
                        className="h-full bg-amber-400 hover:brightness-110 transition-all"
                        title={`Aporte MAL: +${cand.result.malScoreContribution} pts`}
                      />
                      {/* Factor 3: Duración */}
                      {durationPct > 0 && (
                        <div
                          style={{ width: `${durationPct}%` }}
                          className="h-full bg-cyan-400 hover:brightness-110 transition-all"
                          title={`Bono Duración: +${cand.result.durationContribution} pts`}
                        />
                      )}
                      {/* Factor 4: Penalización Dispersión */}
                      <div
                        style={{ width: `${penaltyPct}%` }}
                        className="h-full bg-rose-500/80 hover:brightness-110 transition-all"
                        title={`Penalización Dispersión: -${cand.result.dispersionPenalty} pts`}
                      />
                    </div>

                    {/* Footnote Breakdown Values */}
                    <div className="flex flex-wrap items-center justify-between text-[10px] text-gray-400 pt-1 font-semibold">
                      <span className="text-purple-300">Ganas: +{cand.result.interestMean}</span>
                      <span className="text-amber-300">Calidad MAL: +{cand.result.malScoreContribution}</span>
                      <span className="text-cyan-300">Duración: +{cand.result.durationContribution}</span>
                      <span className="text-rose-400">Descuento Polarización: -{cand.result.dispersionPenalty}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GRÁFICO TIPO 3: RADAR EN 5 EJES (VECTOR SVG) */}
        {selectedTab === "radar" && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* SVG Radar Chart */}
            <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
              <svg width="280" height="260" viewBox="0 0 280 260" className="overflow-visible">
                {/* Concertric Circles / Grid Web */}
                {[0.25, 0.5, 0.75, 1.0].map((level, i) => (
                  <polygon
                    key={i}
                    points={Array.from({ length: numAxes })
                      .map((_, aIdx) => {
                        const { x, y } = getPointCoordinates(aIdx, level);
                        return `${x},${y}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray={level === 1.0 ? undefined : "3 3"}
                  />
                ))}

                {/* Axis Radial Lines */}
                {Array.from({ length: numAxes }).map((_, aIdx) => {
                  const { x, y } = getPointCoordinates(aIdx, 1.0);
                  return (
                    <line
                      key={aIdx}
                      x1={cx}
                      y1={cy}
                      x2={x}
                      y2={y}
                      stroke="#475569"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Axis Labels */}
                {axesLabels.map((lbl, aIdx) => {
                  const { x, y } = getPointCoordinates(aIdx, 1.2);
                  return (
                    <text
                      key={aIdx}
                      x={x}
                      y={y}
                      fill="#94A3B8"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {lbl}
                    </text>
                  );
                })}

                {/* Candidate Polygon Shapes */}
                {ranked.map((cand, idx) => {
                  const colorConfig = CANDIDATE_COLORS[idx % CANDIDATE_COLORS.length];
                  
                  // Values for the 5 axes normalized 0-1
                  const vGroup = cand.result.interestMean / 10;
                  const vMal = (cand.malScore || 7) / 10;
                  const vConsensus = Math.max(0.1, (10 - cand.result.interestDispersion * 2.5) / 10);
                  const vDuration = cand.result.durationContribution >= 0 ? 0.9 : 0.4;
                  const vQuorum = cand.result.quorumPercentage / 100;

                  const values = [vGroup, vMal, vConsensus, vDuration, vQuorum];

                  const pointsString = values
                    .map((v, aIdx) => {
                      const { x, y } = getPointCoordinates(aIdx, v);
                      return `${x},${y}`;
                    })
                    .join(" ");

                  const isSelected = selectedCandidateId === null || selectedCandidateId === cand.id;

                  return (
                    <g key={cand.id} opacity={isSelected ? 1 : 0.2} className="transition-opacity duration-300">
                      <polygon
                        points={pointsString}
                        fill={colorConfig.fill}
                        stroke={colorConfig.stroke}
                        strokeWidth="2.5"
                      />
                      {values.map((v, aIdx) => {
                        const { x, y } = getPointCoordinates(aIdx, v);
                        return (
                          <circle
                            key={aIdx}
                            cx={x}
                            cy={y}
                            r="3.5"
                            fill={colorConfig.stroke}
                          />
                        );
                      })}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Radar Legend & Interactive Details */}
            <div className="flex-1 w-full space-y-3">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                Leyenda de Comparación Radar
              </h4>

              <div className="space-y-2">
                {ranked.map((cand, idx) => {
                  const colorConfig = CANDIDATE_COLORS[idx % CANDIDATE_COLORS.length];
                  const isSelected = selectedCandidateId === cand.id;

                  return (
                    <div
                      key={cand.id}
                      onClick={() => setSelectedCandidateId(isSelected ? null : cand.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-slate-900 border-purple-500/50"
                          : "bg-slate-950/60 border-gray-800 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-md"
                          style={{ backgroundColor: colorConfig.stroke }}
                        />
                        <div>
                          <span className="text-xs font-bold text-white block">
                            #{idx + 1} {cand.title}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            MAL: {cand.malScore} • Ganas: {cand.result.interestMean} • SD: ±{cand.result.interestDispersion}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-black text-amber-400">
                        {cand.result.finalScore} / 10
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Lista de Explicabilidad Detallada */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-3">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-purple-400" /> Resumen de Factores Clave del Algoritmo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ranked.map((cand) => (
            <div key={cand.id} className="p-3.5 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-1">
              <span className="text-xs font-bold text-white block">{cand.title}</span>
              {cand.result.explanations.map((exp, i) => (
                <p key={i} className="text-[11px] text-gray-300 leading-relaxed flex items-start gap-1.5">
                  <span className="text-purple-400">•</span>
                  <span>{exp}</span>
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

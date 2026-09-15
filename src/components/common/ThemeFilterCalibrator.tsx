"use client";

import React, { useState } from "react";
import { useTheme, ThemeFilterSetting } from "@/core/contexts/ThemeContext";
import { GENRE_THEMES } from "@/core/utils/score-theme";
import {
  Sliders,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  X,
  ChevronDown,
  Layers,
  Eye,
  Info,
} from "lucide-react";

export default function ThemeFilterCalibrator() {
  const {
    themeId,
    setManualTheme,
    getThemeFilterSetting,
    updateThemeFilter,
    resetThemeFilter,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<string>(themeId);
  const [copied, setCopied] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Sync selected theme with context theme when opened
  const currentThemeId = selectedThemeId || themeId;
  const currentThemeConfig = GENRE_THEMES[currentThemeId] || GENRE_THEMES.RomanceYuri;
  const currentFilter = getThemeFilterSetting(currentThemeId);

  const handleSelectTheme = (id: string) => {
    setSelectedThemeId(id);
    setManualTheme(id);
  };

  const handleFilterOpacityChange = (val: number) => {
    updateThemeFilter(currentThemeId, { filterOpacity: val });
  };

  const handleCanvasOpacityChange = (val: number) => {
    updateThemeFilter(currentThemeId, { canvasOpacity: val });
  };

  const handleBlurChange = (val: number) => {
    updateThemeFilter(currentThemeId, { blur: val });
  };

  const handleFireworksSpeedChange = (val: number) => {
    updateThemeFilter(currentThemeId, { fireworksSpeed: val });
  };

  const handlePreset = (filterOpacity: number, canvasOpacity?: number) => {
    updateThemeFilter(currentThemeId, {
      filterOpacity,
      ...(canvasOpacity !== undefined ? { canvasOpacity } : {}),
    });
  };

  const handleCopySettings = () => {
    const exportData: Record<string, ThemeFilterSetting> = {};
    Object.keys(GENRE_THEMES).forEach((id) => {
      exportData[id] = getThemeFilterSetting(id);
    });

    const jsonStr = JSON.stringify(exportData, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    });
  };

  const getFilterCategoryLabel = (opacity: number) => {
    if (opacity < 0.5) return "Brillante / Fondo muy visible";
    if (opacity < 0.72) return "Equilibrado / Semi-tenue";
    if (opacity <= 0.88) return "Confortable (Estilo Mi Lista)";
    return "Oscuro Profundo / Máxima Atenuación";
  };

  return (
    <>
      {/* Floating Minimized Pill / Button */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce-subtle">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-800 text-white border border-amber-500/50 hover:border-amber-400 shadow-[0_4px_25px_rgba(245,158,11,0.35)] backdrop-blur-xl transition-all duration-300 group"
            title="Herramienta temporal para calibrar filtros oscuros de temas"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
              <Sliders className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[12px] font-black text-amber-300 flex items-center gap-1.5 leading-none">
                <span>🛠️ Calibrador de Filtros</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200">
                  Temporal
                </span>
              </div>
              <div className="text-[11px] text-gray-300 flex items-center gap-1.5 mt-0.5">
                <span>{currentThemeConfig.emoji} {currentThemeConfig.name.split(" ")[0]}</span>
                <span className="text-amber-400 font-bold">
                  {Math.round(currentFilter.filterOpacity * 100)}% filtro
                </span>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Expanded Calibration Modal */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-full max-w-[440px] max-h-[88vh] overflow-y-auto rounded-3xl bg-slate-950/95 border border-white/20 shadow-[0_12px_45px_rgba(0,0,0,0.85)] backdrop-blur-2xl text-slate-100 flex flex-col p-5 space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    Calibrador de Temas
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40 font-bold">
                      Herramienta Temporal
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Ajusta en tiempo real la atenuación de cada fondo
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Minimizar calibrador"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Picker Dropdown & Quick Badges */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-300 flex items-center justify-between">
              <span>1. Selecciona Tema a Probar:</span>
              <span className="text-[10px] text-amber-400 font-mono">
                {Object.keys(GENRE_THEMES).length} Temas disponibles
              </span>
            </label>
            <div className="relative">
              <select
                value={currentThemeId}
                onChange={(e) => handleSelectTheme(e.target.value)}
                aria-label="Seleccionar tema para calibrar"
                className="w-full bg-slate-900 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none cursor-pointer hover:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/40 font-medium"
              >
                {Object.values(GENRE_THEMES).map((th) => {
                  const saved = getThemeFilterSetting(th.id);
                  return (
                    <option key={th.id} value={th.id} className="bg-slate-900 text-white">
                      {th.emoji} {th.name} — (Filtro: {Math.round(saved.filterOpacity * 100)}%)
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
            </div>

            {/* Quick theme chip pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-thin">
              {Object.values(GENRE_THEMES).map((th) => (
                <button
                  key={th.id}
                  onClick={() => handleSelectTheme(th.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1 border ${
                    th.id === currentThemeId
                      ? "bg-amber-500/30 text-amber-200 border-amber-400 shadow-sm shadow-amber-500/20 scale-105"
                      : "bg-slate-900/80 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <span>{th.emoji}</span>
                  <span>{th.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Theme Highlight Card */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentThemeConfig.emoji}</span>
                <div>
                  <h4 className="text-xs font-bold text-white">{currentThemeConfig.name}</h4>
                  <span className="text-[10px] text-amber-300/90 font-medium">
                    {getFilterCategoryLabel(currentFilter.filterOpacity)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => resetThemeFilter(currentThemeId)}
                className="text-[10px] text-gray-400 hover:text-amber-300 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                title="Restablecer este tema al valor por defecto"
              >
                <RotateCcw className="w-3 h-3" /> Restablecer
              </button>
            </div>

            {/* Slider 1: Dark Filter Opacity */}
            <div className="space-y-1.5 pt-1 border-t border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-200 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  Nivel de Filtro Oscuro (Overlay):
                </span>
                <span className="font-mono font-black text-amber-400 text-sm bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                  {Math.round(currentFilter.filterOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={currentFilter.filterOpacity}
                onChange={(e) => handleFilterOpacityChange(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>0% (Sin filtro / Muy visible)</span>
                <span>100% (Oscuro total)</span>
              </div>
            </div>

            {/* Slider 2: Canvas Background Opacity */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  Opacidad de la Animación (Canvas):
                </span>
                <span className="font-mono font-black text-orange-400 text-sm bg-orange-500/20 px-2 py-0.5 rounded border border-orange-500/40">
                  {Math.round(currentFilter.canvasOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="1"
                step="0.01"
                value={currentFilter.canvasOpacity}
                onChange={(e) => handleCanvasOpacityChange(parseFloat(e.target.value))}
                className="w-full accent-orange-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>10% (Partículas tenues)</span>
                <span>100% (Brillo máximo)</span>
              </div>
            </div>

            {/* Slider 3: Blur */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  Desenfoque Ambiental (Blur):
                </span>
                <span className="font-mono font-black text-purple-400 text-sm bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/40">
                  {currentFilter.blur}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="16"
                step="1"
                value={currentFilter.blur}
                onChange={(e) => handleBlurChange(parseInt(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>0px (Nítido)</span>
                <span>16px (Muy difuso)</span>
              </div>
            </div>

            {/* Slider 4 (Comedia): Velocidad de Fuegos Artificiales */}
            {(currentThemeId === "Comedia" || currentThemeConfig.animationType === "fireworks") && (
              <div className="space-y-1.5 pt-2 border-t border-amber-500/20 bg-amber-500/5 p-2.5 rounded-xl">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-amber-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Velocidad de Fuegos Artificiales:
                  </span>
                  <span className="font-mono font-black text-amber-300 text-sm bg-amber-500/25 px-2 py-0.5 rounded border border-amber-500/50">
                    {Math.round((currentFilter.fireworksSpeed ?? 0.45) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.15"
                  max="1.20"
                  step="0.05"
                  value={currentFilter.fireworksSpeed ?? 0.45}
                  onChange={(e) => handleFireworksSpeedChange(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-amber-300/70">
                  <span>15% (Ultra lenta)</span>
                  <span>45% (Recomendada)</span>
                  <span>120% (Rápida)</span>
                </div>
              </div>
            )}

            {/* Quick Presets Buttons */}
            <div className="pt-2 border-t border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Ajustes Rápidos para {currentThemeConfig.name.split(" ")[0]}:
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => handlePreset(0.40, 0.85)}
                  className="px-2 py-1.5 text-[10px] font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-gray-300 hover:text-white border border-white/10 hover:border-amber-400/50 transition-all text-center"
                >
                  💡 Tenue
                  <span className="block text-[8px] text-gray-500">40%</span>
                </button>
                <button
                  onClick={() => handlePreset(0.65, 0.75)}
                  className="px-2 py-1.5 text-[10px] font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-gray-300 hover:text-white border border-white/10 hover:border-amber-400/50 transition-all text-center"
                >
                  ⚖️ Medio
                  <span className="block text-[8px] text-gray-500">65%</span>
                </button>
                <button
                  onClick={() => handlePreset(0.80, 0.70)}
                  className="px-2 py-1.5 text-[10px] font-bold rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 transition-all text-center font-black"
                >
                  🌙 Mi Lista
                  <span className="block text-[8px] text-amber-300">80%</span>
                </button>
                <button
                  onClick={() => handlePreset(0.92, 0.60)}
                  className="px-2 py-1.5 text-[10px] font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-gray-300 hover:text-white border border-white/10 hover:border-amber-400/50 transition-all text-center"
                >
                  🌑 Oscuro
                  <span className="block text-[8px] text-gray-500">92%</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons: Copy Settings & Reset All */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleCopySettings}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all duration-200 ${
                copied
                  ? "bg-emerald-600 text-white shadow-emerald-950/60 scale-[0.98]"
                  : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-950/40 hover:scale-[1.01]"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> ¡Configuración Copiada al Portapapeles!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copiar Configuración de Todos los Temas
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
              <button
                onClick={() => setShowSummary(!showSummary)}
                className="hover:text-amber-300 transition-colors flex items-center gap-1 underline underline-offset-4"
              >
                {showSummary ? "Ocultar tabla de temas" : "Ver valores de todos los temas"}
              </button>

              <button
                onClick={() => resetThemeFilter()}
                className="hover:text-rose-400 transition-colors flex items-center gap-1"
                title="Restablecer todos los temas a valores iniciales"
              >
                <RotateCcw className="w-3 h-3" /> Restablecer Todos
              </button>
            </div>
          </div>

          {/* Expandable Summary Table */}
          {showSummary && (
            <div className="p-3 rounded-2xl bg-black/50 border border-white/10 text-xs space-y-2 max-h-48 overflow-y-auto">
              <h5 className="font-bold text-gray-300 text-[11px] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                Resumen de calibración actual:
              </h5>
              <div className="space-y-1 font-mono text-[10px]">
                {Object.values(GENRE_THEMES).map((th) => {
                  const s = getThemeFilterSetting(th.id);
                  return (
                    <div
                      key={th.id}
                      onClick={() => handleSelectTheme(th.id)}
                      className={`flex items-center justify-between py-1 px-2 rounded cursor-pointer transition-colors ${
                        th.id === currentThemeId ? "bg-amber-500/20 text-amber-300" : "hover:bg-white/5 text-gray-300"
                      }`}
                    >
                      <span>{th.emoji} {th.name.split(" ")[0]}</span>
                      <span className="font-bold">
                        Filtro: {Math.round(s.filterOpacity * 100)}% | Canvas: {Math.round(s.canvasOpacity * 100)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Helpful note */}
          <div className="text-[10px] text-gray-400 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Tip:</strong> Puedes navegar a <em>Dashboard</em>, <em>Listas Grupales</em>, <em>Mi Lista</em> o <em>Perfiles</em> con esta herramienta abierta para ver exactamente cómo se siente cada página. Tus ajustes se guardan automáticamente.
            </span>
          </div>
        </div>
      )}
    </>
  );
}

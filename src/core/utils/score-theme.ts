export interface MALScoreOption {
  value: number;
  label: string;
  shortLabel: string;
  badgeClass: string;
  textClass: string;
}

export const MAL_SCORE_OPTIONS: MALScoreOption[] = [
  { value: 10, label: "(10) Obra Maestra 👑", shortLabel: "Obra Maestra", badgeClass: "bg-emerald-950 text-emerald-300 border-emerald-500/60 font-black shadow-emerald-950", textClass: "text-emerald-300 font-black" },
  { value: 9, label: "(9) Excelente 🔵", shortLabel: "Excelente", badgeClass: "bg-blue-950/80 text-blue-300 border-blue-500/50 font-bold", textClass: "text-blue-400 font-bold" },
  { value: 8, label: "(8) Muy Bueno 🔵", shortLabel: "Muy Bueno", badgeClass: "bg-blue-950/70 text-blue-300 border-blue-500/40 font-bold", textClass: "text-blue-400 font-bold" },
  { value: 7, label: "(7) Bueno 🔵", shortLabel: "Bueno", badgeClass: "bg-blue-950/60 text-blue-300 border-blue-600/40 font-semibold", textClass: "text-blue-400 font-semibold" },
  { value: 6, label: "(6) Aceptable 🟡", shortLabel: "Aceptable", badgeClass: "bg-amber-950/70 text-amber-300 border-amber-500/40 font-semibold", textClass: "text-amber-400 font-semibold" },
  { value: 5, label: "(5) Mediocre 🟡", shortLabel: "Mediocre", badgeClass: "bg-amber-950/60 text-amber-300 border-amber-600/40 font-semibold", textClass: "text-amber-400 font-semibold" },
  { value: 4, label: "(4) Malo 🟡", shortLabel: "Malo", badgeClass: "bg-amber-950/50 text-amber-400 border-amber-700/40", textClass: "text-amber-400 font-normal" },
  { value: 3, label: "(3) Muy Malo 🔴", shortLabel: "Muy Malo", badgeClass: "bg-rose-950/80 text-rose-300 border-rose-500/50 font-bold", textClass: "text-rose-400 font-bold" },
  { value: 2, label: "(2) Horrible 🔴", shortLabel: "Horrible", badgeClass: "bg-rose-950/90 text-rose-300 border-rose-600/50 font-bold", textClass: "text-rose-400 font-bold" },
  { value: 1, label: "(1) Desastroso 🔴", shortLabel: "Desastroso", badgeClass: "bg-red-950 text-red-300 border-red-700/60 font-black", textClass: "text-red-500 font-black" },
];

export function getScoreBadgeStyle(scoreNum: number): { badgeClass: string; textClass: string; dotColor: string } {
  const num = Math.round(scoreNum);
  if (num === 10) {
    return {
      badgeClass: "bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 shadow-md shadow-emerald-950 font-black",
      textClass: "text-emerald-300 font-black",
      dotColor: "bg-emerald-400",
    };
  }
  if (num >= 7) {
    return {
      badgeClass: "bg-blue-950/80 text-blue-300 border border-blue-500/50 font-bold",
      textClass: "text-blue-400 font-bold",
      dotColor: "bg-blue-400",
    };
  }
  if (num >= 4) {
    return {
      badgeClass: "bg-amber-950/80 text-amber-300 border border-amber-500/50 font-bold",
      textClass: "text-amber-400 font-bold",
      dotColor: "bg-amber-400",
    };
  }
  return {
    badgeClass: "bg-rose-950/80 text-rose-300 border border-rose-500/50 font-bold",
    textClass: "text-rose-400 font-bold",
    dotColor: "bg-rose-400",
  };
}

export type ThemeAnimationType =
  | "petals"
  | "spaceships"
  | "wind_leaves"
  | "flames"
  | "fireworks"
  | "horror_forest"
  | "magic_circles"
  | "rain_city"
  | "stadium_flashes"
  | "none";

export interface GenreThemeConfig {
  id: string;
  name: string;
  emoji: string;
  animationType: ThemeAnimationType;
  primaryColor: string;
  primaryRgb: string;
  secondaryColor: string;
  accentClass: string;
  badgeClass: string;
  bgGlowClass: string;
  borderClass: string;
  buttonClass: string;
  petalColor: "pink" | "violet" | "red" | "cyan" | "gold" | "emerald" | "none";
  panelBgClass: string;
  cardBgClass: string;
  // CSS variables for deep UI cascading
  cssVars: {
    "--theme-primary": string;
    "--theme-primary-rgb": string;
    "--theme-secondary": string;
    "--theme-accent": string;
    "--theme-bg-start": string;
    "--theme-bg-end": string;
    "--theme-header-bg": string;
    "--theme-header-border": string;
    "--theme-panel-bg": string;
    "--theme-panel-border": string;
    "--theme-card-bg": string;
    "--theme-card-border": string;
    "--theme-card-hover-border": string;
    "--theme-card-hover-glow": string;
    "--theme-text-title": string;
    "--theme-text-accent": string;
    "--theme-text-muted": string;
  };
}

export const GENRE_THEMES: Record<string, GenreThemeConfig> = {
  RomanceYuri: {
    id: "RomanceYuri",
    name: "Romance Yuri (Cards Rosas 🌸)",
    emoji: "🌸",
    animationType: "petals",
    primaryColor: "#EC4899",
    primaryRgb: "236, 72, 153",
    secondaryColor: "#F472B6",
    accentClass: "text-pink-400",
    badgeClass: "bg-pink-950/90 text-pink-300 border-pink-500/60 shadow-pink-950",
    bgGlowClass: "from-[#2F1221]/95 via-[#1E0B15]/90 to-[#0F050A]",
    borderClass: "border-pink-500/60 shadow-[0_0_25px_rgba(236,72,153,0.35)]",
    buttonClass: "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-lg shadow-pink-950/50",
    petalColor: "pink",
    panelBgClass: "bg-[#28101D]/85 backdrop-blur-xl border-pink-500/50",
    cardBgClass: "bg-[#240C1A]/80 border-pink-500/40 hover:border-pink-400/80 shadow-[0_4px_20px_rgba(236,72,153,0.15)]",
    cssVars: {
      "--theme-primary": "#EC4899",
      "--theme-primary-rgb": "236, 72, 153",
      "--theme-secondary": "#F472B6",
      "--theme-accent": "#FBCFE8",
      "--theme-bg-start": "#1A0713",
      "--theme-bg-end": "#080205",
      "--theme-header-bg": "rgba(35, 12, 24, 0.85)",
      "--theme-header-border": "rgba(236, 72, 153, 0.35)",
      "--theme-panel-bg": "rgba(40, 16, 29, 0.85)",
      "--theme-panel-border": "rgba(236, 72, 153, 0.45)",
      "--theme-card-bg": "rgba(36, 12, 26, 0.78)",
      "--theme-card-border": "rgba(236, 72, 153, 0.35)",
      "--theme-card-hover-border": "rgba(244, 114, 182, 0.85)",
      "--theme-card-hover-glow": "rgba(236, 72, 153, 0.35)",
      "--theme-text-title": "#FFFFFF",
      "--theme-text-accent": "#F472B6",
      "--theme-text-muted": "#FBCFE8",
    },
  },
  RomanceYaoi: {
    id: "RomanceYaoi",
    name: "Romance Yaoi (Cards Negras 🖤)",
    emoji: "🖤",
    animationType: "petals",
    primaryColor: "#F43F5E",
    primaryRgb: "244, 63, 94",
    secondaryColor: "#E11D48",
    accentClass: "text-rose-400",
    badgeClass: "bg-rose-950/90 text-rose-300 border-rose-500/60 shadow-rose-950",
    bgGlowClass: "from-[#1A0A10]/95 via-[#0D0508]/90 to-black",
    borderClass: "border-rose-500/60 shadow-[0_0_25px_rgba(244,63,94,0.35)]",
    buttonClass: "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-rose-950/50",
    petalColor: "pink",
    panelBgClass: "bg-[#0A0B0F]/95 backdrop-blur-xl border-rose-500/50",
    cardBgClass: "bg-[#08090D]/95 border-rose-900/60 hover:border-rose-500/70 shadow-[0_4px_20px_rgba(244,63,94,0.15)]",
    cssVars: {
      "--theme-primary": "#F43F5E",
      "--theme-primary-rgb": "244, 63, 94",
      "--theme-secondary": "#BE123C",
      "--theme-accent": "#FDA4AF",
      "--theme-bg-start": "#0D0508",
      "--theme-bg-end": "#000000",
      "--theme-header-bg": "rgba(10, 11, 15, 0.92)",
      "--theme-header-border": "rgba(244, 63, 94, 0.35)",
      "--theme-panel-bg": "rgba(10, 11, 15, 0.95)",
      "--theme-panel-border": "rgba(244, 63, 94, 0.4)",
      "--theme-card-bg": "rgba(8, 9, 13, 0.95)",
      "--theme-card-border": "rgba(244, 63, 94, 0.25)",
      "--theme-card-hover-border": "rgba(244, 63, 94, 0.75)",
      "--theme-card-hover-glow": "rgba(244, 63, 94, 0.25)",
      "--theme-text-title": "#FFFFFF",
      "--theme-text-accent": "#FB7185",
      "--theme-text-muted": "#CBD5E1",
    },
  },

  "Sci-Fi": {
    id: "Sci-Fi",
    name: "Sci-Fi / Mecha",
    emoji: "⚡",
    animationType: "spaceships",
    primaryColor: "#06B6D4",
    primaryRgb: "6, 182, 212",
    secondaryColor: "#3B82F6",
    accentClass: "text-cyan-400",
    badgeClass: "bg-cyan-950/90 text-cyan-300 border-cyan-500/60 shadow-cyan-950",
    bgGlowClass: "from-[#05111E]/95 via-[#030B14]/90 to-black",
    borderClass: "border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.3)]",
    buttonClass: "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-950/50",
    petalColor: "cyan",
    panelBgClass: "bg-[#091826]/85 backdrop-blur-xl border-cyan-500/40",
    cardBgClass: "bg-[#081522]/80 border-cyan-500/35 hover:border-cyan-400/80 shadow-[0_4px_20px_rgba(6,182,212,0.18)]",
    cssVars: {
      "--theme-primary": "#06B6D4",
      "--theme-primary-rgb": "6, 182, 212",
      "--theme-secondary": "#3B82F6",
      "--theme-accent": "#A5F3FC",
      "--theme-bg-start": "#050E1A",
      "--theme-bg-end": "#02050B",
      "--theme-header-bg": "rgba(9, 24, 38, 0.88)",
      "--theme-header-border": "rgba(6, 182, 212, 0.35)",
      "--theme-panel-bg": "rgba(9, 24, 38, 0.85)",
      "--theme-panel-border": "rgba(6, 182, 212, 0.4)",
      "--theme-card-bg": "rgba(8, 21, 34, 0.8)",
      "--theme-card-border": "rgba(6, 182, 212, 0.3)",
      "--theme-card-hover-border": "rgba(56, 189, 248, 0.85)",
      "--theme-card-hover-glow": "rgba(6, 182, 212, 0.35)",
      "--theme-text-title": "#FFFFFF",
      "--theme-text-accent": "#38BDF8",
      "--theme-text-muted": "#94A3B8",
    },
  },
  "Slice of Life": {
    id: "Slice of Life",
    name: "Slice of Life",
    emoji: "🌿",
    animationType: "wind_leaves",
    primaryColor: "#10B981",
    primaryRgb: "16, 185, 129",
    secondaryColor: "#14B8A6",
    accentClass: "text-emerald-400",
    badgeClass: "bg-emerald-950/90 text-emerald-300 border-emerald-500/60 shadow-emerald-950",
    bgGlowClass: "from-[#081A12]/95 via-[#040E0A]/90 to-black",
    borderClass: "border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.3)]",
    buttonClass: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/50",
    petalColor: "emerald",
    panelBgClass: "bg-[#091E16]/85 backdrop-blur-xl border-emerald-500/40",
    cardBgClass: "bg-[#071912]/80 border-emerald-500/35 hover:border-emerald-400/80 shadow-[0_4px_20px_rgba(16,185,129,0.18)]",
    cssVars: {
      "--theme-primary": "#10B981",
      "--theme-primary-rgb": "16, 185, 129",
      "--theme-secondary": "#14B8A6",
      "--theme-accent": "#A7F3D0",
      "--theme-bg-start": "#061510",
      "--theme-bg-end": "#020906",
      "--theme-header-bg": "rgba(9, 30, 22, 0.88)",
      "--theme-header-border": "rgba(16, 185, 129, 0.35)",
      "--theme-panel-bg": "rgba(9, 30, 22, 0.85)",
      "--theme-panel-border": "rgba(16, 185, 129, 0.4)",
      "--theme-card-bg": "rgba(7, 25, 18, 0.8)",
      "--theme-card-border": "rgba(16, 185, 129, 0.3)",
      "--theme-card-hover-border": "rgba(52, 211, 153, 0.85)",
      "--theme-card-hover-glow": "rgba(16, 185, 129, 0.35)",
      "--theme-text-title": "#FFFFFF",
      "--theme-text-accent": "#34D399",
      "--theme-text-muted": "#A7F3D0",
    },
  },
  Acción: {
    id: "Acción",
    name: "Acción / Shonen",
    emoji: "🔥",
    animationType: "flames",
    primaryColor: "#EF4444",
    primaryRgb: "239, 68, 68",
    secondaryColor: "#F97316",
    accentClass: "text-red-400",
    badgeClass: "bg-red-950/90 text-red-300 border-red-500/60 shadow-red-950",
    bgGlowClass: "from-[#1F080A]/95 via-[#110405]/90 to-black",
    borderClass: "border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.3)]",
    buttonClass: "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-lg shadow-red-950/50",
    petalColor: "red",
    panelBgClass: "bg-[#200B0E]/85 backdrop-blur-xl border-red-500/40",
    cardBgClass: "bg-[#1A080B]/80 border-red-500/35 hover:border-red-400/80 shadow-[0_4px_20px_rgba(239,68,68,0.2)]",
    cssVars: {
      "--theme-primary": "#EF4444",
      "--theme-primary-rgb": "239, 68, 68",
      "--theme-secondary": "#F97316",
      "--theme-accent": "#FECACA",
      "--theme-bg-start": "#160506",
      "--theme-bg-end": "#050102",
      "--theme-header-bg": "rgba(32, 11, 14, 0.88)",
      "--theme-header-border": "rgba(239, 68, 68, 0.35)",
      "--theme-panel-bg": "rgba(32, 11, 14, 0.85)",
      "--theme-panel-border": "rgba(239, 68, 68, 0.4)",
      "--theme-card-bg": "rgba(26, 8, 11, 0.8)",
      "--theme-card-border": "rgba(239, 68, 68, 0.3)",
      "--theme-card-hover-border": "rgba(248, 113, 113, 0.85)",
      "--theme-card-hover-glow": "rgba(239, 68, 68, 0.35)",
      "--theme-text-title": "#FFFFFF",
      "--theme-text-accent": "#F87171",
      "--theme-text-muted": "#E2E8F0",
    },
  },
  Comedia: {
    id: "Comedia",
    name: "Comedia",
    emoji: "✨",
    animationType: "fireworks",
    primaryColor: "#F59E0B",
    primaryRgb: "245, 158, 11",
    secondaryColor: "#EAB308",
    accentClass: "text-amber-400",
    badgeClass: "bg-amber-950/90 text-amber-300 border-amber-500/60 shadow-amber-950",
    bgGlowClass: "from-[#070D14]/95 via-[#03060A]/90 to-black",
    borderClass: "border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.3)]",
    buttonClass: "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold shadow-lg shadow-amber-950/50",
    petalColor: "gold",
    panelBgClass: "bg-[#09111A]/88 backdrop-blur-xl border-amber-500/40",
    cardBgClass: "bg-[#070E16]/82 border-amber-500/35 hover:border-amber-400/80 shadow-[0_4px_20px_rgba(245,158,11,0.18)]",
    cssVars: {
      "--theme-primary": "#F59E0B",
      "--theme-primary-rgb": "245, 158, 11",
      "--theme-secondary": "#EAB308",
      "--theme-accent": "#FDE68A",
      "--theme-bg-start": "#060B12",
      "--theme-bg-end": "#020406",
      "--theme-header-bg": "rgba(8, 15, 23, 0.90)",
      "--theme-header-border": "rgba(245, 158, 11, 0.35)",
      "--theme-panel-bg": "rgba(8, 15, 23, 0.86)",
      "--theme-panel-border": "rgba(245, 158, 11, 0.4)",
      "--theme-card-bg": "rgba(7, 14, 22, 0.82)",
      "--theme-card-border": "rgba(245, 158, 11, 0.3)",
      "--theme-card-hover-border": "rgba(251, 191, 36, 0.85)",
      "--theme-card-hover-glow": "rgba(245, 158, 11, 0.35)",
      "--theme-text-title": "#FFFFFF",
      "--theme-text-accent": "#FBBF24",
      "--theme-text-muted": "#FDE68A",
    },
  },
  Terror: {
    id: "Terror",
    name: "Terror / Misterio",
    emoji: "👁️",
    animationType: "horror_forest",
    primaryColor: "#991B1B",
    primaryRgb: "153, 27, 27",
    secondaryColor: "#7F1D1D",
    accentClass: "text-rose-500",
    badgeClass: "bg-rose-950/90 text-rose-300 border-rose-800/60 shadow-rose-950",
    bgGlowClass: "from-[#140508]/95 via-[#0A0204]/90 to-black",
    borderClass: "border-rose-700/60 shadow-[0_0_25px_rgba(153,27,27,0.35)]",
    buttonClass: "bg-gradient-to-r from-rose-700 to-red-800 hover:from-rose-600 hover:to-red-700 text-white shadow-lg shadow-rose-950/50",
    petalColor: "red",
    panelBgClass: "bg-[#180609]/90 backdrop-blur-xl border-rose-700/50",
    cardBgClass: "bg-[#120406]/85 border-rose-900/60 hover:border-rose-600/80 shadow-[0_4px_20px_rgba(153,27,27,0.25)]",
    cssVars: {
      "--theme-primary": "#991B1B",
      "--theme-primary-rgb": "153, 27, 27",
      "--theme-secondary": "#7F1D1D",
      "--theme-accent": "#FECDD3",
      "--theme-bg-start": "#0E0407",
      "--theme-bg-end": "#000000",
      "--theme-header-bg": "rgba(24, 6, 9, 0.92)",
      "--theme-header-border": "rgba(153, 27, 27, 0.4)",
      "--theme-panel-bg": "rgba(24, 6, 9, 0.9)",
      "--theme-panel-border": "rgba(153, 27, 27, 0.45)",
      "--theme-card-bg": "rgba(18, 4, 6, 0.85)",
      "--theme-card-border": "rgba(153, 27, 27, 0.35)",
      "--theme-card-hover-border": "rgba(225, 29, 72, 0.85)",
      "--theme-card-hover-glow": "rgba(153, 27, 27, 0.4)",
      "--theme-text-title": "#FFFFFF",
      "--theme-text-accent": "#F43F5E",
      "--theme-text-muted": "#CBD5E1",
    },
  },
  Fantasía: {
    id: "Fantasía",
    name: "Fantasía / Magia",
    emoji: "🔮",
    animationType: "magic_circles",
    primaryColor: "#A855F7",
    primaryRgb: "168, 85, 247",
    secondaryColor: "#9333EA",
    accentClass: "text-purple-400",
    badgeClass: "bg-purple-950/90 text-purple-300 border-purple-500/60 shadow-purple-950",
    bgGlowClass: "from-[#170924]/95 via-[#0B0412]/90 to-black",
    borderClass: "border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.3)]",
    buttonClass: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-950/50",
    petalColor: "violet",
    panelBgClass: "bg-[#180A26]/85 backdrop-blur-xl border-purple-500/40",
    cardBgClass: "bg-[#130720]/80 border-purple-500/35 hover:border-purple-400/80 shadow-[0_4px_20px_rgba(168,85,247,0.2)]",
    cssVars: {
      "--theme-primary": "#A855F7",
      "--theme-primary-rgb": "168, 85, 247",
      "--theme-secondary": "#9333EA",
      "--theme-accent": "#E9D5FF",
      "--theme-bg-start": "#0E061A",
      "--theme-bg-end": "#030107",
      "--theme-header-bg": "rgba(24, 10, 38, 0.88)",
      "--theme-header-border": "rgba(168, 85, 247, 0.35)",
      "--theme-panel-bg": "rgba(24, 10, 38, 0.85)",
      "--theme-panel-border": "rgba(168, 85, 247, 0.4)",
      "--theme-card-bg": "rgba(19, 7, 32, 0.8)",
      "--theme-card-border": "rgba(168, 85, 247, 0.3)",
      "--theme-card-hover-border": "rgba(192, 132, 252, 0.85)",
      "--theme-card-hover-glow": "rgba(168, 85, 247, 0.35)",
      "--theme-text-title": "#FFFFFF",
      "--theme-text-accent": "#C084FC",
      "--theme-text-muted": "#E9D5FF",
    },
  },
  Drama: {
    id: "Drama",
    name: "Drama (Ciudad & Lluvia 🌧️)",
    emoji: "🌧️",
    animationType: "rain_city",
    primaryColor: "#E2E8F0",
    primaryRgb: "226, 232, 240",
    secondaryColor: "#94A3B8",
    accentClass: "text-slate-200",
    badgeClass: "bg-slate-900/95 text-slate-200 border-slate-600/60 shadow-slate-950",
    bgGlowClass: "from-[#10141D]/95 via-[#0A0C12]/90 to-black",
    borderClass: "border-slate-500/50 shadow-[0_0_25px_rgba(226,232,240,0.18)]",
    buttonClass: "bg-gradient-to-r from-slate-700 to-zinc-800 hover:from-slate-600 hover:to-zinc-700 text-white shadow-lg shadow-black/60",
    petalColor: "none",
    panelBgClass: "bg-[#121620]/90 backdrop-blur-xl border-slate-700/50",
    cardBgClass: "bg-[#0F131C]/85 border-slate-700/40 hover:border-slate-400/80 shadow-[0_4px_20px_rgba(226,232,240,0.1)]",
    cssVars: {
      "--theme-primary": "#E2E8F0",
      "--theme-primary-rgb": "226, 232, 240",
      "--theme-secondary": "#94A3B8",
      "--theme-accent": "#F8FAFC",
      "--theme-bg-start": "#0C0F17",
      "--theme-bg-end": "#040508",
      "--theme-header-bg": "rgba(16, 20, 29, 0.9)",
      "--theme-header-border": "rgba(148, 163, 184, 0.3)",
      "--theme-panel-bg": "rgba(18, 22, 32, 0.88)",
      "--theme-panel-border": "rgba(148, 163, 184, 0.35)",
      "--theme-card-bg": "rgba(15, 19, 28, 0.82)",
      "--theme-card-border": "rgba(148, 163, 184, 0.22)",
      "--theme-card-hover-border": "rgba(226, 232, 240, 0.8)",
      "--theme-card-hover-glow": "rgba(226, 232, 240, 0.2)",
      "--theme-text-title": "#FFFFFF",
      "--theme-text-accent": "#E2E8F0",
      "--theme-text-muted": "#94A3B8",
    },
  },
  Deportes: {
    id: "Deportes",
    name: "Deportes (Estadio & Flashes ⚽)",
    emoji: "⚽",
    animationType: "stadium_flashes",
    primaryColor: "#F97316",
    primaryRgb: "249, 115, 22",
    secondaryColor: "#EA580C",
    accentClass: "text-orange-400",
    badgeClass: "bg-orange-950/90 text-orange-300 border-orange-500/60 shadow-orange-950",
    bgGlowClass: "from-[#1C0E04]/95 via-[#0F0702]/90 to-black",
    borderClass: "border-orange-500/50 shadow-[0_0_25px_rgba(249,115,22,0.3)]",
    buttonClass: "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-lg shadow-orange-950/50",
    petalColor: "gold",
    panelBgClass: "bg-[#221208]/85 backdrop-blur-xl border-orange-500/40",
    cardBgClass: "bg-[#1B0D05]/80 border-orange-500/35 hover:border-orange-400/80 shadow-[0_4px_20px_rgba(249,115,22,0.18)]",
    cssVars: {
      "--theme-primary": "#F97316",
      "--theme-primary-rgb": "249, 115, 22",
      "--theme-secondary": "#EA580C",
      "--theme-accent": "#FED7AA",
      "--theme-bg-start": "#140903",
      "--theme-bg-end": "#040201",
      "--theme-header-bg": "rgba(34, 18, 8, 0.88)",
      "--theme-header-border": "rgba(249, 115, 22, 0.35)",
      "--theme-panel-bg": "rgba(34, 18, 8, 0.85)",
      "--theme-panel-border": "rgba(249, 115, 22, 0.4)",
      "--theme-card-bg": "rgba(27, 13, 5, 0.8)",
      "--theme-card-border": "rgba(249, 115, 22, 0.3)",
      "--theme-card-hover-border": "rgba(251, 146, 60, 0.85)",
      "--theme-card-hover-glow": "rgba(249, 115, 22, 0.35)",
      "--theme-text-title": "#FFFFFF",
      "--theme-text-accent": "#FB923C",
      "--theme-text-muted": "#FED7AA",
    },
  },
  Default: {
    id: "Default",
    name: "Neutro / Plataforma",
    emoji: "🎬",
    animationType: "none",
    primaryColor: "#FFFFFF",
    primaryRgb: "255, 255, 255",
    secondaryColor: "#E2E8F0",
    accentClass: "text-white",
    badgeClass: "bg-zinc-900 text-zinc-100 border-zinc-700/80 shadow-none",
    bgGlowClass: "from-[#080B11] via-[#04060A] to-[#010204]",
    borderClass: "border-white/15 shadow-[0_0_20px_rgba(255,255,255,0.06)]",
    buttonClass: "bg-white text-black hover:bg-zinc-200 font-bold shadow-lg shadow-white/10",
    petalColor: "none",
    panelBgClass: "bg-[#0E131F]/90 backdrop-blur-xl border-white/15",
    cardBgClass: "bg-[#111726]/85 border-white/15 hover:border-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
    cssVars: {
      "--theme-primary": "#FFFFFF",
      "--theme-primary-rgb": "255, 255, 255",
      "--theme-secondary": "#E2E8F0",
      "--theme-accent": "#FFFFFF",
      "--theme-bg-start": "#05070B",
      "--theme-bg-end": "#020306",
      "--theme-header-bg": "rgba(10, 14, 22, 0.92)",
      "--theme-header-border": "rgba(255, 255, 255, 0.12)",
      "--theme-panel-bg": "rgba(14, 19, 31, 0.90)",
      "--theme-panel-border": "rgba(255, 255, 255, 0.15)",
      "--theme-card-bg": "rgba(17, 23, 38, 0.85)",
      "--theme-card-border": "rgba(255, 255, 255, 0.12)",
      "--theme-card-hover-border": "rgba(255, 255, 255, 0.45)",
      "--theme-card-hover-glow": "rgba(255, 255, 255, 0.12)",
      "--theme-text-title": "#FFFFFF",
      "--theme-text-accent": "#FFFFFF",
      "--theme-text-muted": "#94A3B8",
    },
  },
};

"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/core/contexts/AuthContext";
import { GENRE_THEMES, GenreThemeConfig } from "@/core/utils/score-theme";

export interface ThemeFilterSetting {
  filterOpacity: number; // 0 to 1 (Opacidad del velo gradiente oscuro)
  canvasOpacity: number; // 0 to 1 (Opacidad del fondo canvas)
  blur: number;          // 0 to 20 px (Desenfoque ambiental)
  fireworksSpeed?: number; // 0.15 to 1.2 (Velocidad de fuegos artificiales, default 0.45)
}

export const DEFAULT_THEME_FILTERS: Record<string, ThemeFilterSetting> = {
  RomanceYuri: { filterOpacity: 0.5, canvasOpacity: 0.75, blur: 0 },
  RomanceYaoi: { filterOpacity: 0.3, canvasOpacity: 0.7, blur: 0 },
  "Sci-Fi": { filterOpacity: 0.5, canvasOpacity: 0.7, blur: 0 },
  SciFi: { filterOpacity: 0.5, canvasOpacity: 0.7, blur: 0 },
  "Slice of Life": { filterOpacity: 0.5, canvasOpacity: 0.7, blur: 0 },
  SliceOfLife: { filterOpacity: 0.5, canvasOpacity: 0.7, blur: 0 },
  Acción: { filterOpacity: 0.25, canvasOpacity: 0.7, blur: 0 },
  Comedia: { filterOpacity: 0.5, canvasOpacity: 0.75, blur: 0, fireworksSpeed: 0.45 },
  Terror: { filterOpacity: 0.59, canvasOpacity: 0.8, blur: 1 },
  Fantasía: { filterOpacity: 0.5, canvasOpacity: 0.75, blur: 1 },
  Drama: { filterOpacity: 0.8, canvasOpacity: 0.8, blur: 0 },
  Deportes: { filterOpacity: 0.75, canvasOpacity: 0.7, blur: 1 },
  Sports: { filterOpacity: 0.75, canvasOpacity: 0.7, blur: 1 },
  Default: { filterOpacity: 0.85, canvasOpacity: 0.1, blur: 0 },
};

interface ThemeContextValue {
  theme: GenreThemeConfig;
  themeId: string;
  manualTheme: string;
  setManualTheme: (themeId: string) => void;
  detectedTopGenre: string;
  overrideThemeId: string | null;
  setOverrideThemeId: (themeId: string | null) => void;
  themeFilterSettings: Record<string, ThemeFilterSetting>;
  getThemeFilterSetting: (themeId: string) => ThemeFilterSetting;
  updateThemeFilter: (themeId: string, settings: Partial<ThemeFilterSetting>) => void;
  resetThemeFilter: (themeId?: string) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: GENRE_THEMES.Default,
  themeId: "Default",
  manualTheme: "auto",
  setManualTheme: () => {},
  detectedTopGenre: "RomanceYuri",
  overrideThemeId: null,
  setOverrideThemeId: () => {},
  themeFilterSettings: DEFAULT_THEME_FILTERS,
  getThemeFilterSetting: () => ({ filterOpacity: 0.85, canvasOpacity: 0, blur: 0 }),
  updateThemeFilter: () => {},
  resetThemeFilter: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [manualTheme, setManualThemeState] = useState<string>("auto");
  const [detectedTopGenre, setDetectedTopGenre] = useState<string>("RomanceYuri");
  const [overrideThemeId, setOverrideThemeId] = useState<string | null>(null);
  const [themeFilterSettings, setThemeFilterSettings] = useState<Record<string, ThemeFilterSetting>>(DEFAULT_THEME_FILTERS);

  useEffect(() => {
    // Load persisted manual theme and filter settings
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("animigos_theme");
      if (saved && (saved === "auto" || GENRE_THEMES[saved])) {
        setManualThemeState(saved);
      }
      const savedFilters = localStorage.getItem("animigos_theme_filters");
      if (savedFilters) {
        try {
          const parsed = JSON.parse(savedFilters);
          setThemeFilterSettings((prev) => ({ ...prev, ...parsed }));
        } catch {
          // ignore corrupted local storage
        }
      }
    }
  }, []);

  const setManualTheme = (newTheme: string) => {
    setManualThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("animigos_theme", newTheme);
    }
  };

  const getThemeFilterSetting = (id: string): ThemeFilterSetting => {
    const aliasMap: Record<string, string> = {
      Sports: "Deportes",
      SciFi: "Sci-Fi",
      SliceOfLife: "Slice of Life",
      Romance: "RomanceYuri",
    };
    const resolvedId = aliasMap[id] || id;

    return (
      themeFilterSettings[resolvedId] ||
      themeFilterSettings[id] ||
      DEFAULT_THEME_FILTERS[resolvedId] ||
      DEFAULT_THEME_FILTERS[id] || { filterOpacity: 0.5, canvasOpacity: 0.75, blur: 0 }
    );
  };

  const updateThemeFilter = (targetId: string, settings: Partial<ThemeFilterSetting>) => {
    setThemeFilterSettings((prev) => {
      const current = prev[targetId] || DEFAULT_THEME_FILTERS[targetId] || { filterOpacity: 0.75, canvasOpacity: 0.70, blur: 0 };
      const updated = {
        ...prev,
        [targetId]: {
          ...current,
          ...settings,
        },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("animigos_theme_filters", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const resetThemeFilter = (targetId?: string) => {
    if (targetId) {
      setThemeFilterSettings((prev) => {
        const updated = {
          ...prev,
          [targetId]: DEFAULT_THEME_FILTERS[targetId] || { filterOpacity: 0.75, canvasOpacity: 0.70, blur: 0 },
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("animigos_theme_filters", JSON.stringify(updated));
        }
        return updated;
      });
    } else {
      setThemeFilterSettings(DEFAULT_THEME_FILTERS);
      if (typeof window !== "undefined") {
        localStorage.removeItem("animigos_theme_filters");
      }
    }
  };

  const activeThemeId = useMemo(() => {
    // 1. Landing page, login, register siempre usan el tema neutro de la plataforma
    const isNeutralPublicRoute =
      pathname === "/" ||
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/onboarding";

    if (isNeutralPublicRoute) {
      return "Default";
    }

    // 2. Si no hay usuario logeado, "animes" y "lista grupal" usan la paleta neutra ("Default")
    if (!user) {
      return "Default";
    }

    // 3. Para usuarios autenticados en secciones internas, aplicar override o tema configurado
    if (overrideThemeId && GENRE_THEMES[overrideThemeId]) {
      return overrideThemeId;
    }
    if (manualTheme !== "auto" && GENRE_THEMES[manualTheme]) {
      return manualTheme;
    }
    return detectedTopGenre || "Default";
  }, [pathname, user, overrideThemeId, manualTheme, detectedTopGenre]);

  const activeTheme = useMemo(() => {
    return GENRE_THEMES[activeThemeId] || GENRE_THEMES.Default;
  }, [activeThemeId]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", activeThemeId);
      if (activeTheme?.cssVars) {
        Object.entries(activeTheme.cssVars).forEach(([key, val]) => {
          document.documentElement.style.setProperty(key, val);
        });
      }
    }
  }, [activeThemeId, activeTheme]);

  const value = useMemo(
    () => ({
      theme: activeTheme,
      themeId: activeThemeId,
      manualTheme,
      setManualTheme,
      detectedTopGenre,
      overrideThemeId,
      setOverrideThemeId,
      themeFilterSettings,
      getThemeFilterSetting,
      updateThemeFilter,
      resetThemeFilter,
    }),
    [
      activeTheme,
      activeThemeId,
      manualTheme,
      detectedTopGenre,
      overrideThemeId,
      themeFilterSettings,
    ]
  );

  return (
    <ThemeContext.Provider value={value}>
      <div
        data-theme={activeThemeId}
        className="w-full min-h-screen text-slate-100 relative transition-colors duration-500"
        style={{
          background: "linear-gradient(to bottom, var(--theme-bg-start), var(--theme-bg-end))",
          ...(activeTheme?.cssVars as React.CSSProperties),
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * ThemeScope allows rendering a section or entire page (such as another user's profile
 * or a shared group list created by someone else) with their specific theme.
 */
export function ThemeScope({
  themeId,
  children,
  className = "",
}: {
  themeId: string;
  children: React.ReactNode;
  className?: string;
}) {
  const targetTheme = GENRE_THEMES[themeId] || GENRE_THEMES.Default;

  return (
    <div
      data-theme={targetTheme.id}
      className={`relative w-full transition-colors duration-500 ${className}`}
      style={targetTheme.cssVars as React.CSSProperties}
    >
      {children}
    </div>
  );
}

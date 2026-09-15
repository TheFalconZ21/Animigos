"use client";

import React from "react";
import { useTheme } from "@/core/contexts/ThemeContext";
import DynamicThemeBackground from "./DynamicThemeBackground";

export default function ThemeBackgroundWrapper() {
  const { theme, getThemeFilterSetting } = useTheme();
  const filterSetting = getThemeFilterSetting(theme.id);

  return (
    <>
      <DynamicThemeBackground
        animationType={theme.animationType}
        primaryColor={theme.primaryColor}
        themeId={theme.id}
        opacity={filterSetting.canvasOpacity}
        fireworksSpeed={filterSetting.fireworksSpeed ?? 0.45}
      />
      {/* Filtro oscuro ambiental gradiente con nivel calibrable en tiempo real */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 pointer-events-none z-[1] transition-all duration-300 bg-gradient-to-b ${theme.bgGlowClass}`}
        style={{
          opacity: filterSetting.filterOpacity,
          backdropFilter: filterSetting.blur > 0 ? `blur(${filterSetting.blur}px)` : undefined,
          WebkitBackdropFilter: filterSetting.blur > 0 ? `blur(${filterSetting.blur}px)` : undefined,
        }}
      />
    </>
  );
}

"use client";

import React from "react";
import { ThemeProvider } from "@/core/contexts/ThemeContext";
import ThemeBackgroundWrapper from "./ThemeBackgroundWrapper";
import ThemeFilterCalibrator from "./ThemeFilterCalibrator";

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeBackgroundWrapper />
      <div className="relative z-10 w-full min-h-screen bg-transparent">
        {children}
      </div>
      <ThemeFilterCalibrator />
    </ThemeProvider>
  );
}

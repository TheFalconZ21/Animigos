"use client";

import Link from "next/link";
import { Tv, Users, List, Sparkles, LogIn, UserPlus } from "lucide-react";
import UserDropdown from "./UserDropdown";
import GlobalSearchBar from "./GlobalSearchBar";
import NotificationsDropdown from "./NotificationsDropdown";
import { useTheme } from "@/core/contexts/ThemeContext";
import { useAuth } from "@/core/contexts/AuthContext";

export default function Navbar() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl border-b px-4 lg:px-8 py-3 transition-all duration-500 shadow-lg"
      style={{
        backgroundColor: "var(--theme-header-bg)",
        borderColor: "var(--theme-header-border)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5 group shrink-0">
          <div
            className="w-10 h-10 rounded-xl p-0.5 shadow-lg group-hover:scale-105 transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
              boxShadow: `0 4px 20px rgba(${theme.primaryRgb}, 0.35)`,
            }}
          >
            <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
              <Tv className="w-5 h-5 transition-colors" style={{ color: theme.primaryColor }} />
            </div>
          </div>
          <div className="flex flex-col hidden sm:flex">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Animigos{" "}
              {isAuthenticated && (
                <span className="text-xs px-1.5 py-0.5 rounded-md border text-slate-300 font-normal" style={{ borderColor: "var(--theme-header-border)" }}>
                  {theme.emoji}
                </span>
              )}
            </span>
            <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Coordinación Grupal</span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-black/40 p-1.5 rounded-full border border-white/10 shrink-0 backdrop-blur-md">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <Tv className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} /> Dashboard
              </Link>
              <Link
                href="/shared-lists"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <Users className="w-3.5 h-3.5 text-cyan-400" /> Listas Grupales
              </Link>
              <Link
                href="/personal-lists"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <List className="w-3.5 h-3.5 text-emerald-400" /> Mi Lista
              </Link>
              <Link
                href="/anime"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Animes
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/anime"
                className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-gray-200 hover:text-white hover:bg-white/10 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" /> Animes
              </Link>
              <Link
                href="/shared-lists"
                className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-gray-200 hover:text-white hover:bg-white/10 transition-all"
              >
                <Users className="w-3.5 h-3.5 text-slate-300" /> Lista Grupal
              </Link>
            </>
          )}
        </nav>

        {/* Global Search Bar + Notifications + User Dropdown OR Guest Actions */}
        <div className="flex items-center gap-2.5 flex-1 md:flex-none justify-end shrink-0">
          <GlobalSearchBar />
          {isAuthenticated ? (
            <>
              <NotificationsDropdown />
              <UserDropdown />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Iniciar Sesión</span>
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 rounded-full text-xs font-bold text-black bg-white hover:bg-slate-200 transition-all shadow-md flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Registrarse</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


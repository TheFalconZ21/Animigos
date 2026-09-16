"use client";

import { useState } from "react";
import Link from "next/link";
import { Tv, Sparkles, Users, LogIn, UserPlus, Menu, X, ArrowRight, BrainCircuit } from "lucide-react";

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#05070B]/85 border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl p-0.5 bg-gradient-to-br from-white via-slate-300 to-slate-600 shadow-lg shadow-white/5 group-hover:scale-105 transition-all duration-300">
            <div className="w-full h-full bg-[#05070B] rounded-[10px] flex items-center justify-center">
              <Tv className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
              Animigos
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/15">
                Social
              </span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
              Decisiones de Anime en Grupo
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-white/[0.04] p-1.5 rounded-full border border-white/10 shrink-0 backdrop-blur-md">
          <Link
            href="/anime"
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" /> Animes
          </Link>
          <Link
            href="/shared-lists"
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <Users className="w-3.5 h-3.5 text-slate-300" /> Lista Grupal
          </Link>
          <a
            href="#algoritmo"
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-slate-400" /> Algoritmo
          </a>
          <a
            href="#features"
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            ¿Cómo Funciona?
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <Link
            href="/login"
            className="px-4 py-2 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Iniciar Sesión</span>
          </Link>

          <Link
            href="/register"
            className="px-5 py-2 rounded-full text-xs font-bold text-black bg-white hover:bg-slate-200 transition-all shadow-md shadow-white/10 hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Crear Cuenta Gratis</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/login"
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-white/10"
          >
            Entrar
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 border border-white/10"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            href="/anime"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 text-sm font-semibold text-white"
          >
            <span className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-white" /> Animes (Top & De Temporada)
            </span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </Link>
          <Link
            href="/shared-lists"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 text-sm font-semibold text-white"
          >
            <span className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-slate-300" /> Lista Grupal (Salas e Invitados)
            </span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </Link>
          <a
            href="#algoritmo"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 text-sm font-medium text-slate-300"
          >
            <span className="flex items-center gap-2.5">
              <BrainCircuit className="w-4 h-4 text-slate-400" /> Algoritmo de Felicidad
            </span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </a>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl text-center text-sm font-bold text-black bg-white"
            >
              Crear Cuenta Gratis
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl text-center text-xs font-semibold text-slate-300 border border-white/15"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

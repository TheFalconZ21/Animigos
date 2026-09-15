"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Settings, LogOut, ChevronDown, Sparkles, HeartHandshake, Plus } from "lucide-react";

interface UserDropdownProps {
  user?: {
    displayName: string;
    username: string;
    avatarUrl: string;
  };
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const defaultUser = {
    displayName: "Maximiliano",
    username: "MaxiOtaku",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  };

  const currentUser = user || defaultUser;

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* Botón trigger del usuario con estilo no apretado y avatar circular */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-gray-700/80 transition-all cursor-pointer group shrink-0"
      >
        <div className="relative shrink-0 w-9 h-9">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.displayName}
            className="w-9 h-9 min-w-[36px] min-h-[36px] aspect-square rounded-full object-cover border-2 border-purple-500/60 group-hover:scale-105 transition-transform"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0B0F17] rounded-full"></span>
        </div>

        <div className="hidden sm:flex flex-col text-left shrink-0">
          <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
            {currentUser.displayName}
          </span>
          <span className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">
            @{currentUser.username}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-purple-400" : ""}`}
        />
      </button>

      {/* Menú Desplegable (100% Opaco y sin semitransparencia) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0F172A] border border-purple-500/50 shadow-2xl shadow-purple-950/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-2.5 border-b border-gray-800/80 mb-1">
            <p className="text-xs font-semibold text-gray-400">Cuenta de usuario</p>
            <p className="text-sm font-bold text-white truncate">{currentUser.displayName}</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-800/40 mt-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Otaku Senior
            </span>
          </div>

          <div className="space-y-0.5 px-1.5">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-200 hover:text-white hover:bg-purple-900/30 rounded-xl transition-colors"
            >
              <User className="w-4 h-4 text-purple-400" />
              Ver Perfil
            </Link>

            <Link
              href="/profile?tab=settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-200 hover:text-white hover:bg-purple-900/30 rounded-xl transition-colors"
            >
              <Settings className="w-4 h-4 text-cyan-400" />
              Ajustes
            </Link>

            <Link
              href="/profile?tab=test"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-200 hover:text-white hover:bg-purple-900/30 rounded-xl transition-colors"
            >
              <HeartHandshake className="w-4 h-4 text-rose-400" />
              Test de Gustos
            </Link>

            <Link
              href="/shared-lists/new"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-200 hover:text-white hover:bg-purple-900/30 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              Crear Nuevo Grupo
            </Link>
          </div>

          <div className="border-t border-gray-800/80 mt-1 pt-1 px-1.5">
            <button
              onClick={() => {
                setIsOpen(false);
                alert("Has cerrado sesión en Animigos.");
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4" />
              Log Out (Cerrar Sesión)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

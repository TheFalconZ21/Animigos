"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/contexts/AuthContext";
import { useTheme } from "@/core/contexts/ThemeContext";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  HeartHandshake,
  Plus,
  LogIn,
  Users,
} from "lucide-react";

interface UserDropdownProps {
  user?: {
    displayName: string;
    username: string;
    avatarUrl: string;
  };
}

export default function UserDropdown({ user: propUser }: UserDropdownProps) {
  const router = useRouter();
  const { user: authUser, profile, signOut } = useAuth();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentUser = {
    displayName: propUser?.displayName || profile?.displayName || "Usuario",
    username: propUser?.username || profile?.username || "usuario",
    avatarUrl:
      propUser?.avatarUrl ||
      profile?.avatarUrl ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  };

  const isAuthenticated = Boolean(authUser);

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

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    router.push("/login");
  };

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* Botón trigger del usuario */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-gray-700/80 transition-all cursor-pointer group shrink-0"
      >
        <div className="relative shrink-0 w-8 h-8">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.displayName}
            className="w-8 h-8 rounded-full object-cover border-2 group-hover:scale-105 transition-transform"
            style={{ borderColor: `rgba(${theme.primaryRgb}, 0.6)` }}
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0B0F17] rounded-full" />
        </div>

        <div className="hidden sm:flex flex-col text-left shrink-0 max-w-[120px]">
          <span className="text-xs font-bold text-white group-hover:underline transition-colors truncate">
            {currentUser.displayName}
          </span>
          <span className="text-[10px] text-gray-400 font-medium leading-none truncate">
            @{currentUser.username}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          style={{ color: isOpen ? theme.primaryColor : undefined }}
        />
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-60 rounded-2xl border shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl text-left"
          style={{
            backgroundColor: "#0B0F17",
            borderColor: `rgba(${theme.primaryRgb}, 0.4)`,
            boxShadow: `0 20px 50px rgba(0, 0, 0, 0.85), 0 0 25px rgba(${theme.primaryRgb}, 0.15)`,
          }}
        >
          {/* Header del dropdown */}
          <div className="px-4 py-2.5 border-b border-white/10 mb-1">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              {isAuthenticated ? "Cuenta Conectada" : "Modo Invitado / Demo"}
            </p>
            <p className="text-sm font-bold text-white truncate">{currentUser.displayName}</p>
            <span
              className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1"
              style={{
                backgroundColor: `rgba(${theme.primaryRgb}, 0.15)`,
                borderColor: `rgba(${theme.primaryRgb}, 0.35)`,
                color: theme.primaryColor,
              }}
            >
              <Sparkles className="w-3 h-3 text-amber-400" /> Otaku Senior
            </span>
          </div>

          <div className="space-y-0.5 px-1.5">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-200 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <User className="w-4 h-4" style={{ color: theme.primaryColor }} />
              Ver Perfil
            </Link>

            <Link
              href="/profile?tab=friends"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-200 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <Users className="w-4 h-4 text-cyan-400" />
              Mis Amigos
            </Link>

            <Link
              href="/profile?tab=test"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-200 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <HeartHandshake className="w-4 h-4 text-rose-400" />
              Test de Gustos
            </Link>

            <Link
              href="/shared-lists/new"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-200 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              Crear Nuevo Grupo
            </Link>

            <Link
              href="/profile?tab=settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-200 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-400" />
              Ajustes
            </Link>
          </div>

          {/* Sección de Autenticación */}
          <div className="border-t border-white/10 mt-1.5 pt-1.5 px-1.5 space-y-1">
            {!isAuthenticated && (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-all"
                style={{
                  backgroundColor: `rgba(${theme.primaryRgb}, 0.2)`,
                  color: "white",
                }}
              >
                <LogIn className="w-4 h-4" style={{ color: theme.primaryColor }} />
                Iniciar Sesión
              </Link>
            )}

            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

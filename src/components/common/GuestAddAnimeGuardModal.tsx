"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTheme } from "@/core/contexts/ThemeContext";
import {
  getGuestJoinedGroups,
  addGuestJoinedGroup,
  postulateAnimeToGroup,
  GuestJoinedGroup,
} from "@/core/services/guest-session.service";
import {
  Users,
  Lock,
  ArrowRight,
  Check,
  KeyRound,
  LogIn,
  X,
  Sparkles,
  AlertCircle,
} from "lucide-react";

interface GuestAddAnimeGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  anime: {
    malId: number;
    title: string;
    imageUrl?: string;
  } | null;
  onSuccessPostulated?: (groupName: string) => void;
}

// Salas conocidas de demostración con código
const DEMO_KNOWN_GROUPS = [
  {
    id: "demo-list-1",
    name: "Anime de los Viernes 🍿",
    inviteCode: "viernes2026",
  },
  {
    id: "demo-list-2",
    name: "Maratón Vacaciones 🌴",
    inviteCode: "maraton2026",
  },
];

export default function GuestAddAnimeGuardModal({
  isOpen,
  onClose,
  anime,
  onSuccessPostulated,
}: GuestAddAnimeGuardModalProps) {
  const { theme } = useTheme();
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [justJoinedSuccess, setJustJoinedSuccess] = useState(false);

  const guestGroups = useMemo(() => {
    if (!isOpen) return [];
    return getGuestJoinedGroups();
  }, [isOpen, justJoinedSuccess]);

  // Contraste para textos en botones primarios
  const activeTextColor = useMemo(() => {
    const hex = (theme.primaryColor || "#FFFFFF").replace("#", "");
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 128 ? "#05070B" : "#FFFFFF";
    }
    return "#05070B";
  }, [theme.primaryColor]);

  if (!isOpen || !anime) return null;

  const handleQuickJoinAndPostulate = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inviteCodeInput.trim().toLowerCase();
    if (!clean) {
      setCodeError("Ingresa el código de invitación");
      return;
    }

    const matched = DEMO_KNOWN_GROUPS.find(
      (g) => g.inviteCode.toLowerCase() === clean
    );

    if (matched) {
      addGuestJoinedGroup({
        id: matched.id,
        name: matched.name,
        inviteCode: matched.inviteCode,
        guestName: "Invitado",
      });
      postulateAnimeToGroup(matched.id, anime);
      setJustJoinedSuccess(true);
      if (onSuccessPostulated) onSuccessPostulated(matched.name);
      setTimeout(() => {
        onClose();
        setJustJoinedSuccess(false);
        setInviteCodeInput("");
      }, 1400);
    } else {
      setCodeError("Código no válido. Prueba con 'viernes2026' o 'maraton2026'");
    }
  };

  const handlePostulateToSelected = (group: GuestJoinedGroup) => {
    setSelectedGroupId(group.id);
    postulateAnimeToGroup(group.id, anime);
    if (onSuccessPostulated) onSuccessPostulated(group.name);
    setTimeout(() => {
      onClose();
      setSelectedGroupId(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-white border transition-all duration-300 bg-[#0B0F17]"
        style={{
          borderColor: `rgba(${theme.primaryRgb}, 0.45)`,
          boxShadow: `0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(${theme.primaryRgb}, 0.2)`,
        }}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-gray-400 hover:text-white hover:bg-black/90 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mensaje de Éxito Inmediato */}
        {justJoinedSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">¡Postulado con éxito!</h3>
            <p className="text-xs text-gray-300">
              "{anime.title}" fue agregado como candidato a la lista grupal.
            </p>
          </div>
        ) : guestGroups.length === 0 ? (
          /* CASO 1: NO PERTENECE A NINGUNA LISTA GRUPAL -> BLOQUEADO CON OPCIÓN DE UNIRSE */
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Acceso Restringido para Invitados
                </span>
                <h3 className="text-lg font-bold text-white leading-snug">
                  No puedes añadir animes aún
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Actualmente navegas sin cuenta. Como usuario invitado,{" "}
                  <strong>solo puedes añadir animes a listas grupales</strong> en las que hayas
                  sido invitado. No tienes listas personales propias.
                </p>
              </div>
            </div>

            {/* Anime de Referencia */}
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
              {anime.imageUrl && (
                <img
                  src={anime.imageUrl}
                  alt={anime.title}
                  className="w-10 h-14 object-cover rounded-lg shrink-0 border border-white/10"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Anime seleccionado</p>
                <p className="text-xs font-bold text-white truncate">{anime.title}</p>
              </div>
            </div>

            {/* Formulario Rápido: Unirse con código de sala */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-white" />
                <h4 className="text-xs font-bold text-white">¿Tienes un código de Lista Grupal?</h4>
              </div>
              <p className="text-[11px] text-gray-400">
                Ingresa el código de invitación de tus amigos para unirte a la sala y postular este
                anime:
              </p>

              <form onSubmit={handleQuickJoinAndPostulate} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ej. viernes2026"
                    value={inviteCodeInput}
                    onChange={(e) => {
                      setInviteCodeInput(e.target.value);
                      if (codeError) setCodeError(null);
                    }}
                    className="flex-1 bg-black/80 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold transition-all shadow active:scale-95 shrink-0"
                    style={{
                      background: theme.primaryColor,
                      color: activeTextColor,
                    }}
                  >
                    Unirme y Postular
                  </button>
                </div>
                {codeError && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" /> {codeError}
                  </p>
                )}
              </form>
            </div>

            {/* Alternativa: Iniciar Sesión para crear listas propias */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                href="/login"
                className="w-full sm:w-auto text-xs text-gray-300 hover:text-white flex items-center justify-center gap-1.5 py-2 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" /> ¿Prefieres crear tu propia cuenta? Inicia sesión
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-semibold transition-all"
              >
                Entendido
              </button>
            </div>
          </div>
        ) : (
          /* CASO 2: EL INVITADO YA PERTENECE A LISTAS GRUPALES -> SELECCIONAR O CONFIRMAR */
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Postular a Lista Grupal</h3>
                <p className="text-xs text-gray-400">
                  Selecciona la sala donde eres invitado para postular:
                </p>
              </div>
            </div>

            {/* Anime de Referencia */}
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
              {anime.imageUrl && (
                <img
                  src={anime.imageUrl}
                  alt={anime.title}
                  className="w-10 h-14 object-cover rounded-lg shrink-0 border border-white/10"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Anime</p>
                <p className="text-xs font-bold text-white truncate">{anime.title}</p>
              </div>
            </div>

            {/* Listado de Grupos donde es participante */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {guestGroups.map((group) => {
                const isSelected = selectedGroupId === group.id;
                return (
                  <button
                    key={group.id}
                    onClick={() => handlePostulateToSelected(group)}
                    className="w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all hover:border-white/40 hover:bg-white/[0.04] group"
                    style={{
                      borderColor: isSelected
                        ? theme.primaryColor
                        : "rgba(255, 255, 255, 0.15)",
                      backgroundColor: isSelected ? "rgba(255, 255, 255, 0.08)" : undefined,
                    }}
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-white group-hover:text-white flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        {group.name}
                      </p>
                      {group.inviteCode && (
                        <p className="text-[10px] text-gray-400 font-mono">
                          Código: {group.inviteCode}
                        </p>
                      )}
                    </div>

                    <span
                      className="px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 flex items-center gap-1"
                      style={{
                        background: isSelected ? "#059669" : theme.primaryColor,
                        color: isSelected ? "#FFFFFF" : activeTextColor,
                      }}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3 h-3" /> ¡Postulado!
                        </>
                      ) : (
                        <>Postular</>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-gray-300 hover:text-white font-semibold transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

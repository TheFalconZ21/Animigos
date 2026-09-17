"use client";

import { useTheme } from "@/core/contexts/ThemeContext";
import { AlertTriangle, LogOut, X } from "lucide-react";

interface ConfirmLeaveGroupModalProps {
  isOpen: boolean;
  groupName: string;
  onClose: () => void;
  onConfirm: () => void;
  isLeaving?: boolean;
}

export default function ConfirmLeaveGroupModal({
  isOpen,
  groupName,
  onClose,
  onConfirm,
  isLeaving = false,
}: ConfirmLeaveGroupModalProps) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative text-white border bg-[#0B0F17] animate-scaleUp"
        style={{
          borderColor: "rgba(244, 63, 94, 0.4)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(244, 63, 94, 0.15)",
        }}
      >
        {/* Botón de Cierre */}
        <button
          onClick={onClose}
          disabled={isLeaving}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-black/90 transition-all disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
              Confirmación Requerida
            </span>
            <h3 className="text-lg font-bold text-white leading-snug">
              ¿Deseas abandonar "{groupName}"?
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Saldrás de esta lista grupal y dejarás de participar en sus votaciones y postulaciones.
              Para volver a ingresar en el futuro, necesitarás el enlace o código de invitación de la sala.
            </p>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLeaving}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-gray-300 hover:text-white font-semibold transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLeaving}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/30 flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLeaving ? "Abandonando..." : "Sí, Abandonar Lista"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

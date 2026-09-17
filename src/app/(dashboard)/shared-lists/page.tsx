"use client";

import { useState } from "react";
import Navbar from "@/components/common/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/contexts/AuthContext";
import { addGuestJoinedGroup, removeGuestJoinedGroup } from "@/core/services/guest-session.service";
import ConfirmLeaveGroupModal from "@/components/shared-lists/ConfirmLeaveGroupModal";
import {
  Users,
  Plus,
  ArrowRight,
  Share2,
  KeyRound,
  Check,
  Info,
  Sparkles,
  LogOut,
} from "lucide-react";

export default function SharedListsIndexPage() {
  const { user } = useAuth();
  const router = useRouter();
  const isAuthenticated = Boolean(user);

  const [inputCode, setInputCode] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Estado para gestión de abandono de lista grupal
  const [leavingList, setLeavingList] = useState<{ id: string; name: string; inviteCode: string } | null>(null);
  const [leaveToast, setLeaveToast] = useState<string | null>(null);

  const [sharedLists, setSharedLists] = useState([
    {
      id: "demo-list-1",
      name: "Anime de los Viernes 🍿",
      description: "Grupo de maratón semanal entre amigos.",
      status: "Votación en curso",
      membersCount: 4,
      inviteCode: "viernes2026",
      candidatesCount: 3,
    },
    {
      id: "demo-list-2",
      name: "Maratón Vacaciones 🌴",
      description: "Postulaciones abiertas para decidir qué ver en el viaje.",
      status: "Candidatos abiertos",
      membersCount: 3,
      inviteCode: "maraton2026",
      candidatesCount: 5,
    },
  ]);

  const handleJoinWithCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = inputCode.trim().toLowerCase();
    if (!cleanCode) {
      setJoinError("Por favor ingresa un código");
      return;
    }

    const matchingList = sharedLists.find(
      (l) => l.inviteCode.toLowerCase() === cleanCode
    );

    if (matchingList) {
      if (!isAuthenticated) {
        addGuestJoinedGroup({
          id: matchingList.id,
          name: matchingList.name,
          inviteCode: matchingList.inviteCode,
          guestName: "Invitado",
        });
      }
      router.push(`/shared-lists/${matchingList.id}`);
    } else {
      router.push(`/join/${cleanCode}`);
    }
  };

  const handleCopyLink = (list: (typeof sharedLists)[0]) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/join/${list.inviteCode}`;
      navigator.clipboard.writeText(url);
      setCopiedCode(list.id);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  const handleConfirmLeave = () => {
    if (!leavingList) return;
    removeGuestJoinedGroup(leavingList.id);
    setSharedLists((prev) => prev.filter((l) => l.id !== leavingList.id));
    setLeaveToast(`Has abandonado la lista "${leavingList.name}"`);
    setLeavingList(null);
    setTimeout(() => setLeaveToast(null), 3500);
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel p-6 sm:p-8 rounded-3xl border border-white/15">
          <div className="space-y-2 max-w-xl">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Users className="w-8 h-8 text-white" /> Listas Compartidas (Grupales)
            </h1>
            <p className="text-sm text-slate-400">
              Coordina decisiones con tu grupo. Voten su interés (0 a 10) y el Algoritmo de Felicidad calculará la opción con mayor consenso.
            </p>

            {/* Aviso para modo invitado */}
            {!isAuthenticated && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-slate-300 mt-2">
                <Info className="w-4 h-4 text-white shrink-0" />
                <span>
                  <strong>Modo Invitado:</strong> Puedes unirte a salas grupales existentes mediante enlace o código. Inicia sesión para crear nuevas salas.
                </span>
              </div>
            )}
          </div>

          {/* Acciones del Header: Si está autenticado -> Crear lista. Si es invitado -> Formulario para unirse con código */}
          {isAuthenticated ? (
            <Link
              href="/shared-lists/new"
              className="px-5 py-3 text-sm font-bold text-black bg-white hover:bg-slate-200 rounded-2xl shadow-lg shadow-white/10 transition-all flex items-center gap-2 self-start md:self-auto active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" /> + Crear Nueva Lista Compartida
            </Link>
          ) : (
            <form
              onSubmit={handleJoinWithCode}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 self-start md:self-auto w-full md:w-auto shrink-0"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Código de sala (ej. viernes2026)"
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value);
                    if (joinError) setJoinError(null);
                  }}
                  className="bg-black/70 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-white w-full sm:w-60"
                />
                {joinError && (
                  <span className="absolute -bottom-4 left-1 text-[10px] text-rose-400 font-medium">
                    {joinError}
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-black bg-white hover:bg-slate-200 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Unirse a Sala</span>
              </button>
            </form>
          )}
        </div>

        {/* List Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sharedLists.map((list) => (
            <div
              key={list.id}
              className="glass-card p-6 sm:p-7 rounded-3xl border border-white/15 bg-[#0C111D]/85 flex flex-col justify-between hover:border-white/30 transition-all shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="px-3 py-1 text-xs font-semibold bg-white/10 text-white border border-white/20 rounded-full">
                    {list.status}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                    <Users className="w-3.5 h-3.5 text-white" /> {list.membersCount} integrantes
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white mb-1.5">{list.name}</h2>
                <p className="text-xs text-slate-400 mb-5 leading-relaxed">{list.description}</p>

                {/* Código de invitación y botón para copiar link */}
                <div className="bg-black/50 p-3 rounded-2xl border border-white/10 flex items-center justify-between text-xs mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Código:</span>
                    <code className="font-mono text-white font-bold bg-white/10 px-2.5 py-1 rounded-lg border border-white/15">
                      {list.inviteCode}
                    </code>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyLink(list)}
                    className="text-[11px] font-semibold text-slate-300 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1.5"
                    title="Copiar enlace de invitación"
                  >
                    {copiedCode === list.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedCode === list.id ? "¡Link Copiado!" : "Copiar Enlace"}</span>
                  </button>
                </div>
              </div>

              {/* Botón Principal de Entrada + Botón de Abandonar Lista */}
              <div className="flex items-center gap-2.5 pt-2">
                <Link
                  href={`/shared-lists/${list.id}`}
                  className="flex-1 py-3 text-center text-sm font-bold text-black bg-white hover:bg-slate-200 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.99] shadow-lg shadow-white/10"
                >
                  <span>Entrar a la Sala de Votación</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => setLeavingList(list)}
                  className="px-4 py-3 rounded-2xl border border-rose-500/30 text-rose-400 hover:text-white hover:bg-rose-950/60 transition-all flex items-center justify-center gap-1.5 text-xs font-bold shrink-0 hover:border-rose-500/60 active:scale-95"
                  title="Abandonar esta lista grupal"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Abandonar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal de Confirmación para Abandonar Lista */}
      <ConfirmLeaveGroupModal
        isOpen={Boolean(leavingList)}
        groupName={leavingList?.name || "Lista Grupal"}
        onClose={() => setLeavingList(null)}
        onConfirm={handleConfirmLeave}
      />

      {/* Toast de Retroalimentación al Abandonar */}
      {leaveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-rose-950/90 text-rose-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-rose-500/40 animate-fadeIn">
          <LogOut className="w-4 h-4 text-rose-400" /> {leaveToast}
        </div>
      )}
    </div>
  );
}

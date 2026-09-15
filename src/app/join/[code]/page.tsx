"use client";

import { useState } from "react";
import Navbar from "@/components/common/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, UserCheck, Sparkles, ArrowRight } from "lucide-react";

export default function JoinSharedListPage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const [guestName, setGuestName] = useState("");
  const [joining, setJoining] = useState(false);

  const handleJoinAsGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setJoining(true);
    // Simulación de unión de usuario invitado
    setTimeout(() => {
      router.push(`/shared-lists/demo-list-1`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-16 flex flex-col justify-center">
        <div className="glass-panel p-8 rounded-3xl border border-gray-800 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 mx-auto mb-4 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-[#0B0F17] rounded-[14px] flex items-center justify-center">
              <Users className="w-7 h-7 text-purple-400" />
            </div>
          </div>

          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block mb-1">
            Invitación de Grupo
          </span>
          <h1 className="text-2xl font-bold text-white mb-2">
            ¡Te han invitado a "Anime de los Viernes"!
          </h1>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Ingresa como invitado sin necesidad de registrarte para votar qué anime ver juntos.
          </p>

          <form onSubmit={handleJoinAsGuest} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Tu Nombre o Apodo (Para que el grupo te identifique)
              </label>
              <input
                type="text"
                placeholder="Ej. Carlos o Juanita"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={joining || !guestName.trim()}
              className="w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 rounded-xl shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{joining ? "Entrando a la sala..." : "Entrar como Invitado"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0B0F17] px-2 text-gray-500">O si ya tienes cuenta</span>
            </div>
          </div>

          <Link
            href="/login"
            className="w-full py-2.5 text-xs font-semibold text-purple-300 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5" /> Iniciar Sesión con mi Cuenta
          </Link>
        </div>
      </main>
    </div>
  );
}

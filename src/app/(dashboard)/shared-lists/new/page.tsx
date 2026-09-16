"use client";

import { useState } from "react";
import Navbar from "@/components/common/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/contexts/AuthContext";
import { Users, Plus, ArrowRight, ShieldAlert, KeyRound, LogIn, UserPlus } from "lucide-react";

export default function NewSharedListPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);

    // Simulación de creación
    setTimeout(() => {
      router.push("/shared-lists/demo-list-1");
    }, 600);
  };

  // Si no hay usuario logeado, bloquear la creación y permitir únicamente unirse con link o código
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-md w-full mx-auto px-4 py-16 flex flex-col justify-center text-center">
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/15 shadow-2xl space-y-6 bg-[#0B0F18]/90">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mx-auto shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-white tracking-tight">
                Inicio de Sesión Requerido
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                No se permite crear listas grupales sin una cuenta iniciada. Como invitado temporal, únicamente puedes unirte a una lista existente mediante su enlace o código de invitación.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <Link
                href="/shared-lists"
                className="w-full py-3.5 rounded-2xl bg-white text-black font-extrabold text-xs hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10"
              >
                <KeyRound className="w-4 h-4" />
                <span>Unirse a una Lista con Código</span>
              </Link>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <Link
                  href="/login"
                  className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Iniciar Sesión</span>
                </Link>
                <Link
                  href="/register"
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Registrarse</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-12 flex flex-col justify-center">
        <div className="glass-panel p-8 rounded-3xl border border-white/15 shadow-2xl bg-[#0B0F18]/90">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="p-3 rounded-2xl bg-white/10 border border-white/20 text-white">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Crear Lista Compartida</h1>
              <p className="text-xs text-slate-400">Arma un grupo para votar qué anime ver juntos.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nombre de la Lista o Grupo *
              </label>
              <input
                type="text"
                placeholder="Ej. Anime de los Viernes, Maratón Películas..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Descripción o Reglas (Opcional)
              </label>
              <textarea
                placeholder="Ej. Solo animes de menos de 24 episodios, género suspenso o comedia..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/15 text-xs text-slate-300 leading-relaxed">
              💡 <strong>Invitados habilitados:</strong> Al crear la lista obtendrás un enlace único y un código propio. Podrás invitar a tus amigos o a personas sin cuenta (usuarios invitados) para que voten de inmediato.
            </div>

            <button
              type="submit"
              disabled={creating || !name.trim()}
              className="w-full py-3.5 text-sm font-extrabold text-black bg-white hover:bg-slate-200 rounded-xl shadow-lg shadow-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
            >
              <span>{creating ? "Creando grupo..." : "Crear Lista Compartida"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

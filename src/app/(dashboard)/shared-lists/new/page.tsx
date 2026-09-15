"use client";

import { useState } from "react";
import Navbar from "@/components/common/Navbar";
import { useRouter } from "next/navigation";
import { Users, Plus, ArrowRight } from "lucide-react";

export default function NewSharedListPage() {
  const router = useRouter();
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

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-12 flex flex-col justify-center">
        <div className="glass-panel p-8 rounded-3xl border border-gray-800 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-purple-950 border border-purple-800 text-purple-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Crear Lista Compartida</h1>
              <p className="text-xs text-gray-400">Arma un grupo para votar qué anime ver juntos.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Nombre de la Lista o Grupo *
              </label>
              <input
                type="text"
                placeholder="Ej. Anime de los Viernes, Maratón Películas..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Descripción o Reglas (Opcional)
              </label>
              <textarea
                placeholder="Ej. Solo animes de menos de 24 episodios, género suspenso o comedia..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-900/40 text-xs text-purple-300">
              💡 <strong>Invitados habilitados:</strong> Al crear la lista obtendrás un enlace único. Podrás invitar a tus amigos o a personas sin cuenta (usuarios invitados).
            </div>

            <button
              type="submit"
              disabled={creating || !name.trim()}
              className="w-full py-3.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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

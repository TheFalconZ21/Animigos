"use client";

import Navbar from "@/components/common/Navbar";
import Link from "next/link";
import { Users, Plus, Vote, ArrowRight, Share2, Sparkles } from "lucide-react";

export default function SharedListsIndexPage() {
  const sharedLists = [
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
  ];

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 glass-panel p-6 rounded-2xl border">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Users className="w-7 h-7 text-[var(--theme-primary)]" /> Listas Compartidas (Grupales)
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Coordina decisiones con tus amigos o invitados. Voten su interés (0-10) y obtengan recomendaciones objetivas.
            </p>
          </div>

          <Link
            href="/shared-lists/new"
            className="px-4 py-2.5 text-sm font-bold text-black bg-white hover:bg-slate-200 rounded-xl shadow-lg shadow-white/10 transition-all flex items-center gap-2 self-start md:self-auto active:scale-95"
          >
            <Plus className="w-4 h-4" /> + Crear Nueva Lista Compartida
          </Link>
        </div>

        {/* List Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sharedLists.map((list) => (
            <div key={list.id} className="glass-card p-6 rounded-3xl border border-white/15 bg-[#0C111D]/80 flex flex-col justify-between hover:border-white/30 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 text-xs font-semibold bg-white/10 text-white border border-white/20 rounded-full">
                    {list.status}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-white" /> {list.membersCount} integrantes
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white mb-1">{list.name}</h2>
                <p className="text-xs text-gray-400 mb-4">{list.description}</p>

                <div className="bg-black/40 p-3 rounded-2xl border border-white/10 flex items-center justify-between text-xs mb-6">
                  <span className="text-gray-400">Código de invitación:</span>
                  <code className="font-mono text-white font-bold bg-white/10 px-2.5 py-1 rounded-lg border border-white/15">
                    {list.inviteCode}
                  </code>
                </div>
              </div>

              <Link
                href={`/shared-lists/${list.id}`}
                className="w-full py-3 text-center text-sm font-bold text-black bg-white hover:bg-slate-200 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.99] shadow-lg shadow-white/10"
              >
                <span>Entrar a la Sala de Votación</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

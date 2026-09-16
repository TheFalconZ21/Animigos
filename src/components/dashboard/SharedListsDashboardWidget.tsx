"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getUserSharedListsOverview, SharedListOverview } from "@/core/services/shared-list.service";
import { useAuth } from "@/core/contexts/AuthContext";
import { Users, AlertTriangle, Vote, Trophy, ArrowRight, Plus } from "lucide-react";

export default function SharedListsDashboardWidget() {
  const { user } = useAuth();
  const activeUserId = user?.id || "demo-user-1";
  const [lists, setLists] = useState<SharedListOverview[]>([]);

  useEffect(() => {
    getUserSharedListsOverview(activeUserId).then(setLists);
  }, [activeUserId]);

  return (
    <div className="glass-card p-5 rounded-3xl border border-gray-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" /> Listas Compartidas Activas
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Grupos en proceso de votación
          </p>
        </div>
        {lists.length > 0 && (
          <Link href="/shared-lists" className="text-xs font-semibold text-purple-400 hover:text-purple-300 shrink-0">
            Ver todas ({lists.length}) →
          </Link>
        )}
      </div>

      {/* Si no hay listas aún */}
      {lists.length === 0 ? (
        <div className="py-6 px-4 text-center border border-dashed border-gray-800 rounded-2xl bg-gray-950/40 space-y-3">
          <div className="w-10 h-10 rounded-full bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center mx-auto text-cyan-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-300">Sin grupos activos</p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Crea tu primer grupo para coordinar con amigos qué anime ver juntos.
            </p>
          </div>
          <Link
            href="/shared-lists/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-600/30"
          >
            <Plus className="w-3.5 h-3.5" /> Crear Grupo
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
        {lists.map((list) => {
          const hasUnvoted = list.unvotedCandidatesCount > 0;

          return (
            <div
              key={list.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between transition-all relative overflow-hidden ${
                hasUnvoted
                  ? "border-amber-500/50 bg-gradient-to-br from-amber-950/20 via-gray-900/80 to-gray-950 shadow-md shadow-amber-950/20"
                  : "border-gray-800/80 bg-gray-900/60 hover:bg-gray-800/80"
              }`}
            >
              <div>
                {/* List Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-800/50 rounded-full">
                      {list.status}
                    </span>
                    {hasUnvoted && (
                      <span
                        title={`Tienes ${list.unvotedCandidatesCount} candidatos sin votar`}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 shadow-md shadow-amber-500/30 animate-pulse cursor-help"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 fill-gray-950 text-amber-500" />
                        {list.unvotedCandidatesCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Users className="w-3 h-3 text-cyan-400" /> {list.membersCount}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-white mb-2.5">{list.name}</h4>

                {/* Winner / Top Candidate Box */}
                {list.topCandidate && (
                  <div className="bg-gray-950/70 p-2.5 rounded-xl border border-gray-800/90 mb-3">
                    <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-400" /> Líder Momentáneo
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate max-w-[150px]">
                        {list.topCandidate.title}
                      </span>
                      <span className="text-[11px] font-extrabold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-800/60">
                        ★ {list.topCandidate.happinessScore}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <Link
                href={`/shared-lists/${list.id}${hasUnvoted ? "?filter=unvoted" : ""}`}
                className={`w-full py-2 text-center text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  hasUnvoted
                    ? "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-gray-950 shadow-md shadow-amber-600/30"
                    : "bg-purple-900/40 hover:bg-purple-900/70 text-purple-200 border border-purple-800/40"
                }`}
              >
                <Vote className="w-3.5 h-3.5" />
                {hasUnvoted ? "Ir a Votar Candidatos" : "Entrar a la Sala"}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}

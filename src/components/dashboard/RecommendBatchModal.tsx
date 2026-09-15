"use client";

import { useState } from "react";
import { PersonalFolder, PersonalItem } from "@/components/dashboard/FolderCard";
import { MOCK_USER_FRIENDS } from "@/core/services/catalog-data";
import { X, Send, Check, Layers, Film, Filter, Sparkles, Folder } from "lucide-react";

interface RecommendBatchModalProps {
  filterSummary: string;
  matchingFolders: PersonalFolder[];
  matchingLooseAnimes: PersonalItem[];
  onClose: () => void;
  onSend: (targetFriendId: string, note: string) => void;
}

export default function RecommendBatchModal({
  filterSummary,
  matchingFolders,
  matchingLooseAnimes,
  onClose,
  onSend,
}: RecommendBatchModalProps) {
  const [selectedFriendId, setSelectedFriendId] = useState(MOCK_USER_FRIENDS[0]?.id || "");
  const [note, setNote] = useState("");
  const [success, setSuccess] = useState(false);

  const totalFoldersCount = matchingFolders.length;
  const totalLooseCount = matchingLooseAnimes.length;
  const totalAnimesCount =
    totalLooseCount + matchingFolders.reduce((acc, f) => acc + f.animes.length, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(selectedFriendId, note);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0F172A] border-2 border-emerald-500/50 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-white space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-950 text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-700/50 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Recomendar Selección Filtrada
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">Recomendar Paquete de Animes</h2>
          <p className="text-xs text-gray-400">
            Recomienda de golpe a un amigo todos los animes y sagas que cumplen con tus filtros actuales.
          </p>

          {/* Active Filter Criteria Summary Badge */}
          <div className="bg-slate-900 p-3 rounded-2xl border border-gray-800 text-xs flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-gray-400 font-semibold">Criterios de Selección:</span>
            <span className="text-emerald-300 font-bold">{filterSummary}</span>
          </div>
        </div>

        {/* Package Contents Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-300 uppercase tracking-wider">
            <span>Contenido del Paquete a Enviar</span>
            <span className="text-emerald-400 font-extrabold">
              {totalFoldersCount} sagas ({totalAnimesCount} animes totales)
            </span>
          </div>

          <div className="space-y-3 max-h-52 overflow-y-auto bg-slate-950/70 p-3.5 rounded-2xl border border-gray-800/80">
            {/* Matching Folders */}
            {matchingFolders.map((folder) => (
              <div key={folder.id} className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Folder className="w-3.5 h-3.5 text-purple-400" /> Carpeta Saga: {folder.title}
                  </span>
                  <span className="text-[10px] bg-purple-900 px-2 py-0.5 rounded-full text-purple-200 font-bold">
                    {folder.animes.length} animes incluidos
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 truncate">
                  {folder.animes.map((a) => a.title).join(" • ")}
                </p>
              </div>
            ))}

            {/* Matching Loose Animes */}
            {matchingLooseAnimes.map((anime) => (
              <div key={anime.malId} className="p-2.5 rounded-xl bg-slate-900 border border-gray-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={anime.imageUrl} alt={anime.title} className="w-7 h-10 object-cover rounded shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{anime.title}</p>
                    <p className="text-[10px] text-gray-400">★ {anime.score} • {anime.studio}</p>
                  </div>
                </div>
                <span className="text-[10px] bg-gray-800 text-gray-300 font-semibold px-2 py-0.5 rounded-md shrink-0">
                  Anime Suelto
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Target Friend & Custom Note Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Amigo Destinatario
              </label>
              <select
                value={selectedFriendId}
                onChange={(e) => setSelectedFriendId(e.target.value)}
                className="w-full bg-slate-900 border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {MOCK_USER_FRIENDS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.username})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Mensaje o Nota Personalizada
              </label>
              <input
                type="text"
                placeholder="Ej: 'Te envié esta selección de romance de los 2010s...'"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-900 border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950 flex items-center gap-1.5"
            >
              {success ? <Check className="w-4 h-4 text-emerald-200" /> : <Send className="w-4 h-4" />}
              {success ? "¡Selección Enviada a tu Amigo!" : "Enviar Selección Recomendada"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

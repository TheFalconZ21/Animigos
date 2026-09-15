"use client";

import { useState } from "react";
import { PersonalFolder } from "@/components/dashboard/FolderCard";
import { MOCK_USER_FRIENDS } from "@/core/services/catalog-data";
import { X, Send, Check, AlertTriangle, Layers, Folder, ArrowRight } from "lucide-react";

interface RecommendFolderModalProps {
  folder: PersonalFolder;
  onClose: () => void;
  onSend: (targetFriendId: string, note: string) => void;
}

export default function RecommendFolderModal({ folder, onClose, onSend }: RecommendFolderModalProps) {
  const [selectedFriendId, setSelectedFriendId] = useState(MOCK_USER_FRIENDS[0]?.id || "");
  const [note, setNote] = useState("");
  const [success, setSuccess] = useState(false);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0F172A] border border-purple-500/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-white space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <Send className="w-4 h-4" /> Recomendar Carpeta / Saga
          </span>
          <h2 className="text-2xl font-black text-white">Recomendar "{folder.title}"</h2>
          <p className="text-xs text-gray-400">
            Comparte esta saga completa ({folder.animes.length} animes) con un amigo para que pueda configurarla y agregarla a sus listas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              Amigo Destinatario
            </label>
            <select
              value={selectedFriendId}
              onChange={(e) => setSelectedFriendId(e.target.value)}
              className="w-full bg-slate-900 border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              {MOCK_USER_FRIENDS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.username})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
              Nota o Mensaje Personalizado
            </label>
            <textarea
              rows={3}
              placeholder="Ej: 'Tienes que ver esta saga en este orden cronológico exacto...'"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-900 border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
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
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              {success ? <Check className="w-4 h-4 text-emerald-300" /> : <Send className="w-4 h-4" />}
              {success ? "¡Recomendación Enviada!" : "Enviar Recomendación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ImportFolderConfirmationModalProps {
  recommendedFolder: PersonalFolder;
  conflictingAnimes: string[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function ImportFolderConfirmationModal({
  recommendedFolder,
  conflictingAnimes,
  onConfirm,
  onCancel,
}: ImportFolderConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0F172A] border-2 border-amber-500/60 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-white space-y-5">
        <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/60 flex items-center justify-center text-amber-400">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black text-white">¡Confirmación de Importación de Carpeta!</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Estás a punto de agregar la carpeta <strong className="text-purple-300">"{recommendedFolder.title}"</strong> a tu colección.
          </p>
        </div>

        {conflictingAnimes.length > 0 && (
          <div className="bg-amber-950/40 border border-amber-800/60 p-4 rounded-2xl space-y-2 text-xs">
            <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Animes con reubicación requerida:
            </span>
            <p className="text-gray-300 text-[11px]">
              Los siguientes animes ya pertenecían a otras de tus carpetas o listas sueltas y serán <strong>movidos a esta nueva carpeta</strong> (un anime solo puede estar en 1 carpeta a la vez):
            </p>
            <ul className="list-disc list-inside text-amber-200 font-semibold space-y-0.5 pt-1">
              {conflictingAnimes.map((title, i) => (
                <li key={i}>{title}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
          >
            Cancelar Importación
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-lg shadow-amber-950 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Confirmar y Mover Animes
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { PersonalFolder, PersonalItem } from "@/components/dashboard/FolderCard";
import { X, Check, AlertTriangle, Folder, Layers, Sparkles, RefreshCw } from "lucide-react";

interface ImportBatchConfirmationModalProps {
  senderName: string;
  note?: string;
  recommendedFolders: PersonalFolder[];
  recommendedLooseAnimes: PersonalItem[];
  skippedWatchedTitles: string[];
  relocatedAnimeTitles: string[];
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ImportBatchConfirmationModal({
  senderName,
  note,
  recommendedFolders,
  recommendedLooseAnimes,
  skippedWatchedTitles,
  relocatedAnimeTitles,
  onConfirm,
  onCancel,
}: ImportBatchConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0F172A] border-2 border-emerald-500/60 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-white space-y-5">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <span className="bg-emerald-950 text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-700/50 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Selección Recibida de {senderName}
          </span>
          <h2 className="text-2xl font-black text-white">Importar Selección Recomendada</h2>
          {note && (
            <p className="text-xs text-gray-300 italic bg-slate-900/90 p-3 rounded-2xl border border-gray-800">
              "{note}"
            </p>
          )}
        </div>

        {/* Breakdown Summary */}
        <div className="space-y-3 text-xs">
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-gray-800 space-y-2">
            <span className="font-bold text-gray-300 uppercase tracking-wider text-[11px] block">
              Resumen de la Importación
            </span>
            <div className="grid grid-cols-2 gap-2 text-gray-400">
              <div>• Carpetas Sagas a incorporar: <strong className="text-purple-300">{recommendedFolders.length}</strong></div>
              <div>• Animes Sueltos nuevos: <strong className="text-emerald-300">{recommendedLooseAnimes.length}</strong></div>
            </div>
          </div>

          {/* Skipped Watched Animes Warning */}
          {skippedWatchedTitles.length > 0 && (
            <div className="bg-slate-900/80 border border-gray-800 p-3.5 rounded-2xl space-y-1">
              <span className="font-bold text-amber-300 flex items-center gap-1.5 text-[11px]">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Animes omitidos (ya los tenías registrados como vistos):
              </span>
              <p className="text-[11px] text-gray-400">
                {skippedWatchedTitles.join(", ")}
              </p>
            </div>
          )}

          {/* Relocated Animes Alert */}
          {relocatedAnimeTitles.length > 0 && (
            <div className="bg-amber-950/40 border border-amber-800/60 p-3.5 rounded-2xl space-y-1.5">
              <span className="font-bold text-amber-300 flex items-center gap-1.5 text-[11px]">
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> Reubicación automática de animes a carpetas recibidas:
              </span>
              <p className="text-[11px] text-gray-300">
                Los siguientes animes que ya tenías en tu colección pasarán a formar parte de la carpeta recomendada importada:
              </p>
              <ul className="list-disc list-inside text-amber-200 font-semibold text-[11px] space-y-0.5">
                {relocatedAnimeTitles.map((title, i) => (
                  <li key={i}>{title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-800">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Importar Selección a Mi Lista
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Tag, Plus, Edit2, Trash2, Check, X, Filter } from "lucide-react";

export interface UserTag {
  id: string;
  name: string;
  color: string; // Tailind bg class e.g. "bg-purple-900/60 border-purple-500 text-purple-300"
}

interface TagManagerWidgetProps {
  tags: UserTag[];
  activeTagId: string | null;
  tagAnimeCounts: Record<string, number>;
  onSelectTag: (tagId: string | null) => void;
  onCreateTag: (tagName: string, color: string) => void;
  onRenameTag: (tagId: string, newName: string) => void;
  onDeleteTag: (tagId: string) => void;
}

const PRESET_COLORS = [
  { id: "purple", label: "Morado", bg: "bg-purple-950/80 border-purple-500/60 text-purple-300", chip: "bg-purple-500" },
  { id: "emerald", label: "Esmeralda", bg: "bg-emerald-950/80 border-emerald-500/60 text-emerald-300", chip: "bg-emerald-500" },
  { id: "cyan", label: "Cian", bg: "bg-cyan-950/80 border-cyan-500/60 text-cyan-300", chip: "bg-cyan-500" },
  { id: "amber", label: "Ámbar", bg: "bg-amber-950/80 border-amber-500/60 text-amber-300", chip: "bg-amber-500" },
  { id: "rose", label: "Rosa", bg: "bg-rose-950/80 border-rose-500/60 text-rose-300", chip: "bg-rose-500" },
  { id: "indigo", label: "Índigo", bg: "bg-indigo-950/80 border-indigo-500/60 text-indigo-300", chip: "bg-indigo-500" },
];

export default function TagManagerWidget({
  tags,
  activeTagId,
  tagAnimeCounts,
  onSelectTag,
  onCreateTag,
  onRenameTag,
  onDeleteTag,
}: TagManagerWidgetProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  // Rename Inline State
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    const formatted = newTagName.trim().startsWith("#") ? newTagName.trim() : `#${newTagName.trim()}`;
    onCreateTag(formatted, selectedColor.bg);
    setNewTagName("");
    setIsCreating(false);
  };

  const handleStartRename = (tag: UserTag) => {
    setEditingTagId(tag.id);
    setRenameValue(tag.name);
  };

  const handleSaveRename = (tagId: string) => {
    if (renameValue.trim()) {
      const formatted = renameValue.trim().startsWith("#") ? renameValue.trim() : `#${renameValue.trim()}`;
      onRenameTag(tagId, formatted);
    }
    setEditingTagId(null);
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-cyan-500/40 shadow-2xl space-y-4 bg-[#0F172A]">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Tag className="w-4 h-4 text-cyan-400" /> Mis Tags Personalizados
        </h3>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditingMode(!isEditingMode)}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all border ${
              isEditingMode
                ? "bg-amber-950 text-amber-300 border-amber-500"
                : "bg-gray-900 text-gray-400 hover:text-white border-gray-800"
            }`}
            title="Editar / Renombrar / Eliminar Tags"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="p-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-700/50 hover:bg-cyan-900 text-xs font-bold transition-all"
            title="Crear Nuevo Tag"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mode Status Info */}
      {isEditingMode && (
        <div className="bg-amber-950/40 border border-amber-800/60 p-2.5 rounded-xl text-[11px] text-amber-300 flex items-center justify-between">
          <span>Modo Edición Activo: Haz clic en ✏️ para renombrar o 🗑️ para eliminar un tag.</span>
          <button onClick={() => setIsEditingMode(false)} className="text-amber-400 hover:text-white font-bold">
            Listo
          </button>
        </div>
      )}

      {/* Modal / Form de Creación de Tag */}
      {isCreating && (
        <form onSubmit={handleCreateSubmit} className="bg-slate-900 p-3.5 rounded-2xl border border-cyan-500/40 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Crear Etiqueta Personalizada
            </label>
            <button type="button" onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Ej: #maratón-fin-de-semana, #obras-maestras..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="w-full bg-slate-950 text-xs text-white placeholder-gray-500 px-3 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-cyan-500"
          />

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Color del Tag:</span>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-6 h-6 rounded-full ${c.chip} transition-transform ${
                    selectedColor.id === c.id ? "ring-2 ring-white scale-110" : "opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-2.5 py-1 text-[11px] font-semibold text-gray-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold rounded-lg transition-all"
            >
              Guardar Tag
            </button>
          </div>
        </form>
      )}

      {/* Lista de Tags Chíp Interactivas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase tracking-wider">
          <span>Tags Activos ({tags.length})</span>
          {activeTagId && (
            <button
              onClick={() => onSelectTag(null)}
              className="text-cyan-400 hover:text-cyan-300 font-bold lowercase"
            >
              limpiar filtro tag
            </button>
          )}
        </div>

        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isSelected = activeTagId === tag.id;
              const count = tagAnimeCounts[tag.id] || 0;
              const isEditingThis = editingTagId === tag.id;

              if (isEditingThis) {
                return (
                  <div key={tag.id} className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-xl border border-cyan-500">
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      className="bg-slate-950 text-xs text-white px-2 py-1 rounded-lg border border-gray-700 w-32 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveRename(tag.id)}
                      className="p-1 text-emerald-400 hover:text-white"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingTagId(null)}
                      className="p-1 text-gray-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              }

              return (
                <div key={tag.id} className="flex items-center gap-1">
                  <button
                    onClick={() => onSelectTag(isSelected ? null : tag.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 shadow-sm ${
                      isSelected
                        ? "bg-cyan-600 text-white border-cyan-400 shadow-cyan-950/60 ring-2 ring-cyan-400/50"
                        : `${tag.color} hover:scale-105`
                    }`}
                  >
                    <span>{tag.name}</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-black/40 text-[10px] font-extrabold">
                      {count}
                    </span>
                  </button>

                  {isEditingMode && (
                    <div className="flex items-center gap-0.5 bg-slate-900/90 px-1 py-1 rounded-xl border border-gray-800">
                      <button
                        onClick={() => handleStartRename(tag)}
                        className="p-1 text-gray-400 hover:text-cyan-300"
                        title="Renombrar"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDeleteTag(tag.id)}
                        className="p-1 text-gray-400 hover:text-rose-400"
                        title="Eliminar Tag"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-3 text-center text-xs text-gray-500 italic bg-slate-900/50 rounded-xl">
            No has creado tags aún. Haz clic en el botón '+' para crear uno.
          </div>
        )}
      </div>
    </div>
  );
}

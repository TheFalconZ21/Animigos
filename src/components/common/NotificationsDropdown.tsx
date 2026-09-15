"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, Vote, UserPlus, Sparkles, Check, CheckCheck, Trash2, ArrowRight } from "lucide-react";

export interface NotificationItem {
  id: string;
  type: "vote" | "friend_request" | "recommendation" | "list_invite";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  linkUrl?: string;
  actionText?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "vote",
    title: "🗳️ Votación pendiente en grupo",
    message: "Debes votar en la lista 'Anime de los Viernes' (Otakus de la Noche).",
    timestamp: "Hace 10 min",
    isRead: false,
    linkUrl: "/shared-lists/demo-list-1",
    actionText: "Ir a Votar",
  },
  {
    id: "notif-2",
    type: "friend_request",
    title: "👤 Solicitud de amistad",
    message: "Sofía Martínez (@sofi_anime) te ha enviado una solicitud.",
    timestamp: "Hace 45 min",
    isRead: false,
    linkUrl: "/profile?tab=friends",
    actionText: "Aceptar",
  },
  {
    id: "notif-3",
    type: "recommendation",
    title: "🎉 Recomendación guardada",
    message: "Carlos Gómez guardó tu recomendación de Steins;Gate en su lista.",
    timestamp: "Hace 2 horas",
    isRead: false,
    linkUrl: "/personal-lists",
    actionText: "Ver Mi Lista",
  },
  {
    id: "notif-4",
    type: "list_invite",
    title: "✨ Nueva selección compartida",
    message: "Mateo te envió una selección de 4 animes recomendados de Sci-Fi.",
    timestamp: "Ayer",
    isRead: true,
    linkUrl: "/personal-lists",
    actionText: "Ver Selección",
  },
];

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleMarkItemRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* Trigger Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-gray-700/80 text-gray-300 hover:text-white transition-all cursor-pointer group"
        title="Notificaciones importantes"
      >
        <Bell className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[10px] font-extrabold text-white items-center justify-center">
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Floating Notifications Dropdown (100% Solid Dark bg-[#0F172A]) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0F172A] border border-purple-500/50 shadow-2xl shadow-purple-950/80 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 pb-2.5 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Notificaciones Importantes
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-950 text-rose-300 border border-rose-800 rounded-full">
                  {unreadCount} nuevas
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Leer todas
              </button>
            )}
          </div>

          {/* List of Notification Items */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-800/60 my-1">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400">
                No tienes notificaciones pendientes.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 hover:bg-slate-800/80 transition-colors flex items-start justify-between gap-3 group relative ${
                    !item.isRead ? "bg-purple-950/20" : ""
                  }`}
                >
                  {/* Unread Indicator Dot */}
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0 mt-1.5 shadow-sm shadow-purple-400" />
                  )}

                  {/* Icon & Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-gray-500">{item.timestamp}</span>
                    </div>

                    <p className="text-xs text-gray-300 leading-snug mb-2">
                      {item.message}
                    </p>

                    {item.linkUrl && (
                      <Link
                        href={item.linkUrl}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-bold text-purple-200 bg-purple-900/60 hover:bg-purple-800 border border-purple-700/50 transition-colors"
                      >
                        {item.actionText || "Ver detalles"} <ArrowRight className="w-3 h-3 text-purple-400" />
                      </Link>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!item.isRead && (
                      <button
                        onClick={(e) => handleMarkItemRead(item.id, e)}
                        title="Marcar como leída"
                        className="p-1 text-gray-400 hover:text-emerald-400 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      title="Eliminar"
                      className="p-1 text-gray-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 pt-2 border-t border-gray-800 text-center">
            <Link
              href="/profile?tab=activity"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-gray-400 hover:text-white transition-colors"
            >
              Ver historial completo de actividades →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/core/contexts/AuthContext";
import { useTheme } from "@/core/contexts/ThemeContext";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  subscribeToUserNotifications,
  NotificationItem,
} from "@/core/services/notifications.service";
import {
  Bell,
  Vote,
  UserPlus,
  Sparkles,
  Check,
  CheckCheck,
  ArrowRight,
} from "lucide-react";

export default function NotificationsDropdown() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [hasNewAlert, setHasNewAlert] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeUserId = user?.id || "demo-user-1";

  // Cargar notificaciones iniciales
  useEffect(() => {
    let mounted = true;
    getUserNotifications(activeUserId).then((data) => {
      if (mounted) setNotifications(data);
    });

    // Suscribirse a Supabase Realtime para notificaciones en vivo
    const unsubscribe = subscribeToUserNotifications(
      activeUserId,
      (newNotif) => {
        // Alerta visual de nueva notificación en tiempo real
        setHasNewAlert(true);
        setNotifications((prev) => [newNotif, ...prev.filter((n) => n.id !== newNotif.id)]);
      },
      (updatedNotif) => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === updatedNotif.id ? updatedNotif : n))
        );
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [activeUserId]);

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

  const handleOpenDropdown = () => {
    setIsOpen(!isOpen);
    setHasNewAlert(false);
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await markAllNotificationsAsRead(activeUserId);
  };

  const handleMarkItemRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await markNotificationAsRead(id);
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffMinutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
      if (diffMinutes < 1) return "Ahora";
      if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `Hace ${diffHours} h`;
      return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
    } catch {
      return "Reciente";
    }
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "vote":
        return <Vote className="w-4 h-4 text-purple-400" />;
      case "friend_request":
      case "friend_accepted":
        return <UserPlus className="w-4 h-4 text-cyan-400" />;
      case "recommendation":
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case "list_invite":
        return <Check className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* Botón trigger de notificaciones */}
      <button
        type="button"
        onClick={handleOpenDropdown}
        className="relative w-10 h-10 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-gray-700/80 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer group shrink-0"
        title="Notificaciones"
      >
        <Bell
          className={`w-4 h-4 transition-transform group-hover:scale-110 ${
            hasNewAlert ? "animate-bounce text-amber-400" : ""
          }`}
        />

        {/* Badge contador de no leídas */}
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center text-white border-2 border-[#0B0F17] shadow-lg animate-pulse"
            style={{
              backgroundColor: theme.primaryColor,
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Menú Desplegable de Notificaciones */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl text-left"
          style={{
            backgroundColor: "var(--theme-card-bg, #0F172A)",
            borderColor: `rgba(${theme.primaryRgb}, 0.4)`,
            boxShadow: `0 20px 50px rgba(0, 0, 0, 0.7), 0 0 25px rgba(${theme.primaryRgb}, 0.15)`,
          }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Notificaciones</span>
              {unreadCount > 0 && (
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {unreadCount} nuevas
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold flex items-center gap-1 hover:underline transition-colors"
                style={{ color: theme.primaryColor }}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Marcar leídas
              </button>
            )}
          </div>

          {/* Listado de Notificaciones */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setIsOpen(false)}
                  className={`p-3.5 hover:bg-white/5 transition-colors flex items-start gap-3 relative group ${
                    !n.isRead ? "bg-white/[0.03]" : ""
                  }`}
                >
                  <div
                    className="p-2 rounded-xl border shrink-0 mt-0.5"
                    style={{
                      backgroundColor: `rgba(${theme.primaryRgb}, 0.12)`,
                      borderColor: `rgba(${theme.primaryRgb}, 0.25)`,
                    }}
                  >
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-white truncate">{n.title}</p>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {formatTimestamp(n.createdAt)}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-300 leading-snug">{n.message}</p>

                    {n.linkUrl && (
                      <Link
                        href={n.linkUrl}
                        className="inline-flex items-center gap-1 text-[11px] font-bold mt-1 hover:underline"
                        style={{ color: theme.primaryColor }}
                      >
                        <span>{n.actionText || "Ver detalles"}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>

                  {/* Botón rápido para marcar individualmente como leída */}
                  {!n.isRead && (
                    <button
                      type="button"
                      onClick={(e) => handleMarkItemRead(n.id, e)}
                      title="Marcar como leída"
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-opacity"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-gray-500 text-xs">
                No tienes notificaciones pendientes
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * @file notifications.service.ts
 * @description Capa de servicio para la gestión de notificaciones y suscripciones en tiempo real con Supabase Realtime.
 */

import { createClient as createBrowserClient } from "../supabase/client";

export interface NotificationItem {
  id: string;
  userId: string;
  senderId?: string | null;
  type: "vote" | "friend_request" | "friend_accepted" | "recommendation" | "list_invite";
  title: string;
  message: string;
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
  actionText?: string;
}

const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    userId: "demo-user-1",
    type: "vote",
    title: "🗳️ Votación pendiente en grupo",
    message: "Debes votar en la lista 'Anime de los Viernes' (Otakus de la Noche).",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    isRead: false,
    linkUrl: "/shared-lists",
    actionText: "Ir a Votar",
  },
  {
    id: "notif-2",
    userId: "demo-user-1",
    type: "friend_request",
    title: "👤 Solicitud de amistad",
    message: "Sofía Martínez (@sofi_anime) te ha enviado una solicitud.",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    isRead: false,
    linkUrl: "/profile?tab=friends",
    actionText: "Aceptar",
  },
  {
    id: "notif-3",
    userId: "demo-user-1",
    type: "recommendation",
    title: "🎉 Recomendación guardada",
    message: "Carlos Gómez guardó tu recomendación de Steins;Gate en su lista.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    linkUrl: "/personal-lists",
    actionText: "Ver Lista",
  },
];

function mapRowToNotification(row: any): NotificationItem {
  let actionText = "Ver";
  if (row.type === "vote") actionText = "Ir a Votar";
  else if (row.type === "friend_request") actionText = "Aceptar";
  else if (row.type === "recommendation") actionText = "Ver recomendación";
  else if (row.type === "list_invite") actionText = "Unirse";

  return {
    id: row.id,
    userId: row.user_id,
    senderId: row.sender_id,
    type: row.type,
    title: row.title,
    message: row.message,
    linkUrl: row.link_url,
    isRead: row.is_read,
    createdAt: row.created_at,
    actionText,
  };
}

/**
 * Obtiene todas las notificaciones de un usuario.
 */
export async function getUserNotifications(userId: string): Promise<NotificationItem[]> {
  const supabase = createBrowserClient();

  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error || !data || data.length === 0) {
      return DEMO_NOTIFICATIONS;
    }

    return data.map(mapRowToNotification);
  } catch (err) {
    console.warn("Error al obtener notificaciones de Supabase, usando locales:", err);
    return DEMO_NOTIFICATIONS;
  }
}

/**
 * Marca una notificación como leída en Supabase.
 */
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  const supabase = createBrowserClient();

  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    return !error;
  } catch (err) {
    console.error("Error al marcar notificación como leída:", err);
    return false;
  }
}

/**
 * Marca todas las notificaciones del usuario como leídas.
 */
export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  const supabase = createBrowserClient();

  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    return !error;
  } catch (err) {
    console.error("Error al marcar todas las notificaciones como leídas:", err);
    return false;
  }
}

/**
 * Crea una nueva notificación en Supabase.
 */
export async function createNotification(notif: {
  userId: string;
  senderId?: string | null;
  type: NotificationItem["type"];
  title: string;
  message: string;
  linkUrl?: string;
}): Promise<NotificationItem | null> {
  const supabase = createBrowserClient();

  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: notif.userId,
        sender_id: notif.senderId || null,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        link_url: notif.linkUrl || null,
        is_read: false,
      })
      .select()
      .single();

    if (error || !data) {
      console.warn("No se pudo persistir notificación en Supabase:", error);
      return null;
    }

    return mapRowToNotification(data);
  } catch (err) {
    console.error("Error al crear notificación:", err);
    return null;
  }
}

/**
 * Suscribe al cliente a notificaciones en tiempo real utilizando Supabase Realtime (postgres_changes).
 */
export function subscribeToUserNotifications(
  userId: string,
  onNewNotification: (notif: NotificationItem) => void,
  onUpdateNotification?: (notif: NotificationItem) => void
): () => void {
  const supabase = createBrowserClient();

  const channel = supabase
    .channel(`notifications-${userId}-${Date.now()}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        if (payload.new) {
          const mapped = mapRowToNotification(payload.new);
          onNewNotification(mapped);
        }
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        if (payload.new && onUpdateNotification) {
          const mapped = mapRowToNotification(payload.new);
          onUpdateNotification(mapped);
        }
      }
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log(`[Realtime] Suscrito exitosamente a notificaciones de usuario: ${userId}`);
      }
    });

  return () => {
    supabase.removeChannel(channel);
  };
}

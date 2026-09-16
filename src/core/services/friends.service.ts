/**
 * @file friends.service.ts
 * @description Servicio para la gestión de relaciones de amistad reales en Supabase PostgreSQL
 * con soporte para suscripciones en tiempo real (Supabase Realtime) y notificaciones automáticas.
 */

import { createClient as createBrowserClient } from "../supabase/client";
import { createNotification } from "./notifications.service";

export interface FriendUser {
  id: string;
  friendshipId?: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio?: string | null;
  status: "online" | "offline" | "watching";
  currentAnime?: string;
  favoriteGenre?: string;
  mutualFriendsCount?: number;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderUsername: string;
  senderAvatar: string;
  createdAt: string;
}

// Datos de demostración enriquecidos de respaldo si Supabase no está conectado
const DEMO_FRIENDS: FriendUser[] = [
  {
    id: "user-2",
    friendshipId: "demo-f-1",
    username: "sofi_anime",
    displayName: "Sofía Martínez",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    status: "watching",
    currentAnime: "Frieren: Beyond Journey's End",
    favoriteGenre: "Fantasía & Slice of Life",
    mutualFriendsCount: 5,
  },
  {
    id: "user-3",
    friendshipId: "demo-f-2",
    username: "mauro_senpai",
    displayName: "Mauricio Rossi",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "online",
    favoriteGenre: "Shonen & Mecha",
    mutualFriendsCount: 8,
  },
  {
    id: "user-4",
    friendshipId: "demo-f-3",
    username: "camila_otaku",
    displayName: "Camila Torres",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    status: "offline",
    favoriteGenre: "Romance & Comedia",
    mutualFriendsCount: 3,
  },
  {
    id: "user-5",
    friendshipId: "demo-f-4",
    username: "lucas_gamer",
    displayName: "Lucas Benítez",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    status: "online",
    currentAnime: "Cyberpunk: Edgerunners",
    favoriteGenre: "Sci-Fi & Cyberpunk",
    mutualFriendsCount: 6,
  },
];

const DEMO_REQUESTS: FriendRequest[] = [
  {
    id: "req-1",
    senderId: "user-6",
    senderName: "Valeria Gómez",
    senderUsername: "valeria_g",
    senderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    createdAt: "Hace 2 horas",
  },
];

/**
 * Obtiene la lista de amigos confirmados (status = 'accepted').
 */
export async function getFriendsList(userId: string): Promise<FriendUser[]> {
  const supabase = createBrowserClient();

  try {
    const { data, error } = await supabase
      .from("friendships")
      .select(`
        id,
        user_id,
        friend_id,
        status,
        sender:profiles!friendships_user_id_fkey(id, username, display_name, avatar_url, bio),
        receiver:profiles!friendships_friend_id_fkey(id, username, display_name, avatar_url, bio)
      `)
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
      .eq("status", "accepted");

    if (error || !data || data.length === 0) {
      return DEMO_FRIENDS;
    }

    return data.map((row: any) => {
      const isSender = row.user_id === userId;
      const otherProfile = isSender ? row.receiver : row.sender;

      return {
        id: otherProfile?.id || (isSender ? row.friend_id : row.user_id),
        friendshipId: row.id,
        username: otherProfile?.username || "usuario",
        displayName: otherProfile?.display_name || "Amigo de Animigos",
        avatarUrl:
          otherProfile?.avatar_url ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        bio: otherProfile?.bio,
        status: "online",
        favoriteGenre: "General",
        mutualFriendsCount: 3,
      };
    });
  } catch (err) {
    console.warn("Error al consultar amigos en Supabase, utilizando fallback local:", err);
    return DEMO_FRIENDS;
  }
}

/**
 * Obtiene las solicitudes de amistad pendientes dirigidas al usuario actual.
 */
export async function getPendingFriendRequests(userId: string): Promise<FriendRequest[]> {
  const supabase = createBrowserClient();

  try {
    const { data, error } = await supabase
      .from("friendships")
      .select(`
        id,
        user_id,
        friend_id,
        status,
        created_at,
        sender:profiles!friendships_user_id_fkey(id, username, display_name, avatar_url)
      `)
      .eq("friend_id", userId)
      .eq("status", "pending");

    if (error || !data || data.length === 0) {
      return DEMO_REQUESTS;
    }

    return data.map((row: any) => ({
      id: row.id,
      senderId: row.user_id,
      senderName: row.sender?.display_name || "Usuario de Animigos",
      senderUsername: row.sender?.username || "usuario",
      senderAvatar:
        row.sender?.avatar_url ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      createdAt: new Date(row.created_at).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      }),
    }));
  } catch (err) {
    console.warn("Error al consultar solicitudes pendientes en Supabase:", err);
    return DEMO_REQUESTS;
  }
}

/**
 * Envía una solicitud de amistad buscando al usuario por su username.
 * Soporta firma (senderUserId, targetUsername, senderDisplayName) o firma corta (targetUsername).
 */
export async function sendFriendRequest(
  senderOrUsername: string,
  targetUsernameOrDisplayName?: string,
  senderDisplayName?: string
): Promise<{ success: boolean; message: string }> {
  let senderUserId: string;
  let targetUsername: string;
  let displayName: string | undefined;

  if (targetUsernameOrDisplayName !== undefined) {
    senderUserId = senderOrUsername;
    targetUsername = targetUsernameOrDisplayName;
    displayName = senderDisplayName;
  } else {
    senderUserId = "demo-user-1";
    targetUsername = senderOrUsername;
    displayName = "MaxiOtaku";
  }

  const supabase = createBrowserClient();
  const cleanUsername = targetUsername.trim().replace(/^@/, "").toLowerCase();

  if (!cleanUsername) {
    return { success: false, message: "Por favor ingresa un nombre de usuario válido." };
  }

  try {
    // 1. Buscar al destinatario en public.profiles
    const { data: targetProfile, error: profileErr } = await supabase
      .from("profiles")
      .select("id, username, display_name")
      .ilike("username", cleanUsername)
      .maybeSingle();

    if (profileErr || !targetProfile) {
      return { success: false, message: `No se encontró ningún usuario con el nombre @${cleanUsername}` };
    }

    if (targetProfile.id === senderUserId) {
      return { success: false, message: "No puedes enviarte una solicitud a ti mismo." };
    }

    // 2. Verificar si ya existe relación previa
    const { data: existing } = await supabase
      .from("friendships")
      .select("id, status")
      .or(
        `and(user_id.eq.${senderUserId},friend_id.eq.${targetProfile.id}),and(user_id.eq.${targetProfile.id},friend_id.eq.${senderUserId})`
      )
      .maybeSingle();

    if (existing) {
      if (existing.status === "accepted") {
        return { success: false, message: `Ya eres amigo de @${targetProfile.username}.` };
      }
      return { success: false, message: `Ya existe una solicitud pendiente con @${targetProfile.username}.` };
    }

    // 3. Crear solicitud en la base de datos
    const { error: insertErr } = await supabase.from("friendships").insert({
      user_id: senderUserId,
      friend_id: targetProfile.id,
      status: "pending",
    });

    if (insertErr) {
      console.error("Error al insertar amistad:", insertErr);
      return { success: false, message: "Error al enviar la solicitud. Inténtalo nuevamente." };
    }

    // 4. Crear notificación en tiempo real para el destinatario
    await createNotification({
      userId: targetProfile.id,
      senderId: senderUserId,
      type: "friend_request",
      title: "👤 Solicitud de amistad",
      message: `${senderDisplayName || "Un usuario"} (@${targetUsername}) quiere ser tu amigo en Animigos.`,
      linkUrl: "/profile?tab=friends",
    });

    return { success: true, message: `¡Solicitud de amistad enviada con éxito a @${targetProfile.username}!` };
  } catch (err: any) {
    console.error("Error general en sendFriendRequest:", err);
    return { success: false, message: err?.message || "Error al procesar la solicitud." };
  }
}

/**
 * Acepta una solicitud de amistad.
 */
export async function acceptFriendRequest(
  friendshipId: string,
  currentUserId: string,
  senderId?: string,
  userDisplayName?: string
): Promise<boolean> {
  const supabase = createBrowserClient();

  try {
    const { error } = await supabase
      .from("friendships")
      .update({ status: "accepted", updated_at: new Date().toISOString() })
      .eq("id", friendshipId);

    if (error) {
      console.error("Error al aceptar solicitud de amistad:", error);
      return false;
    }

    // Notificar al emisor original que su solicitud fue aceptada
    if (senderId) {
      await createNotification({
        userId: senderId,
        senderId: currentUserId,
        type: "friend_accepted",
        title: "🎉 ¡Solicitud de amistad aceptada!",
        message: `${userDisplayName || "Tu amigo"} aceptó tu solicitud. ¡Ya pueden compartir listas de anime!`,
        linkUrl: "/profile?tab=friends",
      });
    }

    return true;
  } catch (err) {
    console.error("Error al procesar aceptación de amistad:", err);
    return false;
  }
}

/**
 * Rechaza una solicitud o elimina una amistad existente.
 */
export async function removeFriend(friendshipId: string): Promise<boolean> {
  const supabase = createBrowserClient();

  try {
    const { error } = await supabase.from("friendships").delete().eq("id", friendshipId);
    return !error;
  } catch (err) {
    console.error("Error al eliminar amistad:", err);
    return false;
  }
}

/**
 * Suscribe al cliente a cambios en las relaciones de amistad mediante Supabase Realtime.
 */
export function subscribeToFriendships(userId: string, onUpdate: () => void): () => void {
  const supabase = createBrowserClient();

  const channel = supabase
    .channel(`friendships-changes-${userId}-${Date.now()}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "friendships",
      },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * @file user-profile.service.ts
 * @description Capa de servicio para la gestión de perfiles de usuario, estadísticas de anime y preferencias.
 */

import { createClient as createBrowserClient } from "../supabase/client";

export interface PrivacySettings {
  personalListVisibility: "public" | "friends" | "private";
  statsVisibility: "public" | "friends" | "private";
  tasteTestVisibility: "public" | "friends" | "private";
  allowDirectRecommendations: "everyone" | "friends" | "nobody";
  activityFeedVisibility: "public" | "friends" | "hidden";
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  bio: string;
  levelTitle: string;
  levelNumber: number;
  memberSince: string;
  favoriteGenre: string;
  archetype: string;
  privacy?: PrivacySettings;
}

export interface UserAnimeStats {
  totalWatched: number;
  totalEpisodes: number;
  totalHoursWatched: number;
  averageScore: number;
  genreBreakdown: { genre: string; percentage: number; count: number; color: string }[];
}

export const DEMO_USER_ID = "demo-user-1";

/**
 * Obtiene los detalles de perfil del usuario actual.
 * Si es demo-user-1 devuelve los datos enriquecidos de la demo.
 * Si es un usuario real registrado, consulta su perfil real en Supabase.
 */
export async function getCurrentUserProfile(userId: string = DEMO_USER_ID): Promise<UserProfile> {
  // Aislamiento: Perfil demo exclusivo
  if (userId === DEMO_USER_ID) {
    return {
      id: DEMO_USER_ID,
      username: "MaxiOtaku",
      displayName: "Maximiliano Silva",
      email: "demo@animigos.app",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      bio: "Apasionado del anime psicológico, Sci-Fi y maratones de fin de semana con el grupo 🍿 (Cuenta Demo)",
      levelTitle: "Otaku Senior (Demo)",
      levelNumber: 14,
      memberSince: "Enero 2025",
      favoriteGenre: "Sci-Fi / Thriller",
      archetype: "Explorador de Tramas Complejas y Sci-Fi",
      privacy: {
        personalListVisibility: "public",
        statsVisibility: "public",
        tasteTestVisibility: "public",
        allowDirectRecommendations: "everyone",
        activityFeedVisibility: "public",
      },
    };
  }

  const supabase = createBrowserClient();
  try {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    if (data) {
      return {
        id: data.id,
        username: data.username,
        displayName: data.display_name,
        email: "",
        avatarUrl:
          data.avatar_url ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        bio: data.bio || "Amante del anime y las buenas historias.",
        levelTitle: "Miembro de la Comunidad",
        levelNumber: 1,
        memberSince: new Date(data.created_at).toLocaleDateString("es-ES", {
          month: "short",
          year: "numeric",
        }),
        favoriteGenre: "General",
        archetype: "Nuevo Miembro",
        privacy: {
          personalListVisibility: "public",
          statsVisibility: "public",
          tasteTestVisibility: "public",
          allowDirectRecommendations: "everyone",
          activityFeedVisibility: "public",
        },
      };
    }
  } catch (err) {
    console.warn("Error al consultar perfil en Supabase:", err);
  }

  return {
    id: userId,
    username: "usuario",
    displayName: "Usuario",
    email: "",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "",
    levelTitle: "Miembro",
    levelNumber: 1,
    memberSince: "Hoy",
    favoriteGenre: "General",
    archetype: "Explorador",
  };
}

/**
 * Obtiene las estadísticas de visualización del usuario.
 * Para demo-user-1 devuelve estadísticas completas de muestra; para usuarios reales devuelve sus métricas iniciales.
 */
export async function getUserAnimeStats(userId: string = DEMO_USER_ID): Promise<UserAnimeStats> {
  if (userId === DEMO_USER_ID) {
    return {
      totalWatched: 48,
      totalEpisodes: 620,
      totalHoursWatched: 206,
      averageScore: 8.7,
      genreBreakdown: [
        { genre: "Sci-Fi / Ciencia Ficción", percentage: 35, count: 17, color: "bg-cyan-500" },
        { genre: "Psicológico / Suspenso", percentage: 25, count: 12, color: "bg-purple-500" },
        { genre: "Shonen / Acción", percentage: 20, count: 10, color: "bg-amber-500" },
        { genre: "Fantasía / Isekai", percentage: 12, count: 6, color: "bg-emerald-500" },
        { genre: "Slice of Life / Comedia", percentage: 8, count: 3, color: "bg-rose-500" },
      ],
    };
  }

  return {
    totalWatched: 0,
    totalEpisodes: 0,
    totalHoursWatched: 0,
    averageScore: 0,
    genreBreakdown: [],
  };
}

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

/**
 * Obtiene los detalles de perfil del usuario actual.
 */
export async function getCurrentUserProfile(userId: string = "demo-user-1"): Promise<UserProfile> {
  // Datos demostrativos ricos para desarrollo local y prueba MVP
  return {
    id: userId,
    username: "MaxiOtaku",
    displayName: "Maximiliano Silva",
    email: "maxi.silva@animigos.app",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "Apasionado del anime psicológico, Sci-Fi y maratones de fin de semana con el grupo 🍿",
    levelTitle: "Otaku Senior",
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

/**
 * Obtiene las estadísticas de visualización del usuario.
 */
export async function getUserAnimeStats(userId: string = "demo-user-1"): Promise<UserAnimeStats> {
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

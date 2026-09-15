/**
 * @file public-profile.service.ts
 * @description Servicio para consultar perfiles públicos de otros usuarios, verificar compatibilidad y aplicar configuraciones de privacidad.
 */

import { UserProfile, UserAnimeStats, PrivacySettings } from "./user-profile.service";

export interface PublicUserProfile extends UserProfile {
  friendshipStatus: "friends" | "pending_sent" | "pending_received" | "none";
  compatibilityPercentage: number;
  privacy: PrivacySettings;
  themeId: string;
}

const MOCK_PUBLIC_PROFILES: Record<string, PublicUserProfile> = {
  sofi_anime: {
    id: "user-2",
    username: "sofi_anime",
    displayName: "Sofía Martínez",
    email: "sofia@animigos.app",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    bio: "Fanática incorregible del romance, la fantasía épica y los Slice of Life reconfortantes 🌸✨",
    levelTitle: "Maestra Isekai & Romance",
    levelNumber: 18,
    memberSince: "Febrero 2025",
    favoriteGenre: "Romance & Fantasía",
    archetype: "Romántica & Soñadora de Mundos Mágicos",
    friendshipStatus: "friends",
    compatibilityPercentage: 94,
    themeId: "RomanceYuri",
    privacy: {
      personalListVisibility: "public",
      statsVisibility: "public",
      tasteTestVisibility: "public",
      allowDirectRecommendations: "everyone",
      activityFeedVisibility: "public",
    },
  },
  mauro_senpai: {
    id: "user-3",
    username: "mauro_senpai",
    displayName: "Mauricio Rossi",
    email: "mauro@animigos.app",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bio: "Buscador de peleas épicas, Mecha clásico y producciones de animación espectaculares 🔥🤖",
    levelTitle: "Veterano Shonen",
    levelNumber: 22,
    memberSince: "Diciembre 2024",
    favoriteGenre: "Shonen & Mecha",
    archetype: "Entusiasta de la Acción y Peleas Legendarias",
    friendshipStatus: "friends",
    compatibilityPercentage: 81,
    themeId: "Acción",
    privacy: {
      personalListVisibility: "friends",
      statsVisibility: "public",
      tasteTestVisibility: "friends",
      allowDirectRecommendations: "friends",
      activityFeedVisibility: "public",
    },
  },
  camila_otaku: {
    id: "user-4",
    username: "camila_otaku",
    displayName: "Camila Torres",
    email: "camila@animigos.app",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    bio: "Coleccionista de listas temáticas y devoradora de comedias románticas 🍿💖",
    levelTitle: "Otaku Curadora",
    levelNumber: 12,
    memberSince: "Marzo 2025",
    favoriteGenre: "Romance & Comedia",
    archetype: "Curadora de Comedias Románticas",
    friendshipStatus: "none",
    compatibilityPercentage: 76,
    themeId: "Comedia",
    privacy: {
      personalListVisibility: "friends",
      statsVisibility: "friends",
      tasteTestVisibility: "friends",
      allowDirectRecommendations: "friends",
      activityFeedVisibility: "friends",
    },
  },
  lucas_gamer: {
    id: "user-5",
    username: "lucas_gamer",
    displayName: "Lucas Benítez",
    email: "lucas@animigos.app",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bio: "Apasionado del Cyberpunk, historias distópicas y bandas sonoras de impacto ⚡",
    levelTitle: "Cibernauta Sci-Fi",
    levelNumber: 15,
    memberSince: "Enero 2025",
    favoriteGenre: "Sci-Fi & Cyberpunk",
    archetype: "Explorador Distópico & Cyberpunk",
    friendshipStatus: "friends",
    compatibilityPercentage: 88,
    themeId: "Sci-Fi",
    privacy: {
      personalListVisibility: "public",
      statsVisibility: "public",
      tasteTestVisibility: "public",
      allowDirectRecommendations: "everyone",
      activityFeedVisibility: "public",
    },
  },
};

/**
 * Obtiene el perfil público de un usuario por su nombre de usuario.
 */
export async function getPublicUserProfile(username: string): Promise<PublicUserProfile | null> {
  const cleanUsername = username.toLowerCase().replace("@", "");
  if (MOCK_PUBLIC_PROFILES[cleanUsername]) {
    return MOCK_PUBLIC_PROFILES[cleanUsername];
  }

  // Generar perfil demostrativo dinámico si no existe en mock explícito
  return {
    id: `user-${cleanUsername}`,
    username: cleanUsername,
    displayName: username.charAt(0).toUpperCase() + username.slice(1),
    email: `${cleanUsername}@animigos.app`,
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`,
    bio: "Miembro de la comunidad de Animigos 🎬",
    levelTitle: "Otaku Explorador",
    levelNumber: 8,
    memberSince: "2025",
    favoriteGenre: "Variado",
    archetype: "Explorador de Contenidos",
    friendshipStatus: "none",
    compatibilityPercentage: 70,
    themeId: "Default",
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
 * Obtiene las estadísticas públicas de un usuario.
 */
export async function getPublicUserStats(username: string): Promise<UserAnimeStats> {
  return {
    totalWatched: 36,
    totalEpisodes: 480,
    totalHoursWatched: 160,
    averageScore: 8.5,
    genreBreakdown: [
      { genre: "Romance & Comedia", percentage: 40, count: 14, color: "bg-pink-500" },
      { genre: "Fantasía Mística", percentage: 30, count: 11, color: "bg-purple-500" },
      { genre: "Slice of Life", percentage: 20, count: 7, color: "bg-emerald-500" },
      { genre: "Shonen & Acción", percentage: 10, count: 4, color: "bg-amber-500" },
    ],
  };
}

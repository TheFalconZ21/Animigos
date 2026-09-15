/**
 * @file recommendations.service.ts
 * @description Servicio para gestionar recomendaciones de anime de amigos (1-a-1 y generales).
 */

export interface FriendRecommendation {
  id: string;
  type: "direct" | "general"; // 1-a-1 directa o general para todos
  fromUser: {
    id: string;
    displayName: string;
    username: string;
    avatarUrl: string;
  };
  toUserId?: string; // Presente solo si es 1-a-1
  anime: {
    malId: number;
    title: string;
    imageUrl: string;
    score: number;
    genres: string[];
    episodes?: number;
  };
  note: string;
  createdAt: string;
  isSavedToPersonalList?: boolean;
}

const mockRecommendations: FriendRecommendation[] = [
  {
    id: "rec-1",
    type: "direct",
    fromUser: {
      id: "user-2",
      displayName: "Sofía Martínez",
      username: "sofi_anime",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    toUserId: "demo-user-1",
    anime: {
      malId: 9253,
      title: "Steins;Gate",
      imageUrl: "https://cdn.myanimelist.net/images/anime/1935/127974.jpg",
      score: 9.07,
      genres: ["Sci-Fi", "Psicológico", "Thriller"],
      episodes: 24,
    },
    note: "¡Sé que te encantan los viajes en el tiempo y los dilemas éticos! Tienes que ver este clásico sí o sí ⏱️⌛",
    createdAt: "Hace 30 minutos",
  },
  {
    id: "rec-2",
    type: "general",
    fromUser: {
      id: "user-3",
      displayName: "Mauricio Rossi",
      username: "mauro_senpai",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    anime: {
      malId: 52991,
      title: "Frieren: Beyond Journey's End",
      imageUrl: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg",
      score: 9.34,
      genres: ["Fantasía", "Aventura", "Drama"],
      episodes: 28,
    },
    note: "¡Recomendación general para todos! La animación y la música de esta obra son una verdadera joya 🍃✨",
    createdAt: "Hace 2 horas",
  },
  {
    id: "rec-3",
    type: "direct",
    fromUser: {
      id: "user-5",
      displayName: "Lucas Benítez",
      username: "lucas_gamer",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    toUserId: "demo-user-1",
    anime: {
      malId: 19,
      title: "Monster",
      imageUrl: "https://cdn.myanimelist.net/images/anime/10/18741.jpg",
      score: 8.88,
      genres: ["Suspenso", "Misterio", "Drama"],
      episodes: 74,
    },
    note: "Para tu lista de suspenso maduro. Johan Liebert es uno de los mejores antagonistas del anime.",
    createdAt: "Ayer",
  },
];

/**
 * Obtiene las recomendaciones dirigidas al usuario actual o públicas de amigos.
 */
export async function getFriendRecommendations(
  userId: string = "demo-user-1",
  filter: "all" | "direct" | "general" = "all"
): Promise<FriendRecommendation[]> {
  if (filter === "direct") {
    return mockRecommendations.filter((r) => r.type === "direct");
  }
  if (filter === "general") {
    return mockRecommendations.filter((r) => r.type === "general");
  }
  return [...mockRecommendations];
}

/**
 * Envía una recomendación a un amigo específico (1-a-1) o a todos sus amigos (General).
 */
export async function sendFriendRecommendation(data: {
  animeTitle: string;
  type: "direct" | "general";
  targetFriendId?: string;
  note: string;
}): Promise<FriendRecommendation> {
  const newRec: FriendRecommendation = {
    id: `rec-${Date.now()}`,
    type: data.type,
    fromUser: {
      id: "demo-user-1",
      displayName: "Maximiliano Silva",
      username: "MaxiOtaku",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    toUserId: data.targetFriendId,
    anime: {
      malId: 40028,
      title: data.animeTitle || "Attack on Titan Final Season",
      imageUrl: "https://cdn.myanimelist.net/images/anime/1000/110531.jpg",
      score: 8.9,
      genres: ["Acción", "Fantasía", "Drama"],
    },
    note: data.note,
    createdAt: "Ahora mismo",
  };

  mockRecommendations.unshift(newRec);
  return newRec;
}

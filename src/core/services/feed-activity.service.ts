/**
 * @file feed-activity.service.ts
 * @description Servicio para gestionar la tira continua de actividad social y feed interactivas de amigos.
 */

export type ActivityType =
  | "recommendation_direct"
  | "recommendation_general"
  | "group_invite"
  | "looking_for_anime"
  | "friend_poll"
  | "achievement_milestone";

export interface FeedActivityItem {
  id: string;
  type: ActivityType;
  fromUser: {
    id: string;
    displayName: string;
    username: string;
    avatarUrl: string;
  };
  createdAt: string;
  // Campos condicionales por tipo de actividad:
  recommendationData?: {
    anime: {
      malId: number;
      title: string;
      imageUrl: string;
      score: number;
      genres: string[];
    };
    note: string;
  };
  groupInviteData?: {
    listId: string;
    listName: string;
    membersCount: number;
    topCandidateTitle?: string;
  };
  lookingForData?: {
    prompt: string;
    referenceAnime?: string;
  };
  pollData?: {
    question: string;
    options: { id: string; text: string; votesCount: number }[];
    totalVotes: number;
    userVotedOptionId?: string;
  };
  milestoneData?: {
    title: string;
    description: string;
    badgeIcon: string; // e.g. "trophy", "star", "handshake"
  };
}

const mockFeedActivities: FeedActivityItem[] = [
  {
    id: "act-1",
    type: "recommendation_direct",
    fromUser: {
      id: "user-2",
      displayName: "Sofía Martínez",
      username: "sofi_anime",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    createdAt: "Hace 15 minutos",
    recommendationData: {
      anime: {
        malId: 9253,
        title: "Steins;Gate",
        imageUrl: "https://cdn.myanimelist.net/images/anime/1935/127974.jpg",
        score: 9.07,
        genres: ["Sci-Fi", "Psicológico", "Thriller"],
      },
      note: "¡Sé que te encantan los viajes en el tiempo y los dilemas éticos! Tienes que ver este clásico sí o sí ⏱️⌛",
    },
  },
  {
    id: "act-2",
    type: "group_invite",
    fromUser: {
      id: "user-2",
      displayName: "Sofía Martínez",
      username: "sofi_anime",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    createdAt: "Hace 45 minutos",
    groupInviteData: {
      listId: "demo-list-1",
      listName: "Anime de los Viernes 🍿",
      membersCount: 4,
      topCandidateTitle: "Frieren: Beyond Journey's End",
    },
  },
  {
    id: "act-3",
    type: "looking_for_anime",
    fromUser: {
      id: "user-3",
      displayName: "Mauricio Rossi",
      username: "mauro_senpai",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    createdAt: "Hace 1 hora",
    lookingForData: {
      prompt: "¡Amigos! Busco animes de misterio y suspenso psicológico oscuro parecidos a Monster o Death Note. ¿Qué me recomiendan ver?",
      referenceAnime: "Monster / Death Note",
    },
  },
  {
    id: "act-4",
    type: "friend_poll",
    fromUser: {
      id: "user-5",
      displayName: "Lucas Benítez",
      username: "lucas_gamer",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    createdAt: "Hace 2 horas",
    pollData: {
      question: "¿Qué género deberíamos ver en la próxima maratón del grupo este fin de semana?",
      options: [
        { id: "opt-1", text: "Sci-Fi & Cyberpunk", votesCount: 5 },
        { id: "opt-2", text: "Fantasía Oscura", votesCount: 3 },
        { id: "opt-3", text: "Comedia & Slice of Life", votesCount: 2 },
      ],
      totalVotes: 10,
    },
  },
  {
    id: "act-5",
    type: "achievement_milestone",
    fromUser: {
      id: "user-4",
      displayName: "Camila Torres",
      username: "camila_otaku",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    },
    createdAt: "Hace 3 horas",
    milestoneData: {
      title: "Hito Alcanzado: 100 Animes Completados 🎉",
      description: "¡Camila ha completado su anime número 100 y ha ascendido a Nivel Otaku 15 en Animigos!",
      badgeIcon: "trophy",
    },
  },
  {
    id: "act-6",
    type: "recommendation_general",
    fromUser: {
      id: "user-3",
      displayName: "Mauricio Rossi",
      username: "mauro_senpai",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    createdAt: "Hace 5 horas",
    recommendationData: {
      anime: {
        malId: 52991,
        title: "Frieren: Beyond Journey's End",
        imageUrl: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg",
        score: 9.34,
        genres: ["Fantasía", "Aventura", "Drama"],
      },
      note: "¡Recomendación general para todos! La animación y la música de esta obra son una verdadera joya 🍃✨",
    },
  },
  {
    id: "act-7",
    type: "achievement_milestone",
    fromUser: {
      id: "user-2",
      displayName: "Sofía Martínez",
      username: "sofi_anime",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    createdAt: "Ayer",
    milestoneData: {
      title: "¡1 Año de Amigos en Animigos! 🤝✨",
      description: "Sofía y tú celebran hoy su primer aniversario como amigos de anime en la plataforma.",
      badgeIcon: "handshake",
    },
  },
];

/**
 * Obtiene la lista continua de actividades sociales del feed.
 */
export async function getFeedActivities(filter: "all" | "recommendations" | "invites" | "posts" = "all"): Promise<FeedActivityItem[]> {
  if (filter === "recommendations") {
    return mockFeedActivities.filter((a) => a.type === "recommendation_direct" || a.type === "recommendation_general");
  }
  if (filter === "invites") {
    return mockFeedActivities.filter((a) => a.type === "group_invite");
  }
  if (filter === "posts") {
    return mockFeedActivities.filter((a) => a.type === "looking_for_anime" || a.type === "friend_poll" || a.type === "achievement_milestone");
  }
  return [...mockFeedActivities];
}

/**
 * Publica un post de "Busco anime parecido a".
 */
export async function createLookingForPost(prompt: string, referenceAnime?: string): Promise<FeedActivityItem> {
  const newActivity: FeedActivityItem = {
    id: `act-${Date.now()}`,
    type: "looking_for_anime",
    fromUser: {
      id: "demo-user-1",
      displayName: "Maximiliano Silva",
      username: "MaxiOtaku",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    createdAt: "Ahora mismo",
    lookingForData: {
      prompt,
      referenceAnime,
    },
  };
  mockFeedActivities.unshift(newActivity);
  return newActivity;
}

/**
 * Publica una nueva encuesta entre amigos.
 */
export async function createFriendPollPost(question: string, optionsText: string[]): Promise<FeedActivityItem> {
  const newActivity: FeedActivityItem = {
    id: `act-${Date.now()}`,
    type: "friend_poll",
    fromUser: {
      id: "demo-user-1",
      displayName: "Maximiliano Silva",
      username: "MaxiOtaku",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    createdAt: "Ahora mismo",
    pollData: {
      question,
      options: optionsText.map((opt, i) => ({ id: `opt-new-${i}`, text: opt, votesCount: 0 })),
      totalVotes: 0,
    },
  };
  mockFeedActivities.unshift(newActivity);
  return newActivity;
}

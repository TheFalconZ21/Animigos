/**
 * @file friends.service.ts
 * @description Servicio para la gestión de relaciones de amistad entre usuarios de Animigos.
 */

export interface FriendUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  status: "online" | "offline" | "watching";
  currentAnime?: string;
  favoriteGenre: string;
  mutualFriendsCount: number;
}

export interface FriendRequest {
  id: string;
  senderName: string;
  senderAvatar: string;
  senderUsername: string;
  createdAt: string;
}

// Datos mock enriquecidos iniciales
const mockFriendsList: FriendUser[] = [
  {
    id: "user-2",
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
    username: "mauro_senpai",
    displayName: "Mauricio Rossi",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "online",
    favoriteGenre: "Shonen & Mecha",
    mutualFriendsCount: 8,
  },
  {
    id: "user-4",
    username: "camila_otaku",
    displayName: "Camila Torres",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    status: "offline",
    favoriteGenre: "Romance & Comedia",
    mutualFriendsCount: 3,
  },
  {
    id: "user-5",
    username: "lucas_gamer",
    displayName: "Lucas Benítez",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    status: "online",
    currentAnime: "Cyberpunk: Edgerunners",
    favoriteGenre: "Sci-Fi & Cyberpunk",
    mutualFriendsCount: 6,
  },
];

const mockPendingRequests: FriendRequest[] = [
  {
    id: "req-1",
    senderName: "Valeria Gómez",
    senderUsername: "valeria_g",
    senderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    createdAt: "Hace 2 horas",
  },
];

/**
 * Obtiene la lista de amigos del usuario actual.
 */
export async function getFriendsList(userId: string = "demo-user-1"): Promise<FriendUser[]> {
  return [...mockFriendsList];
}

/**
 * Obtiene las solicitudes de amistad pendientes recibidas.
 */
export async function getPendingFriendRequests(userId: string = "demo-user-1"): Promise<FriendRequest[]> {
  return [...mockPendingRequests];
}

/**
 * Agrega un nuevo amigo mediante su nombre de usuario o código.
 */
export async function sendFriendRequest(usernameOrCode: string): Promise<boolean> {
  if (!usernameOrCode.trim()) return false;
  return true;
}

/**
 * Elimina un amigo de la lista.
 */
export async function removeFriend(friendId: string): Promise<boolean> {
  const index = mockFriendsList.findIndex((f) => f.id === friendId);
  if (index !== -1) {
    mockFriendsList.splice(index, 1);
  }
  return true;
}

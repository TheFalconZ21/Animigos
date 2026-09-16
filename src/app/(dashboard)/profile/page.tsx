"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import { getCurrentUserProfile, getUserAnimeStats, UserProfile, UserAnimeStats, PrivacySettings } from "@/core/services/user-profile.service";
import { getPublicUserProfile, getPublicUserStats, PublicUserProfile } from "@/core/services/public-profile.service";
import {
  getFriendsList,
  getPendingFriendRequests,
  removeFriend,
  sendFriendRequest,
  acceptFriendRequest,
  subscribeToFriendships,
  FriendUser,
  FriendRequest,
} from "@/core/services/friends.service";
import { getUserPersonalLists, PersonalList } from "@/core/services/personal-list.service";
import { sendFriendRecommendation } from "@/core/services/recommendations.service";
import { ThemeScope, useTheme } from "@/core/contexts/ThemeContext";
import { useAuth } from "@/core/contexts/AuthContext";
import { GENRE_THEMES } from "@/core/utils/score-theme";
import {
  User,
  Users,
  List,
  HeartHandshake,
  BarChart3,
  Settings,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  UserPlus,
  Clock,
  Tv,
  Star,
  Award,
  Save,
  Check,
  Send,
  X,
  Lock,
  Shield,
  Flame,
  Eye,
  ArrowLeft,
} from "lucide-react";

function ProfileContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "friends";
  const userParam = searchParams.get("user");

  const { user: authUser, profile: authProfile } = useAuth();
  const currentUserId = authUser?.id || "demo-user-1";

  const isViewingOtherUser = Boolean(
    userParam &&
      userParam.toLowerCase() !== (authProfile?.username.toLowerCase() || "maxiotaku")
  );

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [publicProfile, setPublicProfile] = useState<PublicUserProfile | null>(null);
  const [stats, setStats] = useState<UserAnimeStats | null>(null);
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [personalLists, setPersonalLists] = useState<PersonalList[]>([]);

  // Privacy Settings Form State
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    personalListVisibility: "public",
    statsVisibility: "public",
    tasteTestVisibility: "public",
    allowDirectRecommendations: "everyone",
    activityFeedVisibility: "public",
  });
  const [privacySaveSuccess, setPrivacySaveSuccess] = useState(false);

  // Add friend state
  const [newFriendUsername, setNewFriendUsername] = useState("");
  const [addSuccessMessage, setAddSuccessMessage] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Direct recommendation to specific friend state
  const [recFriend, setRecFriend] = useState<FriendUser | null>(null);
  const [recAnimeTitle, setRecAnimeTitle] = useState("");
  const [recNote, setRecNote] = useState("");
  const [recSuccess, setRecSuccess] = useState(false);

  // Settings form state
  const [bioInput, setBioInput] = useState("");
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  // Taste test interactive state
  const [testScore, setTestScore] = useState<Record<string, number>>({
    action: 4,
    scifi: 5,
    romance: 2,
    psychological: 5,
    fantasy: 3,
  });
  const [testSaved, setTestSaved] = useState(false);

  const { theme: myTheme, setOverrideThemeId } = useTheme();
  const activeProfileTheme = isViewingOtherUser && publicProfile?.themeId
    ? GENRE_THEMES[publicProfile.themeId] || GENRE_THEMES.Default
    : myTheme;

  useEffect(() => {
    if (isViewingOtherUser && publicProfile?.themeId) {
      setOverrideThemeId(publicProfile.themeId);
    } else {
      setOverrideThemeId(null);
    }
    return () => {
      setOverrideThemeId(null);
    };
  }, [isViewingOtherUser, publicProfile?.themeId, setOverrideThemeId]);

  useEffect(() => {
    loadProfileData();
  }, [userParam, authUser, authProfile]);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Supabase Realtime: Suscripción a solicitudes y cambios de amistad
  useEffect(() => {
    if (!currentUserId) return;

    const unsubscribe = subscribeToFriendships(currentUserId, () => {
      getFriendsList(currentUserId).then(setFriends);
      getPendingFriendRequests(currentUserId).then(setPendingRequests);
    });

    return () => {
      unsubscribe();
    };
  }, [currentUserId]);

  async function loadProfileData() {
    if (
      userParam &&
      userParam.toLowerCase() !== (authProfile?.username.toLowerCase() || "maxiotaku")
    ) {
      const pubUser = await getPublicUserProfile(userParam);
      const pubStats = await getPublicUserStats(userParam);
      setPublicProfile(pubUser);
      if (pubUser) setProfile(pubUser);
      setStats(pubStats);

      const friendData = await getFriendsList(pubUser?.id || "demo-user-1");
      setFriends(friendData);
    } else {
      if (authProfile) {
        setProfile({
          id: authProfile.id,
          username: authProfile.username,
          displayName: authProfile.displayName,
          email: authUser?.email || "usuario@animigos.app",
          avatarUrl: authProfile.avatarUrl,
          bio: authProfile.bio || "Amante del anime y las buenas historias.",
          levelTitle: "Miembro de la Comunidad",
          levelNumber: 12,
          favoriteGenre: "General & Shonen",
          archetype: "Explorador de Géneros",
          memberSince: new Date(authProfile.createdAt || Date.now()).toLocaleDateString("es-ES", {
            month: "short",
            year: "numeric",
          }),
          privacy: {
            personalListVisibility: "public",
            statsVisibility: "public",
            tasteTestVisibility: "public",
            allowDirectRecommendations: "everyone",
            activityFeedVisibility: "public",
          },
        });
        setBioInput(authProfile.bio || "");
        setDisplayNameInput(authProfile.displayName || "");
      } else {
        const user = await getCurrentUserProfile(currentUserId);
        setProfile(user);
        setBioInput(user.bio);
        setDisplayNameInput(user.displayName);
        if (user.privacy) setPrivacySettings(user.privacy);
      }
      setPublicProfile(null);

      const userStats = await getUserAnimeStats(currentUserId);
      setStats(userStats);

      const friendData = await getFriendsList(currentUserId);
      setFriends(friendData);

      const requestsData = await getPendingFriendRequests(currentUserId);
      setPendingRequests(requestsData);

      const listsData = await getUserPersonalLists(currentUserId);
      setPersonalLists(listsData);
    }
  }

  const handleRemoveFriend = async (friendshipId: string, friendId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar a este amigo?")) {
      await removeFriend(friendshipId);
      setFriends((prev) =>
        prev.filter((f) => f.friendshipId !== friendshipId && f.id !== friendId)
      );
    }
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendUsername.trim()) return;

    const result = await sendFriendRequest(
      currentUserId,
      newFriendUsername,
      authProfile?.displayName || profile?.displayName
    );
    setAddSuccessMessage(result.message);

    if (result.success) {
      setNewFriendUsername("");
      const updatedFriends = await getFriendsList(currentUserId);
      setFriends(updatedFriends);
      setTimeout(() => {
        setAddSuccessMessage("");
        setIsAddModalOpen(false);
      }, 2000);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      setProfile({
        ...profile,
        displayName: displayNameInput,
        bio: bioInput,
      });
    }

    if (authUser) {
      try {
        const { createClient } = await import("@/core/supabase/client");
        const supabase = createClient();
        await supabase
          .from("profiles")
          .update({
            display_name: displayNameInput,
            bio: bioInput,
            updated_at: new Date().toISOString(),
          })
          .eq("id", authUser.id);
      } catch (err) {
        console.warn("No se pudo persistir cambios de perfil en Supabase:", err);
      }
    }

    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 3000);
  };

  const handleSaveTest = () => {
    setTestSaved(true);
    setTimeout(() => setTestSaved(false), 3000);
  };

  if (!profile || !stats) {
    return (
      <div className="py-20 text-center text-gray-400">
        Cargando perfil de usuario...
      </div>
    );
  }

  return (
    <ThemeScope themeId={activeProfileTheme.id}>
      <div className="space-y-6 relative z-10">
        {/* Banner de Perfil de Usuario */}
        <div
          className={`relative glass-panel rounded-3xl overflow-hidden border shadow-2xl transition-all duration-300 ${activeProfileTheme.borderClass}`}
          style={{ backgroundColor: "var(--theme-panel-bg)" }}
        >
          {/* Cover gradient backdrop */}
          <div
            className="h-36 sm:h-44 p-6 flex items-end justify-between relative transition-all duration-500"
            style={{
              background: `linear-gradient(135deg, ${activeProfileTheme.primaryColor}45, ${activeProfileTheme.secondaryColor}25, #0B0F17)`,
            }}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `radial-gradient(${activeProfileTheme.primaryColor} 1.5px, transparent 1.5px)`,
                backgroundSize: "16px 16px",
              }}
            ></div>
          </div>

          <div className="px-6 pb-6 pt-0 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <div className="relative">
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-[#0B0F17] shadow-xl"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0B0F17] rounded-full"></span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-white">{profile.displayName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-950 text-purple-300 border border-purple-700/60 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> {profile.levelTitle}
                </span>
                {!authUser && !isViewingOtherUser && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-950/90 text-amber-300 border border-amber-600/50 flex items-center gap-1">
                    Cuenta Demo
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">
                @{profile.username} • Miembro desde {profile.memberSince}
              </p>
              <p className="text-xs text-gray-300 max-w-xl line-clamp-2 mt-1">{profile.bio}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 shrink-0 flex-wrap">
            {isViewingOtherUser ? (
              <>
                {publicProfile?.compatibilityPercentage && (
                  <span className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 text-xs font-black flex items-center gap-1.5 shadow-md">
                    <Flame className="w-4 h-4 text-amber-400 fill-amber-400" /> {publicProfile.compatibilityPercentage}% Compatibilidad
                  </span>
                )}

                {publicProfile?.friendshipStatus === "friends" ? (
                  <span className="px-3 py-2 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Amigos
                  </span>
                ) : (
                  <button
                    onClick={async () => {
                      const res = await sendFriendRequest(
                        currentUserId,
                        profile.username,
                        authProfile?.displayName || profile?.displayName
                      );
                      alert(res.message);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" /> Agregar Amigo
                  </button>
                )}

                <button
                  onClick={() => {
                    setRecFriend({
                      id: profile.id,
                      username: profile.username,
                      displayName: profile.displayName,
                      avatarUrl: profile.avatarUrl,
                      status: "online",
                      favoriteGenre: profile.favoriteGenre,
                      mutualFriendsCount: 3,
                    });
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-cyan-200 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 rounded-xl transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Recomendar Anime
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" /> Agregar Amigo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* NAVEGACIÓN POR PESTAÑAS */}
      <div className="flex items-center gap-1 bg-gray-900/80 p-1.5 rounded-2xl border border-gray-800 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("friends")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "friends"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-gray-400 hover:text-white hover:bg-gray-800/60"
          }`}
        >
          <Users className="w-4 h-4" /> {isViewingOtherUser ? "Amigos en Común" : "Mis Amigos"} ({friends.length})
        </button>

        <button
          onClick={() => setActiveTab("lists")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "lists"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-gray-400 hover:text-white hover:bg-gray-800/60"
          }`}
        >
          <List className="w-4 h-4" /> {isViewingOtherUser ? "Listas del Usuario" : "Mis Listas Personales"}
        </button>

        <button
          onClick={() => setActiveTab("test")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "test"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-gray-400 hover:text-white hover:bg-gray-800/60"
          }`}
        >
          <HeartHandshake className="w-4 h-4 text-rose-400" /> {isViewingOtherUser ? "Comparativa de Gustos" : "Test de Gustos"}
        </button>

        <button
          onClick={() => setActiveTab("stats")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "stats"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-gray-400 hover:text-white hover:bg-gray-800/60"
          }`}
        >
          <BarChart3 className="w-4 h-4 text-cyan-400" /> Estadísticas
        </button>

        {!isViewingOtherUser && (
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "settings"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
            }`}
          >
            <Settings className="w-4 h-4 text-emerald-400" /> Ajustes & Privacidad
          </button>
        )}
      </div>

      {/* TAB 1: GESTIÓN DE AMIGOS */}
      {activeTab === "friends" && (
        <div className="space-y-6">
          {!isViewingOtherUser && pendingRequests.length > 0 && (
            <div className="glass-card p-4 rounded-2xl border border-amber-500/40 bg-amber-950/20">
              <h3 className="text-sm font-bold text-amber-300 mb-3 flex items-center gap-2">
                <UserPlus className="w-4 h-4" /> Solicitudes de Amistad Pendientes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-gray-900/90 rounded-xl border border-gray-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={req.senderAvatar}
                        alt={req.senderName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">{req.senderName}</p>
                        <p className="text-[10px] text-gray-400">@{req.senderUsername} • {req.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          await acceptFriendRequest(
                            req.id,
                            currentUserId,
                            req.senderId,
                            authProfile?.displayName || profile?.displayName
                          );
                          setPendingRequests((prev) => prev.filter((r) => r.id !== req.id));
                          const updated = await getFriendsList(currentUserId);
                          setFriends(updated);
                        }}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={async () => {
                          await removeFriend(req.id);
                          setPendingRequests((prev) => prev.filter((r) => r.id !== req.id));
                        }}
                        className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Rechazar solicitud"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />{" "}
                  {isViewingOtherUser ? `Amigos de @${profile.username}` : "Mis Amigos en Animigos"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {isViewingOtherUser
                    ? "Usuarios y contactos con los que se conecta activamente."
                    : "Coordina listas, envía recomendaciones 1-a-1 y ve lo que están viendo."}
                </p>
              </div>

              {!isViewingOtherUser && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-purple-300 bg-purple-950/60 border border-purple-800/60 rounded-xl hover:bg-purple-900/60 transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> Agregar Nuevo Amigo
                </button>
              )}
            </div>

            {friends.length === 0 ? (
              <div className="py-12 px-4 text-center border border-dashed border-gray-800 rounded-2xl bg-gray-950/40 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-950/50 border border-purple-800/40 flex items-center justify-center mx-auto text-purple-400">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Aún no tienes amigos en tu lista</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                    Busca a otros usuarios por su @nombre_de_usuario para enviarles una solicitud y comenzar a compartir recomendaciones.
                  </p>
                </div>
                {!isViewingOtherUser && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-600/30 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" /> Agregar Nuevo Amigo
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="glass-card p-4 rounded-2xl border border-gray-800 hover:border-purple-500/30 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={friend.avatarUrl}
                          alt={friend.displayName}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-700"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-[#0B0F17] rounded-full ${
                            friend.status === "online"
                              ? "bg-emerald-500"
                              : friend.status === "watching"
                              ? "bg-purple-500"
                              : "bg-gray-500"
                          }`}
                        ></span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1">
                          {friend.displayName}
                        </h4>
                        <p className="text-xs text-gray-400">@{friend.username}</p>
                        <span className="text-[10px] text-purple-300 font-medium">
                          Género: {friend.favoriteGenre}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/profile?user=${friend.username}`}
                        className="px-3 py-1.5 text-xs font-semibold text-gray-300 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5" /> Ver Perfil
                      </a>

                      {!isViewingOtherUser && (
                        <>
                          <button
                            onClick={() => {
                              setRecFriend(friend);
                              setRecAnimeTitle("");
                              setRecNote("");
                              setRecSuccess(false);
                            }}
                            className="px-3 py-1.5 text-xs font-semibold text-purple-300 bg-purple-950/60 border border-purple-800/60 rounded-xl hover:bg-purple-900/60 transition-colors flex items-center gap-1.5 cursor-pointer"
                            title={`Recomendar un anime a ${friend.displayName}`}
                          >
                            <Send className="w-3.5 h-3.5 text-purple-400" /> Recomendar
                          </button>

                          <button
                            onClick={() => handleRemoveFriend(friend.friendshipId || friend.id, friend.id)}
                            className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl border border-transparent hover:border-rose-900/50 transition-colors cursor-pointer"
                            title="Eliminar de mi lista de amigos"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal para Recomendar a un Amigo Específico */}
      {recFriend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#0F172A] border border-purple-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-400" /> Recomendar a {recFriend.displayName}
              </h3>
              <button
                onClick={() => setRecFriend(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!recAnimeTitle.trim() || !recNote.trim()) return;
                await sendFriendRecommendation({
                  animeTitle: recAnimeTitle,
                  type: "direct",
                  targetFriendId: recFriend.id,
                  note: recNote,
                });
                setRecSuccess(true);
                setTimeout(() => {
                  setRecSuccess(false);
                  setRecFriend(null);
                }, 2000);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Nombre del Anime</label>
                <input
                  type="text"
                  placeholder="ej. Steins;Gate, Monster, Frieren..."
                  value={recAnimeTitle}
                  onChange={(e) => setRecAnimeTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Nota o Mensaje Personalizado</label>
                <textarea
                  rows={3}
                  placeholder={`Dile a ${recFriend.displayName} por qué le gustará este anime...`}
                  value={recNote}
                  onChange={(e) => setRecNote(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                  required
                ></textarea>
              </div>

              {recSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> ¡Recomendación 1-a-1 enviada a @{recFriend.username}!
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRecFriend(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Enviar Recomendación 1-a-1
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: MIS LISTAS PERSONALES */}
      {activeTab === "lists" && (
        isViewingOtherUser && publicProfile?.privacy.personalListVisibility === "friends" && publicProfile.friendshipStatus !== "friends" ? (
          <div className="glass-panel p-8 rounded-3xl border border-purple-800/40 text-center space-y-4 max-w-md mx-auto my-8">
            <div className="w-14 h-14 rounded-full bg-purple-950/80 border border-purple-700/60 flex items-center justify-center mx-auto text-purple-400">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-white">Listas Restringidas</h3>
            <p className="text-xs text-gray-400">
              @{profile.username} ha configurado sus listas personales para que solo sus amigos puedan verlas.
            </p>
            <button
              onClick={() => {
                sendFriendRequest(profile.username);
                alert(`Solicitud enviada a @${profile.username}`);
              }}
              className="px-4 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all inline-flex items-center gap-2 cursor-pointer mt-2"
            >
              <UserPlus className="w-4 h-4" /> Enviar Solicitud de Amistad
            </button>
          </div>
        ) : (
          <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <List className="w-5 h-5 text-emerald-400" /> {isViewingOtherUser ? `Listas de @${profile.username}` : "Mis Listas Personales"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Organización de animes por carpetas y grupos personalizados.
              </p>
            </div>

            {personalLists.length === 0 ? (
              <div className="py-12 px-4 text-center border border-dashed border-gray-800 rounded-2xl bg-gray-950/40 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-950/50 border border-emerald-800/40 flex items-center justify-center mx-auto text-emerald-400">
                  <List className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Sin listas personales</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                    Aún no has creado carpetas o listas personales para organizar tus animes.
                  </p>
                </div>
                {!isViewingOtherUser && (
                  <a
                    href="/personal-lists"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/30"
                  >
                    <Plus className="w-4 h-4" /> Crear Mi Primera Lista
                  </a>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {personalLists.map((list) => (
                  <div
                    key={list.id}
                    className="glass-card p-5 rounded-2xl border border-gray-800 hover:border-emerald-500/40 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 font-bold mb-3">
                        <List className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-white">{list.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {list.isPublic ? "Pública para amigos" : "Privada"}
                      </p>
                    </div>

                    <a
                      href={`/personal-lists?filter=${list.name.toLowerCase()}`}
                      className="mt-4 w-full py-2 text-center text-xs font-bold text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 rounded-xl border border-emerald-800/40 transition-colors block"
                    >
                      Abrir Lista →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      )}

      {/* TAB 3: TEST DE GUSTOS */}
      {activeTab === "test" && (
        isViewingOtherUser && publicProfile?.privacy.tasteTestVisibility === "friends" && publicProfile.friendshipStatus !== "friends" ? (
          <div className="glass-panel p-8 rounded-3xl border border-purple-800/40 text-center space-y-4 max-w-md mx-auto my-8">
            <div className="w-14 h-14 rounded-full bg-purple-950/80 border border-purple-700/60 flex items-center justify-center mx-auto text-purple-400">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-white">Test de Gustos Privado</h3>
            <p className="text-xs text-gray-400">
              @{profile.username} permite ver la comparativa de gustos únicamente a sus amigos confirmados.
            </p>
            <button
              onClick={() => {
                sendFriendRequest(profile.username);
                alert(`Solicitud enviada a @${profile.username}`);
              }}
              className="px-4 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all inline-flex items-center gap-2 cursor-pointer mt-2"
            >
              <UserPlus className="w-4 h-4" /> Enviar Solicitud de Amistad
            </button>
          </div>
        ) : (
          <div className="glass-panel p-6 rounded-3xl border border-purple-800/40 bg-gradient-to-br from-purple-950/20 via-gray-900 to-gray-950 space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-rose-400" /> {isViewingOtherUser ? `Comparativa de Gustos con @${profile.username}` : "Test de Gustos e Intereses de Anime"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {isViewingOtherUser
                  ? "Análisis de afinidad entre tus géneros preferidos y los de este usuario."
                  : "Ajusta tus afinidades para alimentar el Algoritmo de Felicidad Grupal en las votaciones."}
              </p>
            </div>

            <div className="bg-gray-900/80 p-5 rounded-2xl border border-gray-800 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <span className="text-xs font-bold text-purple-300">Arquetipo del Usuario:</span>
                <span className="text-sm font-extrabold text-amber-400 bg-amber-950/80 px-3 py-1 rounded-xl border border-amber-800/50">
                  ⚡ {profile.archetype}
                </span>
              </div>

              <div className="space-y-4">
                {[
                  { key: "scifi", label: "Sci-Fi & Viajes en el tiempo" },
                  { key: "psychological", label: "Psicológico, Suspenso & Misterio" },
                  { key: "action", label: "Acción & Peleas Épicas (Shonen)" },
                  { key: "fantasy", label: "Fantasía, Magia e Isekai" },
                  { key: "romance", label: "Romance & Slice of Life" },
                ].map((item) => (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-gray-300">
                      <span>{item.label}</span>
                      <span className="text-purple-400 font-bold">{testScore[item.key]} / 5★</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      disabled={isViewingOtherUser}
                      value={testScore[item.key]}
                      onChange={(e) =>
                        setTestScore({ ...testScore, [item.key]: Number(e.target.value) })
                      }
                      className="w-full accent-purple-500 cursor-pointer disabled:opacity-60"
                    />
                  </div>
                ))}
              </div>

              {!isViewingOtherUser && (
                <div className="flex items-center justify-between pt-3">
                  {testSaved ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-4 h-4" /> ¡Preferencias de gustos actualizadas con éxito!
                    </span>
                  ) : (
                    <span></span>
                  )}
                  <button
                    onClick={handleSaveTest}
                    className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Guardar Test de Gustos
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* TAB 4: ESTADÍSTICAS VISUALES */}
      {activeTab === "stats" && (
        isViewingOtherUser && publicProfile?.privacy.statsVisibility === "friends" && publicProfile.friendshipStatus !== "friends" ? (
          <div className="glass-panel p-8 rounded-3xl border border-purple-800/40 text-center space-y-4 max-w-md mx-auto my-8">
            <div className="w-14 h-14 rounded-full bg-purple-950/80 border border-purple-700/60 flex items-center justify-center mx-auto text-purple-400">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-white">Estadísticas Privadas</h3>
            <p className="text-xs text-gray-400">
              @{profile.username} solo permite a sus amigos ver sus estadísticas de consumo de anime.
            </p>
            <button
              onClick={() => {
                sendFriendRequest(profile.username);
                alert(`Solicitud enviada a @${profile.username}`);
              }}
              className="px-4 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all inline-flex items-center gap-2 cursor-pointer mt-2"
            >
              <UserPlus className="w-4 h-4" /> Enviar Solicitud de Amistad
            </button>
          </div>
        ) : (
          <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" /> {isViewingOtherUser ? `Estadísticas de @${profile.username}` : "Estadísticas de Consumo de Anime"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Resumen analítico de hábitos de visualización y géneros preferidos.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass-card p-4 rounded-2xl border border-gray-800 text-center">
                <Tv className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <span className="text-2xl font-black text-white">{stats.totalWatched}</span>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Animes Vistos</p>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-gray-800 text-center">
                <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <span className="text-2xl font-black text-white">{stats.totalHoursWatched} hrs</span>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">({stats.totalEpisodes} epis)</p>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-gray-800 text-center">
                <Star className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="text-2xl font-black text-amber-400">{stats.averageScore}</span>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Nota Media Dada</p>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-gray-800 text-center">
                <Award className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-2xl font-black text-emerald-400">{profile.levelNumber}</span>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Nivel Otaku</p>
              </div>
            </div>

            <div className="bg-gray-900/60 p-5 rounded-2xl border border-gray-800 space-y-4">
              <h3 className="text-sm font-bold text-white mb-2">Desglose de Géneros Favoritos</h3>
              <div className="space-y-3">
                {stats.genreBreakdown.map((item) => (
                  <div key={item.genre} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-gray-300">
                      <span>{item.genre}</span>
                      <span className="text-gray-400">{item.count} animes ({item.percentage}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}

      {/* TAB 5: AJUSTES & PRIVACIDAD */}
      {!isViewingOtherUser && activeTab === "settings" && (
        <div className="space-y-6">
          {/* SECCIÓN 1: DATOS GENERALES DEL PERFIL */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" /> Información General del Perfil
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Modifica tus datos públicos visibles en la comunidad.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Nombre Visible</label>
                <input
                  type="text"
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Biografía de Perfil</label>
                <textarea
                  rows={3}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-2">
                {savedSettingsSuccess ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Datos de perfil guardados
                  </span>
                ) : (
                  <span></span>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Guardar Datos
                </button>
              </div>
            </form>
          </div>

          {/* SECCIÓN 2: CONFIGURACIÓN DE PRIVACIDAD */}
          <div className="glass-panel p-6 rounded-3xl border border-purple-800/50 bg-gradient-to-br from-purple-950/20 via-gray-900 to-gray-950 space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" /> Configuración de Privacidad y Visibilidad
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Define qué información de tu perfil pueden ver extraños vs tus amigos confirmados.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (profile) {
                  setProfile({
                    ...profile,
                    privacy: privacySettings,
                  });
                }
                setPrivacySaveSuccess(true);
                setTimeout(() => setPrivacySaveSuccess(false), 3000);
              }}
              className="space-y-5 max-w-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 p-3.5 bg-gray-900/80 rounded-2xl border border-gray-800">
                  <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                    <List className="w-3.5 h-3.5 text-purple-400" /> Mis Listas Personales
                  </label>
                  <p className="text-[11px] text-gray-400">¿Quién puede examinar tus carpetas y animes guardados?</p>
                  <select
                    value={privacySettings.personalListVisibility}
                    onChange={(e) =>
                      setPrivacySettings({
                        ...privacySettings,
                        personalListVisibility: e.target.value as any,
                      })
                    }
                    className="w-full mt-2 px-3 py-2 bg-gray-950 border border-gray-700 rounded-xl text-xs text-white focus:border-purple-500 focus:outline-none cursor-pointer"
                  >
                    <option value="public">Público (Cualquier usuario)</option>
                    <option value="friends">Solo Amigos</option>
                    <option value="private">Privado (Solo tú)</option>
                  </select>
                </div>

                <div className="space-y-1.5 p-3.5 bg-gray-900/80 rounded-2xl border border-gray-800">
                  <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-cyan-400" /> Estadísticas de Consumo
                  </label>
                  <p className="text-[11px] text-gray-400">¿Quién puede ver tu total de horas y gráfica de géneros?</p>
                  <select
                    value={privacySettings.statsVisibility}
                    onChange={(e) =>
                      setPrivacySettings({
                        ...privacySettings,
                        statsVisibility: e.target.value as any,
                      })
                    }
                    className="w-full mt-2 px-3 py-2 bg-gray-950 border border-gray-700 rounded-xl text-xs text-white focus:border-purple-500 focus:outline-none cursor-pointer"
                  >
                    <option value="public">Público (Cualquier usuario)</option>
                    <option value="friends">Solo Amigos</option>
                    <option value="private">Privado (Solo tú)</option>
                  </select>
                </div>

                <div className="space-y-1.5 p-3.5 bg-gray-900/80 rounded-2xl border border-gray-800">
                  <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5 text-rose-400" /> Test de Gustos e Intereses
                  </label>
                  <p className="text-[11px] text-gray-400">¿Quién puede comparar tus arquetipos y notas por género?</p>
                  <select
                    value={privacySettings.tasteTestVisibility}
                    onChange={(e) =>
                      setPrivacySettings({
                        ...privacySettings,
                        tasteTestVisibility: e.target.value as any,
                      })
                    }
                    className="w-full mt-2 px-3 py-2 bg-gray-950 border border-gray-700 rounded-xl text-xs text-white focus:border-purple-500 focus:outline-none cursor-pointer"
                  >
                    <option value="public">Público (Cualquier usuario)</option>
                    <option value="friends">Solo Amigos</option>
                    <option value="private">Privado (Solo tú)</option>
                  </select>
                </div>

                <div className="space-y-1.5 p-3.5 bg-gray-900/80 rounded-2xl border border-gray-800">
                  <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-amber-400" /> Recomendaciones Directas (1-a-1)
                  </label>
                  <p className="text-[11px] text-gray-400">¿Quién puede enviarte sugerencias de anime a tu bandeja?</p>
                  <select
                    value={privacySettings.allowDirectRecommendations}
                    onChange={(e) =>
                      setPrivacySettings({
                        ...privacySettings,
                        allowDirectRecommendations: e.target.value as any,
                      })
                    }
                    className="w-full mt-2 px-3 py-2 bg-gray-950 border border-gray-700 rounded-xl text-xs text-white focus:border-purple-500 focus:outline-none cursor-pointer"
                  >
                    <option value="everyone">Todos los usuarios</option>
                    <option value="friends">Solo mis Amigos</option>
                    <option value="nobody">Nadie</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 bg-gray-900/80 rounded-2xl border border-gray-800 space-y-1.5">
                <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" /> Visibilidad en el Feed de Actividad Social
                </label>
                <p className="text-[11px] text-gray-400">
                  Controla si tus cambios de estado de animes (Visto / Viendo) aparecen en el muro global.
                </p>
                <select
                  value={privacySettings.activityFeedVisibility}
                  onChange={(e) =>
                    setPrivacySettings({
                      ...privacySettings,
                      activityFeedVisibility: e.target.value as any,
                    })
                  }
                  className="w-full mt-2 px-3 py-2 bg-gray-950 border border-gray-700 rounded-xl text-xs text-white focus:border-purple-500 focus:outline-none cursor-pointer"
                >
                  <option value="public">Público en el Feed Global</option>
                  <option value="friends">Visible solo en el Feed de Amigos</option>
                  <option value="hidden">Oculto (Modo incógnito)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                {privacySaveSuccess ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Check className="w-4 h-4" /> ¡Preferencias de privacidad actualizadas!
                  </span>
                ) : (
                  <span></span>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" /> Guardar Ajustes de Privacidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Agregar Amigo */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#0F172A] border border-purple-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-400" /> Agregar un Nuevo Amigo
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFriend} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Nombre de usuario o Email
                </label>
                <input
                  type="text"
                  placeholder="ej. pedro_otaku o pedro@gmail.com"
                  value={newFriendUsername}
                  onChange={(e) => setNewFriendUsername(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              {addSuccessMessage && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {addSuccessMessage}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> Enviar Solicitud
                </button>
              </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ThemeScope>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="py-20 text-center text-gray-400">Cargando perfil...</div>}>
          <ProfileContent />
        </Suspense>
      </main>
    </div>
  );
}

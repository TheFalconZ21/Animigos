"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient as createBrowserClient } from "@/core/supabase/client";

export interface UserProfileData {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string | null;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfileData | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    username: string,
    displayName: string
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {},
});

// Fallback demo profile for immediate visual development if not logged in
const DEMO_FALLBACK_PROFILE: UserProfileData = {
  id: "demo-user-1",
  username: "MaxiOtaku",
  displayName: "Maximiliano Silva",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  bio: "Amante del anime psicológico y de coordinar maratones con amigos 🍿",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient();

  const fetchProfile = useCallback(
    async (userId: string): Promise<UserProfileData | null> => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, username, display_name, avatar_url, bio, created_at")
          .eq("id", userId)
          .maybeSingle();

        if (error || !data) {
          console.warn("Perfil de usuario no encontrado en BD, utilizando fallback:", error);
          return null;
        }

        return {
          id: data.id,
          username: data.username,
          displayName: data.display_name,
          avatarUrl:
            data.avatar_url ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          bio: data.bio,
          createdAt: data.created_at,
        };
      } catch (err) {
        console.error("Error al consultar perfil:", err);
        return null;
      }
    },
    [supabase]
  );

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      const p = await fetchProfile(user.id);
      if (p) setProfile(p);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    // Obtener sesión activa inicial
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        const p = await fetchProfile(currentSession.user.id);
        if (mounted) setProfile(p || DEMO_FALLBACK_PROFILE);
      } else {
        // Modo visitante / demo inicial
        if (mounted) setProfile(DEMO_FALLBACK_PROFILE);
      }
      if (mounted) setLoading(false);
    });

    // Escuchar cambios de sesión de Supabase Auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        const p = await fetchProfile(newSession.user.id);
        if (mounted) setProfile(p || DEMO_FALLBACK_PROFILE);
      } else {
        if (mounted) setProfile(DEMO_FALLBACK_PROFILE);
      }
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };

      if (data.user) {
        setUser(data.user);
        const p = await fetchProfile(data.user.id);
        setProfile(p || DEMO_FALLBACK_PROFILE);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    username: string,
    displayName: string
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: displayName,
            avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
          },
        },
      });

      if (error) return { error };

      if (data.user) {
        setUser(data.user);
        // Esperar unos milisegundos para que el trigger de postgres inserte el perfil
        setTimeout(async () => {
          if (data.user?.id) {
            const p = await fetchProfile(data.user.id);
            setProfile(p || {
              id: data.user.id,
              username,
              displayName,
              avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
              bio: "¡Nuevo en Animigos! 🌸",
            });
          }
        }, 800);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(DEMO_FALLBACK_PROFILE);
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

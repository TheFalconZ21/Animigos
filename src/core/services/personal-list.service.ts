/**
 * @file personal-list.service.ts
 * @description Capa de Servicio para gestionar Listas Personales (independientes de MAL y de las listas grupales).
 */

import { createClient as createBrowserClient } from "../supabase/client";

export interface PersonalList {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  isPublic: boolean;
  createdAt: string;
}

export interface PersonalListItem {
  id: string;
  listId: string;
  malId: number;
  status: "completed" | "watching" | "plan_to_watch" | "dropped";
  personalScore: number | null;
  episodesWatched: number;
  notes: string | null;
  addedAt: string;
  anime: {
    title: string;
    imageUrl: string;
    score: number | null;
    episodes: number | null;
  };
}

/**
 * Obtiene todas las listas personales de un usuario.
 */
export async function getUserPersonalLists(userId: string): Promise<PersonalList[]> {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from("personal_lists")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error || !data || data.length === 0) {
    return [
      { id: "pl-1", userId, name: "Obras Maestras ⭐", description: "Joyas de 10 estrellas", isDefault: false, isPublic: true, createdAt: "2026-01-15" },
      { id: "pl-2", userId, name: "Maratón Fin de Semana 🍿", description: "Para ver con amigos", isDefault: false, isPublic: true, createdAt: "2026-02-01" },
    ];
  }

  return data.map((item) => ({
    id: item.id,
    userId: item.user_id,
    name: item.name,
    description: item.description,
    isDefault: item.is_default,
    isPublic: item.is_public,
    createdAt: item.created_at,
  }));
}

/**
 * Asegura la existencia de las listas personales por defecto para un usuario recién registrado.
 */
export async function ensureDefaultPersonalLists(userId: string) {
  const supabase = createBrowserClient();

  const defaultNames = ["Vistos", "Viendo", "Pendientes", "Favoritos"];

  for (const name of defaultNames) {
    const { data: existing } = await supabase
      .from("personal_lists")
      .select("id")
      .eq("user_id", userId)
      .eq("name", name)
      .maybeSingle();

    if (!existing) {
      await supabase.from("personal_lists").insert({
        user_id: userId,
        name,
        is_default: true,
        is_public: true,
      });
    }
  }
}

/**
 * Agrega un anime a una lista personal del usuario.
 */
export async function addAnimeToPersonalList(
  listId: string,
  malId: number,
  status: "completed" | "watching" | "plan_to_watch" | "dropped" = "completed",
  personalScore?: number,
  notes?: string
) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from("personal_list_items")
    .upsert(
      {
        list_id: listId,
        mal_id: malId,
        status,
        personal_score: personalScore || null,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "list_id,mal_id" }
    )
    .select()
    .single();

  if (error) {
    console.error("Error agregando anime a lista personal:", error);
    throw error;
  }

  return data;
}

/**
 * Obtiene los animes pertenecientes a una lista personal.
 */
export async function getPersonalListItems(listId: string): Promise<PersonalListItem[]> {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from("personal_list_items")
    .select("*, anime_cache(*)")
    .eq("list_id", listId)
    .order("added_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((item) => {
    const anime = item.anime_cache as any;
    return {
      id: item.id,
      listId: item.list_id,
      malId: item.mal_id,
      status: item.status as any,
      personalScore: item.personal_score ? Number(item.personal_score) : null,
      episodesWatched: item.episodes_watched,
      notes: item.notes,
      addedAt: item.added_at,
      anime: {
        title: anime?.title || `Anime #${item.mal_id}`,
        imageUrl: anime?.image_url || "/placeholder-anime.png",
        score: anime?.score ? Number(anime.score) : null,
        episodes: anime?.episodes || null,
      },
    };
  });
}

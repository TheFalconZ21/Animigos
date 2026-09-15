/**
 * @file anime.service.ts
 * @description Capa de Servicio unificada para la gestión del catálogo de Anime.
 * 
 * Implementa la estrategia de Caché Local en Supabase (Sección 33 del Contexto del Proyecto):
 * 1. Intenta consultar si el anime existe en la tabla `anime_cache` de Supabase.
 * 2. Si no existe o la información es obsoleta, consulta mediante el adaptador Jikan (MAL).
 * 3. Guarda/Actualiza la respuesta en Supabase para acelerar futuras consultas.
 */

import { searchAnime as searchJikan, getAnimeById as getJikanById, NormalizedAnime } from "../adapters/mal/jikan.adapter";
import { createClient as createBrowserClient } from "../supabase/client";

/**
 * Busca animes combinando el catálogo consolidado de Supabase con el fallback de API externa.
 * 
 * @param query Término de búsqueda
 * @returns Arreglo de animes normalizados
 */
export async function searchAnimeCatalog(query: string): Promise<NormalizedAnime[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const supabase = createBrowserClient();
  const cleanQuery = query.trim();

  // 1. Consultar el catálogo local en Supabase (título principal o título en inglés)
  const { data: cached } = await supabase
    .from("anime_cache")
    .select("*")
    .or(`title.ilike.%${cleanQuery}%,title_english.ilike.%${cleanQuery}%`)
    .order("popularity", { ascending: true, nullsFirst: false })
    .limit(20);

  if (cached && cached.length > 0) {
    return cached.map((item) => ({
      malId: item.mal_id,
      title: item.title,
      titleEnglish: item.title_english,
      titleJapanese: item.title_japanese,
      synopsis: item.synopsis,
      imageUrl: item.image_url || "/placeholder-anime.png",
      score: item.score ? Number(item.score) : null,
      scoredBy: item.scored_by,
      popularity: item.popularity,
      episodes: item.episodes,
      status: item.status,
      genres: item.genres || [],
      type: item.type,
    }));
  }

  // 2. Fallback: Si no se encontraron coincidencias en el catálogo local, consultar la API externa
  const externalResults = await searchJikan(cleanQuery);

  // 3. Almacenar los resultados en la caché de Supabase asíncronamente
  if (externalResults.length > 0) {
    const rowsToUpsert = externalResults.map((anime) => ({
      mal_id: anime.malId,
      title: anime.title,
      title_english: anime.titleEnglish,
      title_japanese: anime.titleJapanese,
      synopsis: anime.synopsis,
      image_url: anime.imageUrl,
      score: anime.score,
      scored_by: anime.scoredBy,
      popularity: anime.popularity,
      episodes: anime.episodes,
      status: anime.status,
      genres: anime.genres,
      type: anime.type,
      last_synced_at: new Date().toISOString(),
    }));

    // Inserción masiva ignorando duplicados
    supabase.from("anime_cache").upsert(rowsToUpsert, { onConflict: "mal_id" }).then(() => {});
  }

  return externalResults;
}

/**
 * Obtiene un anime específico por ID, utilizando el catálogo de Supabase o API externa.
 * 
 * @param malId ID numérico del anime
 * @returns Anime normalizado o null
 */
export async function getAnimeDetail(malId: number): Promise<NormalizedAnime | null> {
  const supabase = createBrowserClient();

  // 1. Buscar en catálogo local
  const { data: cached } = await supabase
    .from("anime_cache")
    .select("*")
    .eq("mal_id", malId)
    .single();

  if (cached) {
    return {
      malId: cached.mal_id,
      title: cached.title,
      titleEnglish: cached.title_english,
      titleJapanese: cached.title_japanese,
      synopsis: cached.synopsis,
      imageUrl: cached.image_url || "/placeholder-anime.png",
      score: cached.score ? Number(cached.score) : null,
      scoredBy: cached.scored_by,
      popularity: cached.popularity,
      episodes: cached.episodes,
      status: cached.status,
      genres: cached.genres || [],
      type: cached.type,
    };
  }

  // 2. Consultar la API externa si no se encuentra
  const fetched = await getJikanById(malId);
  if (fetched) {
    supabase.from("anime_cache").upsert({
      mal_id: fetched.malId,
      title: fetched.title,
      title_english: fetched.titleEnglish,
      title_japanese: fetched.titleJapanese,
      synopsis: fetched.synopsis,
      image_url: fetched.imageUrl,
      score: fetched.score,
      scored_by: fetched.scoredBy,
      popularity: fetched.popularity,
      episodes: fetched.episodes,
      status: fetched.status,
      genres: fetched.genres,
      type: fetched.type,
      last_synced_at: new Date().toISOString(),
    }).then(() => {});
  }

  return fetched;
}

/**
 * Obtiene las recomendaciones cruzadas ("Si te gustó X, te sugerimos Y") para un anime dado.
 * 
 * @param malId ID del anime origen
 * @param limit Límite de recomendaciones a retornar
 */
export async function getAnimeRecommendations(malId: number, limit = 6): Promise<NormalizedAnime[]> {
  const supabase = createBrowserClient();

  const { data: recs } = await supabase
    .from("anime_recommendations")
    .select("mal_id_to, rating")
    .eq("mal_id_from", malId)
    .order("rating", { ascending: false })
    .limit(limit);

  if (!recs || recs.length === 0) return [];

  const targetIds = recs.map((r) => r.mal_id_to).filter((id): id is number => id !== null);

  const { data: animeList } = await supabase
    .from("anime_cache")
    .select("*")
    .in("mal_id", targetIds);

  if (!animeList) return [];

  return animeList.map((item) => ({
    malId: item.mal_id,
    title: item.title,
    titleEnglish: item.title_english,
    titleJapanese: item.title_japanese,
    synopsis: item.synopsis,
    imageUrl: item.image_url || "/placeholder-anime.png",
    score: item.score ? Number(item.score) : null,
    scoredBy: item.scored_by,
    popularity: item.popularity,
    episodes: item.episodes,
    status: item.status,
    genres: item.genres || [],
    type: item.type,
  }));
}

/**
 * Obtiene el grafo de relaciones de un anime (secuelas, precuelas, historias paralelas).
 * 
 * @param malId ID del anime
 */
export async function getAnimeRelations(malId: number) {
  const supabase = createBrowserClient();

  const { data: relations } = await supabase
    .from("anime_relations")
    .select("relation_type, mal_id_to")
    .eq("mal_id_from", malId);

  return relations || [];
}

/**
 * Obtiene los tags temáticos de un anime filtrando opcionalmente aquellos que contengan spoilers.
 * 
 * @param malId ID del anime
 * @param hideSpoilers Si es verdadero, omite tags marcados como spoiler
 */
export async function getAnimeTags(malId: number, hideSpoilers = true) {
  const supabase = createBrowserClient();

  let query = supabase.from("anime_tags").select("tag, category, rank, is_general_spoiler, is_media_spoiler").eq("mal_id", malId);

  if (hideSpoilers) {
    query = query.eq("is_general_spoiler", false).eq("is_media_spoiler", false);
  }

  const { data: tags } = await query.order("rank", { ascending: true });

  return tags || [];
}


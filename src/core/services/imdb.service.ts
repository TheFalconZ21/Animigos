/**
 * @file imdb.service.ts
 * @description Capa de Servicio para la consulta de Películas y Series populares de IMDb
 * y mapeo de recomendaciones hacia el catálogo de anime para usuarios no-otakus.
 * 
 * Implementa la Sección 17 del Contexto del Proyecto:
 * "Recomendaciones para usuarios nuevos en anime (Onboarding basado en contenido no-anime)".
 */

import { createClient as createBrowserClient } from "../supabase/client";
import { NormalizedAnime } from "../adapters/mal/jikan.adapter";

export interface ImdbTitle {
  tconst: string;
  primaryTitle: string;
  titleType: string;
  startYear: number | null;
  runtimeMinutes: number | null;
  genres: string[];
  rating: number | null;
  numVotes: number | null;
}

/**
 * Mapeo de géneros de IMDb a géneros / temáticas de Anime en Animigos.
 */
const IMDB_TO_ANIME_GENRE_MAP: Record<string, string[]> = {
  "Sci-Fi": ["Action", "Psychological", "Sci-Fi", "Suspense"],
  "Crime": ["Mystery", "Psychological", "Suspense"],
  "Drama": ["Drama", "Slice of Life"],
  "Action": ["Action", "Adventure", "Fantasy"],
  "Adventure": ["Adventure", "Fantasy"],
  "Fantasy": ["Fantasy", "Supernatural"],
  "Mystery": ["Mystery", "Psychological", "Suspense"],
  "Comedy": ["Comedy", "Slice of Life"],
  "Romance": ["Romance", "Comedy"],
  "Thriller": ["Suspense", "Psychological"],
  "Animation": ["Action", "Fantasy", "Comedy"],
  "Horror": ["Horror", "Supernatural"],
};

/**
 * Obtiene una selección curada de las películas y series de IMDb más populares.
 * Útil para la interfaz de onboarding de usuarios novatos.
 * 
 * @param limit Cantidad de títulos a retornar (por defecto 24)
 */
export async function getPopularImdbTitles(limit = 24): Promise<ImdbTitle[]> {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from("imdb_popular_titles")
    .select("*")
    .order("num_votes", { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error("Error consultando IMDb en Supabase:", error);
    return [];
  }

  return data.map((item) => ({
    tconst: item.tconst,
    primaryTitle: item.primary_title,
    titleType: item.title_type,
    startYear: item.start_year,
    runtimeMinutes: item.runtime_minutes,
    genres: item.genres || [],
    rating: item.rating ? Number(item.rating) : null,
    numVotes: item.num_votes,
  }));
}

/**
 * Busca títulos de IMDb por término (ej. "Inception", "Breaking Bad").
 */
export async function searchImdbTitles(query: string, limit = 10): Promise<ImdbTitle[]> {
  if (!query || query.trim().length === 0) return [];

  const supabase = createBrowserClient();
  const cleanQuery = query.trim();

  const { data } = await supabase
    .from("imdb_popular_titles")
    .select("*")
    .ilike("primary_title", `%${cleanQuery}%`)
    .order("num_votes", { ascending: false })
    .limit(limit);

  if (!data) return [];

  return data.map((item) => ({
    tconst: item.tconst,
    primaryTitle: item.primary_title,
    titleType: item.title_type,
    startYear: item.start_year,
    runtimeMinutes: item.runtime_minutes,
    genres: item.genres || [],
    rating: item.rating ? Number(item.rating) : null,
    numVotes: item.num_votes,
  }));
}

/**
 * Recibe una selección de títulos de IMDb elegidos por un usuario no-otaku
 * y retorna animes recomendados de `anime_cache` basados en concordancia de géneros.
 * 
 * @param selectedTconsts Lista de IDs tconst elegidos por el usuario (ej. ["tt1375666"])
 * @param limit Cantidad de animes recomendados a retornar
 */
export async function getRecommendedAnimeForImdbSelection(
  selectedTconsts: string[],
  limit = 8
): Promise<NormalizedAnime[]> {
  if (!selectedTconsts || selectedTconsts.length === 0) return [];

  const supabase = createBrowserClient();

  // 1. Obtener los géneros de los títulos de IMDb seleccionados
  const { data: imdbTitles } = await supabase
    .from("imdb_popular_titles")
    .select("genres")
    .in("tconst", selectedTconsts);

  if (!imdbTitles || imdbTitles.length === 0) return [];

  // 2. Extraer y mapear géneros únicos de IMDb a géneros de Anime
  const targetAnimeGenres = new Set<string>();
  imdbTitles.forEach((t) => {
    (t.genres || []).forEach((imdbGenre: string) => {
      const mapped = IMDB_TO_ANIME_GENRE_MAP[imdbGenre];
      if (mapped) {
        mapped.forEach((g) => targetAnimeGenres.add(g));
      }
    });
  });

  const genreArray = Array.from(targetAnimeGenres);
  if (genreArray.length === 0) {
    genreArray.push("Action", "Drama", "Fantasy");
  }

  // 3. Buscar en el catálogo de Supabase animes populares que contengan al menos uno de los géneros objetivo
  const { data: recommendedAnimes } = await supabase
    .from("anime_cache")
    .select("*")
    .overlaps("genres", genreArray)
    .order("score", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (!recommendedAnimes) return [];

  return recommendedAnimes.map((item) => ({
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

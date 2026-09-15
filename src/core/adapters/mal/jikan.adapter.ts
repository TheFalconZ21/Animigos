/**
 * @file jikan.adapter.ts
 * @description Adaptador para comunicarse con la API pública de MyAnimeList (vía Jikan v4 REST API).
 * 
 * Abstrae las llamadas HTTP externas para que el resto de la aplicación no dependa
 * directamente de los endpoints de Jikan o MyAnimeList.
 */

export interface NormalizedAnime {
  malId: number;
  title: string;
  titleEnglish: string | null;
  titleJapanese: string | null;
  synopsis: string | null;
  imageUrl: string;
  score: number | null;
  scoredBy: number | null;
  popularity: number | null;
  episodes: number | null;
  status: string | null;
  genres: string[];
  type: string | null;
}

const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

/**
 * Normaliza un objeto retornado por Jikan v4 al modelo estándar `NormalizedAnime` de Animigos.
 */
function normalizeJikanData(data: any): NormalizedAnime {
  const genres = Array.isArray(data.genres)
    ? data.genres.map((g: any) => g.name)
    : [];

  return {
    malId: data.mal_id,
    title: data.title || "Título no disponible",
    titleEnglish: data.title_english || null,
    titleJapanese: data.title_japanese || null,
    synopsis: data.synopsis || null,
    imageUrl: data.images?.jpg?.large_image_url || data.images?.jpg?.image_url || "/placeholder-anime.png",
    score: typeof data.score === "number" ? data.score : null,
    scoredBy: typeof data.scored_by === "number" ? data.scored_by : null,
    popularity: typeof data.popularity === "number" ? data.popularity : null,
    episodes: typeof data.episodes === "number" ? data.episodes : null,
    status: data.status || null,
    genres,
    type: data.type || null,
  };
}

/**
 * Busca animes en MyAnimeList utilizando la API Jikan v4.
 * 
 * @param query Término de búsqueda (ej. "Frieren", "Attack on Titan")
 * @param limit Cantidad máxima de resultados (por defecto 15)
 * @returns Lista de animes normalizados
 */
export async function searchAnime(query: string, limit: number = 15): Promise<NormalizedAnime[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const response = await fetch(
      `${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=${limit}&sfw=true`,
      { next: { revalidate: 3600 } } // Caché de Next.js por 1 hora
    );

    if (!response.ok) {
      console.error(`Error HTTP ${response.status} al consultar Jikan API`);
      return [];
    }

    const json = await response.json();
    if (!json.data || !Array.isArray(json.data)) {
      return [];
    }

    return json.data.map(normalizeJikanData);
  } catch (error) {
    console.error("Excepción durante la búsqueda de anime en Jikan API:", error);
    return [];
  }
}

/**
 * Obtiene la información detallada de un anime por su ID de MyAnimeList.
 * 
 * @param malId ID numérico del anime en MyAnimeList
 * @returns Anime normalizado o null si no se encuentra
 */
export async function getAnimeById(malId: number): Promise<NormalizedAnime | null> {
  try {
    const response = await fetch(`${JIKAN_BASE_URL}/anime/${malId}`, {
      next: { revalidate: 86400 }, // Caché de Next.js por 24 horas
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    if (!json.data) {
      return null;
    }

    return normalizeJikanData(json.data);
  } catch (error) {
    console.error(`Excepción obteniendo anime ID ${malId} desde Jikan API:`, error);
    return null;
  }
}

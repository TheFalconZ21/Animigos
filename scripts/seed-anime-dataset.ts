/**
 * @file seed-anime-dataset.ts
 * @description Script de ingestión masiva para poblar la base de datos de Supabase
 * con el catálogo consolidado de anime, estadísticas, tags y relaciones.
 * 
 * Uso: npx tsx scripts/seed-anime-dataset.ts
 */

import fs from "fs";
import path from "path";
import readline from "readline";
import { createClient } from "@supabase/supabase-js";

// Cargar variables de entorno si existen
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rarjyjjykmdouspqctcp.supabase.co";
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

const DATASET_DIR = path.join(process.cwd(), "anime_dataset_2018_2026", "csv");

/**
 * Parsea una línea de CSV respetando comillas dobles.
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && (i === 0 || line[i - 1] !== "\\")) {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Lee un archivo CSV completo agrupando líneas entre comillas.
 */
async function readCsvFile(filePath: string): Promise<{ headers: string[]; rows: string[][] }> {
  const fileStream = fs.createReadStream(filePath, { encoding: "utf-8" });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let headers: string[] = [];
  const rows: string[][] = [];
  let isFirstLine = true;
  let accumulatedLine = "";
  let inQuotes = false;

  for await (const line of rl) {
    if (isFirstLine) {
      headers = parseCsvLine(line);
      isFirstLine = false;
      continue;
    }

    // Contar comillas para ver si la línea continúa en el siguiente renglón
    const quoteCount = (line.match(/"/g) || []).length;
    if (quoteCount % 2 !== 0) {
      inQuotes = !inQuotes;
    }

    accumulatedLine += (accumulatedLine ? "\n" : "") + line;

    if (!inQuotes) {
      rows.push(parseCsvLine(accumulatedLine));
      accumulatedLine = "";
    }
  }

  return { headers, rows };
}

/**
 * Ingesta el catálogo principal `dim/anime.csv` hacia `public.anime_cache`.
 */
async function seedAnimeCatalog() {
  console.log("--> Cargando catálogo base (dim/anime.csv)...");
  const filePath = path.join(DATASET_DIR, "dim", "anime.csv");
  if (!fs.existsSync(filePath)) {
    console.warn("Archivo no encontrado:", filePath);
    return;
  }

  const { headers, rows } = await readCsvFile(filePath);
  const getIdx = (name: string) => headers.indexOf(name);

  const malIdIdx = getIdx("mal_id");
  const titleRomajiIdx = getIdx("title_romaji");
  const titleEngIdx = getIdx("title_english");
  const titleNativeIdx = getIdx("title_native");
  const typeIdx = getIdx("type");
  const statusIdx = getIdx("status");
  const episodesIdx = getIdx("episodes");
  const durationIdx = getIdx("duration");
  const scoreIdx = getIdx("meanScore");
  const popularityIdx = getIdx("popularity");
  const coverIdx = getIdx("coverImage_large");
  const bannerIdx = getIdx("bannerImage");
  const synopsisIdx = getIdx("description_text");
  const seasonIdx = getIdx("season");
  const seasonYearIdx = getIdx("seasonYear");
  const sourceIdx = getIdx("source");
  const countryIdx = getIdx("countryOfOrigin");

  const batchSize = 300;
  let batch: any[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const malId = parseInt(row[malIdIdx], 10);
    if (isNaN(malId)) continue;

    const animeItem = {
      mal_id: malId,
      title: row[titleRomajiIdx] || row[titleEngIdx] || `Anime #${malId}`,
      title_english: row[titleEngIdx] || null,
      title_japanese: row[titleNativeIdx] || null,
      synopsis: row[synopsisIdx] ? row[synopsisIdx].slice(0, 1000) : null,
      image_url: row[coverIdx] || null,
      banner_url: row[bannerIdx] || null,
      score: row[scoreIdx] ? parseFloat(row[scoreIdx]) : null,
      popularity: row[popularityIdx] ? parseInt(row[popularityIdx], 10) : null,
      episodes: row[episodesIdx] ? parseInt(row[episodesIdx], 10) : null,
      duration: row[durationIdx] ? parseFloat(row[durationIdx]) : null,
      status: row[statusIdx] || null,
      type: row[typeIdx] || null,
      season: row[seasonIdx] || null,
      season_year: row[seasonYearIdx] ? parseInt(row[seasonYearIdx], 10) : null,
      source: row[sourceIdx] || null,
      country_of_origin: row[countryIdx] || null,
      last_synced_at: new Date().toISOString(),
    };

    batch.push(animeItem);

    if (batch.length >= batchSize || i === rows.length - 1) {
      const { error } = await supabase.from("anime_cache").upsert(batch, { onConflict: "mal_id" });
      if (error) console.error(`Error insertando batch de catálogo (${i}):`, error.message);
      else console.log(`Cargados ${i + 1}/${rows.length} animes en anime_cache`);
      batch = [];
    }
  }
}

/**
 * Ingesta las estadísticas de retención real `hechos/anime_stats_2026.csv`.
 */
async function seedAnimeStats() {
  console.log("--> Cargando estadísticas de retención (hechos/anime_stats_2026.csv)...");
  const filePath = path.join(DATASET_DIR, "hechos", "anime_stats_2026.csv");
  if (!fs.existsSync(filePath)) return;

  // Obtener IDs válidos en anime_cache para no violar FK
  const { data: validAnimeIds } = await supabase.from("anime_cache").select("mal_id");
  const validSet = new Set(validAnimeIds ? validAnimeIds.map((a) => a.mal_id) : []);

  const { headers, rows } = await readCsvFile(filePath);
  const getIdx = (name: string) => headers.indexOf(name);

  const animeIdIdx = getIdx("anime_id");
  const nInteractionsIdx = getIdx("n_interactions");
  const nScoredIdx = getIdx("n_scored");
  const nWatchingIdx = getIdx("n_watching");
  const nCompletedIdx = getIdx("n_completed");
  const nOnHoldIdx = getIdx("n_on_hold");
  const nDroppedIdx = getIdx("n_dropped");
  const nPlanIdx = getIdx("n_plan_to_watch");
  const meanScoreIdx = getIdx("mean_score");

  const batchSize = 500;
  let batch: any[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const animeId = parseInt(row[animeIdIdx], 10);
    if (isNaN(animeId) || !validSet.has(animeId)) continue;

    const scores: number[] = [];
    for (let s = 1; s <= 10; s++) {
      const sIdx = getIdx(`score_${s}`);
      scores.push(sIdx !== -1 && row[sIdx] ? parseInt(row[sIdx], 10) : 0);
    }

    batch.push({
      anime_id: animeId,
      n_interactions: row[nInteractionsIdx] ? parseInt(row[nInteractionsIdx], 10) : 0,
      n_scored: row[nScoredIdx] ? parseInt(row[nScoredIdx], 10) : 0,
      n_watching: row[nWatchingIdx] ? parseInt(row[nWatchingIdx], 10) : 0,
      n_completed: row[nCompletedIdx] ? parseInt(row[nCompletedIdx], 10) : 0,
      n_on_hold: row[nOnHoldIdx] ? parseInt(row[nOnHoldIdx], 10) : 0,
      n_dropped: row[nDroppedIdx] ? parseInt(row[nDroppedIdx], 10) : 0,
      n_plan_to_watch: row[nPlanIdx] ? parseInt(row[nPlanIdx], 10) : 0,
      mean_score: row[meanScoreIdx] ? parseFloat(row[meanScoreIdx]) : null,
      score_distribution: scores,
    });

    if (batch.length >= batchSize || i === rows.length - 1) {
      if (batch.length > 0) {
        const { error } = await supabase.from("anime_stats").upsert(batch, { onConflict: "anime_id" });
        if (error) console.error("Error al cargar anime_stats:", error.message);
      }
      batch = [];
    }
  }
  console.log("--> Estadísticas de retención cargadas correctamente.");
}

/**
 * Ingesta el grafo de relaciones filtrado por tipos clave (SEQUEL, PREQUEL, SIDE_STORY).
 */
async function seedAnimeRelations() {
  console.log("--> Cargando grafo de relaciones (atributos/anime_relaciones.csv)...");
  const filePath = path.join(DATASET_DIR, "atributos", "anime_relaciones.csv");
  if (!fs.existsSync(filePath)) return;

  const { data: validAnimeIds } = await supabase.from("anime_cache").select("mal_id");
  const validSet = new Set(validAnimeIds ? validAnimeIds.map((a) => a.mal_id) : []);

  const { headers, rows } = await readCsvFile(filePath);
  const getIdx = (name: string) => headers.indexOf(name);

  const fromIdx = getIdx("mal_id_from");
  const typeIdx = getIdx("relation_type");
  const toAnilistIdx = getIdx("anilist_id_to");
  const toMalIdx = getIdx("mal_id_to");

  const batchSize = 1000;
  let batch: any[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const malFrom = parseInt(row[fromIdx], 10);
    const relType = row[typeIdx];
    if (isNaN(malFrom) || !relType || !validSet.has(malFrom)) continue;

    const malTo = row[toMalIdx] ? parseInt(row[toMalIdx], 10) : null;
    const anilistTo = row[toAnilistIdx] ? parseInt(row[toAnilistIdx], 10) : null;

    batch.push({
      mal_id_from: malFrom,
      relation_type: relType,
      anilist_id_to: anilistTo,
      mal_id_to: isNaN(malTo!) ? null : malTo,
    });

    if (batch.length >= batchSize || i === rows.length - 1) {
      if (batch.length > 0) {
        const { error } = await supabase.from("anime_relations").insert(batch);
        if (error) console.error("Error insertando relaciones:", error.message);
      }
      batch = [];
    }
  }
  console.log("--> Relaciones cargadas correctamente.");
}

/**
 * Ingesta recomendaciones item-item optimizadas (rating >= 3).
 */
async function seedAnimeRecommendations() {
  console.log("--> Cargando recomendaciones item-item (atributos/anime_recomendaciones.csv)...");
  const filePath = path.join(DATASET_DIR, "atributos", "anime_recomendaciones.csv");
  if (!fs.existsSync(filePath)) return;

  const { data: validAnimeIds } = await supabase.from("anime_cache").select("mal_id");
  const validSet = new Set(validAnimeIds ? validAnimeIds.map((a) => a.mal_id) : []);

  const { headers, rows } = await readCsvFile(filePath);
  const getIdx = (name: string) => headers.indexOf(name);

  const fromIdx = getIdx("mal_id_from");
  const ratingIdx = getIdx("rating");
  const toAnilistIdx = getIdx("anilist_id_to");
  const toMalIdx = getIdx("mal_id_to");

  const batchSize = 1000;
  let batch: any[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const malFrom = parseInt(row[fromIdx], 10);
    const rating = row[ratingIdx] ? parseInt(row[ratingIdx], 10) : 0;

    if (isNaN(malFrom) || rating < 3 || !validSet.has(malFrom)) continue;

    const malTo = row[toMalIdx] ? parseInt(row[toMalIdx], 10) : null;
    const anilistTo = row[toAnilistIdx] ? parseInt(row[toAnilistIdx], 10) : null;

    batch.push({
      mal_id_from: malFrom,
      rating,
      anilist_id_to: anilistTo,
      mal_id_to: isNaN(malTo!) ? null : malTo,
    });

    if (batch.length >= batchSize || i === rows.length - 1) {
      if (batch.length > 0) {
        const { error } = await supabase.from("anime_recommendations").insert(batch);
        if (error) console.error("Error insertando recomendaciones:", error.message);
      }
      batch = [];
    }
  }
  console.log("--> Recomendaciones cargadas correctamente.");
}

/**
 * Función principal para ejecutar todos los procesos de carga optimizados.
 */
async function main() {
  console.log("==================================================");
  console.log("Iniciando Ingestión Optimizada de Dataset (<30 MB total)");
  console.log("==================================================");

  try {
    await seedAnimeCatalog();
    await seedAnimeStats();
    await seedAnimeRelations();
    await seedAnimeRecommendations();
    console.log("✅ Proceso de ingestión completado exitosamente sin exceder límites.");
  } catch (err) {
    console.error("❌ Error durante el proceso de ingestión:", err);
  }
}

main();


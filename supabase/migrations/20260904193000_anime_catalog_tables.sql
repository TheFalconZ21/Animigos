-- Migración de Tablas de Catálogo Consolidado y Recomendaciones para Animigos
-- Creado: 2026-09-04

-- 1. Ampliar anime_cache con atributos ricos de AniList
ALTER TABLE public.anime_cache
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS duration NUMERIC,
ADD COLUMN IF NOT EXISTS season TEXT,
ADD COLUMN IF NOT EXISTS season_year INT,
ADD COLUMN IF NOT EXISTS source TEXT,
ADD COLUMN IF NOT EXISTS country_of_origin TEXT,
ADD COLUMN IF NOT EXISTS synonyms TEXT[] DEFAULT '{}';

-- 2. TABLA DE ESTADÍSTICAS Y RETENCIÓN REAL (anime_stats_2026)
CREATE TABLE IF NOT EXISTS public.anime_stats (
    anime_id INT PRIMARY KEY REFERENCES public.anime_cache(mal_id) ON DELETE CASCADE,
    n_interactions BIGINT DEFAULT 0,
    n_scored BIGINT DEFAULT 0,
    n_watching BIGINT DEFAULT 0,
    n_completed BIGINT DEFAULT 0,
    n_on_hold BIGINT DEFAULT 0,
    n_dropped BIGINT DEFAULT 0,
    n_plan_to_watch BIGINT DEFAULT 0,
    mean_score NUMERIC(4, 2),
    score_distribution INT[] DEFAULT '{}'
);

-- 3. TABLA DE TAGS Y ETIQUETAS TEMÁTICAS (anime_tags)
CREATE TABLE IF NOT EXISTS public.anime_tags (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mal_id INT NOT NULL REFERENCES public.anime_cache(mal_id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    category TEXT,
    rank INT,
    is_general_spoiler BOOLEAN DEFAULT FALSE,
    is_media_spoiler BOOLEAN DEFAULT FALSE
);

-- 4. TABLA DE RELACIONES (Secuelas, Precuelas, Historias paralelas)
CREATE TABLE IF NOT EXISTS public.anime_relations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mal_id_from INT NOT NULL REFERENCES public.anime_cache(mal_id) ON DELETE CASCADE,
    relation_type TEXT NOT NULL,
    anilist_id_to INT,
    mal_id_to INT
);

-- 5. TABLA DE RECOMENDACIONES ITEM-ITEM
CREATE TABLE IF NOT EXISTS public.anime_recommendations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mal_id_from INT NOT NULL REFERENCES public.anime_cache(mal_id) ON DELETE CASCADE,
    anilist_id_to INT,
    mal_id_to INT,
    rating INT DEFAULT 0
);

-- 6. TABLA DE HISTORIAL DE EVOLUCIÓN (2018-2026)
CREATE TABLE IF NOT EXISTS public.anime_history (
    anime_id INT NOT NULL REFERENCES public.anime_cache(mal_id) ON DELETE CASCADE,
    ano INT NOT NULL,
    score NUMERIC(4, 2),
    members BIGINT,
    rank INT,
    PRIMARY KEY (anime_id, ano)
);

-- ÍNDICES PARA BÚSQUEDA Y PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_anime_cache_title ON public.anime_cache (title);
CREATE INDEX IF NOT EXISTS idx_anime_cache_title_eng ON public.anime_cache (title_english);
CREATE INDEX IF NOT EXISTS idx_anime_tags_mal_id ON public.anime_tags (mal_id);
CREATE INDEX IF NOT EXISTS idx_anime_tags_tag ON public.anime_tags (tag);
CREATE INDEX IF NOT EXISTS idx_anime_relations_from ON public.anime_relations (mal_id_from);
CREATE INDEX IF NOT EXISTS idx_anime_relations_to ON public.anime_relations (mal_id_to);
CREATE INDEX IF NOT EXISTS idx_anime_recommendations_from ON public.anime_recommendations (mal_id_from);

-- POLÍTICAS RLS (Lectura Pública)
ALTER TABLE public.anime_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anime_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anime_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anime_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anime_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anime_stats son legibles públicamente" ON public.anime_stats FOR SELECT USING (true);
CREATE POLICY "anime_tags son legibles públicamente" ON public.anime_tags FOR SELECT USING (true);
CREATE POLICY "anime_relations son legibles públicamente" ON public.anime_relations FOR SELECT USING (true);
CREATE POLICY "anime_recommendations son legibles públicamente" ON public.anime_recommendations FOR SELECT USING (true);
CREATE POLICY "anime_history son legibles públicamente" ON public.anime_history FOR SELECT USING (true);

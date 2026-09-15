-- Migración para soportar el catálogo de películas/series populares de IMDb (Onboarding Novatos)
-- Creado: 2026-09-04

CREATE TABLE IF NOT EXISTS public.imdb_popular_titles (
    tconst TEXT PRIMARY KEY,
    primary_title TEXT NOT NULL,
    title_type TEXT NOT NULL, -- 'movie', 'tvSeries', 'tvMiniSeries'
    start_year INT,
    runtime_minutes INT,
    genres TEXT[] DEFAULT '{}',
    rating NUMERIC(3, 1),
    num_votes INT
);

-- ÍNDICES PARA CONSULTAS RÁPIDAS
CREATE INDEX IF NOT EXISTS idx_imdb_primary_title ON public.imdb_popular_titles (primary_title);
CREATE INDEX IF NOT EXISTS idx_imdb_votes ON public.imdb_popular_titles (num_votes DESC);

-- POLÍTICA DE SEGURIDAD (Lectura pública)
ALTER TABLE public.imdb_popular_titles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "imdb_popular_titles lectura pública" ON public.imdb_popular_titles FOR SELECT USING (true);

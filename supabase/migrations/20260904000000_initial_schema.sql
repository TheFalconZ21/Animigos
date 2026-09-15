-- Migración Inicial de Animigos - Esquema de Base de Datos PostgreSQL
-- Creado: 2026-09-04

-- Extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABLA DE PERFILES DE USUARIOS (vinculado a auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. TABLA DE PREFERENCIAS Y ONBOARDING
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    onboarding_completed BOOLEAN DEFAULT FALSE NOT NULL,
    onboarding_stage TEXT DEFAULT 'none' NOT NULL, -- 'none', 'quick', 'deep'
    favorite_genres TEXT[] DEFAULT '{}' NOT NULL,
    experience_level TEXT DEFAULT 'beginner' NOT NULL, -- 'beginner', 'intermediate', 'expert'
    preferred_duration TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. RELACIONES DE AMISTAD
CREATE TABLE IF NOT EXISTS public.friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'accepted', 'rejected'
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_friendship UNIQUE (user_id, friend_id)
);

-- 4. CACHÉ LOCAL DE ANIMES (Desde MyAnimeList / Jikan v4)
CREATE TABLE IF NOT EXISTS public.anime_cache (
    mal_id INT PRIMARY KEY,
    title TEXT NOT NULL,
    title_english TEXT,
    title_japanese TEXT,
    synopsis TEXT,
    image_url TEXT,
    score NUMERIC(4, 2),
    scored_by INT,
    popularity INT,
    episodes INT,
    status TEXT,
    genres TEXT[] DEFAULT '{}' NOT NULL,
    type TEXT,
    last_synced_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. LISTAS PERSONALES (Independientes por usuario)
CREATE TABLE IF NOT EXISTS public.personal_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE NOT NULL,
    is_public BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. ITEMS DE LISTAS PERSONALES
CREATE TABLE IF NOT EXISTS public.personal_list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID NOT NULL REFERENCES public.personal_lists(id) ON DELETE CASCADE,
    mal_id INT NOT NULL REFERENCES public.anime_cache(mal_id) ON DELETE CASCADE,
    status TEXT DEFAULT 'plan_to_watch' NOT NULL, -- 'completed', 'watching', 'plan_to_watch', 'dropped'
    personal_score NUMERIC(4, 2),
    episodes_watched INT DEFAULT 0 NOT NULL,
    notes TEXT,
    added_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_list_item UNIQUE (list_id, mal_id)
);

-- 7. LISTAS COMPARTIDAS (Grupales)
CREATE TABLE IF NOT EXISTS public.shared_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'voting' NOT NULL, -- 'candidates', 'voting', 'selected', 'watching', 'completed'
    invite_code TEXT UNIQUE NOT NULL DEFAULT substr(md5(random()::text), 1, 8),
    selected_anime_id INT REFERENCES public.anime_cache(mal_id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. MIEMBROS DE LISTAS COMPARTIDAS (Soporta usuarios registrados E invitados)
CREATE TABLE IF NOT EXISTS public.shared_list_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shared_list_id UUID NOT NULL REFERENCES public.shared_lists(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL si es usuario invitado
    guest_token TEXT, -- Token de sesión para invitado sin cuenta
    guest_name TEXT, -- Nombre visible del invitado
    role TEXT DEFAULT 'member' NOT NULL, -- 'owner', 'member', 'guest'
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT member_identity_check CHECK (
        (user_id IS NOT NULL AND guest_token IS NULL) OR 
        (user_id IS NULL AND guest_token IS NOT NULL)
    )
);

-- 9. CANDIDATOS EN LISTA COMPARTIDA
CREATE TABLE IF NOT EXISTS public.shared_list_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shared_list_id UUID NOT NULL REFERENCES public.shared_lists(id) ON DELETE CASCADE,
    mal_id INT NOT NULL REFERENCES public.anime_cache(mal_id) ON DELETE CASCADE,
    suggested_by_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    suggested_by_guest_token TEXT,
    added_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_shared_candidate UNIQUE (shared_list_id, mal_id)
);

-- 10. VOTOS EN LISTAS COMPARTIDAS (Escala de ganas 0 a 10)
CREATE TABLE IF NOT EXISTS public.shared_list_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.shared_list_candidates(id) ON DELETE CASCADE,
    voter_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    voter_guest_token TEXT,
    interest_score INT NOT NULL CHECK (interest_score >= 0 AND interest_score <= 10),
    voted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT vote_identity_check CHECK (
        (voter_user_id IS NOT NULL AND voter_guest_token IS NULL) OR 
        (voter_user_id IS NULL AND voter_guest_token IS NOT NULL)
    )
);

-- 11. SEGUIMIENTO DE PROGRESO GRUPAL
CREATE TABLE IF NOT EXISTS public.group_watch_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shared_list_id UUID NOT NULL REFERENCES public.shared_lists(id) ON DELETE CASCADE,
    mal_id INT NOT NULL REFERENCES public.anime_cache(mal_id) ON DELETE CASCADE,
    current_episode INT DEFAULT 0 NOT NULL,
    total_episodes INT,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. FEED DE ACTIVIDAD SOCIAL
CREATE TABLE IF NOT EXISTS public.activity_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'finished_anime', 'added_candidate', 'voted', 'created_shared_list'
    payload JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anime_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_list_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_list_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_list_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_watch_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS RLS BÁSICAS
-- Profiles: Lectura pública, escritura propia
CREATE POLICY "Profiles son legibles públicamente" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Usuarios modifican su propio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Anime Cache: Lectura pública
CREATE POLICY "Caché de anime accesible para todos" ON public.anime_cache FOR SELECT USING (true);
CREATE POLICY "Insertar en caché" ON public.anime_cache FOR INSERT WITH CHECK (true);

-- Personal Lists: Lectura propia o pública, escritura propia
CREATE POLICY "Listas personales legibles" ON public.personal_lists FOR SELECT USING (is_public OR auth.uid() = user_id);
CREATE POLICY "Usuarios gestionan sus listas personales" ON public.personal_lists FOR ALL USING (auth.uid() = user_id);

-- Shared Lists: Accesibles por invite_code o miembros
CREATE POLICY "Listas compartidas legibles" ON public.shared_lists FOR SELECT USING (true);
CREATE POLICY "Crear listas compartidas" ON public.shared_lists FOR INSERT WITH CHECK (true);

-- Shared List Members: Acceso de miembros e invitados
CREATE POLICY "Miembros legibles" ON public.shared_list_members FOR SELECT USING (true);
CREATE POLICY "Unirse como miembro o invitado" ON public.shared_list_members FOR INSERT WITH CHECK (true);

-- Shared List Candidates: Accesibles para miembros de la lista
CREATE POLICY "Candidatos legibles" ON public.shared_list_candidates FOR SELECT USING (true);
CREATE POLICY "Postular candidato" ON public.shared_list_candidates FOR INSERT WITH CHECK (true);

-- Shared List Votes: Acceso lectura y votación en tiempo real
CREATE POLICY "Votos legibles públicamente" ON public.shared_list_votes FOR SELECT USING (true);
CREATE POLICY "Insertar o actualizar votos" ON public.shared_list_votes FOR ALL USING (true);

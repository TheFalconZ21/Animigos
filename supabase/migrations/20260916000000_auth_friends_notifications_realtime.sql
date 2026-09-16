-- ============================================================================
-- Migración: Autenticación, Amigos, Notificaciones y Supabase Realtime
-- Archivo: 20260916000000_auth_friends_notifications_realtime.sql
-- ============================================================================

-- 1. TRIGGER AUTOMÁTICO: Crear perfil de usuario al registrarse en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_username TEXT;
    new_display_name TEXT;
BEGIN
    -- Obtener username de los metadatos o generarlo a partir del email
    new_username := COALESCE(
        NEW.raw_user_meta_data->>'username',
        SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTR(md5(random()::text), 1, 4)
    );
    
    new_display_name := COALESCE(
        NEW.raw_user_meta_data->>'display_name',
        SPLIT_PART(NEW.email, '@', 1)
    );

    -- Insertar en la tabla public.profiles
    INSERT INTO public.profiles (id, username, display_name, avatar_url, bio, created_at, updated_at)
    VALUES (
        NEW.id,
        new_username,
        new_display_name,
        COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        ),
        '¡Hola! Soy nuevo en Animigos 🌸',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;

    -- Crear preferencias iniciales de usuario
    INSERT INTO public.user_preferences (user_id, onboarding_completed, onboarding_stage, favorite_genres, experience_level, updated_at)
    VALUES (
        NEW.id,
        FALSE,
        'none',
        '{}',
        'beginner',
        NOW()
    )
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger previo si existe y recrear
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 2. POLÍTICAS RLS COMPLETAS PARA LA TABLA FRIENDSHIPS
-- ============================================================================
DROP POLICY IF EXISTS "Usuarios ven sus propias amistades" ON public.friendships;
DROP POLICY IF EXISTS "Usuarios pueden enviar solicitudes de amistad" ON public.friendships;
DROP POLICY IF EXISTS "Usuarios pueden responder solicitudes de amistad" ON public.friendships;
DROP POLICY IF EXISTS "Usuarios pueden eliminar amistades" ON public.friendships;

-- SELECT: Un usuario puede ver relaciones donde sea el remitente o el destinatario
CREATE POLICY "Usuarios ven sus propias amistades"
    ON public.friendships FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- INSERT: Solo puede enviar solicitud como el remitente autenticado
CREATE POLICY "Usuarios pueden enviar solicitudes de amistad"
    ON public.friendships FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- UPDATE: El destinatario puede aceptar/rechazar la solicitud
CREATE POLICY "Usuarios pueden responder solicitudes de amistad"
    ON public.friendships FOR UPDATE
    USING (auth.uid() = friend_id OR auth.uid() = user_id);

-- DELETE: Cualquiera de las dos partes puede eliminar la amistad o cancelar solicitud
CREATE POLICY "Usuarios pueden eliminar amistades"
    ON public.friendships FOR DELETE
    USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- ============================================================================
-- 3. TABLA DE NOTIFICACIONES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    type TEXT NOT NULL, -- 'friend_request', 'friend_accepted', 'list_invite', 'vote_reminder', 'recommendation'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para alto rendimiento
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Habilitar RLS en notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios ven sus propias notificaciones" ON public.notifications;
DROP POLICY IF EXISTS "Sistema y usuarios autorizados crean notificaciones" ON public.notifications;
DROP POLICY IF EXISTS "Usuarios actualizan sus propias notificaciones" ON public.notifications;
DROP POLICY IF EXISTS "Usuarios eliminan sus propias notificaciones" ON public.notifications;

-- SELECT: El usuario solo ve sus propias notificaciones
CREATE POLICY "Usuarios ven sus propias notificaciones"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

-- INSERT: Se permite insertar si estás autenticado (para notificar a un amigo)
CREATE POLICY "Sistema y usuarios autorizados crean notificaciones"
    ON public.notifications FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- UPDATE: El usuario puede marcar como leída su notificación
CREATE POLICY "Usuarios actualizan sus propias notificaciones"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- DELETE: El usuario puede borrar sus notificaciones
CREATE POLICY "Usuarios eliminan sus propias notificaciones"
    ON public.notifications FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- 4. HABILITACIÓN DE SUPABASE REALTIME
-- ============================================================================
-- Agrega las tablas a la publicación de replicación de Supabase Realtime
DO $$
BEGIN
    -- notifications
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
    END IF;

    -- friendships
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'friendships'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.friendships;
    END IF;

    -- profiles
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'profiles'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
    END IF;
END $$;

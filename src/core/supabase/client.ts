/**
 * @file client.ts
 * @description Cliente de Supabase para el navegador (Browser Client).
 * 
 * Se utiliza en componentes marcados con "use client" para interactuar
 * con la base de datos y suscripciones en tiempo real.
 */

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rarjyjjykmdouspqctcp.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_vVnJWxsqUffyE2ytbdkbdw_GjG9Rxvw";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

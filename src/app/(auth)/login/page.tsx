"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/contexts/AuthContext";
import { useTheme } from "@/core/contexts/ThemeContext";
import { Tv, Mail, Lock, ArrowRight, Sparkles, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail } = useAuth();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Por favor ingresa tu correo y contraseña.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await signInWithEmail(email.trim(), password);
    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message || "Error al iniciar sesión. Verifica tus credenciales.");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div
        className="max-w-md w-full rounded-3xl p-8 border backdrop-blur-2xl shadow-2xl space-y-6 transition-all"
        style={{
          backgroundColor: "var(--theme-card-bg, rgba(15, 23, 42, 0.8))",
          borderColor: `rgba(${theme.primaryRgb}, 0.4)`,
          boxShadow: `0 25px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(${theme.primaryRgb}, 0.15)`,
        }}
      >
        {/* Brand Logo & Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div
              className="w-12 h-12 rounded-2xl p-0.5 shadow-lg group-hover:scale-105 transition-all"
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
              }}
            >
              <div className="w-full h-full bg-[#0B0F17] rounded-[14px] flex items-center justify-center">
                <Tv className="w-6 h-6" style={{ color: theme.primaryColor }} />
              </div>
            </div>
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
              Animigos <span className="text-xs">{theme.emoji}</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-white pt-2">¡Bienvenido de vuelta!</h2>
          <p className="text-xs text-gray-400">
            Ingresa con tu cuenta para coordinar animes y ver las listas con tus amigos.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-700/60 text-rose-200 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-bold text-gray-300">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-black/60 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none transition-all"
                style={{
                  borderColor: `rgba(${theme.primaryRgb}, 0.3)`,
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-300">Contraseña</label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/60 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none transition-all"
                style={{
                  borderColor: `rgba(${theme.primaryRgb}, 0.3)`,
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl font-bold text-xs text-white flex items-center justify-center gap-2 shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
              boxShadow: `0 4px 20px rgba(${theme.primaryRgb}, 0.4)`,
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <span>Entrar a Animigos</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Register */}
        <div className="pt-2 text-center text-xs text-gray-400 border-t border-white/10">
          ¿No tienes una cuenta aún?{" "}
          <Link
            href="/register"
            className="font-bold hover:underline transition-colors"
            style={{ color: theme.primaryColor }}
          >
            Regístrate gratis
          </Link>
        </div>
      </div>
    </div>
  );
}

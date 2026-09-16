"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/contexts/AuthContext";
import { useTheme } from "@/core/contexts/ThemeContext";
import { Tv, Mail, Lock, User, AtSign, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { signUpWithEmail } = useAuth();
  const { theme } = useTheme();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");

    if (!cleanUsername || cleanUsername.length < 3) {
      setErrorMsg("El nombre de usuario debe tener al menos 3 caracteres alfanuméricos.");
      return;
    }

    if (!displayName.trim()) {
      setErrorMsg("Por favor indica cómo te gustaría que te llamen.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUpWithEmail(
      email.trim(),
      password,
      cleanUsername,
      displayName.trim()
    );
    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message || "Error al crear tu cuenta. Intenta con otro correo o usuario.");
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
        {/* Header */}
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
          <h2 className="text-xl font-bold text-white pt-2">Crea tu cuenta</h2>
          <p className="text-xs text-gray-400">
            Únete a la comunidad para guardar tus animes y votar con tus amigos.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-700/60 text-rose-200 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {/* Nombre Visible */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-gray-300">Nombre Visible</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ej: Sofía Martínez"
                  className="w-full bg-black/60 border rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                  style={{ borderColor: `rgba(${theme.primaryRgb}, 0.3)` }}
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-gray-300">Usuario (@)</label>
              <div className="relative">
                <AtSign className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="sofi_otaku"
                  className="w-full bg-black/60 border rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none lowercase"
                  style={{ borderColor: `rgba(${theme.primaryRgb}, 0.3)` }}
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1 text-left">
            <label className="block text-[11px] font-bold text-gray-300">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-black/60 border rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                style={{ borderColor: `rgba(${theme.primaryRgb}, 0.3)` }}
              />
            </div>
          </div>

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-gray-300">Contraseña</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-black/60 border rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                  style={{ borderColor: `rgba(${theme.primaryRgb}, 0.3)` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-gray-300">Confirmar</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repetir contraseña"
                  className="w-full bg-black/60 border rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                  style={{ borderColor: `rgba(${theme.primaryRgb}, 0.3)` }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 rounded-2xl font-bold text-xs text-white flex items-center justify-center gap-2 shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
              boxShadow: `0 4px 20px rgba(${theme.primaryRgb}, 0.4)`,
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creando tu cuenta...</span>
              </>
            ) : (
              <>
                <span>Registrarme en Animigos</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="pt-2 text-center text-xs text-gray-400 border-t border-white/10">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-bold hover:underline transition-colors"
            style={{ color: theme.primaryColor }}
          >
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import AppThemeProvider from "@/components/common/AppThemeProvider";

export const metadata: Metadata = {
  title: "Animigos — ¿Qué anime deberíamos ver juntos hoy?",
  description:
    "Plataforma social para coordinar qué anime ver entre amigos y obtener recomendaciones accesibles e inteligentes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[#0B0F17] text-gray-100 antialiased selection:bg-purple-500 selection:text-white">
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}

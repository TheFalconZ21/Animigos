"use client";

import { useEffect, useState, useRef } from "react";
import { Newspaper, ChevronLeft, ChevronRight, ExternalLink, RefreshCw, Clock } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: "Anmo Sugoi" | "Ramen Para Dos" | "Anime News";
  category: string;
  description: string;
  image?: string;
}

const MOCK_FALLBACK_NEWS: NewsItem[] = [
  {
    id: "mock-1",
    title: "Los nuevos anime que se han convertido en sorpresas de la temporada",
    link: "https://anmosugoi.com",
    pubDate: "Hace 2 horas",
    source: "Anmo Sugoi",
    category: "Noticias Anime",
    description: "Títulos emergentes escalan rápidamente en encuestas japonesas y conversaciones globales.",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "mock-2",
    title: "Nuevas licencias de manga confirmadas para publicación en español",
    link: "https://ramenparados.com",
    pubDate: "Hace 4 horas",
    source: "Ramen Para Dos",
    category: "Manga & Novedades",
    description: "Importantes obras galardonadas confirman su llegada en tomos físicos durante los próximos meses.",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "mock-3",
    title: "Anunciadas adaptaciones al anime de las novelas más populares del año",
    link: "https://anmosugoi.com",
    pubDate: "Hace 6 horas",
    source: "Anmo Sugoi",
    category: "Anuncios Oficiales",
    description: "Comités de producción revelan trailers teaser, visuales principales y elencos de voces.",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "mock-4",
    title: "Revelan primer tráiler promocional para la nueva temporada de misterio",
    link: "https://ramenparados.com",
    pubDate: "Hace 8 horas",
    source: "Ramen Para Dos",
    category: "Estrenos 2026",
    description: "El estudio de animación presentó secuencias inéditas y confirmó la fecha de emisión oficial.",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "mock-5",
    title: "Encuesta semanal: Los personajes más queridos según los otakus en Japón",
    link: "https://anmosugoi.com",
    pubDate: "Hace 12 horas",
    source: "Anmo Sugoi",
    category: "Ranking & Encuestas",
    description: "Conoce el Top 10 de protagonistas masculinos y femeninos que lideran las tendencias actuales.",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80",
  },
];

export default function AnimeNewsFeed() {
  const [activeTab, setActiveTab] = useState<"all" | "anmo" | "ramen">("all");
  const [news, setNews] = useState<NewsItem[]>(MOCK_FALLBACK_NEWS);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const [resAnmo, resRamen] = await Promise.allSettled([
        fetch("https://api.rss2json.com/v1/api.json?rss_url=https://www.anmosugoi.com/feed/"),
        fetch("https://api.rss2json.com/v1/api.json?rss_url=https://ramenparados.com/feed/"),
      ]);

      const items: NewsItem[] = [];

      if (resAnmo.status === "fulfilled") {
        const data = await resAnmo.value.json();
        if (data.status === "ok" && Array.isArray(data.items)) {
          data.items.slice(0, 5).forEach((item: any, idx: number) => {
            const cleanDesc = item.description?.replace(/<[^>]*>?/gm, "").slice(0, 140) + "...";
            items.push({
              id: `anmo-${idx}`,
              title: item.title,
              link: item.link,
              pubDate: formatPubDate(item.pubDate),
              source: "Anmo Sugoi",
              category: item.categories?.[0] || "Anime",
              description: cleanDesc,
            });
          });
        }
      }

      if (resRamen.status === "fulfilled") {
        const data = await resRamen.value.json();
        if (data.status === "ok" && Array.isArray(data.items)) {
          data.items.slice(0, 5).forEach((item: any, idx: number) => {
            const cleanDesc = item.description?.replace(/<[^>]*>?/gm, "").slice(0, 140) + "...";
            items.push({
              id: `ramen-${idx}`,
              title: item.title,
              link: item.link,
              pubDate: formatPubDate(item.pubDate),
              source: "Ramen Para Dos",
              category: item.categories?.[0] || "Manga",
              description: cleanDesc,
            });
          });
        }
      }

      if (items.length > 0) {
        setNews(items);
      }
    } catch {
      // Fallback intact
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNews = news.filter((item) => {
    if (activeTab === "anmo") return item.source === "Anmo Sugoi";
    if (activeTab === "ramen") return item.source === "Ramen Para Dos";
    return true;
  });

  // Auto slide carrusel cada 5 segundos
  useEffect(() => {
    if (isPaused || filteredNews.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredNews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, filteredNews.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredNews.length) % filteredNews.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredNews.length);
  };

  const formatPubDate = (dateStr: string) => {
    if (!dateStr) return "Reciente";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      if (diffHours <= 0) return "Hace instantes";
      if (diffHours < 24) return `Hace ${diffHours}h`;
      return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
    } catch {
      return "Reciente";
    }
  };

  const activeItem = filteredNews[currentIndex] || filteredNews[0] || MOCK_FALLBACK_NEWS[0];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="glass-panel p-5 sm:p-6 rounded-3xl border border-gray-800 space-y-4 relative overflow-hidden"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Noticias en Carrusel
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CARRUSEL EN VIVO
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Titulares de anime & manga deslizando automáticamente
            </p>
          </div>
        </div>

        {/* Source Switcher & Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex bg-gray-900/80 p-1 rounded-2xl border border-gray-800 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab("all");
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => {
                setActiveTab("anmo");
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                activeTab === "anmo"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Anmo Sugoi
            </button>
            <button
              onClick={() => {
                setActiveTab("ramen");
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                activeTab === "ramen"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Ramen Para Dos
            </button>
          </div>

          <button
            onClick={fetchNews}
            disabled={loading}
            title="Actualizar carrusel"
            className="p-2 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-pink-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Carousel Display Card */}
      <div className="relative rounded-2xl bg-gradient-to-r from-gray-900/90 via-slate-900/90 to-purple-950/40 border border-gray-800 p-5 sm:p-6 transition-all duration-500 min-h-[160px] flex flex-col justify-between group">
        {/* Navigation Arrow Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-950/80 hover:bg-purple-900 text-gray-300 hover:text-white border border-gray-700/80 shadow-lg transition-all opacity-80 group-hover:opacity-100 cursor-pointer z-10"
          title="Noticia anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-950/80 hover:bg-purple-900 text-gray-300 hover:text-white border border-gray-700/80 shadow-lg transition-all opacity-80 group-hover:opacity-100 cursor-pointer z-10"
          title="Siguiente noticia"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel Slide Content */}
        <div className="px-8 sm:px-10">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                  activeItem.source === "Anmo Sugoi"
                    ? "bg-pink-500/10 text-pink-400 border border-pink-500/30"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                }`}
              >
                {activeItem.source}
              </span>
              <span className="text-[11px] font-semibold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-800/40">
                {activeItem.category}
              </span>
            </div>

            <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              {activeItem.pubDate}
            </span>
          </div>

          {/* Title & Description */}
          <a
            href={activeItem.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block group/link"
          >
            <h3 className="text-base sm:text-lg font-extrabold text-white group-hover/link:text-pink-300 transition-colors line-clamp-2 leading-snug mb-2">
              {activeItem.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 leading-relaxed mb-4">
              {activeItem.description}
            </p>
          </a>

          {/* Read Article Action */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-800/80">
            <span className="text-[11px] text-gray-400 font-medium">
              Noticia {currentIndex + 1} de {filteredNews.length}
            </span>

            <a
              href={activeItem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-md shadow-pink-600/20 transition-all"
            >
              Leer noticia completa <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Carousel Slide Indicators / Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {filteredNews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? "w-6 bg-gradient-to-r from-pink-500 to-purple-500"
                  : "w-2 bg-gray-800 hover:bg-gray-700"
              }`}
              title={`Ir a noticia ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

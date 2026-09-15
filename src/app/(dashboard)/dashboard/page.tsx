import Navbar from "@/components/common/Navbar";
import SocialActivityFeed from "@/components/dashboard/SocialActivityFeed";
import SharedListsDashboardWidget from "@/components/dashboard/SharedListsDashboardWidget";
import AnimeNewsFeed from "@/components/dashboard/AnimeNewsFeed";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500 bg-transparent">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative z-10">
        {/* Anime News Carousel Banner (Anmo Sugoi & Ramen Para Dos) */}
        <AnimeNewsFeed />

        {/* ESTRUCTURA CONTINUA VERTICAL (MAIN STREAM + SIDEBAR CON LISTAS COMPARTIDAS) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-2">
          {/* Columna Principal: Stream Continuo Social de Actividad (2 cols) */}
          <div className="lg:col-span-2">
            <SocialActivityFeed />
          </div>

          {/* Columna Lateral Fija: Listas Compartidas (1 col) */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <SharedListsDashboardWidget />
          </div>
        </div>
      </main>
    </div>
  );
}

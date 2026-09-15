"use client";

import { useEffect } from "react";
import { Newspaper } from "lucide-react";

export default function KudasaiNewsWidget() {
  useEffect(() => {
    // Definir configuración global requerida por Kudasai
    (window as any).somoskudasai_config = function () {
      this.layout = "horizontally";
      this.items = 3;
      this.clr1 = "#1E293B";
      this.clr2 = "#1E293B";
      this.clr3 = "#E2E8F0";
      this.clr4 = "#E2E8F0";
      this.clr5 = "#F8FAFC";
      this.clr6 = "#E2E8F0";
    };

    // Inyectar script de Kudasai
    const scriptId = "somoskudasai-embed-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "text/javascript";
      script.src = "https://somoskudasai.com/embed.js";
      script.setAttribute("data-timestamp", String(+new Date()));
      (document.head || document.body).appendChild(script);
    }
  }, []);

  return (
    <div className="glass-panel p-5 rounded-3xl border border-gray-800 space-y-3 shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-800/80 pb-2.5">
        <h3 className="text-xs font-black text-gray-300 uppercase tracking-wider flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-rose-400" /> Últimas Noticias de Anime (Kudasai)
        </h3>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-800/50">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" /> En Vivo
        </span>
      </div>

      <div id="somoskudasai_news" className="min-h-[140px] overflow-hidden rounded-2xl" />
    </div>
  );
}

"""
Script de inserción masiva para poblar public.imdb_popular_titles en Supabase.
"""

import os
import sys
import json
import urllib.request

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

JSON_FILE = os.path.join(os.getcwd(), "scripts", "imdb_popular_clean.json")
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "https://rarjyjjykmdouspqctcp.supabase.co") + "/rest/v1/imdb_popular_titles"
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

def seed_imdb():
    print("==================================================")
    print("Iniciando Carga de IMDb a Supabase")
    print("==================================================")

    if not os.path.exists(JSON_FILE):
        print("Archivo JSON no encontrado:", JSON_FILE)
        return

    with open(JSON_FILE, "r", encoding="utf-8") as f:
        all_titles = json.load(f)

    # Seleccionar las top 3.000 producciones con mayor cantidad de votos
    top_titles = all_titles[:3000]
    print(f"Subiendo las top {len(top_titles)} películas y series reconocibles...")

    batch_size = 300
    for i in range(0, len(top_titles), batch_size):
        chunk = top_titles[i : i + batch_size]
        payload = [
            {
                "tconst": t["tconst"],
                "primary_title": t["primary_title"],
                "title_type": t["title_type"],
                "start_year": t["start_year"],
                "runtime_minutes": t["runtime_minutes"],
                "genres": t["genres"],
                "rating": t["rating"],
                "num_votes": t["num_votes"],
            }
            for t in chunk
        ]

        req = urllib.request.Request(
            SUPABASE_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "resolution=merge-duplicates",
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(req) as resp:
                if resp.status in (200, 201):
                    print(f"Cargados {min(i + batch_size, len(top_titles))}/{len(top_titles)} títulos en imdb_popular_titles")
        except urllib.error.HTTPError as e:
            print("Error HTTP:", e.code, e.read().decode("utf-8"))
            break

    print("[OK] Ingestión de IMDb completada exitosamente.")

if __name__ == "__main__":
    seed_imdb()

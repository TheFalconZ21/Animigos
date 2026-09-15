"""
Script de procesamiento y filtrado inteligente del dataset IMDb (9.6 GB RAW).
Filtra los ~2.000 a 3.000 títulos de películas y series occidentales más populares
(numVotes >= 20.000) para el onboarding de usuarios novatos.
"""

import os
import sys
import csv
import json

# Configurar salida UTF-8 para consola de Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

DATASET_DIR = os.path.join(os.getcwd(), "IMDB_dataset")
RATINGS_FILE = os.path.join(DATASET_DIR, "title.ratings.tsv")
BASICS_FILE = os.path.join(DATASET_DIR, "title.basics.tsv")
OUTPUT_FILE = os.path.join(os.getcwd(), "scripts", "imdb_popular_clean.json")

def process_imdb():
    print("==================================================")
    print("Iniciando Procesamiento y Filtrado de IMDb (9.6 GB)")
    print("==================================================")

    if not os.path.exists(RATINGS_FILE) or not os.path.exists(BASICS_FILE):
        print("Archivos de IMDb no encontrados en IMDB_dataset/")
        return

    # Paso 1: Cargar calificaciones y votos de títulos populares (numVotes >= 20.000)
    print("--> Paso 1: Filtrando ratings con numVotes >= 20.000...")
    popular_ratings = {}
    
    with open(RATINGS_FILE, "r", encoding="utf-8") as f:
        reader = csv.reader(f, delimiter="\t")
        header = next(reader)
        # tconst (0), averageRating (1), numVotes (2)
        for row in reader:
            if len(row) >= 3:
                try:
                    num_votes = int(row[2])
                    if num_votes >= 20000:
                        popular_ratings[row[0]] = {
                            "rating": float(row[1]),
                            "num_votes": num_votes
                        }
                except ValueError:
                    continue

    print(f"[OK] Se encontraron {len(popular_ratings)} titulos populares con mas de 20.000 votos en IMDb.")

    # Paso 2: Filtrar metadatos en title.basics.tsv
    print("--> Paso 2: Extrayendo metadatos de peliculas y series occidentales...")
    clean_titles = []
    
    valid_types = {"movie", "tvSeries", "tvMiniSeries"}

    with open(BASICS_FILE, "r", encoding="utf-8") as f:
        reader = csv.reader(f, delimiter="\t")
        header = next(reader)
        # tconst (0), titleType (1), primaryTitle (2), originalTitle (3), isAdult (4), startYear (5), endYear (6), runtimeMinutes (7), genres (8)
        for row in reader:
            if len(row) < 9:
                continue
            
            tconst = row[0]
            if tconst not in popular_ratings:
                continue
            
            title_type = row[1]
            if title_type not in valid_types:
                continue
            
            is_adult = row[4]
            if is_adult == "1":
                continue

            primary_title = row[2]
            start_year = int(row[5]) if row[5].isdigit() else None
            runtime = int(row[7]) if row[7].isdigit() else None
            genres = row[8].split(",") if row[8] != "\\N" else []
            
            rating_info = popular_ratings[tconst]

            clean_titles.append({
                "tconst": tconst,
                "primary_title": primary_title,
                "title_type": title_type,
                "start_year": start_year,
                "runtime_minutes": runtime,
                "genres": genres,
                "rating": rating_info["rating"],
                "num_votes": rating_info["num_votes"]
            })

    # Ordenar por número de votos descendente
    clean_titles.sort(key=lambda x: x["num_votes"], reverse=True)

    print(f"[OK] Filtrado completado: {len(clean_titles)} producciones clave obtenidas.")

    # Guardar JSON limpio
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(clean_titles, f, ensure_ascii=False, indent=2)

    print(f"Resultado guardado exitosamente en: {OUTPUT_FILE}")

if __name__ == "__main__":
    process_imdb()

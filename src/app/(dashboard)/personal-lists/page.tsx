"use client";

import { useState } from "react";
import Navbar from "@/components/common/Navbar";
import AnimeDetailModal from "@/components/common/AnimeDetailModal";
import QuickAddAnimeWidget from "@/components/dashboard/QuickAddAnimeWidget";
import FolderCard, { PersonalFolder, PersonalItem } from "@/components/dashboard/FolderCard";
import EditFolderModal from "@/components/dashboard/EditFolderModal";
import RecommendFolderModal from "@/components/dashboard/RecommendFolderModal";
import RecommendBatchModal from "@/components/dashboard/RecommendBatchModal";
import ImportBatchConfirmationModal from "@/components/dashboard/ImportBatchConfirmationModal";
import TagManagerWidget, { UserTag } from "@/components/dashboard/TagManagerWidget";
import { useTheme } from "@/core/contexts/ThemeContext";
import { getScoreBadgeStyle, MAL_SCORE_OPTIONS, GENRE_THEMES } from "@/core/utils/score-theme";
import { MOCK_TOP_ANIMES, MOCK_STUDIOS, ExtendedAnime } from "@/core/services/catalog-data";
import {
  List,
  Star,
  Plus,
  CheckCircle,
  Clock,
  Heart,
  Eye,
  Search,
  Sparkles,
  Building2,
  FolderPlus,
  Folder,
  Layers,
  ChevronDown,
  Tag as TagIcon,
  RotateCcw,
  Send,
  Calendar,
  Globe,
} from "lucide-react";

type ListItemType =
  | { kind: "folder"; id: string; data: PersonalFolder; sortUserScore: number; sortMalScore: number; sortEpisodes: number; sortName: string }
  | { kind: "anime"; id: string; data: PersonalItem; sortUserScore: number; sortMalScore: number; sortEpisodes: number; sortName: string };

export default function PersonalListsPage() {
  // Estado de Tags Creados por el Usuario
  const [userTags, setUserTags] = useState<UserTag[]>([
    { id: "tag-1", name: "#obras-maestras", color: "bg-purple-950/80 border-purple-500/60 text-purple-300" },
    { id: "tag-2", name: "#maratón-viernes", color: "bg-emerald-950/80 border-emerald-500/60 text-emerald-300" },
    { id: "tag-3", name: "#imperdibles-sci-fi", color: "bg-cyan-950/80 border-cyan-500/60 text-cyan-300" },
  ]);

  const [activeTagFilterId, setActiveTagFilterId] = useState<string | null>(null);

  // Estado de Carpetas de Sagas (con userScore personal y malScore global)
  const [folders, setFolders] = useState<PersonalFolder[]>([
    {
      id: "folder-steins-gate",
      title: "Saga Steins;Gate",
      description: "Líneas de universo Alpha y Beta",
      createdAt: new Date().toISOString(),
      animes: [
        {
          malId: 9253,
          title: "Steins;Gate",
          imageUrl: "https://cdn.myanimelist.net/images/anime/1935/127974.jpg",
          score: 10,
          userScore: 10,
          malScore: 9.07,
          episodesWatched: 24,
          totalEpisodes: 24,
          statusCategory: "favoritos",
          notes: "Viajes en el tiempo insuperables.",
          studio: "White Fox",
          genres: ["Sci-Fi", "Psicológico"],
          synopsis: "Okabe y sus amigos envían mensajes al pasado alterando las líneas temporales.",
          type: "TV",
          tags: ["tag-1", "tag-3"],
        },
        {
          malId: 35180,
          title: "Steins;Gate 0",
          imageUrl: "https://cdn.myanimelist.net/images/anime/1375/93837.jpg",
          score: 9.0,
          userScore: 9.0,
          malScore: 8.5,
          episodesWatched: 23,
          totalEpisodes: 23,
          statusCategory: "vistos",
          notes: "Línea temporal Beta con la IA Amadeus.",
          studio: "White Fox",
          genres: ["Sci-Fi", "Drama"],
          synopsis: "Explora la historia alternativa donde Okabe no pudo salvar a Kurisu.",
          type: "TV",
          tags: ["tag-3"],
        },
      ],
    },
  ]);

  // Estado de Animes Sueltos
  const [userItems, setUserItems] = useState<PersonalItem[]>([
    {
      malId: 52991,
      title: "Frieren: Beyond Journey's End",
      imageUrl: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg",
      score: 10,
      userScore: 10,
      malScore: 9.1,
      episodesWatched: 28,
      totalEpisodes: 28,
      statusCategory: "vistos",
      notes: "Excelente desarrollo de personajes y animación brillante.",
      studio: "Madhouse",
      genres: ["Fantasía", "Aventura"],
      synopsis: "Tras la derrota del Rey Demonio, la elfa Frieren reflexiona sobre su inmortalidad y emprende un nuevo viaje.",
      type: "TV",
      tags: ["tag-1"],
    },
    {
      malId: 5114,
      title: "Fullmetal Alchemist: Brotherhood",
      imageUrl: "https://cdn.myanimelist.net/images/anime/1208/94745.jpg",
      score: 9.5,
      userScore: 9.5,
      malScore: 9.1,
      episodesWatched: 64,
      totalEpisodes: 64,
      statusCategory: "vistos",
      notes: "Obra maestra shonen.",
      studio: "Bones",
      genres: ["Acción", "Fantasía"],
      synopsis: "Edward y Alphonse Elric buscan la Piedra Filosofal tras un experimento alquímico fallido.",
      type: "TV",
      tags: ["tag-1"],
    },
    {
      malId: 31240,
      title: "Re:Zero − Starting Life in Another World",
      imageUrl: "https://cdn.myanimelist.net/images/anime/11/79410.jpg",
      score: 8.0,
      userScore: 8.0,
      malScore: 8.2,
      episodesWatched: 14,
      totalEpisodes: 25,
      statusCategory: "viendo",
      notes: "Viendo con el grupo los viernes.",
      studio: "White Fox",
      genres: ["Isekai", "Suspenso"],
      synopsis: "Subaru Natsuki es transportado a un mundo fantástico descubriendo su habilidad Regreso por Muerte.",
      type: "TV",
      tags: ["tag-2"],
    },
    {
      malId: 1535,
      title: "Death Note",
      imageUrl: "https://cdn.myanimelist.net/images/anime/9/9444.jpg",
      score: 8.5,
      userScore: 8.5,
      malScore: 8.6,
      episodesWatched: 0,
      totalEpisodes: 37,
      statusCategory: "pendientes",
      notes: "Recomendado por Maximiliano.",
      studio: "Madhouse",
      genres: ["Misterio", "Suspenso"],
      synopsis: "Light Yagami encuentra un cuaderno de la muerte desatando el duelo mental contra L.",
      type: "TV",
      tags: [],
    },
    {
      malId: 32281,
      title: "Your Name (Kimi no Na wa.)",
      imageUrl: "https://cdn.myanimelist.net/images/anime/5/87048.jpg",
      score: 8.84,
      userScore: 8.84,
      malScore: 8.84,
      episodesWatched: 1,
      totalEpisodes: 1,
      statusCategory: "vistos",
      notes: "Película conmovedora.",
      studio: "CoMix Wave Films",
      genres: ["Romance", "Sobrenatural"],
      synopsis: "Dos jóvenes desconocidos intercambian sus cuerpos conectándose a través del tiempo.",
      type: "Película",
      tags: [],
    },
  ]);

  // Filtros Avanzados
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "vistos" | "viendo" | "pendientes" | "favoritos">("all");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedStudio, setSelectedStudio] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"userScore" | "userScoreAsc" | "malScore" | "episodes" | "name">("userScore");
  const { theme, manualTheme, setManualTheme } = useTheme();

  // Modales
  const [selectedAnimeModal, setSelectedAnimeModal] = useState<ExtendedAnime | null>(null);
  const [editingFolderModal, setEditingFolderModal] = useState<PersonalFolder | null>(null);
  const [recommendingFolderModal, setRecommendingFolderModal] = useState<PersonalFolder | null>(null);
  const [isRecommendBatchOpen, setIsRecommendBatchOpen] = useState(false);

  // Importar Selección Recomendada
  const [pendingImportBatch, setPendingImportBatch] = useState<{
    senderName: string;
    note: string;
    folders: PersonalFolder[];
    looseAnimes: PersonalItem[];
    skippedWatchedTitles: string[];
    relocatedAnimeTitles: string[];
  } | null>(null);

  // Dropdown activo para "Mover a carpeta..." y "+ Tag"
  const [openMoveDropdownId, setOpenMoveDropdownId] = useState<number | null>(null);
  const [openTagAssignId, setOpenTagAssignId] = useState<number | null>(null);

  // Animes Recomendados para el Sidebar
  const allUserMalIds = [
    ...userItems.map((u) => u.malId),
    ...folders.flatMap((f) => f.animes.map((a) => a.malId)),
  ];

  const recommendedSideList = MOCK_TOP_ANIMES.filter(
    (anime) => !allUserMalIds.includes(anime.malId)
  ).slice(0, 5);

  // Tag Counts Math
  const tagAnimeCounts: Record<string, number> = {};
  userTags.forEach((t) => {
    let count = userItems.filter((i) => i.tags && i.tags.includes(t.id)).length;
    folders.forEach((f) => {
      count += f.animes.filter((a) => a.tags && a.tags.includes(t.id)).length;
    });
    tagAnimeCounts[t.id] = count;
  });

  // Actualizar la nota personal de un anime
  const handleUpdateAnimeUserScore = (malId: number, newUserScore: number) => {
    setUserItems((prev) =>
      prev.map((item) =>
        item.malId === malId ? { ...item, userScore: newUserScore, score: newUserScore } : item
      )
    );

    setFolders((prev) =>
      prev.map((f) => ({
        ...f,
        animes: f.animes.map((a) =>
          a.malId === malId ? { ...a, userScore: newUserScore, score: newUserScore } : a
        ),
      }))
    );
  };

  // Tag Handlers
  const handleCreateTag = (name: string, color: string) => {
    const newTag: UserTag = { id: `tag-${Date.now()}`, name, color };
    setUserTags((prev) => [...prev, newTag]);
  };

  const handleRenameTag = (tagId: string, newName: string) => {
    setUserTags((prev) => prev.map((t) => (t.id === tagId ? { ...t, name: newName } : t)));
  };

  const handleDeleteTag = (tagId: string) => {
    setUserTags((prev) => prev.filter((t) => t.id !== tagId));
    setUserItems((prev) =>
      prev.map((item) => ({
        ...item,
        tags: item.tags ? item.tags.filter((id) => id !== tagId) : [],
      }))
    );
    setFolders((prev) =>
      prev.map((f) => ({
        ...f,
        animes: f.animes.map((a) => ({
          ...a,
          tags: a.tags ? a.tags.filter((id) => id !== tagId) : [],
        })),
      }))
    );
    if (activeTagFilterId === tagId) setActiveTagFilterId(null);
  };

  const handleToggleTagOnAnime = (animeMalId: number, tagId: string) => {
    setUserItems((prev) =>
      prev.map((item) => {
        if (item.malId === animeMalId) {
          const currentTags = item.tags || [];
          const hasTag = currentTags.includes(tagId);
          return {
            ...item,
            tags: hasTag ? currentTags.filter((id) => id !== tagId) : [...currentTags, tagId],
          };
        }
        return item;
      })
    );

    setFolders((prev) =>
      prev.map((f) => ({
        ...f,
        animes: f.animes.map((a) => {
          if (a.malId === animeMalId) {
            const currentTags = a.tags || [];
            const hasTag = currentTags.includes(tagId);
            return {
              ...a,
              tags: hasTag ? currentTags.filter((id) => id !== tagId) : [...currentTags, tagId],
            };
          }
          return a;
        }),
      }))
    );
  };

  // Quick Add Anime Handler con Nota Personal
  const handleQuickAddAnime = (
    anime: ExtendedAnime,
    status: "vistos" | "viendo" | "pendientes" | "favoritos",
    assignedUserScore = 10
  ) => {
    if (allUserMalIds.includes(anime.malId)) return;

    const newItem: PersonalItem = {
      malId: anime.malId,
      title: anime.title,
      imageUrl: anime.imageUrl,
      score: assignedUserScore,
      userScore: assignedUserScore,
      malScore: anime.score,
      episodesWatched: status === "vistos" ? anime.episodes : 0,
      totalEpisodes: anime.episodes,
      statusCategory: status,
      notes: "Agregado mediante buscador rápido.",
      studio: anime.studio,
      genres: anime.genres,
      synopsis: anime.synopsis,
      type: anime.status === "Película" ? "Película" : "TV",
      tags: [],
    };
    setUserItems((prev) => [newItem, ...prev]);
  };

  // Create New Folder Handler
  const handleCreateFolder = (folderTitle: string) => {
    const newFolder: PersonalFolder = {
      id: `folder-${Date.now()}`,
      title: folderTitle,
      createdAt: new Date().toISOString(),
      animes: [],
    };
    setFolders((prev) => [newFolder, ...prev]);
  };

  // Save Edited Folder Handler
  const handleSaveEditedFolder = (updatedFolder: PersonalFolder) => {
    const folderMalIds = updatedFolder.animes.map((a) => a.malId);
    setUserItems((prev) => prev.filter((u) => !folderMalIds.includes(u.malId)));
    setFolders((prev) => prev.map((f) => (f.id === updatedFolder.id ? updatedFolder : f)));
    setEditingFolderModal(null);
  };

  // Remove Folder Handler
  const handleRemoveFolder = (folderId: string) => {
    const targetFolder = folders.find((f) => f.id === folderId);
    if (!targetFolder) return;

    if (targetFolder.animes.length > 0) {
      setUserItems((prev) => [...targetFolder.animes, ...prev]);
    }
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
  };

  // Add Anime to Folder Handler
  const handleAddAnimeToFolder = (folderId: string, anime: ExtendedAnime) => {
    const newItem: PersonalItem = {
      malId: anime.malId,
      title: anime.title,
      imageUrl: anime.imageUrl,
      score: 10,
      userScore: 10,
      malScore: anime.score,
      episodesWatched: anime.episodes,
      totalEpisodes: anime.episodes,
      statusCategory: "vistos",
      notes: "Agregado a la carpeta saga.",
      studio: anime.studio,
      genres: anime.genres,
      synopsis: anime.synopsis,
      type: anime.status === "Película" ? "Película" : "TV",
      tags: [],
    };

    setUserItems((prev) => prev.filter((u) => u.malId !== anime.malId));

    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === folderId) {
          if (f.animes.some((a) => a.malId === anime.malId)) return f;
          return { ...f, animes: [...f.animes, newItem] };
        }
        return f;
      })
    );
  };

  // Move loose anime to folder
  const handleMoveLooseAnimeToFolder = (looseItem: PersonalItem, targetFolderId: string) => {
    setUserItems((prev) => prev.filter((u) => u.malId !== looseItem.malId));
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === targetFolderId) {
          return { ...f, animes: [...f.animes, looseItem] };
        }
        return f;
      })
    );
    setOpenMoveDropdownId(null);
  };

  // Remove anime from folder back to loose userItems
  const handleRemoveAnimeFromFolder = (folderId: string, malId: number) => {
    let extractedAnime: PersonalItem | undefined;

    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === folderId) {
          extractedAnime = f.animes.find((a) => a.malId === malId);
          return { ...f, animes: f.animes.filter((a) => a.malId !== malId) };
        }
        return f;
      })
    );

    if (extractedAnime) {
      setUserItems((prev) => [extractedAnime!, ...prev]);
    }
  };

  // Simulation: Import Batch Recommendation
  const handleSimulateImportBatchRecommendation = () => {
    const demoBatchFolder: PersonalFolder = {
      id: `folder-imported-${Date.now()}`,
      title: "Saga Monogatari (Recomendada en Lote)",
      createdAt: new Date().toISOString(),
      animes: [
        {
          malId: 52991,
          title: "Frieren: Beyond Journey's End",
          imageUrl: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg",
          score: 10,
          userScore: 10,
          malScore: 9.1,
          episodesWatched: 28,
          totalEpisodes: 28,
          statusCategory: "vistos",
          studio: "Madhouse",
          genres: ["Fantasía"],
          synopsis: "La elfa Frieren reflexiona sobre la inmortalidad.",
          type: "TV",
        },
      ],
    };

    const demoLooseAnime: PersonalItem = {
      malId: 40028,
      title: "Attack on Titan Final Season",
      imageUrl: "https://cdn.myanimelist.net/images/anime/1000/110531.jpg",
      score: 9.0,
      userScore: 9.0,
      malScore: 8.91,
      episodesWatched: 0,
      totalEpisodes: 16,
      statusCategory: "pendientes",
      studio: "MAPPA",
      genres: ["Acción"],
      synopsis: "La lucha por la supervivencia de la humanidad alcanza una escala global.",
      type: "TV",
    };

    const relocated: string[] = [];
    demoBatchFolder.animes.forEach((a) => {
      const existsInLoose = userItems.some((u) => u.malId === a.malId);
      const existsInFolders = folders.some((f) => f.animes.some((fa) => fa.malId === a.malId));
      if (existsInLoose || existsInFolders) {
        relocated.push(a.title);
      }
    });

    setPendingImportBatch({
      senderName: "Sofía Martínez",
      note: "Te envié esta selección especial de sagas y animes recomendados de los 2010s.",
      folders: [demoBatchFolder],
      looseAnimes: [demoLooseAnime],
      skippedWatchedTitles: [],
      relocatedAnimeTitles: relocated,
    });
  };

  const handleConfirmImportBatch = () => {
    if (!pendingImportBatch) return;

    const importedFolderMalIds = pendingImportBatch.folders.flatMap((f) => f.animes.map((a) => a.malId));

    setUserItems((prev) => prev.filter((u) => !importedFolderMalIds.includes(u.malId)));
    setFolders((prev) =>
      prev.map((f) => ({
        ...f,
        animes: f.animes.filter((a) => !importedFolderMalIds.includes(a.malId)),
      }))
    );

    setFolders((prev) => [...pendingImportBatch.folders, ...prev]);
    setUserItems((prev) => [...pendingImportBatch.looseAnimes, ...prev]);

    setPendingImportBatch(null);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setSelectedGenre("all");
    setSelectedStudio("all");
    setSelectedType("all");
    setSelectedYear("all");
    setActiveTagFilterId(null);
    setSortBy("userScore");
  };

  // UNIFIED STREAM FILTERING & SORTING BY USER SCORE OR MAL SCORE
  const term = searchQuery.trim().toLowerCase();

  const matchesYearCriteria = (yearNum?: number) => {
    if (selectedYear === "all") return true;
    const yr = yearNum || 2020;
    if (selectedYear === "2020") return yr >= 2020;
    if (selectedYear === "2010") return yr >= 2010;
    if (selectedYear === "2000") return yr >= 2000 && yr < 2010;
    if (selectedYear === "classic") return yr < 2000;
    return true;
  };

  const filteredLooseAnimes = userItems.filter((anime) => {
    const matchesCategory = activeCategory === "all" || anime.statusCategory === activeCategory;
    const matchesSearch =
      !term ||
      anime.title.toLowerCase().includes(term) ||
      anime.studio.toLowerCase().includes(term) ||
      (anime.notes && anime.notes.toLowerCase().includes(term));
    const matchesGenre = selectedGenre === "all" || anime.genres.includes(selectedGenre);
    const matchesStudio = selectedStudio === "all" || anime.studio.toLowerCase() === selectedStudio.toLowerCase();
    const matchesType = selectedType === "all" || (anime.type || "TV") === selectedType;
    const matchesYear = matchesYearCriteria(2021);
    const matchesTag = !activeTagFilterId || (anime.tags && anime.tags.includes(activeTagFilterId));

    return matchesCategory && matchesSearch && matchesGenre && matchesStudio && matchesType && matchesYear && matchesTag;
  });

  const filteredFolders = folders.filter((folder) => {
    if (folder.animes.length === 0) {
      const matchesTitle = !term || folder.title.toLowerCase().includes(term);
      return (
        matchesTitle &&
        selectedGenre === "all" &&
        selectedStudio === "all" &&
        selectedType === "all" &&
        selectedYear === "all" &&
        activeCategory === "all" &&
        !activeTagFilterId
      );
    }

    return folder.animes.some((anime) => {
      const matchesCategory = activeCategory === "all" || anime.statusCategory === activeCategory;
      const matchesSearch =
        !term ||
        folder.title.toLowerCase().includes(term) ||
        anime.title.toLowerCase().includes(term) ||
        anime.studio.toLowerCase().includes(term);
      const matchesGenre = selectedGenre === "all" || anime.genres.includes(selectedGenre);
      const matchesStudio = selectedStudio === "all" || anime.studio.toLowerCase() === selectedStudio.toLowerCase();
      const matchesType = selectedType === "all" || (anime.type || "TV") === selectedType;
      const matchesYear = matchesYearCriteria(2021);
      const matchesTag = !activeTagFilterId || (anime.tags && anime.tags.includes(activeTagFilterId));

      return matchesCategory && matchesSearch && matchesGenre && matchesStudio && matchesType && matchesYear && matchesTag;
    });
  });

  // Construcción del Stream Unificado calculando el Promedio de Nota Personal y MAL para las Carpetas
  const unifiedStream: ListItemType[] = [
    ...filteredFolders.map((f) => {
      const avgUserScore =
        f.animes.length > 0
          ? f.animes.reduce((acc, a) => acc + (a.userScore || a.score || 0), 0) / f.animes.length
          : 0;

      const avgMalScore =
        f.animes.length > 0
          ? f.animes.reduce((acc, a) => acc + (a.malScore || a.score || 0), 0) / f.animes.length
          : 0;

      const totEpisodes = f.animes.reduce((acc, a) => acc + a.totalEpisodes, 0);

      return {
        kind: "folder" as const,
        id: f.id,
        data: f,
        sortUserScore: avgUserScore,
        sortMalScore: avgMalScore,
        sortEpisodes: totEpisodes,
        sortName: f.title,
      };
    }),
    ...filteredLooseAnimes.map((a) => ({
      kind: "anime" as const,
      id: `anime-${a.malId}`,
      data: a,
      sortUserScore: a.userScore || a.score || 0,
      sortMalScore: a.malScore || a.score || 0,
      sortEpisodes: a.totalEpisodes,
      sortName: a.title,
    })),
  ];

  // Ordenamiento por Puntuación Personal (Por Defecto) o MAL / Capítulos / Nombre
  if (sortBy === "userScore") {
    unifiedStream.sort((a, b) => b.sortUserScore - a.sortUserScore);
  } else if (sortBy === "userScoreAsc") {
    unifiedStream.sort((a, b) => a.sortUserScore - b.sortUserScore);
  } else if (sortBy === "malScore") {
    unifiedStream.sort((a, b) => b.sortMalScore - a.sortMalScore);
  } else if (sortBy === "episodes") {
    unifiedStream.sort((a, b) => b.sortEpisodes - a.sortEpisodes);
  } else if (sortBy === "name") {
    unifiedStream.sort((a, b) => a.sortName.localeCompare(b.sortName));
  }

  const totalAnimeCountInAccount = userItems.length + folders.reduce((acc, f) => acc + f.animes.length, 0);

  // Detección de Género Dominante para Tema Dinámico
  const genreCounts: Record<string, number> = {};
  userItems.forEach((item) => {
    item.genres.forEach((g) => {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
  });
  folders.forEach((f) => {
    f.animes.forEach((item) => {
      item.genres.forEach((g) => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });
  });

  let detectedTopGenre = "Default";
  let maxGenreCount = 0;
  Object.entries(genreCounts).forEach(([g, count]) => {
    if (count > maxGenreCount) {
      maxGenreCount = count;
      detectedTopGenre = g;
    }
  });

  const activeGenreTheme = theme;

  const filterSummaryParts = [];
  if (selectedGenre !== "all") filterSummaryParts.push(`Género: ${selectedGenre}`);
  if (selectedStudio !== "all") filterSummaryParts.push(`Estudio: ${selectedStudio}`);
  if (selectedType !== "all") filterSummaryParts.push(`Tipo: ${selectedType}`);
  if (selectedYear !== "all") filterSummaryParts.push(`Año: ${selectedYear}`);
  if (activeCategory !== "all") filterSummaryParts.push(`Estado: ${activeCategory}`);
  const filterSummaryText = filterSummaryParts.length > 0 ? filterSummaryParts.join(", ") : "Sin filtros aplicados";

  return (
    <div className="min-h-screen flex flex-col text-slate-100 relative overflow-hidden transition-colors duration-500 bg-transparent">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        {/* Header Banner estilo Glass Opaco con Glowing Border */}
        <div className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 ${activeGenreTheme.panelBgClass} ${activeGenreTheme.borderClass} flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative`}>
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[11px] font-black px-3.5 py-1 rounded-full border flex items-center gap-1.5 shadow-lg ${activeGenreTheme.badgeClass}`}>
                <Sparkles className="w-3.5 h-3.5" /> Tema Dinámico: {activeGenreTheme.emoji} {activeGenreTheme.name}
              </span>
              <span className="text-[11px] text-gray-300 bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                Género Dominante: <strong className="text-white">{detectedTopGenre === "Default" ? "Equilibrado" : detectedTopGenre}</strong>
              </span>
            </div>

            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <List className={`w-8 h-8 ${activeGenreTheme.accentClass}`} /> Mi Lista Personal
            </h1>
            <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
              Organiza tus animes por tu <strong className="text-amber-400">Puntuación Personal (1-10)</strong> y agrupa sagas en carpetas con promedio automático estilo MyAnimeList.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Selector Manual de Tema Dinámico */}
            <div className="flex items-center gap-2 bg-black/70 px-3.5 py-2 rounded-2xl border border-white/15 backdrop-blur-md shadow-lg">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Acento Tema:</span>
              <select
                value={manualTheme}
                onChange={(e) => setManualTheme(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1"
              >
                <option value="auto" className="bg-slate-900 text-white">✨ Automático (por género)</option>
                <option value="RomanceYuri" className="bg-slate-900 text-pink-300">🌸 Romance Yuri (Cards Rosas)</option>
                <option value="RomanceYaoi" className="bg-slate-900 text-rose-300">🖤 Romance Yaoi (Cards Negras)</option>
                <option value="Acción" className="bg-slate-900 text-red-300">🔥 Acción (Rojo Fuego)</option>
                <option value="Sci-Fi" className="bg-slate-900 text-cyan-300">⚡ Sci-Fi (Cian Neón)</option>
                <option value="Fantasía" className="bg-slate-900 text-purple-300">🔮 Fantasía (Púrpura Místico)</option>
                <option value="Slice of Life" className="bg-slate-900 text-emerald-300">🌿 Slice of Life (Verde Menta)</option>
                <option value="Comedia" className="bg-slate-900 text-amber-300">✨ Comedia (Amarillo Dorado)</option>
                <option value="Terror" className="bg-slate-900 text-rose-400">👁️ Terror (Carmesí Noche)</option>
                <option value="Drama" className="bg-slate-900 text-slate-300">🌧️ Drama (Ciudad Noir)</option>
                <option value="Deportes" className="bg-slate-900 text-orange-400">⚽ Deportes (Estadio Naranja)</option>
              </select>
            </div>

            <button
              onClick={handleSimulateImportBatchRecommendation}
              className={`px-4 py-2.5 rounded-2xl ${activeGenreTheme.buttonClass} text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer`}
              title="Probar importación de una selección recomendada recibida"
            >
              <Send className="w-4 h-4" /> Probar Importar Selección
            </button>
            <span className="text-xs font-bold text-gray-200 bg-black/60 px-3.5 py-2.5 rounded-2xl border border-white/10 flex items-center justify-center gap-2 shrink-0 backdrop-blur-md">
              <Layers className="w-4 h-4 text-purple-400" /> Colección:{" "}
              <span className="text-emerald-400 font-extrabold">{totalAnimeCountInAccount}</span>
            </span>
          </div>
        </div>

        {/* 1. BARRA DE BÚSQUEDA Y FILTROS INTEGRADOS */}
        <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-gray-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar en Mi Lista o carpetas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 text-xs text-white placeholder-gray-400 pl-10 pr-4 py-2.5 rounded-xl border border-gray-700/80 focus:outline-none focus:border-emerald-500 shadow-inner"
              />
            </div>

            {unifiedStream.length > 0 && (
              <button
                onClick={() => setIsRecommendBatchOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto cursor-pointer"
                title="Recomendar a un amigo todos los animes y carpetas de la selección actual"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" /> Recomendar Selección
              </button>
            )}
          </div>

          {/* Grid de Selectores de Filtros Avanzados (con Ordenar por Nota Personal) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-gray-900/60 p-3.5 rounded-2xl border border-gray-800/80">
            {/* Ordenar Por (Por Defecto: Nota Personal) */}
            <div className="lg:col-span-1">
              <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                Ordenar Por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-2 text-xs text-amber-300 font-extrabold focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="userScore">🌟 Tu Nota Personal (Mayor a Menor)</option>
                <option value="userScoreAsc">🌟 Tu Nota Personal (Menor a Mayor)</option>
                <option value="malScore">🌐 Nota Global MAL (Mayor a Menor)</option>
                <option value="episodes">🎬 Duración (# Capítulos)</option>
                <option value="name">🔤 Nombre A-Z</option>
              </select>
            </div>

            {/* Filtro Año de Estreno */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Año de Estreno
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-slate-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Todos los Años</option>
                <option value="2020">2020 en adelante (2020+)</option>
                <option value="2010">2010 en adelante (2010+)</option>
                <option value="2000">Década 2000 - 2009</option>
                <option value="classic">Clásicos (&lt; 2000)</option>
              </select>
            </div>

            {/* Filtro Estudio */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Estudio
              </label>
              <select
                value={selectedStudio}
                onChange={(e) => setSelectedStudio(e.target.value)}
                className="w-full bg-slate-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Todos los Estudios</option>
                {MOCK_STUDIOS.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro Medio / Formato */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Medio / Formato
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-slate-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Todos los Medios</option>
                <option value="TV">Serie de TV</option>
                <option value="Película">Película</option>
                <option value="OVA">OVA</option>
                <option value="ONA">ONA</option>
              </select>
            </div>

            {/* Filtro Género */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Género
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full bg-slate-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Todos los Géneros</option>
                <option value="Fantasía">Fantasía</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Acción">Acción</option>
                <option value="Suspenso">Suspenso</option>
                <option value="Isekai">Isekai</option>
                <option value="Drama">Drama</option>
                <option value="Romance">Romance</option>
              </select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-800/80 pt-3">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "Todos los animes", count: totalAnimeCountInAccount, color: "text-gray-300" },
                { id: "vistos", label: "Vistos", icon: CheckCircle, count: userItems.filter((i) => i.statusCategory === "vistos").length, color: "text-emerald-400" },
                { id: "viendo", label: "Viendo Actualmente", icon: Eye, count: userItems.filter((i) => i.statusCategory === "viendo").length, color: "text-cyan-400" },
                { id: "pendientes", label: "Pendientes", icon: Clock, count: userItems.filter((i) => i.statusCategory === "pendientes").length, color: "text-amber-400" },
                { id: "favoritos", label: "Favoritos", icon: Heart, count: userItems.filter((i) => i.statusCategory === "favoritos").length, color: "text-purple-400" },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isActive
                        ? "bg-gray-800 text-white border-emerald-500 shadow-md"
                        : "bg-gray-900/60 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    {Icon && <Icon className={`w-3.5 h-3.5 ${tab.color}`} />}
                    <span>{tab.label}</span>
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-950 border border-gray-800 font-extrabold">
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {(searchQuery || selectedGenre !== "all" || selectedStudio !== "all" || selectedType !== "all" || selectedYear !== "all" || activeCategory !== "all" || activeTagFilterId) && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1 bg-gray-900 px-3 py-1.5 rounded-xl border border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Limpiar Filtros
              </button>
            )}
          </div>
        </div>

        {/* 2. STREAM UNIFICADO DE ANIME & CARPETAS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {unifiedStream.length > 0 ? (
              unifiedStream.map((item) => {
                if (item.kind === "folder") {
                  return (
                    <FolderCard
                      key={item.id}
                      folder={item.data}
                      onEditFolder={(f) => setEditingFolderModal(f)}
                      onRecommendFolder={(f) => setRecommendingFolderModal(f)}
                      onRemoveFolder={handleRemoveFolder}
                      onRemoveAnimeFromFolder={handleRemoveAnimeFromFolder}
                      onAddAnimeToFolder={handleAddAnimeToFolder}
                      onSelectAnimeModal={(anime) => setSelectedAnimeModal(anime)}
                      onUpdateAnimeUserScore={handleUpdateAnimeUserScore}
                    />
                  );
                }

                // Loose Anime Item Card
                const anime = item.data;
                const scoreStyle = getScoreBadgeStyle(anime.userScore || anime.score || 10);

                return (
                  <div
                    key={item.id}
                    className="glass-card p-5 rounded-3xl border border-gray-800 hover:border-emerald-500/50 transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center group shadow-lg hover:shadow-emerald-950/20 relative"
                  >
                    <img
                      src={anime.imageUrl}
                      alt={anime.title}
                      className="w-24 h-32 object-cover rounded-2xl border border-gray-700 shrink-0 group-hover:scale-105 transition-transform cursor-pointer"
                      onClick={() => {
                        const full = MOCK_TOP_ANIMES.find((a) => a.malId === anime.malId);
                        if (full) setSelectedAnimeModal(full);
                      }}
                    />

                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
                        <div
                          className="cursor-pointer min-w-0"
                          onClick={() => {
                            const full = MOCK_TOP_ANIMES.find((a) => a.malId === anime.malId);
                            if (full) setSelectedAnimeModal(full);
                          }}
                        >
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-gray-700 text-purple-300">
                              {anime.type || "TV"}
                            </span>
                            <span className="text-[11px] text-gray-400 flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-purple-400" /> {anime.studio}
                            </span>
                          </div>
                          <h3 className="text-base font-extrabold text-white group-hover:text-emerald-300 line-clamp-1 transition-colors">
                            {anime.title}
                          </h3>
                        </div>

                        {/* Editor de Nota Personal estilo MAL con Código de Colores */}
                        <div className="flex items-center gap-1.5 shrink-0 bg-slate-950 p-1.5 rounded-2xl border border-gray-800">
                          <span className="text-[11px] text-gray-400 font-extrabold flex items-center gap-1 pl-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Tu Nota:
                          </span>
                          <select
                            value={anime.userScore || anime.score || 10}
                            onChange={(e) => handleUpdateAnimeUserScore(anime.malId, parseFloat(e.target.value))}
                            className={`font-black text-xs px-2.5 py-1 rounded-xl focus:outline-none cursor-pointer ${scoreStyle.badgeClass}`}
                            title="Cambiar tu nota personal (1 a 10)"
                          >
                            {MAL_SCORE_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value} className="bg-slate-900 text-white font-semibold">
                                {opt.value} - {opt.shortLabel}
                              </option>
                            ))}
                          </select>

                          <span className="text-[11px] font-semibold text-gray-400 px-2 py-1 rounded-xl bg-gray-900 border border-gray-800 hidden sm:inline">
                            🌐 {anime.malScore || anime.score} MAL
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 flex-wrap text-xs text-gray-400">
                        <span>
                          Episodios: <strong className="text-white">{anime.episodesWatched} / {anime.totalEpisodes}</strong>
                        </span>
                        <span className="capitalize px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 border border-gray-700 text-emerald-400">
                          {anime.statusCategory}
                        </span>

                        <div className="flex items-center gap-2">
                          {/* Asignar Tag Selector */}
                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenTagAssignId(openTagAssignId === anime.malId ? null : anime.malId)
                              }
                              className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-800 text-cyan-300 hover:text-white text-[10px] font-bold border border-cyan-700/50 flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <TagIcon className="w-3 h-3" /> + Tag
                            </button>

                            {openTagAssignId === anime.malId && (
                              <div className="absolute right-0 top-full mt-1 bg-[#0F172A] border border-cyan-500/50 rounded-xl shadow-2xl z-40 p-2 w-48 space-y-1">
                                <p className="text-[10px] font-bold text-cyan-400 px-2 py-1 uppercase">Asignar Tags</p>
                                {userTags.map((t) => {
                                  const hasThisTag = anime.tags && anime.tags.includes(t.id);
                                  return (
                                    <button
                                      key={t.id}
                                      onClick={() => handleToggleTagOnAnime(anime.malId, t.id)}
                                      className={`w-full text-left px-2 py-1 rounded-lg text-xs font-bold flex items-center justify-between cursor-pointer ${
                                        hasThisTag ? "bg-cyan-900/60 text-white" : "text-gray-300 hover:bg-slate-800"
                                      }`}
                                    >
                                      <span>{t.name}</span>
                                      {hasThisTag && <Sparkles className="w-3 h-3 text-cyan-300" />}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Mover a carpeta selector */}
                          {folders.length > 0 && (
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setOpenMoveDropdownId(openMoveDropdownId === anime.malId ? null : anime.malId)
                                }
                                className="px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-800 text-purple-300 hover:text-white text-[10px] font-bold border border-purple-700/50 flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <FolderPlus className="w-3 h-3" /> Mover a carpeta... <ChevronDown className="w-3 h-3" />
                              </button>

                              {openMoveDropdownId === anime.malId && (
                                <div className="absolute right-0 top-full mt-1 bg-[#0F172A] border border-purple-500/50 rounded-xl shadow-2xl z-40 p-2 w-48 space-y-1">
                                  <p className="text-[10px] font-bold text-purple-400 px-2 py-1 uppercase">Selecciona Carpeta</p>
                                  {folders.map((f) => (
                                    <button
                                      key={f.id}
                                      onClick={() => handleMoveLooseAnimeToFolder(anime, f.id)}
                                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-bold text-white hover:bg-purple-900/50 truncate flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <Folder className="w-3.5 h-3.5 text-purple-400" /> {f.title}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {anime.tags && anime.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          {anime.tags.map((tId) => {
                            const tagObj = userTags.find((t) => t.id === tId);
                            if (!tagObj) return null;
                            return (
                              <span
                                key={tId}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${tagObj.color}`}
                              >
                                {tagObj.name}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {anime.notes && (
                        <p className="bg-slate-950/80 p-2.5 rounded-xl border border-gray-800 text-xs text-gray-300 italic line-clamp-2">
                          "{anime.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="glass-panel p-12 rounded-3xl border border-gray-800 text-center space-y-3">
                <p className="text-gray-400 text-sm">No se encontraron resultados con los filtros aplicados.</p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Restablecer Filtros
                </button>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: SIDEBAR CON QUICK ADD WIDGET + TAG MANAGER WIDGET + RECOMENDADOS */}
          <div className="sticky top-24 space-y-4">
            <QuickAddAnimeWidget
              onAddAnime={handleQuickAddAnime}
              onCreateFolder={handleCreateFolder}
            />

            <TagManagerWidget
              tags={userTags}
              activeTagId={activeTagFilterId}
              tagAnimeCounts={tagAnimeCounts}
              onSelectTag={(tagId) => setActiveTagFilterId(tagId)}
              onCreateTag={handleCreateTag}
              onRenameTag={handleRenameTag}
              onDeleteTag={handleDeleteTag}
            />

            <div className="glass-panel p-5 rounded-3xl border border-purple-500/40 shadow-2xl space-y-4 bg-[#0F172A]">
              <div className="border-b border-gray-800 pb-3">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" /> Animes Recomendados
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Sugerencias personalizadas para agregar a tu lista con un clic.
                </p>
              </div>

              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                {recommendedSideList.map((anime) => (
                  <div
                    key={anime.malId}
                    className="p-2.5 rounded-2xl bg-slate-900/90 border border-gray-800/80 hover:border-purple-500/40 flex items-center gap-3 transition-all group"
                  >
                    <img
                      src={anime.imageUrl}
                      alt={anime.title}
                      className="w-12 h-16 object-cover rounded-xl border border-gray-700 shrink-0 cursor-pointer"
                      onClick={() => setSelectedAnimeModal(anime)}
                    />

                    <div className="flex-1 min-w-0">
                      <h4
                        onClick={() => setSelectedAnimeModal(anime)}
                        className="text-xs font-bold text-white group-hover:text-purple-300 truncate cursor-pointer"
                      >
                        {anime.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {anime.score} • {anime.studio}
                      </p>

                      <button
                        onClick={() => handleQuickAddAnime(anime, "pendientes")}
                        className="mt-1 px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white rounded-lg text-[10px] font-bold border border-purple-500/40 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Agregar a Mi Lista
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modales Existentes */}
      {selectedAnimeModal && (
        <AnimeDetailModal
          anime={selectedAnimeModal}
          onClose={() => setSelectedAnimeModal(null)}
        />
      )}

      {editingFolderModal && (
        <EditFolderModal
          folder={editingFolderModal}
          onClose={() => setEditingFolderModal(null)}
          onSave={handleSaveEditedFolder}
        />
      )}

      {recommendingFolderModal && (
        <RecommendFolderModal
          folder={recommendingFolderModal}
          onClose={() => setRecommendingFolderModal(null)}
          onSend={(friendId, note) => {
            console.log("Recomendación de carpeta enviada a", friendId, note);
          }}
        />
      )}

      {isRecommendBatchOpen && (
        <RecommendBatchModal
          filterSummary={filterSummaryText}
          matchingFolders={filteredFolders}
          matchingLooseAnimes={filteredLooseAnimes}
          onClose={() => setIsRecommendBatchOpen(false)}
          onSend={(friendId, note) => {
            console.log("Recomendación en lote enviada a", friendId, note);
          }}
        />
      )}

      {pendingImportBatch && (
        <ImportBatchConfirmationModal
          senderName={pendingImportBatch.senderName}
          note={pendingImportBatch.note}
          recommendedFolders={pendingImportBatch.folders}
          recommendedLooseAnimes={pendingImportBatch.looseAnimes}
          skippedWatchedTitles={pendingImportBatch.skippedWatchedTitles}
          relocatedAnimeTitles={pendingImportBatch.relocatedAnimeTitles}
          onConfirm={handleConfirmImportBatch}
          onCancel={() => setPendingImportBatch(null)}
        />
      )}
    </div>
  );
}

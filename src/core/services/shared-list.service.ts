/**
 * @file shared-list.service.ts
 * @description Capa de Servicio para la gestión de Listas Compartidas (grupales),
 * invitaciones por enlace, inclusión de usuarios invitados (guests) y votación en tiempo real.
 */

import { createClient as createBrowserClient } from "../supabase/client";
import { calculateHappinessScore, HappinessScoreResult } from "../algorithms/happiness-score";

export interface SharedListDetail {
  id: string;
  name: string;
  description: string | null;
  status: string;
  inviteCode: string;
  createdBy: string | null;
  createdAt: string;
}

export interface CandidateWithScores {
  candidateId: string;
  malId: number;
  title: string;
  imageUrl: string;
  malScore: number | null;
  malScoredBy: number | null;
  episodes: number | null;
  suggestedBy: string;
  happinessResult: HappinessScoreResult;
  userVotes: Record<string, number>; // voterId -> score
}

/**
 * Crea una nueva lista compartida.
 * 
 * @param name Nombre del grupo o evento (ej. "Anime de los Viernes")
 * @param description Descripción opcional
 * @param createdByUserId ID del usuario creador (si está registrado)
 */
export async function createSharedList(name: string, description?: string, createdByUserId?: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from("shared_lists")
    .insert({
      name,
      description: description || null,
      created_by: createdByUserId || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error al crear lista compartida:", error);
    throw new Error("No se pudo crear la lista compartida.");
  }

  // Si fue creada por un usuario registrado, agregarlo automáticamente como owner
  if (createdByUserId && data) {
    await supabase.from("shared_list_members").insert({
      shared_list_id: data.id,
      user_id: createdByUserId,
      role: "owner",
    });
  }

  return data;
}

/**
 * Obtiene la información básica de una lista compartida por su enlace/código de invitación.
 */
export async function getSharedListByInviteCode(inviteCode: string): Promise<SharedListDetail | null> {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from("shared_lists")
    .select("*")
    .eq("invite_code", inviteCode)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    status: data.status,
    inviteCode: data.invite_code,
    createdBy: data.created_by,
    createdAt: data.created_at,
  };
}

/**
 * Une a un usuario invitado (Guest sin cuenta) a una lista compartida mediante token.
 */
export async function joinAsGuest(sharedListId: string, guestName: string, guestToken: string) {
  const supabase = createBrowserClient();

  // Verificar si ya existe como miembro
  const { data: existing } = await supabase
    .from("shared_list_members")
    .select("*")
    .eq("shared_list_id", sharedListId)
    .eq("guest_token", guestToken)
    .maybeSingle();

  if (existing) {
    return existing;
  }

  const { data, error } = await supabase
    .from("shared_list_members")
    .insert({
      shared_list_id: sharedListId,
      guest_token: guestToken,
      guest_name: guestName,
      role: "guest",
    })
    .select()
    .single();

  if (error) {
    console.error("Error al unirse como invitado:", error);
    throw error;
  }

  return data;
}

/**
 * Agrega un anime como candidato a la lista compartida.
 */
export async function addCandidate(sharedListId: string, malId: number, userId?: string, guestToken?: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from("shared_list_candidates")
    .insert({
      shared_list_id: sharedListId,
      mal_id: malId,
      suggested_by_user_id: userId || null,
      suggested_by_guest_token: guestToken || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error postulando candidato:", error);
    throw new Error("Este anime ya ha sido postulado o no se pudo agregar.");
  }

  return data;
}

/**
 * Registra o actualiza el voto (0 a 10) de un integrante para un candidato.
 */
export async function castVote(candidateId: string, score: number, userId?: string, guestToken?: string) {
  const supabase = createBrowserClient();

  const votePayload = {
    candidate_id: candidateId,
    voter_user_id: userId || null,
    voter_guest_token: guestToken || null,
    interest_score: score,
    updated_at: new Date().toISOString(),
  };

  // Consultar si ya votó
  let query = supabase.from("shared_list_votes").select("id").eq("candidate_id", candidateId);
  if (userId) {
    query = query.eq("voter_user_id", userId);
  } else if (guestToken) {
    query = query.eq("voter_guest_token", guestToken);
  }

  const { data: existing } = await query.maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("shared_list_votes")
      .update({ interest_score: score, updated_at: new Date().toISOString() })
      .eq("id", existing.id);

    if (error) throw error;
  } else {
    const { error } = await supabase.from("shared_list_votes").insert(votePayload);
    if (error) throw error;
  }
}

/**
 * Obtiene los candidatos postulados en una lista compartida con sus scores de felicidad calculados en tiempo real.
 */
export async function getCandidatesWithRanking(sharedListId: string): Promise<CandidateWithScores[]> {
  const supabase = createBrowserClient();

  // Obtener miembros para mapear nombres
  const { data: members } = await supabase
    .from("shared_list_members")
    .select("id, user_id, guest_token, guest_name, profiles(display_name)")
    .eq("shared_list_id", sharedListId);

  const memberNames: Record<string, string> = {};
  if (members) {
    members.forEach((m) => {
      const idKey = m.user_id || m.guest_token || m.id;
      const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
      const name = (profile as any)?.display_name || m.guest_name || "Invitado";
      memberNames[idKey] = name;
    });
  }

  // Obtener candidatos e información de caché
  const { data: candidates } = await supabase
    .from("shared_list_candidates")
    .select("id, mal_id, suggested_by_user_id, suggested_by_guest_token, anime_cache(*)")
    .eq("shared_list_id", sharedListId);

  if (!candidates || candidates.length === 0) {
    return [];
  }

  const candidateIds = candidates.map((c) => c.id);

  // Obtener votos
  const { data: votes } = await supabase
    .from("shared_list_votes")
    .select("*")
    .in("candidate_id", candidateIds);

  const votesByCandidate: Record<string, any[]> = {};
  if (votes) {
    votes.forEach((v) => {
      if (!votesByCandidate[v.candidate_id]) {
        votesByCandidate[v.candidate_id] = [];
      }
      votesByCandidate[v.candidate_id].push(v);
    });
  }

  // Calcular Algoritmo de Felicidad por cada candidato
  const results: CandidateWithScores[] = candidates.map((cand) => {
    const anime = cand.anime_cache as any;
    const candVotes = votesByCandidate[cand.id] || [];

    const formattedVotes = candVotes.map((v) => {
      const voterId = v.voter_user_id || v.voter_guest_token || "unknown";
      return {
        voterId,
        voterName: memberNames[voterId] || "Integrante",
        interestScore: v.interest_score,
      };
    });

    const userVotesMap: Record<string, number> = {};
    candVotes.forEach((v) => {
      const voterId = v.voter_user_id || v.voter_guest_token;
      if (voterId) {
        userVotesMap[voterId] = v.interest_score;
      }
    });

    const happinessResult = calculateHappinessScore({
      malId: cand.mal_id,
      title: anime?.title || `Anime #${cand.mal_id}`,
      malScore: anime?.score ? Number(anime.score) : null,
      malScoredBy: anime?.scored_by || null,
      votes: formattedVotes,
    });

    const suggestedByKey = cand.suggested_by_user_id || cand.suggested_by_guest_token || "";
    const suggestedByName = memberNames[suggestedByKey] || "Un integrante";

    return {
      candidateId: cand.id,
      malId: cand.mal_id,
      title: anime?.title || `Anime #${cand.mal_id}`,
      imageUrl: anime?.image_url || "/placeholder-anime.png",
      malScore: anime?.score ? Number(anime.score) : null,
      malScoredBy: anime?.scored_by || null,
      episodes: anime?.episodes || null,
      suggestedBy: suggestedByName,
      happinessResult,
      userVotes: userVotesMap,
    };
  });

  // Ordenar por score de felicidad descendente
  return results.sort((a, b) => b.happinessResult.finalScore - a.happinessResult.finalScore);
}

export interface SharedListOverview {
  id: string;
  name: string;
  status: string;
  membersCount: number;
  topCandidate: {
    title: string;
    happinessScore: number;
    imageUrl?: string;
  } | null;
  unvotedCandidatesCount: number; // Cantidad de animes postulados en los que el usuario aún no ha votado
  inviteCode: string;
}

export const DEMO_USER_ID = "demo-user-1";

/**
 * Obtiene un resumen de las listas compartidas activas del usuario, incluyendo el ganador y la cantidad de candidatos pendientes por votar.
 * Aislado: Para el usuario demo devuelve los 3 grupos de muestra; para usuarios reales consulta sus listas o devuelve [].
 */
export async function getUserSharedListsOverview(userId: string = DEMO_USER_ID): Promise<SharedListOverview[]> {
  // Aislamiento: Contenido mock enriquecido solo para la cuenta demo
  if (userId === DEMO_USER_ID) {
    return [
      {
        id: "demo-list-1",
        name: "Anime de los Viernes 🍿",
        status: "Votación en curso",
        membersCount: 4,
        topCandidate: {
          title: "Frieren: Beyond Journey's End",
          happinessScore: 9.4,
          imageUrl: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg",
        },
        unvotedCandidatesCount: 2, // 2 animes sin votar -> activa advertencia
        inviteCode: "viernes2026",
      },
      {
        id: "demo-list-2",
        name: "Maratón Vacaciones 🌴",
        status: "Candidatos abiertos",
        membersCount: 3,
        topCandidate: {
          title: "Steins;Gate",
          happinessScore: 8.8,
          imageUrl: "https://cdn.myanimelist.net/images/anime/1935/127974.jpg",
        },
        unvotedCandidatesCount: 0, // 0 animes sin votar -> al día
        inviteCode: "maraton2026",
      },
      {
        id: "demo-list-3",
        name: "Noche de Suspenso & Misterio 🕵️",
        status: "Votación activa",
        membersCount: 5,
        topCandidate: {
          title: "Monster",
          happinessScore: 9.1,
          imageUrl: "https://cdn.myanimelist.net/images/anime/10/18741.jpg",
        },
        unvotedCandidatesCount: 3, // 3 animes sin votar -> activa advertencia
        inviteCode: "misterio2026",
      },
    ];
  }

  const supabase = createBrowserClient();
  try {
    const { data: memberLists } = await supabase
      .from("shared_list_members")
      .select("shared_list_id")
      .eq("user_id", userId);

    const memberListIds = memberLists?.map((m: any) => m.shared_list_id) || [];

    let query = supabase.from("shared_lists").select("id, name, status, invite_code, created_by");
    if (memberListIds.length > 0) {
      query = query.or(`created_by.eq.${userId},id.in.(${memberListIds.join(",")})`);
    } else {
      query = query.eq("created_by", userId);
    }

    const { data: lists, error } = await query;
    if (error || !lists || lists.length === 0) {
      return [];
    }

    return lists.map((l: any) => ({
      id: l.id,
      name: l.name,
      status: l.status === "voting" ? "Votación en curso" : "Activa",
      membersCount: 1,
      topCandidate: null,
      unvotedCandidatesCount: 0,
      inviteCode: l.invite_code,
    }));
  } catch (err) {
    return [];
  }
}


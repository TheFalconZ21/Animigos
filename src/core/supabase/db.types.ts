export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          payload?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      anime_cache: {
        Row: {
          episodes: number | null
          genres: string[]
          image_url: string | null
          last_synced_at: string
          mal_id: number
          popularity: number | null
          score: number | null
          scored_by: number | null
          status: string | null
          synopsis: string | null
          title: string
          title_english: string | null
          title_japanese: string | null
          type: string | null
        }
        Insert: {
          episodes?: number | null
          genres?: string[]
          image_url?: string | null
          last_synced_at?: string
          mal_id: number
          popularity?: number | null
          score?: number | null
          scored_by?: number | null
          status?: string | null
          synopsis?: string | null
          title: string
          title_english?: string | null
          title_japanese?: string | null
          type?: string | null
        }
        Update: {
          episodes?: number | null
          genres?: string[]
          image_url?: string | null
          last_synced_at?: string
          mal_id?: number
          popularity?: number | null
          score?: number | null
          scored_by?: number | null
          status?: string | null
          synopsis?: string | null
          title?: string
          title_english?: string | null
          title_japanese?: string | null
          type?: string | null
        }
        Relationships: []
      }
      friendships: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_watch_progress: {
        Row: {
          current_episode: number
          id: string
          mal_id: number
          shared_list_id: string
          total_episodes: number | null
          updated_at: string
        }
        Insert: {
          current_episode?: number
          id?: string
          mal_id: number
          shared_list_id: string
          total_episodes?: number | null
          updated_at?: string
        }
        Update: {
          current_episode?: number
          id?: string
          mal_id?: number
          shared_list_id?: string
          total_episodes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_watch_progress_mal_id_fkey"
            columns: ["mal_id"]
            isOneToOne: false
            referencedRelation: "anime_cache"
            referencedColumns: ["mal_id"]
          },
          {
            foreignKeyName: "group_watch_progress_shared_list_id_fkey"
            columns: ["shared_list_id"]
            isOneToOne: false
            referencedRelation: "shared_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_list_items: {
        Row: {
          added_at: string
          episodes_watched: number
          id: string
          list_id: string
          mal_id: number
          notes: string | null
          personal_score: number | null
          status: string
          updated_at: string
        }
        Insert: {
          added_at?: string
          episodes_watched?: number
          id?: string
          list_id: string
          mal_id: number
          notes?: string | null
          personal_score?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          added_at?: string
          episodes_watched?: number
          id?: string
          list_id?: string
          mal_id?: number
          notes?: string | null
          personal_score?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "personal_list_items_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "personal_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_list_items_mal_id_fkey"
            columns: ["mal_id"]
            isOneToOne: false
            referencedRelation: "anime_cache"
            referencedColumns: ["mal_id"]
          },
        ]
      }
      personal_lists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_default: boolean
          is_public: boolean
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean
          is_public?: boolean
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean
          is_public?: boolean
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "personal_lists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name: string
          id: string
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      shared_list_candidates: {
        Row: {
          added_at: string
          id: string
          mal_id: number
          shared_list_id: string
          suggested_by_guest_token: string | null
          suggested_by_user_id: string | null
        }
        Insert: {
          added_at?: string
          id?: string
          mal_id: number
          shared_list_id: string
          suggested_by_guest_token?: string | null
          suggested_by_user_id?: string | null
        }
        Update: {
          added_at?: string
          id?: string
          mal_id?: number
          shared_list_id?: string
          suggested_by_guest_token?: string | null
          suggested_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_list_candidates_mal_id_fkey"
            columns: ["mal_id"]
            isOneToOne: false
            referencedRelation: "anime_cache"
            referencedColumns: ["mal_id"]
          },
          {
            foreignKeyName: "shared_list_candidates_shared_list_id_fkey"
            columns: ["shared_list_id"]
            isOneToOne: false
            referencedRelation: "shared_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_list_candidates_suggested_by_user_id_fkey"
            columns: ["suggested_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_list_members: {
        Row: {
          guest_name: string | null
          guest_token: string | null
          id: string
          joined_at: string
          role: string
          shared_list_id: string
          user_id: string | null
        }
        Insert: {
          guest_name?: string | null
          guest_token?: string | null
          id?: string
          joined_at?: string
          role?: string
          shared_list_id: string
          user_id?: string | null
        }
        Update: {
          guest_name?: string | null
          guest_token?: string | null
          id?: string
          joined_at?: string
          role?: string
          shared_list_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_list_members_shared_list_id_fkey"
            columns: ["shared_list_id"]
            isOneToOne: false
            referencedRelation: "shared_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_list_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_list_votes: {
        Row: {
          candidate_id: string
          id: string
          interest_score: number
          updated_at: string
          voted_at: string
          voter_guest_token: string | null
          voter_user_id: string | null
        }
        Insert: {
          candidate_id: string
          id?: string
          interest_score: number
          updated_at?: string
          voted_at?: string
          voter_guest_token?: string | null
          voter_user_id?: string | null
        }
        Update: {
          candidate_id?: string
          id?: string
          interest_score?: number
          updated_at?: string
          voted_at?: string
          voter_guest_token?: string | null
          voter_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_list_votes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "shared_list_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_list_votes_voter_user_id_fkey"
            columns: ["voter_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_lists: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          invite_code: string
          name: string
          selected_anime_id: number | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          invite_code?: string
          name: string
          selected_anime_id?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          invite_code?: string
          name?: string
          selected_anime_id?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_lists_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_lists_selected_anime_id_fkey"
            columns: ["selected_anime_id"]
            isOneToOne: false
            referencedRelation: "anime_cache"
            referencedColumns: ["mal_id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          experience_level: string
          favorite_genres: string[]
          onboarding_completed: boolean
          onboarding_stage: string
          preferred_duration: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          experience_level?: string
          favorite_genres?: string[]
          onboarding_completed?: boolean
          onboarding_stage?: string
          preferred_duration?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          experience_level?: string
          favorite_genres?: string[]
          onboarding_completed?: boolean
          onboarding_stage?: string
          preferred_duration?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

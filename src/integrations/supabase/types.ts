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
  public: {
    Tables: {
      announcements: {
        Row: {
          body: string
          created_at: string
          id: string
          published: boolean
          title: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          published?: boolean
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          published?: boolean
          title?: string
        }
        Relationships: []
      }
      auction_bids: {
        Row: {
          amount: number
          auction_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          amount: number
          auction_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          amount?: number
          auction_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auction_bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auction_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_entries: {
        Row: {
          amount_paid: number
          auction_id: string
          id: string
          paid_at: string
          payment_ref: string | null
          user_id: string
        }
        Insert: {
          amount_paid: number
          auction_id: string
          id?: string
          paid_at?: string
          payment_ref?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number
          auction_id?: string
          id?: string
          paid_at?: string
          payment_ref?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auction_entries_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auction_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_listings: {
        Row: {
          admin_notes: string | null
          category: string | null
          created_at: string
          description: string | null
          end_at: string | null
          entry_fee: number
          featured: boolean
          gallery_urls: string[]
          id: string
          image_url: string | null
          item_condition: string | null
          rules: string | null
          seller_id: string
          start_at: string | null
          starting_price: number
          status: Database["public"]["Enums"]["listing_status"]
          terms: string | null
          title: string
          updated_at: string
          video_url: string | null
          winner_calculated_at: string | null
          winner_user_id: string | null
          winning_amount: number | null
        }
        Insert: {
          admin_notes?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          end_at?: string | null
          entry_fee?: number
          featured?: boolean
          gallery_urls?: string[]
          id?: string
          image_url?: string | null
          item_condition?: string | null
          rules?: string | null
          seller_id: string
          start_at?: string | null
          starting_price?: number
          status?: Database["public"]["Enums"]["listing_status"]
          terms?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
          winner_calculated_at?: string | null
          winner_user_id?: string | null
          winning_amount?: number | null
        }
        Update: {
          admin_notes?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          end_at?: string | null
          entry_fee?: number
          featured?: boolean
          gallery_urls?: string[]
          id?: string
          image_url?: string | null
          item_condition?: string | null
          rules?: string | null
          seller_id?: string
          start_at?: string | null
          starting_price?: number
          status?: Database["public"]["Enums"]["listing_status"]
          terms?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
          winner_calculated_at?: string | null
          winner_user_id?: string | null
          winning_amount?: number | null
        }
        Relationships: []
      }
      auction_winners: {
        Row: {
          auction_id: string
          calculated_at: string
          frequency_breakdown: Json
          id: string
          total_bids: number
          total_participants: number
          winner_user_id: string
          winning_amount: number
        }
        Insert: {
          auction_id: string
          calculated_at?: string
          frequency_breakdown: Json
          id?: string
          total_bids: number
          total_participants: number
          winner_user_id: string
          winning_amount: number
        }
        Update: {
          auction_id?: string
          calculated_at?: string
          frequency_breakdown?: Json
          id?: string
          total_bids?: number
          total_participants?: number
          winner_user_id?: string
          winning_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "auction_winners_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: true
            referencedRelation: "auction_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          age: number | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          verified: boolean
        }
        Insert: {
          address?: string | null
          age?: number | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
          verified?: boolean
        }
        Update: {
          address?: string | null
          age?: number | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      site_content: {
        Row: {
          body: string | null
          id: string
          slug: string
          title: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          body?: string | null
          id?: string
          slug: string
          title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          body?: string | null
          id?: string
          slug?: string
          title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      social_impact: {
        Row: {
          amount_contributed: number | null
          created_at: string
          description: string
          icon: string | null
          id: string
          published: boolean
          title: string
        }
        Insert: {
          amount_contributed?: number | null
          created_at?: string
          description: string
          icon?: string | null
          id?: string
          published?: boolean
          title: string
        }
        Update: {
          amount_contributed?: number | null
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          published?: boolean
          title?: string
        }
        Relationships: []
      }
      success_stories: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          published: boolean
          story: string
          title: string
          winner_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          published?: boolean
          story: string
          title: string
          winner_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          published?: boolean
          story?: string
          title?: string
          winner_name?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_auction_winner: {
        Args: { _auction_id: string }
        Returns: {
          total_bids: number
          total_participants: number
          winner_user_id: string
          winning_amount: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "seller" | "buyer"
      listing_status:
        | "pending"
        | "approved"
        | "rejected"
        | "live"
        | "ended"
        | "upcoming"
        | "active"
        | "paused"
        | "closed"
        | "winner_announced"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "seller", "buyer"],
      listing_status: [
        "pending",
        "approved",
        "rejected",
        "live",
        "ended",
        "upcoming",
        "active",
        "paused",
        "closed",
        "winner_announced",
      ],
    },
  },
} as const

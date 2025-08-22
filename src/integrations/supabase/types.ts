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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      connotes: {
        Row: {
          awb_number: string
          consignee_address: string
          consignee_city: string
          consignee_country: string
          consignee_email: string | null
          consignee_name: string
          consignee_phone: string | null
          created_at: string
          created_by: string
          currency: string | null
          customs_value: number | null
          description: string
          dimensions: string | null
          docket_id: string | null
          freight_charges: number | null
          fuel_surcharge: number | null
          handling_charge: number | null
          id: string
          insurance_fee: number | null
          other_charges: number | null
          pieces: number
          security_charge: number | null
          service_type: Database["public"]["Enums"]["service_type"]
          shipment_type: Database["public"]["Enums"]["shipment_type"]
          shipper_address: string
          shipper_city: string
          shipper_country: string
          shipper_email: string | null
          shipper_name: string
          shipper_phone: string | null
          status: Database["public"]["Enums"]["connote_status"] | null
          total_charges: number
          tracking_updates: Json | null
          updated_at: string
          weight: number
        }
        Insert: {
          awb_number: string
          consignee_address: string
          consignee_city: string
          consignee_country: string
          consignee_email?: string | null
          consignee_name: string
          consignee_phone?: string | null
          created_at?: string
          created_by: string
          currency?: string | null
          customs_value?: number | null
          description: string
          dimensions?: string | null
          docket_id?: string | null
          freight_charges?: number | null
          fuel_surcharge?: number | null
          handling_charge?: number | null
          id?: string
          insurance_fee?: number | null
          other_charges?: number | null
          pieces?: number
          security_charge?: number | null
          service_type: Database["public"]["Enums"]["service_type"]
          shipment_type: Database["public"]["Enums"]["shipment_type"]
          shipper_address: string
          shipper_city: string
          shipper_country: string
          shipper_email?: string | null
          shipper_name: string
          shipper_phone?: string | null
          status?: Database["public"]["Enums"]["connote_status"] | null
          total_charges?: number
          tracking_updates?: Json | null
          updated_at?: string
          weight: number
        }
        Update: {
          awb_number?: string
          consignee_address?: string
          consignee_city?: string
          consignee_country?: string
          consignee_email?: string | null
          consignee_name?: string
          consignee_phone?: string | null
          created_at?: string
          created_by?: string
          currency?: string | null
          customs_value?: number | null
          description?: string
          dimensions?: string | null
          docket_id?: string | null
          freight_charges?: number | null
          fuel_surcharge?: number | null
          handling_charge?: number | null
          id?: string
          insurance_fee?: number | null
          other_charges?: number | null
          pieces?: number
          security_charge?: number | null
          service_type?: Database["public"]["Enums"]["service_type"]
          shipment_type?: Database["public"]["Enums"]["shipment_type"]
          shipper_address?: string
          shipper_city?: string
          shipper_country?: string
          shipper_email?: string | null
          shipper_name?: string
          shipper_phone?: string | null
          status?: Database["public"]["Enums"]["connote_status"] | null
          total_charges?: number
          tracking_updates?: Json | null
          updated_at?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "connotes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connotes_docket_id_fkey"
            columns: ["docket_id"]
            isOneToOne: false
            referencedRelation: "dockets"
            referencedColumns: ["id"]
          },
        ]
      }
      dockets: {
        Row: {
          bags: number | null
          carrier: string
          country: string
          created_at: string
          created_by: string
          date: string
          docket_no: string
          flight_no: string | null
          id: string
          load_no: string | null
          station: string
          status: Database["public"]["Enums"]["docket_status"] | null
          summary_no: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          bags?: number | null
          carrier: string
          country: string
          created_at?: string
          created_by: string
          date?: string
          docket_no: string
          flight_no?: string | null
          id?: string
          load_no?: string | null
          station: string
          status?: Database["public"]["Enums"]["docket_status"] | null
          summary_no: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          bags?: number | null
          carrier?: string
          country?: string
          created_at?: string
          created_by?: string
          date?: string
          docket_no?: string
          flight_no?: string | null
          id?: string
          load_no?: string | null
          station?: string
          status?: Database["public"]["Enums"]["docket_status"] | null
          summary_no?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dockets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          created_by: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tracking_history: {
        Row: {
          connote_id: string
          created_by: string | null
          description: string | null
          id: string
          location: string | null
          status: string
          timestamp: string
        }
        Insert: {
          connote_id: string
          created_by?: string | null
          description?: string | null
          id?: string
          location?: string | null
          status: string
          timestamp?: string
        }
        Update: {
          connote_id?: string
          created_by?: string | null
          description?: string | null
          id?: string
          location?: string | null
          status?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracking_history_connote_id_fkey"
            columns: ["connote_id"]
            isOneToOne: false
            referencedRelation: "connotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracking_history_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
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
      connote_status:
        | "created"
        | "processing"
        | "in_transit"
        | "delivered"
        | "returned"
      docket_status: "open" | "closed"
      service_type: "express" | "standard" | "economy"
      shipment_type: "documents" | "package" | "fragile" | "dangerous"
      user_role: "main_admin" | "second_admin" | "manager" | "staff"
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
      connote_status: [
        "created",
        "processing",
        "in_transit",
        "delivered",
        "returned",
      ],
      docket_status: ["open", "closed"],
      service_type: ["express", "standard", "economy"],
      shipment_type: ["documents", "package", "fragile", "dangerous"],
      user_role: ["main_admin", "second_admin", "manager", "staff"],
    },
  },
} as const

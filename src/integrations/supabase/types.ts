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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      connotes: {
        Row: {
          awb_number: string
          cod_amount: number | null
          consignee_address: string
          consignee_city: string
          consignee_country: string
          consignee_email: string | null
          consignee_name: string
          consignee_phone: string | null
          consignee_zip_code: string
          created_at: string
          created_by: string
          declared_value: number | null
          dimensions: string | null
          freight_charges: number
          fuel_surcharge: number | null
          handling_charges: number | null
          id: string
          insurance_charges: number | null
          insurance_value: number | null
          other_charges: number | null
          pieces: number
          service_type: string
          shipper_address: string
          shipper_city: string
          shipper_country: string
          shipper_email: string | null
          shipper_name: string
          shipper_phone: string | null
          shipper_zip_code: string
          special_instructions: string | null
          status: string
          total_charges: number
          updated_at: string
          weight: number
        }
        Insert: {
          awb_number: string
          cod_amount?: number | null
          consignee_address: string
          consignee_city: string
          consignee_country: string
          consignee_email?: string | null
          consignee_name: string
          consignee_phone?: string | null
          consignee_zip_code: string
          created_at?: string
          created_by: string
          declared_value?: number | null
          dimensions?: string | null
          freight_charges?: number
          fuel_surcharge?: number | null
          handling_charges?: number | null
          id?: string
          insurance_charges?: number | null
          insurance_value?: number | null
          other_charges?: number | null
          pieces?: number
          service_type?: string
          shipper_address: string
          shipper_city: string
          shipper_country: string
          shipper_email?: string | null
          shipper_name: string
          shipper_phone?: string | null
          shipper_zip_code: string
          special_instructions?: string | null
          status?: string
          total_charges?: number
          updated_at?: string
          weight?: number
        }
        Update: {
          awb_number?: string
          cod_amount?: number | null
          consignee_address?: string
          consignee_city?: string
          consignee_country?: string
          consignee_email?: string | null
          consignee_name?: string
          consignee_phone?: string | null
          consignee_zip_code?: string
          created_at?: string
          created_by?: string
          declared_value?: number | null
          dimensions?: string | null
          freight_charges?: number
          fuel_surcharge?: number | null
          handling_charges?: number | null
          id?: string
          insurance_charges?: number | null
          insurance_value?: number | null
          other_charges?: number | null
          pieces?: number
          service_type?: string
          shipper_address?: string
          shipper_city?: string
          shipper_country?: string
          shipper_email?: string | null
          shipper_name?: string
          shipper_phone?: string | null
          shipper_zip_code?: string
          special_instructions?: string | null
          status?: string
          total_charges?: number
          updated_at?: string
          weight?: number
        }
        Relationships: []
      }
      dockets: {
        Row: {
          bags: number
          carrier: string
          country: string
          created_at: string
          created_by: string
          date: string
          docket_no: string
          flight_no: string
          id: string
          load_no: string
          station: string
          status: string
          summary_no: string
          updated_at: string
          weight: number
        }
        Insert: {
          bags?: number
          carrier: string
          country: string
          created_at?: string
          created_by: string
          date: string
          docket_no: string
          flight_no: string
          id?: string
          load_no: string
          station: string
          status?: string
          summary_no: string
          updated_at?: string
          weight?: number
        }
        Update: {
          bags?: number
          carrier?: string
          country?: string
          created_at?: string
          created_by?: string
          date?: string
          docket_no?: string
          flight_no?: string
          id?: string
          load_no?: string
          station?: string
          status?: string
          summary_no?: string
          updated_at?: string
          weight?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          phone: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const

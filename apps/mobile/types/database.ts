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
      accounts: {
        Row: {
          archived: boolean
          bank: string | null
          closing_day: number | null
          color: string | null
          created_at: string
          credit_limit: number | null
          due_day: number | null
          icon: string | null
          id: string
          initial_balance: number
          name: string
          type: Database["public"]["Enums"]["account_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          archived?: boolean
          bank?: string | null
          closing_day?: number | null
          color?: string | null
          created_at?: string
          credit_limit?: number | null
          due_day?: number | null
          icon?: string | null
          id?: string
          initial_balance?: number
          name: string
          type: Database["public"]["Enums"]["account_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          archived?: boolean
          bank?: string | null
          closing_day?: number | null
          color?: string | null
          created_at?: string
          credit_limit?: number | null
          due_day?: number | null
          icon?: string | null
          id?: string
          initial_balance?: number
          name?: string
          type?: Database["public"]["Enums"]["account_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          active: boolean
          alert_thresholds: number[]
          amount: number
          category_id: string | null
          created_at: string
          id: string
          period: Database["public"]["Enums"]["budget_period"]
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          alert_thresholds?: number[]
          amount: number
          category_id?: string | null
          created_at?: string
          id?: string
          period?: Database["public"]["Enums"]["budget_period"]
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          alert_thresholds?: number[]
          amount?: number
          category_id?: string | null
          created_at?: string
          id?: string
          period?: Database["public"]["Enums"]["budget_period"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          archived: boolean
          color: string | null
          created_at: string
          icon: string | null
          id: string
          name: string
          parent_id: string | null
          type: Database["public"]["Enums"]["category_kind"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          archived?: boolean
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          parent_id?: string | null
          type: Database["public"]["Enums"]["category_kind"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          archived?: boolean
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          type?: Database["public"]["Enums"]["category_kind"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      categorization_rules: {
        Row: {
          category_id: string
          created_at: string
          id: string
          pattern: string
          priority: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          pattern: string
          priority?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          pattern?: string
          priority?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorization_rules_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categorization_rules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          category_id: string | null
          created_at: string
          deadline: string | null
          id: string
          linked_account_id: string | null
          name: string
          status: Database["public"]["Enums"]["goal_status"]
          target_amount: number | null
          target_percentage: number | null
          type: Database["public"]["Enums"]["goal_kind"]
          updated_at: string
          user_id: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          deadline?: string | null
          id?: string
          linked_account_id?: string | null
          name: string
          status?: Database["public"]["Enums"]["goal_status"]
          target_amount?: number | null
          target_percentage?: number | null
          type: Database["public"]["Enums"]["goal_kind"]
          updated_at?: string
          user_id: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          deadline?: string | null
          id?: string
          linked_account_id?: string | null
          name?: string
          status?: Database["public"]["Enums"]["goal_status"]
          target_amount?: number | null
          target_percentage?: number | null
          type?: Database["public"]["Enums"]["goal_kind"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_linked_account_id_fkey"
            columns: ["linked_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_transactions: {
        Row: {
          amount: number
          created_at: string
          date: string
          id: string
          investment_id: string
          notes: string | null
          price: number | null
          quantity: number | null
          type: Database["public"]["Enums"]["investment_tx_kind"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          date: string
          id?: string
          investment_id: string
          notes?: string | null
          price?: number | null
          quantity?: number | null
          type: Database["public"]["Enums"]["investment_tx_kind"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          id?: string
          investment_id?: string
          notes?: string | null
          price?: number | null
          quantity?: number | null
          type?: Database["public"]["Enums"]["investment_tx_kind"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investment_transactions_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "investments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      investments: {
        Row: {
          account_id: string
          archived: boolean
          avg_price: number | null
          created_at: string
          current_price: number | null
          id: string
          last_price_update: string | null
          name: string
          quantity: number | null
          ticker: string | null
          type: Database["public"]["Enums"]["investment_kind"]
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id: string
          archived?: boolean
          avg_price?: number | null
          created_at?: string
          current_price?: number | null
          id?: string
          last_price_update?: string | null
          name: string
          quantity?: number | null
          ticker?: string | null
          type: Database["public"]["Enums"]["investment_kind"]
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string
          archived?: boolean
          avg_price?: number | null
          created_at?: string
          current_price?: number | null
          id?: string
          last_price_update?: string | null
          name?: string
          quantity?: number | null
          ticker?: string | null
          type?: Database["public"]["Enums"]["investment_kind"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investments_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          data: Json
          id: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          data?: Json
          id?: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          data?: Json
          id?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      recurring_transactions: {
        Row: {
          account_id: string
          active: boolean
          amount: number
          category_id: string | null
          created_at: string
          description: string | null
          end_date: string | null
          frequency: Database["public"]["Enums"]["recurrence_frequency"]
          id: string
          next_occurrence: string | null
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id: string
          active?: boolean
          amount: number
          category_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          frequency: Database["public"]["Enums"]["recurrence_frequency"]
          id?: string
          next_occurrence?: string | null
          start_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string
          active?: boolean
          amount?: number
          category_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          frequency?: Database["public"]["Enums"]["recurrence_frequency"]
          id?: string
          next_occurrence?: string | null
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recurring_transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string
          amount: number
          category_id: string | null
          cnpj: string | null
          created_at: string
          date: string
          description: string | null
          external_id: string | null
          id: string
          is_split: boolean
          merchant: string | null
          notes: string | null
          parent_transaction_id: string | null
          recurring_id: string | null
          source: Database["public"]["Enums"]["transaction_source"]
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id: string
          amount: number
          category_id?: string | null
          cnpj?: string | null
          created_at?: string
          date: string
          description?: string | null
          external_id?: string | null
          id?: string
          is_split?: boolean
          merchant?: string | null
          notes?: string | null
          parent_transaction_id?: string | null
          recurring_id?: string | null
          source?: Database["public"]["Enums"]["transaction_source"]
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string
          amount?: number
          category_id?: string | null
          cnpj?: string | null
          created_at?: string
          date?: string
          description?: string | null
          external_id?: string | null
          id?: string
          is_split?: boolean
          merchant?: string | null
          notes?: string | null
          parent_transaction_id?: string | null
          recurring_id?: string | null
          source?: Database["public"]["Enums"]["transaction_source"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_parent_transaction_id_fkey"
            columns: ["parent_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_recurring_id_fkey"
            columns: ["recurring_id"]
            isOneToOne: false
            referencedRelation: "recurring_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      users_profile: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          preferences: Json
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          preferences?: Json
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          preferences?: Json
          updated_at?: string
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
      account_type:
        | "checking"
        | "savings"
        | "credit_card"
        | "investment"
        | "cash"
      budget_period: "monthly" | "yearly"
      category_kind: "expense" | "income"
      goal_kind: "savings" | "reduction"
      goal_status: "active" | "achieved" | "failed" | "archived"
      investment_kind:
        | "stock"
        | "fii"
        | "treasury"
        | "cdb"
        | "fund"
        | "crypto"
        | "other"
      investment_tx_kind: "buy" | "sell" | "dividend"
      recurrence_frequency:
        | "weekly"
        | "biweekly"
        | "monthly"
        | "yearly"
        | "custom"
      transaction_source: "manual" | "ofx_import" | "csv_import" | "pluggy"
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
      account_type: [
        "checking",
        "savings",
        "credit_card",
        "investment",
        "cash",
      ],
      budget_period: ["monthly", "yearly"],
      category_kind: ["expense", "income"],
      goal_kind: ["savings", "reduction"],
      goal_status: ["active", "achieved", "failed", "archived"],
      investment_kind: [
        "stock",
        "fii",
        "treasury",
        "cdb",
        "fund",
        "crypto",
        "other",
      ],
      investment_tx_kind: ["buy", "sell", "dividend"],
      recurrence_frequency: [
        "weekly",
        "biweekly",
        "monthly",
        "yearly",
        "custom",
      ],
      transaction_source: ["manual", "ofx_import", "csv_import", "pluggy"],
    },
  },
} as const

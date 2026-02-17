// This file should be generated from your Supabase schema using:
// npx supabase gen types typescript --project-id YOUR_PROJECT_REF > types/database.ts

// For now, here's a starter type definition
export type Database = {
  public: {
    Tables: {
      donors: {
        Row: {
          id: string
          organization_id: string
          site_id: string | null
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          donor_type: string
          total_donated: number
          donation_count: number
          first_donation_date: string | null
          last_donation_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['donors']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['donors']['Insert']>
      }
      donations: {
        Row: {
          id: string
          donor_id: string
          campaign_id: string | null
          site_id: string
          amount: number
          donation_date: string
          payment_method: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['donations']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['donations']['Insert']>
      }
      // Add other tables as needed
    }
  }
}

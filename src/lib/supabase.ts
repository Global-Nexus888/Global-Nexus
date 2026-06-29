import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://placeholder.supabase.co'
const SUPABASE_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'placeholder'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
export const supabaseReady = SUPABASE_URL !== 'https://placeholder.supabase.co'

export type UserRole = 'productor' | 'comprador' | 'asesor' | 'admin' | 'demo'

export interface GNUser {
  id?: string
  email: string
  name: string
  company?: string
  state?: string
  country?: string
  category?: string
  interest?: string
  role: UserRole
  plan?: string
  plan_active?: boolean
  created_at?: string
}

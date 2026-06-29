import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const empty = () => Promise.resolve({ data: [], count: 0, error: null })
const chain = { select: empty, order: empty, eq: empty, single: empty, limit: empty }

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : { from: () => chain } as any

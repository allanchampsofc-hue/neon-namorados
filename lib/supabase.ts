import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Reserva = {
  id?: string
  codigo: string
  nome: string
  telefone: string
  email: string
  horario: string
  observacoes?: string
  status: 'pendente' | 'pago' | 'cancelado'
  checkin: boolean
  criado_em?: string
}

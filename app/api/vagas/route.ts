import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase
    .from('reservas')
    .select('horario, status')
    .neq('status', 'cancelado')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const count1830 = data.filter(r => r.horario === '18:30').length
  const count2030 = data.filter(r => r.horario === '20:30').length

  return NextResponse.json({
    '18:30': { reservadas: count1830, disponiveis: Math.max(0, 10 - count1830) },
    '20:30': { reservadas: count2030, disponiveis: Math.max(0, 10 - count2030) },
  })
}

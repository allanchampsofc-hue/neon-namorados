import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

function gerarCodigo() {
  return '#' + Math.random().toString(36).substr(2, 6).toUpperCase()
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nome, telefone, email, horario, observacoes } = body

  if (!nome || !telefone || !horario) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
  }

  // Verificar vagas
  const { data: existentes } = await supabase
    .from('reservas')
    .select('id')
    .eq('horario', horario)
    .neq('status', 'cancelado')

  if ((existentes?.length ?? 0) >= 10) {
    return NextResponse.json({ error: 'Horário esgotado' }, { status: 409 })
  }

  const codigo = gerarCodigo()

  const { data, error } = await supabase
    .from('reservas')
    .insert([{ codigo, nome, telefone, email, horario, observacoes, status: 'pendente', checkin: false }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ reserva: data })
}

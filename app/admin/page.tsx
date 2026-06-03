'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

type Reserva = {
  id: string; codigo: string; nome: string; telefone: string
  email: string; horario: string; observacoes?: string
  status: 'pendente' | 'pago' | 'cancelado'; checkin: boolean; criado_em: string
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pwd, setPwd] = useState('')
  const [pwdErro, setPwdErro] = useState(false)
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [tab, setTab] = useState('todos')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState<Reserva | null>(null)

  function login() {
    if (pwd === 'neon2026') { setAuthed(true); fetchReservas() }
    else setPwdErro(true)
  }

  async function fetchReservas() {
    setLoading(true)
    const res = await fetch('/api/admin/reservas')
    const data = await res.json()
    setReservas(data.reservas || [])
    setLoading(false)
  }

  async function confirmarPagamento(id: string) {
    await fetch(`/api/reservas/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'pago' }) })
    setModal(null)
    fetchReservas()
  }

  async function fazerCheckin(id: string) {
    await fetch(`/api/reservas/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ checkin: true }) })
    fetchReservas()
  }

  async function cancelar(id: string) {
    await fetch(`/api/reservas/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'cancelado' }) })
    fetchReservas()
  }

  function exportCSV() {
    const header = 'Código,Nome,Telefone,Email,Horário,Status,Check-in,Observações,Criado em'
    const rows = reservas.map(r => `${r.codigo},"${r.nome}",${r.telefone},${r.email},${r.horario},${r.status},${r.checkin?'Sim':'Não'},"${r.observacoes||''}","${new Date(r.criado_em).toLocaleString('pt-BR')}"`)
    const blob = new Blob([[header,...rows].join('\n')], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'reservas_namorados_neon.csv'; a.click()
  }

  const filtered = reservas.filter(r => {
    const matchSearch = !search || r.nome.toLowerCase().includes(search.toLowerCase()) || r.codigo.toLowerCase().includes(search.toLowerCase())
    const matchTab = tab === 'todos' ? true : tab === 'pago' ? r.status === 'pago' : tab === 'pendente' ? r.status === 'pendente' : tab === 'checkin' ? r.checkin : r.horario === tab
    return matchSearch && matchTab
  })

  const total = reservas.filter(r => r.status !== 'cancelado').length
  const pagos = reservas.filter(r => r.status === 'pago').length
  const pendentes = reservas.filter(r => r.status === 'pendente').length
  const presentes = reservas.filter(r => r.checkin).length
  const vagas1830 = Math.max(0, 10 - reservas.filter(r => r.horario === '18:30' && r.status !== 'cancelado').length)
  const vagas2030 = Math.max(0, 10 - reservas.filter(r => r.horario === '20:30' && r.status !== 'cancelado').length)

  if (!authed) return (
    <div style={{ minHeight: '100vh', background: '#0F0F0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1A1A1A', border: '1px solid #333', borderRadius: 12, padding: '48px 40px', width: '90%', maxWidth: 380, textAlign: 'center' }}>
        <Image src="/logo.png" alt="Neon" width={120} height={60} style={{ objectFit: 'contain', marginBottom: 20 }} />
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, color: '#C9A84C', marginBottom: 8 }}>PAINEL ADMINISTRATIVO</div>
        <div style={{ fontSize: 13, color: '#555', marginBottom: 28 }}>Digite a senha de acesso</div>
        <input type="password" placeholder="••••••" value={pwd} onChange={e => { setPwd(e.target.value); setPwdErro(false) }} onKeyDown={e => e.key === 'Enter' && login()}
          style={{ width: '100%', background: '#111', border: `1px solid ${pwdErro ? '#EF4444' : '#333'}`, borderRadius: 6, padding: '13px 16px', color: '#fff', fontSize: 14, outline: 'none', textAlign: 'center', letterSpacing: '0.2em', marginBottom: 16 }} />
        {pwdErro && <div style={{ fontSize: 12, color: '#EF4444', marginBottom: 12 }}>Senha incorreta</div>}
        <button onClick={login} style={{ width: '100%', background: '#8B1A1A', color: '#fff', border: 'none', borderRadius: 6, padding: 14, fontFamily: "'Cinzel',serif", fontSize: 13, letterSpacing: '0.1em', cursor: 'pointer' }}>Entrar</button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0F0F0F', color: '#fff', fontFamily: 'Lato, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1A1A1A', borderBottom: '1px solid #2A2A2A', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 15, color: '#C9A84C' }}>⚡ NEON · Painel de Reservas</div>
          <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>Dia dos Namorados — 12 de junho de 2026</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/" style={{ background: 'transparent', border: '1px solid #333', color: '#888', padding: '8px 16px', borderRadius: 6, fontSize: 12, textDecoration: 'none' }}>← Ver site</a>
          <button onClick={exportCSV} style={{ background: 'transparent', border: '1px solid #333', color: '#888', padding: '8px 16px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>⬇ Exportar CSV</button>
          <button onClick={fetchReservas} style={{ background: '#8B1A1A', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>↻ Atualizar</button>
        </div>
      </div>

      <div style={{ padding: 28 }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
          {[{label:'Total de reservas',val:total,color:'#fff'},{label:'Pagamentos confirmados',val:pagos,color:'#22C55E'},{label:'Aguardando pagamento',val:pendentes,color:'#EAB308'},{label:'Check-in realizados',val:presentes,color:'#3B82F6'}].map((s,i) => (
            <div key={i} style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 10, padding: '18px 20px' }}>
              <div style={{ fontSize: 32, fontWeight: 300, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Vagas por turno */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
          {[{h:'18:30',v:vagas1830,label:'Primeiro turno'},{h:'20:30',v:vagas2030,label:'Segundo turno'}].map(t => (
            <div key={t.h} style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 10, padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: "'Cinzel',serif", color: '#C9A84C', fontSize: 20 }}>{t.h}</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{t.label}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 30, color: t.v === 0 ? '#EF4444' : '#fff' }}>{t.v}</div>
                <div style={{ fontSize: 11, color: '#555' }}>vagas restantes</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filtros e busca */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['todos','18:30','20:30','pago','pendente','checkin'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '7px 18px', borderRadius: 6, border: `1px solid ${tab===t?'#8B1A1A':'#333'}`, background: tab===t?'#8B1A1A':'transparent', color: tab===t?'#fff':'#666', fontSize: 12, cursor: 'pointer' }}>
                {t === 'todos' ? 'Todos' : t === 'pago' ? 'Pagos' : t === 'pendente' ? 'Pendentes' : t === 'checkin' ? 'Presentes' : t}
              </button>
            ))}
          </div>
          <input placeholder="🔍 Buscar por nome ou código..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ background: '#1A1A1A', border: '1px solid #333', borderRadius: 6, padding: '9px 16px', color: '#fff', fontSize: 13, outline: 'none', width: 280 }} />
        </div>

        {/* Tabela */}
        <div style={{ background: '#1A1A1A', border: '1px solid #222', borderRadius: 10, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#444' }}>Carregando reservas...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#444' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🌹</div>
              <div style={{ fontSize: 14 }}>Nenhuma reserva encontrada</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Código','Nome','Telefone','Horário','Status','Check-in','Obs.','Ações'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#444', padding: '10px 14px', borderBottom: '1px solid #222' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #1E1E1E' }}>
                    <td style={{ padding: 14, fontFamily: "'Cinzel',serif", color: '#C9A84C', fontSize: 12 }}>{r.codigo}</td>
                    <td style={{ padding: 14, color: '#fff', fontWeight: 500 }}>{r.nome}</td>
                    <td style={{ padding: 14 }}>
                      <a href={`https://wa.me/55${r.telefone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" style={{ color: '#25D366', textDecoration: 'none', fontSize: 13 }}>{r.telefone}</a>
                    </td>
                    <td style={{ padding: 14, fontFamily: "'Cinzel',serif", fontSize: 13, color: '#E2C97E' }}>{r.horario}</td>
                    <td style={{ padding: 14 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 100, background: r.status==='pago'?'rgba(34,197,94,0.15)':r.status==='cancelado'?'rgba(239,68,68,0.15)':'rgba(234,179,8,0.15)', color: r.status==='pago'?'#22C55E':r.status==='cancelado'?'#EF4444':'#EAB308' }}>
                        ● {r.status === 'pago' ? 'Pago' : r.status === 'cancelado' ? 'Cancelado' : 'Pendente'}
                      </span>
                    </td>
                    <td style={{ padding: 14 }}>
                      {r.checkin ? <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 100, background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}>● Presente</span> : <span style={{ color: '#333', fontSize: 12 }}>—</span>}
                    </td>
                    <td style={{ padding: 14, fontSize: 12, color: '#555', maxWidth: 160 }}>{r.observacoes || '—'}</td>
                    <td style={{ padding: 14 }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {r.status === 'pendente' && (
                          <button onClick={() => setModal(r)} style={{ fontSize: 11, padding: '5px 10px', borderRadius: 4, border: '1px solid #22C55E', background: 'transparent', color: '#22C55E', cursor: 'pointer' }}>✓ Pago</button>
                        )}
                        {!r.checkin && r.status === 'pago' && (
                          <button onClick={() => fazerCheckin(r.id)} style={{ fontSize: 11, padding: '5px 10px', borderRadius: 4, border: '1px solid #3B82F6', background: 'transparent', color: '#3B82F6', cursor: 'pointer' }}>▶ Check-in</button>
                        )}
                        {r.status !== 'cancelado' && (
                          <button onClick={() => cancelar(r.id)} style={{ fontSize: 11, padding: '5px 10px', borderRadius: 4, border: '1px solid #333', background: 'transparent', color: '#555', cursor: 'pointer' }}>✕</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal confirmar pagamento */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#1A1A1A', border: '1px solid #333', borderRadius: 12, padding: '36px', width: '90%', maxWidth: 420 }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 16, color: '#C9A84C', marginBottom: 16 }}>Confirmar Pagamento</div>
            <div style={{ fontSize: 14, color: '#aaa', lineHeight: 1.7, marginBottom: 24 }}>
              Confirmar recebimento de <strong style={{ color: '#fff' }}>R$ 278,00</strong> via InfinitPay para:<br />
              <strong style={{ color: '#E2C97E' }}>{modal.nome}</strong> — {modal.codigo}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, background: 'transparent', border: '1px solid #333', color: '#888', padding: 12, borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Cancelar</button>
              <button onClick={() => confirmarPagamento(modal.id)} style={{ flex: 1, background: '#22C55E', border: 'none', color: '#fff', padding: 12, borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>✓ Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

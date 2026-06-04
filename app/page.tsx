'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

type Vagas = {
  '18:30': { reservadas: number; disponiveis: number }
  '20:30': { reservadas: number; disponiveis: number }
}

type FormData = {
  nome: string
  acompanhante: string
  telefone: string
  email: string
  horario: string
  observacoes: string
}

export default function Home() {
  const [vagas, setVagas] = useState<Vagas | null>(null)
  const [form, setForm] = useState<FormData>({ nome: '', acompanhante: '', telefone: '', email: '', horario: '', observacoes: '' })
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState<{ codigo: string } | null>(null)
  const reservaRef = useRef<HTMLDivElement>(null)

  useEffect(() => { fetchVagas() }, [])

  async function fetchVagas() {
    const res = await fetch('/api/vagas')
    setVagas(await res.json())
  }

  async function handleSubmit() {
    setErro('')
    if (!form.nome.trim()) return setErro('Informe seu nome completo.')
    if (!form.acompanhante.trim()) return setErro('Informe o nome do acompanhante.')
    if (!form.telefone.trim()) return setErro('Informe seu telefone.')
    if (!form.horario) return setErro('Selecione um horário.')
    setLoading(true)
    const res = await fetch('/api/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, observacoes: `Acompanhante: ${form.acompanhante}${form.observacoes ? ' | ' + form.observacoes : ''}` })
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) return setErro(data.error || 'Erro ao criar reserva.')
    setSucesso({ codigo: data.reserva.codigo })
    fetchVagas()
  }

  return (
    <main>
      {/* HERO */}
      <section style={{ background: 'linear-gradient(160deg,#1A0A0A 0%,#3A1010 50%,#1A0A0A 100%)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px 60px', position: 'relative' }}>
        {(['tl','tr','bl','br'] as const).map(pos => (
          <div key={pos} style={{ position: 'absolute', width: 40, height: 40, top: pos.startsWith('t') ? 20 : 'auto', bottom: pos.startsWith('b') ? 20 : 'auto', left: pos.endsWith('l') ? 20 : 'auto', right: pos.endsWith('r') ? 20 : 'auto', borderColor: '#C9A84C', borderStyle: 'solid', borderWidth: pos==='tl'?'2px 0 0 2px':pos==='tr'?'2px 2px 0 0':pos==='bl'?'0 0 2px 2px':'0 2px 2px 0' }} />
        ))}
        <div style={{ color: '#E2C97E', fontSize: 28, letterSpacing: 12, marginBottom: 24, opacity: 0.8 }}>♥ ♥ ♥</div>
        <Image src="/logo.png" alt="Neon Pizzaria" width={280} height={160}
          style={{ objectFit: 'contain', marginBottom: 28, filter: 'drop-shadow(0 0 28px rgba(201,168,76,0.5)) drop-shadow(0 0 60px rgba(139,26,26,0.3))' }}
          priority
        />
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', fontSize:'clamp(52px,8vw,84px)', fontWeight:300, color:'#fff', lineHeight:1.1, marginBottom:8 }}>Dia dos<br/>Namorados</div>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:18, letterSpacing:'0.4em', color:'#C9A84C', marginBottom:12 }}>— 2026 —</div>
        <div style={{ fontSize:13, letterSpacing:'0.2em', color:'rgba(255,255,255,0.5)', textTransform:'uppercase', marginBottom:40 }}>Sexta-feira, 12 de junho de 2026</div>
        <div style={{ background:'rgba(201,168,76,0.12)', border:'1px solid #C9A84C', borderRadius:100, padding:'18px 44px', marginBottom:12 }}>
          <div style={{ fontSize:11, letterSpacing:'0.2em', color:'#E2C97E', textTransform:'uppercase' }}>Menu Especial</div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:52, fontWeight:600, color:'#fff', lineHeight:1.1 }}>R$ 139<span style={{fontSize:26}}>,00</span></div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>por pessoa · R$ 278 por casal</div>
        </div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', fontSize:15, color:'rgba(255,255,255,0.4)', marginBottom:16 }}>1 entrada · 1 prato principal · 1 sobremesa</div>

        {/* Info badges */}
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center', marginBottom:40 }}>
          <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:100, padding:'6px 16px', fontSize:12, color:'rgba(255,255,255,0.5)' }}>
            ⏱ Tolerância de 15 min após o horário
          </div>
          <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:100, padding:'6px 16px', fontSize:12, color:'rgba(255,255,255,0.5)' }}>
            💳 Valor abatido integralmente no consumo
          </div>
        </div>

        <button onClick={() => reservaRef.current?.scrollIntoView({behavior:'smooth'})} style={{ background:'#8B1A1A', color:'#fff', border:'none', borderRadius:4, padding:'18px 52px', fontFamily:"'Cinzel',serif", fontSize:13, letterSpacing:'0.15em', cursor:'pointer', textTransform:'uppercase' }}>
          Garantir Minha Mesa
        </button>
      </section>

      {/* MENU */}
      <section style={{ background:'#F5EDD8', padding:'80px 24px' }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <SectionHeader title="MENU ESPECIAL" sub="Escolha 1 opção de cada categoria por pessoa" />
          <MenuCat title="Entradas" items={[
            {name:'Bruschetta Italiana Tradizionale', desc:'Tomates Confit e molho pesto'},
            {name:'Arancini di Formaggio', desc:'Clássicos bolinhos de risoto com queijo'},
          ]} />
          <MenuCat title="Prato Principal" items={[
            {name:'Pizza Napoletana', desc:'4 fatias · sabores do nosso cardápio'},
            {name:'Risotto ai Funghi e Tartufo', desc:'Risoto cremoso de cogumelos com toque de azeite trufado'},
            {name:'Risotto ai 3 Formaggi', desc:'Risoto cremoso com uma seleção de três queijos'},
            {name:'Massa Carbonara', desc:'Massa al dente com molho cremoso de ovos, parmesão curado e bacon defumado'},
          ]} />
          <MenuCat title="Sobremesas" items={[
            {name:'Petit Gâteau com Gelato', desc:'Bolo de chocolate cremoso com sorvete de creme'},
            {name:'Tiramissu', desc:'Clássica sobremesa italiana com camadas de biscoito embebido em café e creme de mascarpone'},
            {name:'Brownie com Nutella e Sorvete', desc:'Brownie servido com Nutella e sorvete de creme'},
          ]} />
          <p style={{ textAlign:'center', fontSize:11, color:'#aaa', letterSpacing:'0.1em', marginTop:8 }}>*COUVERT OPCIONAL</p>
        </div>
      </section>

      {/* HORÁRIOS */}
      <section style={{ background:'#2A1A1A', padding:'80px 24px' }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <SectionHeader title="HORÁRIOS DE RESERVA" sub="10 mesas por turno · Reserve com antecedência" dark />

          {/* Aviso tolerância */}
          <div style={{ background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:8, padding:'14px 20px', marginBottom:28, textAlign:'center', fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.7 }}>
            ⏱ <strong style={{color:'#E2C97E'}}>Tolerância de 15 minutos</strong> após o horário da reserva.<br/>
            Após esse prazo, a mesa poderá ser liberada para outros clientes.
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            {(['18:30','20:30'] as const).map(h => {
              const disp = vagas?.[h]?.disponiveis ?? 10
              return (
                <div key={h} style={{ border:'1px solid rgba(201,168,76,0.4)', borderRadius:8, padding:'32px 24px', textAlign:'center', position:'relative', opacity:disp===0?0.5:1 }}>
                  {disp===0 && <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:'#8B1A1A', color:'#fff', fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'0.15em', padding:'3px 12px', borderRadius:100 }}>ESGOTADO</div>}
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:36, color:'#E2C97E', marginBottom:8 }}>{h}</div>
                  <div style={{ fontSize:11, letterSpacing:'0.2em', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', marginBottom:16 }}>{h==='18:30'?'Primeiro turno':'Segundo turno'}</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', fontSize:15, color:'rgba(255,255,255,0.6)' }}>
                    <span style={{ fontSize:24, fontWeight:600, color:'#fff', fontStyle:'normal' }}>{disp}</span> mesas disponíveis
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* INCLUSO */}
      <section style={{ background:'#EDE0C4', padding:'60px 24px' }}>
        <div style={{ maxWidth:640, margin:'0 auto' }}>
          <SectionHeader title="INCLUSO NA EXPERIÊNCIA" />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:32 }}>
            {[
              {icon:'💌', text:'Cartão romântico personalizado com foto para os 20 primeiros casais'},
              {icon:'🕯️', text:'Decoração temática com velas em toda a experiência'},
              {icon:'🌹', text:'Mesa decorada com flores para casais com reserva'},
              {icon:'🎵', text:'Playlist especial selecionada para a noite dos namorados'},
            ].map((item,i) => (
              <div key={i} style={{ background:'#fff', borderRadius:8, padding:20, borderLeft:'3px solid #C9A84C' }}>
                <div style={{ fontSize:24, marginBottom:8 }}>{item.icon}</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:'#2A1A1A', lineHeight:1.4 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section ref={reservaRef} style={{ background:'linear-gradient(160deg,#1A0A0A,#150808)', padding:'80px 24px' }}>
        <div style={{ maxWidth:560, margin:'0 auto' }}>
          {!sucesso ? (
            <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(201,168,76,0.3)', borderRadius:12, padding:'48px 40px' }}>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:20, letterSpacing:'0.15em', color:'#C9A84C', textAlign:'center', marginBottom:8 }}>FAZER RESERVA</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', fontSize:15, color:'rgba(255,255,255,0.5)', textAlign:'center', marginBottom:36 }}>Preencha os dados do casal para garantir sua mesa</div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <FField label="Seu nome">
                  <input style={iStyle} placeholder="Seu nome completo" value={form.nome} onChange={e=>setForm(f=>({...f,nome:e.target.value}))} />
                </FField>
                <FField label="Nome do acompanhante">
                  <input style={iStyle} placeholder="Nome do acompanhante" value={form.acompanhante} onChange={e=>setForm(f=>({...f,acompanhante:e.target.value}))} />
                </FField>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <FField label="Telefone / WhatsApp">
                  <input style={iStyle} placeholder="(12) 99999-9999" value={form.telefone} onChange={e=>setForm(f=>({...f,telefone:e.target.value}))} />
                </FField>
                <FField label="E-mail">
                  <input style={iStyle} type="email" placeholder="seu@email.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
                </FField>
              </div>

              <FField label="Horário desejado">
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  {(['18:30','20:30'] as const).map(h => {
                    const disp = vagas?.[h]?.disponiveis ?? 10
                    const esgotado = disp===0
                    const selected = form.horario===h
                    return (
                      <div key={h} onClick={()=>!esgotado&&setForm(f=>({...f,horario:h}))} style={{ border:`1px solid ${selected?'#C9A84C':'rgba(201,168,76,0.25)'}`, background:selected?'rgba(201,168,76,0.1)':'transparent', borderRadius:8, padding:16, textAlign:'center', cursor:esgotado?'not-allowed':'pointer', opacity:esgotado?0.4:1 }}>
                        <div style={{ fontFamily:"'Cinzel',serif", fontSize:22, color:'#E2C97E' }}>{h}</div>
                        <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:4 }}>{esgotado?'Esgotado':`${disp} ${disp===1?'vaga':'vagas'}`}</div>
                      </div>
                    )
                  })}
                </div>
              </FField>

              <FField label="Observações especiais (opcional)">
                <input style={iStyle} placeholder="Ex: aniversário, pedido de casamento, alergia..." value={form.observacoes} onChange={e=>setForm(f=>({...f,observacoes:e.target.value}))} />
              </FField>

              <hr style={{ border:'none', borderTop:'1px solid rgba(201,168,76,0.15)', margin:'24px 0' }} />

              {/* Resumo pagamento */}
              <div style={{ background:'rgba(201,168,76,0.08)', borderRadius:8, padding:20, marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>Total por casal</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:600, color:'#fff' }}>R$ 278,00</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>R$ 139 × 2 pessoas</div>
                </div>
                <div style={{ textAlign:'right', fontSize:11, color:'rgba(255,255,255,0.3)', lineHeight:1.7 }}>Pago via InfinitPay<br/>Abatido no consumo</div>
              </div>

              {/* Aviso tolerância no form */}
              <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:6, padding:'10px 14px', marginBottom:20, fontSize:12, color:'rgba(255,255,255,0.35)', lineHeight:1.7 }}>
                ⏱ Tolerância de <strong style={{color:'rgba(255,255,255,0.5)'}}>15 minutos</strong> após o horário da reserva · O valor pago será <strong style={{color:'rgba(255,255,255,0.5)'}}>abatido integralmente</strong> do seu consumo no dia
              </div>

              {erro && <div style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:6, padding:'10px 16px', marginBottom:16, fontSize:13, color:'#FCA5A5' }}>{erro}</div>}

              <button onClick={handleSubmit} disabled={loading} style={{ width:'100%', background:loading?'#555':'#8B1A1A', color:'#fff', border:'none', borderRadius:6, padding:18, cursor:loading?'not-allowed':'pointer', fontFamily:"'Cinzel',serif", fontSize:13, letterSpacing:'0.15em', textTransform:'uppercase' }}>
                {loading?'Processando...':'Confirmar e Pagar — R$ 278,00'}
              </button>

              <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', textAlign:'center', marginTop:16, lineHeight:1.6 }}>
                Cancelamentos com reembolso total até 48h antes do evento.<br/>
                Após o pagamento você receberá a confirmação por WhatsApp.
              </p>
            </div>
          ) : (
            <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(201,168,76,0.3)', borderRadius:12, padding:'48px 40px', textAlign:'center' }}>
              <div style={{ fontSize:52, marginBottom:16 }}>💌</div>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:22, color:'#C9A84C', marginBottom:8 }}>RESERVA REGISTRADA!</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, color:'rgba(255,255,255,0.7)', lineHeight:1.6, marginBottom:20 }}>
                Sua mesa está garantida. Finalize o pagamento para confirmar.
              </div>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:32, color:'#fff', margin:'20px 0' }}>{sucesso.codigo}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>Guarde este código. Apresente na entrada.</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', marginBottom:24, lineHeight:1.7 }}>
                ⏱ Lembre-se: tolerância de 15 minutos após o horário reservado.<br/>
                💳 O valor pago será abatido integralmente no seu consumo.
              </div>
              <a href={`${process.env.NEXT_PUBLIC_INFINITPAY_LINK || '#'}?ref=${sucesso.codigo}`} target="_blank" rel="noreferrer" style={{ display:'block', background:'#22C55E', color:'#fff', borderRadius:6, padding:'16px 36px', fontFamily:"'Cinzel',serif", fontSize:13, letterSpacing:'0.12em', textDecoration:'none', textAlign:'center' }}>
                💳 Pagar R$ 278,00 via InfinitPay
              </a>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:16, lineHeight:1.6 }}>
                Após o pagamento, nossa equipe confirmará sua reserva pelo WhatsApp em até 2h.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:'#0D0808', padding:'32px 24px', textAlign:'center' }}>
        <Image src="/logo.png" alt="Neon Pizzaria" width={110} height={60} style={{ objectFit:'contain', opacity:0.7 }} />
        <div style={{ fontSize:12, color:'#444', marginTop:16 }}>📱 (12) 92005-7328</div>
      </footer>
    </main>
  )
}

function SectionHeader({title,sub,dark}:{title:string;sub?:string;dark?:boolean}) {
  return (
    <div style={{ textAlign:'center', marginBottom:40 }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, justifyContent:'center', marginBottom:12 }}>
        <span style={{ flex:1, maxWidth:80, height:1, background:'#C9A84C', display:'block' }} />
        <span style={{ color:'#C9A84C', fontSize:10 }}>◆</span>
        <span style={{ flex:1, maxWidth:80, height:1, background:'#C9A84C', display:'block' }} />
      </div>
      <div style={{ fontFamily:"'Cinzel',serif", fontSize:22, letterSpacing:'0.2em', color:dark?'#E2C97E':'#8B1A1A' }}>{title}</div>
      {sub && <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', fontSize:15, color:dark?'rgba(255,255,255,0.4)':'#888', marginTop:8 }}>{sub}</div>}
    </div>
  )
}

function MenuCat({title,items}:{title:string;items:{name:string;desc:string}[]}) {
  return (
    <div style={{ marginBottom:40 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <span style={{ flex:1, height:1, background:'rgba(201,168,76,0.3)' }} />
        <span style={{ fontFamily:"'Cinzel',serif", fontSize:13, letterSpacing:'0.25em', color:'#C9A84C', textTransform:'uppercase' }}>{title}</span>
        <span style={{ flex:1, height:1, background:'rgba(201,168,76,0.3)' }} />
      </div>
      {items.map((item,i) => (
        <div key={i} style={{ textAlign:'center', marginBottom:20, paddingBottom:20, borderBottom:i<items.length-1?'1px dotted rgba(201,168,76,0.3)':'none' }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:'#2A1A1A', marginBottom:4 }}>{item.name}</div>
          <div style={{ fontSize:12, color:'#888', lineHeight:1.5 }}>{item.desc}</div>
        </div>
      ))}
    </div>
  )
}

function FField({label,children}:{label:string;children:React.ReactNode}) {
  return (
    <div style={{ marginBottom:20 }}>
      <label style={{ fontSize:10, letterSpacing:'0.2em', color:'#E2C97E', textTransform:'uppercase', display:'block', marginBottom:8 }}>{label}</label>
      {children}
    </div>
  )
}

const iStyle: React.CSSProperties = {
  width:'100%', background:'rgba(255,255,255,0.06)',
  border:'1px solid rgba(201,168,76,0.25)', borderRadius:6,
  padding:'13px 16px', color:'#fff',
  fontFamily:'Lato,sans-serif', fontSize:14, outline:'none',
}

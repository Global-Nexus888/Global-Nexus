import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const ADMIN_EMAIL = 'brandmkrs.ads@gmail.com'
const ADMIN_PASS  = 'nexus2026'

function getLocalUsers() {
  try { return JSON.parse(localStorage.getItem('gn_users') || '[]') } catch { return [] }
}
function getAdminMessages(): AdminMsg[] {
  try { return JSON.parse(localStorage.getItem('gn_admin_messages') || '[]') } catch { return [] }
}
function saveAdminMessages(msgs: AdminMsg[]) {
  localStorage.setItem('gn_admin_messages', JSON.stringify(msgs))
}

type AdminTab = 'overview' | 'usuarios' | 'mensajeria' | 'suscripciones' | 'verificaciones' | 'asesores' | 'actividad'

interface AdminMsg {
  id: string
  to_email: string
  to_name: string
  subject: string
  body: string
  sent_at: string
  type: 'bienvenida' | 'seguimiento' | 'recordatorio' | 'custom'
}

const C = {
  navy: '#1E3A5F', teal: '#0D9488', tealLight: '#CCFBF1', gold: '#D97706',
  green: '#16A34A', red: '#DC2626', border: '#E2E8F0', bg: '#F8FAFC',
  white: '#FFFFFF', text: '#0F172A', muted: '#64748B', purple: '#7C3AED',
}

const TEMPLATES: { type: AdminMsg['type']; label: string; icon: string; subject: string; body: (name: string) => string }[] = [
  {
    type: 'bienvenida', label: 'Bienvenida', icon: '👋',
    subject: '¡Bienvenido a Global Nexus! 🌐',
    body: (name) => `Hola ${name},\n\n¡Nos alegra mucho que te hayas registrado en Global Nexus! 🎉\n\nSomos la plataforma B2B que conecta productores mexicanos con compradores europeos bajo el acuerdo TLCUEM (0% aranceles).\n\nTu perfil ya está activo y el 28 de agosto de 2026 a las 12:00 pm CDMX tendrás acceso completo a toda la plataforma.\n\nMientras tanto, puedes:\n✅ Completar tu perfil\n✅ Subir tu catálogo de productos\n✅ Agregar tus certificaciones\n\nSi tienes alguna duda, estamos aquí para ayudarte.\n\n¡Bienvenido a la familia Global Nexus!\n\n— Equipo Global Nexus\nhola@global-nexus.business`,
  },
  {
    type: 'seguimiento', label: 'Seguimiento', icon: '📞',
    subject: 'Tu perfil en Global Nexus — ¿Cómo vas? 🚀',
    body: (name) => `Hola ${name},\n\nQueríamos escribirte para ver cómo va todo con tu registro en Global Nexus.\n\n¿Ya tuviste oportunidad de completar tu perfil y subir tu catálogo? Recuerda que entre más información tengas, mejor posicionado estarás el día del lanzamiento el 28 de agosto de 2026.\n\nAlgunos consejos:\n🏆 Agrega tus premios y reconocimientos\n📋 Sube tus certificaciones (NOM, SENASICA, etc.)\n📸 Añade fotos de tus productos\n\nSi necesitas ayuda, responde este correo y con gusto te apoyamos.\n\n— Equipo Global Nexus\nhola@global-nexus.business`,
  },
  {
    type: 'recordatorio', label: 'Recordatorio', icon: '⏰',
    subject: '28 Ago 2026 — ¡Faltan pocos días para el lanzamiento! 🎯',
    body: (name) => `Hola ${name},\n\n¡El lanzamiento de Global Nexus se acerca!\n\n📅 Fecha: 28 de agosto de 2026\n⏰ Hora: 12:00 pm CDMX\n\nEse día tu perfil quedará visible para compradores europeos en toda la plataforma. Asegúrate de que tu información esté completa antes del gran día.\n\nChecklist final:\n☐ Foto de perfil / logo\n☐ Descripción de empresa\n☐ Al menos 3 productos en tu catálogo\n☐ Certificaciones subidas\n☐ Datos de contacto actualizados\n\n¡Te esperamos!\n\n— Equipo Global Nexus\nhola@global-nexus.business`,
  },
]

const PLAN_CHIP: Record<string, { color: string; bg: string }> = {
  productor:  { color: '#0F766E', bg: '#CCFBF1' },
  comprador:  { color: '#1E3A5F', bg: '#EFF6FF' },
  explorador: { color: '#64748B', bg: '#F1F5F9' },
  asesor:     { color: '#7C3AED', bg: '#F3E8FF' },
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [pass, setPass]   = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    setTimeout(() => {
      if (email === ADMIN_EMAIL && pass === ADMIN_PASS) { onLogin() }
      else { setError('Credenciales incorrectas.'); setLoading(false) }
    }, 800)
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: `1.5px solid ${C.border}`, background: C.white,
    fontSize: 14, fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box', color: C.text,
  }

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(160deg, ${C.navy} 0%, #1a4a7a 55%, #0b7a72 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem', boxShadow: '0 8px 32px rgba(0,0,0,.2)' }}>🌐</div>
          <div style={{ color: C.white, fontSize: '1.4rem', fontWeight: 900 }}>Global Nexus</div>
          <div style={{ color: 'rgba(255,255,255,.65)', fontSize: 13, marginTop: 3 }}>Panel de Administración</div>
        </div>
        <div style={{ background: C.white, borderRadius: 20, padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,.25)' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.5rem', color: C.navy, textAlign: 'center' }}>🔐 Acceso restringido</h2>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 5 }}>Email administrador</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 5 }}>Contraseña</label>
              <input type="password" required value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••••" style={inp} />
            </div>
            {error && <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: C.red }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ marginTop: 4, padding: '13px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, color: C.white, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1 }}>
              {loading ? '⏳ Verificando...' : '→ Acceder al panel'}
            </button>
          </form>
          <div style={{ marginTop: '1.25rem', fontSize: 11, color: C.muted, textAlign: 'center' }}>Acceso exclusivo · Global Nexus Admin</div>
        </div>
      </div>
    </div>
  )
}

function Empty({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: C.muted }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 340, margin: '0 auto' }}>{sub}</div>
    </div>
  )
}

function StatCard({ icon, label, value, sub, color }: { icon: string; label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: '1.4rem' }}>{icon}</div>
      <div style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 900, color: color || C.navy, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted }}>{sub}</div>}
    </div>
  )
}

/* ── Contact action buttons ── */
function ContactBtns({ email, phone }: { email?: string; phone?: string }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {email && (
        <a href={`mailto:${email}`} target="_blank" rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, padding: '5px 11px', borderRadius: 8, background: '#EFF6FF', color: C.navy, border: `1px solid #BFDBFE`, textDecoration: 'none' }}>
          ✉️ Enviar email
        </a>
      )}
      {phone && (
        <a href={`https://wa.me/${phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, padding: '5px 11px', borderRadius: 8, background: '#F0FDF4', color: '#16A34A', border: '1px solid #86EFAC', textDecoration: 'none' }}>
          💬 WhatsApp
        </a>
      )}
    </div>
  )
}

export default function AdminPage() {
  const navigate = useNavigate()
  const [auth, setAuth]   = useState(false)
  const [tab, setTab]     = useState<AdminTab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [users, setUsers] = useState<Record<string,unknown>[]>([])
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // User detail panel
  const [selectedUser, setSelectedUser] = useState<Record<string,unknown> | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [userDetail, setUserDetail] = useState<{
    products: Record<string,unknown>[]
    awards: Record<string,unknown>[]
    perfil: Record<string,unknown> | null
    story: Record<string,unknown> | null
  } | null>(null)

  // Messaging
  const [messages, setMessages] = useState<AdminMsg[]>([])
  const [composeFor, setComposeFor] = useState<Record<string,unknown> | null>(null)
  const [msgTemplate, setMsgTemplate] = useState<AdminMsg['type']>('bienvenida')
  const [msgSubject, setMsgSubject] = useState('')
  const [msgBody, setMsgBody] = useState('')
  const [msgSending, setMsgSending] = useState(false)
  const [msgSent, setMsgSent] = useState(false)
  const [msgFilter, setMsgFilter] = useState<'all' | 'productor' | 'comprador'>('all')
  const [msgSearch, setMsgSearch] = useState('')

  const openUser = async (u: Record<string,unknown>) => {
    setSelectedUser(u); setDetailLoading(true); setUserDetail(null)
    const email = String(u.email || '')
    const [{ data: products }, { data: awards }, { data: perfiles }, { data: historia }] = await Promise.all([
      supabase.from('productos').select('*').eq('user_email', email),
      supabase.from('premios').select('*').eq('user_email', email),
      supabase.from('perfiles').select('*').eq('email', email),
      supabase.from('historia').select('*').eq('email', email),
    ])
    setUserDetail({ products: products || [], awards: awards || [], perfil: perfiles?.[0] || null, story: historia?.[0] || null })
    setDetailLoading(false)
  }

  const loadUsers = async () => {
    try {
      const { data: sbUsers } = await supabase.from('usuarios').select('*').order('created_at', { ascending: false })
      if (sbUsers && sbUsers.length > 0) {
        const { data: prods } = await supabase.from('productos').select('user_email')
        const countMap: Record<string, number> = {}
        ;(prods || []).forEach((p: { user_email: string }) => { countMap[p.user_email] = (countMap[p.user_email] || 0) + 1 })
        setUsers(sbUsers.map(u => ({ ...u, productCount: countMap[u.email] || 0 })))
      } else {
        setUsers(getLocalUsers())
      }
    } catch { setUsers(getLocalUsers()) }
    setLastRefresh(new Date())
  }

  useEffect(() => {
    if (!auth) return
    loadUsers()
    setMessages(getAdminMessages())
    const iv = setInterval(loadUsers, 30000)
    return () => clearInterval(iv)
  }, [auth])

  // When compose target changes, prefill template
  const openCompose = (u: Record<string,unknown>, type: AdminMsg['type'] = 'bienvenida') => {
    setComposeFor(u)
    setMsgTemplate(type)
    const tpl = TEMPLATES.find(t => t.type === type)!
    const name = String(u.name || u.company || 'estimado usuario')
    setMsgSubject(tpl.subject)
    setMsgBody(tpl.body(name))
    setMsgSent(false)
  }

  const handleTemplateChange = (type: AdminMsg['type']) => {
    setMsgTemplate(type)
    if (!composeFor) return
    const tpl = TEMPLATES.find(t => t.type === type)!
    const name = String(composeFor.name || composeFor.company || 'estimado usuario')
    setMsgSubject(tpl.subject)
    setMsgBody(tpl.body(name))
  }

  const sendMessage = () => {
    if (!composeFor || !msgSubject || !msgBody) return
    setMsgSending(true)
    setTimeout(() => {
      const msg: AdminMsg = {
        id: Date.now().toString(),
        to_email: String(composeFor.email || ''),
        to_name: String(composeFor.name || composeFor.company || ''),
        subject: msgSubject,
        body: msgBody,
        sent_at: new Date().toISOString(),
        type: msgTemplate,
      }
      const updated = [msg, ...messages]
      setMessages(updated)
      saveAdminMessages(updated)
      // Try to save to Supabase (non-blocking)
      supabase.from('mensajes_admin' as never).insert([{ ...msg }]).then(() => {}).catch(() => {})
      setMsgSending(false)
      setMsgSent(true)
    }, 900)
  }

  if (!auth) return <AdminLogin onLogin={() => setAuth(true)} />

  const totalUsers    = users.length
  const totalProd     = users.filter(u => u.role === 'productor').length
  const totalBuyers   = users.filter(u => u.role === 'comprador').length
  const totalAsesores = users.filter(u => u.role === 'asesor').length

  const navItems: { id: AdminTab; label: string; icon: string; badge?: number }[] = [
    { id: 'overview',       label: 'Dashboard',      icon: '📊' },
    { id: 'usuarios',       label: 'Usuarios',       icon: '👥', badge: totalUsers || undefined },
    { id: 'mensajeria',     label: 'Mensajería',     icon: '✉️', badge: messages.length || undefined },
    { id: 'suscripciones',  label: 'Suscripciones',  icon: '💳' },
    { id: 'verificaciones', label: 'Verificaciones', icon: '🛡️' },
    { id: 'asesores',       label: 'Asesores',       icon: '🎓', badge: totalAsesores || undefined },
    { id: 'actividad',      label: 'Actividad',      icon: '⚡' },
  ]

  const SidebarBtn = ({ item }: { item: typeof navItems[0] }) => (
    <button onClick={() => { setTab(item.id); setSidebarOpen(false) }}
      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 3, textAlign: 'left', background: tab === item.id ? `${C.teal}15` : 'transparent', color: tab === item.id ? C.teal : C.muted }}>
      <span style={{ fontSize: '1rem' }}>{item.icon}</span>
      <span style={{ fontSize: 14, fontWeight: tab === item.id ? 700 : 500, flex: 1 }}>{item.label}</span>
      {item.badge !== undefined && (
        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: tab === item.id ? C.teal : C.border, color: tab === item.id ? C.white : C.muted }}>{item.badge}</span>
      )}
    </button>
  )

  const fmtDate = (u: Record<string,unknown>) =>
    u.created_at ? new Date(String(u.created_at)).toLocaleDateString('es-MX')
    : u.createdAt ? new Date(String(u.createdAt)).toLocaleDateString('es-MX') : '—'

  const inp: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${C.border}`,
    background: C.white, fontSize: 13, fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box', color: C.text,
  }

  // Filtered users for messaging tab
  const filteredUsers = users.filter(u => {
    if (msgFilter !== 'all' && u.role !== msgFilter) return false
    if (msgSearch) {
      const q = msgSearch.toLowerCase()
      return String(u.name || '').toLowerCase().includes(q) ||
             String(u.email || '').toLowerCase().includes(q) ||
             String(u.company || '').toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: C.bg, position: 'relative' }}>

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)', zIndex: 40 }} />}

      {/* SIDEBAR */}
      <div style={{ width: 240, background: C.white, display: 'flex', flexDirection: 'column', flexShrink: 0, borderRight: `1px solid ${C.border}`, position: 'fixed', top: 0, bottom: 0, zIndex: 50, boxShadow: '2px 0 12px rgba(0,0,0,.04)' }}>
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🌐</div>
            <div>
              <div style={{ color: C.navy, fontWeight: 900, fontSize: '0.9rem' }}>Global Nexus</div>
              <div style={{ color: C.muted, fontSize: 10, fontWeight: 600, letterSpacing: '.04em' }}>ADMIN PANEL</div>
            </div>
          </div>
        </div>
        <div style={{ margin: '1rem .75rem', background: `linear-gradient(135deg, ${C.teal}18, ${C.navy}12)`, border: `1px solid ${C.teal}30`, borderRadius: 10, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.teal, letterSpacing: '.05em', marginBottom: 3 }}>🚀 LANZAMIENTO</div>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.navy }}>28 Ago 2026 · 12:00 CDMX</div>
        </div>
        <nav style={{ padding: '0.5rem 0.75rem', flex: 1 }}>
          {navItems.map(item => <SidebarBtn key={item.id} item={item} />)}
        </nav>
        <div style={{ padding: '1rem 1.25rem', borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem' }}>👑</div>
            <div>
              <div style={{ color: C.text, fontSize: 12, fontWeight: 600 }}>Administrador</div>
              <div style={{ color: C.muted, fontSize: 10 }}>brandmkrs.ads@gmail.com</div>
            </div>
          </div>
          <button onClick={() => navigate('/')} style={{ width: '100%', padding: '8px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, color: C.white, fontSize: 12, fontWeight: 700, cursor: 'pointer', marginBottom: 6 }}>🌐 Ir a la plataforma</button>
          <button onClick={() => setAuth(false)} style={{ width: '100%', padding: '7px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, fontSize: 12, cursor: 'pointer' }}>Cerrar sesión</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, overflowY: 'auto', background: C.bg, marginLeft: 240 }}>
        <div style={{ padding: '1rem 2rem', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.white, boxShadow: '0 1px 6px rgba(0,0,0,.04)' }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.05rem', color: C.navy }}>{navItems.find(n => n.id === tab)?.icon} {navItems.find(n => n.id === tab)?.label}</h1>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 1 }}>{new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: C.muted }}>Actualizado: {lastRefresh.toLocaleTimeString('es-MX')}</span>
            <button onClick={loadUsers} style={{ fontSize: 12, padding: '7px 14px', borderRadius: 8, background: `${C.teal}12`, color: C.teal, fontWeight: 700, border: `1px solid ${C.teal}30`, cursor: 'pointer' }}>↻ Actualizar</button>
          </div>
        </div>

        <div style={{ padding: '1.5rem 2rem' }}>

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: `linear-gradient(135deg, ${C.navy}, #1a4a7a)`, borderRadius: 14, padding: '1.5rem 2rem', color: C.white, display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#5EEAD4', letterSpacing: '.08em', marginBottom: 6 }}>🚀 PRE-LANZAMIENTO — MODO REGISTRO</div>
                  <div style={{ fontSize: 'clamp(1rem,2.5vw,1.25rem)', fontWeight: 800, marginBottom: 4 }}>Esperando los primeros registros</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', lineHeight: 1.6 }}>
                    Los perfiles se activarán automáticamente el <strong style={{ color: '#5EEAD4' }}>28 de agosto de 2026 a las 12:00 pm CDMX</strong>.
                  </div>
                </div>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#5EEAD4' }}>{totalUsers}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.65)' }}>registros guardados</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '1rem' }}>
                <StatCard icon="👥" label="Total registros" value={totalUsers} color={C.navy} />
                <StatCard icon="🏭" label="Productores MX" value={totalProd} color={C.teal} />
                <StatCard icon="🇪🇺" label="Compradores EU" value={totalBuyers} color="#1E40AF" />
                <StatCard icon="🎓" label="Asesores Pro" value={totalAsesores} color={C.purple} />
                <StatCard icon="✉️" label="Mensajes enviados" value={messages.length} color={C.gold} />
                <StatCard icon="💳" label="MRR (USD)" value="$0" sub="Se activa el 28 Ago" color={C.green} />
              </div>
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: '1rem' }}>Últimos registros</h3>
                {users.length === 0
                  ? <Empty icon="📋" title="Sin registros todavía" sub="Los primeros usuarios aparecerán aquí en tiempo real." />
                  : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {users.slice(0, 8).map((u, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px', background: C.bg, borderRadius: 10 }}>
                          <div onClick={() => openUser(u)} style={{ width: 36, height: 36, borderRadius: 10, background: `${C.teal}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0, cursor: 'pointer' }}>
                            {u.role === 'productor' ? '🏭' : u.role === 'asesor' ? '🎓' : '🇪🇺'}
                          </div>
                          <div onClick={() => openUser(u)} style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{String(u.name || u.company || '')}</div>
                            <div style={{ fontSize: 11, color: C.muted }}>{String(u.email || '')}</div>
                          </div>
                          <div style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: PLAN_CHIP[String(u.role)]?.bg || C.bg, color: PLAN_CHIP[String(u.role)]?.color || C.muted }}>{String(u.role || '')}</div>
                          <button onClick={() => { setTab('mensajeria'); openCompose(u) }} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 7, border: `1px solid ${C.teal}40`, background: `${C.teal}08`, color: C.teal, cursor: 'pointer', fontWeight: 600, flexShrink: 0 }}>✉️ Mensaje</button>
                          <div style={{ fontSize: 11, color: C.muted, flexShrink: 0 }}>{fmtDate(u)}</div>
                        </div>
                      ))}
                    </div>
                }
              </div>
            </div>
          )}

          {/* USUARIOS */}
          {tab === 'usuarios' && (
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: '1rem' }}>Usuarios registrados ({totalUsers}) — haz clic para ver detalle</h3>
              {users.length === 0
                ? <Empty icon="👥" title="Sin usuarios todavía" sub="Los usuarios registrados en global-nexus.business aparecerán aquí." />
                : <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: C.bg }}>
                          {['Nombre / Empresa', 'Contacto', 'Rol', 'Ubicación', 'Prods.', 'Registro', 'Acciones'].map(h => (
                            <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: C.muted, fontSize: 12, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, i) => (
                          <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}
                            onMouseEnter={e => (e.currentTarget.style.background = C.bg)}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                            <td style={{ padding: '12px 14px', cursor: 'pointer' }} onClick={() => openUser(u)}>
                              <div style={{ fontWeight: 600, color: C.text }}>{String(u.name || '')}</div>
                              {u.company && <div style={{ fontSize: 11, color: C.muted }}>{String(u.company)}</div>}
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              <div style={{ fontSize: 12, color: C.navy, fontWeight: 600 }}>{String(u.email || '')}</div>
                              {u.phone && (
                                <a href={`https://wa.me/${String(u.phone).replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                                  style={{ fontSize: 11, color: C.green, fontWeight: 600, textDecoration: 'none' }}>
                                  💬 {String(u.phone)}
                                </a>
                              )}
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: u.role === 'productor' ? C.tealLight : u.role === 'asesor' ? '#F3E8FF' : '#EFF6FF', color: u.role === 'productor' ? '#0F766E' : u.role === 'asesor' ? C.purple : C.navy }}>
                                {u.role === 'productor' ? '🏭 Productor' : u.role === 'asesor' ? '🎓 Asesor' : '🇪🇺 Comprador'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 14px', color: C.muted, fontSize: 12 }}>
                              <div>{String(u.state || '—')}</div>
                              {u.country && u.country !== 'México' && <div style={{ fontSize: 11 }}>{String(u.country)}</div>}
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700, fontSize: 14, color: Number(u.productCount) > 0 ? C.teal : C.muted }}>{Number(u.productCount) || 0}</td>
                            <td style={{ padding: '12px 14px', color: C.muted, fontSize: 12, whiteSpace: 'nowrap' }}>{fmtDate(u)}</td>
                            <td style={{ padding: '12px 14px' }}>
                              <div style={{ display: 'flex', gap: 5 }}>
                                <button onClick={() => openUser(u)} style={{ fontSize: 11, padding: '4px 9px', borderRadius: 7, border: `1px solid ${C.border}`, background: 'transparent', color: C.teal, cursor: 'pointer', fontWeight: 600 }}>Ver</button>
                                <button onClick={() => { setTab('mensajeria'); openCompose(u) }} style={{ fontSize: 11, padding: '4px 9px', borderRadius: 7, border: `1px solid ${C.teal}40`, background: `${C.teal}08`, color: C.teal, cursor: 'pointer', fontWeight: 600 }}>✉️</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              }
            </div>
          )}

          {/* MENSAJERÍA */}
          {tab === 'mensajeria' && (
            <div style={{ display: 'grid', gridTemplateColumns: composeFor ? '1fr 1fr' : '1fr', gap: '1.25rem' }}>

              {/* Left — User list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Filters */}
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: 10 }}>📋 Seleccionar destinatario</div>
                  <input value={msgSearch} onChange={e => setMsgSearch(e.target.value)} placeholder="Buscar por nombre o email..." style={{ ...inp, marginBottom: 8 }} />
                  <div style={{ display: 'flex', gap: 6 }}>
                    {(['all','productor','comprador'] as const).map(f => (
                      <button key={f} onClick={() => setMsgFilter(f)} style={{ flex: 1, padding: '6px', fontSize: 11, fontWeight: 700, borderRadius: 7, border: 'none', cursor: 'pointer', background: msgFilter === f ? C.teal : C.bg, color: msgFilter === f ? C.white : C.muted }}>
                        {f === 'all' ? 'Todos' : f === 'productor' ? '🏭 Prod.' : '🇪🇺 Comp.'}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
                  {filteredUsers.length === 0
                    ? <Empty icon="👥" title="Sin usuarios" sub="Registra usuarios para enviarles mensajes." />
                    : filteredUsers.map((u, i) => {
                        const sentToUser = messages.filter(m => m.to_email === String(u.email)).length
                        const isSelected = composeFor?.email === u.email
                        return (
                          <div key={i} onClick={() => openCompose(u)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderBottom: `1px solid ${C.border}`, cursor: 'pointer', background: isSelected ? `${C.teal}08` : 'transparent', borderLeft: isSelected ? `3px solid ${C.teal}` : '3px solid transparent' }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: u.role === 'productor' ? C.tealLight : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                              {u.role === 'productor' ? '🏭' : u.role === 'asesor' ? '🎓' : '🇪🇺'}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{String(u.name || u.company || '')}</div>
                              <div style={{ fontSize: 11, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{String(u.email || '')}</div>
                            </div>
                            {sentToUser > 0 && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: `${C.teal}15`, color: C.teal }}>{sentToUser} enviado{sentToUser > 1 ? 's' : ''}</span>}
                          </div>
                        )
                      })
                  }
                </div>

                {/* Sent messages history */}
                {messages.length > 0 && (
                  <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: 10 }}>📬 Mensajes enviados ({messages.length})</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 300, overflowY: 'auto' }}>
                      {messages.map((m, i) => (
                        <div key={i} style={{ background: C.bg, borderRadius: 10, padding: '10px 12px', fontSize: 12 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                            <div style={{ fontWeight: 700, color: C.navy }}>{m.to_name}</div>
                            <div style={{ fontSize: 10, color: C.muted }}>{new Date(m.sent_at).toLocaleDateString('es-MX')}</div>
                          </div>
                          <div style={{ color: C.muted }}>{m.subject}</div>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: m.type === 'bienvenida' ? '#EFF6FF' : m.type === 'seguimiento' ? C.tealLight : '#FEF9C3', color: m.type === 'bienvenida' ? C.navy : m.type === 'seguimiento' ? C.teal : C.gold, marginTop: 4, display: 'inline-block' }}>
                            {TEMPLATES.find(t => t.type === m.type)?.icon} {m.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right — Compose */}
              {composeFor && (
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* To */}
                  <div style={{ background: C.bg, borderRadius: 10, padding: '12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: composeFor.role === 'productor' ? C.tealLight : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                      {composeFor.role === 'productor' ? '🏭' : '🇪🇺'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{String(composeFor.name || composeFor.company || '')}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{String(composeFor.email || '')}</div>
                    </div>
                    <ContactBtns email={String(composeFor.email || '')} phone={composeFor.phone ? String(composeFor.phone) : undefined} />
                    <button onClick={() => { setComposeFor(null); setMsgSent(false) }} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${C.border}`, background: 'transparent', cursor: 'pointer', color: C.muted, fontSize: '.9rem' }}>✕</button>
                  </div>

                  {/* Templates */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 7 }}>PLANTILLA</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {TEMPLATES.map(t => (
                        <button key={t.type} onClick={() => handleTemplateChange(t.type)}
                          style={{ flex: 1, padding: '7px 4px', fontSize: 11, fontWeight: 700, borderRadius: 8, border: `1.5px solid ${msgTemplate === t.type ? C.teal : C.border}`, cursor: 'pointer', background: msgTemplate === t.type ? `${C.teal}12` : 'transparent', color: msgTemplate === t.type ? C.teal : C.muted }}>
                          {t.icon} {t.label}
                        </button>
                      ))}
                      <button onClick={() => { setMsgTemplate('custom'); setMsgSubject(''); setMsgBody('') }}
                        style={{ flex: 1, padding: '7px 4px', fontSize: 11, fontWeight: 700, borderRadius: 8, border: `1.5px solid ${msgTemplate === 'custom' ? C.navy : C.border}`, cursor: 'pointer', background: msgTemplate === 'custom' ? `${C.navy}08` : 'transparent', color: msgTemplate === 'custom' ? C.navy : C.muted }}>
                        ✏️ Libre
                      </button>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 5 }}>ASUNTO</div>
                    <input value={msgSubject} onChange={e => setMsgSubject(e.target.value)} style={inp} placeholder="Asunto del mensaje" />
                  </div>

                  {/* Body */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 5 }}>MENSAJE</div>
                    <textarea value={msgBody} onChange={e => setMsgBody(e.target.value)}
                      style={{ ...inp, minHeight: 260, resize: 'vertical', lineHeight: 1.6 }} placeholder="Escribe tu mensaje aquí..." />
                  </div>

                  {msgSent
                    ? <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: C.green, fontWeight: 700, textAlign: 'center' }}>
                        ✅ Mensaje registrado y guardado correctamente.
                        <div style={{ fontSize: 11, fontWeight: 400, marginTop: 4, color: C.muted }}>Usa el botón de email o WhatsApp para enviarlo directamente al usuario.</div>
                      </div>
                    : <div style={{ display: 'flex', gap: 8 }}>
                        <a href={`mailto:${String(composeFor.email || '')}?subject=${encodeURIComponent(msgSubject)}&body=${encodeURIComponent(msgBody)}`}
                          target="_blank" rel="noreferrer"
                          style={{ flex: 1, padding: '10px', borderRadius: 9, background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, color: C.white, fontWeight: 700, fontSize: 13, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'block' }}
                          onClick={sendMessage}>
                          ✉️ Enviar por Email
                        </a>
                        {composeFor.phone && (
                          <a href={`https://wa.me/${String(composeFor.phone).replace(/\D/g,'')}?text=${encodeURIComponent(msgSubject + '\n\n' + msgBody)}`}
                            target="_blank" rel="noreferrer" onClick={sendMessage}
                            style={{ padding: '10px 16px', borderRadius: 9, background: '#25D366', color: C.white, fontWeight: 700, fontSize: 13, cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                            💬 WhatsApp
                          </a>
                        )}
                        <button onClick={sendMessage} disabled={msgSending || !msgSubject || !msgBody}
                          style={{ padding: '10px 14px', borderRadius: 9, border: `1px solid ${C.border}`, background: C.bg, color: C.muted, fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                          {msgSending ? '⏳' : '💾 Guardar'}
                        </button>
                      </div>
                  }
                </div>
              )}

              {/* Empty compose state */}
              {!composeFor && (
                <div style={{ background: C.white, border: `2px dashed ${C.border}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Empty icon="✉️" title="Selecciona un destinatario" sub="Haz clic en cualquier usuario de la lista para abrir el compositor de mensajes." />
                </div>
              )}
            </div>
          )}

          {/* SUSCRIPCIONES */}
          {tab === 'suscripciones' && (
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: '1rem' }}>Suscripciones activas</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <StatCard icon="💳" label="Suscripciones activas" value={0} color={C.green} />
                <StatCard icon="💰" label="MRR (USD)" value="$0" sub="Se activa el 28 Ago 2026" color={C.teal} />
                <StatCard icon="⏳" label="Pre-registros pagados" value={0} color={C.navy} />
              </div>
              <Empty icon="💳" title="Sin suscripciones todavía" sub="Las suscripciones de Stripe aparecerán aquí automáticamente." />
            </div>
          )}

          {/* VERIFICACIONES */}
          {tab === 'verificaciones' && (
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: '1rem' }}>Documentos pendientes de revisión</h3>
              <Empty icon="🛡️" title="Sin documentos pendientes" sub="Cuando los usuarios suban sus certificaciones aparecerán aquí." />
            </div>
          )}

          {/* ASESORES */}
          {tab === 'asesores' && (
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: 4 }}>Asesores Profesionales</h3>
              {users.filter(u => u.role === 'asesor').length === 0
                ? <Empty icon="🎓" title="Sin asesores registrados" sub="Los asesores registrados aparecerán aquí." />
                : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {users.filter(u => u.role === 'asesor').map((u, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, padding: '12px', background: C.bg, borderRadius: 10, alignItems: 'center' }}>
                        <div onClick={() => openUser(u)} style={{ width: 40, height: 40, borderRadius: 10, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', cursor: 'pointer' }}>🎓</div>
                        <div onClick={() => openUser(u)} style={{ flex: 1, cursor: 'pointer' }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{String(u.name || '')}</div>
                          <div style={{ fontSize: 12, color: C.muted }}>{String(u.email || '')} · {String(u.company || '')}</div>
                        </div>
                        <button onClick={() => { setTab('mensajeria'); openCompose(u) }} style={{ fontSize: 11, padding: '5px 12px', borderRadius: 8, border: `1px solid ${C.teal}40`, background: `${C.teal}08`, color: C.teal, cursor: 'pointer', fontWeight: 600 }}>✉️ Mensaje</button>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: '#F3E8FF', color: C.purple }}>Asesor Pro</span>
                      </div>
                    ))}
                  </div>
              }
            </div>
          )}

          {/* ACTIVIDAD */}
          {tab === 'actividad' && (
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: '1rem' }}>Log de actividad de la plataforma</h3>
              {messages.length > 0
                ? <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {messages.map((m, i) => (
                      <div key={i} style={{ background: C.bg, borderRadius: 10, padding: '10px 14px', fontSize: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ fontSize: '1.2rem' }}>✉️</span>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: 600, color: C.navy }}>Mensaje enviado</span> a <span style={{ color: C.teal }}>{m.to_name}</span> ({m.to_email})
                          <div style={{ color: C.muted, marginTop: 2 }}>{m.subject}</div>
                        </div>
                        <div style={{ fontSize: 11, color: C.muted, flexShrink: 0 }}>{new Date(m.sent_at).toLocaleString('es-MX')}</div>
                      </div>
                    ))}
                  </div>
                : <Empty icon="⚡" title="Sin actividad todavía" sub="El historial de registros y acciones aparecerá aquí en tiempo real." />
              }
            </div>
          )}

        </div>
      </div>

      {/* USER DETAIL PANEL */}
      {selectedUser && (
        <div onClick={() => setSelectedUser(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 540, maxHeight: '95vh', overflowY: 'auto', background: C.white, borderRadius: 18, boxShadow: '0 24px 80px rgba(0,0,0,.25)' }}>
            {/* Header */}
            <div style={{ padding: '1.5rem', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: selectedUser.role === 'productor' ? C.tealLight : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
                {selectedUser.role === 'productor' ? '🏭' : selectedUser.role === 'asesor' ? '🎓' : '🇪🇺'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: C.navy }}>{String(selectedUser.name || '')}</div>
                {selectedUser.company && <div style={{ fontSize: 13, color: C.muted }}>{String(selectedUser.company)}</div>}
                <div style={{ fontSize: 11, color: C.teal, marginTop: 2 }}>{String(selectedUser.email || '')}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button onClick={() => { setSelectedUser(null); setTab('mensajeria'); openCompose(selectedUser) }}
                  style={{ fontSize: 11, padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.teal}`, background: `${C.teal}10`, color: C.teal, cursor: 'pointer', fontWeight: 700 }}>✉️ Mensaje</button>
                <button onClick={() => setSelectedUser(null)} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: 'transparent', cursor: 'pointer', fontSize: '1rem', color: C.muted }}>✕</button>
              </div>
            </div>

            {/* Contact bar */}
            <div style={{ padding: '1rem 1.5rem', background: `${C.bg}`, borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.muted }}>CONTACTO RÁPIDO:</span>
              <ContactBtns email={String(selectedUser.email || '')} phone={selectedUser.phone ? String(selectedUser.phone) : undefined} />
              {!selectedUser.phone && <span style={{ fontSize: 11, color: C.muted, fontStyle: 'italic' }}>Sin teléfono registrado</span>}
            </div>

            {/* Body */}
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Info grid */}
              <div style={{ background: C.bg, borderRadius: 12, padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Rol',          value: String(selectedUser.role || '—') },
                  { label: 'Plan',         value: String(selectedUser.plan || 'explorador') },
                  { label: 'Estado / Prov', value: String(selectedUser.state || '—') },
                  { label: 'País',         value: String(selectedUser.country || 'México') },
                  { label: 'Categoría',    value: String(selectedUser.category || '—') },
                  { label: 'Interés / Producto buscado', value: String(selectedUser.interest || '—') },
                  { label: 'Teléfono / WhatsApp', value: String(selectedUser.phone || '—') },
                  { label: 'Registro',     value: selectedUser.created_at ? new Date(String(selectedUser.created_at)).toLocaleString('es-MX') : '—' },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 2 }}>{f.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{f.value}</div>
                  </div>
                ))}
              </div>

              {detailLoading
                ? <div style={{ textAlign: 'center', padding: '2rem', color: C.muted, fontSize: 13 }}>⏳ Cargando información...</div>
                : userDetail && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Perfil */}
                    {userDetail.perfil && (
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 12, color: C.navy, marginBottom: 8 }}>📋 Perfil completo</div>
                        <div style={{ background: C.bg, borderRadius: 10, padding: '0.875rem', fontSize: 12, color: C.muted, display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {userDetail.perfil.bio && <div><b>Bio:</b> {String(userDetail.perfil.bio)}</div>}
                          {userDetail.perfil.location && <div><b>Ubicación:</b> {String(userDetail.perfil.location)}</div>}
                          {userDetail.perfil.phone && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <b>Tel:</b> {String(userDetail.perfil.phone)}
                              <a href={`https://wa.me/${String(userDetail.perfil.phone).replace(/\D/g,'')}`} target="_blank" rel="noreferrer" style={{ fontSize: 11, fontWeight: 700, color: C.green, textDecoration: 'none' }}>💬 WA</a>
                            </div>
                          )}
                          {userDetail.perfil.website && <div><b>Web:</b> <a href={String(userDetail.perfil.website)} target="_blank" rel="noreferrer" style={{ color: C.teal }}>{String(userDetail.perfil.website)}</a></div>}
                        </div>
                      </div>
                    )}
                    {/* Catálogo */}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12, color: C.navy, marginBottom: 8 }}>📦 Catálogo ({userDetail.products.length} productos)</div>
                      {userDetail.products.length === 0
                        ? <div style={{ fontSize: 12, color: C.muted, fontStyle: 'italic' }}>Sin productos registrados aún.</div>
                        : userDetail.products.map((p, i) => (
                          <div key={i} style={{ background: C.bg, borderRadius: 10, padding: '0.875rem', marginBottom: 6, fontSize: 12 }}>
                            <div style={{ fontWeight: 700, color: C.navy, marginBottom: 3 }}>{String(p.name || '')}</div>
                            <div style={{ color: C.teal, fontSize: 11, marginBottom: 4 }}>{String(p.category || '')}{p.origin ? ` · ${p.origin}` : ''}</div>
                            {p.price && <div style={{ color: C.muted }}><b>Precio:</b> ${String(p.price)} / {String(p.unit || '')}</div>}
                            {p.min_order && <div style={{ color: C.muted }}><b>MOQ:</b> {String(p.min_order)}</div>}
                            {p.description && <div style={{ color: C.muted, marginTop: 4 }}>{String(p.description)}</div>}
                            {Array.isArray(p.cert_docs) && (p.cert_docs as unknown[]).length > 0 && (
                              <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {(p.cert_docs as Record<string,unknown>[]).map((c, ci) => (
                                  <span key={ci} style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: '#F0FDF4', border: '1px solid #86EFAC', color: C.green }}>✓ {String(c.name || '')}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      }
                    </div>
                    {/* Premios */}
                    {userDetail.awards.length > 0 && (
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 12, color: C.navy, marginBottom: 8 }}>🏆 Premios ({userDetail.awards.length})</div>
                        {userDetail.awards.map((a, i) => (
                          <div key={i} style={{ background: C.bg, borderRadius: 10, padding: '0.875rem', marginBottom: 6, fontSize: 12 }}>
                            <div style={{ fontWeight: 700, color: C.navy }}>{String(a.name || '')}</div>
                            <div style={{ color: C.muted, fontSize: 11 }}>{String(a.org || '')} · {String(a.year || '')}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Historia */}
                    {userDetail.story && (userDetail.story.vision || userDetail.story.history) && (
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 12, color: C.navy, marginBottom: 8 }}>📖 Historia</div>
                        <div style={{ background: C.bg, borderRadius: 10, padding: '0.875rem', fontSize: 12, color: C.muted, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {userDetail.story.vision && <div><b>Visión:</b> {String(userDetail.story.vision)}</div>}
                          {userDetail.story.tradition && <div><b>Tradición:</b> {String(userDetail.story.tradition)}</div>}
                          {userDetail.story.history && <div><b>Historia:</b> {String(userDetail.story.history)}</div>}
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              {/* Message history for this user */}
              {messages.filter(m => m.to_email === String(selectedUser.email)).length > 0 && (
                <div>
                  <div style={{ fontWeight: 700, fontSize: 12, color: C.navy, marginBottom: 8 }}>✉️ Mensajes enviados a este usuario</div>
                  {messages.filter(m => m.to_email === String(selectedUser.email)).map((m, i) => (
                    <div key={i} style={{ background: `${C.teal}08`, border: `1px solid ${C.teal}20`, borderRadius: 10, padding: '10px 12px', marginBottom: 6, fontSize: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <div style={{ fontWeight: 700, color: C.navy }}>{m.subject}</div>
                        <div style={{ fontSize: 10, color: C.muted }}>{new Date(m.sent_at).toLocaleDateString('es-MX')}</div>
                      </div>
                      <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{m.body.substring(0, 120)}...</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/* ─── Credentials ─── */
const ADMIN_EMAIL = 'brandmkrs.ads@gmail.com'
const ADMIN_PASS  = 'nexus2026'

/* ─── LOCAL fallback ─── */
function getLocalUsers() {
  try { return JSON.parse(localStorage.getItem('gn_users') || '[]') } catch { return [] }
}

/* ─── Types ─── */
type AdminTab = 'overview' | 'usuarios' | 'suscripciones' | 'verificaciones' | 'asesores' | 'actividad'

/* ─── Color tokens ─── */
const C = {
  navy:     '#1E3A5F',
  teal:     '#0D9488',
  tealLight:'#CCFBF1',
  gold:     '#D97706',
  green:    '#16A34A',
  red:      '#DC2626',
  border:   '#E2E8F0',
  bg:       '#F8FAFC',
  white:    '#FFFFFF',
  text:     '#0F172A',
  muted:    '#64748B',
}

const PLAN_CHIP: Record<string, { color: string; bg: string; label: string }> = {
  pro:        { color: '#0F766E', bg: '#CCFBF1', label: 'Pro Exportador' },
  comprador:  { color: '#1E3A5F', bg: '#EFF6FF', label: 'Comprador EU' },
  explorador: { color: '#64748B', bg: '#F1F5F9', label: 'Explorador' },
  asesor:     { color: '#7C3AED', bg: '#F3E8FF', label: 'Asesor Pro' },
}

/* ──────────────────────────────────────────
   LOGIN SCREEN
────────────────────────────────────────── */
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [pass,  setPass]  = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    setTimeout(() => {
      if (email === ADMIN_EMAIL && pass === ADMIN_PASS) { onLogin() }
      else { setError('Credenciales incorrectas. Solo administradores autorizados.'); setLoading(false) }
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
          <div style={{ color: C.white, fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-.02em' }}>Global Nexus</div>
          <div style={{ color: 'rgba(255,255,255,.65)', fontSize: 13, marginTop: 3 }}>Panel de Administración</div>
        </div>

        <div style={{ background: C.white, borderRadius: 20, padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,.25)' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.5rem', color: C.navy, textAlign: 'center' }}>🔐 Acceso restringido</h2>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 5 }}>Email administrador</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@nexusstrategy.online" style={inp} />
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
          <div style={{ marginTop: '1.25rem', fontSize: 11, color: C.muted, textAlign: 'center' }}>
            Acceso exclusivo · Global Nexus Admin
          </div>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────
   EMPTY STATE
────────────────────────────────────────── */
function Empty({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: C.muted }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 340, margin: '0 auto' }}>{sub}</div>
    </div>
  )
}

/* ──────────────────────────────────────────
   STAT CARD
────────────────────────────────────────── */
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

/* ──────────────────────────────────────────
   MAIN ADMIN PAGE
────────────────────────────────────────── */
export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [tab,  setTab]  = useState<AdminTab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [users, setUsers] = useState<Record<string,unknown>[]>([])
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const loadUsers = async () => {
    try {
      // Load users from Supabase
      const { data: sbUsers } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false })

      if (sbUsers && sbUsers.length > 0) {
        // Also load product counts
        const { data: prods } = await supabase.from('productos').select('user_email')
        const countMap: Record<string, number> = {}
        ;(prods || []).forEach((p: { user_email: string }) => {
          countMap[p.user_email] = (countMap[p.user_email] || 0) + 1
        })
        setUsers(sbUsers.map(u => ({ ...u, productCount: countMap[u.email] || 0 })))
      } else {
        // Fallback: merge localStorage gn_users with current browser session
        const local = getLocalUsers()
        setUsers(local.length > 0 ? local : [])
      }
    } catch {
      setUsers(getLocalUsers())
    }
    setLastRefresh(new Date())
  }

  useEffect(() => {
    if (!auth) return
    loadUsers()
    const interval = setInterval(loadUsers, 30000) // auto-refresh every 30s
    return () => clearInterval(interval)
  }, [auth])

  if (!auth) return <AdminLogin onLogin={() => setAuth(true)} />

  const totalUsers    = users.length
  const totalProd     = users.filter((u: { role: string }) => u.role === 'productor').length
  const totalBuyers   = users.filter((u: { role: string }) => u.role === 'comprador').length
  const totalAsesores = users.filter((u: { role: string }) => u.role === 'asesor').length

  const navItems: { id: AdminTab; label: string; icon: string; badge?: number }[] = [
    { id: 'overview',       label: 'Dashboard',      icon: '📊' },
    { id: 'usuarios',       label: 'Usuarios',       icon: '👥', badge: totalUsers || undefined },
    { id: 'suscripciones',  label: 'Suscripciones',  icon: '💳' },
    { id: 'verificaciones', label: 'Verificaciones', icon: '🛡️' },
    { id: 'asesores',       label: 'Asesores',       icon: '🎓', badge: totalAsesores || undefined },
    { id: 'actividad',      label: 'Actividad',      icon: '⚡' },
  ]

  const SidebarBtn = ({ item }: { item: typeof navItems[0] }) => (
    <button
      onClick={() => { setTab(item.id); setSidebarOpen(false) }}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
        marginBottom: 3, textAlign: 'left', transition: 'all .15s',
        background: tab === item.id ? `${C.teal}15` : 'transparent',
        color: tab === item.id ? C.teal : C.muted,
      }}
    >
      <span style={{ fontSize: '1rem' }}>{item.icon}</span>
      <span style={{ fontSize: 14, fontWeight: tab === item.id ? 700 : 500, flex: 1 }}>{item.label}</span>
      {item.badge !== undefined && (
        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100,
          background: tab === item.id ? C.teal : C.border, color: tab === item.id ? C.white : C.muted }}>
          {item.badge}
        </span>
      )}
    </button>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: C.bg, position: 'relative' }}>

      {/* Mobile overlay */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)', zIndex: 40 }} />}

      {/* Mobile topbar */}
      <div style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, height: 56, background: C.white, borderBottom: `1px solid ${C.border}`, alignItems: 'center', padding: '0 1rem', gap: 12, zIndex: 30, boxShadow: '0 1px 8px rgba(0,0,0,.06)' }} className="admin-topbar-mobile">
        <button onClick={() => setSidebarOpen(o => !o)} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.border}`, background: C.white, cursor: 'pointer', fontSize: '1rem', color: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>☰</button>
        <span style={{ color: C.navy, fontWeight: 800, fontSize: '0.95rem' }}>🌐 Global Nexus Admin</span>
      </div>

      {/* ── SIDEBAR ── */}
      <div style={{ width: 240, background: C.white, display: 'flex', flexDirection: 'column', flexShrink: 0, borderRight: `1px solid ${C.border}`, position: 'fixed', top: 0, bottom: 0, left: sidebarOpen ? 0 : undefined, zIndex: 50, transition: 'left .25s', boxShadow: '2px 0 12px rgba(0,0,0,.04)' }} className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>

        {/* Logo */}
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🌐</div>
            <div>
              <div style={{ color: C.navy, fontWeight: 900, fontSize: '0.9rem' }}>Global Nexus</div>
              <div style={{ color: C.muted, fontSize: 10, fontWeight: 600, letterSpacing: '.04em' }}>ADMIN PANEL</div>
            </div>
          </div>
        </div>

        {/* Launch countdown */}
        <div style={{ margin: '1rem .75rem', background: `linear-gradient(135deg, ${C.teal}18, ${C.navy}12)`, border: `1px solid ${C.teal}30`, borderRadius: 10, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.teal, letterSpacing: '.05em', marginBottom: 3 }}>🚀 LANZAMIENTO</div>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.navy }}>28 Ago 2026 · 12:00 CDMX</div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Perfiles se activan automáticamente</div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '0.5rem 0.75rem', flex: 1 }}>
          {navItems.map(item => <SidebarBtn key={item.id} item={item} />)}
        </nav>

        {/* Admin footer */}
        <div style={{ padding: '1rem 1.25rem', borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem' }}>👑</div>
            <div>
              <div style={{ color: C.text, fontSize: 12, fontWeight: 600 }}>Administrador</div>
              <div style={{ color: C.muted, fontSize: 10 }}>brandmkrs.ads@gmail.com</div>
            </div>
          </div>
          <button onClick={() => setAuth(false)} style={{ width: '100%', padding: '7px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, overflowY: 'auto', background: C.bg, marginLeft: 240 }} className="admin-main">

        {/* Top bar */}
        <div style={{ padding: '1rem 2rem', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.white, boxShadow: '0 1px 6px rgba(0,0,0,.04)' }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.05rem', color: C.navy }}>
              {navItems.find(n => n.id === tab)?.icon} {navItems.find(n => n.id === tab)?.label}
            </h1>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 1 }}>
              {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: C.muted }}>Actualizado: {lastRefresh.toLocaleTimeString('es-MX')}</span>
            <button onClick={loadUsers} style={{ fontSize: 12, padding: '7px 14px', borderRadius: 8, background: `${C.teal}12`, color: C.teal, fontWeight: 700, border: `1px solid ${C.teal}30`, cursor: 'pointer' }}>
              ↻ Actualizar
            </button>
          </div>
        </div>

        <div style={{ padding: '1.5rem 2rem' }}>

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Pre-launch banner */}
              <div style={{ background: `linear-gradient(135deg, ${C.navy}, #1a4a7a)`, borderRadius: 14, padding: '1.5rem 2rem', color: C.white, display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#5EEAD4', letterSpacing: '.08em', marginBottom: 6 }}>🚀 PRE-LANZAMIENTO — PLATAFORMA EN MODO REGISTRO</div>
                  <div style={{ fontSize: 'clamp(1rem,2.5vw,1.25rem)', fontWeight: 800, marginBottom: 4 }}>Esperando los primeros registros</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', lineHeight: 1.6 }}>
                    Los perfiles se guardan y se activarán automáticamente el <strong style={{ color: '#5EEAD4' }}>28 de agosto de 2026 a las 12:00 pm CDMX</strong>. La plataforma estará 100% operativa para esa fecha.
                  </div>
                </div>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#5EEAD4' }}>{totalUsers}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.65)' }}>registros guardados</div>
                </div>
              </div>

              {/* KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '1rem' }}>
                <StatCard icon="👥" label="Total registros" value={totalUsers} sub="Esperando activación" color={C.navy} />
                <StatCard icon="🏭" label="Productores MX" value={totalProd} color={C.teal} />
                <StatCard icon="🇪🇺" label="Compradores EU" value={totalBuyers} color="#1E40AF" />
                <StatCard icon="🎓" label="Asesores Pro" value={totalAsesores} color="#7C3AED" />
                <StatCard icon="💳" label="MRR (USD)" value="$0" sub="Se activa el 28 Ago" color={C.green} />
                <StatCard icon="🛡️" label="Verificaciones pend." value={0} color={C.gold} />
              </div>

              {/* Recent registrations */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: '1rem' }}>Últimos registros</h3>
                {users.length === 0
                  ? <Empty icon="📋" title="Sin registros todavía" sub="Los primeros usuarios aparecerán aquí en tiempo real cuando se registren en la plataforma." />
                  : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {users.slice(0, 8).map((u: Record<string, unknown>, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px', background: C.bg, borderRadius: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C.teal}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                            {u.role === 'productor' ? '🏭' : u.role === 'asesor' ? '🎓' : '🇪🇺'}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{String(u.name || u.company || '')}</div>
                            <div style={{ fontSize: 11, color: C.muted }}>{String(u.email || '')}</div>
                          </div>
                          <div style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: PLAN_CHIP[String(u.plan || u.role)]?.bg || C.bg, color: PLAN_CHIP[String(u.plan || u.role)]?.color || C.muted }}>
                            {String(u.role || '')}
                          </div>
                          <div style={{ fontSize: 11, color: C.muted, flexShrink: 0 }}>
                            {u.created_at ? new Date(String(u.created_at)).toLocaleDateString('es-MX') : u.createdAt ? new Date(String(u.createdAt)).toLocaleDateString('es-MX') : '—'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>

              {/* Info cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.teal, marginBottom: 8 }}>📅 Calendario de lanzamiento</div>
                  {[
                    { date: 'Ahora — 27 Ago 2026', action: 'Modo registro. Perfiles se guardan.', done: false },
                    { date: '28 Ago 2026 · 12:00 CDMX', action: 'Activación automática de todos los perfiles.', done: false },
                    { date: '28 Ago 2026+', action: 'Plataforma 100% operativa. Connections activas.', done: false },
                  ].map((e, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: e.done ? C.green : C.teal, marginTop: 4, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.navy }}>{e.date}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>{e.action}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>💡 Estado de la plataforma</div>
                  {[
                    { label: 'Registro de usuarios', ok: true },
                    { label: 'Pago de suscripciones', ok: true },
                    { label: 'Conexión productores-compradores', ok: false, note: 'Activa el 28 Ago' },
                    { label: 'Sala de chat', ok: false, note: 'Activa el 28 Ago' },
                    { label: 'Asesoría profesional', ok: true },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < 4 ? `1px solid ${C.border}` : 'none' }}>
                      <span style={{ fontSize: 13, color: C.text }}>{s.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        {s.note && <span style={{ fontSize: 10, color: C.muted }}>{s.note}</span>}
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: s.ok ? '#DCFCE7' : '#FEF3C7', color: s.ok ? C.green : C.gold }}>
                          {s.ok ? '✓ Activo' : '⏳ Pendiente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── USUARIOS ── */}
          {tab === 'usuarios' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: '1rem' }}>
                  Usuarios registrados ({totalUsers})
                </h3>
                {users.length === 0
                  ? <Empty icon="👥" title="Sin usuarios todavía" sub="Los usuarios que se registren en nexusstrategy.online aparecerán aquí automáticamente." />
                  : (
                    <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: C.bg }}>
                          {['Nombre / Empresa', 'Email', 'Rol', 'Estado', 'Productos', 'Registro'].map(h => (
                            <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: C.muted, fontSize: 12, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u: Record<string, unknown>, i: number) => (
                          <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                            <td style={{ padding: '12px 14px' }}>
                              <div style={{ fontWeight: 600, color: C.text }}>{String(u.name || '')}</div>
                              {u.company && <div style={{ fontSize: 11, color: C.muted }}>{String(u.company)}</div>}
                            </td>
                            <td style={{ padding: '12px 14px', color: C.muted, fontSize: 12 }}>{String(u.email || '')}</td>
                            <td style={{ padding: '12px 14px' }}>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: u.role === 'productor' ? C.tealLight : u.role === 'asesor' ? '#F3E8FF' : '#EFF6FF', color: u.role === 'productor' ? '#0F766E' : u.role === 'asesor' ? '#7C3AED' : C.navy }}>
                                {u.role === 'productor' ? '🏭 Productor' : u.role === 'asesor' ? '🎓 Asesor' : '🇪🇺 Comprador'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 14px', color: C.muted, fontSize: 12 }}>{String(u.state || '—')}</td>
                            <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                              <span style={{ fontWeight: 700, fontSize: 14, color: Number(u.productCount) > 0 ? C.teal : C.muted }}>
                                {Number(u.productCount) || 0}
                              </span>
                            </td>
                            <td style={{ padding: '12px 14px', color: C.muted, fontSize: 12, whiteSpace: 'nowrap' }}>
                              {u.created_at ? new Date(String(u.created_at)).toLocaleDateString('es-MX') : u.createdAt ? new Date(String(u.createdAt)).toLocaleDateString('es-MX') : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  )
                }
              </div>
            </div>
          )}

          {/* ── SUSCRIPCIONES ── */}
          {tab === 'suscripciones' && (
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: '1rem' }}>Suscripciones activas</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <StatCard icon="💳" label="Suscripciones activas" value={0} color={C.green} />
                <StatCard icon="💰" label="MRR (USD)" value="$0" sub="Se activa el 28 Ago 2026" color={C.teal} />
                <StatCard icon="⏳" label="Pre-registros pagados" value={0} color={C.navy} />
              </div>
              <Empty icon="💳" title="Sin suscripciones todavía" sub="Las suscripciones de Stripe aparecerán aquí. Los pagos de acceso anticipado se registrarán automáticamente." />
            </div>
          )}

          {/* ── VERIFICACIONES ── */}
          {tab === 'verificaciones' && (
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: '1rem' }}>Documentos pendientes de revisión</h3>
              <Empty icon="🛡️" title="Sin documentos pendientes" sub="Cuando los usuarios suban sus certificaciones y documentos para verificación, aparecerán aquí para tu revisión." />
            </div>
          )}

          {/* ── ASESORES ── */}
          {tab === 'asesores' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: 4 }}>Asesores Profesionales</h3>
                <p style={{ fontSize: 13, color: C.muted, marginBottom: '1rem' }}>Profesionales registrados para guiar a productores en el proceso de certificación TLCUEM.</p>
                {users.filter((u: { role: string }) => u.role === 'asesor').length === 0
                  ? <Empty icon="🎓" title="Sin asesores registrados" sub="Los profesionales que se registren como asesores en la sección de Asesoría Profesional aparecerán aquí." />
                  : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {users.filter((u: { role: string }) => u.role === 'asesor').map((u: { id: number; name: string; email: string; company: string; createdAt: string }, i: number) => (
                        <div key={i} style={{ display: 'flex', gap: 12, padding: '12px', background: C.bg, borderRadius: 10, alignItems: 'center' }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🎓</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{u.name}</div>
                            <div style={{ fontSize: 12, color: C.muted }}>{u.email} · {u.company}</div>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: '#F3E8FF', color: '#7C3AED' }}>Asesor Pro</span>
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>
            </div>
          )}

          {/* ── ACTIVIDAD ── */}
          {tab === 'actividad' && (
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: '1rem' }}>Log de actividad de la plataforma</h3>
              <Empty icon="⚡" title="Sin actividad todavía" sub="El historial de registros, suscripciones y acciones de usuarios aparecerá aquí en tiempo real." />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

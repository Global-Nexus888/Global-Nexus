import { useState } from 'react'

/* ─── Mock data ─── */
const ADMIN_EMAIL = 'brandmkrs.ads@gmail.com'
const ADMIN_PASS = 'nexus2026'

const REGISTROS = [
  { id: 'u1', nombre: 'Agave Azul del Highlands', email: 'contacto@agaveazul.mx', rol: 'producer', plan: 'pro', pais: '🇲🇽', estado: 'Jalisco', fecha: '2026-06-27', verificado: true, activo: true },
  { id: 'u2', nombre: 'Jan van der Berg', email: 'jan@eurospirits.nl', rol: 'buyer', plan: 'comprador', pais: '🇳🇱', estado: 'Amsterdam', fecha: '2026-06-27', verificado: true, activo: true },
  { id: 'u3', nombre: 'Valles Orgánicos de Oaxaca', email: 'info@vallesoaxaca.mx', rol: 'producer', plan: 'pro', pais: '🇲🇽', estado: 'Oaxaca', fecha: '2026-06-26', verificado: true, activo: true },
  { id: 'u4', nombre: 'Marie Dubois', email: 'marie@maisonalcools.fr', rol: 'buyer', plan: 'comprador', pais: '🇫🇷', estado: 'París', fecha: '2026-06-26', verificado: true, activo: true },
  { id: 'u5', nombre: 'Café Sierra Madre', email: 'export@sierramadre.mx', rol: 'producer', plan: 'explorador', pais: '🇲🇽', estado: 'Chiapas', fecha: '2026-06-25', verificado: false, activo: true },
  { id: 'u6', nombre: 'Klaus Richter', email: 'k.richter@deutschespirits.de', rol: 'buyer', plan: 'comprador', pais: '🇩🇪', estado: 'Berlín', fecha: '2026-06-25', verificado: true, activo: true },
  { id: 'u7', nombre: 'Selva Maya Bee Co.', email: 'maya@selvabee.mx', rol: 'producer', plan: 'pro', pais: '🇲🇽', estado: 'Yucatán', fecha: '2026-06-24', verificado: true, activo: true },
  { id: 'u8', nombre: 'Sofia Andersson', email: 'sofia@nordicimport.se', rol: 'buyer', plan: 'explorador', pais: '🇸🇪', estado: 'Estocolmo', fecha: '2026-06-24', verificado: false, activo: false },
  { id: 'u9', nombre: 'Herbolaria Michoacana', email: 'ventas@herbolaria.mx', rol: 'producer', plan: 'explorador', pais: '🇲🇽', estado: 'Michoacán', fecha: '2026-06-23', verificado: false, activo: true },
  { id: 'u10', nombre: 'Pedro Martens', email: 'p.martens@belgiumfood.be', rol: 'buyer', plan: 'comprador', pais: '🇧🇪', estado: 'Bruselas', fecha: '2026-06-22', verificado: true, activo: true },
]

const SUSCRIPCIONES = [
  { id: 's1', usuario: 'Jan van der Berg', email: 'jan@eurospirits.nl', plan: 'Comprador EU', monto: 149, moneda: 'USD', fecha: '2026-06-27', estado: 'activa', stripe: 'sub_1RaB2X...', pais: '🇳🇱' },
  { id: 's2', usuario: 'Agave Azul del Highlands', email: 'contacto@agaveazul.mx', plan: 'Pro Exportador', monto: 59, moneda: 'USD', fecha: '2026-06-26', estado: 'activa', stripe: 'sub_1Ra92Y...', pais: '🇲🇽' },
  { id: 's3', usuario: 'Marie Dubois', email: 'marie@maisonalcools.fr', plan: 'Comprador EU', monto: 149, moneda: 'USD', fecha: '2026-06-26', estado: 'activa', stripe: 'sub_1Ra71Z...', pais: '🇫🇷' },
  { id: 's4', usuario: 'Valles Orgánicos de Oaxaca', email: 'info@vallesoaxaca.mx', plan: 'Pro Exportador', monto: 59, moneda: 'USD', fecha: '2026-06-25', estado: 'activa', stripe: 'sub_1Ra5AA...', pais: '🇲🇽' },
  { id: 's5', usuario: 'Klaus Richter', email: 'k.richter@deutschespirits.de', plan: 'Comprador EU', monto: 149, moneda: 'USD', fecha: '2026-06-25', estado: 'activa', stripe: 'sub_1Ra3BB...', pais: '🇩🇪' },
  { id: 's6', usuario: 'Selva Maya Bee Co.', email: 'maya@selvabee.mx', plan: 'Pro Exportador', monto: 59, moneda: 'USD', fecha: '2026-06-24', estado: 'activa', stripe: 'sub_1Ra1CC...', pais: '🇲🇽' },
  { id: 's7', usuario: 'Pedro Martens', email: 'p.martens@belgiumfood.be', plan: 'Comprador EU', monto: 149, moneda: 'USD', fecha: '2026-06-22', estado: 'activa', stripe: 'sub_1R9zDD...', pais: '🇧🇪' },
  { id: 's8', usuario: 'Sofia Andersson', email: 'sofia@nordicimport.se', plan: 'Comprador EU', monto: 149, moneda: 'USD', fecha: '2026-06-20', estado: 'cancelada', stripe: 'sub_1R9xEE...', pais: '🇸🇪' },
]

const VERIFICACIONES = [
  { id: 'v1', usuario: 'Café Sierra Madre', email: 'export@sierramadre.mx', rol: 'producer', doc: 'Certificado SENASICA', archivo: 'Cert_SENASICA_2024.pdf', tamano: '1.2 MB', fecha: '2026-06-26', estado: 'pendiente' },
  { id: 'v2', usuario: 'Café Sierra Madre', email: 'export@sierramadre.mx', rol: 'producer', doc: 'Certificación NOM', archivo: 'NOM_Cafe_2024.pdf', tamano: '0.9 MB', fecha: '2026-06-26', estado: 'pendiente' },
  { id: 'v3', usuario: 'Herbolaria Michoacana', email: 'ventas@herbolaria.mx', rol: 'producer', doc: 'RFC / Constancia SAT', archivo: 'RFC_Herbolaria.pdf', tamano: '0.5 MB', fecha: '2026-06-25', estado: 'pendiente' },
  { id: 'v4', usuario: 'Sofia Andersson', email: 'sofia@nordicimport.se', rol: 'buyer', doc: 'Registro Comercial EU', archivo: 'Swedish_Business_Reg.pdf', tamano: '1.8 MB', fecha: '2026-06-24', estado: 'pendiente' },
  { id: 'v5', usuario: 'Pedro Martens', email: 'p.martens@belgiumfood.be', rol: 'buyer', doc: 'Número VAT / IVA EU', archivo: 'VAT_Belgium_2024.pdf', tamano: '0.3 MB', fecha: '2026-06-22', estado: 'aprobado' },
]

const INTERACCIONES = [
  { id: 'i1', tipo: 'mensaje', usuario: 'Jan van der Berg', target: 'Agave Azul del Highlands', detalle: 'Solicitud de 500 cajas Tequila Añejo', fecha: '2026-06-27 14:32', pais: '🇳🇱' },
  { id: 'i2', tipo: 'registro', usuario: 'Pedro Martens', target: '', detalle: 'Nuevo comprador EU — Bélgica', fecha: '2026-06-27 11:15', pais: '🇧🇪' },
  { id: 'i3', tipo: 'suscripcion', usuario: 'Agave Azul del Highlands', target: '', detalle: 'Plan Pro Exportador activado — $59 USD', fecha: '2026-06-26 09:48', pais: '🇲🇽' },
  { id: 'i4', tipo: 'verificacion', usuario: 'Café Sierra Madre', target: '', detalle: 'Subió certificado SENASICA para revisión', fecha: '2026-06-26 08:22', pais: '🇲🇽' },
  { id: 'i5', tipo: 'mensaje', usuario: 'Marie Dubois', target: 'Valles Orgánicos de Oaxaca', detalle: 'Solicita condiciones de exportación Mezcal', fecha: '2026-06-25 16:05', pais: '🇫🇷' },
  { id: 'i6', tipo: 'suscripcion', usuario: 'Klaus Richter', target: '', detalle: 'Plan Comprador EU activado — $149 USD', fecha: '2026-06-25 13:30', pais: '🇩🇪' },
  { id: 'i7', tipo: 'documento', usuario: 'Jan van der Berg', target: 'Agave Azul del Highlands', detalle: 'Compartió Carta de Intención de Compra.pdf', fecha: '2026-06-25 10:12', pais: '🇳🇱' },
  { id: 'i8', tipo: 'registro', usuario: 'Selva Maya Bee Co.', target: '', detalle: 'Nuevo productor verificado — Yucatán', fecha: '2026-06-24 15:44', pais: '🇲🇽' },
  { id: 'i9', tipo: 'cancelacion', usuario: 'Sofia Andersson', target: '', detalle: 'Canceló plan Comprador EU', fecha: '2026-06-23 09:00', pais: '🇸🇪' },
  { id: 'i10', tipo: 'mensaje', usuario: 'Klaus Richter', target: 'Agave Azul del Highlands', detalle: 'Revisó lista de precios de exportación', fecha: '2026-06-22 17:20', pais: '🇩🇪' },
]

const COMUNIDAD_STATS = [
  { usuario: 'Agave Azul del Highlands', tipo: 'photo', likes: 47, comentarios: 12, fecha: '2026-06-27', reportes: 0 },
  { usuario: 'Marie Dubois', tipo: 'rfq', likes: 23, comentarios: 8, fecha: '2026-06-27', reportes: 0 },
  { usuario: 'Valles Orgánicos', tipo: 'event', likes: 89, comentarios: 22, fecha: '2026-06-26', reportes: 1 },
  { usuario: 'Ing. Carmen Vega', tipo: 'update', likes: 31, comentarios: 5, fecha: '2026-06-26', reportes: 0 },
  { usuario: 'Pedro Martens', tipo: 'rfq', likes: 18, comentarios: 14, fecha: '2026-06-25', reportes: 0 },
]

const OFERTAS_STATS = [
  { producto: 'Tequila Reposado Premium', productor: 'Agave Azul', views: 214, contactos: 18, stock: 38, descuento: 41 },
  { producto: 'Café Orgánico Chiapas', productor: 'Cooperativa Sierra Madre', views: 189, contactos: 12, stock: 12, descuento: 43 },
  { producto: 'Aceite de Jojoba', productor: 'Jojoba del Sonora', views: 97, contactos: 6, stock: 8, descuento: 43 },
  { producto: 'Mezcal Espadín-Tobalá', productor: 'Destilería San Dionisio', views: 143, contactos: 9, stock: 4, descuento: 42 },
]

/* ─── Helpers ─── */
type AdminTab = 'overview' | 'usuarios' | 'suscripciones' | 'verificaciones' | 'actividad' | 'comunidad' | 'ofertas'

const PLAN_CONFIG: Record<string, { color: string; bg: string }> = {
  pro:        { color: '#0F766E', bg: '#CCFBF1' },
  comprador:  { color: '#1E3A5F', bg: '#EFF6FF' },
  explorador: { color: '#94A3B8', bg: '#F1F5F9' },
}

const TIPO_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  mensaje:      { icon: '💬', color: '#0D9488', bg: '#CCFBF1' },
  registro:     { icon: '👤', color: '#1E3A5F', bg: '#EFF6FF' },
  suscripcion:  { icon: '💳', color: '#16A34A', bg: '#DCFCE7' },
  verificacion: { icon: '🛡️', color: '#D97706', bg: '#FEF3C7' },
  documento:    { icon: '📄', color: '#7C3AED', bg: '#F3E8FF' },
  cancelacion:  { icon: '❌', color: '#DC2626', bg: '#FEE2E2' },
}

/* ─── Login screen ─── */
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
        onLogin()
      } else {
        setError('Credenciales incorrectas. Solo administradores autorizados.')
        setLoading(false)
      }
    }, 900)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0D9488 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(255,255,255,.12)', border: '2px solid rgba(255,255,255,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem' }}>🌐</div>
          <div style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 900 }}>Global Nexus</div>
          <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 13, marginTop: 4 }}>Panel de Administración</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,.07)', backdropFilter: 'blur(20px)', borderRadius: 20, padding: '2rem', border: '1px solid rgba(255,255,255,.15)' }}>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.5rem', textAlign: 'center' }}>🔐 Acceso restringido</h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.7)', display: 'block', marginBottom: 6 }}>Email administrador</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@nexusstrategy.online"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: 14, fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.7)', display: 'block', marginBottom: 6 }}>Contraseña</label>
              <input
                type="password" required value={pass} onChange={e => setPass(e.target.value)}
                placeholder="••••••••••"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: 14, fontFamily: 'inherit' }}
              />
            </div>
            {error && <div style={{ background: 'rgba(220,38,38,.2)', border: '1px solid rgba(220,38,38,.4)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#FCA5A5' }}>{error}</div>}
            <button
              type="submit" disabled={loading}
              style={{ padding: '13px', borderRadius: 10, border: 'none', background: loading ? 'rgba(255,255,255,.2)' : 'linear-gradient(135deg, #0D9488, #0F766E)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4, transition: 'all .2s' }}
            >{loading ? '⏳ Verificando...' : '→ Acceder al panel'}</button>
          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,.1)', fontSize: 11, color: 'rgba(255,255,255,.4)', textAlign: 'center' }}>
            Acceso exclusivo para administradores de Global Nexus
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main admin panel ─── */
export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [tab, setTab] = useState<AdminTab>('overview')
  const [verDocs, setVerDocs] = useState(VERIFICACIONES)
  const [userSearch, setUserSearch] = useState('')
  const [rolFilter, setRolFilter] = useState<'all' | 'producer' | 'buyer'>('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!auth) return <AdminLogin onLogin={() => setAuth(true)} />

  const mrr = SUSCRIPCIONES.filter(s => s.estado === 'activa').reduce((a, s) => a + s.monto, 0)
  const pendingDocs = verDocs.filter(v => v.estado === 'pendiente').length
  const filteredUsers = REGISTROS.filter(u =>
    (rolFilter === 'all' || u.rol === rolFilter) &&
    (planFilter === 'all' || u.plan === planFilter) &&
    (u.nombre.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
  )

  const navItems: { id: AdminTab; label: string; icon: string; badge?: number }[] = [
    { id: 'overview',       label: 'Dashboard',      icon: '📊' },
    { id: 'usuarios',       label: 'Usuarios',       icon: '👥', badge: REGISTROS.length },
    { id: 'suscripciones',  label: 'Suscripciones',  icon: '💳', badge: SUSCRIPCIONES.filter(s => s.estado === 'activa').length },
    { id: 'verificaciones', label: 'Verificaciones', icon: '🛡️', badge: pendingDocs },
    { id: 'comunidad',      label: 'Comunidad',      icon: '🌐', badge: COMUNIDAD_STATS.filter(p => p.reportes > 0).length || undefined },
    { id: 'ofertas',        label: 'Ofertas Calientes', icon: '🔥' },
    { id: 'actividad',      label: 'Actividad',      icon: '⚡' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0F172A', position: 'relative' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 40 }} />
      )}

      {/* Mobile top bar */}
      <div style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, height: 56, background: '#1E293B', borderBottom: '1px solid rgba(255,255,255,.07)', alignItems: 'center', padding: '0 1rem', gap: 12, zIndex: 30 }} className="admin-topbar-mobile">
        <button onClick={() => setSidebarOpen(o => !o)} style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.05)', cursor: 'pointer', fontSize: '1rem', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>☰</button>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem' }}>🌐 Global Nexus Admin</span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#5EEAD4', fontWeight: 700 }}>MRR ${mrr}</span>
      </div>

      {/* ── Sidebar ── */}
      <div style={{ width: 240, background: '#1E293B', display: 'flex', flexDirection: 'column', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,.07)', position: 'fixed', top: 0, bottom: 0, left: sidebarOpen ? 0 : undefined, zIndex: 50, transition: 'left .25s' }} className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #0D9488, #1E3A5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🌐</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem' }}>Global Nexus</div>
              <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 10 }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '1rem 0.75rem', flex: 1 }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); setSidebarOpen(false) }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10,
                border: 'none', cursor: 'pointer', marginBottom: 4, textAlign: 'left', transition: 'all .15s',
                background: tab === item.id ? 'rgba(13,148,136,.2)' : 'transparent',
                color: tab === item.id ? '#5EEAD4' : 'rgba(255,255,255,.55)',
              }}
            >
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              <span style={{ fontSize: 14, fontWeight: tab === item.id ? 700 : 500, flex: 1 }}>{item.label}</span>
              {item.badge !== undefined && (
                <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 100, background: tab === item.id ? '#0D9488' : 'rgba(255,255,255,.1)', color: tab === item.id ? '#fff' : 'rgba(255,255,255,.5)' }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Admin info */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #0D9488, #1E3A5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>👑</div>
            <div>
              <div style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>Administrador</div>
              <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 10 }}>brandmkrs.ads@gmail.com</div>
            </div>
          </div>
          <button onClick={() => setAuth(false)} style={{ width: '100%', marginTop: 12, padding: '7px', borderRadius: 8, border: '1px solid rgba(255,255,255,.1)', background: 'transparent', color: 'rgba(255,255,255,.4)', fontSize: 12, cursor: 'pointer' }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#0F172A', marginLeft: 240 }} className="admin-main">

        {/* Top bar */}
        <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid rgba(255,255,255,.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1E293B' }}>
          <div>
            <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>
              { navItems.find(n => n.id === tab)?.icon } { navItems.find(n => n.id === tab)?.label }
            </h1>
            <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 12, marginTop: 2 }}>
              {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {pendingDocs > 0 && (
              <button onClick={() => setTab('verificaciones')} style={{ fontSize: 12, padding: '7px 14px', borderRadius: 8, border: 'none', background: 'rgba(217,119,6,.2)', color: '#FCD34D', cursor: 'pointer', fontWeight: 600 }}>
                ⚠️ {pendingDocs} verificaciones pendientes
              </button>
            )}
            <div style={{ fontSize: 12, padding: '7px 14px', borderRadius: 8, background: 'rgba(13,148,136,.15)', color: '#5EEAD4', fontWeight: 600 }}>
              MRR ${mrr.toLocaleString()} USD
            </div>
          </div>
        </div>

        <div style={{ padding: '1.5rem 2rem' }}>

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'Usuarios totales', value: REGISTROS.length, sub: '+3 esta semana', icon: '👥', color: '#5EEAD4' },
                  { label: 'Suscripciones activas', value: SUSCRIPCIONES.filter(s => s.estado === 'activa').length, sub: '1 cancelada', icon: '💳', color: '#86EFAC' },
                  { label: 'MRR', value: `$${mrr}`, sub: 'USD / mes', icon: '💰', color: '#FCD34D' },
                  { label: 'Verificaciones pendientes', value: pendingDocs, sub: 'Requieren revisión', icon: '🛡️', color: '#FDA4AF' },
                  { label: 'Productores MX', value: REGISTROS.filter(u => u.rol === 'producer').length, sub: `${REGISTROS.filter(u => u.rol === 'producer' && u.verificado).length} verificados`, icon: '🏭', color: '#C4B5FD' },
                  { label: 'Compradores EU', value: REGISTROS.filter(u => u.rol === 'buyer').length, sub: '5 países', icon: '🇪🇺', color: '#93C5FD' },
                  { label: 'Mensajes hoy', value: 24, sub: '+8 vs ayer', icon: '💬', color: '#5EEAD4' },
                  { label: 'Documentos recibidos', value: verDocs.length, sub: `${pendingDocs} sin revisar`, icon: '📄', color: '#FCA5A5' },
                ].map(kpi => (
                  <div key={kpi.label} style={{ background: '#1E293B', borderRadius: 14, padding: '1.25rem', border: '1px solid rgba(255,255,255,.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <span style={{ fontSize: '1.4rem' }}>{kpi.icon}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,.35)' }}>{kpi.sub}</span>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: kpi.color, lineHeight: 1 }}>{kpi.value}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginTop: 6 }}>{kpi.label}</div>
                  </div>
                ))}
              </div>

              {/* Revenue by plan */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: '#1E293B', borderRadius: 14, padding: '1.5rem', border: '1px solid rgba(255,255,255,.06)' }}>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: '1rem' }}>💳 Ingresos por plan</h3>
                  {[
                    { plan: 'Comprador EU', count: SUSCRIPCIONES.filter(s => s.plan === 'Comprador EU' && s.estado === 'activa').length, precio: 149, color: '#93C5FD' },
                    { plan: 'Pro Exportador', count: SUSCRIPCIONES.filter(s => s.plan === 'Pro Exportador' && s.estado === 'activa').length, precio: 59, color: '#5EEAD4' },
                    { plan: 'Explorador', count: 3, precio: 0, color: '#94A3B8' },
                  ].map(p => {
                    const total = p.count * p.precio
                    const maxTotal = 4 * 149
                    return (
                      <div key={p.plan} style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                          <span style={{ color: 'rgba(255,255,255,.7)', fontWeight: 600 }}>{p.plan}</span>
                          <span style={{ color: p.color, fontWeight: 700 }}>{p.count} usuarios · ${total} USD</span>
                        </div>
                        <div style={{ height: 6, background: 'rgba(255,255,255,.07)', borderRadius: 100 }}>
                          <div style={{ height: '100%', width: `${maxTotal > 0 ? (total / maxTotal) * 100 : 0}%`, background: p.color, borderRadius: 100 }} />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Recent activity mini */}
                <div style={{ background: '#1E293B', borderRadius: 14, padding: '1.5rem', border: '1px solid rgba(255,255,255,.06)' }}>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: '1rem' }}>⚡ Actividad reciente</h3>
                  {INTERACCIONES.slice(0, 5).map(act => {
                    const cfg = TIPO_CONFIG[act.tipo]
                    return (
                      <div key={act.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: `${cfg.bg}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>{cfg.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.8)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act.pais} {act.usuario}</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 1 }}>{act.detalle}</div>
                        </div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', whiteSpace: 'nowrap' }}>{act.fecha.split(' ')[1]}</div>
                      </div>
                    )
                  })}
                  <button onClick={() => setTab('actividad')} style={{ fontSize: 12, color: '#5EEAD4', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, marginTop: 4 }}>Ver todo →</button>
                </div>
              </div>
            </div>
          )}

          {/* ── USUARIOS ── */}
          {tab === 'usuarios' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Filters */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  value={userSearch} onChange={e => setUserSearch(e.target.value)}
                  placeholder="🔍 Buscar usuario o email..."
                  style={{ padding: '9px 14px', borderRadius: 9, border: '1px solid rgba(255,255,255,.12)', background: '#1E293B', color: '#fff', fontSize: 13, fontFamily: 'inherit', width: 260 }}
                />
                {(['all', 'producer', 'buyer'] as const).map(r => (
                  <button key={r} onClick={() => setRolFilter(r)} style={{ padding: '8px 14px', borderRadius: 9, border: '1px solid', borderColor: rolFilter === r ? '#0D9488' : 'rgba(255,255,255,.12)', background: rolFilter === r ? 'rgba(13,148,136,.2)' : 'transparent', color: rolFilter === r ? '#5EEAD4' : 'rgba(255,255,255,.5)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    {r === 'all' ? 'Todos' : r === 'producer' ? '🏭 Productores' : '🇪🇺 Compradores'}
                  </button>
                ))}
                {(['all', 'pro', 'comprador', 'explorador'] as const).map(p => (
                  <button key={p} onClick={() => setPlanFilter(p)} style={{ padding: '8px 14px', borderRadius: 9, border: '1px solid', borderColor: planFilter === p ? '#0D9488' : 'rgba(255,255,255,.12)', background: planFilter === p ? 'rgba(13,148,136,.2)' : 'transparent', color: planFilter === p ? '#5EEAD4' : 'rgba(255,255,255,.5)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    {p === 'all' ? 'Todos los planes' : p}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div style={{ background: '#1E293B', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,.06)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                      {['Usuario', 'Email', 'Rol', 'Plan', 'País', 'Registro', 'Estado'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, i) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.015)' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{u.nombre}</div>
                          {u.verificado && <span style={{ fontSize: 10, color: '#5EEAD4', fontWeight: 600 }}>✓ Verificado</span>}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,.5)' }}>{u.email}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: u.rol === 'producer' ? 'rgba(13,148,136,.2)' : 'rgba(30,58,95,.5)', color: u.rol === 'producer' ? '#5EEAD4' : '#93C5FD' }}>
                            {u.rol === 'producer' ? '🏭 Productor' : '🇪🇺 Comprador'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: PLAN_CONFIG[u.plan].bg + '25', color: u.plan === 'pro' ? '#5EEAD4' : u.plan === 'comprador' ? '#93C5FD' : '#94A3B8' }}>
                            {u.plan === 'pro' ? 'Pro Exportador' : u.plan === 'comprador' ? 'Comprador EU' : 'Explorador'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 14 }}>{u.pais} <span style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{u.estado}</span></td>
                        <td style={{ padding: '12px 16px', fontSize: 11, color: 'rgba(255,255,255,.45)' }}>{u.fecha}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: u.activo ? 'rgba(22,163,74,.2)' : 'rgba(148,163,184,.1)', color: u.activo ? '#86EFAC' : '#94A3B8' }}>
                            {u.activo ? '● Activo' : '○ Inactivo'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>{filteredUsers.length} usuarios encontrados</div>
            </div>
          )}

          {/* ── SUSCRIPCIONES ── */}
          {tab === 'suscripciones' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Summary cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
                {[
                  { label: 'MRR Total', value: `$${mrr} USD`, sub: `${SUSCRIPCIONES.filter(s => s.estado === 'activa').length} suscripciones activas`, color: '#86EFAC' },
                  { label: 'Comprador EU', value: `${SUSCRIPCIONES.filter(s => s.plan === 'Comprador EU' && s.estado === 'activa').length} activos`, sub: `$${SUSCRIPCIONES.filter(s => s.plan === 'Comprador EU' && s.estado === 'activa').length * 149} USD/mes`, color: '#93C5FD' },
                  { label: 'Pro Exportador', value: `${SUSCRIPCIONES.filter(s => s.plan === 'Pro Exportador' && s.estado === 'activa').length} activos`, sub: `$${SUSCRIPCIONES.filter(s => s.plan === 'Pro Exportador' && s.estado === 'activa').length * 59} USD/mes`, color: '#5EEAD4' },
                ].map(c => (
                  <div key={c.label} style={{ background: '#1E293B', borderRadius: 14, padding: '1.25rem', border: '1px solid rgba(255,255,255,.06)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: c.color }}>{c.value}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginTop: 4 }}>{c.label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{c.sub}</div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div style={{ background: '#1E293B', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,.06)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                      {['Usuario', 'Plan', 'Monto', 'Fecha', 'Stripe ID', 'Estado'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SUSCRIPCIONES.map((s, i) => (
                      <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.015)' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{s.pais} {s.usuario}</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{s.email}</div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: s.plan === 'Comprador EU' ? '#93C5FD' : '#5EEAD4' }}>{s.plan}</span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 800, color: '#86EFAC' }}>${s.monto} {s.moneda}</td>
                        <td style={{ padding: '12px 16px', fontSize: 11, color: 'rgba(255,255,255,.45)' }}>{s.fecha}</td>
                        <td style={{ padding: '12px 16px', fontSize: 11, color: 'rgba(255,255,255,.35)', fontFamily: 'monospace' }}>{s.stripe}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: s.estado === 'activa' ? 'rgba(22,163,74,.2)' : 'rgba(220,38,38,.2)', color: s.estado === 'activa' ? '#86EFAC' : '#FCA5A5' }}>
                            {s.estado === 'activa' ? '● Activa' : '✗ Cancelada'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── VERIFICACIONES ── */}
          {tab === 'verificaciones' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'Pendientes', count: verDocs.filter(v => v.estado === 'pendiente').length, color: '#FCD34D' },
                  { label: 'Aprobados', count: verDocs.filter(v => v.estado === 'aprobado').length, color: '#86EFAC' },
                  { label: 'Rechazados', count: verDocs.filter(v => v.estado === 'rechazado').length, color: '#FCA5A5' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#1E293B', borderRadius: 12, padding: '1rem 1.5rem', border: '1px solid rgba(255,255,255,.06)', display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: s.color }}>{s.count}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>{s.label}</span>
                  </div>
                ))}
              </div>

              {verDocs.map(doc => (
                <div key={doc.id} style={{ background: '#1E293B', borderRadius: 14, padding: '1.25rem', border: `1px solid ${doc.estado === 'pendiente' ? 'rgba(217,119,6,.3)' : doc.estado === 'aprobado' ? 'rgba(22,163,74,.3)' : 'rgba(255,255,255,.06)'}` }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>📄</div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                        <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{doc.doc}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: doc.rol === 'producer' ? 'rgba(13,148,136,.2)' : 'rgba(30,58,95,.5)', color: doc.rol === 'producer' ? '#5EEAD4' : '#93C5FD' }}>
                          {doc.rol === 'producer' ? '🏭 Productor' : '🇪🇺 Comprador'}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: doc.estado === 'pendiente' ? 'rgba(217,119,6,.2)' : 'rgba(22,163,74,.2)', color: doc.estado === 'pendiente' ? '#FCD34D' : '#86EFAC' }}>
                          {doc.estado === 'pendiente' ? '⏳ Pendiente' : '✓ Aprobado'}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>
                        {doc.usuario} · {doc.email} · 📎 {doc.archivo} · {doc.tamano} · {doc.fecha}
                      </div>
                    </div>
                    {doc.estado === 'pendiente' && (
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <button
                          onClick={() => setVerDocs(d => d.map(v => v.id === doc.id ? { ...v, estado: 'aprobado' } : v))}
                          style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'rgba(22,163,74,.2)', color: '#86EFAC', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                        >✓ Aprobar</button>
                        <button
                          onClick={() => setVerDocs(d => d.map(v => v.id === doc.id ? { ...v, estado: 'rechazado' } : v))}
                          style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'rgba(220,38,38,.2)', color: '#FCA5A5', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                        >✗ Rechazar</button>
                        <button style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,.1)', background: 'transparent', color: 'rgba(255,255,255,.5)', fontSize: 12, cursor: 'pointer' }}>
                          👁️ Ver
                        </button>
                      </div>
                    )}
                    {doc.estado === 'aprobado' && <span style={{ fontSize: '1.5rem' }}>✅</span>}
                    {doc.estado === 'rechazado' && <span style={{ fontSize: '1.5rem' }}>❌</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── COMUNIDAD ── */}
          {tab === 'comunidad' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '1rem', marginBottom: 8 }}>
                {[
                  { label: 'Posts publicados', value: COMUNIDAD_STATS.length, color: '#5EEAD4', icon: '📢' },
                  { label: 'Likes totales', value: COMUNIDAD_STATS.reduce((a,p) => a + p.likes, 0), color: '#FCA5A5', icon: '❤️' },
                  { label: 'Comentarios', value: COMUNIDAD_STATS.reduce((a,p) => a + p.comentarios, 0), color: '#93C5FD', icon: '💬' },
                  { label: 'Reportes activos', value: COMUNIDAD_STATS.filter(p => p.reportes > 0).length, color: '#FCD34D', icon: '⚠️' },
                ].map(k => (
                  <div key={k.label} style={{ background: '#1E293B', borderRadius: 12, padding: '1.1rem', border: '1px solid rgba(255,255,255,.06)' }}>
                    <div style={{ fontSize: '1.1rem', marginBottom: 6 }}>{k.icon}</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: k.color }}>{k.value}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 4 }}>{k.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#1E293B', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,.06)' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,.07)', fontWeight: 700, color: '#fff', fontSize: 13 }}>
                  🌐 Posts del feed — moderación
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                      {['Usuario', 'Tipo', 'Likes', 'Comentarios', 'Reportes', 'Fecha', 'Acción'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMUNIDAD_STATS.map((p, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                        <td style={{ padding: '11px 14px', fontSize: 13, color: '#fff', fontWeight: 600 }}>{p.usuario}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'rgba(13,148,136,.2)', color: '#5EEAD4', fontWeight: 600 }}>{p.tipo}</span>
                        </td>
                        <td style={{ padding: '11px 14px', fontSize: 13, color: '#FCA5A5', fontWeight: 700 }}>{p.likes}</td>
                        <td style={{ padding: '11px 14px', fontSize: 13, color: '#93C5FD', fontWeight: 700 }}>{p.comentarios}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: p.reportes > 0 ? '#FCD34D' : 'rgba(255,255,255,.3)' }}>
                            {p.reportes > 0 ? `⚠️ ${p.reportes}` : '—'}
                          </span>
                        </td>
                        <td style={{ padding: '11px 14px', fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{p.fecha}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: 'none', background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.6)', cursor: 'pointer' }}>Ver</button>
                            {p.reportes > 0 && <button style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: 'none', background: 'rgba(220,38,38,.2)', color: '#FCA5A5', cursor: 'pointer' }}>Eliminar</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── OFERTAS ── */}
          {tab === 'ofertas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '1rem', marginBottom: 8 }}>
                {[
                  { label: 'Ofertas activas', value: OFERTAS_STATS.length, color: '#FCD34D', icon: '🔥' },
                  { label: 'Vistas totales', value: OFERTAS_STATS.reduce((a,o) => a + o.views, 0), color: '#5EEAD4', icon: '👁️' },
                  { label: 'Contactos generados', value: OFERTAS_STATS.reduce((a,o) => a + o.contactos, 0), color: '#86EFAC', icon: '📩' },
                  { label: 'Stock crítico (<10)', value: OFERTAS_STATS.filter(o => o.stock < 10).length, color: '#FCA5A5', icon: '⚠️' },
                ].map(k => (
                  <div key={k.label} style={{ background: '#1E293B', borderRadius: 12, padding: '1.1rem', border: '1px solid rgba(255,255,255,.06)' }}>
                    <div style={{ fontSize: '1.1rem', marginBottom: 6 }}>{k.icon}</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: k.color }}>{k.value}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 4 }}>{k.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#1E293B', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,.06)' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>🔥 Ofertas calientes activas</span>
                  <button style={{ fontSize: 12, padding: '6px 14px', borderRadius: 8, border: 'none', background: 'rgba(13,148,136,.2)', color: '#5EEAD4', cursor: 'pointer', fontWeight: 600 }}>+ Nueva oferta</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                      {['Producto', 'Productor', 'Views', 'Contactos', 'Stock', 'Descuento', 'Acción'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {OFERTAS_STATS.map((o, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                        <td style={{ padding: '11px 14px', fontSize: 13, color: '#fff', fontWeight: 600 }}>{o.producto}</td>
                        <td style={{ padding: '11px 14px', fontSize: 12, color: 'rgba(255,255,255,.5)' }}>{o.productor}</td>
                        <td style={{ padding: '11px 14px', fontSize: 13, color: '#5EEAD4', fontWeight: 700 }}>{o.views}</td>
                        <td style={{ padding: '11px 14px', fontSize: 13, color: '#86EFAC', fontWeight: 700 }}>{o.contactos}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: o.stock < 10 ? '#FCA5A5' : 'rgba(255,255,255,.6)' }}>
                            {o.stock < 10 ? `⚠️ ${o.stock}` : o.stock}
                          </span>
                        </td>
                        <td style={{ padding: '11px 14px' }}>
                          <span style={{ fontSize: 12, fontWeight: 800, color: '#FCD34D' }}>-{o.descuento}%</span>
                        </td>
                        <td style={{ padding: '11px 14px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: 'none', background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.6)', cursor: 'pointer' }}>Editar</button>
                            <button style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: 'none', background: 'rgba(220,38,38,.15)', color: '#FCA5A5', cursor: 'pointer' }}>Pausar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ACTIVIDAD ── */}
          {tab === 'actividad' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 4 }}>Mostrando las últimas {INTERACCIONES.length} interacciones</div>
              {INTERACCIONES.map(act => {
                const cfg = TIPO_CONFIG[act.tipo]
                return (
                  <div key={act.id} style={{ background: '#1E293B', borderRadius: 12, padding: '1rem 1.25rem', border: '1px solid rgba(255,255,255,.06)', display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${cfg.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{cfg.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{act.pais} {act.usuario}</span>
                        {act.target && <span style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>→ {act.target}</span>}
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: `${cfg.color}20`, color: cfg.color }}>{act.tipo}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>{act.detalle}</div>
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', whiteSpace: 'nowrap', textAlign: 'right', flexShrink: 0 }}>
                      <div>{act.fecha.split(' ')[1]}</div>
                      <div style={{ marginTop: 2 }}>{act.fecha.split(' ')[0]}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

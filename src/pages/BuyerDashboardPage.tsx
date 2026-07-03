import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import type { Lang } from '../context/LangContext'

function getUser() { try { return JSON.parse(localStorage.getItem('gn_current_user') || 'null') } catch { return null } }
function getBProfile(email: string) { try { return JSON.parse(localStorage.getItem(`gn_bprofile_${email}`) || '{}') } catch { return {} } }
function saveBProfile(email: string, d: object) { localStorage.setItem(`gn_bprofile_${email}`, JSON.stringify(d)) }
function getSaved(email: string): SavedSupplier[] { try { return JSON.parse(localStorage.getItem(`gn_saved_${email}`) || '[]') } catch { return [] } }
function saveSavedFn(email: string, d: SavedSupplier[]) { localStorage.setItem(`gn_saved_${email}`, JSON.stringify(d)) }

interface SavedSupplier { id: string; name: string; category: string; country: string; note: string }

const C = { navy: '#1E3A5F', teal: '#0D9488', tealLight: '#CCFBF1', gold: '#D97706', green: '#16A34A', border: '#E2E8F0', bg: '#F8FAFC', white: '#FFFFFF', text: '#0F172A', muted: '#64748B', red: '#DC2626', blue: '#1E40AF', blueBg: '#EFF6FF', blueBorder: '#93C5FD' }

const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
  width: '100%', padding: '10px 12px', border: `1.5px solid ${C.border}`,
  borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: C.white,
  boxSizing: 'border-box', color: C.text, outline: 'none', ...extra,
})

/* ── Demo data ── */
const DEMO_SUPPLIERS = [
  { name: 'Hacienda Los Camichines', flag: '🏭', product: 'Tequila Añejo · Jalisco', status: 'Cotización enviada', statusColor: '#7C3AED', statusBg: '#EDE9FE', time: '22:14' },
  { name: 'Café Chiapas Orgánico', flag: '☕', product: 'Café SHG · Chiapas', status: 'En contacto', statusColor: C.teal, statusBg: C.tealLight, time: '09:14' },
  { name: 'Mielería San Marcos', flag: '🍯', product: 'Miel Melipona · Yucatán', status: 'Nuevo', statusColor: C.green, statusBg: '#DCFCE7', time: 'Ayer' },
]
const DEMO_RFQS = [
  { id: 'RFQ-2026-0018', desc: '200 cajas Tequila Añejo · Hacienda Los Camichines', amount: '$8,200 USD', status: 'Respuesta recibida ✉️', statusColor: C.teal, statusBg: C.tealLight },
  { id: 'RFQ-2026-0016', desc: '500 kg Café Chiapas SHG · Café Chiapas Orgánico', amount: '$5,750 USD', status: 'Pendiente', statusColor: C.gold, statusBg: '#FEF3C7' },
]

/* ── Sidebar nav ── */
type NavItem = { icon: string; label: string; id: number; badge?: number }
function getSidebarNav(lang: Lang, savedCount: number): NavItem[] {
  const es = lang === 'es'; const nl = lang === 'nl'; const de = lang === 'de'
  return [
    { icon: '📊', label: es ? 'Dashboard' : nl ? 'Dashboard' : de ? 'Dashboard' : 'Dashboard', id: 0 },
    { icon: '🇪🇺', label: es ? 'Mi perfil' : nl ? 'Mijn profiel' : de ? 'Mein Profil' : 'My profile', id: 1 },
    { icon: '🔍', label: es ? 'Catálogo MX' : nl ? 'MX catalogus' : de ? 'MX-Katalog' : 'MX catalog', id: 2 },
    { icon: '📋', label: es ? 'Mis búsquedas' : nl ? 'Mijn zoekopdrachten' : de ? 'Meine Suchen' : 'My searches', id: 3, badge: savedCount || undefined },
    { icon: '💬', label: es ? 'Mensajes' : nl ? 'Berichten' : de ? 'Nachrichten' : 'Messages', id: 4, badge: 3 },
    { icon: '📜', label: es ? 'Mis RFQs' : nl ? 'Mijn RFQs' : de ? 'Meine RFQs' : 'My RFQs', id: 5 },
  ]
}

/* ── Tutorial chat ── */
const TUTORIAL_BUYER: Record<Lang, { msg: string; delay: number }[]> = {
  es: [
    { msg: '👋 ¡Bienvenido a Global Nexus! Soy tu asistente para compradores europeos.', delay: 0 },
    { msg: '🇪🇺 Tendrás acceso directo a productores mexicanos certificados con **0% de arancel** gracias al TLCUEM.', delay: 1800 },
    { msg: '🔍 Completa tu **Perfil de Comprador**: industria, productos de interés y VAT. Los productores te encontrarán más fácil.', delay: 3800 },
    { msg: '📋 Guarda en **Mis Búsquedas** los productos y proveedores que te interesan para cuando se active el catálogo.', delay: 6000 },
    { msg: '🚀 La conexión directa con productores se activa el **28 de agosto de 2026**. ¡Estás en la lista de prioridad!', delay: 8200 },
    { msg: '💬 Soporte: soporte@nexusstrategy.online — respondemos en menos de 24 horas.', delay: 10500 },
  ],
  en: [
    { msg: '👋 Welcome to Global Nexus! I\'m your onboarding assistant for European buyers.', delay: 0 },
    { msg: '🇪🇺 You\'ll have direct access to certified Mexican producers with **0% tariff** thanks to TLCUEM.', delay: 1800 },
    { msg: '🔍 Complete your **Buyer Profile**: industry, products of interest and VAT number.', delay: 3800 },
    { msg: '📋 Save in **My Searches** the products and suppliers you\'re interested in.', delay: 6000 },
    { msg: '🚀 Direct connection with producers activates on **August 28, 2026**. You\'re on the priority list!', delay: 8200 },
    { msg: '💬 Support: soporte@nexusstrategy.online', delay: 10500 },
  ],
  nl: [
    { msg: '👋 Welkom bij Global Nexus! Ik ben uw assistent voor Europese kopers.', delay: 0 },
    { msg: '🇪🇺 U heeft directe toegang tot gecertificeerde Mexicaanse producenten met **0% tarief** via TLCUEM.', delay: 1800 },
    { msg: '🔍 Vul uw **Kopersprofiel** in: industrie, interesseproducten en BTW-nummer.', delay: 3800 },
    { msg: '📋 Sla in **Mijn Zoekopdrachten** producten en leveranciers op.', delay: 6000 },
    { msg: '🚀 Directe verbinding wordt actief op **28 augustus 2026**.', delay: 8200 },
    { msg: '💬 Ondersteuning: soporte@nexusstrategy.online', delay: 10500 },
  ],
  de: [
    { msg: '👋 Willkommen bei Global Nexus! Ich bin Ihr Assistent für europäische Käufer.', delay: 0 },
    { msg: '🇪🇺 Sie haben direkten Zugang zu zertifizierten mexikanischen Produzenten mit **0% Zoll** via TLCUEM.', delay: 1800 },
    { msg: '🔍 Vervollständigen Sie Ihr **Käuferprofil**: Branche, Interessensprodukte und USt-IdNr.', delay: 3800 },
    { msg: '📋 Speichern Sie in **Meine Suchen** Produkte und Lieferanten.', delay: 6000 },
    { msg: '🚀 Direkte Verbindung wird am **28. August 2026** aktiv.', delay: 8200 },
    { msg: '💬 Support: soporte@nexusstrategy.online', delay: 10500 },
  ],
}

function BuyerChat({ lang }: { lang: Lang }) {
  const msgs = TUTORIAL_BUYER[lang]
  const [shown, setShown] = useState<typeof msgs>([])
  const [input, setInput] = useState('')
  const [userMsgs, setUserMsgs] = useState<string[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const placeholder = lang === 'es' ? 'Escribe una pregunta...' : lang === 'nl' ? 'Stel een vraag...' : lang === 'de' ? 'Frage stellen...' : 'Ask a question...'
  const sendLabel = lang === 'es' ? 'Enviar' : lang === 'nl' ? 'Verzenden' : lang === 'de' ? 'Senden' : 'Send'

  useEffect(() => { msgs.forEach(m => setTimeout(() => setShown(prev => [...prev, m]), m.delay)) }, [])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [shown, userMsgs])

  const send = () => {
    if (!input.trim()) return
    const msg = input.trim(); setInput('')
    setUserMsgs(s => [...s, msg])
    setTimeout(() => setShown(prev => [...prev, {
      msg: lang === 'es' ? '📩 Gracias por tu pregunta. Escríbenos a soporte@nexusstrategy.online — respondemos en menos de 24 horas.' : '📩 Thanks! Write to soporte@nexusstrategy.online for personalized support.',
      delay: 0,
    }]), 1000)
  }

  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 460 }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10, background: `${C.blueBg}` }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${C.navy}, #1a4a7a)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🌐</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>Global Nexus · Support</div>
          <div style={{ fontSize: 11, color: C.green, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, display: 'inline-block' }} /> Online</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {shown.map((m, i) => (
          <div key={`b${i}`} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', maxWidth: '80%' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `${C.navy}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', flexShrink: 0 }}>🌐</div>
            <div style={{ background: C.blueBg, border: `1px solid ${C.blueBorder}`, borderRadius: '4px 12px 12px 12px', padding: '10px 14px', fontSize: 13, lineHeight: 1.7, color: C.text }}
              dangerouslySetInnerHTML={{ __html: m.msg.replace(/\*\*(.*?)\*\*/g, `<strong style="color:${C.navy}">$1</strong>`) }} />
          </div>
        ))}
        {userMsgs.map((s, i) => (
          <div key={`u${i}`} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ background: `linear-gradient(135deg, ${C.navy}, #1a4a7a)`, borderRadius: '12px 4px 12px 12px', padding: '10px 14px', fontSize: 13, color: '#fff', maxWidth: '70%' }}>{s}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: '.75rem 1rem', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder={placeholder} style={{ ...inp(), flex: 1, padding: '9px 12px' }} />
        <button onClick={send} style={{ padding: '9px 16px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${C.navy}, #1a4a7a)`, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>{sendLabel}</button>
      </div>
    </div>
  )
}

/* ════════════════ MAIN ════════════════ */
export default function BuyerDashboardPage() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const user = getUser()

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.role === 'productor' || user.role === 'asesor') navigate('/dashboard')
  }, [])

  const email = user?.email || ''
  const [profile, setProfile] = useState(() => getBProfile(email))
  const [saved, setSavedList] = useState<SavedSupplier[]>(() => getSaved(email))
  const [tab, setTab] = useState(0)
  const [saveMsg, setSaveMsg] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState<Partial<SavedSupplier>>({})
  const [demoMode, setDemoMode] = useState(false)
  const photoRef = useRef<HTMLInputElement>(null)

  if (!user) return null

  const pChecks = [!!profile.photo, !!profile.country, !!profile.industry, !!profile.interests, !!profile.vat, !!profile.volume]
  const pPct = Math.round((pChecks.filter(Boolean).length / pChecks.length) * 100)
  const navItems = getSidebarNav(lang as Lang, saved.length)

  const es = lang === 'es'; const nl = lang === 'nl'; const de = lang === 'de'
  const t = (a: string, b: string, c: string, d: string) => es ? a : nl ? b : de ? c : d

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { const u = { ...profile, photo: ev.target?.result as string }; setProfile(u); saveBProfile(email, u) }
    reader.readAsDataURL(file)
  }

  const saveProfileData = () => { saveBProfile(email, profile); setSaveMsg(true); setTimeout(() => setSaveMsg(false), 2500) }

  const addItem = () => {
    if (!newItem.name) return
    const updated = [...saved, { ...newItem, id: Date.now().toString() } as SavedSupplier]
    setSavedList(updated); saveSavedFn(email, updated); setNewItem({}); setShowAdd(false)
  }

  const logout = () => { localStorage.removeItem('gn_current_user'); navigate('/login') }

  const EU_COUNTRIES = ['Alemania / Germany', 'Países Bajos / Netherlands', 'España / Spain', 'Francia / France', 'Italia / Italy', 'Bélgica / Belgium', 'Austria', 'Polonia / Poland', 'Suecia / Sweden', 'Otro / Other']
  const industries = es
    ? ['Alimentación y bebidas', 'Distribución / Importación', 'Retail / E-commerce', 'Farmacéutica / Cosmética', 'HoReCa', 'Otra']
    : nl ? ['Voeding & Dranken', 'Distributie / Import', 'Retail / E-commerce', 'Farmaceutisch / Cosmetica', 'HoReCa', 'Overig']
    : de ? ['Lebensmittel & Getränke', 'Distribution / Import', 'Einzelhandel', 'Pharmazeutisch / Kosmetik', 'HoReCa', 'Sonstige']
    : ['Food & Beverages', 'Distribution / Import', 'Retail / E-commerce', 'Pharmaceutical / Cosmetics', 'HoReCa', 'Other']

  const checklistItems = es
    ? ['Foto de empresa', 'País de operación', 'Industria / Sector', 'Productos de interés', 'VAT / Número fiscal', 'Volumen de compra estimado']
    : ['Company photo', 'Country of operation', 'Industry / Sector', 'Products of interest', 'VAT / Tax number', 'Estimated purchase volume']

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: 'inherit' }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width: 220, background: C.navy, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        {/* Logo */}
        <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #3B82F6, #1E3A5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#fff', flexShrink: 0 }}>GN</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, color: '#fff' }}>Global Nexus</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.45)' }}>EU Buyer Panel</div>
            </div>
          </div>
        </div>

        {/* User mini */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setTab(1)}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,.12)', overflow: 'hidden', flexShrink: 0, border: '1.5px solid rgba(255,255,255,.2)' }}>
            {profile.photo
              ? <img src={profile.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🇪🇺</div>
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name || t('Mi empresa', 'Mijn bedrijf', 'Mein Unternehmen', 'My company')}</div>
            <div style={{ fontSize: 10, color: '#93C5FD', fontWeight: 600, marginTop: 1 }}>{pPct}% {t('Perfil', 'Profiel', 'Profil', 'Profile')}</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem 0.75rem' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 9, border: 'none', background: tab === item.id ? 'rgba(59,130,246,.25)' : 'transparent', color: tab === item.id ? '#93C5FD' : 'rgba(255,255,255,.65)', fontWeight: tab === item.id ? 700 : 400, fontSize: 13, cursor: 'pointer', marginBottom: 2, textAlign: 'left', transition: 'all .15s', position: 'relative' }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge ? <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 100, background: tab === item.id ? '#3B82F6' : '#EF4444', color: '#fff', minWidth: 18, textAlign: 'center' }}>{item.badge}</span> : null}
              {tab === item.id && <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, borderRadius: 2, background: '#93C5FD' }} />}
            </button>
          ))}

          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', margin: '0.75rem 0' }} />

          {[
            { icon: '📊', label: t('Analíticas', 'Analyses', 'Analysen', 'Analytics') },
            { icon: '🚢', label: t('Logística', 'Logistiek', 'Logistik', 'Logistics') },
            { icon: '⚙️', label: t('Ajustes', 'Instellingen', 'Einstellungen', 'Settings') },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 9, color: 'rgba(255,255,255,.3)', fontSize: 13, marginBottom: 2 }}>
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 100, background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.3)' }}>SOON</span>
            </div>
          ))}
        </nav>

        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <button onClick={logout} style={{ width: '100%', padding: '9px', borderRadius: 8, border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.6)', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
            {t('Cerrar sesión', 'Uitloggen', 'Abmelden', 'Sign out')}
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>

        {/* ── TAB 0: DASHBOARD ── */}
        {tab === 0 && (
          <div style={{ padding: '1.75rem 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h1 style={{ fontWeight: 900, fontSize: '1.4rem', color: C.navy, margin: 0 }}>
                  {t('Panel de Comprador EU', 'EU-Koperspaneel', 'EU-Käufer-Panel', 'EU Buyer Panel')}
                </h1>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                  {t('Marketplace B2B · Pre-lanzamiento', 'B2B Marktplaats · Pre-lancering', 'B2B Marktplatz · Vor-Launch', 'B2B Marketplace · Pre-launch')}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={() => setDemoMode(d => !d)}
                  style={{ padding: '7px 14px', borderRadius: 8, border: `1.5px solid ${demoMode ? C.navy : C.border}`, background: demoMode ? '#DBEAFE' : C.white, color: demoMode ? C.navy : C.muted, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  {demoMode ? '👁 Demo ON' : '👁 Ver demo'}
                </button>
                <div style={{ padding: '7px 14px', borderRadius: 8, background: '#DBEAFE', color: C.blue, fontSize: 12, fontWeight: 700, border: `1px solid ${C.blueBorder}` }}>
                  🚀 28 Ago 2026
                </div>
              </div>
            </div>

            {/* Banner */}
            <div style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', border: `1.5px solid ${C.blueBorder}`, borderRadius: 12, padding: '0.875rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.1rem' }}>🇪🇺</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 800, fontSize: 13, color: C.blue }}>
                  {t('Modo Pre-Lanzamiento · Lanzamiento: 28 Ago 2026 · 12:00 pm CDMX', 'Pre-Lancering · 28 aug 2026', 'Vor-Launch · 28. Aug 2026', 'Pre-Launch Mode · Aug 28, 2026')}
                </span>
                <span style={{ fontSize: 12, color: '#1E3A8A', marginLeft: 8 }}>
                  {t('· Sin cobros hasta el 29 de septiembre', '· Geen kosten tot 29 september', '· Keine Kosten bis 29. September', '· No charges until Sep 29')}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { icon: '🏭', value: demoMode ? '847' : '—', label: t('Productores MX', 'MX producenten', 'MX Produzenten', 'MX Producers'), delta: demoMode ? '+23' : null, color: C.navy },
                { icon: '🏷️', value: '0%', label: t('Arancel TLCUEM', 'TLCUEM tarief', 'TLCUEM-Zoll', 'TLCUEM Tariff'), delta: null, color: C.green },
                { icon: '📋', value: demoMode ? '$180K' : `${saved.length}`, label: demoMode ? t('Vol. importación', 'Import volume', 'Importvolumen', 'Import volume') : t('Búsquedas guardadas', 'Opgeslagen zoekopdrachten', 'Gespeicherte Suchen', 'Saved searches'), delta: null, color: C.teal },
                { icon: '⭐', value: demoMode ? '4.8★' : `${pPct}%`, label: demoMode ? t('Satisfacción', 'Tevredenheid', 'Zufriedenheit', 'Satisfaction') : t('Perfil completo', 'Profiel voltooid', 'Profil vollständig', 'Profile complete'), delta: null, color: C.gold },
              ].map((s, i) => (
                <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                  <div style={{ fontSize: '1.3rem', marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 'clamp(1.4rem,2.5vw,1.9rem)', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</span>
                    {s.delta && <span style={{ fontSize: 11, fontWeight: 700, color: C.green }}>▲ {s.delta}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Two columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              {/* Proveedores recientes */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>🏭 {t('Proveedores MX activos', 'Actieve MX leveranciers', 'Aktive MX Lieferanten', 'Active MX suppliers')}</span>
                  {demoMode && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: '#DBEAFE', color: C.navy, fontWeight: 700 }}>DEMO</span>}
                </div>
                {demoMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {DEMO_SUPPLIERS.map((s, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: C.bg, border: `1px solid ${C.border}` }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: `${C.navy}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{s.flag}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: C.muted }}>{s.product} · {s.time}</div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: s.statusBg, color: s.statusColor }}>{s.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: C.muted }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🏭</div>
                    <div style={{ fontSize: 13, marginBottom: 12 }}>{t('Los productores mexicanos certificados estarán disponibles el 28 de agosto.', 'Gecertificeerde Mexicaanse producenten zijn beschikbaar op 28 augustus.', 'Zertifizierte mexikanische Produzenten sind ab 28. August verfügbar.', 'Certified Mexican producers will be available from August 28.')}</div>
                    <button onClick={() => setDemoMode(true)} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      👁 {t('Ver demo', 'Demo zien', 'Demo ansehen', 'See demo')}
                    </button>
                  </div>
                )}
              </div>

              {/* RFQs */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>📋 {t('Mis RFQs activos', 'Mijn actieve RFQs', 'Meine aktiven RFQs', 'My active RFQs')}</span>
                  {demoMode && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: '#DBEAFE', color: C.navy, fontWeight: 700 }}>DEMO</span>}
                </div>
                {demoMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {DEMO_RFQS.map((r, i) => (
                      <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: C.bg, border: `1px solid ${C.border}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: C.navy }}>{r.id}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: r.statusBg, color: r.statusColor }}>{r.status}</span>
                        </div>
                        <div style={{ fontSize: 12, color: C.text, marginBottom: 2 }}>{r.desc}</div>
                        <div style={{ fontWeight: 800, fontSize: 13, color: C.navy }}>{r.amount}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: C.muted }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📋</div>
                    <div style={{ fontSize: 13 }}>{t('Tus solicitudes de cotización aparecerán aquí una vez que el catálogo esté activo.', 'Offerteaanvragen verschijnen hier.', 'Angebotsanfragen erscheinen hier.', 'Your RFQs will appear here once the catalog is active.')}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Checklist + How it works */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {/* Checklist */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>📋 {t('Completa tu perfil', 'Vul uw profiel in', 'Profil vervollständigen', 'Complete your profile')}</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: pPct >= 67 ? C.green : C.gold }}>{pPct}%</div>
                </div>
                <div style={{ width: '100%', height: 6, borderRadius: 3, background: '#F1F5F9', marginBottom: '1rem' }}>
                  <div style={{ width: `${pPct}%`, height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${C.navy}, #1a4a7a)`, transition: 'width .6s' }} />
                </div>
                {checklistItems.map((item, i) => (
                  <div key={i} onClick={() => !pChecks[i] && setTab(1)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: i < 5 ? `1px solid ${C.border}` : 'none', cursor: pChecks[i] ? 'default' : 'pointer' }}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0, background: pChecks[i] ? '#DCFCE7' : '#F8FAFC', border: `1.5px solid ${pChecks[i] ? C.green : C.border}`, color: C.green, fontWeight: 800 }}>
                      {pChecks[i] ? '✓' : ''}
                    </div>
                    <span style={{ fontSize: 12, color: pChecks[i] ? C.muted : C.text, textDecoration: pChecks[i] ? 'line-through' : 'none', flex: 1 }}>{item}</span>
                    {!pChecks[i] && <span style={{ fontSize: 10, color: C.navy, fontWeight: 700 }}>→</span>}
                  </div>
                ))}
                <button onClick={() => setTab(1)} style={{ width: '100%', marginTop: '0.75rem', padding: '9px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${C.navy}, #1a4a7a)`, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  {t('Completar mi perfil →', 'Profiel voltooien →', 'Profil vervollständigen →', 'Complete my profile →')}
                </button>
              </div>

              {/* Cómo funciona */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: '1rem' }}>
                  🤝 {t('Cómo importar con TLCUEM', 'Hoe importeren via TLCUEM', 'So importieren via TLCUEM', 'How to import via TLCUEM')}
                </div>
                {[
                  { icon: '🔍', label: t('Busca en el catálogo de productores MX certificados', 'Zoek in de catalogus van gecertificeerde MX producenten', 'Suche im Katalog zertifizierter MX Produzenten', 'Browse the catalog of certified MX producers') },
                  { icon: '📩', label: t('Envía solicitud de contacto directo', 'Stuur een direct contactverzoek', 'Senden Sie eine direkte Kontaktanfrage', 'Send a direct contact request') },
                  { icon: '💬', label: t('Negocia vía chat multilingüe', 'Onderhandel via meertalige chat', 'Verhandeln Sie via mehrsprachigem Chat', 'Negotiate via multilingual chat') },
                  { icon: '📋', label: t('Solicita cotización RFQ personalizada', 'Vraag een gepersonaliseerde offerte (RFQ)', 'Fordern Sie ein personalisiertes Angebot an', 'Request personalized quote (RFQ)') },
                  { icon: '✅', label: t('Importa con 0% arancel vía TLCUEM', 'Importeer met 0% tarief via TLCUEM', 'Importieren mit 0% Zoll via TLCUEM', 'Import with 0% tariff via TLCUEM') },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < 4 ? 10 : 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.blueBg, border: `2px solid ${C.blueBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>{s.icon}</div>
                      {i < 4 && <div style={{ width: 1, height: 12, background: C.border, marginTop: 2 }} />}
                    </div>
                    <div style={{ paddingTop: 4, fontSize: 11, color: C.text, lineHeight: 1.4 }}>{s.label}</div>
                  </div>
                ))}
                <div style={{ marginTop: '1rem', padding: '8px 12px', borderRadius: 8, background: C.blueBg, border: `1px solid ${C.blueBorder}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.blue }}>🚀 {t('Activo el 28 Ago 2026', 'Actief op 28 aug 2026', 'Aktiv ab 28. Aug 2026', 'Active Aug 28, 2026')}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 1: PERFIL ── */}
        {tab === 1 && (
          <div style={{ padding: '1.75rem 2rem' }}>
            {/* Hero */}
            <div style={{ background: `linear-gradient(135deg, ${C.navy}, #1a3d6b 70%, #0b5c8a)`, borderRadius: 16, padding: '1.5rem 2rem', marginBottom: '1.5rem', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ width: 72, height: 72, borderRadius: 16, background: 'rgba(255,255,255,.15)', overflow: 'hidden', flexShrink: 0, border: '2.5px solid rgba(255,255,255,.3)', cursor: 'pointer' }} onClick={() => photoRef.current?.click()}>
                  {profile.photo ? <img src={profile.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🇪🇺</div>}
                </div>
                <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: '1.2rem' }}>{user.name || t('Tu empresa', 'Uw bedrijf', 'Ihr Unternehmen', 'Your company')}</div>
                  {profile.country && <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', marginTop: 3 }}>🇪🇺 {profile.country} · {profile.industry || t('Comprador EU', 'EU Koper', 'EU Käufer', 'EU Buyer')}</div>}
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: '#93C5FD', color: C.navy }}>✓ {t('Comprador Verificado EU', 'Geverifieerde EU Koper', 'Verifizierter EU Käufer', 'Verified EU Buyer')}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'center' }}>
                  {[
                    { value: saved.length, label: t('Búsquedas', 'Zoekopdrachten', 'Suchen', 'Searches') },
                    { value: demoMode ? 12 : '—', label: t('Contactos MX', 'MX contacten', 'MX Kontakte', 'MX Contacts') },
                    { value: demoMode ? '€180K' : '—', label: t('Vol. importado', 'Geïmporteerd vol.', 'Importiert Vol.', 'Import vol.') },
                  ].map((s, i) => (
                    <div key={i}>
                      <div style={{ fontWeight: 900, fontSize: '1.4rem', color: '#93C5FD' }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: 'rgba(255,255,255,.7)' }}>
                  <span>{t('Perfil completo', 'Profiel voltooid', 'Profil vollständig', 'Profile complete')}</span>
                  <span style={{ fontWeight: 800, color: pPct >= 67 ? '#93C5FD' : '#FCD34D' }}>{pPct}%</span>
                </div>
                <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,.15)' }}>
                  <div style={{ width: `${pPct}%`, height: '100%', borderRadius: 3, background: pPct >= 67 ? '#93C5FD' : '#FCD34D', transition: 'width .6s' }} />
                </div>
              </div>
            </div>

            {/* Form */}
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.75rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.5rem', color: C.navy }}>
                {t('Perfil de Comprador Europeo', 'Europees Kopersprofiel', 'Europäisches Käuferprofil', 'European Buyer Profile')}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6 }}>{t('País (EU)', 'Land (EU)', 'Land (EU)', 'Country (EU)')}</label>
                    <select value={profile.country || ''} onChange={e => setProfile((p: Record<string,string>) => ({ ...p, country: e.target.value }))} style={{ ...inp(), cursor: 'pointer' }}>
                      <option value="">—</option>
                      {EU_COUNTRIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6 }}>{t('Industria / Sector', 'Industrie / Sector', 'Branche / Sektor', 'Industry / Sector')}</label>
                    <select value={profile.industry || ''} onChange={e => setProfile((p: Record<string,string>) => ({ ...p, industry: e.target.value }))} style={{ ...inp(), cursor: 'pointer' }}>
                      <option value="">—</option>
                      {industries.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6 }}>{t('VAT / Número fiscal EU', 'BTW / EU-fiscaal nummer', 'USt-IdNr. / EU-Steuernummer', 'VAT / EU Tax number')}</label>
                    <input value={profile.vat || ''} onChange={e => setProfile((p: Record<string,string>) => ({ ...p, vat: e.target.value }))} placeholder="DE123456789" style={inp()} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6 }}>{t('Volumen de compra anual estimado', 'Geschat jaarlijks aankoopvolume', 'Geschätztes jährliches Einkaufsvolumen', 'Estimated annual purchase volume')}</label>
                    <input value={profile.volume || ''} onChange={e => setProfile((p: Record<string,string>) => ({ ...p, volume: e.target.value }))} placeholder="€50,000 / año" style={inp()} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6 }}>{t('Productos de interés (separados por coma)', 'Interesseproducten (kommagescheiden)', 'Interessensprodukte (kommagetrennt)', 'Products of interest (comma-separated)')}</label>
                  <input value={profile.interests || ''} onChange={e => setProfile((p: Record<string,string>) => ({ ...p, interests: e.target.value }))} placeholder="Tequila, café orgánico, miel, artesanías..." style={inp()} />
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <button onClick={saveProfileData} style={{ padding: '11px 24px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg, ${C.navy}, #1a4a7a)`, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                    {saveMsg ? t('✓ Guardado', '✓ Opgeslagen', '✓ Gespeichert', '✓ Saved') : t('Guardar perfil', 'Profiel opslaan', 'Profil speichern', 'Save profile')}
                  </button>
                  <button onClick={() => photoRef.current?.click()} style={{ padding: '11px 18px', borderRadius: 10, border: `1.5px solid ${C.navy}`, background: 'transparent', color: C.navy, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                    {t('Foto de empresa', 'Bedrijfsfoto', 'Unternehmensfoto', 'Company photo')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: CATÁLOGO MX ── */}
        {tab === 2 && (
          <div style={{ padding: '1.75rem 2rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: C.navy, marginBottom: '1.25rem' }}>🔍 {t('Catálogo de Productores Mexicanos', 'Catalogus van Mexicaanse Producenten', 'Katalog mexikanischer Produzenten', 'Mexican Producers Catalog')}</h2>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '3.5rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🏭</div>
              <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: C.navy, marginBottom: 8 }}>
                {t('Catálogo disponible el 28 de agosto de 2026', 'Catalogus beschikbaar op 28 augustus 2026', 'Katalog verfügbar ab 28. August 2026', 'Catalog available August 28, 2026')}
              </h3>
              <p style={{ fontSize: 13, color: C.muted, maxWidth: 440, margin: '0 auto 1.5rem', lineHeight: 1.7 }}>
                {t(
                  'El catálogo completo de productores mexicanos certificados estará disponible en la fecha de lanzamiento. Mientras tanto, guarda tus categorías de interés en "Mis Búsquedas".',
                  'De volledige catalogus van gecertificeerde Mexicaanse producenten is beschikbaar op de lanceringsdatum.',
                  'Der vollständige Katalog zertifizierter mexikanischer Produzenten ist ab dem Launch verfügbar.',
                  'The full catalog of certified Mexican producers will be available on launch date. Meanwhile, save your interest categories in "My Searches".'
                )}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, maxWidth: 480, margin: '0 auto 1.5rem' }}>
                {['🥃 Tequila & Mezcal', '☕ Café & Cacao', '🍯 Miel & Dulces', '🌿 Productos Orgánicos', '🧴 Cosméticos Naturales', '🎨 Artesanías'].map((cat, i) => (
                  <div key={i} style={{ padding: '10px', borderRadius: 10, background: C.blueBg, border: `1px solid ${C.blueBorder}`, fontSize: 12, fontWeight: 600, color: C.navy, textAlign: 'center' }}>{cat}</div>
                ))}
              </div>
              <button onClick={() => setTab(3)} style={{ padding: '11px 24px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg, ${C.navy}, #1a4a7a)`, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                📋 {t('Guardar mis intereses →', 'Mijn interesses opslaan →', 'Interessen speichern →', 'Save my interests →')}
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 3: MIS BÚSQUEDAS ── */}
        {tab === 3 && (
          <div style={{ padding: '1.75rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: C.navy, margin: 0 }}>📋 {t('Mis búsquedas guardadas', 'Mijn opgeslagen zoekopdrachten', 'Meine gespeicherten Suchen', 'My saved searches')} ({saved.length})</h2>
              <button onClick={() => setShowAdd(o => !o)} style={{ padding: '9px 18px', borderRadius: 9, border: 'none', background: showAdd ? C.border : C.navy, color: showAdd ? C.text : '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                {showAdd ? `✕ ${t('Cancelar', 'Annuleren', 'Abbrechen', 'Cancel')}` : `+ ${t('Guardar interés', 'Interesse opslaan', 'Interesse speichern', 'Save interest')}`}
              </button>
            </div>

            {showAdd && (
              <div style={{ background: C.white, border: `1.5px solid ${C.navy}30`, borderRadius: 14, padding: '1.5rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  {[
                    { key: 'name', label: t('Nombre / categoría de interés', 'Naam interesse / categorie', 'Interessen-Name / Kategorie', 'Interest name / category'), placeholder: 'Tequila Premium, Café orgánico...', required: true },
                    { key: 'category', label: t('Categoría de producto', 'Productcategorie', 'Produktkategorie', 'Product category'), placeholder: t('Bebidas espirituosas', 'Spiritualiën', 'Spirituosen', 'Spirits') },
                    { key: 'country', label: t('País de origen preferido', 'Gewenst land van herkomst', 'Bevorzugtes Herkunftsland', 'Preferred country of origin'), placeholder: 'México' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 5 }}>{f.label}{f.required ? ' *' : ''}</label>
                      <input value={(newItem as Record<string,string>)[f.key] || ''} onChange={e => setNewItem(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inp()} />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 5 }}>{t('Notas (volumen, certificaciones requeridas...)', 'Notities (volume, vereiste certificeringen...)', 'Notizen (Volumen, Zertifizierungen...)', 'Notes (volume, required certifications...)')}</label>
                  <textarea value={newItem.note || ''} onChange={e => setNewItem(p => ({ ...p, note: e.target.value }))} rows={2} style={{ ...inp(), resize: 'vertical' }} />
                </div>
                <button onClick={addItem} style={{ padding: '10px 22px', borderRadius: 9, border: 'none', background: `linear-gradient(135deg, ${C.navy}, #1a4a7a)`, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  + {t('Guardar', 'Opslaan', 'Speichern', 'Save')}
                </button>
              </div>
            )}

            {saved.length === 0
              ? <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '3.5rem 2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>📋</div>
                  <div style={{ fontSize: 14, color: C.muted, maxWidth: 360, margin: '0 auto' }}>
                    {t('Guarda aquí tus categorías de interés y proveedores potenciales para cuando se active el catálogo el 28 de agosto.', 'Sla hier uw interessecategorieën op.', 'Speichern Sie hier Ihre Interessenskategorien.', 'Save your interest categories and potential suppliers here for when the catalog activates on August 28.')}
                  </div>
                </div>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {saved.map(s => (
                    <div key={s.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 10, background: C.blueBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>📋</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: C.muted }}>{[s.category, s.country].filter(Boolean).join(' · ')}</div>
                        {s.note && <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{s.note}</div>}
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: '#DBEAFE', color: C.navy, flexShrink: 0 }}>TLCUEM ✓</span>
                      <button onClick={() => { const u = saved.filter(x => x.id !== s.id); setSavedList(u); saveSavedFn(email, u) }}
                        style={{ padding: '5px 12px', borderRadius: 7, border: `1px solid ${C.border}`, background: 'transparent', color: C.red, fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>
                        {t('Eliminar', 'Verwijderen', 'Löschen', 'Delete')}
                      </button>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {/* ── TAB 4: MENSAJES ── */}
        {tab === 4 && (
          <div style={{ padding: '1.75rem 2rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: C.navy, marginBottom: '1.25rem' }}>💬 {t('Mensajes B2B', 'B2B-berichten', 'B2B-Nachrichten', 'B2B Messages')}</h2>
            <div style={{ marginBottom: '1.25rem' }}>
              <a href="/mensajes" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 24px', borderRadius: 12, background: `linear-gradient(135deg, ${C.navy}, #1a4a7a)`, color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'none', boxShadow: '0 4px 16px rgba(30,58,95,.3)' }}>
                💬 {t('Abrir chat en tiempo real →', 'Realtime chat openen →', 'Echtzeit-Chat öffnen →', 'Open real-time chat →')}
              </a>
            </div>
            {/* Quick phrases */}
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: '0.75rem' }}>
                💬 {t('Frases rápidas B2B', 'Snelle B2B-zinnen', 'Schnelle B2B-Phrasen', 'Quick B2B phrases')} <span style={{ fontSize: 11, fontWeight: 400, color: C.muted }}>({t('clic para copiar', 'klik om te kopiëren', 'Klick zum Kopieren', 'click to copy')})</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  'I\'m interested in sourcing [product] for the European market. Can you share your catalog?',
                  'Can you provide samples and export documentation (EUR.1, certificate of origin)?',
                  'What is your MOQ and pricing for EU import under TLCUEM?',
                  'We require TLCUEM certificate of origin for 0% tariff. Can you provide it?',
                ].map((phrase, i) => (
                  <button key={i} onClick={() => navigator.clipboard?.writeText(phrase)}
                    style={{ textAlign: 'left', padding: '10px 14px', borderRadius: 9, border: `1.5px solid ${C.border}`, background: C.bg, fontSize: 13, color: C.text, cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1.5, transition: 'all .15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.blueBorder; e.currentTarget.style.background = C.blueBg }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bg }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: C.navy, marginRight: 8 }}>📋</span>{phrase}
                  </button>
                ))}
              </div>
            </div>
            <BuyerChat lang={lang as Lang} />
          </div>
        )}

        {/* ── TAB 5: MIS RFQs ── */}
        {tab === 5 && (
          <div style={{ padding: '1.75rem 2rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: C.navy, marginBottom: '1.25rem' }}>📜 {t('Mis solicitudes de cotización (RFQ)', 'Mijn offerteaanvragen (RFQ)', 'Meine Angebotsanfragen (RFQ)', 'My requests for quote (RFQ)')}</h2>
            {demoMode ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { id: 'RFQ-2026-0018', supplier: 'Hacienda Los Camichines 🏭', product: '200 cajas Tequila Añejo', amount: '$8,200 USD', origin: 'Jalisco, México', status: t('Respuesta recibida ✉️', 'Antwoord ontvangen ✉️', 'Antwort erhalten ✉️', 'Response received ✉️'), statusColor: C.teal, statusBg: C.tealLight },
                  { id: 'RFQ-2026-0016', supplier: 'Café Chiapas Orgánico ☕', product: '500 kg Café SHG', amount: '$5,750 USD', origin: 'Chiapas, México', status: t('Pendiente', 'In behandeling', 'Ausstehend', 'Pending'), statusColor: C.gold, statusBg: '#FEF3C7' },
                  { id: 'RFQ-2026-0014', supplier: 'Mielería San Marcos 🍯', product: '50 kg Miel Melipona', amount: '$2,100 USD', origin: 'Yucatán, México', status: t('✅ Aceptada', '✅ Geaccepteerd', '✅ Akzeptiert', '✅ Accepted'), statusColor: C.green, statusBg: '#DCFCE7' },
                ].map((r, i) => (
                  <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 13, color: C.navy }}>{r.id}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginTop: 2 }}>{r.supplier}</div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 100, background: r.statusBg, color: r.statusColor }}>{r.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{r.product}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 900, fontSize: 14, color: C.navy }}>{r.amount}</span>
                      <span style={{ fontSize: 11, color: C.teal, fontWeight: 600 }}>📍 {r.origin}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '3.5rem 2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>📜</div>
                <div style={{ fontSize: 14, color: C.muted, maxWidth: 360, margin: '0 auto 1.25rem' }}>
                  {t('Tus solicitudes de cotización a productores mexicanos aparecerán aquí desde el 28 de agosto de 2026.', 'Offerteaanvragen verschijnen hier.', 'Angebotsanfragen erscheinen hier.', 'Your RFQs to Mexican producers will appear here from August 28, 2026.')}
                </div>
                <button onClick={() => setDemoMode(true)} style={{ padding: '9px 20px', borderRadius: 9, border: 'none', background: C.navy, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  👁 {t('Ver demo', 'Demo zien', 'Demo ansehen', 'See demo')}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

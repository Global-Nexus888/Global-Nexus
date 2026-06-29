import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import type { Lang } from '../context/LangContext'
import AIChat from '../components/AIChat'

function getUser() { try { return JSON.parse(localStorage.getItem('gn_current_user') || 'null') } catch { return null } }
function getBProfile(email: string) { try { return JSON.parse(localStorage.getItem(`gn_bprofile_${email}`) || '{}') } catch { return {} } }
function saveBProfile(email: string, d: object) { localStorage.setItem(`gn_bprofile_${email}`, JSON.stringify(d)) }
function getSaved(email: string): SavedSupplier[] { try { return JSON.parse(localStorage.getItem(`gn_saved_${email}`) || '[]') } catch { return [] } }
function setSaved(email: string, d: SavedSupplier[]) { localStorage.setItem(`gn_saved_${email}`, JSON.stringify(d)) }

interface SavedSupplier { id: string; name: string; category: string; country: string; note: string }

const C = { navy: '#1E3A5F', teal: '#0D9488', tealLight: '#CCFBF1', gold: '#D97706', green: '#16A34A', border: '#E2E8F0', bg: '#F8FAFC', white: '#FFFFFF', text: '#0F172A', muted: '#64748B', red: '#DC2626' }

const TUTORIAL_BUYER: Record<Lang, { msg: string; delay: number }[]> = {
  es: [
    { msg: '👋 ¡Bienvenido a Global Nexus! Soy tu asistente de orientación para compradores europeos.', delay: 0 },
    { msg: '🇪🇺 Como comprador europeo, tendrás acceso directo a productores mexicanos certificados con 0% de arancel gracias al TLCUEM.', delay: 1800 },
    { msg: '🔍 Completa tu **Perfil de Comprador**: industria, productos de interés y volúmenes requeridos. Así los productores podrán encontrarte.', delay: 3800 },
    { msg: '📋 En **Mis Búsquedas** puedes guardar proveedores y categorías de interés para cuando se active la plataforma.', delay: 6000 },
    { msg: '🚀 La conexión directa con productores se activa el **28 de agosto de 2026 a las 12:00 pm CDMX**. ¡Ya estás en la lista de prioridad!', delay: 8200 },
    { msg: '💬 A partir del lanzamiento tendrás chat directo con productores, RFQ (solicitud de cotización) y seguimiento de pedidos. Para preguntas: soporte@nexusstrategy.online', delay: 10500 },
  ],
  en: [
    { msg: '👋 Welcome to Global Nexus! I\'m your onboarding assistant for European buyers.', delay: 0 },
    { msg: '🇪🇺 As a European buyer, you\'ll have direct access to certified Mexican producers with 0% tariff thanks to the TLCUEM agreement.', delay: 1800 },
    { msg: '🔍 Complete your **Buyer Profile**: industry, products of interest and required volumes. This way producers can find you.', delay: 3800 },
    { msg: '📋 In **My Searches** you can save suppliers and categories of interest for when the platform activates.', delay: 6000 },
    { msg: '🚀 Direct connection with producers activates on **August 28, 2026 at 12:00 pm CDMX**. You\'re already on the priority list!', delay: 8200 },
    { msg: '💬 From launch you\'ll have direct chat with producers, RFQ and order tracking. Questions: soporte@nexusstrategy.online', delay: 10500 },
  ],
  nl: [
    { msg: '👋 Welkom bij Global Nexus! Ik ben uw onboarding-assistent voor Europese kopers.', delay: 0 },
    { msg: '🇪🇺 Als Europese koper heeft u directe toegang tot gecertificeerde Mexicaanse producenten met 0% tarief dankzij het TLCUEM-akkoord.', delay: 1800 },
    { msg: '🔍 Vul uw **Kopersprofiel** in: industrie, interesseproducten en vereiste volumes. Zo kunnen producenten u vinden.', delay: 3800 },
    { msg: '📋 In **Mijn Zoekopdrachten** kunt u leveranciers en categorieën opslaan voor wanneer het platform actief wordt.', delay: 6000 },
    { msg: '🚀 Directe verbinding met producenten wordt actief op **28 augustus 2026 om 12:00 uur CDMX**. U staat al op de prioriteitenlijst!', delay: 8200 },
    { msg: '💬 Vanaf de lancering heeft u directe chat met producenten, RFQ en orderopvolging. Vragen: soporte@nexusstrategy.online', delay: 10500 },
  ],
  de: [
    { msg: '👋 Willkommen bei Global Nexus! Ich bin Ihr Onboarding-Assistent für europäische Käufer.', delay: 0 },
    { msg: '🇪🇺 Als europäischer Käufer haben Sie dank des TLCUEM-Abkommens direkten Zugang zu zertifizierten mexikanischen Produzenten mit 0% Zoll.', delay: 1800 },
    { msg: '🔍 Vervollständigen Sie Ihr **Käuferprofil**: Branche, Interessenprodukte und benötigte Volumina. So können Produzenten Sie finden.', delay: 3800 },
    { msg: '📋 Unter **Meine Suchanfragen** können Sie Lieferanten und Interessenskategorien für die Aktivierung der Plattform speichern.', delay: 6000 },
    { msg: '🚀 Die direkte Verbindung mit Produzenten wird am **28. August 2026 um 12:00 Uhr CDMX** aktiv. Sie stehen bereits auf der Prioritätsliste!', delay: 8200 },
    { msg: '💬 Ab dem Launch haben Sie direkten Chat mit Produzenten, RFQ und Auftragsverfolgungt. Fragen: soporte@nexusstrategy.online', delay: 10500 },
  ],
}

const LABELS: Record<Lang, {
  tabs: string[]; preLaunch: string; preLaunchSub: string
  profileTitle: string; photoBtn: string; companyLabel: string; countryLabel: string
  industryLabel: string; interestLabel: string; volumeLabel: string; vatLabel: string
  saveBtn: string; saved: string; chatPlaceholder: string; chatSend: string
  logoutBtn: string; savedTitle: string; addSupplier: string; supplierName: string
  supplierCat: string; supplierCountry: string; supplierNote: string; addBtn: string
  deleteBtn: string; noSaved: string; profileProgress: string
  checklistItems: string[]; industries: string[]
}> = {
  es: {
    tabs: ['Resumen', 'Mi Perfil', 'Mis Búsquedas', 'Orientación'],
    preLaunch: '🚀 Modo Pre-Lanzamiento · 28 Ago 2026 · 12:00 pm CDMX',
    preLaunchSub: 'La conexión con productores mexicanos se activará en la fecha de lanzamiento. Mientras tanto, completa tu perfil y guarda tus búsquedas.',
    profileTitle: 'Perfil de Comprador Europeo',
    photoBtn: 'Foto de empresa',
    companyLabel: 'Nombre de empresa / importadora',
    countryLabel: 'País (EU)',
    industryLabel: 'Industria / Sector',
    interestLabel: 'Productos de interés (separados por coma)',
    volumeLabel: 'Volumen de compra anual estimado',
    vatLabel: 'VAT / Número fiscal EU',
    saveBtn: 'Guardar perfil',
    saved: '✓ Guardado',
    chatPlaceholder: 'Escribe una pregunta sobre la plataforma...',
    chatSend: 'Enviar',
    logoutBtn: 'Cerrar sesión',
    savedTitle: 'Proveedores y categorías guardadas',
    addSupplier: 'Guardar interés',
    supplierName: 'Nombre / categoría de interés',
    supplierCat: 'Categoría de producto',
    supplierCountry: 'País de origen preferido',
    supplierNote: 'Notas (volumen, certificaciones requeridas...)',
    addBtn: 'Guardar',
    deleteBtn: 'Eliminar',
    noSaved: 'Guarda aquí tus categorías de interés, proveedores potenciales o tipos de producto que buscas.',
    profileProgress: 'Perfil completado',
    checklistItems: ['Foto de empresa', 'País de operación', 'Industria / sector', 'Productos de interés', 'VAT / Número fiscal', 'Volumen de compra estimado'],
    industries: ['Alimentación y bebidas', 'Distribución / Importación', 'Retail / E-commerce', 'Farmacéutica / Cosmética', 'HoReCa (Hotel/Restaurante/Catering)', 'Otra'],
  },
  en: {
    tabs: ['Overview', 'My Profile', 'My Searches', 'Onboarding'],
    preLaunch: '🚀 Pre-Launch Mode · Aug 28, 2026 · 12:00 pm CDMX',
    preLaunchSub: 'Connection with Mexican producers activates on launch date. Meanwhile, complete your profile and save your searches.',
    profileTitle: 'European Buyer Profile',
    photoBtn: 'Company photo',
    companyLabel: 'Company / Importer name',
    countryLabel: 'Country (EU)',
    industryLabel: 'Industry / Sector',
    interestLabel: 'Products of interest (comma-separated)',
    volumeLabel: 'Estimated annual purchase volume',
    vatLabel: 'VAT / EU Tax number',
    saveBtn: 'Save profile',
    saved: '✓ Saved',
    chatPlaceholder: 'Ask a question about the platform...',
    chatSend: 'Send',
    logoutBtn: 'Sign out',
    savedTitle: 'Saved suppliers and categories',
    addSupplier: 'Save interest',
    supplierName: 'Interest name / category',
    supplierCat: 'Product category',
    supplierCountry: 'Preferred country of origin',
    supplierNote: 'Notes (volume, required certifications...)',
    addBtn: 'Save',
    deleteBtn: 'Delete',
    noSaved: 'Save your interest categories, potential suppliers or product types you\'re looking for here.',
    profileProgress: 'Profile completion',
    checklistItems: ['Company photo', 'Country of operation', 'Industry / Sector', 'Products of interest', 'VAT / Tax number', 'Estimated purchase volume'],
    industries: ['Food & Beverages', 'Distribution / Import', 'Retail / E-commerce', 'Pharmaceutical / Cosmetics', 'HoReCa (Hotel/Restaurant/Catering)', 'Other'],
  },
  nl: {
    tabs: ['Overzicht', 'Mijn Profiel', 'Mijn Zoekopdrachten', 'Onboarding'],
    preLaunch: '🚀 Pre-Lancering · 28 aug 2026 · 12:00 uur CDMX',
    preLaunchSub: 'Verbinding met Mexicaanse producenten wordt actief op de lanceringsdatum. Vul ondertussen uw profiel in en sla uw zoekopdrachten op.',
    profileTitle: 'Europees Kopersprofiel',
    photoBtn: 'Bedrijfsfoto',
    companyLabel: 'Bedrijf / Importeur naam',
    countryLabel: 'Land (EU)',
    industryLabel: 'Industrie / Sector',
    interestLabel: 'Interesseproducten (kommagescheiden)',
    volumeLabel: 'Geschat jaarlijks aankoopvolume',
    vatLabel: 'BTW / EU-fiscaal nummer',
    saveBtn: 'Profiel opslaan',
    saved: '✓ Opgeslagen',
    chatPlaceholder: 'Stel een vraag over het platform...',
    chatSend: 'Verzenden',
    logoutBtn: 'Uitloggen',
    savedTitle: 'Opgeslagen leveranciers en categorieën',
    addSupplier: 'Interesse opslaan',
    supplierName: 'Naam interesse / categorie',
    supplierCat: 'Productcategorie',
    supplierCountry: 'Gewenst land van herkomst',
    supplierNote: 'Notities (volume, vereiste certificeringen...)',
    addBtn: 'Opslaan',
    deleteBtn: 'Verwijderen',
    noSaved: 'Sla hier uw interessecategorieën, potentiële leveranciers of gezochte producttypen op.',
    profileProgress: 'Profielvoltooiing',
    checklistItems: ['Bedrijfsfoto', 'Land van activiteit', 'Industrie / Sector', 'Interesseproducten', 'BTW-nummer', 'Geschat aankoopvolume'],
    industries: ['Voeding & Dranken', 'Distributie / Import', 'Retail / E-commerce', 'Farmaceutisch / Cosmetica', 'HoReCa (Hotel/Restaurant/Catering)', 'Overig'],
  },
  de: {
    tabs: ['Übersicht', 'Mein Profil', 'Meine Suchen', 'Onboarding'],
    preLaunch: '🚀 Vor-Launch-Modus · 28. Aug 2026 · 12:00 Uhr CDMX',
    preLaunchSub: 'Die Verbindung mit mexikanischen Produzenten wird am Starttermin aktiviert. Vervollständigen Sie inzwischen Ihr Profil.',
    profileTitle: 'Europäisches Käuferprofil',
    photoBtn: 'Unternehmensfoto',
    companyLabel: 'Unternehmen / Importeur Name',
    countryLabel: 'Land (EU)',
    industryLabel: 'Branche / Sektor',
    interestLabel: 'Interessensprodukte (kommagetrennt)',
    volumeLabel: 'Geschätztes jährliches Einkaufsvolumen',
    vatLabel: 'USt-IdNr. / EU-Steuernummer',
    saveBtn: 'Profil speichern',
    saved: '✓ Gespeichert',
    chatPlaceholder: 'Fragen Sie nach der Plattform...',
    chatSend: 'Senden',
    logoutBtn: 'Abmelden',
    savedTitle: 'Gespeicherte Lieferanten und Kategorien',
    addSupplier: 'Interesse speichern',
    supplierName: 'Interessen-Name / Kategorie',
    supplierCat: 'Produktkategorie',
    supplierCountry: 'Bevorzugtes Herkunftsland',
    supplierNote: 'Notizen (Volumen, erforderliche Zertifizierungen...)',
    addBtn: 'Speichern',
    deleteBtn: 'Löschen',
    noSaved: 'Speichern Sie hier Ihre Interessenskategorien, potenzielle Lieferanten oder gesuchten Produkttypen.',
    profileProgress: 'Profilfortschritt',
    checklistItems: ['Unternehmensfoto', 'Betriebsland', 'Branche / Sektor', 'Interessensprodukte', 'USt-IdNr.', 'Geschätztes Einkaufsvolumen'],
    industries: ['Lebensmittel & Getränke', 'Distribution / Import', 'Einzelhandel / E-Commerce', 'Pharmazeutisch / Kosmetik', 'HoReCa (Hotel/Restaurant/Catering)', 'Sonstige'],
  },
}

const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
  width: '100%', padding: '10px 12px', border: `1.5px solid ${C.border}`,
  borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: C.white,
  boxSizing: 'border-box', color: C.text, outline: 'none', ...extra,
})

function BuyerChat({ lang }: { lang: Lang }) {
  const L = LABELS[lang]
  const msgs = TUTORIAL_BUYER[lang]
  const [shown, setShown] = useState<typeof msgs>([])
  const [input, setInput] = useState('')
  const [userMsgs, setUserMsgs] = useState<string[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    msgs.forEach(m => setTimeout(() => setShown(prev => [...prev, m]), m.delay))
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [shown, userMsgs])

  const send = () => {
    if (!input.trim()) return
    const msg = input.trim(); setInput('')
    setUserMsgs(s => [...s, msg])
    setTimeout(() => setShown(prev => [...prev, {
      msg: lang === 'es' ? '📩 Gracias por tu pregunta. Escribe a soporte@nexusstrategy.online para atención personalizada — respondemos en menos de 24 horas.'
         : lang === 'nl' ? '📩 Bedankt voor uw vraag. Schrijf naar soporte@nexusstrategy.online voor persoonlijke aandacht.'
         : lang === 'de' ? '📩 Danke für Ihre Frage. Schreiben Sie an soporte@nexusstrategy.online für persönliche Betreuung.'
         : '📩 Thanks for your question. Write to soporte@nexusstrategy.online for personalized support — we respond within 24 hours.',
      delay: 0,
    }]), 1000)
  }

  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 500 }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10, background: `linear-gradient(135deg, ${C.navy}08, ${C.teal}08)` }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🌐</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>Global Nexus · Support</div>
          <div style={{ fontSize: 11, color: C.green, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, display: 'inline-block' }} /> Online</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {shown.map((m, i) => (
          <div key={`b${i}`} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', maxWidth: '80%' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `${C.navy}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', flexShrink: 0 }}>🌐</div>
            <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '4px 12px 12px 12px', padding: '10px 14px', fontSize: 13, lineHeight: 1.7, color: C.text }}
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
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
          placeholder={L.chatPlaceholder} style={{ ...inp(), flex: 1, padding: '9px 12px' }} />
        <button onClick={send} style={{ padding: '9px 16px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${C.navy}, #1a4a7a)`, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>{L.chatSend}</button>
      </div>
    </div>
  )
}

/* ════════════════ MAIN ════════════════ */
export default function BuyerDashboardPage() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const L = LABELS[lang]
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
  const photoRef = useRef<HTMLInputElement>(null)

  if (!user) return null

  const pChecks = [!!profile.photo, !!profile.country, !!profile.industry, !!profile.interests, !!profile.vat, !!profile.volume]
  const pPct = Math.round((pChecks.filter(Boolean).length / pChecks.length) * 100)

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
    setSavedList(updated); setSaved(email, updated); setNewItem({}); setShowAdd(false)
  }

  const logout = () => { localStorage.removeItem('gn_current_user'); navigate('/login') }

  const EU_COUNTRIES = ['Alemania / Germany', 'Países Bajos / Netherlands', 'España / Spain', 'Francia / France', 'Italia / Italy', 'Bélgica / Belgium', 'Austria', 'Polonia / Poland', 'Suecia / Sweden', 'Otro / Other']

  return (
    <div style={{ minHeight: '100vh', background: C.bg }}>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, #1a2f4e, ${C.navy} 50%, #1a3d6b)`, color: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: '1rem' }}>
            <div onClick={() => setTab(1)} style={{ width: 58, height: 58, borderRadius: 14, background: 'rgba(255,255,255,.15)', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(255,255,255,.3)', cursor: 'pointer' }}>
              {profile.photo
                ? <img src={profile.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>🇪🇺</div>
              }
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, fontSize: 'clamp(.95rem,2.5vw,1.1rem)' }}>{user.name || user.company || 'Mi Panel'}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', marginTop: 2 }}>🇪🇺 {lang === 'es' ? 'Comprador Europeo' : lang === 'nl' ? 'Europese Koper' : lang === 'de' ? 'Europäischer Käufer' : 'European Buyer'} · {profile.country || user.country || 'Europa'}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.55)', textAlign: 'right' }}>{L.profileProgress}</div>
                <div style={{ fontWeight: 800, color: pPct >= 67 ? '#93C5FD' : '#FCD34D', fontSize: '1rem', textAlign: 'right' }}>{pPct}%</div>
                <div style={{ width: 70, height: 5, borderRadius: 3, background: 'rgba(255,255,255,.2)', marginTop: 2 }}>
                  <div style={{ width: `${pPct}%`, height: '100%', borderRadius: 3, background: pPct >= 67 ? '#93C5FD' : '#FCD34D', transition: 'width .5s' }} />
                </div>
              </div>
              <button onClick={logout} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>{L.logoutBtn}</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
            {L.tabs.map((t, i) => (
              <button key={i} onClick={() => setTab(i)} style={{ padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', color: tab === i ? '#93C5FD' : 'rgba(255,255,255,.6)', fontWeight: tab === i ? 700 : 400, fontSize: 13, borderBottom: `2px solid ${tab === i ? '#93C5FD' : 'transparent'}`, whiteSpace: 'nowrap', transition: 'all .15s' }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem 1.25rem' }}>

        {/* Pre-launch banner */}
        <div style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', border: '1.5px solid #93C5FD', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: '#1E40AF' }}>{L.preLaunch}</div>
            <div style={{ fontSize: 12, color: '#1E3A8A', lineHeight: 1.55, marginTop: 3 }}>{L.preLaunchSub}</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 100, background: '#DBEAFE', color: '#1E40AF', border: '1px solid #93C5FD', whiteSpace: 'nowrap' }}>
            ⏳ 28 Ago 2026
          </div>
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: '1rem' }}>
              {[
                { icon: '🏭', label: lang === 'es' ? 'Productores disponibles' : lang === 'nl' ? 'Beschikbare producenten' : lang === 'de' ? 'Verfügbare Produzenten' : 'Available producers', value: '0', note: lang === 'es' ? 'Al lanzamiento' : 'At launch' },
                { icon: '📋', label: lang === 'es' ? 'Búsquedas guardadas' : lang === 'nl' ? 'Opgeslagen zoekopdrachten' : lang === 'de' ? 'Gespeicherte Suchen' : 'Saved searches', value: saved.length, note: '' },
                { icon: '💬', label: lang === 'es' ? 'Conexiones activas' : lang === 'nl' ? 'Actieve verbindingen' : lang === 'de' ? 'Aktive Verbindungen' : 'Active connections', value: '0', note: '28 Ago 2026' },
                { icon: '📦', label: lang === 'es' ? 'Categorías TLCUEM' : lang === 'nl' ? 'TLCUEM categorieën' : lang === 'de' ? 'TLCUEM Kategorien' : 'TLCUEM categories', value: '0%', note: lang === 'es' ? 'Arancel · Tariff' : 'Tariff' },
              ].map((s, i) => (
                <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.25rem' }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 'clamp(1.3rem,3vw,1.8rem)', fontWeight: 900, color: C.navy }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{s.label}</div>
                  {s.note && <div style={{ fontSize: 10, color: C.gold, marginTop: 3 }}>{s.note}</div>}
                </div>
              ))}
            </div>

            {/* Checklist */}
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: '1rem' }}>📋 {L.profileProgress} · {pPct}%</div>
              <div style={{ width: '100%', height: 8, borderRadius: 4, background: C.bg, marginBottom: '1.25rem' }}>
                <div style={{ width: `${pPct}%`, height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${C.navy}, #1a4a7a)`, transition: 'width .6s' }} />
              </div>
              {L.checklistItems.map((item, i) => (
                <div key={i} onClick={() => !pChecks[i] && setTab(1)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < 5 ? `1px solid ${C.border}` : 'none', cursor: pChecks[i] ? 'default' : 'pointer' }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0, background: pChecks[i] ? '#DCFCE7' : C.bg, border: `1.5px solid ${pChecks[i] ? C.green : C.border}`, color: C.green }}>
                    {pChecks[i] ? '✓' : ''}
                  </div>
                  <span style={{ fontSize: 13, color: pChecks[i] ? C.muted : C.text, textDecoration: pChecks[i] ? 'line-through' : 'none', flex: 1 }}>{item}</span>
                  {!pChecks[i] && <span style={{ fontSize: 11, color: C.navy, fontWeight: 600 }}>Completar →</span>}
                </div>
              ))}
            </div>

            {/* TLCUEM info card */}
            <div style={{ background: `linear-gradient(135deg, ${C.navy}08, ${C.teal}06)`, border: `1px solid ${C.navy}20`, borderRadius: 14, padding: '1.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: '1rem' }}>🌐 Global Nexus × TLCUEM</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem' }}>
                {[
                  { icon: '🏷️', title: '0% Arancel', sub: lang === 'es' ? 'En miles de productos mexicanos hacia EU' : '0% tariff on thousands of Mexican products to EU' },
                  { icon: '⚡', title: lang === 'es' ? 'Conexión directa' : 'Direct connection', sub: lang === 'es' ? 'Sin intermediarios entre productor y comprador' : 'No intermediaries between producer and buyer' },
                  { icon: '🛡️', title: lang === 'es' ? 'Productores verificados' : 'Verified producers', sub: lang === 'es' ? 'RFC + datos legales validados por Global Nexus' : 'RFC + legal data validated by Global Nexus' },
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.3rem' }}>{f.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>{f.title}</div>
                      <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{f.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PROFILE ── */}
        {tab === 1 && (
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.75rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.5rem', color: C.navy }}>{L.profileTitle}</h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '1.5rem' }}>
              <div style={{ width: 84, height: 84, borderRadius: 18, background: C.bg, border: `2px dashed ${C.border}`, overflow: 'hidden', flexShrink: 0 }}>
                {profile.photo
                  ? <img src={profile.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🇪🇺</div>
                }
              </div>
              <div>
                <button onClick={() => photoRef.current?.click()} style={{ padding: '9px 18px', borderRadius: 8, border: `1.5px solid ${C.navy}`, background: 'transparent', color: C.navy, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{L.photoBtn}</button>
                <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
                <div style={{ fontSize: 11, color: C.muted, marginTop: 5 }}>Logo / Company photo</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6 }}>{L.countryLabel}</label>
                  <select value={profile.country || ''} onChange={e => setProfile((p: Record<string,string>) => ({ ...p, country: e.target.value }))} style={{ ...inp(), cursor: 'pointer' }}>
                    <option value="">—</option>
                    {EU_COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6 }}>{L.industryLabel}</label>
                  <select value={profile.industry || ''} onChange={e => setProfile((p: Record<string,string>) => ({ ...p, industry: e.target.value }))} style={{ ...inp(), cursor: 'pointer' }}>
                    <option value="">—</option>
                    {L.industries.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6 }}>{L.vatLabel}</label>
                  <input value={profile.vat || ''} onChange={e => setProfile((p: Record<string,string>) => ({ ...p, vat: e.target.value }))} placeholder="DE123456789" style={inp()} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6 }}>{L.volumeLabel}</label>
                  <input value={profile.volume || ''} onChange={e => setProfile((p: Record<string,string>) => ({ ...p, volume: e.target.value }))} placeholder="€50,000 / año" style={inp()} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6 }}>{L.interestLabel}</label>
                <input value={profile.interests || ''} onChange={e => setProfile((p: Record<string,string>) => ({ ...p, interests: e.target.value }))} placeholder="Tequila, café orgánico, miel, artesanías..." style={inp()} />
              </div>
              <button onClick={saveProfileData} style={{ padding: '11px 24px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg, ${C.navy}, #1a4a7a)`, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', alignSelf: 'flex-start' }}>
                {saveMsg ? L.saved : L.saveBtn}
              </button>
            </div>
          </div>
        )}

        {/* ── SAVED ── */}
        {tab === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1rem', color: C.navy }}>📋 {L.savedTitle} ({saved.length})</h2>
              <button onClick={() => setShowAdd(o => !o)} style={{ padding: '9px 18px', borderRadius: 9, border: 'none', background: showAdd ? C.border : C.navy, color: showAdd ? C.text : '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                {showAdd ? `✕ ${lang === 'es' ? 'Cancelar' : 'Cancel'}` : `+ ${L.addSupplier}`}
              </button>
            </div>

            {showAdd && (
              <div style={{ background: C.white, border: `1.5px solid ${C.navy}30`, borderRadius: 14, padding: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  {[
                    { key: 'name', label: L.supplierName, placeholder: 'Tequila Premium, Café orgánico...', required: true },
                    { key: 'category', label: L.supplierCat, placeholder: lang === 'es' ? 'Bebidas espirituosas' : 'Spirits & Beverages' },
                    { key: 'country', label: L.supplierCountry, placeholder: 'México' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 5 }}>{f.label}{f.required ? ' *' : ''}</label>
                      <input value={(newItem as Record<string,string>)[f.key] || ''} onChange={e => setNewItem(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inp()} />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 5 }}>{L.supplierNote}</label>
                  <textarea value={newItem.note || ''} onChange={e => setNewItem(p => ({ ...p, note: e.target.value }))} rows={2} style={{ ...inp(), resize: 'vertical' }} />
                </div>
                <button onClick={addItem} style={{ padding: '10px 22px', borderRadius: 9, border: 'none', background: `linear-gradient(135deg, ${C.navy}, #1a4a7a)`, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  + {L.addBtn}
                </button>
              </div>
            )}

            {saved.length === 0
              ? <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '3.5rem 2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>📋</div>
                  <div style={{ fontSize: 14, color: C.muted, maxWidth: 360, margin: '0 auto' }}>{L.noSaved}</div>
                </div>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {saved.map(s => (
                    <div key={s.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>📋</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: C.muted }}>{[s.category, s.country].filter(Boolean).join(' · ')}</div>
                        {s.note && <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{s.note}</div>}
                      </div>
                      <button onClick={() => { const u = saved.filter(x => x.id !== s.id); setSavedList(u); setSaved(email, u) }}
                        style={{ padding: '5px 12px', borderRadius: 7, border: `1px solid ${C.border}`, background: 'transparent', color: '#DC2626', fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>{L.deleteBtn}</button>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {/* ── AI CHAT ── */}
        {tab === 3 && <AIChat lang={lang} role="buyer" height={560} />}

      </div>
    </div>
  )
}

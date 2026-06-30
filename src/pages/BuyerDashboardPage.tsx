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

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '1rem' }}>
              {[
                { icon: '🏭', label: lang==='es'?'Proveedores guardados':lang==='nl'?'Opgeslagen leveranciers':lang==='de'?'Gespeicherte Lieferanten':'Saved suppliers', value: saved.length, color: C.navy, sub: lang==='es'?'en tu lista':'in your list' },
                { icon: '🇪🇺', label: lang==='es'?'Países EU':lang==='nl'?'EU-landen':lang==='de'?'EU-Länder':'EU Countries', value: 27, color: C.teal, sub: 'TLCUEM' },
                { icon: '🏷️', label: lang==='es'?'Arancel TLCUEM':lang==='nl'?'TLCUEM-tarief':lang==='de'?'TLCUEM-Zoll':'TLCUEM Tariff', value: '0%', color: C.green, sub: lang==='es'?'miles de productos':'thousands of products' },
                { icon: '🚀', label: lang==='es'?'Días para lanzamiento':lang==='nl'?'Dagen tot lancering':lang==='de'?'Tage bis Launch':'Days to launch', value: '60', color: C.gold, sub: '28 Ago 2026' },
              ].map((s,i) => (
                <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginTop: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Map + Checklist row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

              {/* SVG Trade Route Map */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,.04)', overflow: 'hidden' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>🌍 {lang==='es'?'Rutas de importación directa':lang==='nl'?'Directe importroutes':lang==='de'?'Direkte Importrouten':'Direct import routes'}</span>
                  <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 100, background: '#DBEAFE', color: '#1E40AF', fontWeight: 700 }}>TLCUEM · 0%</span>
                </div>
                <svg viewBox="0 0 420 220" style={{ width: '100%', height: 'auto' }} xmlns="http://www.w3.org/2000/svg">
                  <rect width="420" height="220" fill="#EFF6FF" rx="10"/>
                  <path d="M60 110 Q70 95 90 90 Q110 85 120 95 Q130 105 125 120 Q120 135 105 140 Q90 145 75 135 Q60 125 60 110Z" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1.5"/>
                  <path d="M105 140 Q112 155 118 165 Q115 170 110 168 Q105 165 102 155 Z" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1"/>
                  <text x="195" y="150" fontSize="8" fill="#93C5FD" textAnchor="middle" fontWeight="600">ATLÁNTICO</text>
                  <path d="M285 70 Q295 60 315 58 Q335 56 345 68 Q355 78 350 92 Q345 105 330 110 Q315 115 300 108 Q285 100 280 88 Q278 78 285 70Z" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1.5"/>
                  <path d="M280 88 Q285 100 295 105 Q295 112 288 114 Q280 115 276 108 Q272 100 275 92 Z" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1"/>
                  <path d="M315 58 Q320 50 330 48 Q340 50 343 58 Q340 66 330 68 Q320 68 315 62 Z" fill="#EDE9FE" stroke="#A78BFA" strokeWidth="1"/>
                  <path d="M108 115 C160 95 210 135 268 100" fill="none" stroke="#1E3A5F" strokeWidth="2" strokeDasharray="6,4" opacity="0.8">
                    <animate attributeName="stroke-dashoffset" values="100;0" dur="3s" repeatCount="indefinite"/>
                  </path>
                  <path d="M95 105 C130 60 200 55 268 75" fill="none" stroke="#0D9488" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.6">
                    <animate attributeName="stroke-dashoffset" values="100;0" dur="4s" repeatCount="indefinite"/>
                  </path>
                  <text x="185" y="108" fontSize="12" textAnchor="middle">🚢</text>
                  <text x="170" y="72" fontSize="10" textAnchor="middle">✈️</text>
                  <circle cx="108" cy="118" r="5" fill="#16A34A" opacity="0.9"/>
                  <text x="108" y="132" fontSize="7" fill="#16A34A" textAnchor="middle" fontWeight="700">Veracruz</text>
                  <circle cx="268" cy="100" r="4" fill="#1E3A5F" opacity="0.9"/>
                  <text x="268" y="112" fontSize="7" fill="#1E3A5F" textAnchor="middle" fontWeight="700">Valencia</text>
                  <circle cx="270" cy="75" r="4" fill="#7C3AED" opacity="0.9"/>
                  <text x="278" y="68" fontSize="7" fill="#7C3AED" textAnchor="middle" fontWeight="700">Rotterdam</text>
                  <circle cx="95" cy="108" r="3" fill="#0D9488" opacity="0.8"/>
                  <text x="82" y="118" fontSize="6" fill="#0D9488" fontWeight="600">Manzanillo</text>
                  <text x="90" y="82" fontSize="9" fill="#166534" fontWeight="700" textAnchor="middle">MÉXICO</text>
                  <text x="315" y="90" fontSize="9" fill="#1E3A5F" fontWeight="700" textAnchor="middle">EUROPA</text>
                  <rect x="285" y="175" width="120" height="38" rx="6" fill="white" opacity="0.9"/>
                  <line x1="291" y1="185" x2="305" y2="185" stroke="#1E3A5F" strokeWidth="2" strokeDasharray="4,3"/>
                  <text x="308" y="188" fontSize="7" fill="#1E3A5F" fontWeight="600">Vía marítima</text>
                  <line x1="291" y1="198" x2="305" y2="198" stroke="#0D9488" strokeWidth="1.5" strokeDasharray="3,3"/>
                  <text x="308" y="201" fontSize="7" fill="#0D9488" fontWeight="600">Vía aérea</text>
                  <rect x="8" y="170" width="140" height="44" rx="6" fill="#1E3A5F" opacity="0.9"/>
                  <text x="14" y="184" fontSize="7" fill="rgba(255,255,255,0.7)" fontWeight="500">ACCESO DIRECTO A</text>
                  <text x="14" y="200" fontSize="14" fill="#93C5FD" fontWeight="900">MX</text>
                  <text x="44" y="200" fontSize="7" fill="rgba(255,255,255,0.7)"> productores certificados</text>
                </svg>
              </div>

              {/* Profile checklist */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>📋 {L.profileProgress}</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: pPct >= 67 ? C.green : C.gold }}>{pPct}%</div>
                </div>
                <div style={{ width: '100%', height: 6, borderRadius: 3, background: '#F1F5F9', marginBottom: '1rem' }}>
                  <div style={{ width: `${pPct}%`, height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${C.navy}, #1a4a7a)`, transition: 'width .6s' }} />
                </div>
                {L.checklistItems.map((item, i) => (
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
                  {lang==='es'?'Completar mi perfil →':lang==='nl'?'Profiel voltooien →':lang==='de'?'Profil vervollständigen →':'Complete my profile →'}
                </button>
              </div>
            </div>

            {/* Saved suppliers preview + deal flow */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {/* Saved suppliers preview */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>🏭 {lang==='es'?'Proveedores guardados':lang==='nl'?'Opgeslagen leveranciers':lang==='de'?'Gespeicherte Lieferanten':'Saved suppliers'}</div>
                  <button onClick={() => setTab(2)} style={{ fontSize: 11, color: C.navy, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>{lang==='es'?'Ver todos →':'View all →'}</button>
                </div>
                {saved.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: C.muted }}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>🏭</div>
                    <div style={{ fontSize: 12, marginBottom: 12 }}>{L.noSaved}</div>
                    <button onClick={() => setTab(2)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: C.navy, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                      {lang==='es'?'+ Guardar interés':'+ Save interest'}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {saved.slice(0,3).map((s,i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px', borderRadius: 8, background: '#F8FAFC', border: `1px solid ${C.border}` }}>
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: '#EFF6FF', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🏭</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: C.muted }}>{[s.category, s.country].filter(Boolean).join(' · ')}</div>
                        </div>
                        <div style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, background: '#DBEAFE', color: C.navy, fontWeight: 700, whiteSpace: 'nowrap' }}>TLCUEM ✓</div>
                      </div>
                    ))}
                    {saved.length > 3 && <div style={{ fontSize: 11, color: C.muted, textAlign: 'center', paddingTop: 4 }}>+{saved.length-3} {lang==='es'?'más':'more'}</div>}
                  </div>
                )}
              </div>

              {/* Deal flow from buyer perspective */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: '1rem' }}>🤝 {lang==='es'?'Cómo funciona':lang==='nl'?'Hoe het werkt':lang==='de'?'So funktioniert es':'How it works'}</div>
                {[
                  { icon: '🔍', label: lang==='es'?'Busca en el catálogo de productores MX certificados':'Browse the catalog of certified MX producers' },
                  { icon: '📩', label: lang==='es'?'Envía solicitud de contacto directo':'Send a direct contact request' },
                  { icon: '💬', label: lang==='es'?'Chat privado y negociación de condiciones':'Private chat & negotiate terms' },
                  { icon: '📋', label: lang==='es'?'Solicita cotización (RFQ) personalizada':'Request a personalized quote (RFQ)' },
                  { icon: '✅', label: lang==='es'?'Importa con 0% arancel vía TLCUEM':'Import with 0% tariff via TLCUEM' },
                ].map((s,i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i<4 ? 10 : 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#EFF6FF', border: `2px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>{s.icon}</div>
                      {i < 4 && <div style={{ width: 1, height: 12, background: C.border, marginTop: 2 }} />}
                    </div>
                    <div style={{ paddingTop: 4 }}>
                      <div style={{ fontSize: 11, color: C.text, lineHeight: 1.4 }}>{s.label}</div>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: '1rem', padding: '8px 12px', borderRadius: 8, background: '#EFF6FF', border: '1px solid #93C5FD' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#1E40AF' }}>🚀 {lang==='es'?'Activo el 28 Ago 2026':'Active Aug 28, 2026'}</div>
                </div>
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

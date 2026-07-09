import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import type { Lang } from '../context/LangContext'

/* ─── Storage helpers ─── */
function getUser() {
  try { return JSON.parse(localStorage.getItem('gn_current_user') || 'null') } catch { return null }
}
function getProfile(email: string) {
  try { return JSON.parse(localStorage.getItem(`gn_profile_${email}`) || '{}') } catch { return {} }
}
function saveProfile(email: string, data: object) {
  localStorage.setItem(`gn_profile_${email}`, JSON.stringify(data))
}
function getProducts(email: string): Product[] {
  try {
    const raw = JSON.parse(localStorage.getItem(`gn_products_${email}`) || '[]')
    return raw.map((p: Product & { photo?: string }) => {
      if (!p.photos) return { ...p, photos: p.photo ? [p.photo] : [] }
      return p
    })
  } catch { return [] }
}
function saveProducts(email: string, data: Product[]) {
  localStorage.setItem(`gn_products_${email}`, JSON.stringify(data))
}
function getAwards(email: string): Award[] {
  try { return JSON.parse(localStorage.getItem(`gn_awards_${email}`) || '[]') } catch { return [] }
}
function saveAwards(email: string, data: Award[]) {
  localStorage.setItem(`gn_awards_${email}`, JSON.stringify(data))
}
function getStory(email: string) {
  try { return JSON.parse(localStorage.getItem(`gn_story_${email}`) || '{}') } catch { return {} }
}
function saveStory(email: string, data: object) {
  localStorage.setItem(`gn_story_${email}`, JSON.stringify(data))
}

interface CertDoc {
  id: string; name: string; issuer: string; year: string; fileData?: string; fileName?: string; fileType?: string
}
interface Award {
  id: string; name: string; year: string; org: string; desc: string; photo?: string
}
interface Product {
  id: string; name: string; category: string; price: string; unit: string
  minOrder: string; desc: string; photos: string[]; origin?: string; certTags?: string[]; certDocs?: CertDoc[]
}

const C = { navy: '#1E3A5F', teal: '#0D9488', tealLight: '#CCFBF1', gold: '#D97706', green: '#16A34A', border: '#E2E8F0', bg: '#F8FAFC', white: '#FFFFFF', text: '#0F172A', muted: '#64748B', red: '#DC2626' }

/* ─── Units per category ─── */
const UNITS_BY_CAT: Record<string, string[]> = {
  'Bebidas espirituosas':       ['Botella 750ml','Botella 1L','Caja 6 botellas','Caja 12 botellas','Barril','Litro'],
  'Agricultura y alimentos':    ['kg','Tonelada métrica','Caja','Bulto','Saco 25kg','Saco 50kg','Gramo','Paquete'],
  'Artesanías y textiles':      ['Pieza','Docena','Metro','Rollo','Juego / Set','Caja'],
  'Cosméticos naturales':       ['Unidad','Frasco 50ml','Frasco 100ml','Caja 12 unidades','Litro','kg'],
  'Farmacéutico / Herbolaria':  ['Pieza','Frasco','Caja 12 unidades','Gramo','kg','Sobre'],
  'Spirits & Beverages':        ['Bottle 750ml','Bottle 1L','Box 6 bottles','Box 12 bottles','Barrel','Liter'],
  'Agriculture & Food':         ['kg','Metric ton','Box','Bundle','25kg Bag','50kg Bag','Gram','Package'],
  'Crafts & Textiles':          ['Piece','Dozen','Meter','Roll','Set','Box'],
  'Natural Cosmetics':          ['Unit','Bottle 50ml','Bottle 100ml','Box 12 units','Liter','kg'],
  'Pharmaceutical':             ['Piece','Bottle','Box 12 units','Gram','kg','Sachet'],
  'Dranken & Spiritualiën':     ['Fles 750ml','Fles 1L','Doos 6 flessen','Doos 12 flessen','Vat','Liter'],
  'Landbouw & Voeding':         ['kg','Ton','Doos','Bundel','Zak 25kg','Zak 50kg','Gram','Pakket'],
  'Ambachten & Textiel':        ['Stuk','Dozijn','Meter','Rol','Set','Doos'],
  'Natuurlijke Cosmetica':      ['Stuk','Fles 50ml','Fles 100ml','Doos 12 stuks','Liter','kg'],
  'Farmaceutisch':              ['Stuk','Fles','Doos 12 stuks','Gram','kg','Sachet'],
  'Spirituosen & Getränke':     ['Flasche 750ml','Flasche 1L','Karton 6 Flaschen','Karton 12 Flaschen','Fass','Liter'],
  'Landwirtschaft & Lebensmittel': ['kg','Tonne','Karton','Bündel','Sack 25kg','Sack 50kg','Gramm','Paket'],
  'Kunsthandwerk & Textilien':  ['Stück','Dutzend','Meter','Rolle','Set','Karton'],
  'Naturkosmetik':              ['Stück','Flasche 50ml','Flasche 100ml','Karton 12 Stück','Liter','kg'],
  'Pharmazeutisch':             ['Stück','Flasche','Karton 12 Stück','Gramm','kg','Beutel'],
  'Otro': ['Pieza','Caja','kg','Tonelada','Litro','Metro','Unidad'],
  'Overig': ['Stuk','Doos','kg','Ton','Liter','Meter','Eenheid'],
  'Sonstige': ['Stück','Karton','kg','Tonne','Liter','Meter','Einheit'],
  'Other': ['Piece','Box','kg','Ton','Liter','Meter','Unit'],
}
function getUnits(category: string): string[] {
  return UNITS_BY_CAT[category] || ['Pieza','Caja','kg','Tonelada','Litro','Unidad','Otro']
}

/* ─── Demo data ─── */
const DEMO_CONTACTS = [
  { name: 'Mueller Import GmbH', flag: '🇩🇪', city: 'Frankfurt', time: '22:14', status: 'Nuevo', statusColor: '#16A34A', statusBg: '#DCFCE7' },
  { name: 'Dutch Premium Spirits', flag: '🇳🇱', city: 'Amsterdam', time: '09:14', status: 'Chat', statusColor: '#0D9488', statusBg: '#CCFBF1' },
  { name: 'Maison Premium SARL', flag: '🇫🇷', city: 'París', time: 'Ayer', status: 'Orden', statusColor: '#7C3AED', statusBg: '#EDE9FE' },
]
const DEMO_ORDERS = [
  { id: 'ORD-2026-0041', desc: '200 cajas Tequila Añejo · Mueller Import GmbH', amount: '$9,700 USD', route: 'Veracruz → Rotterdam', status: 'En tránsito 🚢', statusColor: '#0D9488', statusBg: '#CCFBF1' },
  { id: 'ORD-2026-0039', desc: '500 kg Café Chiapas · Maison Premium SARL', amount: '$6,400 USD', route: 'Pendiente confirmación', status: 'Cotización', statusColor: '#D97706', statusBg: '#FEF3C7' },
]

const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
  width: '100%', padding: '10px 12px', border: `1.5px solid ${C.border}`,
  borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: C.white,
  boxSizing: 'border-box', color: C.text, outline: 'none', ...extra,
})

/* ─── Sidebar nav ─── */
type NavItem = { icon: string; label: string; id: number; badge?: number }
function getSidebarNav(lang: Lang, msgCount: number): NavItem[] {
  const es = lang === 'es'
  const nl = lang === 'nl'
  const de = lang === 'de'
  return [
    { icon: '📊', label: es ? 'Dashboard' : nl ? 'Dashboard' : de ? 'Dashboard' : 'Dashboard', id: 0 },
    { icon: '🏭', label: es ? 'Mi perfil' : nl ? 'Mijn profiel' : de ? 'Mein Profil' : 'My profile', id: 1 },
    { icon: '📦', label: es ? 'Mi catálogo' : nl ? 'Mijn catalogus' : de ? 'Mein Katalog' : 'My catalog', id: 2 },
    { icon: '📖', label: es ? 'Historia & Fotos' : nl ? "Verhaal & Foto's" : de ? 'Geschichte & Fotos' : 'Story & Photos', id: 3 },
    { icon: '🏆', label: es ? 'Premios' : nl ? 'Prijzen' : de ? 'Auszeichnungen' : 'Awards', id: 7 },
    { icon: '💬', label: es ? 'Mensajes' : nl ? 'Berichten' : de ? 'Nachrichten' : 'Messages', id: 4, badge: msgCount },
    { icon: '📋', label: es ? 'Solicitudes' : nl ? 'Verzoeken' : de ? 'Anfragen' : 'Requests', id: 5, badge: 5 },
    { icon: '📜', label: es ? 'Órdenes' : nl ? 'Bestellingen' : de ? 'Bestellungen' : 'Orders', id: 6 },
    { icon: '⚙️', label: es ? 'Ajustes' : nl ? 'Instellingen' : de ? 'Einstellungen' : 'Settings', id: 8 },
  ]
}

/* ─── Tutorial chat (messages tab) ─── */
const TUTORIAL: Record<Lang, { msg: string; delay: number }[]> = {
  es: [
    { msg: '👋 ¡Bienvenido a Global Nexus! Soy tu asistente de orientación. Te guiaré en tus primeros pasos.', delay: 0 },
    { msg: '🏭 Primero, completa tu **Perfil**. Una foto, descripción de tu empresa y datos de contacto aumentan 3x tus conexiones con compradores europeos.', delay: 1800 },
    { msg: '📦 Luego sube tus **Productos** en la pestaña correspondiente. Añade foto, precio base, unidad de venta y cantidad mínima de pedido (MOQ).', delay: 3800 },
    { msg: '🛡️ Si tienes certificaciones (NOM, SENASICA, Orgánico, COFEPRIS...), agrégalas en **Certificaciones**. Aumentan mucho tu visibilidad con compradores exigentes.', delay: 6200 },
    { msg: '🚀 Tu perfil y productos serán **visibles públicamente el 28 de agosto de 2026**. ¡Mientras tanto, construye todo con calma!', delay: 8500 },
    { msg: '💬 A partir del lanzamiento, los compradores europeos podrán enviarte mensajes aquí. Para soporte directo escribe a soporte@nexusstrategy.online', delay: 11000 },
  ],
  en: [
    { msg: '👋 Welcome to Global Nexus! I\'m your onboarding assistant. I\'ll guide you through your first steps.', delay: 0 },
    { msg: '🏭 First, complete your **Profile**. A photo, company description and contact details increase your connections with European buyers by 3x.', delay: 1800 },
    { msg: '📦 Then upload your **Products**. Add a photo, base price, sales unit and minimum order quantity (MOQ).', delay: 3800 },
    { msg: '🛡️ If you have certifications (NOM, SENASICA, Organic, COFEPRIS...), add them in **Certifications**. They greatly increase your visibility.', delay: 6200 },
    { msg: '🚀 Your profile and products will be **publicly visible on August 28, 2026**.', delay: 8500 },
    { msg: '💬 From launch, European buyers can message you directly here. Support: soporte@nexusstrategy.online', delay: 11000 },
  ],
  nl: [
    { msg: '👋 Welkom bij Global Nexus! Ik begeleid u door de eerste stappen.', delay: 0 },
    { msg: '🏭 Vul eerst uw **Profiel** in. Een foto en bedrijfsbeschrijving verhogen uw verbindingen met 3x.', delay: 1800 },
    { msg: '📦 Upload daarna uw **Producten** met foto, basisprijs en MOQ.', delay: 3800 },
    { msg: '🛡️ Voeg **Certificeringen** toe om uw zichtbaarheid te vergroten.', delay: 6200 },
    { msg: '🚀 Uw profiel wordt **publiek op 28 augustus 2026**.', delay: 8500 },
    { msg: '💬 Ondersteuning: soporte@nexusstrategy.online', delay: 11000 },
  ],
  de: [
    { msg: '👋 Willkommen bei Global Nexus! Ich begleite Sie durch Ihre ersten Schritte.', delay: 0 },
    { msg: '🏭 Vervollständigen Sie zuerst Ihr **Profil**.', delay: 1800 },
    { msg: '📦 Laden Sie dann Ihre **Produkte** hoch.', delay: 3800 },
    { msg: '🛡️ Fügen Sie **Zertifizierungen** hinzu.', delay: 6200 },
    { msg: '🚀 Ihr Profil wird am **28. August 2026** öffentlich.', delay: 8500 },
    { msg: '💬 Support: soporte@nexusstrategy.online', delay: 11000 },
  ],
}

function TutorialChat({ lang }: { lang: Lang }) {
  const msgs = TUTORIAL[lang]
  const [shown, setShown] = useState<typeof msgs>([])
  const [input, setInput] = useState('')
  const [userMsgs, setUserMsgs] = useState<string[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const chatLabel = lang === 'es' ? 'Escribe una pregunta...' : lang === 'nl' ? 'Stel een vraag...' : lang === 'de' ? 'Frage stellen...' : 'Ask a question...'

  useEffect(() => {
    msgs.forEach(m => setTimeout(() => setShown(prev => [...prev, m]), m.delay))
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [shown, userMsgs])

  const send = () => {
    if (!input.trim()) return
    const msg = input.trim(); setInput('')
    setUserMsgs(s => [...s, msg])
    setTimeout(() => setShown(prev => [...prev, {
      msg: lang === 'es' ? '📩 Gracias por tu pregunta. Para soporte directo escribe a soporte@nexusstrategy.online — respondemos en menos de 24 horas.'
         : '📩 Thanks for your question. Write to soporte@nexusstrategy.online for direct support.',
      delay: 0,
    }]), 1000)
  }

  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 480 }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10, background: `linear-gradient(135deg, ${C.navy}08, ${C.teal}08)` }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🌐</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>Global Nexus · Soporte</div>
          <div style={{ fontSize: 11, color: C.green, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, display: 'inline-block' }} /> En línea</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {shown.map((m, i) => (
          <div key={`b${i}`} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', maxWidth: '80%' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `${C.teal}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', flexShrink: 0 }}>🌐</div>
            <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '4px 12px 12px 12px', padding: '10px 14px', fontSize: 13, lineHeight: 1.7, color: C.text }}
              dangerouslySetInnerHTML={{ __html: m.msg.replace(/\*\*(.*?)\*\*/g, `<strong style="color:${C.teal}">$1</strong>`) }} />
          </div>
        ))}
        {userMsgs.map((s, i) => (
          <div key={`u${i}`} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, borderRadius: '12px 4px 12px 12px', padding: '10px 14px', fontSize: 13, color: '#fff', maxWidth: '70%' }}>{s}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: '.75rem 1rem', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
          placeholder={chatLabel} style={{ ...inp(), flex: 1, padding: '9px 12px' }} />
        <button onClick={send} style={{ padding: '9px 16px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>
          {lang === 'es' ? 'Enviar' : lang === 'nl' ? 'Verzenden' : lang === 'de' ? 'Senden' : 'Send'}
        </button>
      </div>
    </div>
  )
}

/* ════════════════ MAIN ════════════════ */
export default function DashboardPage() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const user = getUser()

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.role === 'comprador') navigate('/dashboard-comprador')
  }, [])

  const email = user?.email || ''
  const [profile, setProfile] = useState(() => getProfile(email))
  const [products, setProducts] = useState<Product[]>(() => getProducts(email))
  const [tab, setTab] = useState(0)
  const [saveMsg, setSaveMsg] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [demoMode, setDemoMode] = useState(false)
  const photoRef = useRef<HTMLInputElement>(null)
  const productPhotosRef = useRef<HTMLInputElement>(null)
  const editPhotosRef = useRef<HTMLInputElement>(null)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ photos: [] })
  const certFileRef = useRef<HTMLInputElement>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [editProduct, setEditProduct] = useState<Partial<Product>>({})
  const [activePhotoIdx, setActivePhotoIdx] = useState<Record<string, number>>({})
  // New state
  const [awards, setAwards] = useState<Award[]>(() => getAwards(email))
  const [story, setStory] = useState(() => getStory(email))
  const [newAward, setNewAward] = useState<Partial<Award>>({})
  const [showAddAward, setShowAddAward] = useState(false)
  const [expandedCertId, setExpandedCertId] = useState<string | null>(null)
  const [newCertDoc, setNewCertDoc] = useState<Partial<CertDoc>>({})
  const certDocFileRef = useRef<HTMLInputElement>(null)
  const awardPhotoRef = useRef<HTMLInputElement>(null)
  const storyPhotosRef = useRef<HTMLInputElement>(null)
  const [storySaved, setStorySaved] = useState(false)
  const [deleteAccountStep, setDeleteAccountStep] = useState(0)
  const [deleteAccountConfirm, setDeleteAccountConfirm] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(user?.name || user?.company || '')

  if (!user) return null

  const pChecks = [!!profile.photo, !!profile.bio, !!profile.location, !!profile.whatsapp, products.length > 0, !!(story as Record<string,string>).history, !!profile.website]
  const pPct = Math.round((pChecks.filter(Boolean).length / pChecks.length) * 100)
  const navItems = getSidebarNav(lang as Lang, 3)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { const u = { ...profile, photo: ev.target?.result as string }; setProfile(u); saveProfile(email, u) }
    reader.readAsDataURL(file)
  }

  const handleProductPhotos = (e: React.ChangeEvent<HTMLInputElement>, mode: 'new' | 'edit') => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => {
        const url = ev.target?.result as string
        if (mode === 'new') setNewProduct(p => ({ ...p, photos: [...(p.photos || []), url].slice(0, 5) }))
        else setEditProduct(p => ({ ...p, photos: [...(p.photos || []), url].slice(0, 5) }))
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const saveProfileData = () => { saveProfile(email, profile); setSaveMsg(true); setTimeout(() => setSaveMsg(false), 2500) }

  const addProduct = () => {
    if (!newProduct.name || !newProduct.category) return
    const updated = [...products, { ...newProduct, photos: newProduct.photos || [], id: Date.now().toString() } as Product]
    setProducts(updated); saveProducts(email, updated); setNewProduct({ photos: [] }); setShowAddProduct(false)
  }

  const saveEditProductFn = () => {
    if (!editProduct.name || !editProduct.category) return
    const updated = products.map(p => p.id === editingProductId ? { ...p, ...editProduct } as Product : p)
    setProducts(updated); saveProducts(email, updated); setEditingProductId(null); setEditProduct({})
  }

  const deleteProductFn = (id: string) => {
    const updated = products.filter(p => p.id !== id)
    setProducts(updated); saveProducts(email, updated); setDeleteConfirmId(null)
  }

  const addCertDocToProduct = (productId: string) => {
    if (!newCertDoc.name) return
    const cd: CertDoc = { ...newCertDoc as CertDoc, id: Date.now().toString() }
    const updated = products.map(p => p.id === productId ? { ...p, certDocs: [...(p.certDocs || []), cd] } : p)
    setProducts(updated); saveProducts(email, updated)
    setNewCertDoc({}); if (certDocFileRef.current) certDocFileRef.current.value = ''
  }
  const deleteCertDocFromProduct = (productId: string, certId: string) => {
    const updated = products.map(p => p.id === productId ? { ...p, certDocs: (p.certDocs || []).filter(c => c.id !== certId) } : p)
    setProducts(updated); saveProducts(email, updated)
  }
  const saveStoryData = () => {
    saveStory(email, story); setStorySaved(true); setTimeout(() => setStorySaved(false), 2500)
  }
  const addAward = () => {
    if (!newAward.name) return
    const updated = [...awards, { ...newAward, id: Date.now().toString() } as Award]
    setAwards(updated); saveAwards(email, updated); setNewAward({}); setShowAddAward(false)
    if (awardPhotoRef.current) awardPhotoRef.current.value = ''
  }
  const handleStoryPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setStory((s: typeof story) => ({ ...s, photos: [...(s.photos || []), ev.target?.result as string].slice(0, 20) }))
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }
  const handleAwardPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setNewAward(a => ({ ...a, photo: ev.target?.result as string }))
    reader.readAsDataURL(file)
  }
  const deleteAccount = () => {
    const keys = Object.keys(localStorage).filter(k => k.includes(email) || k === 'gn_current_user' || k === 'gn_session_expires')
    keys.forEach(k => localStorage.removeItem(k))
    navigate('/registro')
  }
  const logout = () => { localStorage.removeItem('gn_current_user'); localStorage.removeItem('gn_session_expires'); navigate('/login') }

  const es = lang === 'es'; const nl = lang === 'nl'; const de = lang === 'de'
  const t = (a: string, b: string, c: string, d: string) => es ? a : nl ? b : de ? c : d

  /* ── LABELS ── */
  const L = {
    profileTitle: t('Perfil público de mi empresa', 'Openbaar bedrijfsprofiel', 'Öffentliches Unternehmensprofil', 'My company public profile'),
    photoBtn: t('Cambiar foto', 'Foto wijzigen', 'Foto ändern', 'Change photo'),
    bioLabel: t('Descripción de tu empresa', 'Bedrijfsbeschrijving', 'Unternehmensbeschreibung', 'Company description'),
    bioPlaceholder: t('Cuéntanos sobre tu empresa...', 'Vertel ons over uw bedrijf...', 'Erzählen Sie uns von Ihrem Unternehmen...', 'Tell us about your company...'),
    websiteLabel: t('Sitio web', 'Website', 'Website', 'Website'),
    whatsappLabel: t('WhatsApp de contacto', 'Contact WhatsApp', 'Kontakt WhatsApp', 'Contact WhatsApp'),
    locationLabel: t('Estado / Ciudad, México', 'Staat / Stad, Mexico', 'Bundesstaat / Stadt, Mexiko', 'State / City, Mexico'),
    saveBtn: t('Guardar cambios', 'Wijzigingen opslaan', 'Änderungen speichern', 'Save changes'),
    saved: t('✓ Guardado', '✓ Opgeslagen', '✓ Gespeichert', '✓ Saved'),
    addProduct: t('Agregar producto', 'Product toevoegen', 'Produkt hinzufügen', 'Add product'),
    productName: t('Nombre del producto', 'Productnaam', 'Produktname', 'Product name'),
    productCat: t('Categoría', 'Categorie', 'Kategorie', 'Category'),
    productPrice: t('Precio base (USD)', 'Basisprijs (USD)', 'Basispreis (USD)', 'Base price (USD)'),
    productUnit: t('Unidad de venta', 'Verkoopeenheid', 'Verkaufseinheit', 'Sales unit'),
    productMOQ: t('Pedido mínimo (MOQ)', 'Minimale bestelling', 'Mindestbestellung', 'Minimum order (MOQ)'),
    productDesc: t('Descripción breve', 'Korte beschrijving', 'Kurze Beschreibung', 'Brief description'),
    productOrigin: t('Origen / Estado', 'Herkomst / Staat', 'Herkunft / Bundesstaat', 'Origin / State'),
    productPhoto: t('+ Foto del producto', '+ Productfoto', '+ Produktfoto', '+ Product photo'),
    certTagsLabel: t('Certificaciones del producto', 'Productcertificeringen', 'Produktzertifizierungen', 'Product certifications'),
    editBtn: t('Editar', 'Bewerken', 'Bearbeiten', 'Edit'),
    saveEditBtn: t('Guardar cambios', 'Wijzigingen opslaan', 'Änderungen speichern', 'Save changes'),
    deleteConfirm: t('¿Eliminar este producto?', 'Dit product verwijderen?', 'Dieses Produkt löschen?', 'Delete this product?'),
    confirmYes: t('Sí, eliminar', 'Ja, verwijderen', 'Ja, löschen', 'Yes, delete'),
    confirmNo: t('Cancelar', 'Annuleren', 'Abbrechen', 'Cancel'),
    addBtn: t('Agregar producto', 'Product toevoegen', 'Produkt hinzufügen', 'Add product'),
    deleteBtn: t('Eliminar', 'Verwijderen', 'Löschen', 'Delete'),
    certTitle: t('Nombre de la certificación', 'Naam certificering', 'Name der Zertifizierung', 'Certification name'),
    certIssuer: t('Organismo emisor', 'Uitgevende instantie', 'Ausstellende Stelle', 'Issuing body'),
    certYear: t('Año de emisión', 'Uitgiftejaar', 'Ausgabejahr', 'Year issued'),
    addCertBtn: t('Agregar certificación', 'Certificering toevoegen', 'Zertifizierung hinzufügen', 'Add certification'),
    logoutBtn: t('Cerrar sesión', 'Uitloggen', 'Abmelden', 'Sign out'),
    noProducts: t('Aún no tienes productos. ¡Agrega el primero!', 'Nog geen producten.', 'Noch keine Produkte.', 'No products yet. Add your first!'),
    noCerts: t('Agrega tus certificaciones para aumentar la confianza de los compradores europeos.', 'Voeg certificeringen toe.', 'Fügen Sie Zertifizierungen hinzu.', 'Add your certifications to build trust.'),
    profileProgress: t('Perfil completo', 'Profiel voltooid', 'Profil vollständig', 'Profile complete'),
    categories: es
      ? ['Bebidas espirituosas', 'Agricultura y alimentos', 'Artesanías y textiles', 'Cosméticos naturales', 'Farmacéutico / Herbolaria', 'Otro']
      : nl
      ? ['Dranken & Spiritualiën', 'Landbouw & Voeding', 'Ambachten & Textiel', 'Natuurlijke Cosmetica', 'Farmaceutisch', 'Overig']
      : de
      ? ['Spirituosen & Getränke', 'Landwirtschaft & Lebensmittel', 'Kunsthandwerk & Textilien', 'Naturkosmetik', 'Pharmazeutisch', 'Sonstige']
      : ['Spirits & Beverages', 'Agriculture & Food', 'Crafts & Textiles', 'Natural Cosmetics', 'Pharmaceutical', 'Other'],
    checklistItems: es
      ? ['Foto de perfil', 'Descripción de empresa', 'Ubicación', 'WhatsApp', 'Al menos 1 producto', 'Historia & Fotos', 'Sitio web (opcional)']
      : ['Profile photo', 'Company description', 'Location', 'WhatsApp', 'At least 1 product', 'Story & Photos', 'Website (optional)'],
    storyVision: t('Visión de la empresa', 'Bedrijfsvisie', 'Unternehmensvisio', 'Company vision'),
    storyTradition: t('Tradición & Valores', 'Traditie & Waarden', 'Tradition & Werte', 'Tradition & Values'),
    storyHistory: t('Historia de la empresa', 'Bedrijfsgeschiedenis', 'Unternehmensgeschichte', 'Company history'),
    storyPhotos: t('Galería de imágenes', 'Fotogalerij', 'Bildergalerie', 'Photo gallery'),
    storySave: t('Guardar historia', 'Verhaal opslaan', 'Geschichte speichern', 'Save story'),
    awardName: t('Nombre del premio', 'Naam prijs', 'Name der Auszeichnung', 'Award name'),
    awardYear: t('Año', 'Jaar', 'Jahr', 'Year'),
    awardOrg: t('Organismo / Institución', 'Organisatie', 'Organisation', 'Organization'),
    awardDesc: t('Descripción breve', 'Korte beschrijving', 'Kurze Beschreibung', 'Brief description'),
    addAward: t('Agregar premio', 'Prijs toevoegen', 'Auszeichnung hinzufügen', 'Add award'),
    noAwards: t('Aún no tienes premios registrados. ¡Agrega tu primer reconocimiento!', 'Nog geen prijzen.', 'Noch keine Auszeichnungen.', 'No awards yet. Add your first recognition!'),
    deleteAccount: t('Eliminar cuenta', 'Account verwijderen', 'Konto löschen', 'Delete account'),
    deleteWarning: t('Esta acción eliminará permanentemente tu cuenta y todos tus datos. No se puede deshacer.', 'Deze actie verwijdert uw account permanent.', 'Diese Aktion löscht Ihr Konto dauerhaft.', 'This will permanently delete your account and all data. Cannot be undone.'),
    deleteConfirmLabel: t('Escribe tu email para confirmar:', 'Voer uw e-mail in ter bevestiging:', 'Geben Sie Ihre E-Mail zur Bestätigung ein:', 'Type your email to confirm:'),
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: 'inherit' }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width: 220, background: C.navy, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        {/* Logo */}
        <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #0D9488, #5EEAD4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#fff', flexShrink: 0 }}>GN</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, color: '#fff' }}>Global Nexus</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.45)' }}>Producer Panel</div>
            </div>
          </Link>
        </div>

        {/* User mini */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setTab(1)}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,.12)', overflow: 'hidden', flexShrink: 0, border: '1.5px solid rgba(255,255,255,.2)' }}>
            {profile.photo
              ? <img src={profile.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🏭</div>
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name || t('Mi empresa', 'Mijn bedrijf', 'Mein Unternehmen', 'My company')}</div>
            <div style={{ fontSize: 10, color: '#5EEAD4', fontWeight: 600, marginTop: 1 }}>{pPct}% {L.profileProgress}</div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '0.75rem 0.75rem' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 9, border: 'none', background: tab === item.id ? 'rgba(13,148,136,.25)' : 'transparent', color: tab === item.id ? '#5EEAD4' : 'rgba(255,255,255,.65)', fontWeight: tab === item.id ? 700 : 400, fontSize: 13, cursor: 'pointer', marginBottom: 2, textAlign: 'left', transition: 'all .15s', position: 'relative' }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge ? <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 100, background: tab === item.id ? '#0D9488' : '#EF4444', color: '#fff', minWidth: 18, textAlign: 'center' }}>{item.badge}</span> : null}
              {tab === item.id && <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, borderRadius: 2, background: '#5EEAD4' }} />}
            </button>
          ))}

          {/* Divider */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', margin: '0.75rem 0' }} />

          {/* Coming soon items */}
          {[
            { icon: '🌐', label: t('Red global', 'Globaal netwerk', 'Globales Netzwerk', 'Global network') },
            { icon: '🚢', label: t('Logística', 'Logistiek', 'Logistik', 'Logistics') },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 9, color: 'rgba(255,255,255,.3)', fontSize: 13, marginBottom: 2 }}>
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 100, background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.3)' }}>SOON</span>
            </div>
          ))}
        </nav>

        {/* Explore platform */}
        <div style={{ padding: '0 1.25rem .75rem' }}>
          <Link to="/catalogo" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 9, background: 'linear-gradient(135deg,#0D9488,#0b6b63)', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 12 }}>
            <span>🔍</span>
            <span>{t('Explorar Plataforma B2B','B2B Platform verkennen','B2B-Plattform erkunden','Explore B2B Platform')}</span>
          </Link>
        </div>

        {/* Logout */}
        <div style={{ padding: '.5rem 1.25rem 1rem', borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '1rem' }}>
          <button onClick={logout} style={{ width: '100%', padding: '9px', borderRadius: 8, border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.6)', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
            {L.logoutBtn}
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>

        {/* ── TAB 0: DASHBOARD ── */}
        {tab === 0 && (
          <div style={{ padding: '1.75rem 2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h1 style={{ fontWeight: 900, fontSize: '1.4rem', color: C.navy, margin: 0 }}>
                  {t('Dashboard de Exportaciones', 'Exportdashboard', 'Export-Dashboard', 'Export Dashboard')}
                </h1>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                  {t('Panel de control · Pre-lanzamiento', 'Controlepaneel · Pre-lancering', 'Steuerung · Vor-Launch', 'Control panel · Pre-launch')}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={() => setDemoMode(d => !d)}
                  style={{ padding: '7px 14px', borderRadius: 8, border: `1.5px solid ${demoMode ? C.teal : C.border}`, background: demoMode ? C.tealLight : C.white, color: demoMode ? C.teal : C.muted, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  {demoMode ? '👁 Demo ON' : '👁 Ver demo'}
                </button>
                <div style={{ padding: '7px 14px', borderRadius: 8, background: '#DCFCE7', color: '#16A34A', fontSize: 12, fontWeight: 700, border: '1px solid #86EFAC' }}>
                  🚀 28 Ago 2026
                </div>
              </div>
            </div>

            {/* Pre-launch banner */}
            <div style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFFBEB)', border: '1.5px solid #FCD34D', borderRadius: 12, padding: '0.875rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.1rem' }}>⏳</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 800, fontSize: 13, color: '#92400E' }}>
                  {t('🚀 Modo Pre-Lanzamiento · Lanzamiento: 28 Ago 2026 · 12:00 pm CDMX', '🚀 Pre-Lancering · 28 aug 2026', '🚀 Vor-Launch-Modus · 28. Aug 2026', '🚀 Pre-Launch Mode · Aug 28, 2026')}
                </span>
                <span style={{ fontSize: 12, color: '#78350F', marginLeft: 8 }}>
                  {t('· Sin cobros hasta el 29 de septiembre', '· Geen kosten tot 29 september', '· Keine Kosten bis 29. September', '· No charges until Sep 29')}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { icon: '📦', value: demoMode ? '$48K' : `${products.length}`, label: demoMode ? t('Órdenes mes','Bestellingen','Bestellungen','Orders/month') : t('Productos','Producten','Produkte','Products'), delta: demoMode ? '+23%' : null, color: C.teal },
                { icon: '🇪🇺', value: demoMode ? '23' : '—', label: t('Contactos EU','EU-contacten','EU-Kontakte','EU contacts'), delta: demoMode ? '+8' : null, color: C.navy },
                { icon: '📋', value: demoMode ? '98%' : `${pPct}%`, label: demoMode ? t('Docs válidos','Geldige docs','Gültige Docs','Valid docs') : t('Perfil','Profiel','Profil','Profile'), delta: null, color: '#7C3AED' },
                { icon: '🏆', value: demoMode ? '4.9★' : `${awards.length}`, label: demoMode ? t('Rating EU','EU-rating','EU-Bewertung','EU rating') : t('Premios','Prijzen','Auszeichnungen','Awards'), delta: demoMode ? '+0.2' : null, color: C.gold },
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
              {/* Contactos recientes */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>💬 {t('Contactos recientes','Recente contacten','Letzte Kontakte','Recent contacts')}</span>
                  {demoMode && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: C.tealLight, color: C.teal, fontWeight: 700 }}>DEMO</span>}
                </div>
                {demoMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {DEMO_CONTACTS.map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: C.bg, border: `1px solid ${C.border}` }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: `${C.navy}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{c.flag}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: C.muted }}>{c.city} · {c.time}</div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: c.statusBg, color: c.statusColor }}>{c.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: C.muted }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🇪🇺</div>
                    <div style={{ fontSize: 13, marginBottom: 12 }}>{t('Los contactos de compradores EU aparecerán aquí desde el 28 de agosto.', 'EU-kopers contacten verschijnen hier.', 'EU-Käufer Kontakte erscheinen hier.', 'EU buyer contacts will appear here from Aug 28.')}</div>
                    <button onClick={() => setDemoMode(true)} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: C.teal, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      👁 {t('Ver demo','Demo zien','Demo ansehen','See demo')}
                    </button>
                  </div>
                )}
              </div>

              {/* Órdenes activas */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>📜 {t('Órdenes activas','Actieve bestellingen','Aktive Bestellungen','Active orders')}</span>
                  {demoMode && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: C.tealLight, color: C.teal, fontWeight: 700 }}>DEMO</span>}
                </div>
                {demoMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {DEMO_ORDERS.map((o, i) => (
                      <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: C.bg, border: `1px solid ${C.border}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: C.navy }}>{o.id}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: o.statusBg, color: o.statusColor }}>{o.status}</span>
                        </div>
                        <div style={{ fontSize: 12, color: C.text, marginBottom: 2 }}>{o.desc}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 12, fontWeight: 800, color: C.navy }}>{o.amount}</span>
                          <span style={{ fontSize: 11, color: C.teal, fontWeight: 600 }}>📍 {o.route}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: C.muted }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📦</div>
                    <div style={{ fontSize: 13 }}>{t('Tus órdenes aparecerán aquí una vez que empieces a recibir solicitudes.', 'Bestellingen verschijnen hier.', 'Bestellungen erscheinen hier.', 'Your orders will appear here once you start receiving requests.')}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Profile checklist + quick actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {/* Checklist */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>📋 {L.profileProgress}</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: pPct >= 71 ? C.green : C.gold }}>{pPct}%</div>
                </div>
                <div style={{ width: '100%', height: 6, borderRadius: 3, background: '#F1F5F9', marginBottom: '1rem' }}>
                  <div style={{ width: `${pPct}%`, height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.navy})`, transition: 'width .6s' }} />
                </div>
                {L.checklistItems.map((item, i) => (
                  <div key={i} onClick={() => !pChecks[i] && setTab([1,1,1,1,2,3,1][i] ?? 1)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: i < 6 ? `1px solid ${C.border}` : 'none', cursor: pChecks[i] ? 'default' : 'pointer' }}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0, background: pChecks[i] ? '#DCFCE7' : '#F8FAFC', border: `1.5px solid ${pChecks[i] ? C.green : C.border}`, color: C.green, fontWeight: 800 }}>
                      {pChecks[i] ? '✓' : ''}
                    </div>
                    <span style={{ fontSize: 12, color: pChecks[i] ? C.muted : C.text, textDecoration: pChecks[i] ? 'line-through' : 'none', flex: 1 }}>{item}</span>
                    {!pChecks[i] && <span style={{ fontSize: 10, color: C.teal, fontWeight: 700 }}>→</span>}
                  </div>
                ))}
                <button onClick={() => setTab(1)} style={{ width: '100%', marginTop: '0.75rem', padding: '9px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  {t('Completar mi perfil →','Profiel voltooien →','Profil vervollständigen →','Complete my profile →')}
                </button>
              </div>

              {/* Quick actions */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: '1rem' }}>⚡ {t('Acciones rápidas','Snelle acties','Schnelle Aktionen','Quick actions')}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { icon: '🏭', label: t('Editar mi perfil','Profiel bewerken','Profil bearbeiten','Edit my profile'), tab: 1, color: C.navy },
                    { icon: '📦', label: t('Agregar producto','Product toevoegen','Produkt hinzufügen','Add product'), tab: 2, color: C.teal },
                    { icon: '📖', label: t('Historia & Fotos','Verhaal & Foto\'s','Geschichte & Fotos','Story & Photos'), tab: 3, color: '#7C3AED' },
                    { icon: '🏆', label: t('Premios','Prijzen','Auszeichnungen','Awards'), tab: 7, color: C.gold },
                  ].map((a, i) => (
                    <button key={i} onClick={() => setTab(a.tab)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, cursor: 'pointer', textAlign: 'left', fontSize: 13, fontWeight: 600, color: C.text, transition: 'all .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.background = C.white }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bg }}>
                      <span style={{ fontSize: '1.2rem' }}>{a.icon}</span>
                      {a.label}
                      <span style={{ marginLeft: 'auto', color: C.muted }}>→</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 1: PERFIL ── */}
        {tab === 1 && (
          <div style={{ padding: '1.75rem 2rem' }}>
            {/* Profile hero */}
            <div style={{ background: `linear-gradient(135deg, ${C.navy}, #1a4a7a 70%, #0b5c54)`, borderRadius: 16, padding: '1.5rem 2rem', marginBottom: '1.5rem', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ width: 72, height: 72, borderRadius: 16, background: 'rgba(255,255,255,.15)', overflow: 'hidden', flexShrink: 0, border: '2.5px solid rgba(255,255,255,.3)', cursor: 'pointer' }} onClick={() => photoRef.current?.click()}>
                  {profile.photo ? <img src={profile.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🏭</div>}
                </div>
                <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                <div style={{ flex: 1 }}>
                  {editingName ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input value={nameValue} onChange={e => setNameValue(e.target.value)}
                        style={{ fontWeight: 900, fontSize: '1.1rem', background: 'rgba(255,255,255,.15)', border: '1.5px solid rgba(255,255,255,.4)', borderRadius: 8, padding: '4px 10px', color: '#fff', fontFamily: 'inherit', outline: 'none', flex: 1, minWidth: 0 }} />
                      <button onClick={() => {
                        const updated = { ...user, name: nameValue }
                        localStorage.setItem('gn_current_user', JSON.stringify(updated))
                        setEditingName(false)
                        window.location.reload()
                      }} style={{ padding: '4px 12px', borderRadius: 7, border: 'none', background: '#16A34A', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>✓</button>
                      <button onClick={() => { setNameValue(user?.name || user?.company || ''); setEditingName(false) }}
                        style={{ padding: '4px 10px', borderRadius: 7, border: '1px solid rgba(255,255,255,.3)', background: 'transparent', color: 'rgba(255,255,255,.7)', fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>✕</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ fontWeight: 900, fontSize: '1.2rem' }}>{user.name || t('Tu empresa','Uw bedrijf','Ihr Unternehmen','Your company')}</div>
                      <button onClick={() => setEditingName(true)} title={t('Editar nombre','Naam bewerken','Name bearbeiten','Edit name')}
                        style={{ width: 26, height: 26, borderRadius: 7, border: '1.5px solid rgba(255,255,255,.3)', background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.8)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✏️</button>
                    </div>
                  )}
                  {profile.location && <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', marginTop: 3 }}>📍 {profile.location} · {t('Productor Certificado','Gecertificeerde Producent','Zertifizierter Produzent','Certified Producer')}</div>}
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: '#16A34A', color: '#fff' }}>✓ {t('Productor Verificado IA','IA-geverifieerde Producent','KI-verifizierter Produzent','AI Verified Producer')}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'center' }}>
                  {[
                    { value: products.length, label: t('Productos','Producten','Produkte','Products') },
                    { value: demoMode ? 34 : '—', label: t('Conexiones EU','EU-verbindingen','EU-Verbindungen','EU Connections') },
                    { value: demoMode ? '$180K' : '—', label: t('Órdenes','Bestellingen','Bestellungen','Orders') },
                  ].map((s, i) => (
                    <div key={i}>
                      <div style={{ fontWeight: 900, fontSize: '1.4rem', color: '#5EEAD4' }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ marginTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: 'rgba(255,255,255,.7)' }}>
                  <span>{L.profileProgress}</span>
                  <span style={{ fontWeight: 800, color: pPct >= 71 ? '#5EEAD4' : '#FCD34D' }}>{pPct}%</span>
                </div>
                <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,.15)' }}>
                  <div style={{ width: `${pPct}%`, height: '100%', borderRadius: 3, background: pPct >= 71 ? '#5EEAD4' : '#FCD34D', transition: 'width .6s' }} />
                </div>
              </div>
            </div>

            {/* Edit form */}
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.75rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.5rem', color: C.navy }}>{L.profileTitle}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6 }}>{L.bioLabel}</label>
                  <textarea value={profile.bio || ''} onChange={e => setProfile((p: typeof profile) => ({ ...p, bio: e.target.value }))}
                    placeholder={L.bioPlaceholder} rows={4} style={{ ...inp(), resize: 'vertical', lineHeight: 1.65 }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1rem' }}>
                  {[
                    { key: 'location', label: L.locationLabel, placeholder: 'Jalisco, Guadalajara' },
                    { key: 'whatsapp', label: L.whatsappLabel, placeholder: '+52 33 1234 5678' },
                    { key: 'website', label: L.websiteLabel, placeholder: 'https://miempresa.com' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6 }}>{f.label}</label>
                      <input value={(profile as Record<string,string>)[f.key] || ''} onChange={e => setProfile((p: typeof profile) => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inp()} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button onClick={saveProfileData} style={{ padding: '11px 24px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                    {saveMsg ? L.saved : L.saveBtn}
                  </button>
                  <button onClick={() => photoRef.current?.click()} style={{ padding: '11px 18px', borderRadius: 10, border: `1.5px solid ${C.teal}`, background: 'transparent', color: C.teal, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                    {L.photoBtn}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: PRODUCTOS ── */}
        {tab === 2 && (
          <div style={{ padding: '1.75rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: C.navy, margin: 0 }}>📦 {t('Mi catálogo','Mijn catalogus','Mein Katalog','My catalog')} ({products.length})</h2>
              <button onClick={() => { setShowAddProduct(o => !o); setEditingProductId(null) }}
                style={{ padding: '9px 18px', borderRadius: 9, border: 'none', background: showAddProduct ? C.border : C.teal, color: showAddProduct ? C.text : '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                {showAddProduct ? `✕ ${t('Cancelar','Annuleren','Abbrechen','Cancel')}` : `+ ${L.addProduct}`}
              </button>
            </div>

            {showAddProduct && (
              <div style={{ background: C.white, border: `1.5px solid ${C.teal}30`, borderRadius: 14, padding: '1.5rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  {[
                    { key: 'name', label: L.productName, placeholder: 'Tequila Añejo Reserva', required: true },
                    { key: 'price', label: L.productPrice, placeholder: '$45.00' },
                    { key: 'minOrder', label: L.productMOQ, placeholder: t('100 cajas','100 dozen','100 Kisten','100 boxes') },
                    { key: 'origin', label: L.productOrigin, placeholder: 'Jalisco, México' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 5 }}>{f.label}{f.required ? ' *' : ''}</label>
                      <input value={(newProduct as Record<string,string>)[f.key] || ''} onChange={e => setNewProduct(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inp()} />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 5 }}>{L.productCat} *</label>
                    <select value={newProduct.category || ''} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value, unit: '' }))} style={{ ...inp(), cursor: 'pointer' }}>
                      <option value="">—</option>
                      {L.categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 5 }}>{L.productUnit}</label>
                    <select value={newProduct.unit || ''} onChange={e => setNewProduct(p => ({ ...p, unit: e.target.value }))} style={{ ...inp(), cursor: 'pointer' }}>
                      <option value="">— {t('Selecciona unidad','Eenheid','Einheit','Select unit')} —</option>
                      {getUnits(newProduct.category || '').map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 5 }}>{L.productDesc}</label>
                  <textarea value={newProduct.desc || ''} onChange={e => setNewProduct(p => ({ ...p, desc: e.target.value }))} rows={2} style={{ ...inp(), resize: 'vertical' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6 }}>{L.productPhoto} ({(newProduct.photos || []).length}/5)</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    {(newProduct.photos || []).map((src, i) => (
                      <div key={i} style={{ position: 'relative', width: 68, height: 68 }}>
                        <img src={src} alt="" style={{ width: 68, height: 68, borderRadius: 8, objectFit: 'cover', border: `1px solid ${C.border}` }} />
                        <button type="button" onClick={() => setNewProduct(p => ({ ...p, photos: (p.photos || []).filter((_, idx) => idx !== i) }))}
                          style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: C.red, border: 'none', color: '#fff', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>✕</button>
                      </div>
                    ))}
                    {(newProduct.photos || []).length < 5 && (
                      <button type="button" onClick={() => productPhotosRef.current?.click()}
                        style={{ width: 68, height: 68, borderRadius: 8, border: `2px dashed ${C.border}`, background: C.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2, color: C.muted, fontSize: 11 }}>
                        <span style={{ fontSize: '1.4rem' }}>📷</span>+
                      </button>
                    )}
                    <input ref={productPhotosRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleProductPhotos(e, 'new')} />
                  </div>
                </div>
                <button onClick={addProduct} style={{ padding: '10px 22px', borderRadius: 9, border: 'none', background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  + {L.addBtn}
                </button>
              </div>
            )}

            {products.length === 0
              ? <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '3.5rem 2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>📦</div>
                  <div style={{ fontSize: 14, color: C.muted, maxWidth: 320, margin: '0 auto 1.25rem' }}>{L.noProducts}</div>
                  <button onClick={() => setShowAddProduct(true)} style={{ padding: '10px 22px', borderRadius: 9, border: 'none', background: C.teal, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    + {L.addProduct}
                  </button>
                </div>
              : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem' }}>
                  {products.map(p => {
                    const isEditing = editingProductId === p.id
                    const isConfirmDelete = deleteConfirmId === p.id
                    const photoIdx = activePhotoIdx[p.id] || 0
                    return (
                      <div key={p.id} style={{ background: C.white, border: `1.5px solid ${isEditing ? C.teal : C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                        {isEditing ? (
                          <div style={{ padding: '1.25rem' }}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: '1rem' }}>✏️ {L.editBtn}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '0.75rem' }}>
                              {[
                                { key: 'name', label: L.productName },
                                { key: 'price', label: L.productPrice },
                                { key: 'minOrder', label: L.productMOQ },
                                { key: 'origin', label: L.productOrigin },
                              ].map(f => (
                                <div key={f.key}>
                                  <label style={{ fontSize: 11, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 3 }}>{f.label}</label>
                                  <input value={(editProduct as Record<string,string>)[f.key] || ''} onChange={e => setEditProduct(prev => ({ ...prev, [f.key]: e.target.value }))} style={inp({ fontSize: 12, padding: '8px 10px' })} />
                                </div>
                              ))}
                              <div>
                                <label style={{ fontSize: 11, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 3 }}>{L.productCat}</label>
                                <select value={editProduct.category || ''} onChange={e => setEditProduct(prev => ({ ...prev, category: e.target.value, unit: '' }))} style={{ ...inp({ fontSize: 12, padding: '8px 10px' }), cursor: 'pointer' }}>
                                  {L.categories.map(c => <option key={c}>{c}</option>)}
                                </select>
                              </div>
                              <div>
                                <label style={{ fontSize: 11, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 3 }}>{L.productUnit}</label>
                                <select value={editProduct.unit || ''} onChange={e => setEditProduct(prev => ({ ...prev, unit: e.target.value }))} style={{ ...inp({ fontSize: 12, padding: '8px 10px' }), cursor: 'pointer' }}>
                                  <option value="">— {t('Selecciona','Selecteer','Auswählen','Select')} —</option>
                                  {getUnits(editProduct.category || '').map(u => <option key={u}>{u}</option>)}
                                </select>
                              </div>
                              <div>
                                <label style={{ fontSize: 11, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 3 }}>{L.productDesc}</label>
                                <textarea value={editProduct.desc || ''} onChange={e => setEditProduct(prev => ({ ...prev, desc: e.target.value }))} rows={2} style={{ ...inp({ fontSize: 12, padding: '8px 10px' }), resize: 'vertical' }} />
                              </div>
                              <div>
                                <label style={{ fontSize: 11, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 4 }}>{L.productPhoto} ({(editProduct.photos || []).length}/5)</label>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                                  {(editProduct.photos || []).map((src, i) => (
                                    <div key={i} style={{ position: 'relative' }}>
                                      <img src={src} alt="" style={{ width: 52, height: 52, borderRadius: 6, objectFit: 'cover', border: `1px solid ${C.border}` }} />
                                      <button type="button" onClick={() => setEditProduct(prev => ({ ...prev, photos: (prev.photos || []).filter((_, idx) => idx !== i) }))}
                                        style={{ position: 'absolute', top: -5, right: -5, width: 16, height: 16, borderRadius: '50%', background: C.red, border: 'none', color: '#fff', fontSize: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>✕</button>
                                    </div>
                                  ))}
                                  {(editProduct.photos || []).length < 5 && (
                                    <button type="button" onClick={() => editPhotosRef.current?.click()}
                                      style={{ width: 52, height: 52, borderRadius: 6, border: `2px dashed ${C.border}`, background: C.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: C.muted }}>📷</button>
                                  )}
                                  <input ref={editPhotosRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleProductPhotos(e, 'edit')} />
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button onClick={saveEditProductFn} style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>{L.saveEditBtn}</button>
                              <button onClick={() => { setEditingProductId(null); setEditProduct({}) }} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, fontSize: 12, cursor: 'pointer' }}>✕</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div style={{ width: '100%', height: 160, background: C.bg, overflow: 'hidden', position: 'relative' }}>
                              {p.photos?.length > 0
                                ? <img src={p.photos[photoIdx]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>📦</div>
                              }
                              {p.photos?.length > 1 && (
                                <>
                                  <button onClick={() => setActivePhotoIdx(s => ({ ...s, [p.id]: Math.max(0, (s[p.id] || 0) - 1) }))}
                                    style={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,.45)', border: 'none', color: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                                  <button onClick={() => setActivePhotoIdx(s => ({ ...s, [p.id]: Math.min(p.photos.length - 1, (s[p.id] || 0) + 1) }))}
                                    style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,.45)', border: 'none', color: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
                                  <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
                                    {p.photos.map((_, i) => <div key={i} onClick={() => setActivePhotoIdx(s => ({ ...s, [p.id]: i }))} style={{ width: 6, height: 6, borderRadius: '50%', background: i === photoIdx ? '#fff' : 'rgba(255,255,255,.45)', cursor: 'pointer' }} />)}
                                  </div>
                                  <div style={{ position: 'absolute', top: 6, right: 6, fontSize: 10, fontWeight: 700, background: 'rgba(0,0,0,.5)', color: '#fff', padding: '2px 7px', borderRadius: 100 }}>{photoIdx + 1}/{p.photos.length}</div>
                                </>
                              )}
                            </div>
                            <div style={{ padding: '1rem' }}>
                              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{p.name}</div>
                              <div style={{ fontSize: 11, color: C.teal, fontWeight: 600, marginBottom: 4 }}>{p.category}{p.origin ? ` · ${p.origin}` : ''}</div>
                              {p.price && <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>${p.price} / {p.unit}</div>}
                              {p.minOrder && <div style={{ fontSize: 11, color: C.muted }}>MOQ: {p.minOrder}</div>}
                              {p.desc && <div style={{ fontSize: 12, color: C.muted, marginTop: 4, lineHeight: 1.5 }}>{p.desc}</div>}
                              {/* Per-product certifications — always visible */}
                              <div style={{ marginTop: 12, borderTop: `2px solid ${C.border}`, paddingTop: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                  <div style={{ fontWeight: 700, fontSize: 12, color: C.navy }}>🛡️ {t('Certificaciones del Producto','Productcertificeringen','Produktzertifizierungen','Product Certifications')}</div>
                                  {(p.certDocs || []).length < 3
                                    ? <span style={{ fontSize: 10, fontWeight: 700, color: '#B45309', background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 100, padding: '2px 8px' }}>
                                        {t(`${(p.certDocs||[]).length}/3 mín.`,`${(p.certDocs||[]).length}/3 min.`,`${(p.certDocs||[]).length}/3 Min.`,`${(p.certDocs||[]).length}/3 min.`)}
                                      </span>
                                    : <span style={{ fontSize: 10, fontWeight: 700, color: C.green, background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: 100, padding: '2px 8px' }}>✓ {t('Completo','Compleet','Vollständig','Complete')}</span>
                                  }
                                </div>
                                {/* Saved certs as checkmarks */}
                                {(p.certDocs || []).length > 0 && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
                                    {(p.certDocs || []).map(cd => (
                                      <div key={cd.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 8, background: '#F0FDF4', border: '1px solid #86EFAC' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                                          <span style={{ color: C.green, fontWeight: 900, fontSize: 13, flexShrink: 0 }}>✓</span>
                                          <div style={{ minWidth: 0 }}>
                                            <div style={{ fontWeight: 700, fontSize: 11, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cd.name}</div>
                                            {(cd.issuer || cd.year) && (
                                              <div style={{ fontSize: 10, color: C.muted }}>{cd.issuer}{cd.issuer && cd.year ? ' · ' : ''}{cd.year}</div>
                                            )}
                                          </div>
                                          {cd.fileName && (
                                            <a href={cd.fileData} download={cd.fileName} title={cd.fileName}
                                              style={{ color: C.teal, fontSize: 14, textDecoration: 'none', flexShrink: 0 }}>📎</a>
                                          )}
                                        </div>
                                        <button onClick={() => deleteCertDocFromProduct(p.id, cd.id)}
                                          style={{ color: C.red, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, flexShrink: 0, marginLeft: 4 }}>✕</button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {/* Add certification form — always shown inline */}
                                <div style={{ background: C.bg, border: `1.5px dashed ${C.border}`, borderRadius: 9, padding: '10px' }}>
                                  <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {expandedCertId === p.id
                                      ? t('Nueva certificación','Nieuwe certificering','Neue Zertifizierung','New certification')
                                      : `+ ${t('Agregar certificación','Certificering toevoegen','Zertifizierung hinzufügen','Add certification')}`}
                                  </div>
                                  {expandedCertId !== p.id
                                    ? <button onClick={() => { setExpandedCertId(p.id); setNewCertDoc({}) }}
                                        style={{ width: '100%', padding: '7px', borderRadius: 7, border: `1px solid ${C.teal}40`, background: C.tealLight, color: C.teal, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                                        + {t('Agregar certificación','Certificering toevoegen','Zertifizierung hinzufügen','Add certification')}
                                      </button>
                                    : (
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <input placeholder={t('Nombre: NOM-006, SENASICA, Orgánico, HACCP...','Naam: NOM, SENASICA, Organic...','Name: NOM, SENASICA, Bio...','Name: NOM-006, SENASICA, Organic...')}
                                          value={newCertDoc.name || ''} onChange={e => setNewCertDoc(c => ({ ...c, name: e.target.value }))}
                                          style={inp({ fontSize: 11, padding: '7px 9px' })} />
                                        <div style={{ display: 'flex', gap: 6 }}>
                                          <input placeholder={t('Organismo emisor (ej. SAGARPA)','Instantie (bv. SAGARPA)','Stelle (z.B. SAGARPA)','Issuing body (e.g. SAGARPA)')}
                                            value={newCertDoc.issuer || ''} onChange={e => setNewCertDoc(c => ({ ...c, issuer: e.target.value }))}
                                            style={inp({ fontSize: 11, padding: '7px 9px', flex: 1 })} />
                                          <input placeholder={t('Año','Jaar','Jahr','Year')} value={newCertDoc.year || ''} onChange={e => setNewCertDoc(c => ({ ...c, year: e.target.value }))}
                                            style={inp({ fontSize: 11, padding: '7px 9px', maxWidth: 68 })} />
                                        </div>
                                        <button onClick={() => certDocFileRef.current?.click()}
                                          style={{ padding: '7px 9px', borderRadius: 7, border: `1.5px dashed ${newCertDoc.fileName ? C.teal : C.border}`, background: newCertDoc.fileName ? C.tealLight : C.white, cursor: 'pointer', fontSize: 10, color: newCertDoc.fileName ? C.teal : C.muted, textAlign: 'left', fontWeight: 600 }}>
                                          {newCertDoc.fileName ? `✓ ${newCertDoc.fileName}` : `📎 ${t('Adjuntar PDF, JPG o PNG','PDF, JPG of PNG bijvoegen','PDF, JPG oder PNG anhängen','Attach PDF, JPG or PNG')}`}
                                        </button>
                                        <input ref={certDocFileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
                                          onChange={e => {
                                            const file = e.target.files?.[0]; if (!file) return
                                            const reader = new FileReader()
                                            reader.onload = ev => setNewCertDoc(c => ({ ...c, fileData: ev.target?.result as string, fileName: file.name, fileType: file.type }))
                                            reader.readAsDataURL(file)
                                          }} />
                                        <div style={{ display: 'flex', gap: 6 }}>
                                          <button onClick={() => addCertDocToProduct(p.id)}
                                            style={{ flex: 1, padding: '7px', borderRadius: 7, border: 'none', background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                                            ✓ {t('Guardar certificación','Certificering opslaan','Zertifizierung speichern','Save certification')}
                                          </button>
                                          <button onClick={() => { setExpandedCertId(null); setNewCertDoc({}) }}
                                            style={{ padding: '7px 10px', borderRadius: 7, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, fontSize: 11, cursor: 'pointer' }}>✕</button>
                                        </div>
                                      </div>
                                    )
                                  }
                                </div>
                              </div>
                              {isConfirmDelete ? (
                                <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 8, background: '#FEF2F2', border: '1px solid #FECACA' }}>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: C.red, marginBottom: 8 }}>⚠️ {L.deleteConfirm}</div>
                                  <div style={{ display: 'flex', gap: 6 }}>
                                    <button onClick={() => deleteProductFn(p.id)} style={{ flex: 1, padding: '6px', borderRadius: 7, border: 'none', background: C.red, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>{L.confirmYes}</button>
                                    <button onClick={() => setDeleteConfirmId(null)} style={{ flex: 1, padding: '6px', borderRadius: 7, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, fontSize: 12, cursor: 'pointer' }}>{L.confirmNo}</button>
                                  </div>
                                </div>
                              ) : (
                                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                                  <button onClick={() => { setEditingProductId(p.id); setEditProduct({ ...p }); setShowAddProduct(false) }}
                                    style={{ flex: 1, padding: '6px 10px', borderRadius: 7, border: `1px solid ${C.teal}`, background: 'transparent', color: C.teal, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✏️ {L.editBtn}</button>
                                  <button onClick={() => setDeleteConfirmId(p.id)}
                                    style={{ padding: '6px 10px', borderRadius: 7, border: `1px solid ${C.border}`, background: 'transparent', color: C.red, fontSize: 12, cursor: 'pointer' }}>🗑️</button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
            }
          </div>
        )}

        {/* ── TAB 3: HISTORIA & FOTOS ── */}
        {tab === 3 && (
          <div style={{ padding: '1.75rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: C.navy, margin: 0 }}>📖 {t('Historia & Fotos de la Empresa','Bedrijfsverhaal & Foto\'s','Geschichte & Fotos des Unternehmens','Company Story & Photos')}</h2>
              <button onClick={saveStoryData} style={{ padding: '9px 20px', borderRadius: 9, border: 'none', background: storySaved ? C.green : `linear-gradient(135deg, ${C.teal}, ${C.navy})`, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                {storySaved ? `✓ ${t('Guardado','Opgeslagen','Gespeichert','Saved')}` : L.storySave}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Vision */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: C.navy, display: 'block', marginBottom: 6 }}>🔭 {L.storyVision}</label>
                <p style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>{t('¿Cuál es el propósito y visión a futuro de tu empresa?','Wat is de visie van uw bedrijf?','Was ist die Vision Ihres Unternehmens?','What is your company\'s vision for the future?')}</p>
                <textarea value={(story as Record<string,string>).vision || ''} onChange={e => setStory((s: typeof story) => ({ ...s, vision: e.target.value }))}
                  rows={4} placeholder={t('Nuestra visión es convertirnos en el puente de exportación más confiable entre México y Europa...','Onze visie is...','Unsere Vision ist...','Our vision is to become the most reliable export bridge between Mexico and Europe...')}
                  style={{ ...inp(), resize: 'vertical', lineHeight: 1.65 }} />
              </div>

              {/* Tradition */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: C.navy, display: 'block', marginBottom: 6 }}>🌿 {L.storyTradition}</label>
                <p style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>{t('¿Qué tradiciones y valores definen a tu empresa?','Welke tradities en waarden definieren uw bedrijf?','Welche Traditionen prägen Ihr Unternehmen?','What traditions and values define your company?')}</p>
                <textarea value={(story as Record<string,string>).tradition || ''} onChange={e => setStory((s: typeof story) => ({ ...s, tradition: e.target.value }))}
                  rows={4} placeholder={t('Desde 1987 nuestra familia ha cultivado agave siguiendo métodos ancestrales...','Sinds 1987...','Seit 1987...','Since 1987 our family has cultivated agave following ancestral methods...')}
                  style={{ ...inp(), resize: 'vertical', lineHeight: 1.65 }} />
              </div>

              {/* History */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: C.navy, display: 'block', marginBottom: 6 }}>📜 {L.storyHistory}</label>
                <p style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>{t('Cuéntanos la historia completa de tu empresa.','Vertel ons de volledige geschiedenis van uw bedrijf.','Erzählen Sie uns die vollständige Geschichte Ihres Unternehmens.','Tell us the full history of your company.')}</p>
                <textarea value={(story as Record<string,string>).history || ''} onChange={e => setStory((s: typeof story) => ({ ...s, history: e.target.value }))}
                  rows={6} placeholder={t('Fundada en... Comenzamos como... A lo largo de los años...','Opgericht in...','Gegründet in...','Founded in... We started as... Over the years...')}
                  style={{ ...inp(), resize: 'vertical', lineHeight: 1.65 }} />
              </div>

              {/* Photo gallery */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>🖼️ {L.storyPhotos}</label>
                  <span style={{ fontSize: 11, color: C.muted }}>{((story as Record<string,string[]>).photos || []).length}/20 {t('fotos','foto\'s','Fotos','photos')}</span>
                </div>
                <p style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{t('Sube fotos de tus instalaciones, proceso de producción, equipo humano, gamas de productos, eventos, etc.','Upload foto\'s van uw faciliteiten, productieproces, team, productgamma\'s...','Laden Sie Fotos Ihrer Einrichtungen, des Produktionsprozesses, des Teams, Produktgammas hoch...','Upload photos of your facilities, production process, human team, product ranges, events, etc.')}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                  {((story as Record<string,string[]>).photos || []).map((src, i) => (
                    <div key={i} style={{ position: 'relative', width: 120, height: 90 }}>
                      <img src={src} alt="" style={{ width: 120, height: 90, borderRadius: 8, objectFit: 'cover', border: `1px solid ${C.border}` }} />
                      <button type="button" onClick={() => setStory((s: typeof story) => ({ ...s, photos: ((s as Record<string,string[]>).photos || []).filter((_: string, idx: number) => idx !== i) }))}
                        style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: C.red, border: 'none', color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>✕</button>
                    </div>
                  ))}
                  {((story as Record<string,string[]>).photos || []).length < 20 && (
                    <button type="button" onClick={() => storyPhotosRef.current?.click()}
                      style={{ width: 120, height: 90, borderRadius: 8, border: `2px dashed ${C.border}`, background: C.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4, color: C.muted, fontSize: 12 }}>
                      <span style={{ fontSize: '1.5rem' }}>📷</span>
                      {t('Agregar foto','Foto toevoegen','Foto hinzufügen','Add photo')}
                    </button>
                  )}
                  <input ref={storyPhotosRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleStoryPhotos} />
                </div>
                <button onClick={saveStoryData} style={{ padding: '10px 22px', borderRadius: 9, border: 'none', background: storySaved ? C.green : `linear-gradient(135deg, ${C.teal}, ${C.navy})`, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  {storySaved ? `✓ ${t('Guardado','Opgeslagen','Gespeichert','Saved')}` : L.storySave}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: MENSAJES ── */}
        {tab === 4 && (
          <div style={{ padding: '1.75rem 2rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: C.navy, marginBottom: '1.25rem' }}>💬 {t('Mensajes B2B','B2B-berichten','B2B-Nachrichten','B2B Messages')}</h2>
            <div style={{ marginBottom: '1.25rem' }}>
              <a href="/mensajes" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 24px', borderRadius: 12, background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'none', boxShadow: `0 4px 16px ${C.teal}40` }}>
                💬 {t('Abrir chat en tiempo real →','Realtime chat openen →','Echtzeit-Chat öffnen →','Open real-time chat →')}
              </a>
            </div>
            <TutorialChat lang={lang as Lang} />
          </div>
        )}

        {/* ── TAB 5: SOLICITUDES ── */}
        {tab === 5 && (
          <div style={{ padding: '1.75rem 2rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: C.navy, marginBottom: '1.25rem' }}>📋 {t('Solicitudes de contacto','Contactverzoeken','Kontaktanfragen','Contact requests')}</h2>
            {demoMode ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { company: 'EuroSpirits GmbH', flag: '🇩🇪', product: '500 cajas Tequila Reposado', status: t('Nueva solicitud','Nieuw verzoek','Neue Anfrage','New request'), statusColor: '#16A34A', statusBg: '#DCFCE7', time: 'Hace 2h' },
                  { company: 'Iberia Imports', flag: '🇪🇸', product: '200 kg Miel Melipona', status: t('En negociación','In onderhandeling','In Verhandlung','In negotiation'), statusColor: '#D97706', statusBg: '#FEF3C7', time: 'Hace 1d' },
                  { company: 'Café Paris SARL', flag: '🇫🇷', product: '300 kg Café Single Origin', status: t('Cotización enviada','Offerte verzonden','Angebot gesendet','Quote sent'), statusColor: '#7C3AED', statusBg: '#EDE9FE', time: 'Hace 3d' },
                  { company: 'Amsterdam Organic', flag: '🇳🇱', product: '1000 kg Aguacate Hass', status: t('Nueva solicitud','Nieuw verzoek','Neue Anfrage','New request'), statusColor: '#16A34A', statusBg: '#DCFCE7', time: 'Hace 5h' },
                  { company: 'Munich Naturals', flag: '🇩🇪', product: '50 cajas Mezcal Artesanal', status: t('En negociación','In onderhandeling','In Verhandlung','In negotiation'), statusColor: '#D97706', statusBg: '#FEF3C7', time: 'Hace 2d' },
                ].map((s, i) => (
                  <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 11, background: `${C.navy}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{s.flag}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{s.company}</div>
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{s.product} · {s.time}</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 100, background: s.statusBg, color: s.statusColor, whiteSpace: 'nowrap' }}>{s.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '3.5rem 2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>📋</div>
                <div style={{ fontSize: 14, color: C.muted, maxWidth: 360, margin: '0 auto 1.25rem' }}>
                  {t('Las solicitudes de compradores europeos aparecerán aquí a partir del 28 de agosto de 2026.','Verzoeken van EU-kopers verschijnen hier.','Anfragen von EU-Käufern erscheinen hier.','EU buyer requests will appear here from August 28, 2026.')}
                </div>
                <button onClick={() => setDemoMode(true)} style={{ padding: '9px 20px', borderRadius: 9, border: 'none', background: C.teal, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  👁 {t('Ver demo','Demo zien','Demo ansehen','See demo')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 6: ÓRDENES ── */}
        {tab === 6 && (
          <div style={{ padding: '1.75rem 2rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: C.navy, marginBottom: '1.25rem' }}>📜 {t('Mis órdenes','Mijn bestellingen','Meine Bestellungen','My orders')}</h2>
            {demoMode ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { id: 'ORD-2026-0041', company: 'Mueller Import GmbH 🇩🇪', product: '200 cajas Tequila Añejo', amount: '$9,700 USD', route: 'Veracruz → Rotterdam', status: t('En tránsito 🚢','In transit 🚢','In Transit 🚢','In transit 🚢'), statusColor: '#0D9488', statusBg: '#CCFBF1' },
                  { id: 'ORD-2026-0039', company: 'Maison Premium SARL 🇫🇷', product: '500 kg Café Chiapas', amount: '$6,400 USD', route: 'Pendiente confirmación', status: t('Cotización','Offerte','Angebot','Quote'), statusColor: '#D97706', statusBg: '#FEF3C7' },
                  { id: 'ORD-2026-0037', company: 'Dutch Spirits BV 🇳🇱', product: '100 cajas Tequila Reposado', amount: '$4,850 USD', route: 'Ciudad de México → Amsterdam', status: t('✅ Entregada','✅ Geleverd','✅ Geliefert','✅ Delivered'), statusColor: '#16A34A', statusBg: '#DCFCE7' },
                ].map((o, i) => (
                  <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 13, color: C.navy }}>{o.id}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginTop: 2 }}>{o.company}</div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 100, background: o.statusBg, color: o.statusColor }}>{o.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{o.product}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 900, fontSize: 14, color: C.navy }}>{o.amount}</span>
                      <span style={{ fontSize: 11, color: C.teal, fontWeight: 600 }}>📍 {o.route}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '3.5rem 2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>📜</div>
                <div style={{ fontSize: 14, color: C.muted, maxWidth: 360, margin: '0 auto 1.25rem' }}>
                  {t('Tus órdenes generadas aparecerán aquí a partir del lanzamiento el 28 de agosto.','Bestellingen verschijnen hier.','Bestellungen erscheinen hier.','Your orders will appear here from launch on August 28.')}
                </div>
                <button onClick={() => setDemoMode(true)} style={{ padding: '9px 20px', borderRadius: 9, border: 'none', background: C.teal, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  👁 {t('Ver demo','Demo zien','Demo ansehen','See demo')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 7: PREMIOS / RECONOCIMIENTOS ── */}
        {tab === 7 && (
          <div style={{ padding: '1.75rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: C.navy, margin: 0 }}>🏆 {t('Premios & Reconocimientos','Prijzen & Erkenningen','Auszeichnungen & Anerkennungen','Awards & Recognitions')} ({awards.length})</h2>
              <button onClick={() => { setShowAddAward(o => !o); setNewAward({}) }}
                style={{ padding: '9px 18px', borderRadius: 9, border: 'none', background: showAddAward ? C.border : `linear-gradient(135deg, ${C.gold}, #b45309)`, color: showAddAward ? C.text : '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                {showAddAward ? `✕ ${t('Cancelar','Annuleren','Abbrechen','Cancel')}` : `+ ${L.addAward}`}
              </button>
            </div>

            {showAddAward && (
              <div style={{ background: C.white, border: `1.5px solid ${C.gold}40`, borderRadius: 14, padding: '1.5rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  {[
                    { key: 'name', label: L.awardName, placeholder: t('Premio Nacional de Exportación','Nationale Exportprijs','Nationaler Exportpreis','National Export Award'), required: true },
                    { key: 'year', label: L.awardYear, placeholder: '2023', type: 'number' },
                    { key: 'org', label: L.awardOrg, placeholder: 'BANCOMEXT, PROMEXICO, CRT...' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 5 }}>{f.label}{f.required ? ' *' : ''}</label>
                      <input type={f.type || 'text'} value={(newAward as Record<string,string>)[f.key] || ''} onChange={e => setNewAward(a => ({ ...a, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inp()} />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 5 }}>{L.awardDesc}</label>
                  <textarea value={newAward.desc || ''} onChange={e => setNewAward(a => ({ ...a, desc: e.target.value }))} rows={2}
                    placeholder={t('Descripción del mérito y por qué fue otorgado...','Beschrijving van de verdienste...','Beschreibung der Leistung...','Description of the merit and why it was awarded...')}
                    style={{ ...inp(), resize: 'vertical' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 5 }}>{t('Foto / imagen del reconocimiento (opcional)','Foto van de erkenning (optioneel)','Foto der Auszeichnung (optional)','Award photo (optional)')}</label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {newAward.photo && <img src={newAward.photo} alt="" style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover', border: `1px solid ${C.border}` }} />}
                    <button type="button" onClick={() => awardPhotoRef.current?.click()}
                      style={{ padding: '8px 16px', borderRadius: 8, border: `1.5px dashed ${newAward.photo ? C.gold : C.border}`, background: C.bg, cursor: 'pointer', fontSize: 12, color: C.muted, fontWeight: 600 }}>
                      📷 {t('Subir imagen','Afbeelding uploaden','Bild hochladen','Upload image')}
                    </button>
                    <input ref={awardPhotoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAwardPhoto} />
                  </div>
                </div>
                <button onClick={addAward} style={{ padding: '10px 22px', borderRadius: 9, border: 'none', background: `linear-gradient(135deg, ${C.gold}, #b45309)`, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  🏆 + {L.addAward}
                </button>
              </div>
            )}

            {awards.length === 0 ? (
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '3.5rem 2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏆</div>
                <div style={{ fontSize: 14, color: C.muted, maxWidth: 360, margin: '0 auto 1.25rem' }}>{L.noAwards}</div>
                <button onClick={() => setShowAddAward(true)} style={{ padding: '10px 22px', borderRadius: 9, border: 'none', background: `linear-gradient(135deg, ${C.gold}, #b45309)`, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  + {L.addAward}
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
                {awards.map(a => (
                  <div key={a.id} style={{ background: C.white, border: `1.5px solid ${C.gold}40`, borderRadius: 14, overflow: 'hidden' }}>
                    {a.photo
                      ? <img src={a.photo} alt={a.name} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: 72, background: `linear-gradient(135deg, ${C.gold}20, ${C.gold}08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🏆</div>
                    }
                    <div style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 800, fontSize: 14, color: C.navy, marginBottom: 4 }}>{a.name}</div>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                        {a.year && <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: `${C.gold}20`, color: C.gold }}>📅 {a.year}</span>}
                        {a.org && <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: C.bg, color: C.muted, border: `1px solid ${C.border}` }}>{a.org}</span>}
                      </div>
                      {a.desc && <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{a.desc}</div>}
                      <button onClick={() => { const u = awards.filter(x => x.id !== a.id); setAwards(u); saveAwards(email, u) }}
                        style={{ marginTop: 10, padding: '5px 12px', borderRadius: 7, border: `1px solid ${C.border}`, background: 'transparent', color: C.red, fontSize: 12, cursor: 'pointer' }}>
                        {L.deleteBtn}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 8: AJUSTES ── */}
        {tab === 8 && (
          <div style={{ padding: '1.75rem 2rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: C.navy, marginBottom: '1.5rem' }}>⚙️ {t('Ajustes de cuenta','Accountinstellingen','Kontoeinstellungen','Account settings')}</h2>

            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: '1rem' }}>👤 {t('Información de cuenta','Accountinformatie','Kontoinformationen','Account information')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: t('Email registrado','Geregistreerd e-mail','Registrierte E-Mail','Registered email'), value: email },
                  { label: t('Tipo de cuenta','Type account','Kontotyp','Account type'), value: t('Productor Mexicano','Mexicaanse Producent','Mexikanischer Produzent','Mexican Producer') },
                  { label: t('Sesión activa','Sessie actief','Sitzung aktiv','Active session'), value: t('3h de inactividad','3u inactiviteit','3h Inaktivität','3h inactivity') },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none', fontSize: 13 }}>
                    <span style={{ color: C.muted }}>{row.label}</span>
                    <span style={{ fontWeight: 600, color: C.text }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#FEF2F2', border: `1.5px solid #FECACA`, borderRadius: 14, padding: '1.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.red, marginBottom: 8 }}>⚠️ {L.deleteAccount}</div>
              <p style={{ fontSize: 13, color: '#7F1D1D', marginBottom: '1rem', lineHeight: 1.7 }}>{L.deleteWarning}</p>
              {deleteAccountStep === 0 && (
                <button onClick={() => setDeleteAccountStep(1)}
                  style={{ padding: '10px 22px', borderRadius: 9, border: 'none', background: C.red, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  {L.deleteAccount}
                </button>
              )}
              {deleteAccountStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#7F1D1D' }}>{L.deleteConfirmLabel}</label>
                  <input value={deleteAccountConfirm} onChange={e => setDeleteAccountConfirm(e.target.value)}
                    placeholder={email} style={inp({ borderColor: '#FECACA' })} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { if (deleteAccountConfirm === email) deleteAccount() }}
                      disabled={deleteAccountConfirm !== email}
                      style={{ flex: 1, padding: '10px', borderRadius: 9, border: 'none', background: deleteAccountConfirm === email ? C.red : '#FCA5A5', color: '#fff', fontWeight: 700, fontSize: 13, cursor: deleteAccountConfirm === email ? 'pointer' : 'not-allowed' }}>
                      {t('Confirmar eliminación','Verwijdering bevestigen','Löschung bestätigen','Confirm deletion')}
                    </button>
                    <button onClick={() => { setDeleteAccountStep(0); setDeleteAccountConfirm('') }}
                      style={{ padding: '10px 16px', borderRadius: 9, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, fontSize: 13, cursor: 'pointer' }}>
                      {t('Cancelar','Annuleren','Abbrechen','Cancel')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

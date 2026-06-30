import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  try { return JSON.parse(localStorage.getItem(`gn_products_${email}`) || '[]') } catch { return [] }
}
function saveProducts(email: string, data: Product[]) {
  localStorage.setItem(`gn_products_${email}`, JSON.stringify(data))
}
function getCerts(email: string): Cert[] {
  try { return JSON.parse(localStorage.getItem(`gn_certs_${email}`) || '[]') } catch { return [] }
}
function saveCerts(email: string, data: Cert[]) {
  localStorage.setItem(`gn_certs_${email}`, JSON.stringify(data))
}

interface Product {
  id: string; name: string; category: string; price: string; unit: string
  minOrder: string; desc: string; photo?: string
}
interface Cert {
  id: string; name: string; issuer: string; year: string
}

const C = { navy: '#1E3A5F', teal: '#0D9488', tealLight: '#CCFBF1', gold: '#D97706', green: '#16A34A', border: '#E2E8F0', bg: '#F8FAFC', white: '#FFFFFF', text: '#0F172A', muted: '#64748B', red: '#DC2626' }

const TUTORIAL: Record<Lang, { msg: string; delay: number }[]> = {
  es: [
    { msg: '👋 ¡Bienvenido a Global Nexus! Soy tu asistente de orientación. Te guiaré en tus primeros pasos.', delay: 0 },
    { msg: '🏭 Primero, completa tu **Perfil**. Una foto, descripción de tu empresa y datos de contacto aumentan 3x tus conexiones con compradores europeos.', delay: 1800 },
    { msg: '📦 Luego sube tus **Productos** en la pestaña correspondiente. Añade foto, precio base, unidad de venta y cantidad mínima de pedido (MOQ).', delay: 3800 },
    { msg: '🛡️ Si tienes certificaciones (NOM, SENASICA, Orgánico, COFEPRIS...), agrégalas en **Certificaciones**. Aumentan mucho tu visibilidad con compradores exigentes.', delay: 6200 },
    { msg: '🚀 Tu perfil y productos serán **visibles públicamente el 28 de agosto de 2026** a las 12:00 pm CDMX. ¡Mientras tanto, construye todo con calma!', delay: 8500 },
    { msg: '💬 A partir del lanzamiento, los compradores europeos podrán enviarte mensajes aquí. Para soporte directo escribe a soporte@nexusstrategy.online', delay: 11000 },
  ],
  en: [
    { msg: '👋 Welcome to Global Nexus! I\'m your onboarding assistant. I\'ll guide you through your first steps.', delay: 0 },
    { msg: '🏭 First, complete your **Profile**. A photo, company description and contact details increase your connections with European buyers by 3x.', delay: 1800 },
    { msg: '📦 Then upload your **Products** in the corresponding tab. Add a photo, base price, sales unit and minimum order quantity (MOQ).', delay: 3800 },
    { msg: '🛡️ If you have certifications (NOM, SENASICA, Organic, COFEPRIS...), add them in **Certifications**. They greatly increase your visibility with demanding buyers.', delay: 6200 },
    { msg: '🚀 Your profile and products will be **publicly visible on August 28, 2026** at 12:00 pm CDMX. Meanwhile, build everything at your own pace!', delay: 8500 },
    { msg: '💬 From launch, European buyers can message you directly here. For direct support write to soporte@nexusstrategy.online', delay: 11000 },
  ],
  nl: [
    { msg: '👋 Welkom bij Global Nexus! Ik ben uw onboarding-assistent en begeleid u door de eerste stappen.', delay: 0 },
    { msg: '🏭 Vul eerst uw **Profiel** in. Een foto, bedrijfsbeschrijving en contactgegevens verhogen uw verbindingen met Europese kopers met 3x.', delay: 1800 },
    { msg: '📦 Upload daarna uw **Producten** in het bijbehorende tabblad. Voeg foto, basisprijs, verkoopeenheid en minimale bestelhoeveelheid (MOQ) toe.', delay: 3800 },
    { msg: '🛡️ Als u certificeringen hebt (NOM, SENASICA, Biologisch...), voeg ze toe bij **Certificeringen**. Dit vergroot uw zichtbaarheid bij veeleisende kopers.', delay: 6200 },
    { msg: '🚀 Uw profiel en producten zijn **publiekelijk zichtbaar op 28 augustus 2026** om 12:00 uur CDMX-tijd.', delay: 8500 },
    { msg: '💬 Vanaf de lancering kunnen Europese kopers u hier direct berichten sturen. Ondersteuning: soporte@nexusstrategy.online', delay: 11000 },
  ],
  de: [
    { msg: '👋 Willkommen bei Global Nexus! Ich bin Ihr Onboarding-Assistent und begleite Sie durch Ihre ersten Schritte.', delay: 0 },
    { msg: '🏭 Vervollständigen Sie zuerst Ihr **Profil**. Foto, Unternehmensbeschreibung und Kontaktdaten erhöhen Ihre Verbindungen mit europäischen Käufern um das 3-fache.', delay: 1800 },
    { msg: '📦 Laden Sie dann Ihre **Produkte** im entsprechenden Tab hoch. Fügen Sie Foto, Basispreis, Verkaufseinheit und Mindestbestellmenge (MOQ) hinzu.', delay: 3800 },
    { msg: '🛡️ Wenn Sie Zertifizierungen haben (NOM, SENASICA, Bio...), fügen Sie sie unter **Zertifizierungen** hinzu. Dies erhöht Ihre Sichtbarkeit bei anspruchsvollen Käufern.', delay: 6200 },
    { msg: '🚀 Ihr Profil und Produkte werden am **28. August 2026 um 12:00 Uhr CDMX-Zeit** öffentlich sichtbar.', delay: 8500 },
    { msg: '💬 Ab dem Launch können europäische Käufer Ihnen hier direkt Nachrichten senden. Support: soporte@nexusstrategy.online', delay: 11000 },
  ],
}

type L = {
  tabs: string[]; welcome: string; preLaunch: string; preLaunchSub: string
  profileTitle: string; photoBtn: string; bioLabel: string; bioPlaceholder: string
  websiteLabel: string; whatsappLabel: string; locationLabel: string; saveBtn: string; saved: string
  profileCompletion: string; addProduct: string; productName: string; productCat: string
  productPrice: string; productUnit: string; productMOQ: string; productDesc: string; productPhoto: string
  addBtn: string; deleteBtn: string; certTitle: string; certIssuer: string; certYear: string
  addCertBtn: string; chatPlaceholder: string; chatSend: string; logoutBtn: string
  statsProducts: string; statsCerts: string; profileProgress: string; noProducts: string; noCerts: string
  categories: string[]; checklistItems: string[]
}

const LABELS: Record<Lang, L> = {
  es: {
    tabs: ['Resumen', 'Mi Perfil', 'Productos', 'Certificaciones', '💬 Mensajes'],
    welcome: 'Mi Panel de Productor',
    preLaunch: '🚀 Modo Pre-Lanzamiento · Lanzamiento: 28 Ago 2026 · 12:00 pm CDMX',
    preLaunchSub: 'Tu perfil y productos se publicarán automáticamente en la fecha de lanzamiento. Mientras tanto, arma tu perfil completo.',
    profileTitle: 'Perfil público de mi empresa',
    photoBtn: 'Cambiar foto',
    bioLabel: 'Descripción de tu empresa',
    bioPlaceholder: 'Cuéntanos sobre tu empresa, historia, productos estrella, experiencia exportadora...',
    websiteLabel: 'Sitio web',
    whatsappLabel: 'WhatsApp de contacto',
    locationLabel: 'Estado / Ciudad, México',
    saveBtn: 'Guardar cambios',
    saved: '✓ Guardado exitosamente',
    profileCompletion: 'Perfil completado',
    addProduct: 'Agregar producto',
    productName: 'Nombre del producto',
    productCat: 'Categoría',
    productPrice: 'Precio base (USD)',
    productUnit: 'Unidad de venta',
    productMOQ: 'Pedido mínimo (MOQ)',
    productDesc: 'Descripción breve',
    productPhoto: '+ Foto del producto',
    addBtn: 'Agregar producto',
    deleteBtn: 'Eliminar',
    certTitle: 'Nombre de la certificación',
    certIssuer: 'Organismo emisor',
    certYear: 'Año de emisión',
    addCertBtn: 'Agregar certificación',
    chatPlaceholder: 'Escribe una pregunta...',
    chatSend: 'Enviar',
    logoutBtn: 'Cerrar sesión',
    statsProducts: 'Productos publicados',
    statsCerts: 'Certificaciones',
    profileProgress: 'Perfil completo',
    noProducts: 'Aún no tienes productos. ¡Agrega el primero para que los compradores te encuentren!',
    noCerts: 'Agrega tus certificaciones para aumentar la confianza de los compradores europeos.',
    categories: ['Bebidas espirituosas', 'Agricultura y alimentos', 'Artesanías y textiles', 'Cosméticos naturales', 'Farmacéutico / Herbolaria', 'Otro'],
    checklistItems: ['Foto de perfil de empresa', 'Descripción de la empresa', 'Ubicación (Estado/Ciudad)', 'WhatsApp de contacto', 'Al menos 1 producto publicado', 'Al menos 1 certificación', 'Sitio web (opcional)'],
  },
  en: {
    tabs: ['Overview', 'My Profile', 'Products', 'Certifications', '💬 Messages'],
    welcome: 'My Producer Panel',
    preLaunch: '🚀 Pre-Launch Mode · Launch: Aug 28, 2026 · 12:00 pm CDMX',
    preLaunchSub: 'Your profile and products will be published automatically on launch date. Meanwhile, build your complete profile.',
    profileTitle: 'My company public profile',
    photoBtn: 'Change photo',
    bioLabel: 'Company description',
    bioPlaceholder: 'Tell us about your company, history, star products, export experience...',
    websiteLabel: 'Website',
    whatsappLabel: 'Contact WhatsApp',
    locationLabel: 'State / City, Mexico',
    saveBtn: 'Save changes',
    saved: '✓ Saved successfully',
    profileCompletion: 'Profile completion',
    addProduct: 'Add product',
    productName: 'Product name',
    productCat: 'Category',
    productPrice: 'Base price (USD)',
    productUnit: 'Sales unit',
    productMOQ: 'Minimum order (MOQ)',
    productDesc: 'Brief description',
    productPhoto: '+ Product photo',
    addBtn: 'Add product',
    deleteBtn: 'Delete',
    certTitle: 'Certification name',
    certIssuer: 'Issuing body',
    certYear: 'Year issued',
    addCertBtn: 'Add certification',
    chatPlaceholder: 'Ask a question...',
    chatSend: 'Send',
    logoutBtn: 'Sign out',
    statsProducts: 'Published products',
    statsCerts: 'Certifications',
    profileProgress: 'Profile complete',
    noProducts: 'No products yet. Add your first one so buyers can find you!',
    noCerts: 'Add your certifications to increase trust with European buyers.',
    categories: ['Spirits & Beverages', 'Agriculture & Food', 'Crafts & Textiles', 'Natural Cosmetics', 'Pharmaceutical / Herbalism', 'Other'],
    checklistItems: ['Company profile photo', 'Company description', 'Location (State/City)', 'WhatsApp contact', 'At least 1 product published', 'At least 1 certification', 'Website (optional)'],
  },
  nl: {
    tabs: ['Overzicht', 'Mijn Profiel', 'Producten', 'Certificeringen', '💬 Berichten'],
    welcome: 'Mijn Producentenpanel',
    preLaunch: '🚀 Pre-Lancering · Lancering: 28 aug 2026 · 12:00 uur CDMX',
    preLaunchSub: 'Uw profiel en producten worden automatisch gepubliceerd op de lanceringsdatum. Bouw ondertussen uw volledige profiel.',
    profileTitle: 'Openbaar bedrijfsprofiel',
    photoBtn: 'Foto wijzigen',
    bioLabel: 'Bedrijfsbeschrijving',
    bioPlaceholder: 'Vertel ons over uw bedrijf, geschiedenis, topproducten, exportervaring...',
    websiteLabel: 'Website',
    whatsappLabel: 'Contact WhatsApp',
    locationLabel: 'Staat / Stad, Mexico',
    saveBtn: 'Wijzigingen opslaan',
    saved: '✓ Succesvol opgeslagen',
    profileCompletion: 'Profielvoltooiing',
    addProduct: 'Product toevoegen',
    productName: 'Productnaam',
    productCat: 'Categorie',
    productPrice: 'Basisprijs (USD)',
    productUnit: 'Verkoopeenheid',
    productMOQ: 'Minimale bestelling (MOQ)',
    productDesc: 'Korte beschrijving',
    productPhoto: '+ Productfoto',
    addBtn: 'Product toevoegen',
    deleteBtn: 'Verwijderen',
    certTitle: 'Naam certificering',
    certIssuer: 'Uitgevende instantie',
    certYear: 'Uitgiftejaar',
    addCertBtn: 'Certificering toevoegen',
    chatPlaceholder: 'Stel een vraag...',
    chatSend: 'Verzenden',
    logoutBtn: 'Uitloggen',
    statsProducts: 'Gepubliceerde producten',
    statsCerts: 'Certificeringen',
    profileProgress: 'Profiel voltooid',
    noProducts: 'Nog geen producten. Voeg uw eerste toe zodat kopers u kunnen vinden!',
    noCerts: 'Voeg uw certificeringen toe om het vertrouwen van Europese kopers te vergroten.',
    categories: ['Dranken & Spiritualiën', 'Landbouw & Voeding', 'Ambachten & Textiel', 'Natuurlijke Cosmetica', 'Farmaceutisch / Kruidengeneeskunde', 'Overig'],
    checklistItems: ['Bedrijfsprofielfoto', 'Bedrijfsbeschrijving', 'Locatie (Staat/Stad)', 'WhatsApp-contact', 'Minimaal 1 product gepubliceerd', 'Minimaal 1 certificering', 'Website (optioneel)'],
  },
  de: {
    tabs: ['Übersicht', 'Mein Profil', 'Produkte', 'Zertifizierungen', '💬 Nachrichten'],
    welcome: 'Mein Produzenten-Panel',
    preLaunch: '🚀 Vor-Launch-Modus · Launch: 28. Aug 2026 · 12:00 Uhr CDMX',
    preLaunchSub: 'Ihr Profil und Produkte werden automatisch am Starttermin veröffentlicht. Bauen Sie inzwischen Ihr vollständiges Profil auf.',
    profileTitle: 'Öffentliches Unternehmensprofil',
    photoBtn: 'Foto ändern',
    bioLabel: 'Unternehmensbeschreibung',
    bioPlaceholder: 'Erzählen Sie uns von Ihrem Unternehmen, Geschichte, Hauptprodukten, Exporterfahrung...',
    websiteLabel: 'Website',
    whatsappLabel: 'Kontakt WhatsApp',
    locationLabel: 'Bundesstaat / Stadt, Mexiko',
    saveBtn: 'Änderungen speichern',
    saved: '✓ Erfolgreich gespeichert',
    profileCompletion: 'Profilfortschritt',
    addProduct: 'Produkt hinzufügen',
    productName: 'Produktname',
    productCat: 'Kategorie',
    productPrice: 'Basispreis (USD)',
    productUnit: 'Verkaufseinheit',
    productMOQ: 'Mindestbestellung (MOQ)',
    productDesc: 'Kurze Beschreibung',
    productPhoto: '+ Produktfoto',
    addBtn: 'Produkt hinzufügen',
    deleteBtn: 'Löschen',
    certTitle: 'Name der Zertifizierung',
    certIssuer: 'Ausstellende Stelle',
    certYear: 'Ausgabejahr',
    addCertBtn: 'Zertifizierung hinzufügen',
    chatPlaceholder: 'Frage stellen...',
    chatSend: 'Senden',
    logoutBtn: 'Abmelden',
    statsProducts: 'Veröffentlichte Produkte',
    statsCerts: 'Zertifizierungen',
    profileProgress: 'Profil vollständig',
    noProducts: 'Noch keine Produkte. Fügen Sie Ihr erstes hinzu, damit Käufer Sie finden!',
    noCerts: 'Fügen Sie Zertifizierungen hinzu, um das Vertrauen europäischer Käufer zu stärken.',
    categories: ['Spirituosen & Getränke', 'Landwirtschaft & Lebensmittel', 'Kunsthandwerk & Textilien', 'Naturkosmetik', 'Pharmazeutisch / Kräuterheilkunde', 'Sonstige'],
    checklistItems: ['Unternehmensprofilfoto', 'Unternehmensbeschreibung', 'Standort (Bundesstaat/Stadt)', 'WhatsApp-Kontakt', 'Mindestens 1 Produkt veröffentlicht', 'Mindestens 1 Zertifizierung', 'Website (optional)'],
  },
}

const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
  width: '100%', padding: '10px 12px', border: `1.5px solid ${C.border}`,
  borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: C.white,
  boxSizing: 'border-box', color: C.text, outline: 'none', ...extra,
})

function TutorialChat({ lang }: { lang: Lang }) {
  const L = LABELS[lang]
  const msgs = TUTORIAL[lang]
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
      msg: lang === 'es' ? '📩 Gracias por tu pregunta. Para soporte directo escribe a soporte@nexusstrategy.online — respondemos en menos de 24 horas.'
         : lang === 'nl' ? '📩 Bedankt voor uw vraag. Schrijf voor directe ondersteuning naar soporte@nexusstrategy.online'
         : lang === 'de' ? '📩 Danke für Ihre Frage. Für direkte Unterstützung schreiben Sie an soporte@nexusstrategy.online'
         : '📩 Thanks for your question. For direct support write to soporte@nexusstrategy.online — we respond in under 24 hours.',
      delay: 0,
    }]), 1000)
  }

  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 500 }}>
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
          placeholder={L.chatPlaceholder} style={{ ...inp(), flex: 1, padding: '9px 12px' }} />
        <button onClick={send} style={{ padding: '9px 16px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>{L.chatSend}</button>
      </div>
    </div>
  )
}

/* ════════════════ MAIN ════════════════ */
export default function DashboardPage() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const L = LABELS[lang]
  const user = getUser()

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.role === 'comprador') navigate('/dashboard-comprador')
  }, [])

  const email = user?.email || ''
  const [profile, setProfile] = useState(() => getProfile(email))
  const [products, setProducts] = useState<Product[]>(() => getProducts(email))
  const [certs, setCerts] = useState<Cert[]>(() => getCerts(email))
  const [tab, setTab] = useState(0)
  const [saveMsg, setSaveMsg] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showAddCert, setShowAddCert] = useState(false)
  const photoRef = useRef<HTMLInputElement>(null)
  const productPhotoRef = useRef<HTMLInputElement>(null)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({})
  const [newCert, setNewCert] = useState<Partial<Cert>>({})

  if (!user) return null

  const pChecks = [!!profile.photo, !!profile.bio, !!profile.location, !!profile.whatsapp, products.length > 0, certs.length > 0, !!profile.website]
  const pPct = Math.round((pChecks.filter(Boolean).length / pChecks.length) * 100)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { const u = { ...profile, photo: ev.target?.result as string }; setProfile(u); saveProfile(email, u) }
    reader.readAsDataURL(file)
  }

  const handleProductPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setNewProduct(p => ({ ...p, photo: ev.target?.result as string }))
    reader.readAsDataURL(file)
  }

  const saveProfileData = () => {
    saveProfile(email, profile); setSaveMsg(true)
    setTimeout(() => setSaveMsg(false), 2500)
  }

  const addProduct = () => {
    if (!newProduct.name || !newProduct.category) return
    const updated = [...products, { ...newProduct, id: Date.now().toString() } as Product]
    setProducts(updated); saveProducts(email, updated); setNewProduct({}); setShowAddProduct(false)
  }

  const addCert = () => {
    if (!newCert.name) return
    const updated = [...certs, { ...newCert, id: Date.now().toString() } as Cert]
    setCerts(updated); saveCerts(email, updated); setNewCert({}); setShowAddCert(false)
  }

  const logout = () => { localStorage.removeItem('gn_current_user'); navigate('/login') }

  return (
    <div style={{ minHeight: '100vh', background: C.bg }}>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.navy}, #1a4a7a 70%, #0b5c54)`, color: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: '1rem' }}>
            {/* Avatar */}
            <div onClick={() => setTab(1)} style={{ width: 58, height: 58, borderRadius: 14, background: 'rgba(255,255,255,.15)', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(255,255,255,.35)', cursor: 'pointer', position: 'relative' }}>
              {profile.photo
                ? <img src={profile.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>🏭</div>
              }
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, fontSize: 'clamp(.95rem,2.5vw,1.1rem)', lineHeight: 1.2 }}>{user.name || 'Mi empresa'}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', marginTop: 2 }}>🏭 {lang === 'es' ? 'Productor' : lang === 'nl' ? 'Producent' : lang === 'de' ? 'Produzent' : 'Producer'} · {user.company || user.state || 'México'}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.55)', textAlign: 'right' }}>{L.profileProgress}</div>
                <div style={{ fontWeight: 800, color: pPct >= 71 ? '#5EEAD4' : '#FCD34D', fontSize: '1rem', textAlign: 'right' }}>{pPct}%</div>
                <div style={{ width: 70, height: 5, borderRadius: 3, background: 'rgba(255,255,255,.2)', marginTop: 2 }}>
                  <div style={{ width: `${pPct}%`, height: '100%', borderRadius: 3, background: pPct >= 71 ? '#5EEAD4' : '#FCD34D', transition: 'width .5s' }} />
                </div>
              </div>
              <button onClick={logout} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>{L.logoutBtn}</button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
            {L.tabs.map((t, i) => (
              <button key={i} onClick={() => setTab(i)} style={{ padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', color: tab === i ? '#5EEAD4' : 'rgba(255,255,255,.6)', fontWeight: tab === i ? 700 : 400, fontSize: 13, borderBottom: `2px solid ${tab === i ? '#5EEAD4' : 'transparent'}`, whiteSpace: 'nowrap', transition: 'all .15s' }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem 1.25rem' }}>

        {/* Pre-launch banner */}
        <div style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFFBEB)', border: '1.5px solid #FCD34D', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: '#92400E' }}>{L.preLaunch}</div>
            <div style={{ fontSize: 12, color: '#78350F', lineHeight: 1.55, marginTop: 3 }}>{L.preLaunchSub}</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 100, background: '#FEF3C7', color: '#D97706', border: '1px solid #FCD34D', whiteSpace: 'nowrap' }}>
            ⏳ 28 Ago 2026
          </div>
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '1rem' }}>
              {[
                { icon: '📦', label: L.statsProducts, value: products.length, color: C.teal, sub: lang==='es'?'publicados':'published' },
                { icon: '🛡️', label: L.statsCerts, value: certs.length, color: '#7C3AED', sub: lang==='es'?'verificadas':'verified' },
                { icon: '🇪🇺', label: lang==='es'?'Países EU alcanzables':lang==='nl'?'Bereikbare EU-landen':lang==='de'?'Erreichbare EU-Länder':'Reachable EU countries', value: 27, color: C.navy, sub: 'TLCUEM' },
                { icon: '💰', label: lang==='es'?'Ahorro arancelario':lang==='nl'?'Tariefbesparing':lang==='de'?'Zollersparnis':'Tariff savings', value: '0%', color: C.gold, sub: lang==='es'?'bajo TLCUEM':'under TLCUEM' },
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
                  <span>🌍 {lang==='es'?'Rutas comerciales activas':lang==='nl'?'Actieve handelsroutes':lang==='de'?'Aktive Handelsrouten':'Active trade routes'}</span>
                  <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 100, background: '#DCFCE7', color: '#16A34A', fontWeight: 700 }}>TLCUEM · 0%</span>
                </div>
                <svg viewBox="0 0 420 220" style={{ width: '100%', height: 'auto' }} xmlns="http://www.w3.org/2000/svg">
                  <rect width="420" height="220" fill="#EFF6FF" rx="10"/>
                  <path d="M60 110 Q70 95 90 90 Q110 85 120 95 Q130 105 125 120 Q120 135 105 140 Q90 145 75 135 Q60 125 60 110Z" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1.5"/>
                  <path d="M105 140 Q112 155 118 165 Q115 170 110 168 Q105 165 102 155 Z" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1"/>
                  <text x="195" y="150" fontSize="8" fill="#93C5FD" textAnchor="middle" fontWeight="600">ATLÁNTICO</text>
                  <path d="M285 70 Q295 60 315 58 Q335 56 345 68 Q355 78 350 92 Q345 105 330 110 Q315 115 300 108 Q285 100 280 88 Q278 78 285 70Z" fill="#FEF3C7" stroke="#FCD34D" strokeWidth="1.5"/>
                  <path d="M280 88 Q285 100 295 105 Q295 112 288 114 Q280 115 276 108 Q272 100 275 92 Z" fill="#FEF3C7" stroke="#FCD34D" strokeWidth="1"/>
                  <path d="M315 58 Q320 50 330 48 Q340 50 343 58 Q340 66 330 68 Q320 68 315 62 Z" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1"/>
                  <path d="M108 115 C160 95 210 135 268 100" fill="none" stroke="#0D9488" strokeWidth="2" strokeDasharray="6,4" opacity="0.8">
                    <animate attributeName="stroke-dashoffset" values="100;0" dur="3s" repeatCount="indefinite"/>
                  </path>
                  <path d="M95 105 C130 60 200 55 268 75" fill="none" stroke="#1E3A5F" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.6">
                    <animate attributeName="stroke-dashoffset" values="100;0" dur="4s" repeatCount="indefinite"/>
                  </path>
                  <text x="185" y="108" fontSize="12" textAnchor="middle">🚢</text>
                  <text x="170" y="72" fontSize="10" textAnchor="middle">✈️</text>
                  <circle cx="108" cy="118" r="5" fill="#0D9488" opacity="0.9"/>
                  <text x="108" y="132" fontSize="7" fill="#0D9488" textAnchor="middle" fontWeight="700">Veracruz</text>
                  <circle cx="268" cy="100" r="4" fill="#D97706" opacity="0.9"/>
                  <text x="268" y="112" fontSize="7" fill="#D97706" textAnchor="middle" fontWeight="700">Valencia</text>
                  <circle cx="270" cy="75" r="4" fill="#1E3A5F" opacity="0.9"/>
                  <text x="278" y="68" fontSize="7" fill="#1E3A5F" textAnchor="middle" fontWeight="700">Rotterdam</text>
                  <circle cx="95" cy="108" r="3" fill="#16A34A" opacity="0.8"/>
                  <text x="82" y="118" fontSize="6" fill="#16A34A" fontWeight="600">Manzanillo</text>
                  <text x="90" y="82" fontSize="9" fill="#166534" fontWeight="700" textAnchor="middle">MÉXICO</text>
                  <text x="315" y="90" fontSize="9" fill="#1E3A5F" fontWeight="700" textAnchor="middle">EUROPA</text>
                  <rect x="285" y="175" width="120" height="38" rx="6" fill="white" opacity="0.9"/>
                  <line x1="291" y1="185" x2="305" y2="185" stroke="#0D9488" strokeWidth="2" strokeDasharray="4,3"/>
                  <text x="308" y="188" fontSize="7" fill="#0D9488" fontWeight="600">Vía marítima</text>
                  <line x1="291" y1="198" x2="305" y2="198" stroke="#1E3A5F" strokeWidth="1.5" strokeDasharray="3,3"/>
                  <text x="308" y="201" fontSize="7" fill="#1E3A5F" fontWeight="600">Vía aérea</text>
                  <rect x="8" y="170" width="130" height="44" rx="6" fill="#1E3A5F" opacity="0.9"/>
                  <text x="14" y="184" fontSize="7" fill="rgba(255,255,255,0.7)" fontWeight="500">VOLUMEN COMERCIAL</text>
                  <text x="14" y="200" fontSize="14" fill="#5EEAD4" fontWeight="900">450M</text>
                  <text x="55" y="200" fontSize="7" fill="rgba(255,255,255,0.7)"> consumidores EU</text>
                </svg>
              </div>

              {/* Profile checklist */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>📋 {L.profileProgress}</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: pPct >= 71 ? C.green : C.gold }}>{pPct}%</div>
                </div>
                <div style={{ width: '100%', height: 6, borderRadius: 3, background: '#F1F5F9', marginBottom: '1rem' }}>
                  <div style={{ width: `${pPct}%`, height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.navy})`, transition: 'width .6s' }} />
                </div>
                {L.checklistItems.map((item, i) => (
                  <div key={i} onClick={() => !pChecks[i] && setTab([1,1,1,1,2,3,1][i])}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: i < 6 ? `1px solid ${C.border}` : 'none', cursor: pChecks[i] ? 'default' : 'pointer' }}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0, background: pChecks[i] ? '#DCFCE7' : '#F8FAFC', border: `1.5px solid ${pChecks[i] ? C.green : C.border}`, color: C.green, fontWeight: 800 }}>
                      {pChecks[i] ? '✓' : ''}
                    </div>
                    <span style={{ fontSize: 12, color: pChecks[i] ? C.muted : C.text, textDecoration: pChecks[i] ? 'line-through' : 'none', flex: 1 }}>{item}</span>
                    {!pChecks[i] && <span style={{ fontSize: 10, color: C.teal, fontWeight: 700 }}>→</span>}
                  </div>
                ))}
                <button onClick={() => setTab(1)} style={{ width: '100%', marginTop: '0.75rem', padding: '9px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  {lang==='es'?'Completar mi perfil →':lang==='nl'?'Profiel voltooien →':lang==='de'?'Profil vervollständigen →':'Complete my profile →'}
                </button>
              </div>
            </div>

            {/* Products preview + deal flow */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {/* My products preview */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>📦 {lang==='es'?'Mis productos':lang==='nl'?'Mijn producten':lang==='de'?'Meine Produkte':'My products'}</div>
                  <button onClick={() => setTab(2)} style={{ fontSize: 11, color: C.teal, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>{lang==='es'?'Ver todos →':'View all →'}</button>
                </div>
                {products.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: C.muted }}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>📦</div>
                    <div style={{ fontSize: 12, marginBottom: 12 }}>{L.noProducts}</div>
                    <button onClick={() => setTab(2)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: C.teal, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                      {lang==='es'?'+ Agregar producto':'+ Add product'}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {products.slice(0,3).map((p,i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px', borderRadius: 8, background: '#F8FAFC', border: `1px solid ${C.border}` }}>
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: C.bg, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                          {p.photo ? <img src={p.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📦'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: C.muted }}>{p.category} · ${p.price} USD/{p.unit}</div>
                        </div>
                        <div style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, background: '#CCFBF1', color: C.teal, fontWeight: 700, whiteSpace: 'nowrap' }}>TLCUEM ✓</div>
                      </div>
                    ))}
                    {products.length > 3 && <div style={{ fontSize: 11, color: C.muted, textAlign: 'center', paddingTop: 4 }}>+{products.length-3} {lang==='es'?'más':'more'}</div>}
                  </div>
                )}
              </div>

              {/* Deal flow tracker */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: '1rem' }}>🤝 {lang==='es'?'Flujo de contacto':lang==='nl'?'Contactstroom':lang==='de'?'Kontaktablauf':'Contact flow'}</div>
                {[
                  { icon: '🔍', label: lang==='es'?'Comprador EU te encuentra en el catálogo':'EU Buyer finds you in catalog' },
                  { icon: '📩', label: lang==='es'?'Envía solicitud de contacto':'Sends contact request' },
                  { icon: '💬', label: lang==='es'?'Chat privado y negociación':'Private chat & negotiation' },
                  { icon: '📋', label: lang==='es'?'RFQ y propuesta comercial':'RFQ & commercial offer' },
                  { icon: '✅', label: lang==='es'?'Acuerdo y logística TLCUEM':'Agreement & TLCUEM logistics' },
                ].map((s,i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i<4 ? 10 : 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#F1F5F9', border: `2px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>{s.icon}</div>
                      {i < 4 && <div style={{ width: 1, height: 12, background: C.border, marginTop: 2 }} />}
                    </div>
                    <div style={{ paddingTop: 4 }}>
                      <div style={{ fontSize: 11, color: C.text, lineHeight: 1.4 }}>{s.label}</div>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: '1rem', padding: '8px 12px', borderRadius: 8, background: '#FFF7ED', border: '1px solid #FCD34D' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#92400E' }}>🚀 {lang==='es'?'Activo el 28 Ago 2026':'Active Aug 28, 2026'}</div>
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
              <div style={{ width: 84, height: 84, borderRadius: 18, background: C.bg, border: `2px dashed ${C.border}`, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                {profile.photo
                  ? <img src={profile.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🏭</div>
                }
              </div>
              <div>
                <button onClick={() => photoRef.current?.click()} style={{ padding: '9px 18px', borderRadius: 8, border: `1.5px solid ${C.teal}`, background: 'transparent', color: C.teal, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{L.photoBtn}</button>
                <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                <div style={{ fontSize: 11, color: C.muted, marginTop: 5 }}>JPG, PNG, WebP · máx 3MB</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6 }}>{L.bioLabel}</label>
                <textarea value={profile.bio || ''} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                  placeholder={L.bioPlaceholder} rows={4}
                  style={{ ...inp(), resize: 'vertical', lineHeight: 1.65 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1rem' }}>
                {[
                  { key: 'location', label: L.locationLabel, placeholder: 'Jalisco, Guadalajara' },
                  { key: 'whatsapp', label: L.whatsappLabel, placeholder: '+52 33 1234 5678' },
                  { key: 'website', label: L.websiteLabel, placeholder: 'https://miempresa.com' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6 }}>{f.label}</label>
                    <input value={(profile as Record<string,string>)[f.key] || ''} onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder} style={inp()} />
                  </div>
                ))}
              </div>
              <button onClick={saveProfileData} style={{ padding: '11px 24px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', alignSelf: 'flex-start', transition: 'opacity .2s' }}>
                {saveMsg ? L.saved : L.saveBtn}
              </button>
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1rem', color: C.navy }}>📦 {L.tabs[2]} ({products.length})</h2>
              <button onClick={() => setShowAddProduct(o => !o)} style={{ padding: '9px 18px', borderRadius: 9, border: 'none', background: showAddProduct ? C.border : C.teal, color: showAddProduct ? C.text : '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                {showAddProduct ? `✕ ${lang === 'es' ? 'Cancelar' : 'Cancel'}` : `+ ${L.addProduct}`}
              </button>
            </div>

            {showAddProduct && (
              <div style={{ background: C.white, border: `1.5px solid ${C.teal}30`, borderRadius: 14, padding: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  {[
                    { key: 'name', label: L.productName, placeholder: 'Tequila Añejo Reserva', required: true },
                    { key: 'price', label: L.productPrice, placeholder: '$45.00' },
                    { key: 'unit', label: L.productUnit, placeholder: lang === 'es' ? 'Caja 12 botellas' : 'Box 12 bottles' },
                    { key: 'minOrder', label: L.productMOQ, placeholder: lang === 'es' ? '100 cajas' : '100 boxes' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 5 }}>{f.label}{f.required ? ' *' : ''}</label>
                      <input value={(newProduct as Record<string,string>)[f.key] || ''} onChange={e => setNewProduct(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inp()} />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 5 }}>{L.productCat} *</label>
                    <select value={newProduct.category || ''} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))} style={{ ...inp(), cursor: 'pointer' }}>
                      <option value="">—</option>
                      {L.categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 5 }}>{L.productDesc}</label>
                  <textarea value={newProduct.desc || ''} onChange={e => setNewProduct(p => ({ ...p, desc: e.target.value }))} rows={2} style={{ ...inp(), resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
                  <div style={{ width: 68, height: 68, borderRadius: 10, background: C.bg, border: `2px dashed ${C.border}`, overflow: 'hidden', flexShrink: 0 }}>
                    {newProduct.photo ? <img src={newProduct.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>📷</div>}
                  </div>
                  <button onClick={() => productPhotoRef.current?.click()} style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.white, cursor: 'pointer', fontSize: 13, color: C.text }}>
                    {L.productPhoto}
                  </button>
                  <input ref={productPhotoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProductPhoto} />
                </div>
                <button onClick={addProduct} style={{ padding: '10px 22px', borderRadius: 9, border: 'none', background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  + {L.addBtn}
                </button>
              </div>
            )}

            {products.length === 0
              ? <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '3.5rem 2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>📦</div>
                  <div style={{ fontSize: 14, color: C.muted, maxWidth: 320, margin: '0 auto' }}>{L.noProducts}</div>
                </div>
              : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: '1rem' }}>
                  {products.map(p => (
                    <div key={p.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: 150, background: C.bg, overflow: 'hidden' }}>
                        {p.photo ? <img src={p.photo} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>📦</div>}
                      </div>
                      <div style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: C.teal, fontWeight: 600, marginBottom: 6 }}>{p.category}</div>
                        {p.price && <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{p.price} / {p.unit}</div>}
                        {p.minOrder && <div style={{ fontSize: 11, color: C.muted }}>MOQ: {p.minOrder}</div>}
                        {p.desc && <div style={{ fontSize: 12, color: C.muted, marginTop: 5, lineHeight: 1.5 }}>{p.desc}</div>}
                        <button onClick={() => { const u = products.filter(x => x.id !== p.id); setProducts(u); saveProducts(email, u) }}
                          style={{ marginTop: 10, padding: '5px 12px', borderRadius: 7, border: `1px solid ${C.border}`, background: 'transparent', color: '#DC2626', fontSize: 12, cursor: 'pointer' }}>{L.deleteBtn}</button>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {/* ── CERTIFICATIONS ── */}
        {tab === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1rem', color: C.navy }}>🛡️ {L.tabs[3]} ({certs.length})</h2>
              <button onClick={() => setShowAddCert(o => !o)} style={{ padding: '9px 18px', borderRadius: 9, border: 'none', background: showAddCert ? C.border : C.teal, color: showAddCert ? C.text : '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                {showAddCert ? `✕ ${lang === 'es' ? 'Cancelar' : 'Cancel'}` : `+ ${L.addCertBtn}`}
              </button>
            </div>

            {showAddCert && (
              <div style={{ background: C.white, border: `1.5px solid ${C.teal}30`, borderRadius: 14, padding: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  {[
                    { key: 'name', label: L.certTitle, placeholder: 'NOM, SENASICA, Orgánico...', required: true },
                    { key: 'issuer', label: L.certIssuer, placeholder: 'COFEPRIS, SENASICA...' },
                    { key: 'year', label: L.certYear, placeholder: '2024', type: 'number' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 5 }}>{f.label}{f.required ? ' *' : ''}</label>
                      <input type={f.type || 'text'} value={(newCert as Record<string,string>)[f.key] || ''} onChange={e => setNewCert(c => ({ ...c, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inp()} />
                    </div>
                  ))}
                </div>
                <button onClick={addCert} style={{ padding: '10px 22px', borderRadius: 9, border: 'none', background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  + {L.addBtn}
                </button>
              </div>
            )}

            {certs.length === 0
              ? <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '3.5rem 2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>🛡️</div>
                  <div style={{ fontSize: 14, color: C.muted, maxWidth: 320, margin: '0 auto' }}>{L.noCerts}</div>
                </div>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {certs.map(c => (
                    <div key={c.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 10, background: C.tealLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>🛡️</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: C.muted }}>{[c.issuer, c.year].filter(Boolean).join(' · ')}</div>
                      </div>
                      <button onClick={() => { const u = certs.filter(x => x.id !== c.id); setCerts(u); saveCerts(email, u) }}
                        style={{ padding: '5px 12px', borderRadius: 7, border: `1px solid ${C.border}`, background: 'transparent', color: '#DC2626', fontSize: 12, cursor: 'pointer' }}>{L.deleteBtn}</button>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {/* ── MESSAGING HUB ── */}
        {tab === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '1.5rem' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>💬</div>
                <div>
                  <h2 style={{ fontWeight: 900, fontSize: '1.15rem', color: C.navy, margin: 0 }}>💬 Mensajería B2B</h2>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                    {lang === 'es' ? 'Conecta directamente con compradores europeos en su idioma' : lang === 'nl' ? 'Verbinding met Europese kopers in hun taal' : lang === 'de' ? 'Verbindung mit europäischen Käufern in ihrer Sprache' : 'Connect directly with European buyers in their language'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { icon: '🌐', label: lang==='es'?'Traducción automática multilingüe':lang==='nl'?'Automatische meertalige vertaling':lang==='de'?'Automatische mehrsprachige Übersetzung':'Automatic multilingual translation' },
                  { icon: '📄', label: lang==='es'?'Documentos PDF compartidos':lang==='nl'?'Gedeelde PDF-documenten':lang==='de'?'Geteilte PDF-Dokumente':'Shared PDF documents' },
                  { icon: '🤝', label: lang==='es'?'Seguimiento de negociaciones':lang==='nl'?'Onderhandelingsopvolging':lang==='de'?'Verhandlungsverfolgung':'Deal tracking & negotiation' },
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10, background: `${C.teal}08`, border: `1px solid ${C.teal}20` }}>
                    <span style={{ fontSize: '1.3rem' }}>{f.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{f.label}</span>
                  </div>
                ))}
              </div>

              <a href="/mensajes" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 28px', borderRadius: 12, background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, color: '#fff', fontWeight: 800, fontSize: 15, textDecoration: 'none', marginBottom: '2rem', boxShadow: `0 4px 16px ${C.teal}40` }}>
                💬 {lang==='es'?'Ir a Mensajes':'Messages'} →
              </a>

              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '1.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: '1rem' }}>
                  💬 {lang==='es'?'Frases rápidas B2B':lang==='nl'?'Snelle B2B-zinnen':lang==='de'?'Schnelle B2B-Phrasen':'Quick B2B phrases'} <span style={{ fontSize: 11, fontWeight: 400, color: C.muted }}>({lang==='es'?'clic para copiar':'click to copy'})</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    'Thank you for your interest. I\'d like to share our product catalog and pricing.',
                    'We offer 0% tariff under TLCUEM/EU-Mexico trade agreement.',
                    'Our minimum order quantity is [MOQ]. Can we discuss terms?',
                    'I\'m sending you our certificates (NOM, SENASICA, COFEPRIS) for review.',
                  ].map((phrase, i) => (
                    <button key={i} onClick={() => { navigator.clipboard?.writeText(phrase) }}
                      style={{ textAlign: 'left', padding: '10px 14px', borderRadius: 9, border: `1.5px solid ${C.border}`, background: C.bg, fontSize: 13, color: C.text, cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1.5, transition: 'all .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.background = C.tealLight }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bg }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 700, color: C.teal, marginRight: 8 }}>📋</span>{phrase}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

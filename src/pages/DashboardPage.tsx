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
    tabs: ['Resumen', 'Mi Perfil', 'Productos', 'Certificaciones', 'Orientación'],
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
    tabs: ['Overview', 'My Profile', 'Products', 'Certifications', 'Onboarding'],
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
    tabs: ['Overzicht', 'Mijn Profiel', 'Producten', 'Certificeringen', 'Onboarding'],
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
    tabs: ['Übersicht', 'Mein Profil', 'Produkte', 'Zertifizierungen', 'Onboarding'],
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: '1rem' }}>
              {[
                { icon: '📦', label: L.statsProducts, value: products.length, color: C.teal },
                { icon: '🛡️', label: L.statsCerts, value: certs.length, color: '#7C3AED' },
                { icon: '👁️', label: lang === 'es' ? 'Vistas (al lanzamiento)' : 'Views (at launch)', value: '—', color: C.navy },
                { icon: '🤝', label: lang === 'es' ? 'Leads EU (al lanzamiento)' : 'EU Leads (at launch)', value: '—', color: C.gold },
              ].map((s, i) => (
                <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.25rem' }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 'clamp(1.3rem,3vw,1.8rem)', fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Checklist */}
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>📋 {L.profileProgress} · {pPct}%</div>
              </div>
              <div style={{ width: '100%', height: 8, borderRadius: 4, background: C.bg, marginBottom: '1.25rem' }}>
                <div style={{ width: `${pPct}%`, height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${C.teal}, ${C.navy})`, transition: 'width .6s' }} />
              </div>
              {L.checklistItems.map((item, i) => (
                <div key={i} onClick={() => !pChecks[i] && setTab([1,1,1,1,2,3,1][i])}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < 6 ? `1px solid ${C.border}` : 'none', cursor: pChecks[i] ? 'default' : 'pointer' }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0, background: pChecks[i] ? '#DCFCE7' : C.bg, border: `1.5px solid ${pChecks[i] ? C.green : C.border}`, color: C.green }}>
                    {pChecks[i] ? '✓' : ''}
                  </div>
                  <span style={{ fontSize: 13, color: pChecks[i] ? C.muted : C.text, textDecoration: pChecks[i] ? 'line-through' : 'none', flex: 1 }}>{item}</span>
                  {!pChecks[i] && <span style={{ fontSize: 11, color: C.teal, fontWeight: 600 }}>Completar →</span>}
                </div>
              ))}
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

        {/* ── TUTORIAL CHAT ── */}
        {tab === 4 && <TutorialChat lang={lang} />}

      </div>
    </div>
  )
}

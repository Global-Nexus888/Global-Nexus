import { useState, useRef, useEffect, useCallback } from 'react'
import {
  loadThread, sendChatMessage, markThreadRead, subscribeThread,
  ADMIN_EMAIL, ADMIN_NAME, type ChatMessage,
} from '../lib/chat'

/* ─── Deal stages ─── */
const DEAL_STAGES = [
  { id: 'contacto',    icon: '📩', label: 'Contacto',    sub: 'Primer mensaje' },
  { id: 'interes',     icon: '💬', label: 'Interés',     sub: 'Negociación activa' },
  { id: 'propuesta',   icon: '📋', label: 'Propuesta',   sub: 'RFQ / Cotización' },
  { id: 'muestras',    icon: '📦', label: 'Muestras',    sub: 'Aprobación' },
  { id: 'acuerdo',     icon: '✅', label: 'Acuerdo',     sub: 'Términos aceptados' },
  { id: 'cierre',      icon: '🤝', label: 'Cierre',      sub: 'Trato cerrado' },
]

/* ─── Types ─── */
interface Message {
  id: string
  from: 'me' | 'them'
  text: string
  textOriginal?: string
  lang: string
  time: Date
  translated?: boolean
  file?: { name: string; type: 'pdf' | 'jpg'; url: string; size: string }
  reaction?: string
}

interface Conversation {
  id: string
  name: string
  company: string
  country: string
  countryCode: string
  flag: string
  lang: string
  langLabel: string
  timezone: string
  tzOffset: number
  avatar: string
  role: 'buyer' | 'producer'
  online: boolean
  verified: boolean
  product: string
  unread: number
  messages: Message[]
  stage: string
}

/* ─── Mock data ─── */
const now = new Date()
const m = (min: number): Date => new Date(now.getTime() - min * 60000)

const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1', name: 'Jan van der Berg', company: 'EuroSpirits BV', stage: 'interes',
    country: 'Países Bajos', countryCode: 'NL', flag: '🇳🇱',
    lang: 'nl', langLabel: 'Holandés', timezone: 'CET (UTC+2)', tzOffset: 2,
    avatar: '👨‍💼', role: 'buyer', online: true, verified: true,
    product: 'Tequila Añejo Reserva', unread: 2,
    messages: [
      { id: 'm1', from: 'them', lang: 'nl', time: m(120), text: 'Goedemiddag! Ik ben geïnteresseerd in uw Tequila Añejo Reserva voor onze Europese distributie.', textOriginal: 'Goedemiddag! Ik ben geïnteresseerd in uw Tequila Añejo Reserva voor onze Europese distributie.' },
      { id: 'm2', from: 'me', lang: 'es', time: m(115), text: 'Buenos días Jan, con gusto le comparto toda la información. ¿Cuántas cajas necesita para la primera orden?' },
      { id: 'm3', from: 'them', lang: 'nl', time: m(110), text: 'Wij hebben een minimale bestelling van 500 dozen nodig. Zijn er kortingen mogelijk?', textOriginal: 'Wij hebben een minimale bestelling van 500 dozen nodig. Zijn er kortingen mogelijk?' },
      { id: 'm4', from: 'me', lang: 'es', time: m(60), text: 'Para pedidos de 500 cajas aplicamos 8% de descuento. Le adjunto nuestra ficha técnica y certificados.' },
      { id: 'm5', from: 'me', lang: 'es', time: m(58), text: '', file: { name: 'Ficha_Tecnica_Tequila_Anejo.pdf', type: 'pdf', url: '#', size: '2.4 MB' } },
      { id: 'm6', from: 'them', lang: 'nl', time: m(5), text: 'Uitstekend! Kunt u ook de SENASICA-exportvergunning sturen?', textOriginal: 'Uitstekend! Kunt u ook de SENASICA-exportvergunning sturen?' },
      { id: 'm7', from: 'them', lang: 'nl', time: m(2), text: 'Wij willen ook de alcoholpercentage certificering zien.', textOriginal: 'Wij willen ook de alcoholpercentage certificering zien.' },
    ],
  },
  {
    id: 'c2', name: 'Marie Dubois', company: 'Maison des Alcools', stage: 'propuesta',
    country: 'Francia', countryCode: 'FR', flag: '🇫🇷',
    lang: 'fr', langLabel: 'Francés', timezone: 'CET (UTC+2)', tzOffset: 2,
    avatar: '👩‍💼', role: 'buyer', online: true, verified: true,
    product: 'Mezcal Artesanal Espadín', unread: 0,
    messages: [
      { id: 'm1', from: 'them', lang: 'fr', time: m(1440), text: 'Bonjour! Nous sommes très intéressés par votre Mezcal artisanal pour notre réseau de distribution en France.', textOriginal: 'Bonjour! Nous sommes très intéressés par votre Mezcal artisanal pour notre réseau de distribution en France.' },
      { id: 'm2', from: 'me', lang: 'es', time: m(1430), text: 'Bonjour Marie! Encantados de trabajar con Maison des Alcools. El mezcal espadín tiene denominación de origen, ideal para el mercado francés.' },
      { id: 'm3', from: 'them', lang: 'fr', time: m(1420), text: 'Parfait. Pouvez-vous nous envoyer les certifications et les conditions d\'exportation?', textOriginal: 'Parfait. Pouvez-vous nous envoyer les certifications et les conditions d\'exportation?' },
      { id: 'm4', from: 'me', lang: 'es', time: m(1410), text: 'Por supuesto. Con TLCUEM el arancel de importación es 0%. Le envío los documentos de certificación ahora mismo.' },
      { id: 'm4b', from: 'me', lang: 'es', time: m(1408), text: '', file: { name: 'Certificado_DO_Mezcal.pdf', type: 'pdf', url: '#', size: '1.8 MB' } },
      { id: 'm5', from: 'them', lang: 'fr', time: m(1400), text: 'Merci beaucoup! Nous revenons vers vous dans 48 heures.', textOriginal: 'Merci beaucoup! Nous revenons vers vous dans 48 heures.', reaction: '🤝' },
    ],
  },
  {
    id: 'c3', name: 'Klaus Richter', company: 'Deutsche Spirits GmbH', stage: 'muestras',
    country: 'Alemania', countryCode: 'DE', flag: '🇩🇪',
    lang: 'de', langLabel: 'Alemán', timezone: 'CET (UTC+2)', tzOffset: 2,
    avatar: '👨‍🏭', role: 'buyer', online: false, verified: true,
    product: 'Tequila Añejo Reserva', unread: 0,
    messages: [
      { id: 'm1', from: 'them', lang: 'de', time: m(4320), text: 'Guten Tag. Wir suchen einen zuverlässigen Lieferanten für Premium-Tequila für den deutschen Markt.', textOriginal: 'Guten Tag. Wir suchen einen zuverlässigen Lieferanten für Premium-Tequila für den deutschen Markt.' },
      { id: 'm2', from: 'me', lang: 'es', time: m(4300), text: 'Guten Tag Herr Richter! Tenemos 45 años exportando tequila premium. Puedo compartirle nuestro portafolio completo.' },
      { id: 'm3', from: 'them', lang: 'en', time: m(4280), text: 'Thank you. Could you provide your complete export documentation and pricing sheet?', textOriginal: 'Thank you. Could you provide your complete export documentation and pricing sheet.' },
      { id: 'm4', from: 'me', lang: 'es', time: m(4260), text: 'Claro, le adjunto la lista de precios y toda la documentación para exportación a Alemania.' },
      { id: 'm4b', from: 'me', lang: 'es', time: m(4258), text: '', file: { name: 'Lista_Precios_Export_EU.pdf', type: 'pdf', url: '#', size: '3.1 MB' } },
      { id: 'm5', from: 'them', lang: 'de', time: m(4200), text: 'Sehr gut. Wir prüfen die Unterlagen und melden uns bis Ende der Woche.', textOriginal: 'Sehr gut. Wir prüfen die Unterlagen und melden uns bis Ende der Woche.', reaction: '👍' },
    ],
  },
  {
    id: 'c4', name: 'Sofia Andersson', company: 'Nordic Import AB', stage: 'contacto',
    country: 'Suecia', countryCode: 'SE', flag: '🇸🇪',
    lang: 'en', langLabel: 'Inglés', timezone: 'CET (UTC+2)', tzOffset: 2,
    avatar: '👩‍💼', role: 'buyer', online: false, verified: false,
    product: 'Café Chiapaneco de Altura', unread: 0,
    messages: [
      { id: 'm1', from: 'them', lang: 'en', time: m(8640), text: 'Hi! We are interested in sourcing specialty coffee from Mexico for the Scandinavian market.' },
      { id: 'm2', from: 'me', lang: 'es', time: m(8620), text: 'Hello Sofia! Our Chiapas highland coffee is perfect for the Scandinavian market — SHB grade, organic certified.' },
      { id: 'm3', from: 'them', lang: 'en', time: m(8600), text: 'Sounds great. Can you send samples and pricing?' },
      { id: 'm4', from: 'me', lang: 'es', time: m(8580), text: 'Absolutely. We ship sample kits to EU. MOQ for regular orders is 250 kg. I\'ll send the full catalogue.' },
    ],
  },
]

const TRANSLATE: Record<string, Record<string, string>> = {
  nl: {
    'Goedemiddag! Ik ben geïnteresseerd in uw Tequila Añejo Reserva voor onze Europese distributie.': 'Buenos días, estoy interesado en su Tequila Añejo Reserva para nuestra distribución europea.',
    'Wij hebben een minimale bestelling van 500 dozen nodig. Zijn er kortingen mogelijk?': 'Necesitamos un pedido mínimo de 500 cajas. ¿Hay descuentos disponibles?',
    'Uitstekend! Kunt u ook de SENASICA-exportvergunning sturen?': 'Excelente! ¿Puede enviar también el permiso de exportación SENASICA?',
    'Wij willen ook de alcoholpercentage certificering zien.': 'También queremos ver la certificación de porcentaje de alcohol.',
  },
  fr: {
    'Bonjour! Nous sommes très intéressés par votre Mezcal artisanal pour notre réseau de distribution en France.': 'Hola, estamos muy interesados en su Mezcal artesanal para nuestra red de distribución en Francia.',
    "Parfait. Pouvez-vous nous envoyer les certifications et les conditions d'exportation?": '¿Puede enviarnos las certificaciones y las condiciones de exportación?',
    'Merci beaucoup! Nous revenons vers vous dans 48 heures.': 'Muchas gracias. Nos pondremos en contacto en 48 horas.',
  },
  de: {
    'Guten Tag. Wir suchen einen zuverlässigen Lieferanten für Premium-Tequila für den deutschen Markt.': 'Buenas tardes. Buscamos un proveedor confiable de tequila premium para el mercado alemán.',
    'Sehr gut. Wir prüfen die Unterlagen und melden uns bis Ende der Woche.': 'Muy bien. Revisaremos los documentos y nos comunicaremos a fin de semana.',
  },
}

const LANG_FLAG: Record<string, string> = { es: '🇲🇽', en: '🇬🇧', nl: '🇳🇱', fr: '🇫🇷', de: '🇩🇪', pt: '🇵🇹' }
const LANG_NAME: Record<string, string> = { es: 'Español', en: 'English', nl: 'Nederlands', fr: 'Français', de: 'Deutsch' }

function getLocalTime(tzOffset: number): string {
  const utc = new Date()
  const local = new Date(utc.getTime() + (tzOffset * 60 - utc.getTimezoneOffset()) * 60000)
  return local.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function formatDate(date: Date): string {
  const diff = (now.getTime() - date.getTime()) / 60000
  if (diff < 60) return `Hace ${Math.round(diff)} min`
  if (diff < 1440) return `Hace ${Math.round(diff / 60)}h`
  if (diff < 2880) return 'Ayer'
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

const QUICK_PHRASES: Record<string, string[]> = {
  es: ['Buenos días, ¿cómo va el proceso?', 'Adjunto la documentación solicitada.', 'Aplicamos 0% de arancel bajo TLCUEM.', 'Nuestro MOQ es de 500 unidades.', 'Confirmo recibo de su propuesta.', '¿Cuándo podemos agendar una videollamada?', 'Le enviamos muestras esta semana.', 'Trato cerrado, procedemos con el contrato.'],
  en: ['Good morning, how is the process going?', 'Please find the requested documentation attached.', '0% tariff applies under TLCUEM/EU-Mexico agreement.', 'Our MOQ is 500 units.', 'I confirm receipt of your proposal.', 'When can we schedule a video call?', 'We will send samples this week.', 'Deal closed, proceeding with contract.'],
  nl: ['Goedemorgen, hoe verloopt het proces?', 'Hierbij de gevraagde documentatie.', '0% tarief van toepassing onder TLCUEM.', 'Onze MOQ is 500 eenheden.', 'Ik bevestig ontvangst van uw voorstel.', 'Wanneer kunnen we een videogesprek inplannen?', 'We sturen deze week monsters.', 'Deal gesloten, we gaan verder met het contract.'],
  fr: ['Bonjour, comment avance le processus?', 'Veuillez trouver la documentation demandée ci-jointe.', 'Tarif 0% applicable sous TLCUEM.', 'Notre MOQ est de 500 unités.', 'Je confirme réception de votre proposition.', 'Quand pouvons-nous planifier un appel vidéo?', 'Nous enverrons des échantillons cette semaine.', 'Accord conclu, nous procédons au contrat.'],
  de: ['Guten Morgen, wie läuft der Prozess?', 'Anbei die angeforderte Dokumentation.', '0% Zoll unter dem TLCUEM-Abkommen anwendbar.', 'Unsere MOQ beträgt 500 Einheiten.', 'Ich bestätige den Eingang Ihres Angebots.', 'Wann können wir ein Videogespräch vereinbaren?', 'Wir senden diese Woche Muster.', 'Deal abgeschlossen, wir fahren mit dem Vertrag fort.'],
}

/* ─── Component ─── */
export default function MessagesPage() {
  const [activeId, setActiveId] = useState<string>('admin')
  const [convos, setConvos] = useState<Conversation[]>(CONVERSATIONS)
  const [input, setInput] = useState('')
  const [translatedIds, setTranslatedIds] = useState<Set<string>>(new Set())
  const [showInfo, setShowInfo] = useState(false)
  const [showFlow, setShowFlow] = useState(false)
  const [replyLang, setReplyLang] = useState<string>('es')
  const [typing, setTyping] = useState(false)
  const [search, setSearch] = useState('')
  const [autoTranslate, setAutoTranslate] = useState(false)
  const [showPhrases, setShowPhrases] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Admin chat
  const [adminMsgs, setAdminMsgs]     = useState<ChatMessage[]>([])
  const [adminUnread, setAdminUnread] = useState(0)
  const [adminInput, setAdminInput]   = useState('')
  const [adminSending, setAdminSending] = useState(false)
  const adminBottomRef = useRef<HTMLDivElement>(null)

  const getCurrentUser = useCallback(() => {
    try { return JSON.parse(localStorage.getItem('gn_current_user') || '{}') } catch { return {} }
  }, [])

  useEffect(() => {
    const user = getCurrentUser()
    const email = user.email || ''
    if (!email) return
    loadThread(email).then(msgs => {
      setAdminMsgs(msgs)
      setAdminUnread(msgs.filter(m => m.to_email === email && !m.read).length)
    })
    const unsub = subscribeThread(email, (msg) => {
      setAdminMsgs(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg])
      if (activeId !== 'admin') setAdminUnread(n => n + 1)
      setTimeout(() => adminBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
    })
    return unsub
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCurrentUser])

  const openAdmin = () => {
    setActiveId('admin')
    const user = getCurrentUser()
    const email = user.email || ''
    if (email) {
      markThreadRead(email)
      setAdminUnread(0)
      setAdminMsgs(prev => prev.map(m => m.to_email === email ? { ...m, read: true } : m))
    }
    setTimeout(() => adminBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80)
  }

  const sendAdminReply = async () => {
    const text = adminInput.trim()
    if (!text || adminSending) return
    const user = getCurrentUser()
    const email = user.email || ''
    const name = user.name || user.company || email
    if (!email) return
    setAdminSending(true)
    setAdminInput('')
    const msg = await sendChatMessage(email, name, ADMIN_EMAIL, text)
    setAdminMsgs(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg])
    setAdminSending(false)
    setTimeout(() => adminBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
  }

  const setStage = (stageId: string) => {
    setConvos(cs => cs.map(c => c.id === activeId ? { ...c, stage: stageId } : c))
  }

  const convo = convos.find(c => c.id === activeId) ?? convos[0]
  const filtered = convos.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeId, convo?.messages.length])

  // Mark as read on open
  useEffect(() => {
    setConvos(cs => cs.map(c => c.id === activeId ? { ...c, unread: 0 } : c))
  }, [activeId])

  const toggleTranslate = (msgId: string) => {
    setTranslatedIds(prev => {
      const next = new Set(prev)
      next.has(msgId) ? next.delete(msgId) : next.add(msgId)
      return next
    })
  }

  const sendMessage = () => {
    if (!input.trim()) return
    const msg: Message = {
      id: `msg_${Date.now()}`, from: 'me', lang: replyLang,
      text: input.trim(), time: new Date(),
    }
    setConvos(cs => cs.map(c => c.id === activeId ? { ...c, messages: [...c.messages, msg] } : c))
    setInput('')
    // Simulate typing response
    setTimeout(() => setTyping(true), 800)
    setTimeout(() => {
      setTyping(false)
      const response: Message = {
        id: `msg_r_${Date.now()}`, from: 'them', lang: convo.lang,
        text: convo.lang === 'nl' ? 'Dank u wel voor uw bericht. Wij bevestigen de ontvangst en komen zo snel mogelijk bij u terug.' :
              convo.lang === 'fr' ? 'Merci pour votre message. Nous vous répondrons dans les plus brefs délais.' :
              convo.lang === 'de' ? 'Vielen Dank für Ihre Nachricht. Wir melden uns baldmöglichst.' :
              'Thank you for your message. We will get back to you shortly.',
        textOriginal: convo.lang === 'nl' ? 'Dank u wel voor uw bericht. Wij bevestigen de ontvangst en komen zo snel mogelijk bij u terug.' :
              convo.lang === 'fr' ? 'Merci pour votre message. Nous vous répondrons dans les plus brefs délais.' :
              convo.lang === 'de' ? 'Vielen Dank für Ihre Nachricht. Wir melden uns baldmöglichst.' :
              'Thank you for your message. We will get back to you shortly.',
        time: new Date(),
      }
      setConvos(cs => cs.map(c => c.id === activeId ? { ...c, messages: [...c.messages, response] } : c))
    }, 2200)
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const isImg = file.type.startsWith('image/')
    const msg: Message = {
      id: `msg_f_${Date.now()}`, from: 'me', lang: replyLang, text: '', time: new Date(),
      file: {
        name: file.name,
        type: isImg ? 'jpg' : 'pdf',
        url: URL.createObjectURL(file),
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      },
    }
    setConvos(cs => cs.map(c => c.id === activeId ? { ...c, messages: [...c.messages, msg] } : c))
    e.target.value = ''
  }

  const addReaction = (msgId: string, emoji: string) => {
    setConvos(cs => cs.map(c => c.id === activeId ? {
      ...c,
      messages: c.messages.map(m => m.id === msgId ? { ...m, reaction: m.reaction === emoji ? undefined : emoji } : m),
    } : c))
  }

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* ── Sidebar ── */}
      <div style={{ width: 320, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--white)', flexShrink: 0 }}>

        {/* Header */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <h2 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>💬 Mensajes</h2>
            <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--teal-light)', color: 'var(--teal-dark)', padding: '2px 8px', borderRadius: 100 }}>
              {convos.reduce((a, c) => a + c.unread, 0)} sin leer
            </span>
          </div>
          <div style={{fontSize:10, color:'var(--teal)', fontWeight:700, marginBottom: 8}}>🌍 4 idiomas · TLCUEM</div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Buscar conversación..."
            style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface2)', color: 'var(--text)' }}
          />
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* ── Admin pinned conversation ── */}
          <div onClick={openAdmin} style={{ padding: '12px 1.25rem', cursor: 'pointer', borderBottom: '2px solid var(--border)', background: activeId === 'admin' ? 'var(--teal-light)' : '#FFFBEB', transition: 'background .15s' }}
            onMouseEnter={e => { if (activeId !== 'admin') e.currentTarget.style.background = '#FEF9C3' }}
            onMouseLeave={e => { if (activeId !== 'admin') e.currentTarget.style.background = '#FFFBEB' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: activeId === 'admin' ? 'rgba(13,148,136,.15)' : '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', border: activeId === 'admin' ? '2px solid var(--teal)' : '2px solid #FCD34D' }}>🌐</div>
                <div style={{ position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, borderRadius: '50%', background: '#22C55E', border: '2px solid var(--white)' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>Global Nexus</span>
                  {adminMsgs[0] && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{formatDate(new Date(adminMsgs[0].sent_at))}</span>}
                </div>
                <div style={{ fontSize: 11, color: '#D97706', fontWeight: 700 }}>🛡️ Administración oficial</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: activeId === 'admin' ? 'var(--teal-dark)' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
                    {adminMsgs[0]?.subject || 'Mensajes del equipo Global Nexus'}
                  </span>
                  {adminUnread > 0 && (
                    <span style={{ background: '#EF4444', color: '#fff', borderRadius: 100, fontSize: 10, fontWeight: 700, padding: '1px 7px', flexShrink: 0, marginLeft: 4 }}>{adminUnread}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {filtered.map(c => {
            const last = c.messages[c.messages.length - 1]
            const isActive = c.id === activeId
            return (
              <div
                key={c.id}
                onClick={() => setActiveId(c.id)}
                style={{
                  padding: '12px 1.25rem', cursor: 'pointer', borderBottom: '1px solid var(--border)',
                  background: isActive ? 'var(--teal-light)' : 'transparent',
                  transition: 'background .15s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--surface2)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  {/* Avatar */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, background: isActive ? 'rgba(13,148,136,.15)' : 'var(--surface2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                      border: isActive ? '2px solid var(--teal)' : '2px solid var(--border)',
                    }}>{c.avatar}</div>
                    <div style={{
                      position: 'absolute', bottom: -2, right: -2, width: 12, height: 12,
                      borderRadius: '50%', background: c.online ? '#22C55E' : '#94A3B8',
                      border: '2px solid var(--white)',
                    }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{c.name}</span>
                        {c.verified && <span style={{ marginLeft: 4, fontSize: 10, color: 'var(--teal)' }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: 8 }}>{last ? formatDate(last.time) : ''}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{c.flag} {c.company}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                      <span style={{ fontSize: 11, color: isActive ? 'var(--teal-dark)' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
                        {last?.file ? `📎 ${last.file.name}` : last?.text?.slice(0, 45) + (last?.text?.length > 45 ? '…' : '')}
                      </span>
                      {c.unread > 0 && (
                        <span style={{ background: 'var(--teal)', color: '#fff', borderRadius: 100, fontSize: 10, fontWeight: 700, padding: '1px 6px', flexShrink: 0, marginLeft: 4 }}>{c.unread}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Chat window ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* ── ADMIN CHAT PANEL ── */}
        {activeId === 'admin' && (() => {
          const user = getCurrentUser()
          const myEmail = user.email || ''
          return (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '12px 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--white)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', border: '2px solid #FCD34D', flexShrink: 0 }}>🌐</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)' }}>Global Nexus — Administración</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 10, marginTop: 2 }}>
                    <span style={{ color: '#16A34A' }}>● En línea</span>
                    <span>🛡️ Canal oficial de la plataforma</span>
                  </div>
                </div>
              </div>
              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 6, background: '#F1F5F9' }}>
                {adminMsgs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 12 }}>🌐</div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 6 }}>Sin mensajes aún</div>
                    <div style={{ fontSize: 13, lineHeight: 1.6 }}>Aquí recibirás comunicados y seguimiento del equipo Global Nexus. También puedes escribirnos directamente.</div>
                  </div>
                ) : adminMsgs.map((m, i) => {
                  const isMe = m.from_email !== ADMIN_EMAIL
                  const showDate = i === 0 || formatDate(new Date(adminMsgs[i - 1].sent_at)) !== formatDate(new Date(m.sent_at))
                  return (
                    <div key={m.id}>
                      {showDate && (
                        <div style={{ textAlign: 'center', margin: '10px 0 6px' }}>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', background: '#E2E8F0', padding: '3px 12px', borderRadius: 100 }}>{formatDate(new Date(m.sent_at))}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: 2 }}>
                        {!isMe && (
                          <div style={{ width: 32, height: 32, borderRadius: 9, background: '#FEF3C7', border: '2px solid #FCD34D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', marginRight: 7, flexShrink: 0, alignSelf: 'flex-end' }}>🌐</div>
                        )}
                        <div style={{ maxWidth: '75%' }}>
                          {!isMe && (
                            <div style={{ fontSize: 10, color: '#D97706', fontWeight: 700, marginBottom: 2 }}>Global Nexus Admin · <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 4, background: '#FEF3C7', color: '#92400E' }}>🛡️ Oficial</span></div>
                          )}
                          <div style={{
                            background: isMe ? 'linear-gradient(135deg, #0D9488, #1E3A5F)' : 'var(--white)',
                            color: isMe ? '#fff' : 'var(--text)',
                            borderRadius: isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                            padding: '10px 14px',
                            fontSize: 13, lineHeight: 1.6,
                            border: isMe ? 'none' : '1px solid var(--border)',
                            borderLeft: isMe ? 'none' : '3px solid #F59E0B',
                            boxShadow: '0 1px 4px rgba(0,0,0,.07)',
                            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                          }}>{m.body}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3, textAlign: isMe ? 'right' : 'left', display: 'flex', alignItems: 'center', gap: 4, justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                            {formatTime(new Date(m.sent_at))}
                            {isMe && <span style={{ color: m.read ? '#0D9488' : 'var(--text-muted)' }}>{m.read ? '✓✓' : '✓'}</span>}
                          </div>
                        </div>
                        {isMe && (
                          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #0D9488, #1E3A5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', marginLeft: 7, flexShrink: 0, alignSelf: 'flex-end' }}>😊</div>
                        )}
                      </div>
                    </div>
                  )
                })}
                <div ref={adminBottomRef} />
              </div>
              {/* Compose */}
              <div style={{ borderTop: '1px solid var(--border)', background: 'var(--white)', padding: '12px 1.25rem' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span>🛡️ Canal oficial Global Nexus</span>
                  <span>·</span>
                  <span>📩 El equipo responde normalmente en 24 hrs</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                  <textarea
                    value={adminInput}
                    onChange={e => setAdminInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAdminReply() } }}
                    placeholder={myEmail ? 'Escribe tu mensaje al equipo Global Nexus… (Enter envía)' : 'Inicia sesión para enviar mensajes'}
                    disabled={!myEmail || adminSending}
                    rows={1}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '1.5px solid var(--border)', fontSize: 13, resize: 'none', fontFamily: 'inherit', background: myEmail ? 'var(--surface)' : 'var(--surface2)', color: 'var(--text)', lineHeight: 1.5, maxHeight: 90, overflowY: 'auto', outline: 'none' }}
                  />
                  <button
                    onClick={sendAdminReply}
                    disabled={!adminInput.trim() || adminSending || !myEmail}
                    style={{ width: 44, height: 44, borderRadius: 12, border: 'none', cursor: adminInput.trim() && myEmail ? 'pointer' : 'not-allowed', background: adminInput.trim() && myEmail ? 'linear-gradient(135deg, #0D9488, #1E3A5F)' : 'var(--surface2)', color: adminInput.trim() && myEmail ? '#fff' : 'var(--text-muted)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .15s' }}
                  >{adminSending ? '⏳' : '➤'}</button>
                </div>
              </div>
            </div>
          )
        })()}

        {/* ── Regular chat (buyer/producer conversations) ── */}
        {activeId !== 'admin' && <>
        <div style={{ padding: '12px 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', border: '2px solid var(--border)' }}>
                {convo.avatar}
              </div>
              <div style={{ position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, borderRadius: '50%', background: convo.online ? '#22C55E' : '#94A3B8', border: '2px solid var(--white)' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)' }}>{convo.name}</span>
                {convo.verified && <span className="badge badge-teal">✓ Verificado</span>}
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'var(--surface2)', color: 'var(--text-muted)', fontWeight: 600 }}>{LANG_FLAG[convo.lang]} {LANG_NAME[convo.lang]}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 12, marginTop: 2, flexWrap: 'wrap' }}>
                <span>{convo.flag} {convo.company} · {convo.country}</span>
                <span style={{ color: convo.online ? 'var(--green)' : 'var(--text-muted)' }}>
                  {convo.online ? '● En línea' : '○ Desconectado'}
                </span>
                <span>🕐 {getLocalTime(convo.tzOffset)} {convo.timezone}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Stage badge */}
            {(() => {
              const st = DEAL_STAGES.find(s => s.id === convo.stage)
              return st ? (
                <div onClick={() => setShowFlow(f => !f)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--teal-light)', border: '1px solid var(--teal)', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontSize: 12 }}>
                  <span>{st.icon}</span>
                  <span style={{ fontWeight: 700, color: 'var(--teal-dark)' }}>{st.label}</span>
                  <span style={{ color: 'var(--teal)', fontSize: 10 }}>▾</span>
                </div>
              ) : null
            })()}
            {/* My lang selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface2)', padding: '6px 10px', borderRadius: 8, fontSize: 12 }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Mi idioma:</span>
              <select
                value={replyLang}
                onChange={e => setReplyLang(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: 12, fontWeight: 700, color: 'var(--text)', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <option value="es">🇲🇽 Español</option>
                <option value="en">🇬🇧 English</option>
                <option value="nl">🇳🇱 Nederlands</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="de">🇩🇪 Deutsch</option>
              </select>
            </div>
            {/* Auto-translate toggle */}
            <button
              onClick={() => setAutoTranslate(a => !a)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', borderRadius: 8, border: `1.5px solid ${autoTranslate ? 'var(--teal)' : 'var(--border)'}`, background: autoTranslate ? 'var(--teal-light)' : 'var(--surface2)', color: autoTranslate ? 'var(--teal-dark)' : 'var(--text-muted)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              🌐 Auto-traducir todo
            </button>
            <button onClick={() => setShowInfo(!showInfo)} style={{ fontSize: 18, background: 'none', border: 'none', cursor: 'pointer', color: showInfo ? 'var(--teal)' : 'var(--text-muted)' }}>ℹ️</button>
          </div>
        </div>

        {/* Deal flow panel */}
        {showFlow && (
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, #F0FDFA, #EFF6FF)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)' }}>🛤️ Estado del trato · haz clic para cambiar etapa</div>
              <button onClick={() => setShowFlow(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--text-muted)' }}>✕</button>
            </div>
            <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
              {DEAL_STAGES.map((s, i) => {
                const stageIdx = DEAL_STAGES.findIndex(x => x.id === convo.stage)
                const isActive = s.id === convo.stage
                const isDone = i < stageIdx
                return (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <button
                      onClick={() => setStage(s.id)}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 14px', borderRadius: 10, border: `2px solid ${isActive ? 'var(--teal)' : isDone ? '#22C55E' : 'var(--border)'}`, background: isActive ? 'var(--teal-light)' : isDone ? '#DCFCE7' : 'var(--white)', cursor: 'pointer', transition: 'all .15s', minWidth: 80 }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? 'var(--teal-dark)' : isDone ? '#16A34A' : 'var(--text-muted)' }}>{s.label}</span>
                      <span style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }}>{s.sub}</span>
                    </button>
                    {i < DEAL_STAGES.length - 1 && (
                      <div style={{ width: 24, height: 2, background: isDone || isActive ? 'var(--teal)' : 'var(--border)', flexShrink: 0 }} />
                    )}
                  </div>
                )
              })}
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: 11, color: 'var(--text-muted)' }}>
              💡 Flujo: Comprador EU encuentra productor en catálogo → envía Contacto → Productor acepta → Negociación → RFQ/Propuesta → Muestras → Acuerdo → Cierre con documentos TLCUEM
            </div>
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 4 }}>

            {/* Product context banner */}
            <div style={{ background: 'linear-gradient(90deg, var(--teal-light), var(--navy-light))', borderRadius: 10, padding: '10px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.1rem' }}>📦</span>
              <div style={{ fontSize: 12 }}>
                <span style={{ fontWeight: 700, color: 'var(--text)' }}>Contexto: </span>
                <span style={{ color: 'var(--text-muted)' }}>Negociando <strong style={{ color: 'var(--teal)' }}>{convo.product}</strong> con {convo.flag} {convo.name} desde {convo.country}</span>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                🕐 Su hora: {getLocalTime(convo.tzOffset)}
              </div>
            </div>

            {convo.messages.map((msg, i) => {
              const isMe = msg.from === 'me'
              const showDate = i === 0 || formatDate(convo.messages[i - 1].time) !== formatDate(msg.time)
              const isTranslated = translatedIds.has(msg.id) || (autoTranslate && !isMe)
              const translation = msg.textOriginal && TRANSLATE[msg.lang]?.[msg.textOriginal]
              const showTranslation = isTranslated && !!translation

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div style={{ textAlign: 'center', margin: '12px 0 8px' }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--surface2)', padding: '3px 12px', borderRadius: 100 }}>{formatDate(msg.time)}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: 2 }}>
                    <div style={{ maxWidth: '72%', position: 'relative' }}>

                      {/* Lang badge */}
                      {!isMe && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{LANG_FLAG[msg.lang]} {LANG_NAME[msg.lang]}</span>
                          {translation && <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--teal)', background: 'var(--teal-light)', padding: '1px 5px', borderRadius: 4 }}>🌐 ES</span>}
                        </div>
                      )}
                      {isMe && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{LANG_FLAG[replyLang] || '🌐'}</span>
                        </div>
                      )}

                      {/* Bubble */}
                      <div style={{
                        background: isMe ? 'linear-gradient(135deg, var(--teal), var(--teal-dark))' : 'var(--white)',
                        color: isMe ? '#fff' : 'var(--text)',
                        borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        padding: msg.file ? '10px 14px' : '10px 14px',
                        border: isMe ? 'none' : '1px solid var(--border)',
                        boxShadow: '0 1px 4px rgba(0,0,0,.06)',
                        position: 'relative',
                      }}>

                        {msg.file ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                              background: isMe ? 'rgba(255,255,255,.2)' : msg.file.type === 'pdf' ? '#FEE2E2' : '#DBEAFE',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                            }}>{msg.file.type === 'pdf' ? '📄' : '🖼️'}</div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: isMe ? '#fff' : 'var(--text)' }}>{msg.file.name}</div>
                              <div style={{ fontSize: 11, color: isMe ? 'rgba(255,255,255,.75)' : 'var(--text-muted)', marginTop: 2 }}>
                                {msg.file.type.toUpperCase()} · {msg.file.size}
                              </div>
                              <a
                                href={msg.file.url}
                                download={msg.file.name}
                                onClick={e => {
                                  if (msg.file!.url === '#') {
                                    e.preventDefault()
                                    const w = window.open('', '_blank')
                                    if (w) {
                                      w.document.write(`<html><head><title>${msg.file!.name}</title><style>body{font-family:sans-serif;padding:2rem;max-width:800px;margin:0 auto}h1{color:#1E3A5F}table{width:100%;border-collapse:collapse;margin-top:1rem}td,th{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f1f5f9}.footer{margin-top:2rem;font-size:12px;color:#64748B;border-top:1px solid #ddd;padding-top:1rem}</style></head><body><h1>📄 ${msg.file!.name}</h1><p><strong>Global Nexus · nexusstrategy.online</strong></p><p>Documento compartido en chat privado · ${new Date().toLocaleDateString('es-MX', {year:'numeric',month:'long',day:'numeric'})}</p><hr/><p style="color:#64748B;margin-top:2rem">Este documento fue compartido a través de la plataforma Global Nexus como parte de una negociación comercial bajo el marco del TLCUEM (Tratado de Libre Comercio entre México y la Unión Europea).</p><div class="footer">Global Nexus — Plataforma B2B México·Europa · nexusstrategy.online · brandmkrs.ads@gmail.com</div></body></html>`)
                                      w.document.close()
                                      setTimeout(() => w.print(), 500)
                                    }
                                  }
                                }}
                                style={{ fontSize: 11, color: isMe ? 'rgba(255,255,255,.9)' : 'var(--teal)', fontWeight: 600, marginTop: 2, display: 'block' }}
                              >⬇ Descargar PDF</a>
                            </div>
                          </div>
                        ) : (
                          <div>
                            {showTranslation ? (
                              <div>
                                <div style={{ background: 'rgba(13,148,136,.08)', borderRadius: 6, padding: '6px 8px', marginBottom: 6 }}>
                                  <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0, color: 'var(--text)' }}>{translation}</p>
                                  <div style={{ fontSize: 9, color: 'var(--teal)', fontWeight: 700, marginTop: 3 }}>🌐 Traducido al español</div>
                                </div>
                                <p style={{ fontSize: 12, lineHeight: 1.5, margin: 0, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                  <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>(original)</span> {msg.text}
                                </p>
                              </div>
                            ) : (
                              <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0 }}>{msg.text}</p>
                            )}
                          </div>
                        )}

                        {/* Time */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4, marginTop: msg.file ? 0 : 4 }}>
                          <span style={{ fontSize: 10, color: isMe ? 'rgba(255,255,255,.6)' : 'var(--text-muted)' }}>{formatTime(msg.time)}</span>
                          {isMe && <span style={{ fontSize: 10, color: 'rgba(255,255,255,.7)' }}>✓✓</span>}
                        </div>
                      </div>

                      {/* Reaction */}
                      {msg.reaction && (
                        <div style={{ fontSize: '1rem', marginTop: 2, textAlign: isMe ? 'right' : 'left' }}>{msg.reaction}</div>
                      )}

                      {/* Manual translate button */}
                      {!isMe && msg.text && translation && !autoTranslate && (
                        <button
                          onClick={() => toggleTranslate(msg.id)}
                          style={{
                            fontSize: 10, marginTop: 4, background: isTranslated ? 'var(--teal-light)' : 'var(--surface2)',
                            color: isTranslated ? 'var(--teal-dark)' : 'var(--text-muted)',
                            border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit',
                          }}
                        >
                          {isTranslated ? '🌐 Original' : `🌐 Traducir al español`}
                        </button>
                      )}

                      {/* Quick reactions */}
                      {!isMe && !msg.file && (
                        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                          {['👍', '🤝', '✅', '❓'].map(e => (
                            <button key={e} onClick={() => addReaction(msg.id, e)}
                              style={{ fontSize: 12, background: msg.reaction === e ? 'var(--teal-light)' : 'transparent', border: '1px solid var(--border)', borderRadius: 6, padding: '1px 5px', cursor: 'pointer', lineHeight: 1.5 }}>
                              {e}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Typing indicator */}
            {typing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px 16px 16px 4px', padding: '10px 16px', display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
                  ))}
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>{convo.name.split(' ')[0]} está escribiendo…</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Info panel */}
          {showInfo && (
            <div style={{ width: 260, borderLeft: '1px solid var(--border)', background: 'var(--white)', overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', flexShrink: 0 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{convo.avatar}</div>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{convo.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{convo.company}</div>
                {convo.verified && <span className="badge badge-teal" style={{ marginTop: 8 }}>✓ Perfil verificado</span>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                {[
                  { icon: convo.flag, label: 'País', value: convo.country },
                  { icon: '🗣️', label: 'Idioma nativo', value: `${LANG_FLAG[convo.lang]} ${LANG_NAME[convo.lang]}` },
                  { icon: '🕐', label: 'Hora local', value: `${getLocalTime(convo.tzOffset)} (${convo.timezone})` },
                  { icon: '📦', label: 'Interés', value: convo.product },
                  { icon: '👤', label: 'Rol', value: convo.role === 'buyer' ? 'Comprador EU' : 'Productor MX' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{item.icon} {item.label}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text)', textAlign: 'right' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>Archivos compartidos</div>
                {convo.messages.filter(m => m.file).map(m => (
                  <div key={m.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '1rem' }}>{m.file!.type === 'pdf' ? '📄' : '🖼️'}</span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)' }}>{m.file!.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.file!.size}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div style={{ borderTop: '1px solid var(--border)', background: 'var(--white)', padding: '12px 1.25rem' }}>

          {/* Timezone awareness */}
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, display: 'flex', gap: 16 }}>
            <span>🇲🇽 Tu hora: {getLocalTime(-6)}</span>
            <span>{convo.flag} {convo.name.split(' ')[0]}: {getLocalTime(convo.tzOffset)}</span>
            {!convo.online && <span style={{ color: 'var(--gold)', fontWeight: 600 }}>⚠️ Fuera de horario — tu mensaje llegará al reconectarse</span>}
          </div>

          {/* Quick phrases panel */}
          {showPhrases && (
            <div style={{ marginBottom: 10, background: 'var(--surface2)', borderRadius: 10, padding: '10px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>💬 Frases rápidas — {LANG_FLAG[replyLang]} {replyLang.toUpperCase()}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {(QUICK_PHRASES[replyLang] || QUICK_PHRASES['es']).map((phrase, i) => (
                  <button key={i} onClick={() => { setInput(phrase); setShowPhrases(false) }}
                    style={{ textAlign: 'left', padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--white)', fontSize: 12, color: 'var(--text)', cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1.4 }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--teal-light)'; e.currentTarget.style.borderColor = 'var(--teal)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                  >{phrase}</button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            {/* File upload */}
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={handleFile} />
            <button
              onClick={() => fileRef.current?.click()}
              title="Adjuntar PDF o imagen"
              style={{ width: 40, height: 40, borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--surface2)', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >📎</button>
            {/* Quick phrases button */}
            <button
              onClick={() => setShowPhrases(p => !p)}
              title="Frases rápidas"
              style={{ height: 40, padding: '0 10px', borderRadius: 10, border: `1.5px solid ${showPhrases ? 'var(--teal)' : 'var(--border)'}`, background: showPhrases ? 'var(--teal-light)' : 'var(--surface2)', fontSize: 12, fontWeight: 700, color: showPhrases ? 'var(--teal-dark)' : 'var(--text-muted)', cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit' }}
            >💬 Frases</button>

            {/* Text input */}
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder={`Escribe en ${LANG_NAME[replyLang]}… (Enter para enviar)`}
                rows={1}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid var(--border)',
                  fontSize: 14, resize: 'none', fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)',
                  lineHeight: 1.5, maxHeight: 100, overflow: 'auto',
                }}
              />
            </div>

            {/* Send */}
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              style={{
                width: 44, height: 44, borderRadius: 12, border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
                background: input.trim() ? 'linear-gradient(135deg, var(--teal), var(--teal-dark))' : 'var(--surface2)',
                color: input.trim() ? '#fff' : 'var(--text-muted)', fontSize: '1.2rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .15s',
              }}
            >➤</button>
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
            <span>🌐 Traducción automática activa</span>
            <span>📎 PDF, JPG hasta 20MB</span>
            <span>🔒 Cifrado extremo a extremo</span>
          </div>
        </div>
        </>}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  )
}

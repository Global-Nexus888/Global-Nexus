import { useState } from 'react'

/* ─── Types ─── */
type PostType = 'update' | 'photo' | 'event' | 'rfq' | 'deal'
type UserRole = 'producer' | 'buyer'
interface Post {
  id: string
  author: string
  company: string
  role: UserRole
  flag: string
  avatar: string
  type: PostType
  lang: string
  text: string
  textEs?: string
  textEn?: string
  image?: string
  tags: string[]
  likes: number
  comments: number
  time: string
  verified: boolean
  plan: 'pro' | 'comprador' | 'explorador'
  eventDate?: string
  product?: string
  price?: string
}

/* ─── Translations ─── */
const TRANS: Record<string, { es: string; en: string }> = {
  'p1': {
    es: 'Cosecha excepcional este año en los Altos de Jalisco. Nuestro agave azul alcanzó 12 años de maduración — el tequila que produciremos será extraordinario. ¡Próximamente disponible para compradores EU! 🌵',
    en: 'Exceptional harvest this year in the Highlands of Jalisco. Our blue agave reached 12 years of maturation — the tequila we will produce will be extraordinary. Coming soon for EU buyers! 🌵',
  },
  'p2': {
    es: '🔍 Buscamos proveedor certificado de café orgánico mexicano. Necesitamos 2,000 kg/mes, proceso lavado, altitud mínima 1,400 msnm. Certificación USDA Organic o equivalente requerida. Contactar por DM.',
    en: '🔍 Looking for certified Mexican organic coffee supplier. We need 2,000 kg/month, washed process, minimum altitude 1,400 masl. USDA Organic or equivalent certification required. Contact via DM.',
  },
  'p3': {
    es: 'Nueva línea de extractos de jojoba cold-pressed lista para exportación. Cumplimos con todas las normas de la UE para cosméticos. Muestras disponibles para compradores interesados. 🌿',
    en: 'New line of cold-pressed jojoba extracts ready for export. We comply with all EU cosmetics regulations. Samples available for interested buyers. 🌿',
  },
  'p4': {
    es: 'Estaremos en Anuga 2026 en Colonia, Alemania. Si eres importador europeo y quieres conocer nuestros productos mexicanos premium, ven a vernos en el stand B4-220. 📍',
    en: 'We will be at Anuga 2026 in Cologne, Germany. If you are a European importer and want to discover our premium Mexican products, come see us at stand B4-220. 📍',
  },
  'p5': {
    es: 'Cooperativa Valles Orgánicos celebra 20 años exportando mezcal artesanal a Europa. 120 familias productoras, 4 países de la UE, 0% aranceles TLCUEM. Gracias a todos nuestros socios comerciales 🙏',
    en: 'Valles Orgánicos Cooperative celebrates 20 years exporting artisanal mezcal to Europe. 120 producer families, 4 EU countries, 0% TLCUEM tariffs. Thank you to all our business partners 🙏',
  },
  'p6': {
    es: '📣 RFQ: Importamos especias mexicanas para el mercado belga. Buscamos: chile ancho, chipotle y pasilla. Cantidad: 500 kg/mes por variedad. Precio objetivo: 8-10 €/kg. ¡Propuestas bienvenidas!',
    en: '📣 RFQ: We import Mexican spices for the Belgian market. Looking for: ancho chile, chipotle and pasilla. Quantity: 500 kg/month per variety. Target price: 8-10 €/kg. Proposals welcome!',
  },
}

const POSTS: Post[] = [
  {
    id: 'p1', author: 'Roberto Jiménez', company: 'Agave Azul del Highlands',
    role: 'producer', flag: '🇲🇽', avatar: '🌵', type: 'photo', lang: 'es',
    text: TRANS.p1.es, textEs: TRANS.p1.es, textEn: TRANS.p1.en,
    tags: ['#Tequila', '#TLCUEM', '#Jalisco', '#Agave'],
    likes: 47, comments: 12, time: 'Hace 2 horas', verified: true, plan: 'pro',
  },
  {
    id: 'p2', author: 'Marie Dubois', company: 'Maison des Alcools',
    role: 'buyer', flag: '🇫🇷', avatar: '👩‍💼', type: 'rfq', lang: 'fr',
    text: TRANS.p2.en, textEs: TRANS.p2.es, textEn: TRANS.p2.en,
    tags: ['#RFQ', '#Café', '#Orgánico', '#Francia'],
    likes: 23, comments: 8, time: 'Hace 4 horas', verified: true, plan: 'comprador',
    product: 'Café orgánico', price: 'Budget: €12-15/kg',
  },
  {
    id: 'p3', author: 'Ing. Carmen Vega', company: 'Jojoba del Desierto Sonorense',
    role: 'producer', flag: '🇲🇽', avatar: '🌿', type: 'update', lang: 'es',
    text: TRANS.p3.es, textEs: TRANS.p3.es, textEn: TRANS.p3.en,
    tags: ['#Jojoba', '#Cosmética', '#Sonora', '#ExportaciónEU'],
    likes: 31, comments: 5, time: 'Hace 6 horas', verified: true, plan: 'pro',
  },
  {
    id: 'p4', author: 'Valles Orgánicos', company: 'Valles Orgánicos de Oaxaca',
    role: 'producer', flag: '🇲🇽', avatar: '🫙', type: 'event', lang: 'es',
    text: TRANS.p4.es, textEs: TRANS.p4.es, textEn: TRANS.p4.en,
    tags: ['#Anuga2026', '#Feria', '#Alemania', '#Mezcal'],
    likes: 89, comments: 22, time: 'Hace 1 día', verified: true, plan: 'pro',
    eventDate: '4-8 Oct 2026 · Colonia, Alemania',
  },
  {
    id: 'p5', author: 'Cooperativa Valles', company: 'Valles Orgánicos de Oaxaca',
    role: 'producer', flag: '🇲🇽', avatar: '🫙', type: 'update', lang: 'es',
    text: TRANS.p5.es, textEs: TRANS.p5.es, textEn: TRANS.p5.en,
    tags: ['#20Años', '#Mezcal', '#Oaxaca', '#Exportación'],
    likes: 134, comments: 41, time: 'Hace 2 días', verified: true, plan: 'pro',
  },
  {
    id: 'p6', author: 'Pedro Martens', company: 'Belgium Food Import',
    role: 'buyer', flag: '🇧🇪', avatar: '👨‍💼', type: 'rfq', lang: 'nl',
    text: TRANS.p6.en, textEs: TRANS.p6.es, textEn: TRANS.p6.en,
    tags: ['#RFQ', '#Chiles', '#Bélgica', '#Especias'],
    likes: 18, comments: 14, time: 'Hace 3 días', verified: true, plan: 'comprador',
    product: 'Chiles mexicanos', price: 'Budget: 8-10 €/kg',
  },
]

const LANG_FLAG: Record<string, string> = { es: '🇲🇽', en: '🇬🇧', fr: '🇫🇷', nl: '🇳🇱', de: '🇩🇪' }
const LANG_NAME: Record<string, string> = { es: 'Español', en: 'English', fr: 'Français', nl: 'Nederlands', de: 'Deutsch' }

const TYPE_CONFIG: Record<PostType, { label: string; color: string; bg: string; icon: string }> = {
  update: { label: 'Actualización', color: '#0D9488', bg: '#CCFBF1', icon: '📢' },
  photo:  { label: 'Foto / Video',  color: '#7C3AED', bg: '#F3E8FF', icon: '📸' },
  event:  { label: 'Evento',        color: '#D97706', bg: '#FEF3C7', icon: '📅' },
  rfq:    { label: 'Buscando proveedor', color: '#1E3A5F', bg: '#EFF6FF', icon: '🔍' },
  deal:   { label: 'Oferta especial', color: '#16A34A', bg: '#DCFCE7', icon: '🔥' },
}

const TRENDING_TAGS = ['#TLCUEM', '#Tequila', '#Mezcal', '#CaféOrgánico', '#ExportaciónMX', '#RFQ', '#Cosmética', '#Anuga2026', '#Jalisco', '#Oaxaca']

/* ─── Post Card ─── */
function PostCard({ post, viewLang }: { post: Post; viewLang: string }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes)
  const [showComment, setShowComment] = useState(false)

  const displayText = viewLang === 'es' ? (post.textEs || post.text) : (post.textEn || post.text)
  const isTranslated = viewLang !== 'es' && post.textEn
  const typeConf = TYPE_CONFIG[post.type]

  return (
    <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{
          width: 46, height: 46, borderRadius: 12, flexShrink: 0,
          background: post.role === 'producer' ? 'var(--teal-light)' : 'var(--navy-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
          border: `2px solid ${post.role === 'producer' ? 'var(--teal)' : 'var(--navy)'}30`,
        }}>{post.avatar}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{post.author}</span>
            {post.verified && <span style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 700 }}>✓</span>}
            <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 100, background: typeConf.bg, color: typeConf.color, fontWeight: 600 }}>
              {typeConf.icon} {typeConf.label}
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {post.flag} {post.company} · {post.time}
          </div>
        </div>

        {/* Lang badge */}
        <div style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0, textAlign: 'right' }}>
          <div>{LANG_FLAG[post.lang]} {LANG_NAME[post.lang]}</div>
          {isTranslated && <div style={{ color: 'var(--teal)', fontWeight: 600, marginTop: 2 }}>🌐 Traducido</div>}
        </div>
      </div>

      {/* Event banner */}
      {post.type === 'event' && post.eventDate && (
        <div style={{ background: 'var(--gold-light)', border: '1px solid var(--gold)', borderRadius: 8, padding: '8px 12px', marginBottom: 10, fontSize: 12, color: 'var(--gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          📅 {post.eventDate}
        </div>
      )}

      {/* RFQ card */}
      {post.type === 'rfq' && post.product && (
        <div style={{ background: 'var(--navy-light)', border: '1px solid #BFDBFE', borderRadius: 8, padding: '10px 12px', marginBottom: 10, display: 'flex', justify: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' } as React.CSSProperties}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)' }}>🔍 Producto buscado: {post.product}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{post.price}</div>
          </div>
          <button className="btn btn-primary" style={{ fontSize: 11, padding: '6px 14px' }}>Ofrecer producto</button>
        </div>
      )}

      {/* Text */}
      <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--text)', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
        {displayText}
      </p>

      {/* Photo placeholder */}
      {post.type === 'photo' && (
        <div style={{ background: 'linear-gradient(135deg, var(--teal-light), var(--navy-light))', borderRadius: 10, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontSize: '3rem', border: '1px solid var(--border)' }}>
          {post.avatar}
        </div>
      )}

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
        {post.tags.map(tag => (
          <span key={tag} style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 600, cursor: 'pointer' }}>{tag}</span>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
        <button onClick={() => { setLiked(l => !l); setLikes(n => liked ? n - 1 : n + 1) }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: liked ? '#DC2626' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
          {liked ? '❤️' : '🤍'} {likes}
        </button>
        <button onClick={() => setShowComment(c => !c)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
          💬 {post.comments}
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
          📤 Compartir
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--teal)', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
          💬 Contactar
        </button>
      </div>

      {showComment && (
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: 8 }}>
          <input placeholder="Escribe un comentario..." style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, background: 'var(--surface)', color: 'var(--text)' }} />
          <button className="btn btn-primary" style={{ fontSize: 12, padding: '8px 14px' }}>Enviar</button>
        </div>
      )}
    </div>
  )
}

/* ─── Create Post Modal ─── */
function CreatePostModal({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<PostType>('update')
  const [text, setText] = useState('')

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
      <div className="card" style={{ width: '100%', maxWidth: 540, padding: '1.75rem', position: 'relative' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
        <h2 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.25rem' }}>✍️ Crear publicación</h2>

        {/* Type selector */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
          {(Object.entries(TYPE_CONFIG) as [PostType, typeof TYPE_CONFIG[PostType]][]).map(([k, v]) => (
            <button key={k} onClick={() => setType(k)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1.5px solid', borderColor: type === k ? v.color : 'var(--border)', background: type === k ? v.bg : 'transparent', color: type === k ? v.color : 'var(--text-muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>

        <textarea
          value={text} onChange={e => setText(e.target.value)}
          placeholder={
            type === 'rfq' ? 'Describe el producto que buscas, cantidad, presupuesto y requisitos...' :
            type === 'event' ? 'Describe el evento, fecha, lugar y cómo participar...' :
            type === 'photo' ? 'Describe tu foto o video de producción...' :
            'Comparte una actualización sobre tus productos o empresa...'
          }
          rows={5}
          style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 14, resize: 'vertical', fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)', boxSizing: 'border-box' }}
        />

        {type === 'photo' && (
          <div style={{ marginTop: 10, border: '2px dashed var(--border)', borderRadius: 10, padding: '1.5rem', textAlign: 'center', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13 }}>
            📸 Arrastra o haz clic para subir imagen / video
          </div>
        )}

        {type === 'event' && (
          <input type="date" style={{ marginTop: 10, width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit' }} />
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: '1rem', alignItems: 'center' }}>
          <select style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit' }}>
            <option>🇲🇽 Publicar en Español</option>
            <option>🇬🇧 Publicar en English</option>
            <option>🇳🇱 Publicar en Nederlands</option>
            <option>🇩🇪 Publicar en Deutsch</option>
            <option>🇫🇷 Publicar en Français</option>
          </select>
          <button className="btn btn-primary" style={{ padding: '9px 22px', fontSize: 14 }} disabled={!text.trim()}>
            Publicar
          </button>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
          🌐 Se traducirá automáticamente a ES / EN / NL / DE / FR para todos los miembros
        </div>
      </div>
    </div>
  )
}

/* ─── Main page ─── */
export default function SocialPage() {
  const [viewLang, setViewLang] = useState('es')
  const [filter, setFilter] = useState<'all' | PostType>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)

  const filtered = POSTS.filter(p => filter === 'all' || p.type === filter)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>
      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} />}

      {/* Paywall modal */}
      {showPaywall && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowPaywall(false)}>
          <div className="card" style={{ maxWidth: 420, width: '100%', padding: '2rem', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔐</div>
            <h2 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '.75rem' }}>Función de suscriptores</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Publicar en la comunidad, responder RFQs y acceder al feed completo requiere un plan activo.
            </p>
            <a href="/precios" className="btn btn-primary" style={{ display: 'block', padding: '12px', fontSize: 14 }}>Ver planes de suscripción →</a>
            <button onClick={() => setShowPaywall(false)} className="btn btn-ghost" style={{ marginTop: 8, width: '100%', fontSize: 13 }}>Cerrar</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>

        {/* ── Main feed ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Header */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>🌐 Comunidad Global Nexus</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Productores mexicanos y compradores europeos conectando en tiempo real
            </p>
          </div>

          {/* Controls row */}
          <div style={{ display: 'flex', gap: 10, marginBottom: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Create post */}
            <button onClick={() => setShowPaywall(true)} className="btn btn-primary" style={{ fontSize: 13, padding: '8px 18px', flexShrink: 0 }}>
              ✍️ Publicar
            </button>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
              {[{ v: 'all', l: 'Todo' }, { v: 'update', l: '📢 Noticias' }, { v: 'photo', l: '📸 Fotos' }, { v: 'event', l: '📅 Eventos' }, { v: 'rfq', l: '🔍 Busco producto' }].map(f => (
                <button key={f.v} onClick={() => setFilter(f.v as typeof filter)}
                  style={{ padding: '7px 14px', borderRadius: 8, border: '1.5px solid', whiteSpace: 'nowrap', flexShrink: 0, fontSize: 12, fontWeight: 600, cursor: 'pointer', borderColor: filter === f.v ? 'var(--teal)' : 'var(--border)', background: filter === f.v ? 'var(--teal-light)' : 'transparent', color: filter === f.v ? 'var(--teal)' : 'var(--text-muted)' }}>
                  {f.l}
                </button>
              ))}
            </div>

            {/* Lang selector */}
            <select value={viewLang} onChange={e => setViewLang(e.target.value)}
              style={{ padding: '7px 10px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 12, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)', flexShrink: 0, cursor: 'pointer' }}>
              <option value="es">🇲🇽 ES</option>
              <option value="en">🇬🇧 EN</option>
              <option value="nl">🇳🇱 NL</option>
              <option value="de">🇩🇪 DE</option>
              <option value="fr">🇫🇷 FR</option>
            </select>
          </div>

          {/* Translation notice */}
          {viewLang !== 'es' && (
            <div style={{ background: 'var(--teal-light)', border: '1px solid #99F6E4', borderRadius: 8, padding: '8px 14px', marginBottom: '1rem', fontSize: 12, color: 'var(--teal-dark)', display: 'flex', alignItems: 'center', gap: 8 }}>
              🌐 <strong>Traducción automática activa</strong> — Todos los posts se muestran en {LANG_NAME[viewLang]}
            </div>
          )}

          {/* Posts */}
          {filtered.map(post => <PostCard key={post.id} post={post} viewLang={viewLang} />)}
        </div>

        {/* ── Sidebar ── */}
        <div className="hidden-mobile" style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: 80 }}>

          {/* Publish CTA */}
          <div style={{ background: 'linear-gradient(135deg, #0D9488, #1E3A5F)', borderRadius: 'var(--radius)', padding: '1.25rem', color: '#fff', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>📣</div>
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>¿Tienes algo que compartir?</div>
            <p style={{ fontSize: 12, opacity: .8, marginBottom: '1rem', lineHeight: 1.5 }}>
              Publica actualizaciones, eventos o busca proveedores en 5 idiomas simultáneamente.
            </p>
            <button onClick={() => setShowPaywall(true)} style={{ background: '#fff', color: 'var(--teal)', border: 'none', borderRadius: 8, padding: '9px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer', width: '100%' }}>
              Publicar ahora →
            </button>
            <div style={{ fontSize: 10, opacity: .6, marginTop: 8 }}>Requiere plan Pro o Comprador EU</div>
          </div>

          {/* Trending tags */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)' }}>🔥 Temas del momento</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {TRENDING_TAGS.map((tag, i) => (
                <div key={tag} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                  <span style={{ color: 'var(--teal)', fontWeight: 600, cursor: 'pointer' }}>{tag}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{Math.floor(Math.random() * 80 + 10)} posts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: '0.75rem' }}>📊 Comunidad</h3>
            {[
              { label: 'Miembros activos', value: '1,247' },
              { label: 'Posts esta semana', value: '89' },
              { label: 'RFQs publicados', value: '23' },
              { label: 'Conexiones realizadas', value: '156' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                <span style={{ fontWeight: 700, color: 'var(--teal)' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

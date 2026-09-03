import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'

interface Deal {
  id: string
  name: string; nameEn?: string; nameNl?: string; nameDe?: string
  producer: string
  state: string; flag: string; icon: string
  category: string; categoryEn?: string; categoryNl?: string; categoryDe?: string
  originalPrice: string; dealPrice: string; currency: string
  discount: number
  moq: string; moqEn?: string; moqNl?: string; moqDe?: string
  unit: string; unitEn?: string; unitNl?: string; unitDe?: string
  stock: number; maxStock: number
  expiresIn: number
  tags: string[]
  description: string; descEn?: string; descNl?: string; descDe?: string
  plan: 'pro' | 'all'
  hot: boolean
}

const INITIAL_DEALS: Deal[] = [
  {
    id: 'd1', name: 'Tequila Reposado Premium Extra Añejo',
    nameEn: 'Premium Extra Añejo Reposado Tequila', nameNl: 'Premium Extra Añejo Reposado Tequila', nameDe: 'Premium Extra Añejo Reposado Tequila',
    producer: 'Agave Azul del Highlands',
    state: 'Jalisco', flag: '🇲🇽', icon: '🥃', category: 'Bebidas', categoryEn: 'Beverages', categoryNl: 'Dranken', categoryDe: 'Getränke',
    originalPrice: '€28.50', dealPrice: '€16.90', currency: 'EUR',
    discount: 41, moq: '120 botellas', moqEn: '120 bottles', moqNl: '120 flessen', moqDe: '120 Flaschen',
    unit: 'botella', unitEn: 'bottle', unitNl: 'fles', unitDe: 'Flasche',
    stock: 38, maxStock: 120, expiresIn: 3 * 3600 + 24 * 60,
    tags: ['NOM-1119', 'DO Tequila', 'TLCUEM 0%'],
    description: 'Lote limitado de exportación. 18 meses en barrica de roble americano. Certificado DO Tequila para mercado EU.',
    descEn: 'Limited export batch. 18 months in American oak barrels. DO Tequila certified for EU market.',
    descNl: 'Beperkte exportpartij. 18 maanden op Amerikaanse eikenhouten vaten. DO Tequila gecertificeerd voor EU-markt.',
    descDe: 'Begrenzte Exportcharge. 18 Monate in amerikanischen Eichenfässern. DO Tequila zertifiziert für den EU-Markt.',
    plan: 'pro', hot: true,
  },
  {
    id: 'd2', name: 'Café Orgánico Altura Chiapas Gr.1',
    nameEn: 'Organic Highland Coffee Chiapas Gr.1', nameNl: 'Biologische Hooglandkoffie Chiapas Gr.1', nameDe: 'Bio Hochlandkaffee Chiapas Gr.1',
    producer: 'Cooperativa Sierra Madre',
    state: 'Chiapas', flag: '🇲🇽', icon: '☕', category: 'Alimentos', categoryEn: 'Food', categoryNl: 'Voeding', categoryDe: 'Lebensmittel',
    originalPrice: '€9.80', dealPrice: '€5.60', currency: 'EUR',
    discount: 43, moq: '500 kg', moqEn: '500 kg', moqNl: '500 kg', moqDe: '500 kg',
    unit: 'kg', unitEn: 'kg', unitNl: 'kg', unitDe: 'kg',
    stock: 12, maxStock: 50, expiresIn: 11 * 3600 + 45 * 60,
    tags: ['USDA Organic', 'Fair Trade', 'Altura 1600m'],
    description: 'Proceso lavado. Altitud 1,600 msnm. Certificaciones USDA Organic y Fair Trade. Ideal para tostadores especializados europeos.',
    descEn: 'Washed process. 1,600 m altitude. USDA Organic & Fair Trade certified. Ideal for specialty European roasters.',
    descNl: 'Gewassen proces. 1.600 m hoogte. USDA Organic & Fair Trade gecertificeerd. Ideaal voor Europese specialiteitenkoffiebranderijen.',
    descDe: 'Wäsche-Prozess. 1.600 m Höhe. USDA Organic & Fair Trade zertifiziert. Ideal für europäische Spezialitätenröstereien.',
    plan: 'all', hot: true,
  },
  {
    id: 'd3', name: 'Miel de Abeja Melipona Yucatán',
    nameEn: 'Melipona Bee Honey Yucatán', nameNl: 'Melipona Bijenhoning Yucatán', nameDe: 'Melipona-Honig Yucatán',
    producer: 'Apicultores Maya',
    state: 'Yucatán', flag: '🇲🇽', icon: '🍯', category: 'Alimentos', categoryEn: 'Food', categoryNl: 'Voeding', categoryDe: 'Lebensmittel',
    originalPrice: '€22.00', dealPrice: '€13.40', currency: 'EUR',
    discount: 39, moq: '200 frascos', moqEn: '200 jars', moqNl: '200 potten', moqDe: '200 Gläser',
    unit: 'frasco 500g', unitEn: 'jar 500g', unitNl: 'pot 500g', unitDe: 'Glas 500g',
    stock: 55, maxStock: 200, expiresIn: 47 * 3600,
    tags: ['IG Miel Maya', 'Patrimonio UNESCO', 'Sin pasteurizar'],
    description: 'Miel cruda de abeja melipona sin aguijón. Indicación Geográfica protegida. Producción patrimonial maya.',
    descEn: 'Raw stingless melipona bee honey. Protected Geographical Indication. Traditional Mayan production.',
    descNl: 'Rauwe stekelloze melipona bijenhoning. Beschermde geografische aanduiding. Traditionele Mayaproductie.',
    descDe: 'Roher stachelloser Melipona-Honig. Geschützte geografische Angabe. Traditionelle Maya-Produktion.',
    plan: 'all', hot: false,
  },
  {
    id: 'd4', name: 'Aceite de Jojoba Cold-Pressed Cosmético',
    nameEn: 'Cold-Pressed Cosmetic Jojoba Oil', nameNl: 'Koudgeperste Cosmetische Jojoba-olie', nameDe: 'Kaltgepresstes Kosmetisches Jojobaöl',
    producer: 'Jojoba del Sonora',
    state: 'Sonora', flag: '🇲🇽', icon: '🌿', category: 'Cosméticos', categoryEn: 'Cosmetics', categoryNl: 'Cosmetica', categoryDe: 'Kosmetik',
    originalPrice: '€34.00', dealPrice: '€19.50', currency: 'EUR',
    discount: 43, moq: '50 litros', moqEn: '50 liters', moqNl: '50 liter', moqDe: '50 Liter',
    unit: 'litro', unitEn: 'liter', unitNl: 'liter', unitDe: 'Liter',
    stock: 8, maxStock: 50, expiresIn: 5 * 3600 + 30 * 60,
    tags: ['ISO 9001', 'EU Cosmetics Reg.', 'Cold-Pressed'],
    description: 'Aceite grado cosmético prensado en frío. Cumple Reglamento EU 1223/2009. Documentación técnica EU completa.',
    descEn: 'Cold-pressed cosmetic grade oil. Complies with EU Regulation 1223/2009. Full EU technical documentation.',
    descNl: 'Koudgeperste cosmetische olie. Voldoet aan EU-verordening 1223/2009. Volledige EU technische documentatie.',
    descDe: 'Kaltgepresstes Kosmetiköl. Entspricht EU-Verordnung 1223/2009. Vollständige EU-technische Dokumentation.',
    plan: 'pro', hot: true,
  },
  {
    id: 'd5', name: 'Mezcal Artesanal Espadín-Tobalá 5L',
    nameEn: 'Artisanal Espadín-Tobalá Mezcal 5L', nameNl: 'Ambachtelijke Espadín-Tobalá Mezcal 5L', nameDe: 'Handwerklicher Espadín-Tobalá Mezcal 5L',
    producer: 'Destilería San Dionisio',
    state: 'Oaxaca', flag: '🇲🇽', icon: '🫙', category: 'Bebidas', categoryEn: 'Beverages', categoryNl: 'Dranken', categoryDe: 'Getränke',
    originalPrice: '€185.00', dealPrice: '€108.00', currency: 'EUR',
    discount: 42, moq: '24 unidades', moqEn: '24 units', moqNl: '24 eenheden', moqDe: '24 Einheiten',
    unit: 'garrafa 5L', unitEn: '5L jug', unitNl: '5L kan', unitDe: '5L Kanne',
    stock: 4, maxStock: 24, expiresIn: 22 * 3600,
    tags: ['CRM Mezcal', 'Artesanal', 'TLCUEM 0%'],
    description: 'Ensamble artesanal 70% espadín / 30% tobalá. Destilación en alambique de cobre. Certificado CRM para exportación.',
    descEn: 'Artisanal blend 70% espadín / 30% tobalá. Copper pot distilled. CRM certified for export.',
    descNl: 'Ambachtelijke blend 70% espadín / 30% tobalá. Gedestilleerd in koperen pot. CRM gecertificeerd voor export.',
    descDe: 'Handwerkliche Mischung 70% Espadín / 30% Tobalá. Im Kupferkessel destilliert. CRM-zertifiziert für den Export.',
    plan: 'pro', hot: false,
  },
  {
    id: 'd6', name: 'Extracto de Vainilla Premium Veracruz',
    nameEn: 'Premium Vanilla Extract Veracruz', nameNl: 'Premium Vanille-extract Veracruz', nameDe: 'Premium Vanilleextrakt Veracruz',
    producer: 'Vainilla Real',
    state: 'Veracruz', flag: '🇲🇽', icon: '🍶', category: 'Alimentos', categoryEn: 'Food', categoryNl: 'Voeding', categoryDe: 'Lebensmittel',
    originalPrice: '€18.50', dealPrice: '€10.90', currency: 'EUR',
    discount: 41, moq: '100 botellas', moqEn: '100 bottles', moqNl: '100 flessen', moqDe: '100 Flaschen',
    unit: 'botella 250ml', unitEn: 'bottle 250ml', unitNl: 'fles 250ml', unitDe: 'Flasche 250ml',
    stock: 67, maxStock: 100, expiresIn: 72 * 3600,
    tags: ['DO Vainilla MX', 'Sin colorantes', 'Gourmet EU'],
    description: 'Extracto puro con vainas de Papantla. Denominación de Origen. Libre de colorantes y aromas artificiales.',
    descEn: 'Pure extract with Papantla pods. Denomination of Origin. Free of colorants and artificial flavors.',
    descNl: 'Puur extract van Papantla peulen. Herkomstbenaming. Vrij van kleurstoffen en kunstmatige aroma\'s.',
    descDe: 'Reines Extrakt aus Papantla-Schoten. Ursprungsbezeichnung. Frei von Farbstoffen und künstlichen Aromen.',
    plan: 'all', hot: false,
  },
]

function useCountdown(initialSeconds: number) {
  const [secs, setSecs] = useState(initialSeconds)
  useEffect(() => {
    if (secs <= 0) return
    const t = setInterval(() => setSecs(s => s - 1), 1000)
    return () => clearInterval(t)
  }, [])
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

function DealTimer({ seconds }: { seconds: number }) {
  const time = useCountdown(seconds)
  const urgent = seconds < 2 * 3600
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: urgent ? '#DC2626' : '#D97706' }}>
      <span>⏱</span>
      <span style={{ fontFamily: 'monospace', letterSpacing: '.05em' }}>{time}</span>
    </div>
  )
}

function DealCard({ deal, isPremium }: { deal: Deal; isPremium: boolean }) {
  const { lang } = useLang()
  const stockPct = (deal.stock / deal.maxStock) * 100
  const locked = deal.plan === 'pro' && !isPremium

  const displayName = lang === 'nl' ? (deal.nameNl || deal.nameEn || deal.name)
    : lang === 'de' ? (deal.nameDe || deal.nameEn || deal.name)
    : lang === 'en' ? (deal.nameEn || deal.name)
    : deal.name
  const displayDesc = lang === 'nl' ? (deal.descNl || deal.descEn || deal.description)
    : lang === 'de' ? (deal.descDe || deal.descEn || deal.description)
    : lang === 'en' ? (deal.descEn || deal.description)
    : deal.description
  const displayUnit = lang === 'nl' ? (deal.unitNl || deal.unitEn || deal.unit)
    : lang === 'de' ? (deal.unitDe || deal.unitEn || deal.unit)
    : lang === 'en' ? (deal.unitEn || deal.unit)
    : deal.unit
  const displayMoq = lang === 'nl' ? (deal.moqNl || deal.moqEn || deal.moq)
    : lang === 'de' ? (deal.moqDe || deal.moqEn || deal.moq)
    : lang === 'en' ? (deal.moqEn || deal.moq)
    : deal.moq
  const displayCat = lang === 'nl' ? (deal.categoryNl || deal.category)
    : lang === 'de' ? (deal.categoryDe || deal.category)
    : lang === 'en' ? (deal.categoryEn || deal.category)
    : deal.category

  const unlockLabel = lang === 'nl' ? '🔐 Ontgrendelen met Pro Plan' : lang === 'de' ? '🔐 Mit Pro-Plan freischalten' : lang === 'en' ? '🔐 Unlock with Pro Plan' : '🔐 Desbloquear con Plan Pro'
  const requestLabel = lang === 'nl' ? 'Offerte aanvragen →' : lang === 'de' ? 'Angebot anfragen →' : lang === 'en' ? 'Request offer →' : 'Solicitar oferta →'
  const lockedLabel  = lang === 'nl' ? 'Alleen Pro plan' : lang === 'de' ? 'Nur Pro-Plan' : lang === 'en' ? 'Pro plan only' : 'Solo plan Pro'
  const stockLabel   = lang === 'nl' ? 'Beschikbaarheid' : lang === 'de' ? 'Verfügbarkeit' : lang === 'en' ? 'Availability' : 'Disponibilidad'
  const lowLabel     = lang === 'nl' ? '⚠ Weinig eenheden beschikbaar' : lang === 'de' ? '⚠ Nur wenige Einheiten verfügbar' : lang === 'en' ? '⚠ Low stock' : '⚠ Pocas unidades disponibles'

  return (
    <div className="card" style={{ overflow: 'hidden', position: 'relative', opacity: locked ? .85 : 1 }}>
      {/* Hot badge */}
      {deal.hot && (
        <div style={{ position: 'absolute', top: 12, left: 12, background: '#DC2626', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 100, zIndex: 2 }}>
          🔥 HOT
        </div>
      )}

      {/* Discount badge */}
      <div style={{ position: 'absolute', top: 12, right: 12, background: '#16A34A', color: '#fff', fontSize: 12, fontWeight: 800, padding: '4px 10px', borderRadius: 100, zIndex: 2 }}>
        -{deal.discount}%
      </div>

      {/* Thumbnail */}
      <div style={{ height: 130, background: 'linear-gradient(135deg, var(--teal-light), var(--navy-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', borderBottom: '1px solid var(--border)', position: 'relative' }}>
        {deal.icon}
        {locked && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: '1.5rem' }}>🔐</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--navy)' }}>{lockedLabel}</span>
          </div>
        )}
      </div>

      <div style={{ padding: '1rem' }}>
        {/* Category + timer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{deal.flag} {deal.state} · {displayCat}</span>
          <DealTimer seconds={deal.expiresIn} />
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, lineHeight: 1.4 }}>{displayName}</h3>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{deal.producer}</div>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 10 }}>{displayDesc}</p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
          {deal.tags.map(t => <span key={t} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, background: 'var(--teal-light)', color: 'var(--teal-dark)', fontWeight: 600 }}>{t}</span>)}
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#16A34A' }}>{deal.dealPrice}</span>
          <span style={{ fontSize: 13, textDecoration: 'line-through', color: 'var(--text-muted)' }}>{deal.originalPrice}</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>/ {displayUnit}</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>MOQ: {displayMoq}</div>

        {/* Stock bar */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
            <span style={{ color: 'var(--text-muted)' }}>{stockLabel}</span>
            <span style={{ fontWeight: 700, color: stockPct < 30 ? '#DC2626' : 'var(--text-muted)' }}>
              {deal.stock}/{deal.maxStock} {displayUnit}
            </span>
          </div>
          <div style={{ height: 6, background: 'var(--surface2)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${stockPct}%`, height: '100%', background: stockPct < 30 ? '#DC2626' : '#16A34A', borderRadius: 3, transition: 'width .5s' }} />
          </div>
          {stockPct < 30 && <div style={{ fontSize: 10, color: '#DC2626', fontWeight: 600, marginTop: 3 }}>{lowLabel}</div>}
        </div>

        {locked ? (
          <Link to="/precios" className="btn btn-primary" style={{ width: '100%', fontSize: 13, display: 'block', textAlign: 'center' }}>
            {unlockLabel}
          </Link>
        ) : (
          <button className="btn btn-primary" style={{ width: '100%', fontSize: 13 }}>
            {requestLabel}
          </button>
        )}
      </div>
    </div>
  )
}

export default function DealsPage() {
  const { lang } = useLang()
  const [cat, setCat] = useState('all')
  const [sort, setSort] = useState('hot')
  const isPremium = false

  const L = {
    title:    lang==='nl'?'Hete Aanbiedingsprijzen':lang==='de'?'Heiße Sonderangebote':lang==='en'?'Hot Deal Prices':'Precios Calientes de Oportunidad',
    subtitle: lang==='nl'?'Beperkte partijen van geverifieerde producenten tegen directe exportprijzen. Echte kortingen van 30-50% met beperkte beschikbaarheid.'
             :lang==='de'?'Begrenzte Chargen von verifizierten Produzenten zu direkten Exportpreisen. Echte Rabatte von 30-50% bei begrenzter Verfügbarkeit.'
             :lang==='en'?'Limited batches from verified producers at direct export prices. Real 30-50% discounts with limited-time availability.'
             :'Lotes limitados de productores verificados a precios de exportación directa. Descuentos reales del 30-50% con disponibilidad por tiempo limitado.',
    badges: lang==='nl'
      ? [{icon:'✓',t:'TLCUEM 0% tarieven'},{icon:'⚡',t:'Beperkte voorraad'},{icon:'🌐',t:'CIF Rotterdam / Hamburg'}]
      : lang==='de'
      ? [{icon:'✓',t:'TLCUEM 0% Zölle'},{icon:'⚡',t:'Begrenzte Menge'},{icon:'🌐',t:'CIF Rotterdam / Hamburg'}]
      : lang==='en'
      ? [{icon:'✓',t:'TLCUEM 0% tariffs'},{icon:'⚡',t:'Limited stock'},{icon:'🌐',t:'CIF Rotterdam / Hamburg delivery'}]
      : [{icon:'✓',t:'TLCUEM 0% aranceles'},{icon:'⚡',t:'Stock limitado'},{icon:'🌐',t:'Entrega CIF Rotterdam / Hamburgo'}],
    proTitle: lang==='nl'?'Exclusieve aanbiedingen voor Pro-abonnees':lang==='de'?'Exklusive Angebote für Pro-Abonnenten':lang==='en'?'Exclusive deals for Pro subscribers':'Ofertas exclusivas para suscriptores Pro',
    proDesc:  lang==='nl'?'Die gemarkeerd met 🔐 vereisen een Pro-plan. De rest is voor iedereen beschikbaar.':lang==='de'?'Die mit 🔐 markierten erfordern einen Pro-Plan. Die anderen sind für alle verfügbar.':lang==='en'?'Those marked 🔐 require Pro plan. The rest are available to everyone.':'Las marcadas con 🔐 requieren plan Pro. Las demás están disponibles para todos.',
    seePlans: lang==='nl'?'Plannen bekijken →':lang==='de'?'Pläne ansehen →':lang==='en'?'See plans →':'Ver planes →',
    allCats:  lang==='nl'?'Alle categorieën':lang==='de'?'Alle Kategorien':lang==='en'?'All categories':'Todas las categorías',
    catMap:   {Bebidas: lang==='nl'?'Dranken':lang==='de'?'Getränke':lang==='en'?'Beverages':'Bebidas', Alimentos: lang==='nl'?'Voeding':lang==='de'?'Lebensmittel':lang==='en'?'Food':'Alimentos', Cosméticos: lang==='nl'?'Cosmetica':lang==='de'?'Kosmetik':lang==='en'?'Cosmetics':'Cosméticos'} as Record<string,string>,
    sortOpts: lang==='nl'
      ? [{v:'hot',l:'🔥 Populairste'},{v:'discount',l:'📉 Grootste korting'},{v:'expiry',l:'⏱ Minste tijd'}]
      : lang==='de'
      ? [{v:'hot',l:'🔥 Beliebteste'},{v:'discount',l:'📉 Größter Rabatt'},{v:'expiry',l:'⏱ Wenigste Zeit'}]
      : lang==='en'
      ? [{v:'hot',l:'🔥 Most popular'},{v:'discount',l:'📉 Biggest discount'},{v:'expiry',l:'⏱ Expiring soon'}]
      : [{v:'hot',l:'🔥 Más populares'},{v:'discount',l:'📉 Mayor descuento'},{v:'expiry',l:'⏱ Menos tiempo'}],
    counter:  lang==='nl'?'actieve aanbiedingen · elke 48u bijgewerkt':lang==='de'?'aktive Angebote · alle 48h aktualisiert':lang==='en'?'active deals · updated every 48h':'ofertas activas · Se actualizan cada 48h',
    ctaTitle: lang==='nl'?'Ben jij een producent met exportvoorraad?':lang==='de'?'Bist du Produzent mit Exportware?':lang==='en'?'Are you a producer with export stock?':'¿Eres productor y tienes stock para exportar?',
    ctaDesc:  lang==='nl'?'Publiceer je speciale partijaaanbiedingen en bereik geverifieerde Europese kopers rechtstreeks.':lang==='de'?'Veröffentliche deine Sonderpartienangebote und erreiche direkt verifizierte europäische Käufer.':lang==='en'?'Publish your special batch offers and reach verified European buyers directly.':'Publica tus ofertas de lotes especiales y llega directamente a compradores europeos verificados.',
    ctaBtn:   lang==='nl'?'Mijn aanbiedingen publiceren →':lang==='de'?'Meine Angebote veröffentlichen →':lang==='en'?'Publish my offers →':'Publicar mis ofertas →',
  }

  const categories = ['all', 'Bebidas', 'Alimentos', 'Cosméticos']
  const filtered = INITIAL_DEALS
    .filter(d => cat === 'all' || d.category === cat)
    .sort((a, b) => {
      if (sort === 'hot') return (b.hot ? 1 : 0) - (a.hot ? 1 : 0) || b.discount - a.discount
      if (sort === 'discount') return b.discount - a.discount
      if (sort === 'expiry') return a.expiresIn - b.expiresIn
      return 0
    })

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #7F1D1D, #991B1B, #DC2626)', borderRadius: 'var(--radius)', padding: 'clamp(1.25rem,3vw,2rem)', color: '#fff', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -20, top: -20, fontSize: '8rem', opacity: .08 }}>🔥</div>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 'clamp(1.5rem,4vw,2rem)' }}>🔥</span>
            <h1 style={{ fontSize: 'clamp(1.2rem,3vw,1.75rem)', fontWeight: 800 }}>{L.title}</h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 'clamp(13px,2vw,14px)', lineHeight: 1.6, maxWidth: 580, marginBottom: '1rem' }}>{L.subtitle}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {L.badges.map(b => (
              <span key={b.t} style={{ fontSize: 12, color: 'rgba(255,255,255,.9)', background: 'rgba(255,255,255,.15)', padding: '4px 12px', borderRadius: 100, display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                <span>{b.icon}</span>{b.t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Premium banner */}
      {!isPremium && (
        <div style={{ background: 'var(--navy-light)', border: '1px solid #BFDBFE', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1.5rem' }}>🔐</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)', marginBottom: 2 }}>{L.proTitle}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{L.proDesc}</div>
          </div>
          <Link to="/precios" className="btn btn-primary" style={{ fontSize: 13, padding: '8px 18px', flexShrink: 0 }}>{L.seePlans}</Link>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding: '7px 16px', borderRadius: 8, border: '1.5px solid', whiteSpace: 'nowrap', flexShrink: 0, fontSize: 13, fontWeight: 600, cursor: 'pointer', borderColor: cat === c ? 'var(--teal)' : 'var(--border)', background: cat === c ? 'var(--teal-light)' : 'transparent', color: cat === c ? 'var(--teal)' : 'var(--text-muted)' }}>
              {c === 'all' ? L.allCats : (L.catMap[c] || c)}
            </button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ padding: '7px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)', flexShrink: 0 }}>
          {L.sortOpts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      </div>

      {/* Counter */}
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
        <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> {L.counter}
      </div>

      {/* Grid */}
      <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem' }}>
        {filtered.map(d => <DealCard key={d.id} deal={d} isPremium={isPremium} />)}
      </div>

      {/* Bottom CTA */}
      <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
        <div style={{ fontSize: '2rem', marginBottom: 10 }}>📦</div>
        <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 8 }}>{L.ctaTitle}</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 440, margin: '0 auto 1.25rem', lineHeight: 1.6 }}>{L.ctaDesc}</p>
        <Link to="/precios" className="btn btn-primary" style={{ fontSize: 14, padding: '11px 28px' }}>{L.ctaBtn}</Link>
      </div>
    </div>
  )
}

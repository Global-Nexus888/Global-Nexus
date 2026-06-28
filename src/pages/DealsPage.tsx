import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Deal {
  id: string
  name: string
  producer: string
  state: string
  flag: string
  icon: string
  category: string
  originalPrice: string
  dealPrice: string
  currency: string
  discount: number
  moq: string
  unit: string
  stock: number
  maxStock: number
  expiresIn: number  // seconds remaining
  tags: string[]
  description: string
  plan: 'pro' | 'all'
  hot: boolean
}

const INITIAL_DEALS: Deal[] = [
  {
    id: 'd1', name: 'Tequila Reposado Premium Extra Añejo', producer: 'Agave Azul del Highlands',
    state: 'Jalisco', flag: '🇲🇽', icon: '🥃', category: 'Bebidas',
    originalPrice: '€28.50', dealPrice: '€16.90', currency: 'EUR',
    discount: 41, moq: '120 botellas', unit: 'botella', stock: 38, maxStock: 120,
    expiresIn: 3 * 3600 + 24 * 60,
    tags: ['NOM-1119', 'DO Tequila', 'TLCUEM 0%'],
    description: 'Lote limitado de exportación. 18 meses en barrica de roble americano. Certificado DO Tequila para mercado EU.',
    plan: 'pro', hot: true,
  },
  {
    id: 'd2', name: 'Café Orgánico Altura Chiapas Gr.1', producer: 'Cooperativa Sierra Madre',
    state: 'Chiapas', flag: '🇲🇽', icon: '☕', category: 'Alimentos',
    originalPrice: '€9.80', dealPrice: '€5.60', currency: 'EUR',
    discount: 43, moq: '500 kg', unit: 'kg', stock: 12, maxStock: 50,
    expiresIn: 11 * 3600 + 45 * 60,
    tags: ['USDA Organic', 'Fair Trade', 'Altura 1600m'],
    description: 'Proceso lavado. Altitud 1,600 msnm. Certificaciones USDA Organic y Fair Trade. Ideal para tostadores especializados europeos.',
    plan: 'all', hot: true,
  },
  {
    id: 'd3', name: 'Miel de Abeja Melipona Yucatán', producer: 'Apicultores Maya',
    state: 'Yucatán', flag: '🇲🇽', icon: '🍯', category: 'Alimentos',
    originalPrice: '€22.00', dealPrice: '€13.40', currency: 'EUR',
    discount: 39, moq: '200 frascos', unit: 'frasco 500g', stock: 55, maxStock: 200,
    expiresIn: 47 * 3600,
    tags: ['IG Miel Maya', 'Patrimonio UNESCO', 'Sin pasteurizar'],
    description: 'Miel cruda de abeja melipona sin aguijón. Indicación Geográfica protegida. Producción patrimonial maya.',
    plan: 'all', hot: false,
  },
  {
    id: 'd4', name: 'Aceite de Jojoba Cold-Pressed Cosmético', producer: 'Jojoba del Sonora',
    state: 'Sonora', flag: '🇲🇽', icon: '🌿', category: 'Cosméticos',
    originalPrice: '€34.00', dealPrice: '€19.50', currency: 'EUR',
    discount: 43, moq: '50 litros', unit: 'litro', stock: 8, maxStock: 50,
    expiresIn: 5 * 3600 + 30 * 60,
    tags: ['ISO 9001', 'EU Cosmetics Reg.', 'Cold-Pressed'],
    description: 'Aceite grado cosmético prensado en frío. Cumple Reglamento EU 1223/2009. Documentación técnica EU completa.',
    plan: 'pro', hot: true,
  },
  {
    id: 'd5', name: 'Mezcal Artesanal Espadín-Tobalá 5L', producer: 'Destilería San Dionisio',
    state: 'Oaxaca', flag: '🇲🇽', icon: '🫙', category: 'Bebidas',
    originalPrice: '€185.00', dealPrice: '€108.00', currency: 'EUR',
    discount: 42, moq: '24 unidades', unit: 'garrafa 5L', stock: 4, maxStock: 24,
    expiresIn: 22 * 3600,
    tags: ['CRM Mezcal', 'Artesanal', 'TLCUEM 0%'],
    description: 'Ensamble artesanal 70% espadín / 30% tobalá. Destilación en alambique de cobre. Certificado CRM para exportación.',
    plan: 'pro', hot: false,
  },
  {
    id: 'd6', name: 'Extracto de Vainilla Premium Veracruz', producer: 'Vainilla Real',
    state: 'Veracruz', flag: '🇲🇽', icon: '🍶', category: 'Alimentos',
    originalPrice: '€18.50', dealPrice: '€10.90', currency: 'EUR',
    discount: 41, moq: '100 botellas', unit: 'botella 250ml', stock: 67, maxStock: 100,
    expiresIn: 72 * 3600,
    tags: ['DO Vainilla MX', 'Sin colorantes', 'Gourmet EU'],
    description: 'Extracto puro con vainas de Papantla. Denominación de Origen. Libre de colorantes y aromas artificiales.',
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
  const stockPct = (deal.stock / deal.maxStock) * 100
  const locked = deal.plan === 'pro' && !isPremium

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
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--navy)' }}>Solo plan Pro</span>
          </div>
        )}
      </div>

      <div style={{ padding: '1rem' }}>
        {/* Category + timer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{deal.flag} {deal.state} · {deal.category}</span>
          <DealTimer seconds={deal.expiresIn} />
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, lineHeight: 1.4 }}>{deal.name}</h3>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{deal.producer}</div>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 10 }}>{deal.description}</p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
          {deal.tags.map(t => <span key={t} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, background: 'var(--teal-light)', color: 'var(--teal-dark)', fontWeight: 600 }}>{t}</span>)}
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#16A34A' }}>{deal.dealPrice}</span>
          <span style={{ fontSize: 13, textDecoration: 'line-through', color: 'var(--text-muted)' }}>{deal.originalPrice}</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>/ {deal.unit}</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>MOQ: {deal.moq}</div>

        {/* Stock bar */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
            <span style={{ color: 'var(--text-muted)' }}>Disponibilidad</span>
            <span style={{ fontWeight: 700, color: stockPct < 30 ? '#DC2626' : 'var(--text-muted)' }}>
              {deal.stock}/{deal.maxStock} {deal.unit}s
            </span>
          </div>
          <div style={{ height: 6, background: 'var(--surface2)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${stockPct}%`, height: '100%', background: stockPct < 30 ? '#DC2626' : '#16A34A', borderRadius: 3, transition: 'width .5s' }} />
          </div>
          {stockPct < 30 && <div style={{ fontSize: 10, color: '#DC2626', fontWeight: 600, marginTop: 3 }}>⚠ Pocas unidades disponibles</div>}
        </div>

        {locked ? (
          <Link to="/precios" className="btn btn-primary" style={{ width: '100%', fontSize: 13, display: 'block', textAlign: 'center' }}>
            🔐 Desbloquear con Plan Pro
          </Link>
        ) : (
          <button className="btn btn-primary" style={{ width: '100%', fontSize: 13 }}>
            Solicitar oferta →
          </button>
        )}
      </div>
    </div>
  )
}

export default function DealsPage() {
  const [cat, setCat] = useState('all')
  const [sort, setSort] = useState('hot')
  const isPremium = false  // TODO: conectar con auth

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
            <h1 style={{ fontSize: 'clamp(1.2rem,3vw,1.75rem)', fontWeight: 800 }}>Precios Calientes de Oportunidad</h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 'clamp(13px,2vw,14px)', lineHeight: 1.6, maxWidth: 580, marginBottom: '1rem' }}>
            Lotes limitados de productores verificados a precios de exportación directa.
            Descuentos reales del 30-50% con disponibilidad por tiempo limitado.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[{ icon: '✓', t: 'TLCUEM 0% aranceles' }, { icon: '⚡', t: 'Stock limitado' }, { icon: '🌐', t: 'Entrega CIF Rotterdam / Hamburgo' }].map(b => (
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
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)', marginBottom: 2 }}>Ofertas exclusivas para suscriptores Pro</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Las marcadas con 🔐 requieren plan Pro. Las demás están disponibles para todos.</div>
          </div>
          <Link to="/precios" className="btn btn-primary" style={{ fontSize: 13, padding: '8px 18px', flexShrink: 0 }}>Ver planes →</Link>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding: '7px 16px', borderRadius: 8, border: '1.5px solid', whiteSpace: 'nowrap', flexShrink: 0, fontSize: 13, fontWeight: 600, cursor: 'pointer', borderColor: cat === c ? 'var(--teal)' : 'var(--border)', background: cat === c ? 'var(--teal-light)' : 'transparent', color: cat === c ? 'var(--teal)' : 'var(--text-muted)' }}>
              {c === 'all' ? 'Todas las categorías' : c}
            </button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ padding: '7px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)', flexShrink: 0 }}>
          <option value="hot">🔥 Más populares</option>
          <option value="discount">📉 Mayor descuento</option>
          <option value="expiry">⏱ Menos tiempo</option>
        </select>
      </div>

      {/* Counter */}
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
        <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> ofertas activas · Se actualizan cada 48h
      </div>

      {/* Grid */}
      <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem' }}>
        {filtered.map(d => <DealCard key={d.id} deal={d} isPremium={isPremium} />)}
      </div>

      {/* Bottom CTA */}
      <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
        <div style={{ fontSize: '2rem', marginBottom: 10 }}>📦</div>
        <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 8 }}>¿Eres productor y tienes stock para exportar?</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 440, margin: '0 auto 1.25rem', lineHeight: 1.6 }}>
          Publica tus ofertas de lotes especiales y llega directamente a compradores europeos verificados.
        </p>
        <Link to="/precios" className="btn btn-primary" style={{ fontSize: 14, padding: '11px 28px' }}>
          Publicar mis ofertas →
        </Link>
      </div>
    </div>
  )
}

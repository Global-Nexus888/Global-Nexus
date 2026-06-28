import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PRODUCTS, PRODUCERS } from '../lib/data'
import ProductCard from '../components/ProductCard'
import ProducerCard from '../components/ProducerCard'

const METRICS = [
  { value: '0%',   label: 'Aranceles TLCUEM',    icon: '📋', color: 'var(--green)' },
  { value: '450M', label: 'Consumidores EU',       icon: '🇪🇺', color: 'var(--navy)' },
  { value: '+800', label: 'Productores activos',   icon: '🏭', color: 'var(--teal)' },
  { value: '27',   label: 'Países compradores',    icon: '🌍', color: 'var(--gold)' },
]

const HOW_IT_WORKS = [
  { step: '01', icon: '📝', title: 'Regístrate gratis', desc: 'Crea tu perfil como productor mexicano o comprador europeo en menos de 5 minutos.' },
  { step: '02', icon: '🔍', title: 'Explora el catálogo', desc: 'Navega 800+ productos verificados. Filtra por categoría, certificación y región.' },
  { step: '03', icon: '💬', title: 'Conecta directamente', desc: 'Mensajería bilingüe integrada. Sin intermediarios, sin comisiones ocultas.' },
  { step: '04', icon: '🚢', title: 'Exporta sin fricción', desc: 'Logística desde Puerto Veracruz con documentación TLCUEM gestionada por nosotros.' },
]

const CATEGORIES = [
  { value: 'bebidas',      icon: '🥃', label: 'Bebidas espirituosas',  count: 48 },
  { value: 'agricultura',  icon: '🌾', label: 'Agricultura y alimentos', count: 213 },
  { value: 'artesanias',   icon: '🧵', label: 'Artesanías y textiles', count: 87 },
  { value: 'cosmeticos',   icon: '🌿', label: 'Cosméticos naturales',  count: 64 },
  { value: 'farmaceutico', icon: '🌱', label: 'Farmacéutico / Herbolaria', count: 52 },
]

export default function Home() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/catalogo?q=${encodeURIComponent(search)}`)
  }

  const trending = PRODUCTS.filter(p => p.trending)
  const featuredProducers = PRODUCERS.filter(p => p.verified).slice(0, 3)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(160deg, #0F172A 0%, #1E3A5F 50%, #0D4A42 100%)',
        color: '#fff', padding: 'clamp(2.5rem,6vw,5rem) 1.25rem clamp(2rem,5vw,4rem)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(13,148,136,.25) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(30,58,95,.4) 0%, transparent 50%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          {/* Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <span style={{
              background: 'rgba(13,148,136,.2)', border: '1px solid rgba(13,148,136,.4)',
              color: '#5EEAD4', padding: '5px 14px', borderRadius: 100,
              fontSize: 'clamp(11px,2.5vw,13px)', fontWeight: 600, textAlign: 'center',
            }}>
              ✓ Plataforma oficial TLCUEM · Acuerdo México–UE
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(1.75rem, 6vw, 3.5rem)', fontWeight: 800, textAlign: 'center',
            lineHeight: 1.15, letterSpacing: '-.02em', marginBottom: '1rem',
          }}>
            Conectamos <span style={{ color: '#5EEAD4' }}>México</span> con{' '}
            <span style={{ color: '#93C5FD' }}>Europa</span>
            <br />Sin aranceles. En tiempo real.
          </h1>

          <p style={{
            textAlign: 'center', color: 'rgba(255,255,255,.7)',
            fontSize: 'clamp(.9rem, 2.5vw, 1.05rem)', maxWidth: 560,
            margin: '0 auto 2rem', lineHeight: 1.7,
          }}>
            La plataforma B2B que conecta productores mexicanos certificados con compradores europeos aprovechando el acuerdo TLCUEM.
          </p>

          {/* Search — stacks on mobile */}
          <form onSubmit={handleSearch} style={{ maxWidth: 620, margin: '0 auto 1rem' }}>
            <div className="hero-search">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Busca producto o productor (tequila, café, miel...)"
                style={{
                  flex: 1, padding: '14px 16px', fontSize: '14px',
                  background: 'rgba(255,255,255,.96)', border: 'none', outline: 'none',
                  color: 'var(--text)', width: '100%',
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: 0, padding: '14px 22px', fontSize: '14px', whiteSpace: 'nowrap' }}>
                🔍 Buscar
              </button>
            </div>
          </form>

          {/* Hints — scroll horizontal on mobile */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', padding: '0 .5rem' }}>
            {['Tequila', 'Café orgánico', 'Miel', 'Mezcal', 'Artesanías'].map(hint => (
              <button key={hint} onClick={() => navigate(`/catalogo?q=${hint}`)}
                style={{ background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', color: 'rgba(255,255,255,.8)', padding: '5px 12px', borderRadius: 100, fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >{hint}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
        <div className="metrics-grid" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.25rem', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {METRICS.map((m, i) => (
            <div key={i} style={{
              padding: 'clamp(.9rem,2vw,1.5rem) .75rem', textAlign: 'center',
              borderRight: i < METRICS.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ fontSize: 'clamp(1.1rem,3vw,1.5rem)', marginBottom: 4 }}>{m.icon}</div>
              <div style={{ fontSize: 'clamp(1.4rem,3vw,2.2rem)', fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.value}</div>
              <div style={{ fontSize: 'clamp(10px,2vw,12px)', color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(1.5rem,4vw,3rem) 1.25rem', flex: 1, width: '100%', boxSizing: 'border-box' }}>

        {/* ── CATEGORIES ── */}
        <section style={{ marginBottom: 'clamp(2rem,5vw,3.5rem)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: 'clamp(1rem,3vw,1.25rem)', fontWeight: 700 }}>Explorar por categoría</h2>
            <Link to="/catalogo" style={{ fontSize: '13px', color: 'var(--teal)', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 12 }}>Ver todo →</Link>
          </div>
          {/* Scroll horizontal en móvil */}
          <div className="cat-scroll-wrap">
            <div className="home-cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px' }}>
              {CATEGORIES.map(cat => (
                <Link key={cat.value} to={`/catalogo?categoria=${cat.value}`} style={{ textDecoration: 'none' }}>
                  <div className="card cat-card" style={{ padding: 'clamp(.75rem,2vw,1.25rem)', textAlign: 'center', cursor: 'pointer' }}>
                    <div style={{ fontSize: 'clamp(1.4rem,4vw,2rem)', marginBottom: 6 }}>{cat.icon}</div>
                    <div style={{ fontSize: 'clamp(11px,2vw,13px)', fontWeight: 600, color: 'var(--text)', marginBottom: 3, lineHeight: 1.3 }}>{cat.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{cat.count} prod.</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRENDING PRODUCTS ── */}
        <section style={{ marginBottom: 'clamp(2rem,5vw,3.5rem)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1rem,3vw,1.25rem)', fontWeight: 700 }}>🔥 Productos en tendencia</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>Los más solicitados por compradores europeos esta semana</p>
            </div>
            <Link to="/catalogo" style={{ fontSize: '13px', color: 'var(--teal)', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 12 }}>Ver catálogo →</Link>
          </div>
          {/* Cards en scroll horizontal en móvil */}
          <div className="product-scroll-wrap">
            <div className="home-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: '1rem' }}>
              {trending.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ marginBottom: 'clamp(2rem,5vw,3.5rem)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 'clamp(1.25rem,3vw,2rem)' }}>
          <h2 style={{ fontSize: 'clamp(1rem,3vw,1.25rem)', fontWeight: 700, marginBottom: '.5rem', textAlign: 'center' }}>Cómo funciona</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.5rem' }}>
            De productor a comprador europeo en 4 pasos
          </p>
          <div className="how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--teal-light)', border: '2px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', margin: '0 auto 10px' }}>
                  {step.icon}
                </div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--teal)', letterSpacing: '.06em', marginBottom: 4 }}>PASO {step.step}</div>
                <div style={{ fontSize: 'clamp(12px,2vw,14px)', fontWeight: 700, marginBottom: 5 }}>{step.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURED PRODUCERS ── */}
        <section style={{ marginBottom: 'clamp(2rem,5vw,3.5rem)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1rem,3vw,1.25rem)', fontWeight: 700 }}>Productores verificados</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>Empresas con certificaciones validadas y historial de exportación</p>
            </div>
            <Link to="/productores" style={{ fontSize: '13px', color: 'var(--teal)', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 12 }}>Ver todos →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {featuredProducers.map(p => <ProducerCard key={p.id} producer={p} />)}
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section style={{
          background: 'linear-gradient(135deg, #0F172A, #1E3A5F)',
          borderRadius: 'var(--radius)', padding: 'clamp(1.5rem,4vw,2.5rem)', textAlign: 'center', color: '#fff',
        }}>
          <h2 style={{ fontSize: 'clamp(1.1rem,3vw,1.5rem)', fontWeight: 800, marginBottom: '.75rem' }}>
            ¿Eres productor mexicano?
          </h2>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 'clamp(13px,2vw,14px)', marginBottom: '1.5rem', maxWidth: 480, margin: '0 auto 1.5rem', lineHeight: 1.65 }}>
            Publica tus productos y conecta con compradores en 27 países europeos. Sin comisiones por transacción. Sin intermediarios.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/registro" className="btn btn-primary" style={{ padding: '11px 24px', fontSize: 'clamp(13px,2vw,14px)' }}>
              Publicar mis productos gratis
            </Link>
            <Link to="/como-funciona" className="btn" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', border: '1px solid rgba(255,255,255,.25)', padding: '11px 24px', fontSize: 'clamp(13px,2vw,14px)' }}>
              Ver cómo funciona
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}

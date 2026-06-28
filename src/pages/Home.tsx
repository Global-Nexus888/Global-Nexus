import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PRODUCTS, PRODUCERS } from '../lib/data'
import ProductCard from '../components/ProductCard'
import ProducerCard from '../components/ProducerCard'

const METRICS = [
  { value: '0%', label: 'Aranceles TLCUEM', icon: '📋', color: 'var(--green)' },
  { value: '450M', label: 'Consumidores EU', icon: '🇪🇺', color: 'var(--navy)' },
  { value: '+800', label: 'Productores activos', icon: '🏭', color: 'var(--teal)' },
  { value: '27', label: 'Países compradores', icon: '🌍', color: 'var(--gold)' },
]

const HOW_IT_WORKS = [
  { step: '01', icon: '📝', title: 'Regístrate gratis', desc: 'Crea tu perfil como productor mexicano o comprador europeo en menos de 5 minutos.' },
  { step: '02', icon: '🔍', title: 'Explora el catálogo', desc: 'Navega 800+ productos verificados. Filtra por categoría, certificación y región.' },
  { step: '03', icon: '💬', title: 'Conecta directamente', desc: 'Mensajería bilingüe integrada. Sin intermediarios, sin comisiones ocultas.' },
  { step: '04', icon: '🚢', title: 'Exporta sin fricción', desc: 'Logística desde Puerto Veracruz con documentación TLCUEM gestionada por nosotros.' },
]

const CATEGORIES = [
  { value: 'bebidas', icon: '🥃', label: 'Bebidas espirituosas', count: 48 },
  { value: 'agricultura', icon: '🌾', label: 'Agricultura y alimentos', count: 213 },
  { value: 'artesanias', icon: '🧵', label: 'Artesanías y textiles', count: 87 },
  { value: 'cosmeticos', icon: '🌿', label: 'Cosméticos naturales', count: 64 },
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(160deg, #0F172A 0%, #1E3A5F 50%, #0D4A42 100%)',
        color: '#fff', padding: '5rem 1.5rem 4rem', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(13,148,136,.25) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(30,58,95,.4) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(13,148,136,.08)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          {/* Top badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <span style={{
              background: 'rgba(13,148,136,.2)', border: '1px solid rgba(13,148,136,.4)',
              color: '#5EEAD4', padding: '6px 16px', borderRadius: 100,
              fontSize: '13px', fontWeight: 600, letterSpacing: '.02em',
            }}>
              ✓ Plataforma oficial TLCUEM · Acuerdo México–Unión Europea
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, textAlign: 'center',
            lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: '1.25rem',
          }}>
            Conectamos <span style={{ color: '#5EEAD4' }}>México</span> con{' '}
            <span style={{ color: '#93C5FD' }}>Europa</span>
            <br />Sin aranceles. En tiempo real.
          </h1>

          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,.7)', fontSize: 'clamp(.95rem, 2vw, 1.1rem)', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            La plataforma B2B que conecta productores mexicanos certificados con compradores europeos aprovechando el acuerdo de libre comercio TLCUEM.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ maxWidth: 640, margin: '0 auto 1rem', display: 'flex', gap: 0, boxShadow: '0 8px 32px rgba(0,0,0,.3)', borderRadius: 12, overflow: 'hidden' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Busca producto o productor (tequila, café, miel...)"
              style={{
                flex: 1, padding: '16px 20px', fontSize: '15px',
                background: 'rgba(255,255,255,.96)', border: 'none', outline: 'none', color: 'var(--text)',
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: 0, padding: '16px 28px', fontSize: '15px' }}>
              🔍 Buscar
            </button>
          </form>

          {/* Search hints */}
          <div style={{ textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Tequila', 'Café orgánico', 'Miel', 'Mezcal', 'Artesanías'].map(hint => (
              <button key={hint} onClick={() => navigate(`/catalogo?q=${hint}`)}
                style={{ background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', color: 'rgba(255,255,255,.8)', padding: '5px 12px', borderRadius: 100, fontSize: '12px', cursor: 'pointer', transition: 'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.22)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.12)' }}
              >{hint}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {METRICS.map((m, i) => (
            <div key={i} style={{
              padding: '1.5rem 1rem', textAlign: 'center',
              borderRight: i < METRICS.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{m.icon}</div>
              <div style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem', flex: 1, width: '100%' }}>

        {/* ── CATEGORIES ── */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Explorar por categoría</h2>
            <Link to="/catalogo" style={{ fontSize: '13px', color: 'var(--teal)', fontWeight: 600 }}>Ver todo →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.value} to={`/catalogo?categoria=${cat.value}`}
                style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '1.25rem', textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>{cat.icon}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{cat.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{cat.count} productos</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── TRENDING PRODUCTS ── */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>🔥 Productos en tendencia</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: 2 }}>Los más solicitados por compradores europeos esta semana</p>
            </div>
            <Link to="/catalogo" style={{ fontSize: '13px', color: 'var(--teal)', fontWeight: 600 }}>Ver catálogo →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {trending.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ marginBottom: '3.5rem', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '.5rem', textAlign: 'center' }}>Cómo funciona</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
            De productor a comprador europeo en 4 pasos
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--teal-light)', border: '2px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', margin: '0 auto 12px' }}>
                  {step.icon}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--teal)', letterSpacing: '.06em', marginBottom: 4 }}>PASO {step.step}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: 6 }}>{step.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURED PRODUCERS ── */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Productores verificados</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: 2 }}>Empresas con certificaciones validadas y historial de exportación</p>
            </div>
            <Link to="/productores" style={{ fontSize: '13px', color: 'var(--teal)', fontWeight: 600 }}>Ver todos →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {featuredProducers.map(p => <ProducerCard key={p.id} producer={p} />)}
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section style={{
          background: 'linear-gradient(135deg, #0F172A, #1E3A5F)',
          borderRadius: 'var(--radius)', padding: '2.5rem', textAlign: 'center', color: '#fff',
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '.75rem' }}>
            ¿Eres productor mexicano?
          </h2>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '14px', marginBottom: '1.5rem', maxWidth: 480, margin: '0 auto 1.5rem' }}>
            Publica tus productos y conecta con compradores en 27 países europeos. Sin comisiones por transacción. Sin intermediarios.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/registro" className="btn btn-primary" style={{ padding: '12px 28px' }}>
              Publicar mis productos gratis
            </Link>
            <Link to="/como-funciona" className="btn" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', border: '1px solid rgba(255,255,255,.25)', padding: '12px 28px' }}>
              Ver cómo funciona
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}

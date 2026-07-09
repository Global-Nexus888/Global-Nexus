import { useState, useMemo, useEffect } from 'react'
import { PRODUCERS } from '../lib/data'
import ProducerCard from '../components/ProducerCard'
import { supabase } from '../lib/supabase'
import type { Producer } from '../types'

const CATS = [
  { value: '', label: 'Todos' },
  { value: 'bebidas', label: 'Bebidas' },
  { value: 'agricultura', label: 'Agricultura' },
  { value: 'artesanias', label: 'Artesanías' },
  { value: 'cosmeticos', label: 'Cosméticos' },
  { value: 'farmaceutico', label: 'Farmacéutico' },
]

/* Map a Supabase usuario row + product count to Producer type */
function toProducer(u: Record<string, unknown>, productCount: number): Producer {
  return {
    id: String(u.id || u.email),
    name: String(u.company || u.name || ''),
    logo: '🏭',
    description: String(u.category || ''),
    state: String(u.state || 'México'),
    category: 'bebidas',           // fallback — shown via description
    certifications: [],
    totalProducts: productCount,
    rating: 4.5,
    exportCountries: [],
    verified: false,
    trending: false,
  }
}

export default function ProducersPage() {
  const [search, setSearch]   = useState('')
  const [cat, setCat]         = useState('')
  const [verified, setVerified] = useState(false)
  const [liveProducers, setLiveProducers] = useState<Producer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFromSupabase() {
      try {
        // Load all producers
        const { data: usuarios } = await supabase
          .from('usuarios')
          .select('*')
          .eq('role', 'productor')
          .order('created_at', { ascending: false })

        if (!usuarios || usuarios.length === 0) { setLoading(false); return }

        // Load product counts per producer
        const { data: productos } = await supabase
          .from('productos')
          .select('user_email')

        const countMap: Record<string, number> = {}
        ;(productos || []).forEach((p: { user_email: string }) => {
          countMap[p.user_email] = (countMap[p.user_email] || 0) + 1
        })

        // Load perfiles for logos/descriptions
        const { data: perfiles } = await supabase
          .from('perfiles')
          .select('email, bio, location, logo')

        const perfilMap: Record<string, Record<string, unknown>> = {}
        ;(perfiles || []).forEach((p: Record<string, unknown>) => {
          perfilMap[String(p.email)] = p
        })

        const live: Producer[] = usuarios.map((u: Record<string, unknown>) => {
          const email = String(u.email)
          const perfil = perfilMap[email] || {}
          return {
            id: String(u.id || email),
            name: String(u.company || u.name || ''),
            logo: String(perfil.logo || '🏭'),
            description: String(perfil.bio || u.category || u.interest || ''),
            state: String(perfil.location || u.state || 'México'),
            category: 'bebidas',
            certifications: [],
            totalProducts: countMap[email] || 0,
            rating: 4.5,
            exportCountries: [],
            verified: false,
            trending: false,
          }
        })

        setLiveProducers(live)
      } catch { /* fallback to static */ }
      setLoading(false)
    }
    loadFromSupabase()
  }, [])

  // Merge: real producers first, then static demo ones
  const allProducers = useMemo(() => {
    if (liveProducers.length > 0) return liveProducers
    return PRODUCERS
  }, [liveProducers])

  const results = useMemo(() => {
    let list = [...allProducers]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    }
    if (cat) list = list.filter(p => p.category === cat)
    if (verified) list = list.filter(p => p.verified)
    return list
  }, [search, cat, verified, allProducers])

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem', minHeight: '80vh' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>Productores mexicanos</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Empresas certificadas con capacidad de exportación a la Unión Europea</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '10px' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar productor o estado..."
          style={{ width: '100%', padding: '10px 14px 10px 38px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '14px', background: 'var(--white)', boxSizing: 'border-box' }}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--teal)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
        />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.25rem', alignItems: 'center', overflowX: 'auto', paddingBottom: 4, WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        {CATS.map(c => (
          <button key={c.value} onClick={() => setCat(c.value)} className="btn"
            style={{ padding: '7px 14px', fontSize: '13px', whiteSpace: 'nowrap', flexShrink: 0, background: cat === c.value ? 'var(--teal)' : 'var(--white)', color: cat === c.value ? '#fff' : 'var(--text)', border: '1.5px solid', borderColor: cat === c.value ? 'var(--teal)' : 'var(--border)' }}>
            {c.label}
          </button>
        ))}
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', cursor: 'pointer', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 }}>
          <input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} style={{ accentColor: 'var(--teal)', width: 15, height: 15 }} />
          Solo verificados
        </label>
      </div>

      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        {loading ? 'Cargando productores...' : `${results.length} productores`}
        {liveProducers.length > 0 && <span style={{ marginLeft: 8, color: '#16A34A', fontWeight: 600 }}>● En vivo</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <div style={{ fontWeight: 600 }}>Cargando productores...</div>
          </div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏭</div>
            <div style={{ fontWeight: 600 }}>Sin resultados</div>
          </div>
        ) : results.map(p => <ProducerCard key={p.id} producer={p} />)}
      </div>
    </div>
  )
}

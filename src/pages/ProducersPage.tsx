import { useState, useMemo } from 'react'
import { PRODUCERS } from '../lib/data'
import ProducerCard from '../components/ProducerCard'

const CATS = [
  { value: '', label: 'Todos' },
  { value: 'bebidas', label: 'Bebidas' },
  { value: 'agricultura', label: 'Agricultura' },
  { value: 'artesanias', label: 'Artesanías' },
  { value: 'cosmeticos', label: 'Cosméticos' },
  { value: 'farmaceutico', label: 'Farmacéutico' },
]

export default function ProducersPage() {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('')
  const [verified, setVerified] = useState(false)

  const results = useMemo(() => {
    let list = [...PRODUCERS]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.state.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    }
    if (cat) list = list.filter(p => p.category === cat)
    if (verified) list = list.filter(p => p.verified)
    return list
  }, [search, cat, verified])

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem', minHeight: '80vh' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>Productores mexicanos</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Empresas certificadas con capacidad de exportación a la Unión Europea</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar productor o estado..."
            style={{ width: '100%', padding: '10px 14px 10px 38px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '14px', background: 'var(--white)' }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--teal)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {CATS.map(c => (
            <button key={c.value} onClick={() => setCat(c.value)}
              className="btn"
              style={{ padding: '8px 14px', fontSize: '13px', background: cat === c.value ? 'var(--teal)' : 'var(--white)', color: cat === c.value ? '#fff' : 'var(--text)', border: '1.5px solid', borderColor: cat === c.value ? 'var(--teal)' : 'var(--border)' }}
            >{c.label}</button>
          ))}
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>
          <input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} style={{ accentColor: 'var(--teal)', width: 16, height: 16 }} />
          Solo verificados
        </label>
      </div>

      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        {results.length} productores
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏭</div>
            <div style={{ fontWeight: 600 }}>Sin resultados</div>
          </div>
        ) : results.map(p => <ProducerCard key={p.id} producer={p} />)}
      </div>
    </div>
  )
}

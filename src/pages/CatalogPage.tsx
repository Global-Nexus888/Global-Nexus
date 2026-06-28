import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PRODUCTS } from '../lib/data'
import ProductCard from '../components/ProductCard'
import FilterSidebar from '../components/FilterSidebar'
import type { FilterState, ProductCategory, MexicanState } from '../types'

const SORT_OPTIONS = [
  { value: 'relevancia', label: 'Relevancia' },
  { value: 'recientes', label: 'Más recientes' },
  { value: 'menor-precio', label: 'Menor precio' },
  { value: 'mayor-demanda', label: 'Mayor demanda' },
  { value: 'verificados', label: 'Verificados primero' },
]

export default function CatalogPage() {
  const [searchParams] = useSearchParams()

  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('q') || '',
    category: (searchParams.get('categoria') as ProductCategory) || '',
    certifications: [],
    state: '' as MexicanState | '',
    sort: 'relevancia',
  })

  useEffect(() => {
    const q = searchParams.get('q')
    const cat = searchParams.get('categoria')
    if (q || cat) {
      setFilters(f => ({ ...f, search: q || f.search, category: (cat as ProductCategory) || f.category }))
    }
  }, [searchParams])

  const updateFilters = (partial: Partial<FilterState>) => setFilters(f => ({ ...f, ...partial }))

  const results = useMemo(() => {
    let list = [...PRODUCTS]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.producerName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    }
    if (filters.category) list = list.filter(p => p.category === filters.category)
    if (filters.state)    list = list.filter(p => p.state === filters.state)
    if (filters.certifications.length > 0) {
      list = list.filter(p => filters.certifications.every(c => p.certifications.includes(c)))
    }
    if (filters.sort === 'menor-precio') list.sort((a, b) => a.price - b.price)
    if (filters.sort === 'mayor-demanda') list.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0))
    if (filters.sort === 'verificados') list.sort((a, b) => Number(b.verified) - Number(a.verified))
    return list
  }, [filters])

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>Catálogo de productos</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Productos mexicanos certificados listos para exportación a Europa vía TLCUEM
        </p>
      </div>

      {/* Search bar */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1rem' }}>🔍</span>
          <input
            value={filters.search}
            onChange={e => updateFilters({ search: e.target.value })}
            placeholder="Buscar producto o productor..."
            style={{
              width: '100%', padding: '10px 14px 10px 42px',
              border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
              fontSize: '14px', background: 'var(--white)', transition: 'border-color .15s',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--teal)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>
        <select
          value={filters.sort}
          onChange={e => updateFilters({ sort: e.target.value as FilterState['sort'] })}
          style={{ padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '14px', background: 'var(--white)', cursor: 'pointer', minWidth: 180 }}
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Layout */}
      <div className="catalog-layout" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        <div className="catalog-sidebar"><FilterSidebar filters={filters} onChange={updateFilters} totalResults={results.length} /></div>

        <div className="catalog-main" style={{ flex: 1, minWidth: 0 }}>
          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: 8 }}>Sin resultados</div>
              <div style={{ fontSize: '14px' }}>Prueba con otros términos o ajusta los filtros</div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {results.length} productos encontrados
              </div>
              <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1rem' }}>
                {results.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

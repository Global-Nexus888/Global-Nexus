import type { FilterState, ProductCategory, Certification, MexicanState } from '../types'

interface FilterSidebarProps {
  filters: FilterState
  onChange: (f: Partial<FilterState>) => void
  totalResults: number
}

const CATEGORIES: { value: ProductCategory | ''; label: string; icon: string }[] = [
  { value: '', label: 'Todas las categorías', icon: '🗂️' },
  { value: 'bebidas', label: 'Bebidas espirituosas', icon: '🥃' },
  { value: 'agricultura', label: 'Agricultura y alimentos', icon: '🌾' },
  { value: 'artesanias', label: 'Artesanías y textiles', icon: '🧵' },
  { value: 'cosmeticos', label: 'Cosméticos naturales', icon: '🌿' },
  { value: 'farmaceutico', label: 'Farmacéutico / Herbolaria', icon: '🌱' },
]

const CERTS: { value: Certification; label: string }[] = [
  { value: 'denominacion-origen', label: 'Denominación de origen' },
  { value: 'organico', label: 'Orgánico' },
  { value: 'senasica', label: 'SENASICA' },
  { value: 'nom', label: 'NOM certificado' },
  { value: 'cofepris', label: 'COFEPRIS' },
  { value: 'kosher-halal', label: 'Kosher / Halal' },
]

const STATES: { value: MexicanState | ''; label: string }[] = [
  { value: '', label: 'Todo México' },
  { value: 'Jalisco', label: 'Jalisco' },
  { value: 'Oaxaca', label: 'Oaxaca' },
  { value: 'Chiapas', label: 'Chiapas' },
  { value: 'Puebla', label: 'Puebla' },
  { value: 'Veracruz', label: 'Veracruz' },
  { value: 'Yucatán', label: 'Yucatán' },
  { value: 'Guerrero', label: 'Guerrero' },
  { value: 'Michoacán', label: 'Michoacán' },
  { value: 'Sonora', label: 'Sonora' },
  { value: 'Guanajuato', label: 'Guanajuato' },
]

const section: React.CSSProperties = {
  borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem',
}
const label: React.CSSProperties = {
  fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)',
  textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '10px', display: 'block',
}

export default function FilterSidebar({ filters, onChange, totalResults }: FilterSidebarProps) {
  const toggleCert = (c: Certification) => {
    const certs = filters.certifications.includes(c)
      ? filters.certifications.filter(x => x !== c)
      : [...filters.certifications, c]
    onChange({ certifications: certs })
  }

  return (
    <aside style={{ width: 240, flexShrink: 0 }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', position: 'sticky', top: 80 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <span style={{ fontWeight: 700, fontSize: '14px' }}>Filtros</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{totalResults} resultados</span>
        </div>

        {/* Category */}
        <div style={section}>
          <span style={label}>Categoría</span>
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => onChange({ category: cat.value })}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                padding: '7px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: 500, textAlign: 'left',
                background: filters.category === cat.value ? 'var(--teal-light)' : 'transparent',
                color: filters.category === cat.value ? 'var(--teal-dark)' : 'var(--text)',
                transition: 'all .15s',
              }}
            >
              <span>{cat.icon}</span>{cat.label}
            </button>
          ))}
        </div>

        {/* Certifications */}
        <div style={section}>
          <span style={label}>Certificaciones</span>
          {CERTS.map(c => (
            <label key={c.value} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', cursor: 'pointer', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={filters.certifications.includes(c.value)}
                onChange={() => toggleCert(c.value)}
                style={{ accentColor: 'var(--teal)', width: 14, height: 14 }}
              />
              {c.label}
            </label>
          ))}
        </div>

        {/* Estado */}
        <div>
          <span style={label}>Estado de México</span>
          <select
            value={filters.state}
            onChange={e => onChange({ state: e.target.value as MexicanState | '' })}
            style={{
              width: '100%', padding: '8px 10px', borderRadius: 8,
              border: '1.5px solid var(--border)', fontSize: '13px',
              background: 'var(--white)', color: 'var(--text)', cursor: 'pointer',
            }}
          >
            {STATES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Reset */}
        {(filters.category || filters.certifications.length > 0 || filters.state) && (
          <button
            onClick={() => onChange({ category: '', certifications: [], state: '' })}
            className="btn btn-ghost"
            style={{ width: '100%', marginTop: '1rem', fontSize: '13px', color: 'var(--red)' }}
          >✕ Limpiar filtros</button>
        )}
      </div>
    </aside>
  )
}

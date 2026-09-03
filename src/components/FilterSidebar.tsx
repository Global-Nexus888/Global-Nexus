import { useLang } from '../context/LangContext'
import type { FilterState, ProductCategory, Certification, MexicanState } from '../types'

interface FilterSidebarProps {
  filters: FilterState
  onChange: (f: Partial<FilterState>) => void
  totalResults: number
}

const CAT_I18N: Record<ProductCategory | '', Record<string, string>> = {
  '':            { es: 'Todas las categorías', en: 'All categories',           nl: 'Alle categorieën',       de: 'Alle Kategorien'        },
  bebidas:       { es: 'Bebidas espirituosas',  en: 'Spirits & Beverages',      nl: 'Dranken & Spiritualiën', de: 'Spirituosen & Getränke' },
  agricultura:   { es: 'Agricultura y alimentos',en: 'Agriculture & Food',      nl: 'Landbouw & Voeding',     de: 'Landwirtschaft'         },
  artesanias:    { es: 'Artesanías y textiles',  en: 'Crafts & Textiles',       nl: 'Ambachten & Textiel',    de: 'Kunsthandwerk'          },
  cosmeticos:    { es: 'Cosméticos naturales',   en: 'Natural Cosmetics',       nl: 'Natuurlijke Cosmetica',  de: 'Naturkosmetik'          },
  farmaceutico:  { es: 'Farmacéutico / Herbolaria',en: 'Pharmaceutical',        nl: 'Farmaceutisch',          de: 'Pharmazeutisch'         },
}
const CAT_ICONS: Partial<Record<ProductCategory | '', string>> = {
  '': '🗂️', bebidas: '🥃', agricultura: '🌾', artesanias: '🧵', cosmeticos: '🌿', farmaceutico: '🌱',
}

const CERT_I18N: Record<Certification, Record<string, string>> = {
  'denominacion-origen': { es: 'Denominación de origen', en: 'Denomination of Origin', nl: 'Herkomstbenaming',   de: 'Ursprungsbezeichnung' },
  'organico':            { es: 'Orgánico',                en: 'Organic',               nl: 'Biologisch',          de: 'Bio'                  },
  'senasica':            { es: 'SENASICA',                en: 'SENASICA',              nl: 'SENASICA',            de: 'SENASICA'             },
  'nom':                 { es: 'NOM certificado',         en: 'NOM Certified',         nl: 'NOM gecertificeerd',  de: 'NOM zertifiziert'     },
  'cofepris':            { es: 'COFEPRIS',                en: 'COFEPRIS',              nl: 'COFEPRIS',            de: 'COFEPRIS'             },
  'kosher-halal':        { es: 'Kosher / Halal',          en: 'Kosher / Halal',        nl: 'Kosher / Halal',      de: 'Kosher / Halal'       },
}

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
  const { lang } = useLang()
  const tl = (rec: Record<string,string>) => rec[lang] || rec.es

  const toggleCert = (c: Certification) => {
    const certs = filters.certifications.includes(c)
      ? filters.certifications.filter(x => x !== c)
      : [...filters.certifications, c]
    onChange({ certifications: certs })
  }

  const filterLabel  = lang === 'nl' ? 'Filters'  : lang === 'de' ? 'Filter'    : lang === 'en' ? 'Filters'     : 'Filtros'
  const resultsLabel = lang === 'nl' ? 'resultaten': lang === 'de' ? 'Ergebnisse': lang === 'en' ? 'results'     : 'resultados'
  const catLabel     = lang === 'nl' ? 'Categorie' : lang === 'de' ? 'Kategorie' : lang === 'en' ? 'Category'    : 'Categoría'
  const certLabel    = lang === 'nl' ? 'Certificeringen': lang === 'de' ? 'Zertifizierungen': lang === 'en' ? 'Certifications': 'Certificaciones'
  const stateLabel   = lang === 'nl' ? 'Mexicaanse staat': lang === 'de' ? 'Mexikanischer Staat': lang === 'en' ? 'Mexican State': 'Estado de México'
  const allMxLabel   = lang === 'nl' ? 'Heel Mexico': lang === 'de' ? 'Ganz Mexiko': lang === 'en' ? 'All Mexico': 'Todo México'

  const CATS = Object.keys(CAT_I18N) as (ProductCategory | '')[]

  return (
    <aside style={{ width: 240, flexShrink: 0 }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', position: 'sticky', top: 80 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <span style={{ fontWeight: 700, fontSize: '14px' }}>{filterLabel}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{totalResults} {resultsLabel}</span>
        </div>

        {/* Category */}
        <div style={section}>
          <span style={label}>{catLabel}</span>
          {CATS.map(val => (
            <button
              key={val}
              onClick={() => onChange({ category: val as typeof filters.category })}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                padding: '7px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: 500, textAlign: 'left',
                background: filters.category === val ? 'var(--teal-light)' : 'transparent',
                color: filters.category === val ? 'var(--teal-dark)' : 'var(--text)',
                transition: 'all .15s',
              }}
            >
              <span>{CAT_ICONS[val] || '📦'}</span>{tl(CAT_I18N[val])}
            </button>
          ))}
        </div>

        {/* Certifications */}
        <div style={section}>
          <span style={label}>{certLabel}</span>
          {(Object.keys(CERT_I18N) as Certification[]).map(c => (
            <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', cursor: 'pointer', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={filters.certifications.includes(c)}
                onChange={() => toggleCert(c)}
                style={{ accentColor: 'var(--teal)', width: 14, height: 14 }}
              />
              {tl(CERT_I18N[c])}
            </label>
          ))}
        </div>

        {/* Estado */}
        <div>
          <span style={label}>{stateLabel}</span>
          <select
            value={filters.state}
            onChange={e => onChange({ state: e.target.value as MexicanState | '' })}
            style={{
              width: '100%', padding: '8px 10px', borderRadius: 8,
              border: '1.5px solid var(--border)', fontSize: '13px',
              background: 'var(--white)', color: 'var(--text)', cursor: 'pointer',
            }}
          >
            <option value="">{allMxLabel}</option>
            {STATES.filter(s => s.value !== '').map(s => (
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

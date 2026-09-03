import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LangContext'
import BuyerCard, { type Buyer, getFlag } from '../components/BuyerCard'

const T: Record<string, Record<string, string>> = {
  title:  { es: 'Compradores Europeos', en: 'European Buyers', nl: 'Europese Kopers', de: 'Europäische Einkäufer' },
  sub:    { es: 'Empresas e importadores de Europa que buscan productos mexicanos de calidad.', en: 'Companies and importers from Europe looking for quality Mexican products.', nl: 'Bedrijven en importeurs uit Europa op zoek naar Mexicaanse kwaliteitsproducten.', de: 'Unternehmen und Importeure aus Europa, die mexikanische Qualitätsprodukte suchen.' },
  search: { es: 'Buscar empresa o país...', en: 'Search company or country...', nl: 'Zoek bedrijf of land...', de: 'Firma oder Land suchen...' },
  empty:  { es: 'Sin compradores registrados todavía', en: 'No registered buyers yet', nl: 'Nog geen kopers geregistreerd', de: 'Noch keine Käufer registriert' },
  loading:{ es: 'Cargando compradores...', en: 'Loading buyers...', nl: 'Kopers laden...', de: 'Käufer werden geladen...' },
  count:  { es: 'compradores', en: 'buyers', nl: 'kopers', de: 'Käufer' },
  live:   { es: '● En vivo', en: '● Live', nl: '● Live', de: '● Live' },
  verified:{ es: 'Solo verificados', en: 'Verified only', nl: 'Alleen geverifieerd', de: 'Nur verifizierte' },
  all:    { es: 'Todos los países', en: 'All countries', nl: 'Alle landen', de: 'Alle Länder' },
}

const EU_COUNTRIES = ['Alemania','Austria','Bélgica','España','Francia','Italia','Países Bajos','Polonia','Portugal','Suecia','Suiza']

function toBuyer(u: Record<string, unknown>): Buyer {
  const isComplete = !!(u.name && u.company && u.country)
  return {
    id:              String(u.id || u.email),
    company:         String(u.company || u.name || 'Empresa EU'),
    name:            String(u.name || ''),
    country:         String(u.country || 'Europa'),
    flag:            getFlag(String(u.country || '')),
    sector:          String(u.interest || u.category || 'general'),
    lang:            String(u.lang || 'en'),
    profileComplete: isComplete,
    joinedAt:        String(u.created_at || new Date().toISOString()),
  }
}

export default function BuyersPage() {
  const { lang } = useLang()
  const t = (k: string) => T[k]?.[lang] ?? T[k]?.es ?? ''

  const [buyers, setBuyers]     = useState<Buyer[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [country, setCountry]   = useState('')
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from('usuarios')
          .select('*')
          .eq('role', 'comprador')
          .order('created_at', { ascending: false })
        if (data && data.length > 0) {
          setBuyers((data as Record<string, unknown>[]).map(toBuyer))
        }
      } catch { /* silently fallback */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const results = buyers.filter(b => {
    const q = search.toLowerCase()
    const matchSearch = !q || b.company.toLowerCase().includes(q) || b.country.toLowerCase().includes(q) || b.name.toLowerCase().includes(q)
    const matchCountry = !country || b.country === country
    const matchVerified = !verified || b.profileComplete
    return matchSearch && matchCountry && matchVerified
  })

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(1rem,4vw,2rem)' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.2rem,4vw,1.75rem)', fontWeight: 800, color: 'var(--navy)' }}>
          🇪🇺 {t('title')}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, maxWidth: 560 }}>{t('sub')}</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14 }}>🔍</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t('search')}
            style={{ width: '100%', padding: '10px 14px 10px 36px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 14, background: 'var(--white)', boxSizing: 'border-box' }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--teal)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>
        <select value={country} onChange={e => setCountry(e.target.value)}
          style={{ padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 13, background: 'var(--white)', cursor: 'pointer' }}>
          <option value="">{t('all')}</option>
          {EU_COUNTRIES.map(c => <option key={c} value={c}>{getFlag(c)} {c}</option>)}
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: verified ? 'var(--teal-light)' : 'var(--white)', userSelect: 'none' }}>
          <input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} style={{ accentColor: 'var(--teal)' }} />
          {t('verified')}
        </label>
      </div>

      {/* Count */}
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: '1rem' }}>
        {loading ? t('loading') : `${results.length} ${t('count')}`}
        {!loading && buyers.length > 0 && <span style={{ marginLeft: 8, color: '#16A34A', fontWeight: 600 }}>{t('live')}</span>}
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <div style={{ fontWeight: 600 }}>{t('loading')}</div>
          </div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🇪🇺</div>
            <div style={{ fontWeight: 600 }}>{t('empty')}</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Los compradores europeos aparecerán aquí a partir del 3 Sep 2026.</div>
          </div>
        ) : results.map(b => <BuyerCard key={b.id} buyer={b} />)}
      </div>
    </div>
  )
}

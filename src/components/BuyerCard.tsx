import { useLang } from '../context/LangContext'

export interface Buyer {
  id: string
  company: string
  name: string
  country: string
  flag: string
  sector: string
  lang: string
  profileComplete: boolean
  joinedAt: string
}

const SECTOR_LABELS: Record<string, string> = {
  bebidas:       'Bebidas / Spirits',
  alimentos:     'Alimentos & Gourmet',
  cosmeticos:    'Cosmética natural',
  artesanias:    'Artesanías & Textiles',
  farmaceutico:  'Farmacéutico',
  general:       'Importador general',
}

const COUNTRY_FLAGS: Record<string, string> = {
  'Países Bajos': '🇳🇱', 'Netherlands': '🇳🇱',
  'Alemania': '🇩🇪', 'Germany': '🇩🇪', 'Deutschland': '🇩🇪',
  'España': '🇪🇸', 'Spain': '🇪🇸',
  'Francia': '🇫🇷', 'France': '🇫🇷',
  'Bélgica': '🇧🇪', 'Belgium': '🇧🇪', 'Belgique': '🇧🇪',
  'Italia': '🇮🇹', 'Italy': '🇮🇹',
  'Polonia': '🇵🇱', 'Poland': '🇵🇱',
  'Austria': '🇦🇹',
  'Suiza': '🇨🇭', 'Switzerland': '🇨🇭',
  'Portugal': '🇵🇹',
  'Suecia': '🇸🇪', 'Sweden': '🇸🇪',
}

export function getFlag(country: string) {
  return COUNTRY_FLAGS[country] || '🇪🇺'
}

const BADGE: Record<string, string> = {
  es: '✓ Perfil verificado',
  en: '✓ Verified profile',
  nl: '✓ Geverifieerd profiel',
  de: '✓ Verifiziertes Profil',
}

export default function BuyerCard({ buyer }: { buyer: Buyer }) {
  const { lang } = useLang()
  return (
    <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        {/* Flag / avatar */}
        <div style={{
          width: 52, height: 52, borderRadius: 14, fontSize: '1.6rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#EFF6FF', border: '1px solid #BFDBFE', flexShrink: 0,
        }}>{buyer.flag || getFlag(buyer.country)}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{buyer.company}</span>
            {buyer.profileComplete && (
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: '#DCFCE7', color: '#15803D' }}>
                {BADGE[lang] ?? BADGE.es}
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
            {buyer.flag || getFlag(buyer.country)} {buyer.country}
            {buyer.sector && <> &nbsp;·&nbsp; {SECTOR_LABELS[buyer.sector] || buyer.sector}</>}
          </div>
          {buyer.name && buyer.name !== buyer.company && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>👤 {buyer.name}</div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 100, background: '#EFF6FF', color: '#1E40AF', fontWeight: 600 }}>
            🌐 {String(buyer.lang || 'EU').toUpperCase()}
          </span>
          <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 100, background: 'var(--surface2)', color: 'var(--text-muted)', fontWeight: 600 }}>
            🇪🇺 Comprador EU
          </span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          Miembro desde {new Date(buyer.joinedAt).toLocaleDateString('es-MX', { month: 'short', year: 'numeric' })}
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import type { Producer } from '../types'

const VERIFIED: Record<string, string> = {
  es: '✓ Verificado',
  en: '✓ Verified',
  nl: '✓ Geverifieerd',
  de: '✓ Verifiziert',
}

interface ProducerCardProps {
  producer: Producer
}

const CAT_LABELS: Record<string, string> = {
  bebidas: 'Bebidas espirituosas',
  agricultura: 'Agricultura y alimentos',
  artesanias: 'Artesanías y textiles',
  cosmeticos: 'Cosméticos naturales',
  farmaceutico: 'Farmacéutico / Herbolaria',
}

const CERT_LABELS: Record<string, string> = {
  'denominacion-origen': 'D.O.',
  'organico': 'Orgánico',
  'senasica': 'SENASICA',
  'nom': 'NOM',
  'cofepris': 'COFEPRIS',
  'kosher-halal': 'Kosher/Halal',
}

export default function ProducerCard({ producer }: ProducerCardProps) {
  const { lang } = useLang()
  return (
    <Link to={`/productor/${producer.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="card" style={{ padding: '1.5rem', cursor: 'pointer' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          {/* Logo */}
          <div style={{
            width: 56, height: 56, borderRadius: 14, fontSize: '1.8rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--surface2)', border: '1px solid var(--border)', flexShrink: 0,
          }}>{producer.logo}</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>{producer.name}</h3>
              {producer.verified && <span className="badge badge-teal">{VERIFIED[lang] ?? VERIFIED.es}</span>}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 3 }}>
              📍 {producer.state} &nbsp;·&nbsp; {CAT_LABELS[producer.category]}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {producer.description}
            </p>
          </div>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          {/* Certifications */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {producer.certifications.map(c => (
              <span key={c} className="badge badge-gray">{CERT_LABELS[c]}</span>
            ))}
          </div>
          {/* Stats */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--teal)' }}>{producer.totalProducts}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>productos</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>⭐ {producer.rating}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>rating</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>{producer.exportCountries.length}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>países EU</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

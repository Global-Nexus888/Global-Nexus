import { Link } from 'react-router-dom'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
}

const CERT_LABELS: Record<string, string> = {
  'denominacion-origen': 'D.O.',
  'organico': 'Orgánico',
  'senasica': 'SENASICA',
  'nom': 'NOM',
  'cofepris': 'COFEPRIS',
  'kosher-halal': 'Kosher/Halal',
}

const CAT_COLORS: Record<string, string> = {
  bebidas: '#7C3AED',
  agricultura: '#16A34A',
  artesanias: '#D97706',
  cosmeticos: '#DB2777',
  farmaceutico: '#0D9488',
}

export default function ProductCard({ product }: ProductCardProps) {
  const catColor = CAT_COLORS[product.category] || 'var(--teal)'

  return (
    <Link to={`/producto/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="card" style={{ padding: '1.25rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer' }}>

        {/* Top row: icon + badges */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12, fontSize: '1.6rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${catColor}12`, border: `1px solid ${catColor}30`,
          }}>{product.icon}</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            {product.verified && <span className="badge badge-teal">✓ Verificado</span>}
            {product.trending && <span className="badge badge-gold">🔥 Trending</span>}
            {product.newProduct && <span className="badge badge-navy">✦ Nuevo</span>}
            {!product.inStock && <span className="badge badge-gray">Sin stock</span>}
          </div>
        </div>

        {/* Name + producer */}
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', lineHeight: 1.35, marginBottom: 4 }}>
            {product.name}
          </h3>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>🏭</span>{product.producerName}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
            📍 {product.state}
          </div>
        </div>

        {/* Certifications */}
        {product.certifications.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {product.certifications.slice(0, 3).map(c => (
              <span key={c} className="badge badge-gray">{CERT_LABELS[c]}</span>
            ))}
          </div>
        )}

        {/* Price + MOQ */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--teal)' }}>
              ${product.price.toFixed(2)}
              <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', marginLeft: 2 }}>USD/{product.unit}</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>
              MOQ: {product.moq} {product.moqUnit}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: 2, fontWeight: 600, letterSpacing: '.03em' }}>
              FOB Veracruz
            </div>
          </div>
          <div style={{
            background: 'var(--teal)', color: '#fff',
            padding: '6px 12px', borderRadius: 8, fontSize: '12px', fontWeight: 600,
          }}>Ver detalles</div>
        </div>
      </div>
    </Link>
  )
}

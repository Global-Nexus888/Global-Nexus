import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { PRODUCTS, PRODUCERS } from '../lib/data'

const CERT_INFO: Record<string, { label: string; color: string; desc: string }> = {
  'denominacion-origen': { label: 'Denominación de Origen', color: '#7C3AED', desc: 'Producto protegido por denominación geográfica oficial de México.' },
  'organico': { label: 'Orgánico Certificado', color: '#16A34A', desc: 'Libre de agroquímicos y cultivado bajo normas orgánicas internacionales.' },
  'senasica': { label: 'SENASICA', color: '#0D9488', desc: 'Certificado fitosanitario para exportación emitido por SENASICA México.' },
  'nom': { label: 'NOM', color: '#D97706', desc: 'Norma Oficial Mexicana — garantía de calidad y procesos estandarizados.' },
  'cofepris': { label: 'COFEPRIS', color: '#DB2777', desc: 'Autorizado por la Comisión Federal para la Protección contra Riesgos Sanitarios.' },
  'kosher-halal': { label: 'Kosher / Halal', color: '#0891B2', desc: 'Doble certificación para mercados europeos con requerimientos religiosos.' },
}

const CAT_LABELS: Record<string, string> = {
  bebidas: 'Bebidas', agricultura: 'Agricultura', artesanias: 'Artesanías',
  cosmeticos: 'Cosméticos', farmaceutico: 'Farmacéutico',
}

const FLAG: Record<string, string> = {
  DE: '🇩🇪', NL: '🇳🇱', FR: '🇫🇷', ES: '🇪🇸', IT: '🇮🇹',
  BE: '🇧🇪', SE: '🇸🇪', PL: '🇵🇱', AT: '🇦🇹', FI: '🇫🇮', DK: '🇩🇰',
}

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [contacted, setContacted] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nombre: '', empresa: '', email: '', pais: '', mensaje: '' })

  const product = PRODUCTS.find(p => p.id === id)
  const producer = product ? PRODUCERS.find(p => p.id === product.producerId) : null
  const related = product ? PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3) : []

  if (!product || !producer) {
    return (
      <div style={{ maxWidth: 600, margin: '6rem auto', textAlign: 'center', padding: '0 1.5rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Producto no encontrado</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Este producto no existe o fue removido del catálogo.</p>
        <Link to="/catalogo" className="btn btn-primary">Ver catálogo completo</Link>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setContacted(true)
    setShowForm(false)
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        <Link to="/" style={{ color: 'var(--text-muted)' }}>Inicio</Link>
        <span>›</span>
        <Link to="/catalogo" style={{ color: 'var(--text-muted)' }}>Catálogo</Link>
        <span>›</span>
        <Link to={`/catalogo?categoria=${product.category}`} style={{ color: 'var(--text-muted)' }}>{CAT_LABELS[product.category]}</Link>
        <span>›</span>
        <span style={{ color: 'var(--text)', fontWeight: 500 }}>{product.name}</span>
      </div>

      <div className="product-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>

        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Hero card */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Icon */}
              <div style={{
                width: 100, height: 100, borderRadius: 20, fontSize: '3.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--surface2)', border: '1px solid var(--border)', flexShrink: 0,
              }}>{product.icon}</div>

              <div style={{ flex: 1, minWidth: 200 }}>
                {/* Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {product.verified && <span className="badge badge-teal">✓ Proveedor Verificado</span>}
                  {product.trending && <span className="badge badge-gold">🔥 Trending</span>}
                  {product.newProduct && <span className="badge badge-navy">✦ Nuevo</span>}
                  {!product.inStock && <span className="badge badge-gray">Sin stock</span>}
                  <span className="badge badge-gray">{CAT_LABELS[product.category]}</span>
                </div>

                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.2, marginBottom: 6 }}>
                  {product.name}
                </h1>
                <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: 2 }}>
                  {product.nameEn}
                </p>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 16, marginTop: 8 }}>
                  <span>📍 {product.state}, México</span>
                  <span>🏭 {product.producerName}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>Descripción del producto</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{product.description}</p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginTop: 8, fontStyle: 'italic', fontSize: 13 }}>{product.descriptionEn}</p>
            </div>
          </div>

          {/* Specs grid */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>Especificaciones comerciales</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Precio unitario', value: `$${product.price.toFixed(2)} USD`, sub: `por ${product.unit}` },
                { label: 'Pedido mínimo (MOQ)', value: `${product.moq} ${product.moqUnit}`, sub: 'mínimo por orden' },
                { label: 'Unidad de venta', value: product.unit, sub: product.unitEn },
                { label: 'Disponibilidad', value: product.inStock ? '✅ En stock' : '⏳ Sin stock', sub: product.inStock ? 'Listo para exportar' : 'Consultar fecha' },
                { label: 'País de origen', value: '🇲🇽 México', sub: product.state },
                { label: 'Arancel TLCUEM', value: '0%', sub: 'para compradores EU ✓' },
              ].map(spec => (
                <div key={spec.label} style={{ background: 'var(--surface2)', borderRadius: 10, padding: '1rem' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>{spec.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{spec.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{spec.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>Certificaciones y estándares</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {product.certifications.map(cert => {
                const info = CERT_INFO[cert]
                return (
                  <div key={cert} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', background: 'var(--surface2)', borderRadius: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                      background: `${info.color}15`, border: `1.5px solid ${info.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16,
                    }}>✓</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: info.color }}>{info.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{info.desc}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* TLCUEM info */}
          <div style={{ background: 'linear-gradient(135deg, #0D9488 0%, #1E3A5F 100%)', borderRadius: 'var(--radius)', padding: '1.5rem', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: '1.5rem' }}>🤝</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>Ventaja TLCUEM activa</div>
                <div style={{ fontSize: 13, opacity: .85 }}>Tratado de Libre Comercio México – Unión Europea</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { icon: '0%', label: 'Arancel de importación para compradores EU' },
                { icon: '48h', label: 'Documentación aduanal generada automáticamente' },
                { icon: '27', label: 'Países de la Unión Europea con acceso directo' },
              ].map(item => (
                <div key={item.label} style={{ background: 'rgba(255,255,255,.12)', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{item.icon}</div>
                  <div style={{ fontSize: 11, opacity: .85, marginTop: 4, lineHeight: 1.4 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>Productos relacionados</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {related.map(p => (
                  <Link key={p.id} to={`/producto/${p.id}`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ padding: '1rem', display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ fontSize: '1.8rem' }}>{p.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 700, marginTop: 2 }}>${p.price} USD/{p.unit}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — sticky sidebar */}
        <div className="product-sticky" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: 80 }}>

          {/* Price + CTA */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--teal)', lineHeight: 1 }}>
                ${product.price.toFixed(2)} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>USD/{product.unit}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
                MOQ: <strong style={{ color: 'var(--text)' }}>{product.moq} {product.moqUnit}</strong>
              </div>
              <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600, marginTop: 4 }}>
                ✓ 0% arancel de importación (TLCUEM)
              </div>
            </div>

            {contacted ? (
              <div style={{ background: 'var(--green-light)', border: '1.5px solid var(--green)', borderRadius: 10, padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>✅</div>
                <div style={{ fontWeight: 700, color: 'var(--green)', fontSize: 14 }}>Solicitud enviada</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>El productor te contactará en menos de 24 horas.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: 15 }}
                  disabled={!product.inStock}
                >
                  {product.inStock ? '📩 Contactar productor' : '⏳ Sin stock disponible'}
                </button>
                <button
                  onClick={() => navigate('/precios')}
                  className="btn btn-outline"
                  style={{ width: '100%', padding: '10px', fontSize: 13 }}
                >
                  Ver planes de suscripción
                </button>
              </div>
            )}

            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                '🔒 Pagos 100% seguros vía Stripe',
                '📦 Logística con Puerto Veracruz',
                '📄 Documentación aduanal incluida',
                '💬 Mensajería bilingüe ES/EN',
              ].map(item => (
                <div key={item} style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>{item}</div>
              ))}
            </div>
          </div>

          {/* Producer card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 12 }}>Productor</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12, fontSize: '1.6rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--surface2)', border: '1px solid var(--border)', flexShrink: 0,
              }}>{producer.logo}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', lineHeight: 1.3 }}>{producer.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>📍 {producer.state} · Desde {producer.founded}</div>
                {producer.verified && <span className="badge badge-teal" style={{ marginTop: 4 }}>✓ Verificado</span>}
              </div>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12 }}>{producer.description}</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
              {[
                { v: `${producer.rating}★`, l: 'Rating' },
                { v: producer.totalProducts, l: 'Productos' },
                { v: producer.exportCountries.length, l: 'Países EU' },
              ].map(s => (
                <div key={s.l} style={{ background: 'var(--surface2)', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--teal)' }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Export flags */}
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Exporta actualmente a:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {producer.exportCountries.map(c => (
                  <span key={c} title={c} style={{ fontSize: '1.2rem' }}>{FLAG[c] || c}</span>
                ))}
              </div>
            </div>

            <Link to={`/productores`} style={{ display: 'block', marginTop: 12, fontSize: 13, color: 'var(--teal)', fontWeight: 600, textAlign: 'center' }}>
              Ver perfil completo del productor →
            </Link>
          </div>
        </div>
      </div>

      {/* Contact modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }} onClick={() => setShowForm(false)}>
          <div className="card" style={{ width: '100%', maxWidth: 520, padding: '2rem', position: 'relative' }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowForm(false)} style={{
              position: 'absolute', top: 16, right: 16, background: 'none', border: 'none',
              fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)',
            }}>✕</button>

            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 4 }}>Solicitar información</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Contactando a <strong>{producer.name}</strong> sobre <strong>{product.name}</strong>
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { key: 'nombre', label: 'Nombre completo', placeholder: 'Jan van der Berg', type: 'text' },
                { key: 'empresa', label: 'Empresa / Importadora', placeholder: 'EuroImport BV', type: 'text' },
                { key: 'email', label: 'Email de contacto', placeholder: 'jan@euroimport.nl', type: 'email' },
                { key: 'pais', label: 'País (EU)', placeholder: 'Países Bajos', type: 'text' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: 4 }}>{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    required
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 8,
                      border: '1.5px solid var(--border)', fontSize: 14,
                      background: 'var(--surface)', color: 'var(--text)',
                    }}
                  />
                </div>
              ))}

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: 4 }}>Mensaje al productor</label>
                <textarea
                  placeholder={`Hola, estoy interesado en importar ${product.name} para el mercado europeo. MOQ requerido: ${product.moq} ${product.moqUnit}...`}
                  required
                  rows={4}
                  value={form.mensaje}
                  onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8,
                    border: '1.5px solid var(--border)', fontSize: 14, resize: 'vertical',
                    background: 'var(--surface)', color: 'var(--text)', fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--gold-light)', padding: '8px 12px', borderRadius: 8 }}>
                ⚡ Para contactar productores necesitas un plan activo. <Link to="/precios" style={{ color: 'var(--gold)', fontWeight: 700 }}>Ver planes →</Link>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: 15, marginTop: 4 }}>
                Enviar solicitud de contacto
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

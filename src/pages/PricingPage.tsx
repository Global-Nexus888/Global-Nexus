import { Link } from 'react-router-dom'

// Stripe Payment Links (live)
const STRIPE_LINKS = {
  pro: 'https://buy.stripe.com/aFaaEPeQWcwHcYbaVP7IY00',
  comprador: 'https://buy.stripe.com/28E8wH6kq0NZgangg97IY01',
}

interface Feature {
  text: string
  included: boolean
}

interface Plan {
  id: string
  eyebrow: string
  name: string
  price: string
  originalPrice?: string
  period: string
  desc: string
  features: Feature[]
  cta: string
  ctaLink: string
  highlight?: boolean
  badge?: string
  role: 'productor' | 'comprador' | 'free'
}

const PLANS: Plan[] = [
  {
    id: 'explorador',
    eyebrow: 'EXPLORADOR',
    name: 'Explorador',
    price: '$0',
    period: '/ mes',
    desc: 'Para conocer la plataforma antes de comprometer.',
    features: [
      { text: 'Perfil básico (sin badge verificado)', included: true },
      { text: 'Ver catálogo completo', included: true },
      { text: '3 solicitudes de contacto/mes', included: true },
      { text: 'Feed social (solo lectura)', included: true },
      { text: 'Badge verificado', included: false },
      { text: 'Chat ilimitado', included: false },
    ],
    cta: 'Empezar gratis',
    ctaLink: '/registro',
    role: 'free',
  },
  {
    id: 'pro',
    eyebrow: 'PRO EXPORTADOR',
    name: 'Pro Exportador',
    price: '$59',
    originalPrice: '$99',
    period: 'USD / mes',
    desc: 'Para productores listos para conquistar Europa.',
    badge: '⭐ Más popular',
    features: [
      { text: 'Perfil completo + badge verificado IA', included: true },
      { text: 'Catálogo ilimitado de productos', included: true },
      { text: 'Chat bilingüe ilimitado', included: true },
      { text: 'Red social — publicar y conectar', included: true },
      { text: 'Dashboard de analíticas', included: true },
      { text: 'Posición destacada en búsquedas', included: true },
    ],
    cta: 'Acceso anticipado · 40% OFF',
    ctaLink: STRIPE_LINKS.pro,
    highlight: true,
    role: 'productor',
  },
  {
    id: 'comprador',
    eyebrow: 'COMPRADOR EU',
    name: 'Comprador EU',
    price: '$149',
    period: 'USD / mes',
    desc: 'Para importadores europeos que buscan proveedores mexicanos premium.',
    features: [
      { text: 'Acceso completo al catálogo', included: true },
      { text: 'Contacto ilimitado con productores', included: true },
      { text: 'Órdenes de compra digitales', included: true },
      { text: 'Reportes de mercado mensual', included: true },
      { text: 'Red social — publicar RFQs', included: true },
      { text: 'Account manager dedicado', included: true },
    ],
    cta: 'Registrarse como comprador',
    ctaLink: STRIPE_LINKS.comprador,
    role: 'comprador',
  },
]

const FAQ = [
  { q: '¿Puedo cambiar de plan en cualquier momento?', a: 'Sí. Puedes subir o bajar de plan desde tu portal de suscripción de Stripe en cualquier momento. Los cambios se aplican inmediatamente con prorrateo.' },
  { q: '¿Hay contratos de permanencia?', a: 'No. Todos los planes son mensuales y puedes cancelar en cualquier momento sin penalizaciones.' },
  { q: '¿El precio de $59 USD es permanente?', a: 'No. Es el precio de acceso anticipado disponible durante el lanzamiento. El precio regular es $99 USD/mes. Los que se suscriban ahora mantienen el precio bloqueado.' },
  { q: '¿Qué métodos de pago aceptan?', a: 'Tarjetas Visa, Mastercard, American Express y tarjetas de débito. El cobro es procesado de forma segura por Stripe.' },
  { q: '¿El plan Explorador es realmente gratis?', a: 'Sí. Sin tarjeta de crédito. Sin fecha de expiración. Puedes usarlo indefinidamente y upgradearlo cuando estés listo.' },
]

export default function PricingPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '80vh' }}>
      {/* Header */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '3.5rem 1.5rem 0' }}>
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--teal)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            PLANES DE ACCESO
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.1, marginBottom: '1rem' }}>
            Elige tu nivel.
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: 420, lineHeight: 1.65 }}>
            Planes diseñados para cada etapa. Empieza gratis y escala cuando el negocio lo exija.
          </p>
        </div>

        {/* Plans grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', alignItems: 'start' }}>
          {PLANS.map(plan => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', margin: '2.5rem 0', flexWrap: 'wrap' }}>
          {[
            { icon: '🔒', text: 'Pagos seguros con Stripe' },
            { icon: '↩️', text: 'Cancela cuando quieras' },
            { icon: '💳', text: 'Sin tarjeta para plan gratis' },
            { icon: '🌍', text: 'Facturación en USD' },
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: 'var(--text-muted)' }}>
              <span>{b.icon}</span>{b.text}
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '1rem 1.5rem 3rem' }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Comparativa completa de planes</h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--surface2)' }}>
                <th style={{ padding: '12px 20px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Característica</th>
                {PLANS.map(p => (
                  <th key={p.id} style={{ padding: '12px 20px', textAlign: 'center', fontWeight: 700, color: p.highlight ? 'var(--teal)' : 'var(--text)' }}>{p.eyebrow}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Perfil de empresa', explorador: '✓ Básico', pro: '✓ Completo', comprador: '✓ Completo' },
                { feature: 'Badge verificado IA', explorador: '—', pro: '✓', comprador: '✓' },
                { feature: 'Productos en catálogo', explorador: '3 máx.', pro: 'Ilimitados', comprador: 'N/A' },
                { feature: 'Contactos/mes', explorador: '3', pro: 'Ilimitado', comprador: 'Ilimitado' },
                { feature: 'Chat bilingüe', explorador: '—', pro: '✓', comprador: '✓' },
                { feature: 'Red social', explorador: 'Solo lectura', pro: '✓ Publicar', comprador: '✓ RFQs' },
                { feature: 'Dashboard analíticas', explorador: '—', pro: '✓', comprador: '✓ Mercado' },
                { feature: 'Posición en búsquedas', explorador: 'Estándar', pro: '⭐ Destacada', comprador: 'N/A' },
                { feature: 'Órdenes de compra digitales', explorador: '—', pro: '—', comprador: '✓' },
                { feature: 'Account manager', explorador: '—', pro: '—', comprador: '✓ Dedicado' },
                { feature: 'Reportes de mercado', explorador: '—', pro: '—', comprador: '✓ Mensual' },
              ].map((row, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(248,250,252,.6)' }}>
                  <td style={{ padding: '10px 20px', color: 'var(--text)', fontWeight: 500 }}>{row.feature}</td>
                  <td style={{ padding: '10px 20px', textAlign: 'center', color: row.explorador === '—' ? 'var(--border)' : 'var(--text-muted)' }}>{row.explorador}</td>
                  <td style={{ padding: '10px 20px', textAlign: 'center', color: row.pro.startsWith('✓') ? 'var(--green)' : row.pro === '—' ? 'var(--border)' : 'var(--text)', fontWeight: row.pro.startsWith('✓') ? 600 : 400 }}>{row.pro}</td>
                  <td style={{ padding: '10px 20px', textAlign: 'center', color: row.comprador.startsWith('✓') ? 'var(--green)' : row.comprador === '—' ? 'var(--border)' : 'var(--text)', fontWeight: row.comprador.startsWith('✓') ? 600 : 400 }}>{row.comprador}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>Preguntas frecuentes</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          {FAQ.map((item, i) => (
            <details key={i} style={{ background: 'var(--white)' }}>
              <summary style={{ padding: '1rem 1.25rem', cursor: 'pointer', fontWeight: 600, fontSize: '14px', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}>
                {item.q}
                <span style={{ color: 'var(--teal)', fontSize: '1.1rem', flexShrink: 0, marginLeft: '1rem' }}>+</span>
              </summary>
              <div style={{ padding: '0 1.25rem 1rem', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}

function PlanCard({ plan }: { plan: Plan }) {
  const isExternal = plan.ctaLink.startsWith('https://')

  const cardStyle: React.CSSProperties = {
    borderRadius: 16,
    border: plan.highlight ? 'none' : '1px solid var(--border)',
    background: plan.highlight ? '#0F172A' : 'var(--white)',
    color: plan.highlight ? '#fff' : 'var(--text)',
    padding: '2rem',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    boxShadow: plan.highlight ? '0 20px 60px rgba(13,148,136,.25)' : 'var(--shadow-sm)',
  }

  return (
    <div style={cardStyle}>
      {/* Popular badge */}
      {plan.badge && (
        <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--teal)', color: '#fff', padding: '5px 16px', borderRadius: 100, fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap' }}>
          {plan.badge}
        </div>
      )}

      {/* Eyebrow */}
      <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.1em', color: plan.highlight ? 'var(--teal-light)' : 'var(--teal)', textTransform: 'uppercase' }}>
        {plan.eyebrow}
      </div>

      {/* Price */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1, color: plan.highlight ? '#fff' : 'var(--text)' }}>{plan.price}</span>
          {plan.originalPrice && (
            <span style={{ fontSize: '1.1rem', fontWeight: 500, color: 'rgba(255,255,255,.4)', textDecoration: 'line-through' }}>{plan.originalPrice}</span>
          )}
          <span style={{ fontSize: '14px', color: plan.highlight ? 'rgba(255,255,255,.6)' : 'var(--text-muted)', marginLeft: 4 }}>{plan.period}</span>
        </div>
        <p style={{ fontSize: '13px', color: plan.highlight ? 'rgba(255,255,255,.65)' : 'var(--text-muted)', marginTop: 8, lineHeight: 1.55 }}>
          {plan.desc}
        </p>
      </div>

      {/* Features */}
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {plan.features.map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '13px', color: f.included ? (plan.highlight ? 'rgba(255,255,255,.9)' : 'var(--text)') : (plan.highlight ? 'rgba(255,255,255,.3)' : 'var(--text-muted)'), textDecoration: f.included ? 'none' : 'none' }}>
            <span style={{ color: f.included ? 'var(--green)' : (plan.highlight ? 'rgba(255,255,255,.25)' : 'var(--border)'), fontWeight: 700, fontSize: '13px', minWidth: 16, marginTop: 1 }}>
              {f.included ? '✓' : '✗'}
            </span>
            {f.text}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {isExternal ? (
        <a
          href={plan.ctaLink}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'block', textAlign: 'center', padding: '13px',
            borderRadius: 10, fontWeight: 700, fontSize: '14px',
            textDecoration: 'none', transition: 'all .18s',
            background: plan.highlight ? 'var(--teal)' : 'transparent',
            color: plan.highlight ? '#fff' : 'var(--teal)',
            border: `2px solid ${plan.highlight ? 'var(--teal)' : 'var(--teal)'}`,
            boxShadow: plan.highlight ? '0 4px 20px rgba(13,148,136,.4)' : 'none',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '.88'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          {plan.cta}
        </a>
      ) : (
        <Link
          to={plan.ctaLink}
          style={{
            display: 'block', textAlign: 'center', padding: '13px',
            borderRadius: 10, fontWeight: 700, fontSize: '14px',
            textDecoration: 'none', transition: 'all .18s',
            background: 'transparent',
            color: 'var(--teal)',
            border: '2px solid var(--teal)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--teal-light)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          {plan.cta}
        </Link>
      )}

      {/* Stripe badge on paid plans */}
      {isExternal && (
        <div style={{ textAlign: 'center', fontSize: '11px', color: plan.highlight ? 'rgba(255,255,255,.35)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          🔒 Pago seguro con Stripe
        </div>
      )}
    </div>
  )
}

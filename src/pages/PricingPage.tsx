import { Link } from 'react-router-dom'
import { isPreLaunch } from '../components/CountdownBanner'
import { useLang } from '../context/LangContext'
import { pricingI18n } from '../lib/i18n/pricing'
import { usePageMeta } from '../hooks/usePageMeta'

const STRIPE_LINKS = {
  pro: 'https://buy.stripe.com/6oU8wHcIO0NZ8HV3tn7IY04',
  comprador: 'https://buy.stripe.com/00w9AL4ci54fcYbd3X7IY03',
}
const preLaunch = isPreLaunch()

type Lang = 'es' | 'en' | 'nl' | 'de'

function getBadge(lang: Lang) {
  return lang === 'es' ? '⭐ Más popular' : lang === 'en' ? '⭐ Most popular' : lang === 'nl' ? '⭐ Populairste' : '⭐ Beliebteste'
}

function getTrustBadges(lang: Lang) {
  if (lang === 'en') return [
    { icon: '🔒', text: 'Secure payments via Stripe' },
    { icon: '↩️', text: 'Cancel anytime' },
    { icon: '💳', text: 'No card for free plan' },
    { icon: '🌍', text: 'Billing in USD' },
  ]
  if (lang === 'nl') return [
    { icon: '🔒', text: 'Veilige betalingen via Stripe' },
    { icon: '↩️', text: 'Annuleer wanneer u wilt' },
    { icon: '💳', text: 'Geen kaart voor gratis plan' },
    { icon: '🌍', text: 'Facturering in USD' },
  ]
  if (lang === 'de') return [
    { icon: '🔒', text: 'Sichere Zahlungen via Stripe' },
    { icon: '↩️', text: 'Jederzeit kündbar' },
    { icon: '💳', text: 'Keine Karte für Gratis-Plan' },
    { icon: '🌍', text: 'Abrechnung in USD' },
  ]
  return [
    { icon: '🔒', text: 'Pagos seguros con Stripe' },
    { icon: '↩️', text: 'Cancela cuando quieras' },
    { icon: '💳', text: 'Sin tarjeta para plan gratis' },
    { icon: '🌍', text: 'Facturación en USD' },
  ]
}

function getTableRows(lang: Lang) {
  if (lang === 'en') return [
    { feature: 'Company profile', explorador: '✓ Basic', pro: '✓ Complete', comprador: '✓ Complete' },
    { feature: 'AI verified badge', explorador: '—', pro: '✓', comprador: '✓' },
    { feature: 'Products in catalog', explorador: '3 max.', pro: 'Unlimited', comprador: 'N/A' },
    { feature: 'Contacts/month', explorador: '3', pro: 'Unlimited', comprador: 'Unlimited' },
    { feature: 'Bilingual chat', explorador: '—', pro: '✓', comprador: '✓' },
    { feature: 'Social network', explorador: 'Read-only', pro: '✓ Post', comprador: '✓ RFQs' },
    { feature: 'Analytics dashboard', explorador: '—', pro: '✓', comprador: '✓ Market' },
    { feature: 'Search position', explorador: 'Standard', pro: '⭐ Featured', comprador: 'N/A' },
    { feature: 'Digital purchase orders', explorador: '—', pro: '—', comprador: '✓' },
    { feature: 'Account manager', explorador: '—', pro: '—', comprador: '✓ Dedicated' },
    { feature: 'Market reports', explorador: '—', pro: '—', comprador: '✓ Monthly' },
  ]
  if (lang === 'nl') return [
    { feature: 'Bedrijfsprofiel', explorador: '✓ Basis', pro: '✓ Volledig', comprador: '✓ Volledig' },
    { feature: 'AI-geverifieerd badge', explorador: '—', pro: '✓', comprador: '✓' },
    { feature: 'Producten in catalogus', explorador: '3 max.', pro: 'Onbeperkt', comprador: 'N/A' },
    { feature: 'Contacten/maand', explorador: '3', pro: 'Onbeperkt', comprador: 'Onbeperkt' },
    { feature: 'Tweetalige chat', explorador: '—', pro: '✓', comprador: '✓' },
    { feature: 'Sociaal netwerk', explorador: 'Alleen lezen', pro: '✓ Publiceren', comprador: '✓ RFQs' },
    { feature: 'Analytics dashboard', explorador: '—', pro: '✓', comprador: '✓ Markt' },
    { feature: 'Zoekpositie', explorador: 'Standaard', pro: '⭐ Uitgelicht', comprador: 'N/A' },
    { feature: 'Digitale inkooporders', explorador: '—', pro: '—', comprador: '✓' },
    { feature: 'Accountmanager', explorador: '—', pro: '—', comprador: '✓ Toegewijd' },
    { feature: 'Marktrapporten', explorador: '—', pro: '—', comprador: '✓ Maandelijks' },
  ]
  if (lang === 'de') return [
    { feature: 'Unternehmensprofil', explorador: '✓ Basic', pro: '✓ Vollständig', comprador: '✓ Vollständig' },
    { feature: 'KI-verifiziertes Badge', explorador: '—', pro: '✓', comprador: '✓' },
    { feature: 'Produkte im Katalog', explorador: '3 max.', pro: 'Unbegrenzt', comprador: 'N/A' },
    { feature: 'Kontakte/Monat', explorador: '3', pro: 'Unbegrenzt', comprador: 'Unbegrenzt' },
    { feature: 'Zweisprachiger Chat', explorador: '—', pro: '✓', comprador: '✓' },
    { feature: 'Soziales Netzwerk', explorador: 'Nur lesen', pro: '✓ Posten', comprador: '✓ RFQs' },
    { feature: 'Analytics Dashboard', explorador: '—', pro: '✓', comprador: '✓ Markt' },
    { feature: 'Suchposition', explorador: 'Standard', pro: '⭐ Hervorgehoben', comprador: 'N/A' },
    { feature: 'Digitale Bestellungen', explorador: '—', pro: '—', comprador: '✓' },
    { feature: 'Account-Manager', explorador: '—', pro: '—', comprador: '✓ Dediziert' },
    { feature: 'Marktberichte', explorador: '—', pro: '—', comprador: '✓ Monatlich' },
  ]
  return [
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
  ]
}

export default function PricingPage() {
  usePageMeta()
  const { lang } = useLang()
  const i = pricingI18n[lang as Lang]
  const tableRows = getTableRows(lang as Lang)
  const trustBadges = getTrustBadges(lang as Lang)

  const plans = [
    {
      id: 'explorador',
      eyebrow: i.plans.explorador.eyebrow,
      name: i.plans.explorador.name,
      price: '$0',
      period: i.plans.explorador.period,
      desc: i.plans.explorador.desc,
      features: i.plans.explorador.features.map((text, idx) => ({ text, included: idx < 4 })),
      cta: i.plans.explorador.cta,
      ctaLink: '/registro',
      isExternal: false,
      highlight: false,
    },
    {
      id: 'pro',
      eyebrow: i.plans.pro.eyebrow,
      name: i.plans.pro.name,
      price: preLaunch ? '$59' : '$99',
      originalPrice: preLaunch ? '$99' : undefined,
      period: i.plans.pro.period,
      desc: i.plans.pro.desc,
      features: i.plans.pro.features.map(text => ({ text, included: true })),
      cta: preLaunch ? i.plans.pro.cta_pre : i.plans.pro.cta_post,
      ctaLink: STRIPE_LINKS.pro,
      isExternal: true,
      highlight: true,
      badge: getBadge(lang as Lang),
    },
    {
      id: 'comprador',
      eyebrow: i.plans.comprador.eyebrow,
      name: i.plans.comprador.name,
      price: preLaunch ? '$149' : '$249',
      originalPrice: preLaunch ? '$249' : undefined,
      period: i.plans.comprador.period,
      desc: i.plans.comprador.desc,
      features: i.plans.comprador.features.map(text => ({ text, included: true })),
      cta: preLaunch ? i.plans.comprador.cta_pre : i.plans.comprador.cta_post,
      ctaLink: STRIPE_LINKS.comprador,
      isExternal: true,
      highlight: false,
    },
  ]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '80vh' }}>
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '3.5rem 1.5rem 0' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          {preLaunch && (
            <div style={{ display: 'inline-block', background: 'var(--teal)', color: '#fff', padding: '6px 18px', borderRadius: 100, fontSize: '13px', fontWeight: 700, marginBottom: '1.25rem' }}>
              {i.badge_prelaunch}
            </div>
          )}
          <h1 style={{ fontSize: 'clamp(1.75rem,5vw,3rem)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.1, marginBottom: '.75rem' }}>
            {i.title}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{i.sub}</p>
        </div>

        <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', alignItems: 'start' }}>
          {plans.map(plan => (
            <div key={plan.id} style={{
              borderRadius: 16, border: plan.highlight ? 'none' : '1px solid var(--border)',
              background: plan.highlight ? '#0F172A' : 'var(--white)',
              color: plan.highlight ? '#fff' : 'var(--text)',
              padding: '2rem', position: 'relative',
              display: 'flex', flexDirection: 'column', gap: '1.25rem',
              boxShadow: plan.highlight ? '0 20px 60px rgba(13,148,136,.25)' : 'var(--shadow-sm)',
            }}>
              {plan.badge && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--teal)', color: '#fff', padding: '5px 16px', borderRadius: 100, fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {plan.badge}
                </div>
              )}
              <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.1em', color: plan.highlight ? '#5EEAD4' : 'var(--teal)', textTransform: 'uppercase' }}>
                {plan.eyebrow}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1, color: plan.highlight ? '#fff' : 'var(--text)' }}>{plan.price}</span>
                  {plan.originalPrice && <span style={{ fontSize: '1.1rem', fontWeight: 500, color: 'rgba(255,255,255,.4)', textDecoration: 'line-through' }}>{plan.originalPrice}</span>}
                  <span style={{ fontSize: '14px', color: plan.highlight ? 'rgba(255,255,255,.6)' : 'var(--text-muted)', marginLeft: 4 }}>{plan.period}</span>
                </div>
                <p style={{ fontSize: '13px', color: plan.highlight ? 'rgba(255,255,255,.65)' : 'var(--text-muted)', marginTop: 8, lineHeight: 1.55 }}>{plan.desc}</p>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {plan.features.map((f, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '13px', color: f.included ? (plan.highlight ? 'rgba(255,255,255,.9)' : 'var(--text)') : (plan.highlight ? 'rgba(255,255,255,.3)' : 'var(--text-muted)') }}>
                    <span style={{ color: f.included ? 'var(--green)' : (plan.highlight ? 'rgba(255,255,255,.25)' : 'var(--border)'), fontWeight: 700, fontSize: '13px', minWidth: 16, marginTop: 1 }}>{f.included ? '✓' : '✗'}</span>
                    {f.text}
                  </li>
                ))}
              </ul>
              {plan.isExternal ? (
                <a href={plan.ctaLink} target="_blank" rel="noreferrer"
                  style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: 10, fontWeight: 700, fontSize: '14px', textDecoration: 'none', background: plan.highlight ? 'var(--teal)' : 'transparent', color: plan.highlight ? '#fff' : 'var(--teal)', border: `2px solid var(--teal)`, boxShadow: plan.highlight ? '0 4px 20px rgba(13,148,136,.4)' : 'none' }}>
                  {plan.cta}
                </a>
              ) : (
                <Link to={plan.ctaLink}
                  style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: 10, fontWeight: 700, fontSize: '14px', textDecoration: 'none', background: 'var(--teal)', color: '#fff', border: '2px solid var(--teal)' }}>
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Coupon banner */}
        <div style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFFBEB)', border: '2px dashed #F59E0B', borderRadius: 14, padding: '1rem 1.5rem', margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontSize: '1.5rem' }}>🎟️</span>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#92400E' }}>
              {lang === 'es' ? '¡Cupón de descuento disponible!' : lang === 'nl' ? 'Kortingscode beschikbaar!' : lang === 'de' ? 'Rabattcode verfügbar!' : 'Discount coupon available!'}
            </div>
            <div style={{ fontSize: 12, color: '#78350F', marginTop: 2 }}>
              {lang === 'es' ? 'Ingresa el código al momento del pago y obtén' : lang === 'nl' ? 'Voer de code in bij betaling en ontvang' : lang === 'de' ? 'Geben Sie den Code beim Bezahlen ein und erhalten Sie' : 'Enter the code at checkout and get'}{' '}
              <strong style={{ color: '#D97706' }}>20% de descuento</strong>
            </div>
          </div>
          <div style={{ background: '#FEF3C7', border: '2px solid #F59E0B', borderRadius: 10, padding: '8px 20px', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 900, color: '#92400E', letterSpacing: 3 }}>
            URZ34
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', margin: '1.5rem 0', flexWrap: 'wrap' }}>
          {trustBadges.map((b, i) => (
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
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{i.table_title}</h2>
          </div>
          <div className="table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--surface2)' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>{i.table_feature}</th>
                  {plans.map(p => (
                    <th key={p.id} style={{ padding: '12px 20px', textAlign: 'center', fontWeight: 700, color: p.highlight ? 'var(--teal)' : 'var(--text)' }}>{p.eyebrow}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, idx) => (
                  <tr key={idx} style={{ borderTop: '1px solid var(--border)', background: idx % 2 === 0 ? 'transparent' : 'rgba(248,250,252,.6)' }}>
                    <td style={{ padding: '10px 20px', color: 'var(--text)', fontWeight: 500 }}>{row.feature}</td>
                    <td style={{ padding: '10px 20px', textAlign: 'center', color: row.explorador === '—' ? 'var(--border)' : 'var(--text-muted)' }}>{row.explorador}</td>
                    <td style={{ padding: '10px 20px', textAlign: 'center', color: row.pro.startsWith('✓') ? 'var(--green)' : row.pro === '—' ? 'var(--border)' : 'var(--text)', fontWeight: row.pro.startsWith('✓') ? 600 : 400 }}>{row.pro}</td>
                    <td style={{ padding: '10px 20px', textAlign: 'center', color: row.comprador.startsWith('✓') ? 'var(--green)' : row.comprador === '—' ? 'var(--border)' : 'var(--text)', fontWeight: row.comprador.startsWith('✓') ? 600 : 400 }}>{row.comprador}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Guarantee */}
        <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--teal-light)', borderRadius: 'var(--radius)', marginTop: '1.5rem', border: '1px solid rgba(13,148,136,.2)' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--teal)', marginBottom: 4 }}>{i.guarantee}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{i.guarantee_sub}</div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>{i.faq_title}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          {i.faqs.map((item, idx) => (
            <details key={idx} style={{ background: 'var(--white)' }}>
              <summary style={{ padding: '1rem 1.25rem', cursor: 'pointer', fontWeight: 600, fontSize: '14px', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}>
                {item.q}
                <span style={{ color: 'var(--teal)', fontSize: '1.1rem', flexShrink: 0, marginLeft: '1rem' }}>+</span>
              </summary>
              <div style={{ padding: '0 1.25rem 1rem', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>{item.a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}

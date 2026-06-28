import { useSearchParams, Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useT } from '../lib/translations'

const PLAN_INFO: Record<string, { name: string; price: string; icon: string; color: string }> = {
  pro:        { name: 'Pro Exportador', price: '$59 USD/mes', icon: '🏭', color: 'var(--teal)' },
  comprador:  { name: 'Comprador EU',   price: '$149 USD/mes', icon: '🇪🇺', color: 'var(--navy)' },
  explorador: { name: 'Explorador',     price: 'Gratis',       icon: '🌐', color: 'var(--text-muted)' },
}

export default function ThankYouPage() {
  const [params] = useSearchParams()
  const plan = params.get('plan') || 'pro'
  const info = PLAN_INFO[plan] || PLAN_INFO.pro
  const { lang } = useLang()
  const T = useT(lang)

  const steps = [
    T('thanks_step1'),
    T('thanks_step2'),
    T('thanks_step3'),
  ]

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: 540, textAlign: 'center' }}>

        {/* Success animation */}
        <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'var(--green-light)', border: '4px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.75rem', boxShadow: '0 0 0 8px rgba(22,163,74,.1)' }}>
          ✓
        </div>

        <h1 style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
          {T('thanks_title')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: '2rem', lineHeight: 1.7 }}>
          {T('thanks_sub')}
        </p>

        {/* Plan badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'var(--white)', border: `2px solid ${info.color}20`, borderRadius: 14, padding: '1rem 1.75rem', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '2rem' }}>{info.icon}</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: info.color }}>{info.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{info.price} · {lang === 'es' ? 'Activo' : lang === 'nl' ? 'Actief' : lang === 'de' ? 'Aktiv' : 'Active'}</div>
          </div>
          <span style={{ fontSize: 20, color: 'var(--green)', marginLeft: 4 }}>✓</span>
        </div>

        {/* Steps */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.75rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text)' }}>
            {T('thanks_next')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--teal-light)', border: '2px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: 'var(--teal)', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, paddingTop: 2 }}>{step}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
          <Link to="/dashboard" className="btn btn-primary" style={{ padding: '13px', fontSize: 15, display: 'block' }}>
            {T('thanks_dashboard')}
          </Link>
          <Link to="/catalogo" className="btn btn-ghost" style={{ padding: '11px', fontSize: 14, display: 'block' }}>
            {T('thanks_catalog')}
          </Link>
        </div>

        {/* Receipt note */}
        <div style={{ marginTop: '1.5rem', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
          {lang === 'es' ? '📧 Recibirás un recibo por correo electrónico desde Stripe. Si tienes preguntas sobre tu suscripción, escríbenos a ' :
           lang === 'nl' ? '📧 U ontvangt een ontvangstbewijs per e-mail van Stripe. Voor vragen over uw abonnement, schrijf ons op ' :
           lang === 'de' ? '📧 Sie erhalten eine Quittung per E-Mail von Stripe. Bei Fragen zu Ihrem Abonnement schreiben Sie uns an ' :
           '📧 You will receive a receipt by email from Stripe. For questions about your subscription, write to '}
          <a href="mailto:pagos@nexusstrategy.online" style={{ color: 'var(--teal)', fontWeight: 600 }}>pagos@nexusstrategy.online</a>
        </div>
      </div>
    </div>
  )
}

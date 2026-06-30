import { useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import type { Lang } from '../context/LangContext'

const PLAN_INFO: Record<string, { name: string; price: string; pricePost: string; icon: string; color: string; role: string }> = {
  pro:        { name: 'Pro Exportador', price: '$59 USD/mes', pricePost: '$99 USD/mes', icon: '🏭', color: '#0D9488', role: 'productor' },
  comprador:  { name: 'Comprador EU',   price: '$149 USD/mes', pricePost: '$249 USD/mes', icon: '🇪🇺', color: '#1E3A5F', role: 'comprador' },
  explorador: { name: 'Explorador',     price: 'Gratis', pricePost: 'Gratis',          icon: '🌐', color: '#64748B', role: 'productor' },
}

const COPY: Record<Lang, {
  title: string; sub: string; planActive: string; nextTitle: string
  steps_pro: string[]; steps_buyer: string[]
  dashBtn: string; catalogBtn: string; receipt: string; email: string
  launchNote: string; supportNote: string
}> = {
  es: {
    title: '¡Registro confirmado! Bienvenido a Global Nexus',
    sub: 'Tu tarjeta está registrada. No se realizará ningún cargo hasta el 29 de septiembre de 2026. Tu perfil se publicará automáticamente el 28 de agosto.',
    planActive: 'Activo · Primer cobro 29 Sep',
    nextTitle: '¿Qué sigue ahora?',
    steps_pro: [
      'Completa tu perfil de productor: foto, descripción de empresa, ubicación y WhatsApp.',
      'Sube tus productos con fotos, precios y MOQ. Cuantos más detalles, más conexiones.',
      'Agrega tus certificaciones (NOM, SENASICA, Orgánico...) para aumentar tu visibilidad.',
      'El 28 de agosto de 2026 tu perfil se activa y los compradores europeos podrán encontrarte.',
    ],
    steps_buyer: [
      'Completa tu perfil de comprador: país, industria, VAT/NIF y productos de interés.',
      'Guarda tus categorías de interés en "Mis Búsquedas" para cuando se active el catálogo.',
      'El 28 de agosto de 2026 tendrás acceso directo al catálogo de productores mexicanos certificados.',
      'Conecta y negocia directamente vía chat multilingüe — sin intermediarios.',
    ],
    dashBtn: '→ Ir a mi panel ahora',
    catalogBtn: 'Ver catálogo de productos',
    receipt: '📧 Recibirás un recibo de Stripe en tu correo. Para dudas sobre tu suscripción:',
    email: 'pagos@nexusstrategy.online',
    launchNote: '🚀 Lanzamiento: 28 Ago 2026 · 12:00 pm CDMX',
    supportNote: 'Soporte: soporte@nexusstrategy.online',
  },
  en: {
    title: 'Registration confirmed! Welcome to Global Nexus',
    sub: 'Your card is registered. No charge will be made until September 29, 2026. Your profile will be published automatically on August 28.',
    planActive: 'Active · First charge Sep 29',
    nextTitle: 'What\'s next?',
    steps_pro: [
      'Complete your producer profile: photo, company description, location and WhatsApp.',
      'Upload your products with photos, prices and MOQ. More details = more connections.',
      'Add your certifications (NOM, SENASICA, Organic...) to increase visibility.',
      'On August 28, 2026 your profile activates and European buyers can find you.',
    ],
    steps_buyer: [
      'Complete your buyer profile: country, industry, VAT number and products of interest.',
      'Save your interest categories in "My Searches" for when the catalog activates.',
      'On August 28, 2026 you\'ll have direct access to the certified Mexican producers catalog.',
      'Connect and negotiate directly via multilingual chat — no intermediaries.',
    ],
    dashBtn: '→ Go to my panel now',
    catalogBtn: 'Browse product catalog',
    receipt: '📧 You\'ll receive a Stripe receipt by email. For subscription questions:',
    email: 'pagos@nexusstrategy.online',
    launchNote: '🚀 Launch: Aug 28, 2026 · 12:00 pm CDMX',
    supportNote: 'Support: soporte@nexusstrategy.online',
  },
  nl: {
    title: 'Registratie bevestigd! Welkom bij Global Nexus',
    sub: 'Uw kaart is geregistreerd. Er wordt geen bedrag afgeschreven vóór 29 september 2026. Uw profiel wordt automatisch gepubliceerd op 28 augustus.',
    planActive: 'Actief · Eerste betaling 29 sep',
    nextTitle: 'Wat nu?',
    steps_pro: [
      'Vul uw producentenprofiel in: foto, bedrijfsbeschrijving, locatie en WhatsApp.',
      'Upload uw producten met foto\'s, prijzen en MOQ. Meer details = meer verbindingen.',
      'Voeg uw certificeringen toe (NOM, SENASICA, Biologisch...) om uw zichtbaarheid te vergroten.',
      'Op 28 augustus 2026 wordt uw profiel geactiveerd en kunnen Europese kopers u vinden.',
    ],
    steps_buyer: [
      'Vul uw kopersprofiel in: land, industrie, BTW-nummer en interesseproducten.',
      'Sla uw interessecategorieën op in "Mijn Zoekopdrachten" voor wanneer de catalogus actief wordt.',
      'Op 28 augustus 2026 heeft u directe toegang tot de catalogus van gecertificeerde Mexicaanse producenten.',
      'Verbind en onderhandel direct via meertalige chat — geen tussenpersonen.',
    ],
    dashBtn: '→ Naar mijn dashboard',
    catalogBtn: 'Productencatalogus bekijken',
    receipt: '📧 U ontvangt een Stripe-ontvangstbewijs per e-mail. Voor vragen over uw abonnement:',
    email: 'pagos@nexusstrategy.online',
    launchNote: '🚀 Lancering: 28 aug 2026 · 12:00 uur CDMX',
    supportNote: 'Ondersteuning: soporte@nexusstrategy.online',
  },
  de: {
    title: 'Registrierung bestätigt! Willkommen bei Global Nexus',
    sub: 'Ihre Karte ist registriert. Es wird keine Zahlung vor dem 29. September 2026 erhoben. Ihr Profil wird automatisch am 28. August veröffentlicht.',
    planActive: 'Aktiv · Erste Zahlung 29. Sep',
    nextTitle: 'Was kommt als nächstes?',
    steps_pro: [
      'Vervollständigen Sie Ihr Produzentenprofil: Foto, Unternehmensbeschreibung, Standort und WhatsApp.',
      'Laden Sie Ihre Produkte mit Fotos, Preisen und MOQ hoch. Mehr Details = mehr Verbindungen.',
      'Fügen Sie Ihre Zertifizierungen hinzu (NOM, SENASICA, Bio...) um Ihre Sichtbarkeit zu erhöhen.',
      'Am 28. August 2026 wird Ihr Profil aktiviert und europäische Käufer können Sie finden.',
    ],
    steps_buyer: [
      'Vervollständigen Sie Ihr Käuferprofil: Land, Branche, USt-IdNr. und Interessensprodukte.',
      'Speichern Sie Ihre Interessenskategorien unter "Meine Suchen" für die Aktivierung des Katalogs.',
      'Am 28. August 2026 haben Sie direkten Zugang zum Katalog zertifizierter mexikanischer Produzenten.',
      'Verbinden und verhandeln Sie direkt über mehrsprachigen Chat — ohne Zwischenhändler.',
    ],
    dashBtn: '→ Zu meinem Dashboard',
    catalogBtn: 'Produktkatalog ansehen',
    receipt: '📧 Sie erhalten eine Stripe-Quittung per E-Mail. Bei Fragen zu Ihrem Abonnement:',
    email: 'pagos@nexusstrategy.online',
    launchNote: '🚀 Launch: 28. Aug 2026 · 12:00 Uhr CDMX',
    supportNote: 'Support: soporte@nexusstrategy.online',
  },
}

export default function ThankYouPage() {
  const [params] = useSearchParams()
  const { lang } = useLang()
  const navigate = useNavigate()
  const C = COPY[lang as Lang] || COPY.es

  // Stripe sends ?plan= from the Payment Link redirect URL
  const plan = params.get('plan') || 'pro'
  const info = PLAN_INFO[plan] || PLAN_INFO.pro
  const isBuyer = info.role === 'comprador'
  const steps = isBuyer ? C.steps_buyer : C.steps_pro
  const dashPath = isBuyer ? '/dashboard-comprador' : '/dashboard'

  // Auto-update user role in localStorage if they just paid
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('gn_current_user') || 'null')
      if (user) {
        const updated = { ...user, plan, planActive: true }
        localStorage.setItem('gn_current_user', JSON.stringify(updated))
      }
    } catch { /* ignore */ }
  }, [plan])

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #F0FDFA 0%, #EFF6FF 50%, #F8FAFC 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: 560 }}>

        {/* Success icon */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: '#DCFCE7', border: '4px solid #16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem', boxShadow: '0 0 0 10px rgba(22,163,74,.08)', animation: 'pop .4s cubic-bezier(.175,.885,.32,1.275)' }}>
            ✓
          </div>
          <h1 style={{ fontSize: 'clamp(1.35rem,4vw,1.75rem)', fontWeight: 900, marginBottom: '.75rem', color: '#0F172A', lineHeight: 1.2 }}>
            {C.title}
          </h1>
          <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.7, maxWidth: 440, margin: '0 auto' }}>{C.sub}</p>
        </div>

        {/* Plan badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: `2px solid ${info.color}25`, borderRadius: 14, padding: '1.1rem 1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
          <div style={{ width: 50, height: 50, borderRadius: 13, background: `${info.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>{info.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: info.color }}>{info.name}</div>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>{info.price} · <span style={{ color: '#16A34A', fontWeight: 700 }}>✓ {C.planActive}</span></div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100, background: '#DCFCE7', color: '#16A34A', border: '1px solid #86EFAC' }}>
            {lang === 'es' ? '✓ ACTIVO' : lang === 'nl' ? '✓ ACTIEF' : lang === 'de' ? '✓ AKTIV' : '✓ ACTIVE'}
          </div>
        </div>

        {/* No charge banner */}
        <div style={{ background: 'linear-gradient(135deg, #ECFDF5, #F0FDF4)', border: '2px solid #86EFAC', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1rem', display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: '1.5rem' }}>🎁</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 13, color: '#166534' }}>
              {lang === 'es' ? '¡Sin cargos hasta el 29 de septiembre!' : lang === 'nl' ? 'Geen kosten tot 29 september!' : lang === 'de' ? 'Keine Gebühren bis 29. September!' : 'No charges until September 29!'}
            </div>
            <div style={{ fontSize: 12, color: '#15803D', marginTop: 2 }}>
              {lang === 'es' ? 'Tu tarjeta está registrada pero no se cobrará nada hasta el 29 Sep 2026 — un mes después del lanzamiento.' : lang === 'nl' ? 'Uw kaart is geregistreerd maar er wordt niets afgeschreven tot 29 sep 2026.' : lang === 'de' ? 'Ihre Karte ist registriert, aber es wird nichts bis 29. Sep 2026 abgerechnet.' : 'Your card is registered but nothing will be charged until Sep 29, 2026 — one month after launch.'}
            </div>
          </div>
        </div>

        {/* Launch countdown note */}
        <div style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFFBEB)', border: '1.5px solid #FCD34D', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: '1.3rem' }}>🚀</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#92400E' }}>{C.launchNote}</div>
            <div style={{ fontSize: 12, color: '#78350F', marginTop: 2 }}>{lang === 'es' ? 'Tu perfil y productos se publicarán automáticamente en esa fecha.' : lang === 'nl' ? 'Uw profiel en producten worden op die datum automatisch gepubliceerd.' : lang === 'de' ? 'Ihr Profil und Produkte werden an diesem Datum automatisch veröffentlicht.' : 'Your profile and products will be automatically published on that date.'}</div>
          </div>
        </div>

        {/* Next steps */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: '1.1rem', color: '#0F172A' }}>📋 {C.nextTitle}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#CCFBF1', border: '2px solid #0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#0D9488', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <div style={{ fontSize: 13, color: '#0F172A', lineHeight: 1.65, paddingTop: 3 }}>{step}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate(dashPath)}
            style={{ padding: '14px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg, #0D9488, #1E3A5F)`, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 20px rgba(13,148,136,.3)' }}
          >
            {C.dashBtn}
          </button>
          <Link to="/catalogo" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 12, border: '1.5px solid #E2E8F0', background: 'transparent', color: '#64748B', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
            {C.catalogBtn}
          </Link>
        </div>

        {/* Receipt + support */}
        <div style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8', lineHeight: 1.8 }}>
          <div>{C.receipt} <a href={`mailto:${C.email}`} style={{ color: '#0D9488', fontWeight: 600 }}>{C.email}</a></div>
          <div style={{ marginTop: 4 }}>{C.supportNote}</div>
          <div style={{ marginTop: 8, fontSize: 11, color: '#CBD5E1' }}>Global Nexus · nexusstrategy.online · Powered by Stripe 🔒</div>
        </div>

      </div>
      <style>{`@keyframes pop { from { transform: scale(.5); opacity:0 } to { transform: scale(1); opacity:1 } }`}</style>
    </div>
  )
}

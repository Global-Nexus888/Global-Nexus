import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'

const DISMISS_KEY = 'gn_demo_bubble_dismissed'

// Pages where the bubble is visible (public exploration)
const SHOW_ON = ['/', '/catalogo', '/productores', '/como-funciona', '/precios', '/comunidad', '/oportunidades', '/asesoria', '/faq']
const HIDE_ON_PREFIX = ['/dashboard', '/admin', '/mensajes', '/registro', '/login', '/gracias', '/verificacion']

const COPY: Record<string, {
  pill: string
  title: string
  sub: string
  benefit1: string
  benefit2: string
  benefit3: string
  cta: string
  dismiss: string
}> = {
  es: {
    pill: '🟢 Explorando la plataforma',
    title: 'TOP 20 Fundadores',
    sub: 'Estás explorando Global Nexus en modo demo. Regístrate gratis y asegura un lugar entre los primeros fundadores.',
    benefit1: '✓ Perfil activo desde el lanzamiento (28 Ago)',
    benefit2: '✓ Badge exclusivo de Fundador en tu perfil',
    benefit3: '✓ Acceso prioritario a compradores europeos',
    cta: 'Registrarme gratis →',
    dismiss: 'Ahora no',
  },
  en: {
    pill: '🟢 Exploring the platform',
    title: 'TOP 20 Founders',
    sub: 'You\'re exploring Global Nexus in demo mode. Sign up free and secure a founding member spot.',
    benefit1: '✓ Active profile from launch day (Aug 28)',
    benefit2: '✓ Exclusive Founder badge on your profile',
    benefit3: '✓ Priority access to European buyers',
    cta: 'Sign up free →',
    dismiss: 'Not now',
  },
  nl: {
    pill: '🟢 Platform verkennen',
    title: 'Toegang voor Kopers',
    sub: 'Ontdek geverifieerde Mexicaanse producenten klaar voor export naar Europa. Registreer gratis en krijg direct toegang vanaf de lancering (28 aug).',
    benefit1: '✓ Direct contact met geverifieerde producenten',
    benefit2: '✓ Exclusieve aanbiedingen voor vroege kopers',
    benefit3: '✓ Gratis toegang — geen verborgen kosten',
    cta: 'Gratis toegang aanvragen →',
    dismiss: 'Niet nu',
  },
  de: {
    pill: '🟢 Plattform erkunden',
    title: 'Zugang für Einkäufer',
    sub: 'Entdecken Sie verifizierte mexikanische Produzenten, bereit für den EU-Export. Kostenlos registrieren und ab Launch (28. Aug) direkt loslegen.',
    benefit1: '✓ Direktkontakt zu verifizierten Produzenten',
    benefit2: '✓ Exklusive Angebote für frühe Einkäufer',
    benefit3: '✓ Kostenloser Zugang — keine versteckten Gebühren',
    cta: 'Kostenlosen Zugang anfragen →',
    dismiss: 'Nicht jetzt',
  },
}

export default function DemoBubble() {
  const { lang } = useLang()
  const { pathname } = useLocation()
  const [open, setOpen]         = useState(false)
  const [visible, setVisible]   = useState(false)
  const [mounted, setMounted]   = useState(false)
  const c = COPY[lang] ?? COPY.es

  // Decide visibility
  useEffect(() => {
    const dismissed = sessionStorage.getItem(DISMISS_KEY)
    if (dismissed) { setVisible(false); return }

    const isLoggedIn = (() => {
      try { return !!JSON.parse(localStorage.getItem('gn_current_user') || 'null') } catch { return false }
    })()
    if (isLoggedIn) { setVisible(false); return }

    const hideNow = HIDE_ON_PREFIX.some(p => pathname.startsWith(p))
    setVisible(!hideNow)
  }, [pathname])

  // Entry animation delay
  useEffect(() => {
    if (!visible) { setMounted(false); return }
    const t = setTimeout(() => setMounted(true), 1200)
    return () => clearTimeout(t)
  }, [visible])

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1')
    setOpen(false)
    setVisible(false)
  }

  if (!visible) return null

  const teal   = '#0D9488'
  const green  = '#16A34A'
  const white  = '#FFFFFF'
  const text   = '#0F172A'
  const muted  = '#64748B'
  const border = '#D1FAE5'

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 20,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 8,
      // Slide-in from bottom
      transform: mounted ? 'translateY(0)' : 'translateY(20px)',
      opacity: mounted ? 1 : 0,
      transition: 'transform .4s cubic-bezier(.34,1.56,.64,1), opacity .35s ease',
      pointerEvents: mounted ? 'auto' : 'none',
    }}>

      {/* Expanded card */}
      {open && (
        <div style={{
          width: 268,
          background: white,
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(16,185,129,.18), 0 2px 8px rgba(0,0,0,.10)',
          border: `1.5px solid ${border}`,
          overflow: 'hidden',
          animation: 'gnBubbleIn .25s cubic-bezier(.34,1.56,.64,1)',
        }}>
          {/* Header strip */}
          <div style={{
            background: `linear-gradient(135deg, ${green}, ${teal})`,
            padding: '12px 14px 10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.75)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 2 }}>
                Global Nexus
              </div>
              <div style={{ fontSize: 15, fontWeight: 900, color: white, lineHeight: 1.1 }}>
                {c.title}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.18)', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
              🏅
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '12px 14px' }}>
            <p style={{ fontSize: 12, color: muted, lineHeight: 1.55, marginBottom: 10 }}>
              {c.sub}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 12 }}>
              {[c.benefit1, c.benefit2, c.benefit3].map((b, i) => (
                <div key={i} style={{ fontSize: 11.5, color: text, fontWeight: 600, display: 'flex', alignItems: 'flex-start', gap: 4, lineHeight: 1.4 }}>
                  <span style={{ color: green, flexShrink: 0 }}>{b.slice(0, 1)}</span>
                  <span>{b.slice(2)}</span>
                </div>
              ))}
            </div>

            <Link to="/registro" onClick={() => setOpen(false)}
              style={{
                display: 'block', width: '100%', textAlign: 'center',
                padding: '9px 0',
                background: `linear-gradient(135deg, ${green}, ${teal})`,
                color: white, borderRadius: 9, fontWeight: 800, fontSize: 13,
                textDecoration: 'none', letterSpacing: '.01em',
                boxShadow: `0 3px 12px ${green}40`,
                transition: 'opacity .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {c.cta}
            </Link>

            <button onClick={dismiss} style={{
              display: 'block', width: '100%', textAlign: 'center',
              marginTop: 7, padding: '5px 0',
              background: 'transparent', border: 'none',
              fontSize: 11, color: muted, cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
              {c.dismiss}
            </button>
          </div>
        </div>
      )}

      {/* Pill trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Dismiss X — only show when collapsed */}
        {!open && (
          <button onClick={dismiss} aria-label="Cerrar" style={{
            width: 22, height: 22, borderRadius: '50%',
            background: 'rgba(255,255,255,.85)', border: `1px solid ${border}`,
            color: muted, fontSize: 11, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,.10)',
            lineHeight: 1, padding: 0, fontFamily: 'inherit',
          }}>✕</button>
        )}

        <button
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '8px 14px 8px 10px',
            background: `linear-gradient(135deg, ${green}, ${teal})`,
            color: white, borderRadius: 100,
            border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 700,
            boxShadow: `0 4px 16px ${green}45, 0 1px 4px rgba(0,0,0,.12)`,
            fontFamily: 'inherit',
            transition: 'transform .15s, box-shadow .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = `0 6px 20px ${green}55, 0 1px 4px rgba(0,0,0,.14)` }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 4px 16px ${green}45, 0 1px 4px rgba(0,0,0,.12)` }}
        >
          {/* Pulsing dot */}
          <span style={{ position: 'relative', width: 8, height: 8, display: 'inline-block', flexShrink: 0 }}>
            <span style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'rgba(255,255,255,.5)',
              animation: 'gnPulse 2s ease-out infinite',
            }} />
            <span style={{
              position: 'absolute', inset: 1, borderRadius: '50%',
              background: white,
            }} />
          </span>
          {c.pill}
          <span style={{ opacity: .8, fontSize: 10 }}>{open ? '▾' : '▴'}</span>
        </button>
      </div>

      <style>{`
        @keyframes gnPulse {
          0%   { transform: scale(1); opacity: .7; }
          70%  { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes gnBubbleIn {
          from { transform: translateY(8px) scale(.96); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

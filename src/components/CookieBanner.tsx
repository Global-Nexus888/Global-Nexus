import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import type { Lang } from '../context/LangContext'

const COOKIE_KEY = 'gn_cookie_consent'

const copy: Record<Lang, {
  title: string; body: string; accept: string; decline: string; policy: string
}> = {
  es: {
    title: '🍪 Esta web usa cookies',
    body: 'Usamos cookies esenciales para el funcionamiento de la plataforma y cookies analíticas para mejorar tu experiencia. Tus datos nunca se venden a terceros. Conforme al RGPD, puedes elegir qué aceptar.',
    accept: 'Aceptar todas',
    decline: 'Solo esenciales',
    policy: 'Política de privacidad',
  },
  en: {
    title: '🍪 This site uses cookies',
    body: 'We use essential cookies for platform operation and analytics cookies to improve your experience. Your data is never sold to third parties. Under GDPR, you can choose what to accept.',
    accept: 'Accept all',
    decline: 'Essential only',
    policy: 'Privacy policy',
  },
  nl: {
    title: '🍪 Deze site gebruikt cookies',
    body: 'Wij gebruiken essentiële cookies voor platformwerking en analytische cookies om uw ervaring te verbeteren. Uw gegevens worden nooit aan derden verkocht. Onder de AVG kunt u kiezen wat u accepteert.',
    accept: 'Alles accepteren',
    decline: 'Alleen essentieel',
    policy: 'Privacybeleid',
  },
  de: {
    title: '🍪 Diese Website verwendet Cookies',
    body: 'Wir verwenden essentielle Cookies für den Plattformbetrieb und Analyse-Cookies zur Verbesserung Ihrer Erfahrung. Ihre Daten werden niemals an Dritte verkauft. Gemäß DSGVO können Sie wählen, was Sie akzeptieren.',
    accept: 'Alle akzeptieren',
    decline: 'Nur essentielle',
    policy: 'Datenschutzrichtlinie',
  },
}

export default function CookieBanner() {
  const { lang } = useLang()
  const [visible, setVisible] = useState(false)
  const t = copy[lang]

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY)
    if (!saved) setVisible(true)
  }, [])

  const accept = () => { localStorage.setItem(COOKIE_KEY, 'all'); setVisible(false) }
  const decline = () => { localStorage.setItem(COOKIE_KEY, 'essential'); setVisible(false) }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: '#0F172A', color: '#fff',
      borderTop: '2px solid var(--teal)',
      padding: 'clamp(.75rem,2vw,1.25rem) clamp(1rem,4vw,2rem)',
      display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap',
      boxShadow: '0 -4px 30px rgba(0,0,0,.35)',
    }}>
      {/* Text */}
      <div style={{ flex: 1, minWidth: 240 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: '#5EEAD4' }}>{t.title}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.72)', lineHeight: 1.55 }}>
          {t.body}{' '}
          <Link to="/privacidad" style={{ color: '#5EEAD4', fontWeight: 600, fontSize: 12 }}>{t.policy} →</Link>
        </div>
      </div>
      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
        <button onClick={decline} style={{
          padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          background: 'transparent', border: '1px solid rgba(255,255,255,.3)', color: 'rgba(255,255,255,.8)',
        }}>{t.decline}</button>
        <button onClick={accept} style={{
          padding: '9px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
          background: 'var(--teal)', border: 'none', color: '#fff',
          boxShadow: '0 2px 12px rgba(13,148,136,.4)',
        }}>{t.accept}</button>
      </div>
    </div>
  )
}

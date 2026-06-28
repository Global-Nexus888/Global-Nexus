import type { Lang } from '../types'

interface CTAFinalProps { lang: Lang; onOpenModal: (type: 'preventa' | 'demo') => void }

const CONTENT: Record<Lang, { title: string; sub: string; btnWa: string; btnEmail: string }> = {
  es: { title: '¿Listo para dejar de perder prospectos?', sub: 'Agenda una sesión de diagnóstico gratuita y te mostramos exactamente qué automatizar en tu negocio para triplicar tus conversiones en 30 días.', btnWa: '📲 Hablar por WhatsApp', btnEmail: '✉ Enviar propuesta por email' },
  en: { title: 'Ready to stop losing prospects?', sub: 'Schedule a free diagnostic session and we\'ll show you exactly what to automate in your business to triple your conversions in 30 days.', btnWa: '📲 Chat on WhatsApp', btnEmail: '✉ Send proposal by email' },
  nl: { title: 'Klaar om te stoppen met prospects verliezen?', sub: 'Plan een gratis diagnostische sessie en wij laten u precies zien wat u in uw bedrijf moet automatiseren om uw conversies in 30 dagen te verdrievoudigen.', btnWa: '📲 Chat via WhatsApp', btnEmail: '✉ Voorstel per e-mail sturen' },
  pt: { title: 'Pronto para parar de perder prospects?', sub: 'Agende uma sessão de diagnóstico gratuita e mostraremos exatamente o que automatizar em seu negócio para triplicar suas conversões em 30 dias.', btnWa: '📲 Falar pelo WhatsApp', btnEmail: '✉ Enviar proposta por email' },
}

export default function CTAFinal({ lang, onOpenModal }: CTAFinalProps) {
  const c = CONTENT[lang]
  return (
    <section style={{
      padding: '4rem 1.5rem', textAlign: 'center',
      background: 'linear-gradient(180deg, var(--void) 0%, rgba(201,168,76,.04) 50%, var(--void) 100%)',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h2 className="font-playfair" style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 700, marginBottom: '1rem' }}>
          {c.title}
        </h2>
        <p style={{ color: 'rgba(245,245,245,.55)', fontSize: '.9rem', marginBottom: '2rem', lineHeight: 1.75 }}>{c.sub}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <a
            href="https://wa.me/522218413619"
            target="_blank" rel="noreferrer"
            style={{
              background: 'linear-gradient(135deg,#25D366,#128C7E)',
              color: '#fff', padding: '.9rem 2rem', borderRadius: 8,
              fontWeight: 700, textDecoration: 'none', fontSize: '.9rem',
              letterSpacing: '.04em', display: 'flex', alignItems: 'center',
              gap: '.6rem', transition: 'opacity .2s', maxWidth: 320, width: '100%',
              justifyContent: 'center',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >{c.btnWa}</a>
          <a
            href="mailto:nexusstrategy.online"
            style={{
              border: '1px solid var(--gold)', color: 'var(--gold)',
              padding: '.9rem 2rem', borderRadius: 8, fontWeight: 600,
              textDecoration: 'none', fontSize: '.9rem', letterSpacing: '.04em',
              display: 'flex', alignItems: 'center', gap: '.6rem',
              transition: 'background .2s', maxWidth: 320, width: '100%',
              justifyContent: 'center',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >{c.btnEmail}</a>
        </div>
      </div>
    </section>
  )
}

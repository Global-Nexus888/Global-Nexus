import type { Lang } from '../types'

interface HeroProps { lang: Lang }

const CONTENT: Record<Lang, {
  eyebrow: string; h1: string[]; h1gold: string; sub: string; btn1: string; btn2: string
}> = {
  es: {
    eyebrow: 'Estrategia · Automatización · Conexión Global',
    h1: ['Haz que tu negocio', 'trabaje '],
    h1gold: 'mientras duermes',
    sub: 'Implementamos infraestructura digital de alto valor: formularios inteligentes, CRM con voz nativa y automatizaciones que capturan, segmentan y convierten prospectos 24/7 — sin quemar capital en personal.',
    btn1: '📲 Hablar con un experto',
    btn2: '✉ Enviar propuesta',
  },
  en: {
    eyebrow: 'Strategy · Automation · Global Connection',
    h1: ['Make your business', 'work '],
    h1gold: 'while you sleep',
    sub: 'We implement high-value digital infrastructure: smart forms, native-voice CRM and automations that capture, segment and convert prospects 24/7 — without burning capital on staff.',
    btn1: '📲 Talk to an expert',
    btn2: '✉ Send proposal',
  },
  nl: {
    eyebrow: 'Strategie · Automatisering · Mondiale Verbinding',
    h1: ['Laat uw bedrijf', 'werken '],
    h1gold: 'terwijl u slaapt',
    sub: 'Wij implementeren hoogwaardige digitale infrastructuur: slimme formulieren, CRM met native stem en automatiseringen die prospects 24/7 vastleggen, segmenteren en converteren.',
    btn1: '📲 Spreek met een expert',
    btn2: '✉ Voorstel sturen',
  },
  pt: {
    eyebrow: 'Estratégia · Automação · Conexão Global',
    h1: ['Faça seu negócio', 'trabalhar '],
    h1gold: 'enquanto você dorme',
    sub: 'Implementamos infraestrutura digital de alto valor: formulários inteligentes, CRM com voz nativa e automações que capturam, segmentam e convertem prospects 24/7 — sem queimar capital em pessoal.',
    btn1: '📲 Falar com um especialista',
    btn2: '✉ Enviar proposta',
  },
}

export default function Hero({ lang }: HeroProps) {
  const c = CONTENT[lang]
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        textAlign: 'center', padding: '6rem 1.5rem 4rem',
        background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(79,195,247,.06) 0%, transparent 70%),
                     radial-gradient(ellipse 60% 40% at 80% 80%, rgba(201,168,76,.05) 0%, transparent 60%)`,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.012'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
        opacity: .4, pointerEvents: 'none',
      }} />

      {/* Pulse rings */}
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        border: '1px solid rgba(201,168,76,.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '2rem', animation: 'pulse 3s ease-in-out infinite',
      }}>
        <div style={{
          width: 55, height: 55, borderRadius: '50%',
          border: '1px solid rgba(79,195,247,.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulse 3s ease-in-out infinite .5s',
          fontSize: '1.5rem',
        }}>🌐</div>
      </div>

      {/* Eyebrow */}
      <div className="font-mono-jb" style={{
        fontSize: '.7rem', letterSpacing: '.25em',
        color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', gap: '.75rem',
      }}>
        <span style={{ height: 1, width: 40, background: 'var(--gold)', opacity: .5, display: 'inline-block' }} />
        {c.eyebrow}
        <span style={{ height: 1, width: 40, background: 'var(--gold)', opacity: .5, display: 'inline-block' }} />
      </div>

      {/* H1 */}
      <h1 className="font-playfair" style={{
        fontSize: 'clamp(2.2rem, 7vw, 4.8rem)', fontWeight: 900,
        lineHeight: 1.05, letterSpacing: '-.02em',
        marginBottom: '1.5rem', maxWidth: 900,
      }}>
        {c.h1[0]}<br />{c.h1[1]}<span className="gold-text">{c.h1gold}</span>
      </h1>

      {/* Sub */}
      <p style={{
        fontSize: 'clamp(.95rem, 2.5vw, 1.15rem)', color: 'rgba(245,245,245,.6)',
        maxWidth: 560, lineHeight: 1.75, marginBottom: '2.5rem', fontWeight: 300,
      }}>{c.sub}</p>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a
          href="https://wa.me/522218413619"
          target="_blank" rel="noreferrer"
          className="gold-gradient"
          style={{
            color: '#0A0A0F', padding: '.85rem 2rem', borderRadius: 8,
            fontWeight: 700, textDecoration: 'none', fontSize: '.9rem',
            letterSpacing: '.05em', transition: 'transform .2s, opacity .2s', display: 'inline-block',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.opacity = '.9' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.opacity = '1' }}
        >{c.btn1}</a>
        <a
          href="mailto:brandmkrs.ads@gmail.com"
          style={{
            border: '1px solid var(--gold)', color: 'var(--gold)',
            padding: '.85rem 2rem', borderRadius: 8, fontWeight: 600,
            textDecoration: 'none', fontSize: '.9rem', letterSpacing: '.05em',
            transition: 'background .2s', display: 'inline-block',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >{c.btn2}</a>
      </div>
    </section>
  )
}

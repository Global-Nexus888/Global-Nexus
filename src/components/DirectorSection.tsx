import type { Lang } from '../types'

interface DirectorSectionProps { lang: Lang }

const CONTENT: Record<Lang, { eyebrow: string; bio: string; quote: string }> = {
  es: {
    eyebrow: 'Fundador & Director',
    bio: 'Estratega digital con más de 8 años de experiencia implementando infraestructura de automatización para empresas en México, Europa y Latinoamérica. Especialista en conectar mercados globales con sistemas digitales de alto rendimiento.',
    quote: '"Cada empresa tiene prospectos que está perdiendo en este momento. Nuestro trabajo es detener esa fuga y convertirla en un sistema que trabaja 24/7 para ti."',
  },
  en: {
    eyebrow: 'Founder & Director',
    bio: 'Digital strategist with over 8 years of experience implementing automation infrastructure for companies in Mexico, Europe and Latin America. Specialist in connecting global markets with high-performance digital systems.',
    quote: '"Every company has prospects it\'s losing right now. Our job is to stop that leak and turn it into a system that works 24/7 for you."',
  },
  nl: {
    eyebrow: 'Oprichter & Directeur',
    bio: 'Digitale strateeg met meer dan 8 jaar ervaring in het implementeren van automatiseringsinfrastructuur voor bedrijven in Mexico, Europa en Latijns-Amerika.',
    quote: '"Elk bedrijf verliest op dit moment prospects. Onze taak is die lek te stoppen en er een systeem van te maken dat 24/7 voor u werkt."',
  },
  pt: {
    eyebrow: 'Fundador & Diretor',
    bio: 'Estrategista digital com mais de 8 anos de experiência implementando infraestrutura de automação para empresas no México, Europa e América Latina.',
    quote: '"Toda empresa tem prospects que está perdendo agora. Nosso trabalho é parar esse vazamento e transformá-lo em um sistema que trabalha 24/7 para você."',
  },
}

export default function DirectorSection({ lang }: DirectorSectionProps) {
  const c = CONTENT[lang]
  return (
    <section style={{ padding: '4rem 1.5rem', background: 'var(--panel)', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', textAlign: 'center' }}>
        {/* Photo */}
        <div style={{ width: 180, height: 180, borderRadius: '50%', border: '2px solid var(--gold)', overflow: 'hidden', boxShadow: '0 0 40px rgba(201,168,76,.15)', flexShrink: 0, background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '4rem' }}>👤</span>
        </div>

        <div>
          <span className="font-mono-jb" style={{ fontSize: '.65rem', letterSpacing: '.25em', color: 'var(--gold)', textTransform: 'uppercase', display: 'block', marginBottom: '.75rem' }}>
            {c.eyebrow}
          </span>
          <div className="font-playfair" style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '.25rem' }}>
            Gabriel Morales
          </div>
          <div className="font-mono-jb" style={{ fontSize: '.7rem', letterSpacing: '.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            CEO · Global Nexus
          </div>
          <p style={{ fontSize: '.88rem', color: 'rgba(245,245,245,.6)', lineHeight: 1.75, maxWidth: 480 }}>{c.bio}</p>

          <blockquote style={{
            marginTop: '1.25rem', padding: '1.25rem',
            background: 'rgba(201,168,76,.06)', borderLeft: '3px solid var(--gold)',
            borderRadius: '0 8px 8px 0', textAlign: 'left',
            fontStyle: 'italic', fontSize: '.88rem',
            color: 'rgba(245,245,245,.75)', lineHeight: 1.75,
          }}>
            {c.quote}
          </blockquote>
        </div>
      </div>
    </section>
  )
}

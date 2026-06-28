import type { Lang } from '../types'

interface PricingSectionProps { lang: Lang; onOpenModal: (type: 'preventa' | 'demo') => void }

const CONTENT: Record<Lang, {
  eyebrow: string; title: string; sub: string
  plans: { name: string; price: string; period: string; desc: string; features: string[]; cta: string; highlight?: boolean }[]
}> = {
  es: {
    eyebrow: 'Planes', title: 'Inversión que se paga sola', sub: 'Sin contratos anuales. Sin sorpresas. Cancela cuando quieras.',
    plans: [
      { name: 'Starter', price: '$890', period: '/mes', desc: 'Para negocios que quieren automatizar lo esencial y empezar a capturar prospectos 24/7.', features: ['1 formulario inteligente', 'CRM básico integrado', 'Notificaciones WhatsApp', 'Reportes semanales', 'Soporte en 24h'], cta: 'Comenzar ahora' },
      { name: 'Growth', price: '$1,890', period: '/mes', desc: 'Para empresas listas para escalar con automatización multicanal y voz nativa.', features: ['3 formularios inteligentes', 'CRM + Voz nativa (2 idiomas)', 'Automatización multi-canal', 'A/B testing', 'Dashboard en tiempo real', 'Soporte prioritario 12h'], cta: 'Activar preventa', highlight: true },
      { name: 'Enterprise', price: 'Custom', period: '', desc: 'Solución completa para operaciones multinacionales con infraestructura a medida.', features: ['Formularios ilimitados', 'CRM + Voz 4+ idiomas', 'Infraestructura dedicada', 'Integración API completa', 'Gerente de cuenta dedicado', 'SLA garantizado 99.9%'], cta: 'Agendar llamada' },
    ],
  },
  en: {
    eyebrow: 'Plans', title: 'Investment that pays for itself', sub: 'No annual contracts. No surprises. Cancel anytime.',
    plans: [
      { name: 'Starter', price: '$890', period: '/mo', desc: 'For businesses that want to automate the essentials and start capturing prospects 24/7.', features: ['1 smart form', 'Basic integrated CRM', 'WhatsApp notifications', 'Weekly reports', '24h support'], cta: 'Start now' },
      { name: 'Growth', price: '$1,890', period: '/mo', desc: 'For companies ready to scale with multi-channel automation and native voice.', features: ['3 smart forms', 'CRM + Native voice (2 languages)', 'Multi-channel automation', 'A/B testing', 'Real-time dashboard', '12h priority support'], cta: 'Activate pre-sale', highlight: true },
      { name: 'Enterprise', price: 'Custom', period: '', desc: 'Complete solution for multinational operations with custom infrastructure.', features: ['Unlimited forms', 'CRM + Voice 4+ languages', 'Dedicated infrastructure', 'Full API integration', 'Dedicated account manager', 'Guaranteed 99.9% SLA'], cta: 'Schedule call' },
    ],
  },
  nl: {
    eyebrow: 'Plannen', title: 'Investering die zichzelf terugbetaalt', sub: 'Geen jaarcontracten. Geen verrassingen. Annuleer wanneer u wilt.',
    plans: [
      { name: 'Starter', price: '$890', period: '/mnd', desc: 'Voor bedrijven die het essentiële willen automatiseren en 24/7 prospects willen vastleggen.', features: ['1 slim formulier', 'Basis geïntegreerd CRM', 'WhatsApp-meldingen', 'Wekelijkse rapporten', '24u ondersteuning'], cta: 'Nu beginnen' },
      { name: 'Growth', price: '$1.890', period: '/mnd', desc: 'Voor bedrijven klaar om te schalen met multi-channel automatisering en native stem.', features: ['3 slimme formulieren', 'CRM + Native stem (2 talen)', 'Multi-channel automatisering', 'A/B-testen', 'Realtime dashboard', '12u prioritaire ondersteuning'], cta: 'Activeer pre-sale', highlight: true },
      { name: 'Enterprise', price: 'Custom', period: '', desc: 'Volledige oplossing voor multinationale operaties met maatwerkinfrastructuur.', features: ['Onbeperkte formulieren', 'CRM + Stem 4+ talen', 'Dedicated infrastructuur', 'Volledige API-integratie', 'Dedicated accountmanager', 'Gegarandeerde 99,9% SLA'], cta: 'Gesprek inplannen' },
    ],
  },
  pt: {
    eyebrow: 'Planos', title: 'Investimento que se paga sozinho', sub: 'Sem contratos anuais. Sem surpresas. Cancele quando quiser.',
    plans: [
      { name: 'Starter', price: '$890', period: '/mês', desc: 'Para negócios que querem automatizar o essencial e começar a capturar prospects 24/7.', features: ['1 formulário inteligente', 'CRM básico integrado', 'Notificações WhatsApp', 'Relatórios semanais', 'Suporte em 24h'], cta: 'Começar agora' },
      { name: 'Growth', price: '$1.890', period: '/mês', desc: 'Para empresas prontas para escalar com automação multicanal e voz nativa.', features: ['3 formulários inteligentes', 'CRM + Voz nativa (2 idiomas)', 'Automação multi-canal', 'Testes A/B', 'Dashboard em tempo real', 'Suporte prioritário 12h'], cta: 'Ativar pré-venda', highlight: true },
      { name: 'Enterprise', price: 'Custom', period: '', desc: 'Solução completa para operações multinacionais com infraestrutura sob medida.', features: ['Formulários ilimitados', 'CRM + Voz 4+ idiomas', 'Infraestrutura dedicada', 'Integração API completa', 'Gerente de conta dedicado', 'SLA garantido 99,9%'], cta: 'Agendar chamada' },
    ],
  },
}

export default function PricingSection({ lang, onOpenModal }: PricingSectionProps) {
  const c = CONTENT[lang]
  return (
    <section style={{ padding: '4rem 1.5rem', background: 'var(--panel)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <span className="font-mono-jb" style={{ fontSize: '.65rem', letterSpacing: '.25em', color: 'var(--gold)', textTransform: 'uppercase', display: 'block', marginBottom: '.75rem' }}>
          {c.eyebrow}
        </span>
        <h2 className="font-playfair" style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700, marginBottom: '.75rem' }}>
          {c.title}
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '.88rem', marginBottom: '2rem' }}>{c.sub}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          {c.plans.map((plan, i) => (
            <div
              key={i}
              style={{
                background: plan.highlight ? 'transparent' : 'var(--card)',
                border: plan.highlight ? 'none' : '1px solid var(--border)',
                borderRadius: plan.highlight ? 14 : 14,
                ...(plan.highlight ? {
                  background: 'transparent',
                  padding: '1.5px',
                  backgroundImage: 'linear-gradient(135deg, var(--gold), transparent, var(--blue))',
                } : {}),
              }}
            >
              <div style={{
                background: 'var(--card)', borderRadius: 13,
                padding: '1.75rem', textAlign: 'left',
                ...(plan.highlight ? {} : {}),
              }}>
                {plan.highlight && (
                  <span className="font-mono-jb" style={{ fontSize: '.6rem', color: 'var(--gold)', letterSpacing: '.1em', textTransform: 'uppercase', background: 'rgba(201,168,76,.1)', border: '1px solid rgba(201,168,76,.25)', padding: '.15rem .5rem', borderRadius: 4, display: 'inline-block', marginBottom: '.75rem' }}>
                    ⭐ Más popular
                  </span>
                )}
                <div className="font-playfair" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '.25rem' }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '.2rem', marginBottom: '.75rem' }}>
                  <span className="font-playfair" style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--gold)' }}>{plan.price}</span>
                  <span style={{ color: 'var(--muted)', fontSize: '.85rem' }}>{plan.period}</span>
                </div>
                <p style={{ fontSize: '.82rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>{plan.desc}</p>
                <ul style={{ listStyle: 'none', display: 'grid', gap: '.5rem', marginBottom: '1.5rem' }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', fontSize: '.82rem', color: 'rgba(245,245,245,.8)' }}>
                      <span style={{ color: 'var(--green)' }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onOpenModal(plan.highlight ? 'preventa' : 'demo')}
                  className={plan.highlight ? 'gold-gradient' : ''}
                  style={{
                    width: '100%', padding: '.75rem', borderRadius: 8, fontWeight: 700,
                    fontSize: '.85rem', cursor: 'pointer', letterSpacing: '.04em',
                    border: plan.highlight ? 'none' : '1px solid var(--border)',
                    color: plan.highlight ? '#0A0A0F' : 'var(--white)',
                    background: plan.highlight ? undefined : 'transparent',
                    transition: 'opacity .2s',
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import type { Lang } from '../types'

interface HowItWorksProps { lang: Lang }

const CONTENT: Record<Lang, { eyebrow: string; title: string; steps: { num: string; title: string; desc: string }[] }> = {
  es: {
    eyebrow: 'El proceso',
    title: 'De cero a sistema funcionando\nen 7 días',
    steps: [
      { num: '01', title: 'Diagnóstico Digital', desc: 'Auditamos tu operación actual: qué herramientas usas, dónde pierdes prospectos y qué automatizar primero para máximo impacto.' },
      { num: '02', title: 'Diseño de Flujos', desc: 'Mapeamos y diseñamos todos los flujos de captación, calificación y seguimiento. Te mostramos el sistema antes de construirlo.' },
      { num: '03', title: 'Implementación', desc: 'Construimos e integramos formularios inteligentes, CRM, automatizaciones y landing pages en tu ecosistema actual.' },
      { num: '04', title: 'Activación & KPIs', desc: 'Lanzamos, monitoreamos en tiempo real y ajustamos las primeras 72 horas. Te entregamos dashboard con tus métricas clave.' },
    ],
  },
  en: {
    eyebrow: 'The process',
    title: 'From zero to running system\nin 7 days',
    steps: [
      { num: '01', title: 'Digital Diagnosis', desc: 'We audit your current operation: what tools you use, where you lose prospects and what to automate first for maximum impact.' },
      { num: '02', title: 'Flow Design', desc: 'We map and design all capture, qualification and follow-up flows. We show you the system before building it.' },
      { num: '03', title: 'Implementation', desc: 'We build and integrate smart forms, CRM, automations and landing pages into your current ecosystem.' },
      { num: '04', title: 'Activation & KPIs', desc: 'We launch, monitor in real-time and adjust the first 72 hours. We deliver a dashboard with your key metrics.' },
    ],
  },
  nl: {
    eyebrow: 'Het proces',
    title: 'Van nul naar werkend systeem\nin 7 dagen',
    steps: [
      { num: '01', title: 'Digitale diagnose', desc: 'We controleren uw huidige operatie: welke tools u gebruikt, waar u prospects verliest en wat u eerst moet automatiseren.' },
      { num: '02', title: 'Stroomontwerp', desc: 'We brengen alle vastleggings-, kwalificatie- en opvolgingsstromen in kaart en ontwerpen ze. We tonen u het systeem vóór de bouw.' },
      { num: '03', title: 'Implementatie', desc: 'We bouwen en integreren slimme formulieren, CRM, automatiseringen en landingspagina\'s in uw huidige ecosysteem.' },
      { num: '04', title: 'Activering & KPI\'s', desc: 'We lanceren, monitoren in realtime en passen de eerste 72 uur aan. We leveren een dashboard met uw belangrijkste statistieken.' },
    ],
  },
  pt: {
    eyebrow: 'O processo',
    title: 'Do zero ao sistema funcionando\nem 7 dias',
    steps: [
      { num: '01', title: 'Diagnóstico Digital', desc: 'Auditamos sua operação atual: quais ferramentas usa, onde perde prospects e o que automatizar primeiro para máximo impacto.' },
      { num: '02', title: 'Design de Fluxos', desc: 'Mapeamos e desenhamos todos os fluxos de captação, qualificação e acompanhamento. Mostramos o sistema antes de construí-lo.' },
      { num: '03', title: 'Implementação', desc: 'Construímos e integramos formulários inteligentes, CRM, automações e landing pages no seu ecossistema atual.' },
      { num: '04', title: 'Ativação & KPIs', desc: 'Lançamos, monitoramos em tempo real e ajustamos nas primeiras 72 horas. Entregamos dashboard com suas métricas-chave.' },
    ],
  },
}

export default function HowItWorks({ lang }: HowItWorksProps) {
  const c = CONTENT[lang]
  return (
    <section style={{ padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <span className="font-mono-jb" style={{ fontSize: '.65rem', letterSpacing: '.25em', color: 'var(--gold)', textTransform: 'uppercase', display: 'block', marginBottom: '.75rem' }}>
          {c.eyebrow}
        </span>
        <h2 className="font-playfair" style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '2.5rem', whiteSpace: 'pre-line' }}>
          {c.title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {c.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{
                minWidth: 48, height: 48, borderRadius: '50%',
                border: '1px solid var(--gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="font-mono-jb" style={{ fontSize: '.75rem', color: 'var(--gold)', fontWeight: 600 }}>{step.num}</span>
              </div>
              <div style={{ flex: 1, paddingTop: '.5rem' }}>
                <div className="font-playfair" style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '.4rem' }}>{step.title}</div>
                <div style={{ fontSize: '.85rem', color: 'var(--muted)', lineHeight: 1.7 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

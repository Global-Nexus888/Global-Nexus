import type { Lang } from '../types'

interface LogisticsSectionProps { lang: Lang }

const CONTENT: Record<Lang, {
  eyebrow: string; title: string; sub: string
  items: { icon: string; title: string; desc: string }[]
}> = {
  es: {
    eyebrow: 'Implementación', title: 'Sin fricción técnica.\nNosotros nos encargamos de todo.',
    sub: 'No necesitas conocimientos técnicos. Nosotros integramos, configuramos y entrenamos a tu equipo.',
    items: [
      { icon: '🔌', title: 'Integración sin dolor', desc: 'Conectamos con las herramientas que ya usas: HubSpot, Pipedrive, Zoho, Calendly, WhatsApp Business y más.' },
      { icon: '⚡', title: 'Activación en 7 días', desc: 'Desde el diagnóstico hasta el sistema funcionando en producción en menos de una semana.' },
      { icon: '🎓', title: 'Capacitación incluida', desc: 'Entrenamos a tu equipo para operar, monitorear y escalar el sistema sin dependencia técnica.' },
      { icon: '🛡️', title: 'Soporte continuo', desc: 'Canal de soporte prioritario, revisión mensual de métricas y optimizaciones trimestrales sin costo adicional.' },
    ],
  },
  en: {
    eyebrow: 'Implementation', title: 'No technical friction.\nWe take care of everything.',
    sub: 'No technical knowledge required. We integrate, configure and train your team.',
    items: [
      { icon: '🔌', title: 'Painless integration', desc: 'We connect with tools you already use: HubSpot, Pipedrive, Zoho, Calendly, WhatsApp Business and more.' },
      { icon: '⚡', title: 'Live in 7 days', desc: 'From diagnosis to system running in production in less than a week.' },
      { icon: '🎓', title: 'Training included', desc: 'We train your team to operate, monitor and scale the system without technical dependency.' },
      { icon: '🛡️', title: 'Ongoing support', desc: 'Priority support channel, monthly metrics review and quarterly optimizations at no extra cost.' },
    ],
  },
  nl: {
    eyebrow: 'Implementatie', title: 'Geen technische wrijving.\nWij regelen alles.',
    sub: 'Geen technische kennis vereist. Wij integreren, configureren en trainen uw team.',
    items: [
      { icon: '🔌', title: 'Pijnloze integratie', desc: 'Wij verbinden met tools die u al gebruikt: HubSpot, Pipedrive, Zoho, Calendly, WhatsApp Business en meer.' },
      { icon: '⚡', title: 'Live in 7 dagen', desc: 'Van diagnose tot systeem in productie in minder dan een week.' },
      { icon: '🎓', title: 'Training inbegrepen', desc: 'Wij trainen uw team om het systeem te bedienen, bewaken en schalen zonder technische afhankelijkheid.' },
      { icon: '🛡️', title: 'Doorlopende ondersteuning', desc: 'Prioritaire ondersteuning, maandelijkse metriekbeoordeling en kwartaaloptimalisaties zonder extra kosten.' },
    ],
  },
  pt: {
    eyebrow: 'Implementação', title: 'Sem fricção técnica.\nNós cuidamos de tudo.',
    sub: 'Sem necessidade de conhecimentos técnicos. Nós integramos, configuramos e treinamos sua equipe.',
    items: [
      { icon: '🔌', title: 'Integração sem dor', desc: 'Conectamos com as ferramentas que você já usa: HubSpot, Pipedrive, Zoho, Calendly, WhatsApp Business e mais.' },
      { icon: '⚡', title: 'Ativo em 7 dias', desc: 'Do diagnóstico ao sistema funcionando em produção em menos de uma semana.' },
      { icon: '🎓', title: 'Treinamento incluído', desc: 'Treinamos sua equipe para operar, monitorar e escalar o sistema sem dependência técnica.' },
      { icon: '🛡️', title: 'Suporte contínuo', desc: 'Canal de suporte prioritário, revisão mensal de métricas e otimizações trimestrais sem custo adicional.' },
    ],
  },
}

export default function LogisticsSection({ lang }: LogisticsSectionProps) {
  const c = CONTENT[lang]
  return (
    <section style={{ padding: '4rem 1.5rem', background: 'var(--panel)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <span className="font-mono-jb" style={{ fontSize: '.65rem', letterSpacing: '.25em', color: 'var(--gold)', textTransform: 'uppercase', display: 'block', marginBottom: '.75rem' }}>
          {c.eyebrow}
        </span>
        <h2 className="font-playfair" style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '.75rem', whiteSpace: 'pre-line' }}>
          {c.title}
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '.88rem', marginBottom: '2rem', lineHeight: 1.7 }}>{c.sub}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          {c.items.map((item, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem 1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '1.5rem', minWidth: 36 }}>{item.icon}</div>
              <div>
                <div className="font-playfair" style={{ fontWeight: 700, fontSize: '.95rem', marginBottom: '.35rem' }}>{item.title}</div>
                <div style={{ fontSize: '.82rem', color: 'var(--muted)', lineHeight: 1.65 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

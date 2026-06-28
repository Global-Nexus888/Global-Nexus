import type { Lang } from '../types'

interface ValuePropProps { lang: Lang }

const CONTENT: Record<Lang, {
  eyebrow: string; title: string; body: string
  problems: { icon: string; title: string; desc: string }[]
  solEyebrow: string; solTitle: string
  services: { icon: string; title: string; desc: string; tag: string }[]
}> = {
  es: {
    eyebrow: 'El problema real',
    title: '¿Cuántos clientes pierdes\nrespondiendo las mismas preguntas?',
    body: 'Tu asesor invierte horas en calificar prospectos que hacen siempre las mismas preguntas iniciales — mientras los prospectos realmente calificados esperan sin atención.',
    problems: [
      { icon: '⏳', title: 'Tiempo perdido', desc: 'El asesor responde las mismas 5 preguntas a cada prospecto nuevo, perdiendo horas al día que podrían destinarse a cierres.' },
      { icon: '🔴', title: 'Prospectos caídos', desc: 'Sin respuesta inmediata 24/7, hasta el 68% de prospectos calificados abandona antes de hablar con alguien.' },
      { icon: '💸', title: 'Capital quemado', desc: 'Contratar 10 asesores para cubrir horarios cuesta 10× más que una automatización inteligente que nunca descansa.' },
    ],
    solEyebrow: 'Nuestras soluciones',
    solTitle: 'Activos digitales que generan\nvalor sin parar',
    services: [
      { icon: '🤖', title: 'Formularios Inteligentes 24/7', desc: 'Flujos conversacionales que segmentan, califican y clasifican a tu prospecto automáticamente — entregando solo los leads listos para cerrar.', tag: 'AI-Powered' },
      { icon: '📞', title: 'CRM con Voz Nativa', desc: 'Llamadas de seguimiento y agendamiento totalmente automatizadas con voz nativa en el idioma de tu cliente.', tag: 'Multiidioma' },
      { icon: '⚙️', title: 'Automatización de Procesos', desc: 'Conectamos las herramientas que ya usas (CRM, WhatsApp, email, calendarios) en flujos automáticos que eliminan trabajo manual.', tag: 'No-Code / Low-Code' },
      { icon: '🌐', title: 'Infraestructura Digital Global', desc: 'Páginas web de alta conversión y ecosistemas digitales que operan en múltiples idiomas y zonas horarias.', tag: 'Multinacional' },
      { icon: '📊', title: 'Estrategia & Consultoría', desc: 'Diseñamos el mapa digital de tu empresa: qué automatizar primero, cómo escalar, qué KPIs medir.', tag: 'Alto Valor' },
    ],
  },
  en: {
    eyebrow: 'The real problem',
    title: 'How many clients do you lose\nanswering the same questions?',
    body: 'Your advisor spends hours qualifying prospects who always ask the same initial questions — while truly qualified prospects wait unattended.',
    problems: [
      { icon: '⏳', title: 'Wasted time', desc: 'Your advisor answers the same 5 questions to every new prospect, losing hours a day that could be spent closing.' },
      { icon: '🔴', title: 'Lost prospects', desc: 'Without immediate 24/7 response, up to 68% of qualified prospects leave before talking to anyone.' },
      { icon: '💸', title: 'Burned capital', desc: 'Hiring 10 advisors to cover schedules costs 10× more than intelligent automation that never rests.' },
    ],
    solEyebrow: 'Our solutions',
    solTitle: 'Digital assets that generate\nvalue non-stop',
    services: [
      { icon: '🤖', title: 'Smart Forms 24/7', desc: 'Conversational flows that automatically segment, qualify, and classify your prospects — delivering only sales-ready leads.', tag: 'AI-Powered' },
      { icon: '📞', title: 'Native Voice CRM', desc: 'Fully automated follow-up calls and appointment scheduling with native voice in your client\'s language.', tag: 'Multilingual' },
      { icon: '⚙️', title: 'Process Automation', desc: 'We connect the tools you already use (CRM, WhatsApp, email, calendars) into automatic flows that eliminate manual work.', tag: 'No-Code / Low-Code' },
      { icon: '🌐', title: 'Global Digital Infrastructure', desc: 'High-conversion websites and digital ecosystems operating in multiple languages and time zones.', tag: 'Multinational' },
      { icon: '📊', title: 'Strategy & Consulting', desc: 'We design your company\'s digital roadmap: what to automate first, how to scale, which KPIs to measure.', tag: 'High Value' },
    ],
  },
  nl: {
    eyebrow: 'Het echte probleem',
    title: 'Hoeveel klanten verliest u door\ndezelfde vragen te beantwoorden?',
    body: 'Uw adviseur besteedt uren aan het kwalificeren van prospects die altijd dezelfde vragen stellen — terwijl echt gekwalificeerde prospects wachten.',
    problems: [
      { icon: '⏳', title: 'Verspilde tijd', desc: 'Uw adviseur beantwoordt dezelfde 5 vragen aan elke nieuwe prospect, en verliest uren per dag.' },
      { icon: '🔴', title: 'Verloren prospects', desc: 'Zonder onmiddellijke 24/7 respons verlaat tot 68% van de gekwalificeerde prospects voor het gesprek.' },
      { icon: '💸', title: 'Verbrand kapitaal', desc: '10 adviseurs inhuren om roosters te dekken kost 10× meer dan intelligente automatisering.' },
    ],
    solEyebrow: 'Onze oplossingen',
    solTitle: 'Digitale activa die continu\nwaarde genereren',
    services: [
      { icon: '🤖', title: 'Slimme formulieren 24/7', desc: 'Conversatiestromen die prospects automatisch segmenteren, kwalificeren en classificeren.', tag: 'AI-gestuurd' },
      { icon: '📞', title: 'CRM met native stem', desc: 'Volledig geautomatiseerde follow-up gesprekken met native stem in de taal van uw klant.', tag: 'Meertalig' },
      { icon: '⚙️', title: 'Procesautomatisering', desc: 'Wij verbinden de tools die u al gebruikt in automatische stromen die handmatig werk elimineren.', tag: 'No-Code / Low-Code' },
      { icon: '🌐', title: 'Mondiale digitale infrastructuur', desc: 'Hoogconverterende websites en digitale ecosystemen in meerdere talen en tijdzones.', tag: 'Multinationaal' },
      { icon: '📊', title: 'Strategie & Advies', desc: 'Wij ontwerpen de digitale routekaart van uw bedrijf: wat eerst automatiseren, hoe te schalen.', tag: 'Hoge waarde' },
    ],
  },
  pt: {
    eyebrow: 'O problema real',
    title: 'Quantos clientes você perde\nrespondendo as mesmas perguntas?',
    body: 'Seu assessor gasta horas qualificando prospects que sempre fazem as mesmas perguntas iniciais — enquanto prospects realmente qualificados esperam sem atendimento.',
    problems: [
      { icon: '⏳', title: 'Tempo perdido', desc: 'O assessor responde as mesmas 5 perguntas a cada novo prospect, perdendo horas por dia que poderiam ser para fechamentos.' },
      { icon: '🔴', title: 'Prospects perdidos', desc: 'Sem resposta imediata 24/7, até 68% dos prospects qualificados desistem antes de falar com alguém.' },
      { icon: '💸', title: 'Capital queimado', desc: 'Contratar 10 assessores para cobrir horários custa 10× mais que uma automação inteligente.' },
    ],
    solEyebrow: 'Nossas soluções',
    solTitle: 'Ativos digitais que geram\nvalor sem parar',
    services: [
      { icon: '🤖', title: 'Formulários Inteligentes 24/7', desc: 'Fluxos conversacionais que segmentam, qualificam e classificam seu prospect automaticamente.', tag: 'Com IA' },
      { icon: '📞', title: 'CRM com Voz Nativa', desc: 'Ligações de acompanhamento e agendamento totalmente automatizados com voz nativa no idioma do cliente.', tag: 'Multilíngue' },
      { icon: '⚙️', title: 'Automação de Processos', desc: 'Conectamos as ferramentas que você já usa em fluxos automáticos que eliminam trabalho manual.', tag: 'No-Code / Low-Code' },
      { icon: '🌐', title: 'Infraestrutura Digital Global', desc: 'Sites de alta conversão e ecossistemas digitais em múltiplos idiomas e fusos horários.', tag: 'Multinacional' },
      { icon: '📊', title: 'Estratégia & Consultoria', desc: 'Desenhamos o mapa digital da sua empresa: o que automatizar primeiro, como escalar.', tag: 'Alto Valor' },
    ],
  },
}

export default function ValueProp({ lang }: ValuePropProps) {
  const c = CONTENT[lang]
  return (
    <>
      {/* Problem */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--panel)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <span className="font-mono-jb" style={{ fontSize: '.65rem', letterSpacing: '.25em', color: 'var(--gold)', textTransform: 'uppercase', display: 'block', marginBottom: '.75rem' }}>
            {c.eyebrow}
          </span>
          <h2 className="font-playfair" style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1rem', whiteSpace: 'pre-line' }}>
            {c.title}
          </h2>
          <p style={{ color: 'rgba(245,245,245,.6)', lineHeight: 1.8, fontWeight: 300, fontSize: '.95rem', marginBottom: '2rem' }}>{c.body}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {c.problems.map((p, i) => (
              <div key={i} style={{
                background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12,
                padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem',
              }}>
                <div style={{
                  width: 40, height: 40, minWidth: 40, borderRadius: 8,
                  background: 'rgba(201,168,76,.08)', border: '1px solid rgba(201,168,76,.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
                }}>{p.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '.9rem', marginBottom: '.35rem', color: 'var(--white)' }}>{p.title}</div>
                  <div style={{ fontSize: '.8rem', color: 'var(--muted)', lineHeight: 1.6 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />
      <section style={{ padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <span className="font-mono-jb" style={{ fontSize: '.65rem', letterSpacing: '.25em', color: 'var(--gold)', textTransform: 'uppercase', display: 'block', marginBottom: '.75rem' }}>
            {c.solEyebrow}
          </span>
          <h2 className="font-playfair" style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '2rem', whiteSpace: 'pre-line' }}>
            {c.solTitle}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {c.services.map((s, i) => (
              <ServiceCard key={i} {...s} highlight={i === 0} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function ServiceCard({ icon, title, desc, tag, highlight }: { icon: string; title: string; desc: string; tag: string; highlight?: boolean }) {
  const inner = (
    <div
      style={{
        background: 'var(--card)', border: highlight ? 'none' : '1px solid var(--border)',
        borderRadius: highlight ? 13 : 14,
        padding: '1.5rem', position: 'relative', overflow: 'hidden',
        transition: 'border-color .2s',
      }}
      onMouseEnter={e => { if (!highlight) e.currentTarget.style.borderColor = 'var(--gold)' }}
      onMouseLeave={e => { if (!highlight) e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      <div style={{ fontSize: '1.6rem', marginBottom: '.75rem' }}>{icon}</div>
      <div className="font-playfair" style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '.5rem' }}>{title}</div>
      <div style={{ fontSize: '.82rem', color: 'var(--muted)', lineHeight: 1.65 }}>{desc}</div>
      <span className="font-mono-jb" style={{
        display: 'inline-block', marginTop: '.75rem',
        background: 'rgba(201,168,76,.1)', border: '1px solid rgba(201,168,76,.25)',
        color: 'var(--gold)', fontSize: '.65rem', letterSpacing: '.1em',
        padding: '.2rem .5rem', borderRadius: 4, textTransform: 'uppercase',
      }}>{tag}</span>
    </div>
  )

  if (highlight) {
    return (
      <div style={{ borderRadius: 14, padding: '1.5px', background: 'linear-gradient(135deg, var(--gold), transparent, var(--blue))' }}>
        {inner}
      </div>
    )
  }
  return inner
}

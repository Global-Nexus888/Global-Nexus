import type { Lang } from '../types'

interface AppMockupProps { lang: Lang }

const CONTENT: Record<Lang, { eyebrow: string; title: string; sub: string; metrics: { label: string; value: string; color: string }[] }> = {
  es: { eyebrow: 'Dashboard en vivo', title: 'Tu negocio en tiempo real', sub: 'Visualiza cada prospecto, conversión y automatización desde un panel centralizado.', metrics: [{ label: 'Leads hoy', value: '47', color: 'var(--blue)' }, { label: 'En proceso', value: '12', color: 'var(--gold)' }, { label: 'Cerrados', value: '8', color: 'var(--green)' }, { label: 'Revenue', value: '$4.2k', color: 'var(--green)' }] },
  en: { eyebrow: 'Live Dashboard', title: 'Your business in real time', sub: 'Visualize every prospect, conversion and automation from a centralized panel.', metrics: [{ label: 'Leads today', value: '47', color: 'var(--blue)' }, { label: 'In progress', value: '12', color: 'var(--gold)' }, { label: 'Closed', value: '8', color: 'var(--green)' }, { label: 'Revenue', value: '$4.2k', color: 'var(--green)' }] },
  nl: { eyebrow: 'Live Dashboard', title: 'Uw bedrijf in realtime', sub: 'Visualiseer elke prospect, conversie en automatisering vanuit een gecentraliseerd paneel.', metrics: [{ label: 'Leads vandaag', value: '47', color: 'var(--blue)' }, { label: 'In behandeling', value: '12', color: 'var(--gold)' }, { label: 'Gesloten', value: '8', color: 'var(--green)' }, { label: 'Omzet', value: '$4.2k', color: 'var(--green)' }] },
  pt: { eyebrow: 'Dashboard ao vivo', title: 'Seu negócio em tempo real', sub: 'Visualize cada prospect, conversão e automação a partir de um painel centralizado.', metrics: [{ label: 'Leads hoje', value: '47', color: 'var(--blue)' }, { label: 'Em processo', value: '12', color: 'var(--gold)' }, { label: 'Fechados', value: '8', color: 'var(--green)' }, { label: 'Receita', value: '$4.2k', color: 'var(--green)' }] },
}

const LEADS = [
  { name: 'María García', source: 'Form', score: 92, status: '🟢' },
  { name: 'John Smith', source: 'WhatsApp', score: 78, status: '🟡' },
  { name: 'Jan de Vries', source: 'Landing', score: 85, status: '🟢' },
  { name: 'Carlos Silva', source: 'Form', score: 61, status: '🔴' },
]

export default function AppMockup({ lang }: AppMockupProps) {
  const c = CONTENT[lang]
  return (
    <section style={{ padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <span className="font-mono-jb" style={{ fontSize: '.65rem', letterSpacing: '.25em', color: 'var(--gold)', textTransform: 'uppercase', display: 'block', marginBottom: '.75rem' }}>
          {c.eyebrow}
        </span>
        <h2 className="font-playfair" style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700, marginBottom: '.75rem' }}>{c.title}</h2>
        <p style={{ color: 'var(--muted)', fontSize: '.88rem', marginBottom: '2rem', lineHeight: 1.7 }}>{c.sub}</p>

        {/* Mock browser */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          {/* Browser bar */}
          <div style={{ background: 'var(--panel)', padding: '.7rem 1rem', display: 'flex', alignItems: 'center', gap: '.5rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22C55E' }} />
            <div style={{ flex: 1, background: 'var(--void)', borderRadius: 6, padding: '.25rem .75rem', fontSize: '.7rem', color: 'var(--muted)', marginLeft: '.5rem' }} className="font-mono-jb">
              app.globalnexus.io/dashboard
            </div>
          </div>

          {/* Dashboard content */}
          <div style={{ padding: '1.25rem' }}>
            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '.75rem', marginBottom: '1.25rem' }}>
              {c.metrics.map((m, i) => (
                <div key={i} style={{ background: 'var(--panel)', borderRadius: 10, padding: '.9rem', border: '1px solid var(--border)' }}>
                  <div className="font-mono-jb" style={{ fontSize: '1.3rem', fontWeight: 600, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: '.72rem', color: 'var(--muted)', marginTop: '.2rem' }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Lead table */}
            <div style={{ background: 'var(--panel)', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ padding: '.65rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '.72rem', color: 'var(--muted)' }} className="font-mono-jb">LEADS</span>
                <span style={{ fontSize: '.65rem', color: 'var(--green)' }} className="font-mono-jb">● LIVE</span>
              </div>
              {LEADS.map((l, i) => (
                <div key={i} style={{ padding: '.6rem 1rem', borderBottom: i < LEADS.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.8rem', flexShrink: 0 }}>
                    {l.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '.78rem', fontWeight: 500 }}>{l.name}</div>
                    <div style={{ fontSize: '.65rem', color: 'var(--muted)' }}>{l.source}</div>
                  </div>
                  <div style={{ fontSize: '.72rem', color: 'var(--gold)' }} className="font-mono-jb">{l.score}</div>
                  <div style={{ fontSize: '.85rem' }}>{l.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

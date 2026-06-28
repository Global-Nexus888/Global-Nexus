import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import type { Lang } from '../types'

interface ChartsProps { lang: Lang }

const conversionData = [
  { month: 'Ene', sin: 1.2, con: 3.8 },
  { month: 'Feb', sin: 1.5, con: 5.1 },
  { month: 'Mar', sin: 1.1, con: 6.2 },
  { month: 'Abr', sin: 1.8, con: 7.5 },
  { month: 'May', sin: 1.3, con: 8.4 },
  { month: 'Jun', sin: 2.0, con: 9.8 },
]

const costData = [
  { label: 'Equipo\ntrad.', tradicional: 4200, automatizado: 890 },
  { label: 'Seguimiento', tradicional: 2800, automatizado: 320 },
  { label: 'Calificación', tradicional: 3500, automatizado: 450 },
  { label: 'Cierre', tradicional: 1800, automatizado: 560 },
]

const VS_ROWS: Record<Lang, { feature: string; trad: string; nexus: string }[]> = {
  es: [
    { feature: 'Disponibilidad', trad: '8h/día', nexus: '24/7/365' },
    { feature: 'Costo mensual', trad: '$15,000+ USD', nexus: '$890 USD' },
    { feature: 'Tiempo de respuesta', trad: '4–8 horas', nexus: '< 30 seg' },
    { feature: 'Idiomas', trad: '1', nexus: '4+' },
    { feature: 'Escalabilidad', trad: 'Contratar más', nexus: 'Instantánea' },
  ],
  en: [
    { feature: 'Availability', trad: '8h/day', nexus: '24/7/365' },
    { feature: 'Monthly cost', trad: '$15,000+ USD', nexus: '$890 USD' },
    { feature: 'Response time', trad: '4–8 hours', nexus: '< 30 sec' },
    { feature: 'Languages', trad: '1', nexus: '4+' },
    { feature: 'Scalability', trad: 'Hire more', nexus: 'Instant' },
  ],
  nl: [
    { feature: 'Beschikbaarheid', trad: '8u/dag', nexus: '24/7/365' },
    { feature: 'Maandelijkse kosten', trad: '$15.000+ USD', nexus: '$890 USD' },
    { feature: 'Reactietijd', trad: '4–8 uur', nexus: '< 30 sec' },
    { feature: 'Talen', trad: '1', nexus: '4+' },
    { feature: 'Schaalbaarheid', trad: 'Meer inhuren', nexus: 'Direct' },
  ],
  pt: [
    { feature: 'Disponibilidade', trad: '8h/dia', nexus: '24/7/365' },
    { feature: 'Custo mensal', trad: '$15.000+ USD', nexus: '$890 USD' },
    { feature: 'Tempo de resposta', trad: '4–8 horas', nexus: '< 30 seg' },
    { feature: 'Idiomas', trad: '1', nexus: '4+' },
    { feature: 'Escalabilidade', trad: 'Contratar mais', nexus: 'Instantânea' },
  ],
}

const TITLES: Record<Lang, { eyebrow: string; title: string; chart1: string; chart2: string; sub1: string; sub2: string; trad: string; nexus: string }> = {
  es: { eyebrow: 'Datos que hablan', title: 'El impacto de tener estrategia vs no tenerla', chart1: '📈 Tasa de conversión mensual (%)', chart2: '📊 Costo por cliente adquirido (USD)', sub1: 'Empresas sin estrategia vs Global Nexus', sub2: 'Equipo tradicional vs Automatización', trad: 'Tradicional', nexus: 'Global Nexus' },
  en: { eyebrow: 'Data that speaks', title: 'The impact of having a strategy vs not', chart1: '📈 Monthly conversion rate (%)', chart2: '📊 Cost per acquired client (USD)', sub1: 'Companies without strategy vs Global Nexus', sub2: 'Traditional team vs Automation', trad: 'Traditional', nexus: 'Global Nexus' },
  nl: { eyebrow: 'Data die spreekt', title: 'De impact van strategie vs geen strategie', chart1: '📈 Maandelijkse conversieratio (%)', chart2: '📊 Kosten per verworven klant (USD)', sub1: 'Zonder strategie vs Global Nexus', sub2: 'Traditioneel team vs Automatisering', trad: 'Traditioneel', nexus: 'Global Nexus' },
  pt: { eyebrow: 'Dados que falam', title: 'O impacto de ter estratégia vs não ter', chart1: '📈 Taxa de conversão mensal (%)', chart2: '📊 Custo por cliente adquirido (USD)', sub1: 'Empresas sem estratégia vs Global Nexus', sub2: 'Equipe tradicional vs Automação', trad: 'Tradicional', nexus: 'Global Nexus' },
}

const cardStyle: React.CSSProperties = {
  background: 'var(--card)', border: '1px solid var(--border)',
  borderRadius: 14, padding: '1.25rem',
}

export default function Charts({ lang }: ChartsProps) {
  const t = TITLES[lang]
  const vsRows = VS_ROWS[lang]

  return (
    <section style={{ padding: '4rem 1.5rem', background: 'var(--panel)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <span className="font-mono-jb" style={{ fontSize: '.65rem', letterSpacing: '.25em', color: 'var(--gold)', textTransform: 'uppercase', display: 'block', marginBottom: '.75rem' }}>
          {t.eyebrow}
        </span>
        <h2 className="font-playfair" style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '2rem' }}>
          {t.title}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {/* Line Chart */}
          <div style={cardStyle}>
            <h3 className="font-playfair" style={{ fontSize: '.95rem', marginBottom: '1rem' }}>{t.chart1}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" />
                <XAxis dataKey="month" stroke="var(--muted)" tick={{ fontSize: 11 }} />
                <YAxis stroke="var(--muted)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="sin" name={t.trad} stroke="#EF4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="con" name={t.nexus} stroke="#C9A84C" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <p style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: '.6rem', textAlign: 'center' }}>{t.sub1}</p>
          </div>

          {/* Bar Chart */}
          <div style={cardStyle}>
            <h3 className="font-playfair" style={{ fontSize: '.95rem', marginBottom: '1rem' }}>{t.chart2}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" />
                <XAxis dataKey="label" stroke="var(--muted)" tick={{ fontSize: 10 }} />
                <YAxis stroke="var(--muted)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="tradicional" name={t.trad} fill="#EF4444" radius={[4, 4, 0, 0]} opacity={.8} />
                <Bar dataKey="automatizado" name={t.nexus} fill="#C9A84C" radius={[4, 4, 0, 0]} opacity={.9} />
              </BarChart>
            </ResponsiveContainer>
            <p style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: '.6rem', textAlign: 'center' }}>{t.sub2}</p>
          </div>
        </div>

        {/* VS Table */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0 1rem', color: 'var(--muted)', fontSize: '.72rem' }} className="font-mono-jb">
          <span style={{ flex: 1, height: 1, background: 'var(--border)', display: 'block' }} />
          Comparativa directa
          <span style={{ flex: 1, height: 1, background: 'var(--border)', display: 'block' }} />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.82rem' }}>
          <thead>
            <tr>
              <th style={{ padding: '.75rem', textAlign: 'left', fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)' }} className="font-mono-jb">Feature</th>
              <th style={{ padding: '.75rem', textAlign: 'center', fontSize: '.7rem', color: '#EF4444', background: 'rgba(239,68,68,.06)' }} className="font-mono-jb">{t.trad}</th>
              <th style={{ padding: '.75rem', textAlign: 'center', fontSize: '.7rem', color: 'var(--gold)', background: 'rgba(201,168,76,.06)' }} className="font-mono-jb">{t.nexus}</th>
            </tr>
          </thead>
          <tbody>
            {vsRows.map((row, i) => (
              <tr key={i}>
                <td style={{ padding: '.65rem .75rem', borderBottom: '1px solid var(--border)', color: 'rgba(245,245,245,.6)', fontSize: '.78rem' }}>{row.feature}</td>
                <td style={{ padding: '.65rem .75rem', borderBottom: '1px solid var(--border)', textAlign: 'center', color: '#EF4444', background: 'rgba(239,68,68,.03)' }}>✗ {row.trad}</td>
                <td style={{ padding: '.65rem .75rem', borderBottom: '1px solid var(--border)', textAlign: 'center', color: 'var(--green)', background: 'rgba(201,168,76,.03)' }}>✓ {row.nexus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

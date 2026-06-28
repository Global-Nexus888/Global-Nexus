import type { Lang } from '../types'

interface StatsStripProps { lang: Lang }

const STATS: Record<Lang, { num: string; label: string }[]> = {
  es: [
    { num: '24/7', label: 'Operación continua' },
    { num: '4x',   label: 'Tasa de conversión' },
    { num: '-70%', label: 'Costo operativo' },
  ],
  en: [
    { num: '24/7', label: 'Continuous operation' },
    { num: '4x',   label: 'Conversion rate' },
    { num: '-70%', label: 'Operating cost' },
  ],
  nl: [
    { num: '24/7', label: 'Continue werking' },
    { num: '4x',   label: 'Conversieratio' },
    { num: '-70%', label: 'Operationele kosten' },
  ],
  pt: [
    { num: '24/7', label: 'Operação contínua' },
    { num: '4x',   label: 'Taxa de conversão' },
    { num: '-70%', label: 'Custo operacional' },
  ],
}

export default function StatsStrip({ lang }: StatsStripProps) {
  const stats = STATS[lang]
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      background: 'var(--panel)',
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          padding: '1.5rem 1rem', textAlign: 'center',
          borderRight: i < stats.length - 1 ? '1px solid var(--border)' : 'none',
        }}>
          <span className="font-playfair gold-text" style={{ fontSize: '2rem', fontWeight: 900, display: 'block', marginBottom: '.25rem' }}>
            {s.num}
          </span>
          <span className="font-mono-jb" style={{ fontSize: '.7rem', color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  )
}

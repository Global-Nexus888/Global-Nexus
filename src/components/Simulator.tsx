import { useState } from 'react'
import type { Lang } from '../types'

interface SimulatorProps { lang: Lang }

const CONTENT: Record<Lang, {
  eyebrow: string; title: string; leadsLabel: string; rateLabel: string
  ticketLabel: string; result: string; vsLabel: string; saving: string
}> = {
  es: { eyebrow: 'Simulador ROI', title: 'Calcula tu retorno de inversión', leadsLabel: 'Leads mensuales', rateLabel: 'Tasa de cierre actual (%)', ticketLabel: 'Ticket promedio (USD)', result: 'Ingresos potenciales con Global Nexus', vsLabel: 'vs. ingresos actuales', saving: 'Ingreso adicional mensual' },
  en: { eyebrow: 'ROI Simulator', title: 'Calculate your return on investment', leadsLabel: 'Monthly leads', rateLabel: 'Current closing rate (%)', ticketLabel: 'Average ticket (USD)', result: 'Potential revenue with Global Nexus', vsLabel: 'vs. current revenue', saving: 'Additional monthly revenue' },
  nl: { eyebrow: 'ROI Simulator', title: 'Bereken uw rendement', leadsLabel: 'Maandelijkse leads', rateLabel: 'Huidige sluitingsratio (%)', ticketLabel: 'Gemiddeld ticket (USD)', result: 'Potentiële omzet met Global Nexus', vsLabel: 'vs. huidige omzet', saving: 'Extra maandelijkse omzet' },
  pt: { eyebrow: 'Simulador ROI', title: 'Calcule seu retorno sobre investimento', leadsLabel: 'Leads mensais', rateLabel: 'Taxa de fechamento atual (%)', ticketLabel: 'Ticket médio (USD)', result: 'Receita potencial com Global Nexus', vsLabel: 'vs. receita atual', saving: 'Receita adicional mensal' },
}

export default function Simulator({ lang }: SimulatorProps) {
  const c = CONTENT[lang]
  const [leads, setLeads] = useState(100)
  const [rate, setRate] = useState(5)
  const [ticket, setTicket] = useState(500)

  const currentRevenue = leads * (rate / 100) * ticket
  // Global Nexus multiplies conversion rate ~4x
  const nexusRevenue = leads * (Math.min(rate * 4, 100) / 100) * ticket
  const gain = nexusRevenue - currentRevenue

  const fmt = (n: number) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`

  return (
    <section style={{ padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <span className="font-mono-jb" style={{ fontSize: '.65rem', letterSpacing: '.25em', color: 'var(--gold)', textTransform: 'uppercase', display: 'block', marginBottom: '.75rem' }}>
          {c.eyebrow}
        </span>
        <h2 className="font-playfair" style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '2rem' }}>
          {c.title}
        </h2>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '2rem' }}>
          {[
            { label: c.leadsLabel, value: leads, set: setLeads, min: 10, max: 1000, step: 10 },
            { label: c.rateLabel, value: rate, set: setRate, min: 1, max: 30, step: 1 },
            { label: c.ticketLabel, value: ticket, set: setTicket, min: 100, max: 10000, step: 100 },
          ].map(({ label, value, set, min, max, step }) => (
            <div key={label} style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
                <label style={{ fontSize: '.82rem', color: 'var(--muted)' }}>{label}</label>
                <span className="font-mono-jb" style={{ fontSize: '.9rem', color: 'var(--gold)', fontWeight: 600 }}>{value}</span>
              </div>
              <input
                type="range" min={min} max={max} step={step} value={value}
                onChange={e => set(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }}
              />
            </div>
          ))}

          {/* Results */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '.82rem', color: 'var(--muted)' }}>{c.vsLabel}</span>
              <span className="font-mono-jb" style={{ fontSize: '1rem', color: '#EF4444' }}>{fmt(currentRevenue)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '.82rem', color: 'rgba(245,245,245,.8)' }}>{c.result}</span>
              <span className="font-mono-jb" style={{ fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 600 }}>{fmt(nexusRevenue)}</span>
            </div>
            <div style={{ background: 'rgba(34,211,165,.08)', border: '1px solid rgba(34,211,165,.2)', borderRadius: 8, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '.9rem', fontWeight: 600 }}>🚀 {c.saving}</span>
              <span className="font-mono-jb" style={{ fontSize: '1.2rem', color: 'var(--green)', fontWeight: 600 }}>+{fmt(gain)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

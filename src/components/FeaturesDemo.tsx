import { useState } from 'react'
import type { Lang } from '../types'

interface FeaturesDemoProps { lang: Lang }

interface Tab {
  id: string
  label: string
  icon: string
  title: string
  desc: string
  bullets: string[]
}

const TABS: Record<Lang, Tab[]> = {
  es: [
    { id: 'forms', icon: '🤖', label: 'Formularios', title: 'Formularios Inteligentes', desc: 'Tu prospecto llega, el formulario lo califica solo — sin intervención humana.', bullets: ['Segmentación automática por perfil', 'Lógica condicional multi-rama', 'Integración WhatsApp + email', 'Score de calidad en tiempo real'] },
    { id: 'crm', icon: '📞', label: 'CRM Voz', title: 'CRM con Voz Nativa', desc: 'Llamadas automatizadas que suenan humanas, en el idioma nativo de tu cliente.', bullets: ['Agendamiento automático de citas', 'Voz nativa en 4+ idiomas', 'Seguimiento post-cita automatizado', 'Transcripción y análisis de llamadas'] },
    { id: 'auto', icon: '⚙️', label: 'Automatización', title: 'Automatización de Procesos', desc: 'Tus herramientas conectadas, trabajando solas 24/7.', bullets: ['Conecta CRM + WhatsApp + Email', 'Disparadores por comportamiento', 'Reportes automáticos diarios', 'Alertas en tiempo real'] },
    { id: 'infra', icon: '🌐', label: 'Infraestructura', title: 'Infraestructura Global', desc: 'Páginas que convierten en cualquier idioma y zona horaria.', bullets: ['Landing pages multiidioma', 'A/B testing automatizado', 'SEO técnico avanzado', 'Analytics en tiempo real'] },
  ],
  en: [
    { id: 'forms', icon: '🤖', label: 'Forms', title: 'Smart Forms', desc: 'Your prospect arrives, the form qualifies them alone — no human intervention.', bullets: ['Automatic segmentation by profile', 'Multi-branch conditional logic', 'WhatsApp + email integration', 'Real-time quality score'] },
    { id: 'crm', icon: '📞', label: 'Voice CRM', title: 'Native Voice CRM', desc: 'Automated calls that sound human, in your client\'s native language.', bullets: ['Automatic appointment scheduling', 'Native voice in 4+ languages', 'Automated post-appointment follow-up', 'Call transcription and analysis'] },
    { id: 'auto', icon: '⚙️', label: 'Automation', title: 'Process Automation', desc: 'Your tools connected, working alone 24/7.', bullets: ['Connect CRM + WhatsApp + Email', 'Behavior-based triggers', 'Automatic daily reports', 'Real-time alerts'] },
    { id: 'infra', icon: '🌐', label: 'Infrastructure', title: 'Global Infrastructure', desc: 'Pages that convert in any language and time zone.', bullets: ['Multilingual landing pages', 'Automated A/B testing', 'Advanced technical SEO', 'Real-time analytics'] },
  ],
  nl: [
    { id: 'forms', icon: '🤖', label: 'Formulieren', title: 'Slimme formulieren', desc: 'Uw prospect arriveert, het formulier kwalificeert alleen — zonder menselijke tussenkomst.', bullets: ['Automatische segmentatie op profiel', 'Multi-tak conditionele logica', 'WhatsApp + e-mail integratie', 'Realtime kwaliteitsscore'] },
    { id: 'crm', icon: '📞', label: 'Stem CRM', title: 'Native Stem CRM', desc: 'Geautomatiseerde gesprekken die menselijk klinken, in de moedertaal van uw klant.', bullets: ['Automatische afspraakplanning', 'Native stem in 4+ talen', 'Geautomatiseerde follow-up na afspraak', 'Gespreksanalyse'] },
    { id: 'auto', icon: '⚙️', label: 'Automatisering', title: 'Procesautomatisering', desc: 'Uw tools verbonden, 24/7 alleen werkend.', bullets: ['Verbind CRM + WhatsApp + E-mail', 'Gedragsgebaseerde triggers', 'Automatische dagelijkse rapporten', 'Realtime meldingen'] },
    { id: 'infra', icon: '🌐', label: 'Infrastructuur', title: 'Mondiale infrastructuur', desc: 'Pagina\'s die converteren in elke taal en tijdzone.', bullets: ['Meertalige landingspagina\'s', 'Geautomatiseerde A/B-tests', 'Geavanceerde technische SEO', 'Realtime analyse'] },
  ],
  pt: [
    { id: 'forms', icon: '🤖', label: 'Formulários', title: 'Formulários Inteligentes', desc: 'Seu prospect chega, o formulário o qualifica sozinho — sem intervenção humana.', bullets: ['Segmentação automática por perfil', 'Lógica condicional multi-ramo', 'Integração WhatsApp + email', 'Score de qualidade em tempo real'] },
    { id: 'crm', icon: '📞', label: 'CRM Voz', title: 'CRM com Voz Nativa', desc: 'Chamadas automatizadas que soam humanas, no idioma nativo do seu cliente.', bullets: ['Agendamento automático de consultas', 'Voz nativa em 4+ idiomas', 'Acompanhamento pós-consulta automatizado', 'Transcrição e análise de chamadas'] },
    { id: 'auto', icon: '⚙️', label: 'Automação', title: 'Automação de Processos', desc: 'Suas ferramentas conectadas, trabalhando sozinhas 24/7.', bullets: ['Conecta CRM + WhatsApp + Email', 'Gatilhos por comportamento', 'Relatórios automáticos diários', 'Alertas em tempo real'] },
    { id: 'infra', icon: '🌐', label: 'Infraestrutura', title: 'Infraestrutura Global', desc: 'Páginas que convertem em qualquer idioma e fuso horário.', bullets: ['Landing pages multilíngues', 'Testes A/B automatizados', 'SEO técnico avançado', 'Analytics em tempo real'] },
  ],
}

const EYEBROWS: Record<Lang, string> = {
  es: 'Demo interactivo', en: 'Interactive demo', nl: 'Interactieve demo', pt: 'Demo interativo'
}

export default function FeaturesDemo({ lang }: FeaturesDemoProps) {
  const tabs = TABS[lang]
  const [active, setActive] = useState(0)
  const tab = tabs[active]

  return (
    <section style={{ padding: '4rem 1.5rem', background: 'var(--panel)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <span className="font-mono-jb" style={{ fontSize: '.65rem', letterSpacing: '.25em', color: 'var(--gold)', textTransform: 'uppercase', display: 'block', marginBottom: '.75rem' }}>
          {EYEBROWS[lang]}
        </span>

        {/* Tab buttons */}
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {tabs.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActive(i)}
              style={{
                background: i === active ? 'rgba(201,168,76,.12)' : 'transparent',
                border: `1px solid ${i === active ? 'var(--gold)' : 'var(--border)'}`,
                color: i === active ? 'var(--gold)' : 'var(--muted)',
                padding: '.45rem .9rem', borderRadius: 8,
                fontSize: '.8rem', cursor: 'pointer', transition: 'all .2s',
                display: 'flex', alignItems: 'center', gap: '.4rem',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '1.75rem',
          borderTop: '2px solid var(--gold)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '.75rem' }}>{tab.icon}</div>
          <h3 className="font-playfair" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '.5rem' }}>{tab.title}</h3>
          <p style={{ color: 'var(--muted)', fontSize: '.88rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>{tab.desc}</p>
          <ul style={{ listStyle: 'none', display: 'grid', gap: '.6rem' }}>
            {tab.bullets.map((b, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', fontSize: '.85rem', color: 'rgba(245,245,245,.8)' }}>
                <span style={{ color: 'var(--green)', fontSize: '.9rem' }}>✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

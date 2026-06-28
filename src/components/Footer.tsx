import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '🤖', title: 'Documentos verificados por IA', desc: 'Certificados y permisos validados automáticamente' },
  { icon: '⚓', title: 'Envíos desde Puerto Veracruz', desc: 'Logística marítima directa a puertos europeos' },
  { icon: '🚛', title: 'Logística hasta destino EU', desc: 'Last mile delivery en 27 países europeos' },
  { icon: '🔴', title: 'Actualización en tiempo real', desc: 'Stock y precios sincronizados 24/7' },
  { icon: '💬', title: 'Mensajería bilingüe integrada', desc: 'Español / Inglés / Neerlandés / Alemán' },
  { icon: '0%', title: 'Libre de aranceles', desc: 'Acuerdo TLCUEM para exportación certificada' },
]

export default function Footer() {
  return (
    <footer style={{ background: 'var(--white)', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
      {/* Feature strip */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '1.3rem', minWidth: 28, textAlign: 'center' }}>{f.icon}</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{f.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #0D9488, #1E3A5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem' }}>🌐</div>
          <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text)' }}>Global Nexus</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>© {new Date().getFullYear()}</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Privacidad', 'Términos', 'Contacto', 'FAQ'].map(l => (
            <Link key={l} to="#" style={{ fontSize: '12px', color: 'var(--text-muted)', transition: 'color .15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--teal)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >{l}</Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

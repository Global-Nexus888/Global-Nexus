import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '🤖', title: 'Documentos verificados por IA', desc: 'Certificados y permisos validados automáticamente' },
  { icon: '⚓', title: 'Envíos desde Puerto Veracruz', desc: 'Logística marítima directa a puertos europeos' },
  { icon: '🚛', title: 'Logística hasta destino EU', desc: 'Last mile delivery en 27 países europeos' },
  { icon: '🔴', title: 'Actualización en tiempo real', desc: 'Stock y precios sincronizados 24/7' },
  { icon: '💬', title: 'Mensajería multilingüe', desc: 'ES / EN / NL / DE con traducción automática' },
  { icon: '0%', title: 'Libre de aranceles', desc: 'Acuerdo TLCUEM para exportación certificada' },
]

export default function Footer() {
  return (
    <footer style={{ background: 'var(--white)', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
      {/* Feature strip */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '2rem 1.5rem' }}>
        <div className="footer-grid" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
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

      {/* Links grid */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #0D9488, #1E3A5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem' }}>🌐</div>
              <span style={{ fontWeight: 800, fontSize: '14px' }}>Global Nexus</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
              La plataforma B2B México–Europa bajo el acuerdo TLCUEM.
            </p>
            <span className="badge badge-green" style={{ fontSize: 11 }}>✓ TLCUEM 0% aranceles</span>
          </div>

          {/* Platform */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: '0.75rem', color: 'var(--text)' }}>Plataforma</div>
            {[
              { to: '/catalogo', l: 'Catálogo de productos' },
              { to: '/productores', l: 'Productores' },
              { to: '/comunidad', l: 'Comunidad' },
              { to: '/oportunidades', l: '🔥 Ofertas calientes' },
              { to: '/precios', l: 'Planes y precios' },
            ].map(({ to, l }) => (
              <Link key={to} to={to} style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 6, transition: 'color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--teal)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >{l}</Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: '0.75rem', color: 'var(--text)' }}>Empresa</div>
            {[
              { to: '/como-funciona', l: 'Cómo funciona' },
              { to: '/faq', l: 'Preguntas frecuentes' },
              { to: '/contacto', l: 'Contacto y soporte' },
              { to: '/registro', l: 'Crear cuenta gratis' },
            ].map(({ to, l }) => (
              <Link key={to} to={to} style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 6, transition: 'color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--teal)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >{l}</Link>
            ))}
          </div>

          {/* Legal */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: '0.75rem', color: 'var(--text)' }}>Legal</div>
            {[
              { to: '/terminos', l: 'Términos de servicio' },
              { to: '/privacidad', l: 'Política de privacidad' },
              { to: '/privacidad#cookies', l: 'Cookies' },
            ].map(({ to, l }) => (
              <Link key={to} to={to} style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 6, transition: 'color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--teal)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >{l}</Link>
            ))}
            <div style={{ marginTop: '1rem', fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              📧 hola@nexusstrategy.online
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} Global Nexus · nexusstrategy.online · Plataforma B2B México–Europa
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>🔒 SSL Secure</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>💳 Powered by Stripe</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>🛡️ RGPD</span>
        </div>
      </div>
    </footer>
  )
}

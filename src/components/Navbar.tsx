import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  const links = [
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/productores', label: 'Productores' },
    { to: '/comunidad', label: 'Comunidad' },
    { to: '/oportunidades', label: '🔥 Ofertas' },
    { to: '/precios', label: 'Precios' },
  ]

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      boxShadow: '0 1px 3px rgba(0,0,0,.05)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.25rem', display: 'flex', alignItems: 'center', height: 60, gap: '1.5rem' }}>

        {/* Logo */}
        <Link to="/" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'linear-gradient(135deg, #0D9488, #1E3A5F)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem',
          }}>🌐</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1 }}>Global Nexus</div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '.04em', lineHeight: 1 }}>México · Europa</div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div style={{ display: 'flex', gap: '.15rem', flex: 1 }} className="nav-desktop">
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              padding: '6px 12px', borderRadius: 8, fontSize: '13.5px', fontWeight: 500,
              color: pathname.startsWith(l.to) ? 'var(--teal)' : 'var(--text-muted)',
              background: pathname.startsWith(l.to) ? 'var(--teal-light)' : 'transparent',
              transition: 'all .15s', textDecoration: 'none', whiteSpace: 'nowrap',
            }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* TLCUEM badge - desktop only */}
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <span className="badge badge-green" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>✓ TLCUEM 0%</span>
        </div>

        {/* Desktop auth */}
        <div className="nav-desktop" style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <Link to="/login" className="btn btn-ghost" style={{ fontSize: '13px', padding: '7px 14px' }}>
            Iniciar sesión
          </Link>
          <Link to="/registro" className="btn btn-primary" style={{ fontSize: '13px', padding: '7px 14px' }}>
            Registrarse
          </Link>
        </div>

        {/* Mobile: auth + hamburger */}
        <div className="nav-mobile" style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          <Link to="/registro" className="btn btn-primary" style={{ fontSize: '12px', padding: '7px 13px' }}>
            Registrarse
          </Link>
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menú"
            style={{ width: 38, height: 38, borderRadius: 9, border: '1.5px solid var(--border)', background: 'var(--surface2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 5 }}
          >
            <span style={{ display: 'block', width: 18, height: 2, background: menuOpen ? 'var(--teal)' : 'var(--text)', borderRadius: 2, transition: 'all .2s', transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
            <span style={{ display: 'block', width: 18, height: 2, background: menuOpen ? 'var(--teal)' : 'var(--text)', borderRadius: 2, transition: 'all .2s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: 18, height: 2, background: menuOpen ? 'var(--teal)' : 'var(--text)', borderRadius: 2, transition: 'all .2s', transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="nav-mobile" style={{ borderTop: '1px solid var(--border)', background: 'var(--white)', padding: '1rem 1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} style={{
                padding: '12px 14px', borderRadius: 10, fontSize: '15px', fontWeight: 600,
                color: pathname.startsWith(l.to) ? 'var(--teal)' : 'var(--text)',
                background: pathname.startsWith(l.to) ? 'var(--teal-light)' : 'transparent',
                textDecoration: 'none', display: 'block',
              }}>
                {l.label}
              </Link>
            ))}
            <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
            <Link to="/login" onClick={() => setMenuOpen(false)} style={{ padding: '12px 14px', borderRadius: 10, fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none', display: 'block' }}>
              Iniciar sesión
            </Link>
            <div style={{ marginTop: 4, padding: '10px 14px', background: 'var(--teal-light)', borderRadius: 10 }}>
              <span className="badge badge-green">✓ TLCUEM 0% aranceles EU</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

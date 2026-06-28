import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  const links = [
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/productores', label: 'Productores' },
    { to: '/como-funciona', label: 'Cómo funciona' },
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
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', height: 64, gap: '2rem' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #0D9488, #1E3A5F)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem',
          }}>🌐</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', lineHeight: 1 }}>Global Nexus</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '.04em', lineHeight: 1 }}>México · Europa</div>
          </div>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '.25rem', flex: 1 }} className="hidden-mobile">
          {links.map(l => (
            <Link
              key={l.to} to={l.to}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: '14px', fontWeight: 500,
                color: pathname.startsWith(l.to) ? 'var(--teal)' : 'var(--text-muted)',
                background: pathname.startsWith(l.to) ? 'var(--teal-light)' : 'transparent',
                transition: 'all .15s',
              }}
              onMouseEnter={e => { if (!pathname.startsWith(l.to)) { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text)' } }}
              onMouseLeave={e => { if (!pathname.startsWith(l.to)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' } }}
            >{l.label}</Link>
          ))}
        </div>

        {/* TLCUEM badge */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden-mobile">
          <span className="badge badge-green">✓ TLCUEM 0% aranceles</span>
        </div>

        {/* Auth buttons */}
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <Link to="/login" className="btn btn-ghost" style={{ fontSize: '13px', padding: '8px 16px' }}>
            Iniciar sesión
          </Link>
          <Link to="/registro" className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>
            Registrarse
          </Link>
        </div>
      </div>
    </nav>
  )
}

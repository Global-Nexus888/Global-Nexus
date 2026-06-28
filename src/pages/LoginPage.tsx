import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'productor' | 'comprador'>('productor')

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
    fontSize: '14px', background: 'var(--white)', transition: 'border-color .15s',
    fontFamily: 'inherit',
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #0D9488, #1E3A5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 12px' }}>🌐</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Bienvenido de nuevo</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: 4 }}>Accede a tu cuenta Global Nexus</p>
        </div>

        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem', boxShadow: 'var(--shadow-md)' }}>
          {/* Role toggle */}
          <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: 8, padding: 4, marginBottom: '1.5rem' }}>
            {(['productor', 'comprador'] as const).map(r => (
              <button key={r} onClick={() => setRole(r)}
                style={{ flex: 1, padding: '8px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all .15s', background: role === r ? 'var(--white)' : 'transparent', color: role === r ? 'var(--teal)' : 'var(--text-muted)', boxShadow: role === r ? 'var(--shadow-sm)' : 'none' }}
              >{r === 'productor' ? '🏭 Productor' : '🇪🇺 Comprador EU'}</button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: 6 }}>Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="tu@empresa.com" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--teal)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: 6 }}>Contraseña</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--teal)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
            </div>
            <div style={{ textAlign: 'right' }}>
              <Link to="#" style={{ fontSize: '13px', color: 'var(--teal)', fontWeight: 500 }}>¿Olvidaste tu contraseña?</Link>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px' }}>
              Iniciar sesión
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '13px', color: 'var(--text-muted)' }}>
            ¿No tienes cuenta? <Link to="/registro" style={{ color: 'var(--teal)', fontWeight: 600 }}>Regístrate gratis</Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <span className="badge badge-green">✓ Plataforma segura · SSL · Datos protegidos</span>
        </div>
      </div>
    </div>
  )
}

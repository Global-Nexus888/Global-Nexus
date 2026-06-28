import { useState } from 'react'
import { Link } from 'react-router-dom'

type Role = 'productor' | 'comprador'

const PRODUCER_FIELDS = [
  { name: 'company', label: 'Nombre de empresa', type: 'text', placeholder: 'Mi Empresa S.A. de C.V.' },
  { name: 'state', label: 'Estado de México', type: 'text', placeholder: 'Jalisco, Oaxaca, Chiapas...' },
  { name: 'category', label: 'Categoría principal', type: 'text', placeholder: 'Bebidas, Agricultura, Artesanías...' },
  { name: 'email', label: 'Email empresarial', type: 'email', placeholder: 'contacto@empresa.com' },
  { name: 'password', label: 'Contraseña', type: 'password', placeholder: '••••••••' },
]

const BUYER_FIELDS = [
  { name: 'company', label: 'Empresa / Organización', type: 'text', placeholder: 'Company GmbH' },
  { name: 'country', label: 'País (UE)', type: 'text', placeholder: 'Alemania, Países Bajos, Francia...' },
  { name: 'interest', label: '¿Qué productos buscas?', type: 'text', placeholder: 'Tequila, café orgánico, artesanías...' },
  { name: 'email', label: 'Email empresarial', type: 'email', placeholder: 'contact@company.eu' },
  { name: 'password', label: 'Contraseña', type: 'password', placeholder: '••••••••' },
]

export default function RegisterPage() {
  const [role, setRole] = useState<Role>('productor')

  const fields = role === 'productor' ? PRODUCER_FIELDS : BUYER_FIELDS

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
    fontSize: '14px', background: 'var(--white)', transition: 'border-color .15s',
    fontFamily: 'inherit',
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #0D9488, #1E3A5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 12px' }}>🌐</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Crear cuenta gratis</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: 4 }}>Únete a la plataforma México–Europa</p>
        </div>

        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem', boxShadow: 'var(--shadow-md)' }}>
          {/* Role toggle */}
          <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: 8, padding: 4, marginBottom: '1.5rem' }}>
            {(['productor', 'comprador'] as const).map(r => (
              <button key={r} onClick={() => setRole(r)}
                style={{ flex: 1, padding: '8px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all .15s', background: role === r ? 'var(--white)' : 'transparent', color: role === r ? 'var(--teal)' : 'var(--text-muted)', boxShadow: role === r ? 'var(--shadow-sm)' : 'none' }}
              >{r === 'productor' ? '🏭 Soy productor' : '🇪🇺 Soy comprador EU'}</button>
            ))}
          </div>

          <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {fields.map(f => (
              <div key={f.name}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--teal)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
              </div>
            ))}

            <label style={{ display: 'flex', gap: 8, fontSize: '12px', color: 'var(--text-muted)', cursor: 'pointer', alignItems: 'flex-start' }}>
              <input type="checkbox" required style={{ accentColor: 'var(--teal)', marginTop: 2 }} />
              Acepto los <Link to="#" style={{ color: 'var(--teal)' }}>Términos de servicio</Link> y la <Link to="#" style={{ color: 'var(--teal)' }}>Política de privacidad</Link>
            </label>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '.25rem' }}>
              {role === 'productor' ? '🏭 Crear cuenta de productor' : '🇪🇺 Crear cuenta de comprador'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '13px', color: 'var(--text-muted)' }}>
            ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--teal)', fontWeight: 600 }}>Iniciar sesión</Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge badge-green">✓ Gratis</span>
          <span className="badge badge-teal">✓ Sin comisiones</span>
          <span className="badge badge-navy">✓ TLCUEM verificado</span>
        </div>
      </div>
    </div>
  )
}

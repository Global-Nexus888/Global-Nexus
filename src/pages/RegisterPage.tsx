import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useT } from '../lib/translations'

type Role = 'productor' | 'comprador'

export default function RegisterPage() {
  const [role, setRole] = useState<Role>('productor')
  const [form, setForm] = useState({ name: '', company: '', state: '', country: '', category: '', interest: '', email: '', password: '' })
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { lang } = useLang()
  const T = useT(lang)

  const inputStyle = {
    width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)', fontSize: '14px', background: 'var(--white)',
    transition: 'border-color .15s', fontFamily: 'inherit', boxSizing: 'border-box' as const,
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) { setError(lang === 'es' ? 'Debes aceptar los términos para continuar.' : 'You must accept the terms to continue.'); return }
    if (form.password.length < 6) { setError(lang === 'es' ? 'La contraseña debe tener al menos 6 caracteres.' : 'Password must be at least 6 characters.'); return }
    setError('')
    setLoading(true)
    // Simulate registration - in production connect to your backend/Supabase/Firebase
    setTimeout(() => {
      // Save to localStorage for demo tracking
      const users = JSON.parse(localStorage.getItem('gn_users') || '[]')
      users.push({ ...form, role, createdAt: new Date().toISOString(), id: Date.now() })
      localStorage.setItem('gn_users', JSON.stringify(users))
      localStorage.setItem('gn_current_user', JSON.stringify({ ...form, role }))
      setLoading(false)
      setSuccess(true)
    }, 1200)
  }

  if (success) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: 460, textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--green-light)', border: '3px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem' }}>✓</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text)' }}>{T('reg_success_title')}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '2rem', lineHeight: 1.7 }}>
            {T('reg_success_sub')}
          </p>
          <div style={{ background: 'var(--teal-light)', border: '1px solid var(--teal)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1rem', textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--teal-dark)', marginBottom: 8 }}>
              👋 {lang === 'es' ? 'Hola' : lang === 'nl' ? 'Hallo' : lang === 'de' ? 'Hallo' : 'Hello'}, {form.name || form.company}
            </div>
            <div style={{ fontSize: 13, color: 'var(--teal-dark)', lineHeight: 1.6 }}>
              {lang === 'es' ? `Cuenta creada como ${role === 'productor' ? '🏭 Productor' : '🇪🇺 Comprador EU'} · ${form.email}` :
               lang === 'nl' ? `Account aangemaakt als ${role === 'productor' ? '🏭 Producent' : '🇪🇺 EU-koper'} · ${form.email}` :
               lang === 'de' ? `Konto erstellt als ${role === 'productor' ? '🏭 Produzent' : '🇪🇺 EU-Käufer'} · ${form.email}` :
               `Account created as ${role === 'productor' ? '🏭 Producer' : '🇪🇺 EU Buyer'} · ${form.email}`}
            </div>
          </div>

          {/* Launch date notice */}
          <div style={{ background: '#FFF7ED', border: '1.5px solid #FCD34D', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: '#92400E', marginBottom: 5 }}>
              🚀 {lang === 'es' ? 'Fecha de activación de tu perfil' : lang === 'nl' ? 'Activeringsdatum van uw profiel' : lang === 'de' ? 'Aktivierungsdatum Ihres Profils' : 'Profile activation date'}
            </div>
            <div style={{ fontSize: 13, color: '#78350F', lineHeight: 1.65 }}>
              {lang === 'es'
                ? 'Tu registro ha sido guardado exitosamente. Tu perfil se activará automáticamente el 28 de agosto de 2026 a las 12:00 pm hora CDMX (Ciudad de México). A partir de esa fecha podrás conectar con compradores europeos y aparecer en el catálogo. ¡Gracias por ser parte del lanzamiento!'
                : lang === 'nl'
                ? 'Uw registratie is succesvol opgeslagen. Uw profiel wordt automatisch geactiveerd op 28 augustus 2026 om 12:00 uur CDMX-tijd (Mexico-Stad). Vanaf die datum kunt u verbinding maken met Europese kopers. Bedankt dat u deel uitmaakt van de lancering!'
                : lang === 'de'
                ? 'Ihre Registrierung wurde erfolgreich gespeichert. Ihr Profil wird automatisch am 28. August 2026 um 12:00 Uhr CDMX-Zeit (Mexiko-Stadt) aktiviert. Ab diesem Datum können Sie sich mit europäischen Käufern verbinden. Danke, dass Sie Teil der Markteinführung sind!'
                : 'Your registration has been saved successfully. Your profile will be automatically activated on August 28, 2026 at 12:00 pm CDMX time (Mexico City). From that date you can connect with European buyers and appear in the catalog. Thank you for being part of the launch!'}
            </div>
          </div>
          <button onClick={() => navigate('/precios')} className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: '15px', marginBottom: '0.75rem' }}>
            {T('reg_success_btn')}
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn btn-ghost" style={{ width: '100%', padding: '11px', fontSize: '14px' }}>
            {lang === 'es' ? 'Ir a mi dashboard' : lang === 'nl' ? 'Naar mijn dashboard' : lang === 'de' ? 'Zu meinem Dashboard' : 'Go to my dashboard'}
          </button>
        </div>
      </div>
    )
  }

  const producerFields = [
    { key: 'name',     label: T('reg_name'),    type: 'text',     placeholder: T('reg_name_placeholder') },
    { key: 'company',  label: T('reg_company'),  type: 'text',     placeholder: 'Mi Empresa S.A. de C.V.' },
    { key: 'state',    label: T('reg_state'),    type: 'text',     placeholder: 'Jalisco, Oaxaca, Chiapas...' },
    { key: 'category', label: T('reg_category'), type: 'text',     placeholder: 'Bebidas, Agricultura...' },
    { key: 'email',    label: T('reg_email'),    type: 'email',    placeholder: 'contacto@empresa.com' },
    { key: 'password', label: T('reg_password'), type: 'password', placeholder: '••••••••' },
  ]

  const buyerFields = [
    { key: 'name',     label: T('reg_name'),         type: 'text',     placeholder: T('reg_name_placeholder') },
    { key: 'company',  label: T('reg_company_buyer'), type: 'text',     placeholder: 'Company GmbH' },
    { key: 'country',  label: T('reg_country'),       type: 'text',     placeholder: 'Germany, Netherlands...' },
    { key: 'interest', label: T('reg_interest'),      type: 'text',     placeholder: 'Tequila, organic coffee...' },
    { key: 'email',    label: T('reg_email'),          type: 'email',    placeholder: 'contact@company.eu' },
    { key: 'password', label: T('reg_password'),       type: 'password', placeholder: '••••••••' },
  ]

  const fields = role === 'productor' ? producerFields : buyerFields

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #0D9488, #1E3A5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 12px' }}>🌐</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{T('reg_title')}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: 4 }}>{T('reg_sub')}</p>
        </div>

        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem', boxShadow: 'var(--shadow-md)' }}>
          {/* Role toggle */}
          <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: 8, padding: 4, marginBottom: '1.5rem' }}>
            {(['productor', 'comprador'] as const).map(r => (
              <button key={r} onClick={() => setRole(r)}
                style={{ flex: 1, padding: '8px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all .15s', background: role === r ? 'var(--white)' : 'transparent', color: role === r ? 'var(--teal)' : 'var(--text-muted)', boxShadow: role === r ? 'var(--shadow-sm)' : 'none' }}
              >{r === 'productor' ? T('reg_role_producer') : T('reg_role_buyer')}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {fields.map(f => (
              <div key={f.key}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input
                  type={f.type} placeholder={f.placeholder} value={form[f.key as keyof typeof form]}
                  onChange={set(f.key)} required style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--teal)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>
            ))}

            <label style={{ display: 'flex', gap: 8, fontSize: '12px', color: 'var(--text-muted)', cursor: 'pointer', alignItems: 'flex-start' }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ accentColor: 'var(--teal)', marginTop: 2, flexShrink: 0 }} />
              <span>
                {T('reg_terms')} <Link to="/terminos" style={{ color: 'var(--teal)' }}>{T('reg_terms_link')}</Link> {T('reg_and')} <Link to="/privacidad" style={{ color: 'var(--teal)' }}>{T('reg_privacy_link')}</Link>
              </span>
            </label>

            {error && (
              <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#DC2626' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '.25rem', opacity: loading ? .7 : 1 }}>
              {loading ? '⏳...' : role === 'productor' ? T('reg_btn_producer') : T('reg_btn_buyer')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '13px', color: 'var(--text-muted)' }}>
            {T('reg_have_account')} <Link to="/login" style={{ color: 'var(--teal)', fontWeight: 600 }}>{T('reg_login')}</Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge badge-green">{T('reg_badge_free')}</span>
          <span className="badge badge-teal">{T('reg_badge_no_fee')}</span>
          <span className="badge badge-navy">{T('reg_badge_tlcuem')}</span>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useT } from '../lib/translations'
import { supabase } from '../lib/supabase'
import { setSessionExpiry } from '../hooks/useSession'
import { sendChatMessage, ADMIN_EMAIL, ADMIN_NAME } from '../lib/chat'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'productor' | 'comprador'>('productor')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { lang } = useLang()
  const T = useT(lang)

  const inputStyle = {
    width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)', fontSize: '14px', background: 'var(--white)',
    transition: 'border-color .15s', fontFamily: 'inherit',
  }

  // Handle Google OAuth callback
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const u = session.user
      const oauthRole = (sessionStorage.getItem('gn_oauth_role') || role) as 'productor' | 'comprador'
      sessionStorage.removeItem('gn_oauth_role')

      // Fetch or create usuario record
      const { data: profile } = await supabase.from('usuarios').select('*').eq('id', u.id).single()
      const userData = profile || {
        id: u.id, email: u.email,
        name: u.user_metadata?.full_name || u.email?.split('@')[0] || '',
        company: '', role: oauthRole, plan: 'explorador', plan_active: false,
      }
      if (!profile) {
        await supabase.from('usuarios').upsert(userData).catch(() => {})
        // Send welcome message
        const welcomeMsg = oauthRole === 'comprador'
          ? `¡Bienvenido/a a Global Nexus! 🌐 Tu cuenta de comprador EU ha sido registrada vía Google. A partir del lanzamiento oficial (3 de septiembre de 2026) podrás explorar el catálogo completo de productores mexicanos verificados. ¡Éxito!`
          : `¡Bienvenido/a a Global Nexus! 🌐 Tu perfil de productor ha sido registrado vía Google. Completa tu perfil y sube tu catálogo para el lanzamiento el 3 de septiembre de 2026.`
        sendChatMessage(ADMIN_EMAIL, ADMIN_NAME, u.email!, welcomeMsg).catch(() => {})
      }
      localStorage.setItem('gn_current_user', JSON.stringify(userData))
      setSessionExpiry()
      navigate(userData.role === 'comprador' ? '/dashboard-comprador' : '/dashboard')
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    // Store intended role so callback can redirect correctly
    sessionStorage.setItem('gn_oauth_role', role)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/login` },
    })
    if (error) { setError(error.message); setLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Admin bypass (hardcoded)
    if (email === 'brandmkrs.ads@gmail.com' && password === 'nexus2026') {
      localStorage.setItem('gn_current_user', JSON.stringify({ email, role: 'admin' }))
      navigate('/admin')
      return
    }

    // Demo account bypass
    if (email === 'demo@nexusstrategy.online' && password === 'demo2026') {
      localStorage.setItem('gn_current_user', JSON.stringify({ email, role: 'demo', name: 'Demo Account', company: 'Global Nexus Preview' }))
      navigate('/dashboard')
      return
    }

    try {
      // Sign in via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        // If email not confirmed yet, allow login using localStorage profile
        if (authError.message.includes('Email not confirmed') || authError.message.includes('not confirmed')) {
          const stored = localStorage.getItem('gn_current_user')
          if (stored) {
            const u = JSON.parse(stored)
            if (u.email === email) {
              navigate(u.role === 'comprador' ? '/dashboard-comprador' : '/dashboard')
              return
            }
          }
          // Fallback: trust the role selector
          localStorage.setItem('gn_current_user', JSON.stringify({ email, role }))
          setSessionExpiry()
          navigate(role === 'comprador' ? '/dashboard-comprador' : '/dashboard')
          return
        }
        throw authError
      }

      // Fetch user profile from 'usuarios' table — non-blocking fallback
      const { data: profile } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      const user = profile || { email, role: role as string, id: authData.user.id }
      localStorage.setItem('gn_current_user', JSON.stringify(user))
      setSessionExpiry()

      if (user.role === 'comprador') navigate('/dashboard-comprador')
      else navigate('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('Invalid login') || msg.includes('invalid_credentials')) {
        setError(T('login_error'))
      } else {
        setError(msg || T('login_error'))
      }
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #0D9488, #1E3A5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 12px' }}>🌐</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{T('login_title')}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: 4 }}>{T('login_sub')}</p>
        </div>

        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem', boxShadow: 'var(--shadow-md)' }}>
          {/* Role toggle */}
          <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: 8, padding: 4, marginBottom: '1.5rem' }}>
            {(['productor', 'comprador'] as const).map(r => (
              <button key={r} onClick={() => setRole(r)}
                style={{ flex: 1, padding: '8px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all .15s', background: role === r ? 'var(--white)' : 'transparent', color: role === r ? 'var(--teal)' : 'var(--text-muted)', boxShadow: role === r ? 'var(--shadow-sm)' : 'none' }}
              >{r === 'productor' ? T('login_role_producer') : T('login_role_buyer')}</button>
            ))}
          </div>

          {/* Google OAuth */}
          <button type="button" onClick={handleGoogle} disabled={loading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '11px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--white)', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: '1rem', transition: 'border-color .15s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#4285F4')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.2 33.9 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.8 20-21 0-1.4-.1-2.7-.5-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.1 16.5 19.2 14 24 14c3.1 0 5.9 1.1 8.1 2.9l6-6C34.6 5.1 29.6 3 24 3c-7.6 0-14.2 4.4-17.7 11.7z"/><path fill="#FBBC05" d="M24 45c5.5 0 10.5-1.9 14.4-5.1l-6.7-5.5C29.7 35.8 27 37 24 37c-5.8 0-10.2-3.9-11.8-9.2l-7 5.4C8.9 40.6 15.9 45 24 45z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-.8 2.4-2.3 4.5-4.3 5.9l6.7 5.5C41.9 36.3 45 30.6 45 24c0-1.4-.2-2.7-.5-4z"/></svg>
            {lang === 'es' ? 'Continuar con Google' : lang === 'nl' ? 'Doorgaan met Google' : lang === 'de' ? 'Mit Google fortfahren' : 'Continue with Google'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{lang === 'es' ? 'o con email' : lang === 'nl' ? 'of met e-mail' : lang === 'de' ? 'oder mit E-Mail' : 'or with email'}</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: 6 }}>{T('login_email')}</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="tu@empresa.com" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--teal)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: 6 }}>{T('login_password')}</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" required placeholder="••••••••" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--teal)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
            </div>
            <div style={{ textAlign: 'right' }}>
              <Link to="/contacto" style={{ fontSize: '13px', color: 'var(--teal)', fontWeight: 500 }}>{T('login_forgot')}</Link>
            </div>

            {error && (
              <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#DC2626' }}>
                ⚠ {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px', opacity: loading ? .7 : 1 }}>
              {loading ? '⏳...' : T('login_btn')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '13px', color: 'var(--text-muted)' }}>
            {T('login_no_account')} <Link to="/registro" style={{ color: 'var(--teal)', fontWeight: 600 }}>{T('login_register')}</Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <span className="badge badge-green">{T('login_security')}</span>
        </div>
      </div>
    </div>
  )
}

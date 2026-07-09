import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useT } from '../lib/translations'
import { supabase } from '../lib/supabase'
import { setSessionExpiry } from '../hooks/useSession'

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

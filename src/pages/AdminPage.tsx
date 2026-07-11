import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  loadThread, sendChatMessage, markThreadReadByAdmin,
  subscribeThread, ADMIN_EMAIL, ADMIN_NAME,
  type ChatMessage,
} from '../lib/chat'

const ADMIN_PASS = 'nexus2026'

function getLocalUsers() {
  try { return JSON.parse(localStorage.getItem('gn_users') || '[]') } catch { return [] }
}

type AdminTab = 'overview' | 'usuarios' | 'mensajeria' | 'suscripciones' | 'verificaciones' | 'asesores' | 'actividad'

const C = {
  navy: '#1E3A5F', teal: '#0D9488', tealLight: '#CCFBF1', gold: '#D97706',
  green: '#16A34A', red: '#DC2626', border: '#E2E8F0', bg: '#F8FAFC',
  white: '#FFFFFF', text: '#0F172A', muted: '#64748B', purple: '#7C3AED',
}

const QUICK_MSGS = [
  { icon: '👋', text: '¡Bienvenido/a a Global Nexus! Estamos muy contentos de tenerte en la plataforma. ¿En qué podemos ayudarte?' },
  { icon: '📋', text: 'Te recordamos que puedes completar tu perfil, subir tu catálogo y agregar tus certificaciones en el dashboard.' },
  { icon: '🚀', text: 'El lanzamiento oficial es el 28 de agosto de 2026 a las 12:00 pm CDMX. ¡Tu perfil quedará visible para compradores europeos ese día!' },
  { icon: '🛡️', text: 'Hemos revisado tu información y todo se ve excelente. Si necesitas agregar o corregir algo, no dudes en escribirnos.' },
  { icon: '❓', text: '¿Tienes alguna duda sobre el proceso de exportación o el uso de la plataforma? Estamos aquí para apoyarte.' },
]

const PLAN_CHIP: Record<string, { color: string; bg: string }> = {
  productor: { color: '#0F766E', bg: '#CCFBF1' },
  comprador: { color: '#1E3A5F', bg: '#EFF6FF' },
  asesor:    { color: '#7C3AED', bg: '#F3E8FF' },
}

/* ── Helpers ── */
function fmtTime(iso: string) {
  const d = new Date(iso)
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 60) return 'ahora'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}
function fmtFull(iso: string) {
  return new Date(iso).toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
}
function fmtDateSep(iso: string) {
  const d = new Date(iso)
  const diff = (Date.now() - d.getTime()) / 86400000
  if (diff < 1) return 'Hoy'
  if (diff < 2) return 'Ayer'
  return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
}
function sameDaySep(a: string, b: string) {
  return new Date(a).toDateString() === new Date(b).toDateString()
}

/* ── Login ── */
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [pass, setPass]   = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    setTimeout(() => {
      if (email === ADMIN_EMAIL && pass === ADMIN_PASS) onLogin()
      else { setError('Credenciales incorrectas.'); setLoading(false) }
    }, 800)
  }

  const inp: React.CSSProperties = { width: '100%', padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.white, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: C.text }

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(160deg, ${C.navy} 0%, #1a4a7a 55%, #0b7a72 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem', boxShadow: '0 8px 32px rgba(0,0,0,.2)' }}>🌐</div>
          <div style={{ color: C.white, fontSize: '1.4rem', fontWeight: 900 }}>Global Nexus</div>
          <div style={{ color: 'rgba(255,255,255,.65)', fontSize: 13, marginTop: 3 }}>Panel de Administración</div>
        </div>
        <div style={{ background: C.white, borderRadius: 20, padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,.25)' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.5rem', color: C.navy, textAlign: 'center' }}>🔐 Acceso restringido</h2>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 5 }}>Email administrador</label><input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inp} /></div>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 5 }}>Contraseña</label><input type="password" required value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••••" style={inp} /></div>
            {error && <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: C.red }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ marginTop: 4, padding: '13px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, color: C.white, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1 }}>
              {loading ? '⏳ Verificando...' : '→ Acceder al panel'}
            </button>
          </form>
          <div style={{ marginTop: '1.25rem', fontSize: 11, color: C.muted, textAlign: 'center' }}>Acceso exclusivo · Global Nexus Admin</div>
        </div>
      </div>
    </div>
  )
}

function Empty({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: C.muted }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 340, margin: '0 auto' }}>{sub}</div>
    </div>
  )
}

function StatCard({ icon, label, value, sub, color }: { icon: string; label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: '1.4rem' }}>{icon}</div>
      <div style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 900, color: color || C.navy, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted }}>{sub}</div>}
    </div>
  )
}

/* ── Chat window ── */
interface ChatWindowProps {
  user: Record<string, unknown>
  onClose?: () => void
}
function ChatWindow({ user, onClose }: ChatWindowProps) {
  const [messages, setMessages]   = useState<ChatMessage[]>([])
  const [input, setInput]         = useState('')
  const [sending, setSending]     = useState(false)
  const [showQuick, setShowQuick] = useState(false)
  const [loading, setLoading]     = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textRef   = useRef<HTMLTextAreaElement>(null)
  const userEmail = String(user.email || '')
  const userName  = String(user.name || user.company || '')

  const scrollBottom = () => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)

  useEffect(() => {
    setLoading(true)
    loadThread(userEmail).then(msgs => {
      setMessages(msgs)
      setLoading(false)
      scrollBottom()
      markThreadReadByAdmin(userEmail)
    })
    const unsub = subscribeThread(userEmail, (msg) => {
      setMessages(prev => {
        if (prev.find(m => m.id === msg.id)) return prev
        return [...prev, msg]
      })
      scrollBottom()
    })
    return unsub
  }, [userEmail])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    setInput('')
    const msg = await sendChatMessage(ADMIN_EMAIL, ADMIN_NAME, userEmail, text)
    setMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg])
    scrollBottom()
    setSending(false)
    textRef.current?.focus()
  }, [input, sending, userEmail])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const roleIcon = user.role === 'productor' ? '🏭' : user.role === 'asesor' ? '🎓' : '🇪🇺'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.white }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10, background: C.white, flexShrink: 0 }}>
        <div style={{ width: 40, height: 40, borderRadius: 11, background: user.role === 'productor' ? C.tealLight : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', flexShrink: 0 }}>{roleIcon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: C.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</div>
          <div style={{ fontSize: 11, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</div>
        </div>
        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
          {user.phone && (
            <a href={`https://wa.me/${String(user.phone).replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
              style={{ fontSize: 11, padding: '4px 9px', borderRadius: 7, background: '#F0FDF4', border: '1px solid #86EFAC', color: C.green, fontWeight: 700, textDecoration: 'none' }}>💬 WA</a>
          )}
          <a href={`mailto:${userEmail}`} target="_blank" rel="noreferrer"
            style={{ fontSize: 11, padding: '4px 9px', borderRadius: 7, background: '#EFF6FF', border: `1px solid #BFDBFE`, color: C.navy, fontWeight: 700, textDecoration: 'none' }}>✉️</a>
          {onClose && <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${C.border}`, background: 'transparent', cursor: 'pointer', color: C.muted, fontSize: '1rem' }}>✕</button>}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: 3, background: '#F1F5F9' }}>
        {loading
          ? <div style={{ textAlign: 'center', padding: '3rem', color: C.muted, fontSize: 13 }}>⏳ Cargando conversación...</div>
          : messages.length === 0
            ? <div style={{ textAlign: 'center', padding: '3rem 2rem', color: C.muted }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>💬</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>Sin mensajes aún</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Envía el primer mensaje a {userName}</div>
              </div>
            : messages.map((msg, i) => {
                const isAdmin = msg.from_email === ADMIN_EMAIL
                const showDate = i === 0 || !sameDaySep(messages[i - 1].sent_at, msg.sent_at)
                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div style={{ textAlign: 'center', margin: '10px 0 6px' }}>
                        <span style={{ fontSize: 10, color: C.muted, background: '#E2E8F0', padding: '3px 10px', borderRadius: 100 }}>{fmtDateSep(msg.sent_at)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: isAdmin ? 'flex-end' : 'flex-start', marginBottom: 2 }}>
                      {!isAdmin && (
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: C.tealLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', marginRight: 6, flexShrink: 0, alignSelf: 'flex-end' }}>{roleIcon}</div>
                      )}
                      <div style={{ maxWidth: '72%' }}>
                        {!isAdmin && <div style={{ fontSize: 10, color: C.muted, marginBottom: 2, fontWeight: 600 }}>{msg.from_name}</div>}
                        <div style={{
                          background: isAdmin ? `linear-gradient(135deg, ${C.teal}, ${C.navy})` : C.white,
                          color: isAdmin ? C.white : C.text,
                          borderRadius: isAdmin ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                          padding: '9px 13px',
                          fontSize: 13, lineHeight: 1.55,
                          border: isAdmin ? 'none' : `1px solid ${C.border}`,
                          boxShadow: '0 1px 3px rgba(0,0,0,.07)',
                          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                        }}>{msg.body}</div>
                        <div style={{ fontSize: 10, color: C.muted, marginTop: 2, textAlign: isAdmin ? 'right' : 'left', display: 'flex', alignItems: 'center', justifyContent: isAdmin ? 'flex-end' : 'flex-start', gap: 4 }}>
                          {fmtFull(msg.sent_at)}
                          {isAdmin && <span style={{ color: msg.read ? C.teal : C.muted }}>{msg.read ? '✓✓' : '✓'}</span>}
                        </div>
                      </div>
                      {isAdmin && (
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', marginLeft: 6, flexShrink: 0, alignSelf: 'flex-end' }}>👑</div>
                      )}
                    </div>
                  </div>
                )
              })
        }
        <div ref={bottomRef} />
      </div>

      {/* Quick messages */}
      {showQuick && (
        <div style={{ background: C.bg, borderTop: `1px solid ${C.border}`, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 220, overflowY: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 2 }}>💬 Mensajes rápidos</div>
          {QUICK_MSGS.map((q, i) => (
            <button key={i} onClick={() => { setInput(q.text); setShowQuick(false); textRef.current?.focus() }}
              style={{ textAlign: 'left', padding: '7px 10px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.white, fontSize: 12, color: C.text, cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1.4 }}
              onMouseEnter={e => { e.currentTarget.style.background = C.tealLight; e.currentTarget.style.borderColor = C.teal }}
              onMouseLeave={e => { e.currentTarget.style.background = C.white; e.currentTarget.style.borderColor = C.border }}>
              {q.icon} {q.text.length > 80 ? q.text.slice(0, 80) + '…' : q.text}
            </button>
          ))}
        </div>
      )}

      {/* Compose */}
      <div style={{ padding: '10px 12px', borderTop: `1px solid ${C.border}`, background: C.white, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
          <button onClick={() => setShowQuick(p => !p)} title="Mensajes rápidos"
            style={{ height: 36, padding: '0 10px', borderRadius: 9, border: `1.5px solid ${showQuick ? C.teal : C.border}`, background: showQuick ? C.tealLight : 'transparent', color: showQuick ? C.teal : C.muted, fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit' }}>
            ⚡
          </button>
          <textarea ref={textRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey} placeholder={`Mensaje para ${userName}… (Enter envía, Shift+Enter nueva línea)`} rows={1}
            style={{ flex: 1, padding: '9px 12px', borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, resize: 'none', fontFamily: 'inherit', color: C.text, background: C.bg, lineHeight: 1.5, maxHeight: 90, outline: 'none', overflowY: 'auto' }}
            onFocus={e => (e.target.style.borderColor = C.teal)}
            onBlur={e => (e.target.style.borderColor = C.border)} />
          <button onClick={send} disabled={!input.trim() || sending}
            style={{ width: 38, height: 38, borderRadius: 10, border: 'none', background: input.trim() ? `linear-gradient(135deg, ${C.teal}, ${C.navy})` : C.border, color: C.white, fontSize: '1.1rem', cursor: input.trim() ? 'pointer' : 'default', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s' }}>
            {sending ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN ADMIN PAGE
═══════════════════════════════════════════ */
export default function AdminPage() {
  const navigate = useNavigate()
  const [auth, setAuth]   = useState(false)
  const [tab, setTab]     = useState<AdminTab>('overview')
  const [users, setUsers] = useState<Record<string,unknown>[]>([])
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // User detail panel
  const [selectedUser, setSelectedUser]   = useState<Record<string,unknown> | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [userDetail, setUserDetail] = useState<{
    products: Record<string,unknown>[]
    awards: Record<string,unknown>[]
    perfil: Record<string,unknown> | null
    story: Record<string,unknown> | null
  } | null>(null)

  // Messaging — active chat thread
  const [chatUser, setChatUser]     = useState<Record<string,unknown> | null>(null)
  const [msgSearch, setMsgSearch]   = useState('')
  const [msgFilter, setMsgFilter]   = useState<'all' | 'productor' | 'comprador'>('all')
  const [threadPreviews, setThreadPreviews] = useState<Record<string, { last: ChatMessage | null; unread: number }>>({})

  const openUser = async (u: Record<string,unknown>) => {
    setSelectedUser(u); setDetailLoading(true); setUserDetail(null)
    const email = String(u.email || '')
    const [{ data: products }, { data: awards }, { data: perfiles }, { data: historia }] = await Promise.all([
      supabase.from('productos').select('*').eq('user_email', email),
      supabase.from('premios').select('*').eq('user_email', email),
      supabase.from('perfiles').select('*').eq('email', email),
      supabase.from('historia').select('*').eq('email', email),
    ])
    setUserDetail({ products: products || [], awards: awards || [], perfil: perfiles?.[0] || null, story: historia?.[0] || null })
    setDetailLoading(false)
  }

  const loadUsers = async () => {
    try {
      const { data: sbUsers } = await supabase.from('usuarios').select('*').order('created_at', { ascending: false })
      if (sbUsers && sbUsers.length > 0) {
        const { data: prods } = await supabase.from('productos').select('user_email')
        const countMap: Record<string, number> = {}
        ;(prods || []).forEach((p: { user_email: string }) => { countMap[p.user_email] = (countMap[p.user_email] || 0) + 1 })
        setUsers(sbUsers.map(u => ({ ...u, productCount: countMap[u.email] || 0 })))
      } else { setUsers(getLocalUsers()) }
    } catch { setUsers(getLocalUsers()) }
    setLastRefresh(new Date())
  }

  // Load thread previews for sidebar
  const loadPreviews = useCallback(async (userList: Record<string,unknown>[]) => {
    const previews: Record<string, { last: ChatMessage | null; unread: number }> = {}
    await Promise.all(userList.map(async u => {
      const email = String(u.email || '')
      const msgs = await loadThread(email)
      const last = msgs[msgs.length - 1] || null
      const unread = msgs.filter(m => m.to_email === ADMIN_EMAIL && !m.read).length
      previews[email] = { last, unread }
    }))
    setThreadPreviews(previews)
  }, [])

  useEffect(() => {
    if (!auth) return
    loadUsers()
    const iv = setInterval(loadUsers, 30000)
    return () => clearInterval(iv)
  }, [auth])

  useEffect(() => {
    if (auth && users.length > 0) loadPreviews(users)
  }, [auth, users, loadPreviews])

  if (!auth) return <AdminLogin onLogin={() => setAuth(true)} />

  const totalUsers    = users.length
  const totalProd     = users.filter(u => u.role === 'productor').length
  const totalBuyers   = users.filter(u => u.role === 'comprador').length
  const totalAsesores = users.filter(u => u.role === 'asesor').length
  const totalUnread   = Object.values(threadPreviews).reduce((s, p) => s + p.unread, 0)

  const navItems: { id: AdminTab; label: string; icon: string; badge?: number }[] = [
    { id: 'overview',       label: 'Dashboard',      icon: '📊' },
    { id: 'usuarios',       label: 'Usuarios',       icon: '👥', badge: totalUsers || undefined },
    { id: 'mensajeria',     label: 'Mensajería',     icon: '💬', badge: totalUnread || undefined },
    { id: 'suscripciones',  label: 'Suscripciones',  icon: '💳' },
    { id: 'verificaciones', label: 'Verificaciones', icon: '🛡️' },
    { id: 'asesores',       label: 'Asesores',       icon: '🎓', badge: totalAsesores || undefined },
    { id: 'actividad',      label: 'Actividad',      icon: '⚡' },
  ]

  const SidebarBtn = ({ item }: { item: typeof navItems[0] }) => (
    <button onClick={() => setTab(item.id)}
      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 3, textAlign: 'left', background: tab === item.id ? `${C.teal}15` : 'transparent', color: tab === item.id ? C.teal : C.muted }}>
      <span style={{ fontSize: '1rem' }}>{item.icon}</span>
      <span style={{ fontSize: 14, fontWeight: tab === item.id ? 700 : 500, flex: 1 }}>{item.label}</span>
      {item.badge !== undefined && (
        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: tab === item.id ? C.teal : (item.id === 'mensajeria' && item.badge ? '#EF4444' : C.border), color: tab === item.id ? C.white : (item.id === 'mensajeria' && item.badge ? C.white : C.muted) }}>{item.badge}</span>
      )}
    </button>
  )

  const fmtDate = (u: Record<string,unknown>) =>
    u.created_at ? new Date(String(u.created_at)).toLocaleDateString('es-MX')
    : u.createdAt ? new Date(String(u.createdAt)).toLocaleDateString('es-MX') : '—'

  const inp: React.CSSProperties = { width: '100%', padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${C.border}`, background: C.white, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: C.text }

  const filteredUsers = users.filter(u => {
    if (msgFilter !== 'all' && u.role !== msgFilter) return false
    if (msgSearch) {
      const q = msgSearch.toLowerCase()
      return String(u.name || '').toLowerCase().includes(q) || String(u.email || '').toLowerCase().includes(q) || String(u.company || '').toLowerCase().includes(q)
    }
    return true
  })

  // Sort messaging list: threads with messages first, then by last message time
  const sortedForChat = [...filteredUsers].sort((a, b) => {
    const pa = threadPreviews[String(a.email)]?.last?.sent_at || ''
    const pb = threadPreviews[String(b.email)]?.last?.sent_at || ''
    return pb.localeCompare(pa)
  })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: C.bg }}>

      {/* SIDEBAR */}
      <div style={{ width: 240, background: C.white, display: 'flex', flexDirection: 'column', flexShrink: 0, borderRight: `1px solid ${C.border}`, position: 'fixed', top: 0, bottom: 0, zIndex: 50, boxShadow: '2px 0 12px rgba(0,0,0,.04)' }}>
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🌐</div>
            <div>
              <div style={{ color: C.navy, fontWeight: 900, fontSize: '0.9rem' }}>Global Nexus</div>
              <div style={{ color: C.muted, fontSize: 10, fontWeight: 600, letterSpacing: '.04em' }}>ADMIN PANEL</div>
            </div>
          </div>
        </div>
        <div style={{ margin: '1rem .75rem', background: `linear-gradient(135deg, ${C.teal}18, ${C.navy}12)`, border: `1px solid ${C.teal}30`, borderRadius: 10, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.teal, letterSpacing: '.05em', marginBottom: 3 }}>🚀 LANZAMIENTO</div>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.navy }}>28 Ago 2026 · 12:00 CDMX</div>
        </div>
        <nav style={{ padding: '0.5rem 0.75rem', flex: 1 }}>
          {navItems.map(item => <SidebarBtn key={item.id} item={item} />)}
        </nav>
        <div style={{ padding: '1rem 1.25rem', borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem' }}>👑</div>
            <div>
              <div style={{ color: C.text, fontSize: 12, fontWeight: 600 }}>Administrador</div>
              <div style={{ color: C.muted, fontSize: 10 }}>brandmkrs.ads@gmail.com</div>
            </div>
          </div>
          <button onClick={() => navigate('/')} style={{ width: '100%', padding: '8px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, color: C.white, fontSize: 12, fontWeight: 700, cursor: 'pointer', marginBottom: 6 }}>🌐 Ir a la plataforma</button>
          <button onClick={() => setAuth(false)} style={{ width: '100%', padding: '7px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, fontSize: 12, cursor: 'pointer' }}>Cerrar sesión</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, overflowY: tab === 'mensajeria' ? 'hidden' : 'auto', background: C.bg, marginLeft: 240, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Topbar */}
        <div style={{ padding: '1rem 2rem', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.white, boxShadow: '0 1px 6px rgba(0,0,0,.04)', flexShrink: 0 }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.05rem', color: C.navy }}>{navItems.find(n => n.id === tab)?.icon} {navItems.find(n => n.id === tab)?.label}</h1>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 1 }}>{new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: C.muted }}>Actualizado: {lastRefresh.toLocaleTimeString('es-MX')}</span>
            <button onClick={loadUsers} style={{ fontSize: 12, padding: '7px 14px', borderRadius: 8, background: `${C.teal}12`, color: C.teal, fontWeight: 700, border: `1px solid ${C.teal}30`, cursor: 'pointer' }}>↻ Actualizar</button>
          </div>
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: `linear-gradient(135deg, ${C.navy}, #1a4a7a)`, borderRadius: 14, padding: '1.5rem 2rem', color: C.white, display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#5EEAD4', letterSpacing: '.08em', marginBottom: 6 }}>🚀 PRE-LANZAMIENTO — MODO REGISTRO</div>
                <div style={{ fontSize: 'clamp(1rem,2.5vw,1.25rem)', fontWeight: 800, marginBottom: 4 }}>Plataforma en construcción</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', lineHeight: 1.6 }}>Los perfiles se activarán el <strong style={{ color: '#5EEAD4' }}>28 de agosto de 2026 a las 12:00 pm CDMX</strong>.</div>
              </div>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#5EEAD4' }}>{totalUsers}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.65)' }}>registros guardados</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '1rem' }}>
              <StatCard icon="👥" label="Total registros" value={totalUsers} color={C.navy} />
              <StatCard icon="🏭" label="Productores MX" value={totalProd} color={C.teal} />
              <StatCard icon="🇪🇺" label="Compradores EU" value={totalBuyers} color="#1E40AF" />
              <StatCard icon="🎓" label="Asesores Pro" value={totalAsesores} color={C.purple} />
              <StatCard icon="💬" label="Sin leer" value={totalUnread} color={totalUnread > 0 ? C.red : C.muted} />
              <StatCard icon="💳" label="MRR (USD)" value="$0" sub="Se activa el 28 Ago" color={C.green} />
            </div>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: '1rem' }}>Últimos registros</h3>
              {users.length === 0
                ? <Empty icon="📋" title="Sin registros todavía" sub="Los primeros usuarios aparecerán aquí en tiempo real." />
                : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {users.slice(0, 8).map((u, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px', background: C.bg, borderRadius: 10 }}>
                        <div onClick={() => openUser(u)} style={{ width: 36, height: 36, borderRadius: 10, background: `${C.teal}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0, cursor: 'pointer' }}>
                          {u.role === 'productor' ? '🏭' : u.role === 'asesor' ? '🎓' : '🇪🇺'}
                        </div>
                        <div onClick={() => openUser(u)} style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{String(u.name || u.company || '')}</div>
                          <div style={{ fontSize: 11, color: C.muted }}>{String(u.email || '')}</div>
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: PLAN_CHIP[String(u.role)]?.bg || C.bg, color: PLAN_CHIP[String(u.role)]?.color || C.muted }}>{String(u.role || '')}</div>
                        <button onClick={() => { setTab('mensajeria'); setChatUser(u) }}
                          style={{ fontSize: 11, padding: '4px 10px', borderRadius: 7, border: `1px solid ${C.teal}40`, background: `${C.teal}08`, color: C.teal, cursor: 'pointer', fontWeight: 600 }}>💬 Chat</button>
                        <div style={{ fontSize: 11, color: C.muted }}>{fmtDate(u)}</div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        )}

        {/* ── MENSAJERÍA (full-height chat) ── */}
        {tab === 'mensajeria' && (
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', height: 'calc(100vh - 73px)' }}>

            {/* Thread list */}
            <div style={{ width: 280, borderRight: `1px solid ${C.border}`, background: C.white, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              <div style={{ padding: '12px', borderBottom: `1px solid ${C.border}` }}>
                <input value={msgSearch} onChange={e => setMsgSearch(e.target.value)} placeholder="🔍 Buscar usuario..." style={{ ...inp, marginBottom: 7 }} />
                <div style={{ display: 'flex', gap: 4 }}>
                  {(['all','productor','comprador'] as const).map(f => (
                    <button key={f} onClick={() => setMsgFilter(f)} style={{ flex: 1, padding: '5px', fontSize: 10, fontWeight: 700, borderRadius: 6, border: 'none', cursor: 'pointer', background: msgFilter === f ? C.teal : C.bg, color: msgFilter === f ? C.white : C.muted }}>
                      {f === 'all' ? 'Todos' : f === 'productor' ? '🏭' : '🇪🇺'}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {sortedForChat.length === 0
                  ? <Empty icon="👥" title="Sin usuarios" sub="Los usuarios registrados aparecerán aquí." />
                  : sortedForChat.map((u, i) => {
                      const email = String(u.email || '')
                      const preview = threadPreviews[email]
                      const isActive = chatUser?.email === u.email
                      const unread = preview?.unread || 0
                      const last = preview?.last
                      return (
                        <div key={i} onClick={() => setChatUser(u)}
                          style={{ padding: '11px 14px', borderBottom: `1px solid ${C.border}`, cursor: 'pointer', background: isActive ? `${C.teal}10` : 'transparent', borderLeft: `3px solid ${isActive ? C.teal : 'transparent'}`, transition: 'all .12s' }}
                          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = C.bg }}
                          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                              <div style={{ width: 38, height: 38, borderRadius: 10, background: u.role === 'productor' ? C.tealLight : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                                {u.role === 'productor' ? '🏭' : u.role === 'asesor' ? '🎓' : '🇪🇺'}
                              </div>
                              {unread > 0 && (
                                <div style={{ position: 'absolute', top: -3, right: -3, width: 16, height: 16, borderRadius: '50%', background: '#EF4444', border: `2px solid ${C.white}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: C.white }}>{unread}</div>
                              )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 13, fontWeight: unread > 0 ? 800 : 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 130 }}>{String(u.name || u.company || '')}</span>
                                {last && <span style={{ fontSize: 10, color: C.muted, flexShrink: 0 }}>{fmtTime(last.sent_at)}</span>}
                              </div>
                              <div style={{ fontSize: 11, color: unread > 0 ? C.text : C.muted, fontWeight: unread > 0 ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>
                                {last
                                  ? `${last.from_email === ADMIN_EMAIL ? 'Tú: ' : ''}${last.body.slice(0, 40)}${last.body.length > 40 ? '…' : ''}`
                                  : <span style={{ fontStyle: 'italic' }}>Sin mensajes aún</span>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                }
              </div>
            </div>

            {/* Chat area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {chatUser
                ? <ChatWindow key={String(chatUser.email)} user={chatUser} />
                : (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9' }}>
                    <div style={{ textAlign: 'center', color: C.muted }}>
                      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 6 }}>Selecciona una conversación</div>
                      <div style={{ fontSize: 13, maxWidth: 300 }}>Haz clic en cualquier usuario del panel izquierdo para abrir el chat.</div>
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        )}

        {/* ── USUARIOS ── */}
        {tab === 'usuarios' && (
          <div style={{ padding: '1.5rem 2rem' }}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: '1rem' }}>Usuarios registrados ({totalUsers})</h3>
              {users.length === 0
                ? <Empty icon="👥" title="Sin usuarios todavía" sub="Los usuarios registrados en global-nexus.business aparecerán aquí." />
                : <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: C.bg }}>
                          {['Nombre / Empresa', 'Contacto', 'Rol', 'Ubicación', 'Prods.', 'Registro', 'Acciones'].map(h => (
                            <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: C.muted, fontSize: 12, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, i) => (
                          <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}
                            onMouseEnter={e => (e.currentTarget.style.background = C.bg)}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                            <td style={{ padding: '12px 14px', cursor: 'pointer' }} onClick={() => openUser(u)}>
                              <div style={{ fontWeight: 600, color: C.text }}>{String(u.name || '')}</div>
                              {u.company && <div style={{ fontSize: 11, color: C.muted }}>{String(u.company)}</div>}
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              <div style={{ fontSize: 12, color: C.navy, fontWeight: 600 }}>{String(u.email || '')}</div>
                              {u.phone && (
                                <a href={`https://wa.me/${String(u.phone).replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                                  style={{ fontSize: 11, color: C.green, fontWeight: 600, textDecoration: 'none' }}>💬 {String(u.phone)}</a>
                              )}
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: u.role === 'productor' ? C.tealLight : u.role === 'asesor' ? '#F3E8FF' : '#EFF6FF', color: u.role === 'productor' ? '#0F766E' : u.role === 'asesor' ? C.purple : C.navy }}>
                                {u.role === 'productor' ? '🏭 Productor' : u.role === 'asesor' ? '🎓 Asesor' : '🇪🇺 Comprador'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 14px', color: C.muted, fontSize: 12 }}>
                              <div>{String(u.state || '—')}</div>
                              {u.country && u.country !== 'México' && <div style={{ fontSize: 11 }}>{String(u.country)}</div>}
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700, color: Number(u.productCount) > 0 ? C.teal : C.muted }}>{Number(u.productCount) || 0}</td>
                            <td style={{ padding: '12px 14px', color: C.muted, fontSize: 12, whiteSpace: 'nowrap' }}>{fmtDate(u)}</td>
                            <td style={{ padding: '12px 14px' }}>
                              <div style={{ display: 'flex', gap: 5 }}>
                                <button onClick={() => openUser(u)} style={{ fontSize: 11, padding: '4px 9px', borderRadius: 7, border: `1px solid ${C.border}`, background: 'transparent', color: C.teal, cursor: 'pointer', fontWeight: 600 }}>Ver</button>
                                <button onClick={() => { setTab('mensajeria'); setChatUser(u) }} style={{ fontSize: 11, padding: '4px 9px', borderRadius: 7, border: `1px solid ${C.teal}40`, background: `${C.teal}08`, color: C.teal, cursor: 'pointer', fontWeight: 700 }}>💬</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              }
            </div>
          </div>
        )}

        {/* ── SUSCRIPCIONES ── */}
        {tab === 'suscripciones' && (
          <div style={{ padding: '1.5rem 2rem' }}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: '1rem' }}>Suscripciones activas</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <StatCard icon="💳" label="Suscripciones activas" value={0} color={C.green} />
                <StatCard icon="💰" label="MRR (USD)" value="$0" sub="Se activa el 28 Ago 2026" color={C.teal} />
                <StatCard icon="⏳" label="Pre-registros pagados" value={0} color={C.navy} />
              </div>
              <Empty icon="💳" title="Sin suscripciones todavía" sub="Las suscripciones de Stripe aparecerán aquí automáticamente." />
            </div>
          </div>
        )}

        {/* ── VERIFICACIONES ── */}
        {tab === 'verificaciones' && (
          <div style={{ padding: '1.5rem 2rem' }}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: '1rem' }}>Documentos pendientes de revisión</h3>
              <Empty icon="🛡️" title="Sin documentos pendientes" sub="Cuando los usuarios suban sus certificaciones aparecerán aquí." />
            </div>
          </div>
        )}

        {/* ── ASESORES ── */}
        {tab === 'asesores' && (
          <div style={{ padding: '1.5rem 2rem' }}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: 4 }}>Asesores Profesionales</h3>
              {users.filter(u => u.role === 'asesor').length === 0
                ? <Empty icon="🎓" title="Sin asesores registrados" sub="Los asesores registrados aparecerán aquí." />
                : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {users.filter(u => u.role === 'asesor').map((u, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, padding: '12px', background: C.bg, borderRadius: 10, alignItems: 'center' }}>
                        <div onClick={() => openUser(u)} style={{ width: 40, height: 40, borderRadius: 10, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', cursor: 'pointer' }}>🎓</div>
                        <div onClick={() => openUser(u)} style={{ flex: 1, cursor: 'pointer' }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{String(u.name || '')}</div>
                          <div style={{ fontSize: 12, color: C.muted }}>{String(u.email || '')} · {String(u.company || '')}</div>
                        </div>
                        <button onClick={() => { setTab('mensajeria'); setChatUser(u) }} style={{ fontSize: 11, padding: '5px 12px', borderRadius: 8, border: `1px solid ${C.teal}40`, background: `${C.teal}08`, color: C.teal, cursor: 'pointer', fontWeight: 600 }}>💬 Chat</button>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: '#F3E8FF', color: C.purple }}>Asesor Pro</span>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        )}

        {/* ── ACTIVIDAD ── */}
        {tab === 'actividad' && (
          <div style={{ padding: '1.5rem 2rem' }}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: '1rem' }}>Log de actividad de la plataforma</h3>
              <Empty icon="⚡" title="Sin actividad todavía" sub="El historial de registros y acciones aparecerá aquí en tiempo real." />
            </div>
          </div>
        )}
      </div>

      {/* ── USER DETAIL PANEL ── */}
      {selectedUser && (
        <div onClick={() => setSelectedUser(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 540, maxHeight: '95vh', overflowY: 'auto', background: C.white, borderRadius: 18, boxShadow: '0 24px 80px rgba(0,0,0,.25)' }}>
            <div style={{ padding: '1.5rem', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: selectedUser.role === 'productor' ? C.tealLight : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
                {selectedUser.role === 'productor' ? '🏭' : selectedUser.role === 'asesor' ? '🎓' : '🇪🇺'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: C.navy }}>{String(selectedUser.name || '')}</div>
                {selectedUser.company && <div style={{ fontSize: 13, color: C.muted }}>{String(selectedUser.company)}</div>}
                <div style={{ fontSize: 11, color: C.teal, marginTop: 2 }}>{String(selectedUser.email || '')}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button onClick={() => { setSelectedUser(null); setTab('mensajeria'); setChatUser(selectedUser) }}
                  style={{ fontSize: 11, padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.teal}`, background: `${C.teal}10`, color: C.teal, cursor: 'pointer', fontWeight: 700 }}>💬 Chat</button>
                <button onClick={() => setSelectedUser(null)} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: 'transparent', cursor: 'pointer', fontSize: '1rem', color: C.muted }}>✕</button>
              </div>
            </div>
            <div style={{ padding: '1rem 1.5rem', background: C.bg, borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.muted }}>CONTACTO:</span>
              <a href={`mailto:${String(selectedUser.email || '')}`} target="_blank" rel="noreferrer" style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 7, background: '#EFF6FF', color: C.navy, border: '1px solid #BFDBFE', textDecoration: 'none' }}>✉️ Email</a>
              {selectedUser.phone && <a href={`https://wa.me/${String(selectedUser.phone).replace(/\D/g,'')}`} target="_blank" rel="noreferrer" style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 7, background: '#F0FDF4', color: C.green, border: '1px solid #86EFAC', textDecoration: 'none' }}>💬 WhatsApp</a>}
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div style={{ background: C.bg, borderRadius: 12, padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: '1rem' }}>
                {[
                  { label: 'Rol',        value: String(selectedUser.role || '—') },
                  { label: 'Plan',       value: String(selectedUser.plan || 'explorador') },
                  { label: 'Estado',     value: String(selectedUser.state || '—') },
                  { label: 'País',       value: String(selectedUser.country || 'México') },
                  { label: 'Categoría', value: String(selectedUser.category || '—') },
                  { label: 'Interés',   value: String(selectedUser.interest || '—') },
                  { label: 'Teléfono',  value: String(selectedUser.phone || '—') },
                  { label: 'Registro',  value: selectedUser.created_at ? new Date(String(selectedUser.created_at)).toLocaleString('es-MX') : '—' },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 2 }}>{f.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{f.value}</div>
                  </div>
                ))}
              </div>
              {detailLoading
                ? <div style={{ textAlign: 'center', padding: '2rem', color: C.muted, fontSize: 13 }}>⏳ Cargando información...</div>
                : userDetail && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {userDetail.perfil && (
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 12, color: C.navy, marginBottom: 8 }}>📋 Perfil</div>
                        <div style={{ background: C.bg, borderRadius: 10, padding: '.875rem', fontSize: 12, color: C.muted, display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {userDetail.perfil.bio && <div><b>Bio:</b> {String(userDetail.perfil.bio)}</div>}
                          {userDetail.perfil.location && <div><b>Ubicación:</b> {String(userDetail.perfil.location)}</div>}
                          {userDetail.perfil.phone && <div><b>Tel:</b> {String(userDetail.perfil.phone)}</div>}
                          {userDetail.perfil.website && <div><b>Web:</b> {String(userDetail.perfil.website)}</div>}
                        </div>
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12, color: C.navy, marginBottom: 8 }}>📦 Catálogo ({userDetail.products.length} productos)</div>
                      {userDetail.products.length === 0
                        ? <div style={{ fontSize: 12, color: C.muted, fontStyle: 'italic' }}>Sin productos aún.</div>
                        : userDetail.products.map((p, i) => (
                          <div key={i} style={{ background: C.bg, borderRadius: 10, padding: '.875rem', marginBottom: 6, fontSize: 12 }}>
                            <div style={{ fontWeight: 700, color: C.navy }}>{String(p.name || '')}</div>
                            <div style={{ color: C.teal, fontSize: 11 }}>{String(p.category || '')}{p.origin ? ` · ${p.origin}` : ''}</div>
                            {p.price && <div style={{ color: C.muted }}>${String(p.price)} / {String(p.unit || '')}</div>}
                            {Array.isArray(p.cert_docs) && (p.cert_docs as unknown[]).length > 0 && (
                              <div style={{ marginTop: 5, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {(p.cert_docs as Record<string,unknown>[]).map((c, ci) => (
                                  <span key={ci} style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: '#F0FDF4', border: '1px solid #86EFAC', color: C.green }}>✓ {String(c.name || '')}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      }
                    </div>
                    {userDetail.awards.length > 0 && (
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 12, color: C.navy, marginBottom: 8 }}>🏆 Premios</div>
                        {userDetail.awards.map((a, i) => (
                          <div key={i} style={{ background: C.bg, borderRadius: 10, padding: '.875rem', marginBottom: 6, fontSize: 12 }}>
                            <div style={{ fontWeight: 700, color: C.navy }}>{String(a.name || '')}</div>
                            <div style={{ color: C.muted, fontSize: 11 }}>{String(a.org || '')} · {String(a.year || '')}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

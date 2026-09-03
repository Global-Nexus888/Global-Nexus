import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LangContext'
import { translateToAll as _translateToAll, translateText } from '../lib/translate'

function getCachedTr(postId: string, lang: string): string | null {
  try { return sessionStorage.getItem(`tr_${postId}_${lang}`) } catch { return null }
}
function setCachedTr(postId: string, lang: string, text: string) {
  try { sessionStorage.setItem(`tr_${postId}_${lang}`, text) } catch {}
}

const C = {
  navy: '#1E3A5F', teal: '#0D9488', tealLight: '#CCFBF1',
  gold: '#D97706', green: '#16A34A', red: '#DC2626',
  purple: '#7C3AED', border: '#E2E8F0', bg: '#F8FAFC',
  white: '#FFFFFF', text: '#0F172A', muted: '#64748B',
}

const ROLE_META: Record<string, { icon: string; color: string; bg: string; label: Record<string,string> }> = {
  productor: { icon: '🏭', color: '#0F766E', bg: C.tealLight,  label: { es: 'Productor MX', en: 'MX Producer', nl: 'MX Producent', de: 'MX Produzent' } },
  comprador: { icon: '🇪🇺', color: '#1E40AF', bg: '#EFF6FF',  label: { es: 'Comprador EU', en: 'EU Buyer', nl: 'EU Koper', de: 'EU Käufer' } },
  asesor:    { icon: '🎓', color: '#7C3AED', bg: '#F3E8FF',   label: { es: 'Asesor Pro', en: 'Advisor', nl: 'Adviseur', de: 'Berater' } },
  admin:     { icon: '👑', color: '#D97706', bg: '#FFFBEB',   label: { es: 'Admin', en: 'Admin', nl: 'Admin', de: 'Admin' } },
}

const LANG_FLAG: Record<string, string> = { es: '🇲🇽', en: '🇬🇧', nl: '🇳🇱', de: '🇩🇪' }
const LANG_NAME: Record<string, string> = { es: 'Español', en: 'English', nl: 'Nederlands', de: 'Deutsch' }

const EMOJIS = [
  '👍','❤️','🔥','🎉','😊','🤝','💪','✅','⭐','🌟',
  '🇲🇽','🇪🇺','🌍','🚀','💡','📦','📈','💰','🌱','🏆',
  '🌮','🌶️','☕','🍫','🥑','🍯','🥃','🫒','🌾','🍊',
  '🏭','🚢','✈️','📊','🤜','👏','🙌','💬','📝','🎯',
  '😎','👋','🎨','🌺','💎','🫐','🍺','🧀','🥝','🌿',
]

interface MediaItem { type: 'image' | 'video' | 'file'; url: string; name: string }

interface Post {
  id: string; user_email: string; user_name: string; user_role: string
  user_company?: string; user_avatar?: string
  body: string; body_lang: string; translations: Record<string, string>
  media: MediaItem[]; likes: string[]; created_at: string
  commentCount?: number
}

interface Comment {
  id: string; post_id: string; user_email: string; user_name: string
  user_role: string; user_avatar?: string; body: string; created_at: string
}

interface CurrentUser {
  email: string; name: string; role: string; company?: string
  avatar?: string; isAdmin?: boolean
}

interface Props { currentUser: CurrentUser | null; compact?: boolean }

/* ── Helpers ── */
function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'ahora'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

function getUserAvatar(email: string): string | null {
  try {
    const p = JSON.parse(localStorage.getItem(`gn_profile_${email}`) || '{}')
    return p.photo || p.logo || null
  } catch { return null }
}

const translateToAll = _translateToAll

function compressImage(file: File): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = ev => {
      const img = new Image()
      img.onload = () => {
        const MAX = 1000
        const scale = Math.min(1, MAX / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.75))
      }
      img.src = ev.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

async function uploadToStorage(file: File): Promise<string | null> {
  try {
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { data, error } = await supabase.storage.from('community').upload(path, file, { cacheControl: '3600', upsert: false })
    if (error || !data) return null
    return supabase.storage.from('community').getPublicUrl(data.path).data.publicUrl
  } catch { return null }
}

/* ── Rich text renderer ── */
function RichText({ text, onHashtag }: { text: string; onHashtag?: (tag: string) => void }) {
  const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(\#[\wÀ-žñÿ]+)|(https?:\/\/[^\s]+)/g
  const parts: React.ReactNode[] = []
  let last = 0; let i = 0; let m: RegExpExecArray | null
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(<span key={i++}>{text.slice(last, m.index)}</span>)
    if (m[1]) parts.push(<strong key={i++} style={{ fontWeight: 700 }}>{m[2]}</strong>)
    else if (m[3]) parts.push(<em key={i++}>{m[4]}</em>)
    else if (m[5]) parts.push(
      <span key={i++} onClick={() => onHashtag?.(m![5])} style={{ color: C.teal, fontWeight: 600, cursor: onHashtag ? 'pointer' : 'default' }}>{m[5]}</span>
    )
    else if (m[6]) parts.push(<a key={i++} href={m[6]} target="_blank" rel="noreferrer" style={{ color: C.teal, textDecoration: 'underline' }}>{m[6]}</a>)
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(<span key={i++}>{text.slice(last)}</span>)
  return <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{parts}</span>
}

/* ── Avatar 1:1 ── */
function Avatar({ src, name, color, bg, size = 44 }: { src?: string | null; name: string; color: string; bg: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.28), background: bg, flexShrink: 0, overflow: 'hidden', border: `1.5px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color, fontSize: size * 0.36 }}>
      {src
        ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        : (name || '?').slice(0, 2).toUpperCase()}
    </div>
  )
}

/* ── Emoji Picker ── */
function EmojiPicker({ onPick, onClose }: { onPick: (e: string) => void; onClose: () => void }) {
  return (
    <div style={{ position: 'absolute', bottom: '100%', left: 0, background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '10px', zIndex: 50, boxShadow: '0 8px 32px rgba(0,0,0,.12)', width: 260 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.muted }}>Emojis</span>
        <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: C.muted, fontSize: 14 }}>✕</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gap: 2 }}>
        {EMOJIS.map(e => (
          <button key={e} onClick={() => { onPick(e); onClose() }}
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '3px', borderRadius: 6, lineHeight: 1 }}
            onMouseEnter={el => (el.currentTarget.style.background = C.bg)}
            onMouseLeave={el => (el.currentTarget.style.background = 'none')}>{e}</button>
        ))}
      </div>
    </div>
  )
}

/* ── Comments Section ── */
function CommentsSection({ postId, currentUser }: { postId: string; currentUser: CurrentUser | null }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading]   = useState(true)
  const [input, setInput]       = useState('')
  const [sending, setSending]   = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('post_comments').select('*').eq('post_id', postId).order('created_at', { ascending: true })
      .then(({ data }) => { setComments((data || []) as Comment[]); setLoading(false) })
    const ch = supabase.channel(`comments-${postId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'post_comments', filter: `post_id=eq.${postId}` },
        p => setComments(prev => prev.find(c => c.id === p.new.id) ? prev : [...prev, p.new as Comment]))
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'post_comments', filter: `post_id=eq.${postId}` },
        p => setComments(prev => prev.filter(c => c.id !== p.old.id)))
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [postId])

  const send = async () => {
    if (!currentUser || !input.trim()) return
    setSending(true)
    await supabase.rpc('add_comment', {
      p_post_id: postId, p_user_email: currentUser.email,
      p_user_name: currentUser.name || currentUser.email,
      p_user_role: currentUser.isAdmin ? 'admin' : currentUser.role,
      p_user_avatar: currentUser.avatar || null, p_body: input.trim(),
    })
    setInput(''); setSending(false)
  }

  const doDelete = async (id: string) => {
    const email = currentUser?.isAdmin ? '' : (currentUser?.email || '')
    await supabase.rpc('delete_comment', { p_id: id, p_user_email: email })
    setDeleteId(null)
  }

  const meta = (role: string) => ROLE_META[role] || ROLE_META.productor

  return (
    <div style={{ borderTop: `1px solid ${C.border}`, background: '#FAFBFD', padding: '0.875rem 1rem' }}>
      {loading
        ? <div style={{ fontSize: 12, color: C.muted, textAlign: 'center', padding: '8px' }}>⏳</div>
        : comments.length === 0
          ? <div style={{ fontSize: 12, color: C.muted, fontStyle: 'italic', marginBottom: currentUser ? 10 : 0 }}>Sin comentarios aún.</div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
              {comments.map(c => {
                const m = meta(c.user_role)
                const isOwn = currentUser?.email === c.user_email
                const isAdmin = currentUser?.isAdmin
                const pendingDelete = deleteId === c.id
                return (
                  <div key={c.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <Avatar src={c.user_avatar} name={c.user_name} color={m.color} bg={m.bg} size={30} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '4px 12px 12px 12px', padding: '8px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{c.user_name}</span>
                          <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 100, background: m.bg, color: m.color }}>{m.icon}</span>
                          <span style={{ fontSize: 10, color: C.muted, marginLeft: 'auto' }}>{timeAgo(c.created_at)}</span>
                        </div>
                        <p style={{ fontSize: 13, color: C.text, margin: 0, lineHeight: 1.55 }}>{c.body}</p>
                      </div>
                      {(isOwn || isAdmin) && (
                        pendingDelete
                          ? <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center' }}>
                              <span style={{ fontSize: 11, color: C.red }}>¿Eliminar?</span>
                              <button onClick={() => doDelete(c.id)} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 5, border: 'none', background: C.red, color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Sí</button>
                              <button onClick={() => setDeleteId(null)} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 5, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, cursor: 'pointer' }}>No</button>
                            </div>
                          : <button onClick={() => setDeleteId(c.id)} style={{ fontSize: 10, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', marginTop: 2, padding: 0 }}>🗑️</button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
      }
      {currentUser && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Avatar src={currentUser.avatar} name={currentUser.name} color={ROLE_META[currentUser.role]?.color || C.teal} bg={ROLE_META[currentUser.role]?.bg || C.tealLight} size={30} />
          <div style={{ flex: 1, display: 'flex', gap: 6 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Escribe un comentario..."
              style={{ flex: 1, padding: '7px 12px', borderRadius: 20, border: `1.5px solid ${C.border}`, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: C.white, color: C.text }}
              onFocus={e => (e.target.style.borderColor = C.teal)}
              onBlur={e => (e.target.style.borderColor = C.border)} />
            <button onClick={send} disabled={sending || !input.trim()}
              style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: input.trim() ? C.teal : C.border, color: '#fff', cursor: input.trim() ? 'pointer' : 'default', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Post Card ── */
function PostCard({
  post, currentUser, lang, onDelete, onEdit, onHashtag,
}: {
  post: Post; currentUser: CurrentUser | null; lang: string
  onDelete: (id: string) => void
  onEdit: (id: string, body: string, translations: Record<string, string>) => void
  onHashtag: (tag: string) => void
}) {
  const [liked, setLiked]             = useState(false)
  const [likeCount, setLikeCount]     = useState(0)
  const [lightbox, setLightbox]       = useState<string | null>(null)
  const [editing, setEditing]         = useState(false)
  const [editBody, setEditBody]       = useState(post.body)
  const [saving, setSaving]           = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentCount, setCommentCount] = useState(post.commentCount || 0)
  const [deleteStep, setDeleteStep]   = useState(0) // 0=none 1=confirm
  const [showEmoji, setShowEmoji]     = useState(false)
  const [autoTr, setAutoTr]           = useState<string | null>(null)
  const [autoTrLoading, setAutoTrLoading] = useState(false)
  const textRef = useRef<HTMLTextAreaElement>(null)

  const meta    = ROLE_META[post.user_role] || ROLE_META.productor
  const isOwn   = currentUser?.email === post.user_email
  const isAdmin = currentUser?.isAdmin

  // Resolve translation: DB stored → sessionStorage cache → auto-translate
  const storedTr   = post.translations?.[lang]
  const hasStoredTr = storedTr && storedTr !== post.body
  const viewerText  = hasStoredTr ? storedTr : (autoTr || post.body)
  const originalText = post.body
  const viewerLang   = hasStoredTr || autoTr ? lang : (post.body_lang || 'es')
  const showBoth     = viewerLang !== (post.body_lang || 'es') && viewerText !== originalText

  // Auto-translate when no stored translation and langs differ
  useEffect(() => {
    const srcLang = post.body_lang || 'es'
    if (srcLang === lang || !post.body.trim()) return
    if (hasStoredTr) return
    const cached = getCachedTr(post.id, lang)
    if (cached) { setAutoTr(cached); return }
    setAutoTrLoading(true)
    translateText(post.body, srcLang, lang).then(result => {
      setAutoTr(result)
      setCachedTr(post.id, lang, result)
      setAutoTrLoading(false)
    })
  }, [post.id, lang, hasStoredTr, post.body, post.body_lang])

  useEffect(() => {
    const likes = Array.isArray(post.likes) ? post.likes : []
    setLikeCount(likes.length)
    setLiked(!!currentUser && likes.includes(currentUser.email))
  }, [post.likes, currentUser])

  useEffect(() => {
    // Listen for comment count changes
    const ch = supabase.channel(`count-${post.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'post_comments', filter: `post_id=eq.${post.id}` },
        () => setCommentCount(c => c + 1))
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'post_comments', filter: `post_id=eq.${post.id}` },
        () => setCommentCount(c => Math.max(0, c - 1)))
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [post.id])

  const handleLike = async () => {
    if (!currentUser) return
    const next = !liked
    setLiked(next); setLikeCount(c => next ? c + 1 : c - 1)
    await supabase.rpc('toggle_like', { p_post_id: post.id, p_user_email: currentUser.email })
  }

  const handleDelete = () => {
    if (deleteStep === 0) { setDeleteStep(1); return }
    onDelete(post.id)
    setDeleteStep(0)
  }

  const saveEdit = async () => {
    if (!currentUser || !editBody.trim()) return
    setSaving(true)
    const translations = await translateToAll(editBody.trim(), lang)
    await supabase.rpc('update_post', {
      p_id: post.id, p_user_email: currentUser.email,
      p_body: editBody.trim(), p_translations: translations, p_body_lang: lang,
    })
    onEdit(post.id, editBody.trim(), translations)
    setEditing(false); setSaving(false)
  }

  const insertEmoji = (e: string) => {
    if (!textRef.current) return
    const start = textRef.current.selectionStart
    const end   = textRef.current.selectionEnd
    const next  = editBody.slice(0, start) + e + editBody.slice(end)
    setEditBody(next)
    setTimeout(() => { textRef.current!.selectionStart = textRef.current!.selectionEnd = start + e.length }, 0)
  }

  const images = post.media.filter(m => m.type === 'image')
  const videos = post.media.filter(m => m.type === 'video')
  const files  = post.media.filter(m => m.type === 'file')

  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: '1rem', transition: 'box-shadow .2s' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,.07)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '1rem 1rem 0.75rem' }}>
        <Avatar src={post.user_avatar} name={post.user_name} color={meta.color} bg={meta.bg} size={46} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.navy, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {post.user_name}
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: meta.bg, color: meta.color }}>{meta.icon} {meta.label[lang] || meta.label.es}</span>
          </div>
          {post.user_company && <div style={{ fontSize: 11, color: C.muted }}>{post.user_company}</div>}
          <div style={{ fontSize: 11, color: C.muted }}>{timeAgo(post.created_at)}</div>
        </div>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0, alignItems: 'center' }}>
          {isOwn && !editing && (
            <button onClick={() => { setEditing(true); setEditBody(post.body) }} title="Editar"
              style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✏️</button>
          )}
          {(isOwn || isAdmin) && (
            deleteStep === 1
              ? <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: C.red, fontWeight: 600 }}>¿Eliminar?</span>
                  <button onClick={handleDelete} style={{ padding: '4px 10px', borderRadius: 7, border: 'none', background: C.red, color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Sí</button>
                  <button onClick={() => setDeleteStep(0)} style={{ padding: '4px 8px', borderRadius: 7, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, fontSize: 11, cursor: 'pointer' }}>No</button>
                </div>
              : <button onClick={handleDelete} title="Eliminar"
                  style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🗑️</button>
          )}
        </div>
      </div>

      {/* Body */}
      {editing ? (
        <div style={{ padding: '0 1rem 1rem', position: 'relative' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
            <button onClick={() => setEditBody(b => { const s = textRef.current?.selectionStart ?? b.length; const e = textRef.current?.selectionEnd ?? b.length; return b.slice(0, s) + `**${b.slice(s, e) || 'texto'}**` + b.slice(e) })}
              style={{ padding: '4px 10px', borderRadius: 7, border: `1px solid ${C.border}`, background: C.bg, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>B</button>
            <button onClick={() => setEditBody(b => { const s = textRef.current?.selectionStart ?? b.length; const e = textRef.current?.selectionEnd ?? b.length; return b.slice(0, s) + `*${b.slice(s, e) || 'texto'}*` + b.slice(e) })}
              style={{ padding: '4px 10px', borderRadius: 7, border: `1px solid ${C.border}`, background: C.bg, fontStyle: 'italic', fontSize: 13, cursor: 'pointer' }}>I</button>
            <button onClick={() => setShowEmoji(p => !p)}
              style={{ padding: '4px 10px', borderRadius: 7, border: `1px solid ${C.border}`, background: showEmoji ? C.tealLight : C.bg, fontSize: 13, cursor: 'pointer' }}>😊</button>
            <span style={{ fontSize: 11, color: C.muted, alignSelf: 'center' }}>**negrita** *cursiva* #hashtag</span>
          </div>
          {showEmoji && <EmojiPicker onPick={insertEmoji} onClose={() => setShowEmoji(false)} />}
          <textarea ref={textRef} value={editBody} onChange={e => setEditBody(e.target.value)} rows={4}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${C.teal}`, fontSize: 14, resize: 'none', fontFamily: 'inherit', color: C.text, background: C.bg, boxSizing: 'border-box', lineHeight: 1.6, outline: 'none' }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={saveEdit} disabled={saving}
              style={{ padding: '7px 18px', borderRadius: 8, border: 'none', background: C.teal, color: '#fff', fontWeight: 700, fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1 }}>
              {saving ? '🌐 Traduciendo y guardando...' : '✓ Guardar'}
            </button>
            <button onClick={() => setEditing(false)}
              style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, fontSize: 13, cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      ) : (
        <>
          {/* Main content — in viewer's language (translated or loading) */}
          <div style={{ padding: '0 1rem', paddingBottom: showBoth ? '0.5rem' : '0.875rem' }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              {LANG_FLAG[viewerLang]} <span style={{ fontWeight: 600 }}>{LANG_NAME[viewerLang]}</span>
              {autoTrLoading && <span style={{ marginLeft: 6, color: C.teal, fontSize: 10 }}>🌐 traduciendo...</span>}
            </div>
            <p style={{ fontSize: 14, color: C.text, margin: 0, lineHeight: 1.7, opacity: autoTrLoading ? 0.5 : 1 }}>
              <RichText text={viewerText} onHashtag={onHashtag} />
            </p>
          </div>
          {/* Original language block — shown when we have a real translation */}
          {showBoth && (
            <div style={{ padding: '0.75rem 1rem', margin: '0 1rem 0.875rem', borderRadius: 10, background: C.bg, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                {LANG_FLAG[post.body_lang || 'es']} <span style={{ fontWeight: 600 }}>{LANG_NAME[post.body_lang || 'es']}</span>
                <span style={{ marginLeft: 4, opacity: 0.7 }}>· Original</span>
              </div>
              <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.65, fontStyle: 'italic' }}>
                <RichText text={originalText} />
              </p>
            </div>
          )}
        </>
      )}

      {/* Images 1:1 */}
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: images.length === 1 ? '1fr' : images.length === 2 ? '1fr 1fr' : 'repeat(3,1fr)', gap: 2 }}>
          {images.map((img, i) => (
            <div key={i} style={{ position: 'relative', paddingTop: images.length === 1 ? '56.25%' : '100%', overflow: 'hidden' }}>
              <img src={img.url} alt="" onClick={() => setLightbox(img.url)}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in', display: 'block' }} />
            </div>
          ))}
        </div>
      )}

      {/* Videos */}
      {videos.map((v, i) => (
        <video key={i} src={v.url} controls style={{ width: '100%', maxHeight: 340, background: '#000', display: 'block' }} />
      ))}

      {/* Files */}
      {files.length > 0 && (
        <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {files.map((f, i) => (
            <a key={i} href={f.url} target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, textDecoration: 'none', color: C.navy }}>
              <span>📎</span>
              <span style={{ fontSize: 13, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
              <span style={{ fontSize: 11, color: C.teal, fontWeight: 700 }}>↓</span>
            </a>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: '0.625rem 1rem', borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={handleLike} disabled={!currentUser}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, border: `1px solid ${liked ? C.teal + '50' : C.border}`, background: liked ? C.tealLight : 'transparent', color: liked ? C.teal : C.muted, cursor: currentUser ? 'pointer' : 'default', fontWeight: 600, fontSize: 13, transition: 'all .15s' }}>
          {liked ? '❤️' : '🤍'} {likeCount > 0 ? likeCount : ''}
        </button>
        <button onClick={() => setShowComments(p => !p)}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, border: `1px solid ${showComments ? C.teal + '50' : C.border}`, background: showComments ? C.tealLight : 'transparent', color: showComments ? C.teal : C.muted, cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all .15s' }}>
          💬 {commentCount > 0 ? commentCount : ''}
        </button>
      </div>

      {/* Comments */}
      {showComments && <CommentsSection postId={post.id} currentUser={currentUser} />}

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.9)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', cursor: 'zoom-out' }}>
          <img src={lightbox} alt="" style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: 12, objectFit: 'contain' }} />
        </div>
      )}
    </div>
  )
}

/* ── Post Composer ── */
function PostComposer({ currentUser, lang, onPost }: { currentUser: CurrentUser; lang: string; onPost: (p: Post) => void }) {
  const [body, setBody]         = useState('')
  const [files, setFiles]       = useState<{ file: File; preview?: string; type: 'image' | 'video' | 'file' }[]>([])
  const [posting, setPosting]   = useState(false)
  const [translating, setTrans] = useState(false)
  const [error, setError]       = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const fileRef  = useRef<HTMLInputElement>(null)
  const textRef  = useRef<HTMLTextAreaElement>(null)
  const meta     = ROLE_META[currentUser.role] || ROLE_META.productor

  const insertEmoji = (e: string) => {
    if (!textRef.current) return
    const s = textRef.current.selectionStart; const end = textRef.current.selectionEnd
    setBody(b => b.slice(0, s) + e + b.slice(end))
    setTimeout(() => { textRef.current!.selectionStart = textRef.current!.selectionEnd = s + e.length }, 0)
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach(f => {
      const type: 'image' | 'video' | 'file' = f.type.startsWith('image/') ? 'image' : f.type.startsWith('video/') ? 'video' : 'file'
      if (type === 'image') {
        const reader = new FileReader()
        reader.onload = ev => setFiles(prev => [...prev, { file: f, preview: ev.target?.result as string, type }])
        reader.readAsDataURL(f)
      } else setFiles(prev => [...prev, { file: f, type }])
    })
    e.target.value = ''
  }

  const submit = async () => {
    if (!body.trim() && files.length === 0) return
    setPosting(true); setError('')
    let translations: Record<string, string> = {}
    if (body.trim()) { setTrans(true); translations = await translateToAll(body.trim(), lang); setTrans(false) }
    try {
      const media: MediaItem[] = []
      for (const f of files) {
        if (f.type === 'image') {
          media.push({ type: 'image', url: await compressImage(f.file), name: f.file.name })
        } else {
          const url = await uploadToStorage(f.file)
          if (url) media.push({ type: f.type, url, name: f.file.name })
          else { setError('Error subiendo archivo.'); setPosting(false); return }
        }
      }
      const { data, error: rpcError } = await supabase.rpc('create_post', {
        p_user_email: currentUser.email, p_user_name: currentUser.name || currentUser.email,
        p_user_role: currentUser.isAdmin ? 'admin' : currentUser.role,
        p_user_company: currentUser.company || null, p_body: body.trim(),
        p_media: media, p_user_avatar: currentUser.avatar || null,
      })
      if (rpcError) { setError(rpcError.message); setPosting(false); return }
      if (body.trim()) {
        await supabase.rpc('update_post', {
          p_id: data as string, p_user_email: currentUser.email,
          p_body: body.trim(), p_translations: translations, p_body_lang: lang,
        })
      }
      onPost({
        id: data as string, user_email: currentUser.email, user_name: currentUser.name || currentUser.email,
        user_role: currentUser.isAdmin ? 'admin' : currentUser.role, user_company: currentUser.company,
        user_avatar: currentUser.avatar, body: body.trim(), body_lang: lang,
        translations, media, likes: [], created_at: new Date().toISOString(),
      })
      setBody(''); setFiles([])
    } catch { setError('Error inesperado.') }
    setPosting(false)
  }

  const placeholder = lang === 'nl' ? 'Deel iets...' : lang === 'de' ? 'Teile etwas...' : lang === 'en' ? 'Share something...' : 'Comparte algo con la comunidad...'

  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: '1rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <Avatar src={currentUser.avatar} name={currentUser.name} color={meta.color} bg={meta.bg} size={42} />
        <div style={{ flex: 1, position: 'relative' }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
            {[['B', '**'],['I', '*']].map(([label, mk]) => (
              <button key={label} onClick={() => { const s = textRef.current?.selectionStart ?? body.length; const e2 = textRef.current?.selectionEnd ?? body.length; setBody(b => b.slice(0,s) + `${mk}${b.slice(s,e2)||'texto'}${mk}` + b.slice(e2)) }}
                style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${C.border}`, background: C.bg, fontSize: 12, fontWeight: label === 'B' ? 800 : 400, fontStyle: label === 'I' ? 'italic' : 'normal', cursor: 'pointer', color: C.text }}>
                {label}
              </button>
            ))}
            <button onClick={() => setShowEmoji(p => !p)}
              style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${showEmoji ? C.teal : C.border}`, background: showEmoji ? C.tealLight : C.bg, fontSize: 13, cursor: 'pointer' }}>😊</button>
            <span style={{ fontSize: 10, color: C.muted, alignSelf: 'center', marginLeft: 2 }}>#hashtag · **negrita** · *cursiva*</span>
          </div>
          {showEmoji && <EmojiPicker onPick={insertEmoji} onClose={() => setShowEmoji(false)} />}
          <textarea ref={textRef} value={body} onChange={e => setBody(e.target.value)} placeholder={placeholder} rows={3}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, resize: 'none', fontFamily: 'inherit', color: C.text, background: C.bg, lineHeight: 1.55, outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => (e.target.style.borderColor = C.teal)}
            onBlur={e => (e.target.style.borderColor = C.border)} />
        </div>
      </div>

      {files.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10, paddingLeft: 52 }}>
          {files.map((f, i) => (
            <div key={i} style={{ position: 'relative' }}>
              {f.type === 'image' && f.preview
                ? <img src={f.preview} alt="" style={{ width: 68, height: 68, objectFit: 'cover', borderRadius: 8, border: `1px solid ${C.border}` }} />
                : <div style={{ width: 68, height: 68, borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                    <span style={{ fontSize: '1.3rem' }}>{f.type === 'video' ? '🎥' : '📎'}</span>
                    <span style={{ fontSize: 9, color: C.muted, textAlign: 'center', padding: '0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 64 }}>{f.file.name}</span>
                  </div>
              }
              <button onClick={() => setFiles(p => p.filter((_,j) => j !== i))}
                style={{ position: 'absolute', top: -5, right: -5, width: 17, height: 17, borderRadius: '50%', border: 'none', background: C.red, color: '#fff', fontSize: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>✕</button>
            </div>
          ))}
        </div>
      )}

      {error && <div style={{ marginBottom: 8, fontSize: 12, color: C.red, background: '#FEE2E2', padding: '7px 12px', borderRadius: 7 }}>{error}</div>}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 52 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <input ref={fileRef} type="file" multiple accept="image/*,video/*,application/pdf,.doc,.docx,.xlsx,.pptx,.zip" onChange={handleFiles} style={{ display: 'none' }} />
          <button onClick={() => fileRef.current?.click()}
            style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>📎 Adjuntar</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {translating && <span style={{ fontSize: 11, color: C.teal }}>🌐 Traduciendo a 4 idiomas...</span>}
          <button onClick={submit} disabled={posting || (!body.trim() && files.length === 0)}
            style={{ padding: '8px 20px', borderRadius: 9, border: 'none', background: (body.trim() || files.length > 0) ? `linear-gradient(135deg, ${C.teal}, ${C.navy})` : C.border, color: '#fff', fontWeight: 700, fontSize: 13, cursor: posting ? 'not-allowed' : 'pointer', opacity: posting ? .7 : 1 }}>
            {posting ? '⏳' : lang === 'nl' ? 'Publiceren →' : lang === 'de' ? 'Veröffentlichen →' : lang === 'en' ? 'Post →' : 'Publicar →'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main Feed ── */
export default function CommunityFeed({ currentUser, compact }: Props) {
  const { lang } = useLang()
  const [posts, setPosts]       = useState<Post[]>([])
  const [pending, setPending]   = useState<Post[]>([])
  const [loading, setLoading]   = useState(true)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const feedRef = useRef<HTMLDivElement>(null)

  // Enrich currentUser with avatar from localStorage
  const enrichedUser = currentUser
    ? { ...currentUser, avatar: currentUser.avatar || getUserAvatar(currentUser.email) || undefined }
    : null

  const loadPosts = useCallback(async () => {
    const { data: postsData } = await supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(60)
    if (!postsData) { setLoading(false); return }
    // Comment counts
    const ids = postsData.map(p => p.id)
    const { data: cData } = await supabase.from('post_comments').select('post_id').in('post_id', ids)
    const countMap: Record<string, number> = {}
    cData?.forEach((c: { post_id: string }) => { countMap[c.post_id] = (countMap[c.post_id] || 0) + 1 })
    setPosts(postsData.map(p => ({ ...p, commentCount: countMap[p.id] || 0 })) as Post[])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadPosts()
    const ch = supabase.channel('community-global')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, payload => {
        const p = payload.new as Post
        const atTop = (feedRef.current?.scrollTop || 0) < 100
        if (atTop) setPosts(prev => [p, ...prev.filter(x => x.id !== p.id)])
        else setPending(prev => [p, ...prev.filter(x => x.id !== p.id)])
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'posts' },
        p => setPosts(prev => prev.map(x => x.id === p.new.id ? { ...x, ...p.new } : x)))
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'posts' }, p => {
        setPosts(prev => prev.filter(x => x.id !== p.old.id))
        setPending(prev => prev.filter(x => x.id !== p.old.id))
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [loadPosts])

  const showPending = () => {
    setPosts(prev => { const ids = new Set(prev.map(p => p.id)); return [...pending.filter(p => !ids.has(p.id)), ...prev] })
    setPending([])
    feedRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!enrichedUser) return
    const post = posts.find(p => p.id === id)
    const email = enrichedUser.isAdmin ? (post?.user_email || '') : enrichedUser.email
    await supabase.rpc('delete_post', { p_id: id, p_user_email: email })
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  const handleEdit = (id: string, body: string, translations: Record<string, string>) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, body, translations } : p))
  }

  const filteredPosts = activeTag
    ? posts.filter(p => {
        const text = [p.body, ...Object.values(p.translations || {})].join(' ')
        return text.toLowerCase().includes(activeTag.toLowerCase())
      })
    : posts

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: C.muted }}>
      <div style={{ fontSize: '2rem', marginBottom: 10 }}>⏳</div>
      <div style={{ fontSize: 13, fontWeight: 600 }}>Cargando comunidad...</div>
    </div>
  )

  return (
    <div style={{ maxWidth: compact ? '100%' : 680, margin: '0 auto' }}>
      {/* Hashtag filter bar */}
      {activeTag && (
        <div style={{ background: C.tealLight, border: `1px solid ${C.teal}40`, borderRadius: 10, padding: '8px 14px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ fontWeight: 700, color: C.teal }}>🔍 {activeTag}</span>
          <button onClick={() => setActiveTag(null)} style={{ border: 'none', background: 'none', color: C.teal, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>✕ Quitar filtro</button>
        </div>
      )}

      {enrichedUser && <PostComposer currentUser={enrichedUser} lang={lang} onPost={p => setPosts(prev => [p, ...prev])} />}

      {!enrichedUser && (
        <div style={{ background: `linear-gradient(135deg, ${C.navy}, #1a4a7a)`, borderRadius: 14, padding: '1.5rem', textAlign: 'center', color: '#fff', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🌐</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
            {lang === 'nl' ? 'Word lid van de Global Nexus gemeenschap' : lang === 'de' ? 'Tritt der Global Nexus Community bei' : lang === 'en' ? 'Join the Global Nexus community' : 'Únete a la comunidad Global Nexus'}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', marginBottom: '1rem' }}>
            {lang === 'en' ? 'Sign up to post, share and connect.' : lang === 'nl' ? 'Registreer om te publiceren.' : lang === 'de' ? 'Registrieren Sie sich, um zu posten.' : 'Regístrate para publicar y conectar.'}
          </div>
          <a href="/registro" style={{ padding: '9px 22px', borderRadius: 9, background: C.teal, color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none', display: 'inline-block' }}>
            {lang === 'nl' ? 'Gratis registreren →' : lang === 'de' ? 'Kostenlos registrieren →' : lang === 'en' ? 'Sign up free →' : 'Registrarse gratis →'}
          </a>
        </div>
      )}

      {pending.length > 0 && (
        <button onClick={showPending}
          style={{ width: '100%', marginBottom: '1rem', padding: '10px', borderRadius: 10, border: `1.5px solid ${C.teal}`, background: C.tealLight, color: C.teal, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          ↑ {pending.length} {pending.length === 1 ? 'nuevo post' : 'nuevos posts'} — Ver
        </button>
      )}

      <div ref={feedRef}>
        {filteredPosts.length === 0
          ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: C.muted }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 6 }}>
                {activeTag ? `Sin posts con ${activeTag}` : lang === 'en' ? 'Be the first to post' : lang === 'nl' ? 'Wees de eerste' : lang === 'de' ? 'Sei der Erste' : 'Sé el primero en publicar'}
              </div>
            </div>
          )
          : filteredPosts.map(post => (
            <PostCard key={post.id} post={post} currentUser={enrichedUser} lang={lang}
              onDelete={handleDelete} onEdit={handleEdit} onHashtag={tag => setActiveTag(tag)} />
          ))
        }
      </div>
    </div>
  )
}

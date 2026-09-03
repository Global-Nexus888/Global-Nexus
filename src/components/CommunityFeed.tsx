import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const C = {
  navy: '#1E3A5F', teal: '#0D9488', tealLight: '#CCFBF1',
  gold: '#D97706', green: '#16A34A', red: '#DC2626',
  purple: '#7C3AED', border: '#E2E8F0', bg: '#F8FAFC',
  white: '#FFFFFF', text: '#0F172A', muted: '#64748B',
}

const ROLE_META: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  productor: { icon: '🏭', color: '#0F766E', bg: C.tealLight,  label: 'Productor MX' },
  comprador: { icon: '🇪🇺', color: '#1E40AF', bg: '#EFF6FF',  label: 'Comprador EU' },
  asesor:    { icon: '🎓', color: '#7C3AED', bg: '#F3E8FF',   label: 'Asesor Pro' },
  admin:     { icon: '👑', color: '#D97706', bg: '#FFFBEB',   label: 'Admin' },
}

interface MediaItem {
  type: 'image' | 'video' | 'file'
  url: string
  name: string
}

interface Post {
  id: string
  user_email: string
  user_name: string
  user_role: string
  user_company?: string
  body: string
  media: MediaItem[]
  likes: string[]
  created_at: string
}

interface CurrentUser {
  email: string
  name: string
  role: string
  company?: string
  plan?: string
  isAdmin?: boolean
}

interface Props {
  currentUser: CurrentUser | null
  compact?: boolean
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'ahora'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

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

/* ── Post Card ── */
function PostCard({ post, currentUser, onDelete }: { post: Post; currentUser: CurrentUser | null; onDelete: (id: string) => void }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const meta = ROLE_META[post.user_role] || ROLE_META.productor
  const initials = post.user_name?.slice(0, 2).toUpperCase() || '??'
  const isOwn = currentUser?.email === post.user_email
  const isAdmin = currentUser?.isAdmin

  useEffect(() => {
    const likes = Array.isArray(post.likes) ? post.likes : []
    setLikeCount(likes.length)
    setLiked(!!currentUser && likes.includes(currentUser.email))
  }, [post.likes, currentUser])

  const handleLike = async () => {
    if (!currentUser) return
    const next = !liked
    setLiked(next)
    setLikeCount(c => next ? c + 1 : c - 1)
    await supabase.rpc('toggle_like', { p_post_id: post.id, p_user_email: currentUser.email })
  }

  const images = post.media.filter(m => m.type === 'image')
  const videos = post.media.filter(m => m.type === 'video')
  const files  = post.media.filter(m => m.type === 'file')

  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', marginBottom: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '1rem 1rem 0.75rem' }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0, fontWeight: 800, color: meta.color }}>
          {initials.length <= 2 ? initials : meta.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.navy, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {post.user_name}
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: meta.bg, color: meta.color }}>{meta.icon} {meta.label}</span>
          </div>
          {post.user_company && <div style={{ fontSize: 11, color: C.muted }}>{post.user_company}</div>}
          <div style={{ fontSize: 11, color: C.muted }}>{timeAgo(post.created_at)}</div>
        </div>
        {(isOwn || isAdmin) && (
          <button onClick={() => onDelete(post.id)} title="Eliminar"
            style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: '0.85rem', flexShrink: 0 }}>🗑️</button>
        )}
      </div>

      {/* Body */}
      {post.body && (
        <div style={{ padding: '0 1rem 0.875rem', fontSize: 14, color: C.text, lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{post.body}</div>
      )}

      {/* Images */}
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: images.length === 1 ? '1fr' : images.length === 2 ? '1fr 1fr' : 'repeat(3, 1fr)', gap: 2, marginBottom: files.length || videos.length ? 0 : 0 }}>
          {images.map((img, i) => (
            <img key={i} src={img.url} alt="" onClick={() => setLightbox(img.url)}
              style={{ width: '100%', aspectRatio: images.length === 1 ? '16/9' : '1', objectFit: 'cover', cursor: 'zoom-in', display: 'block' }} />
          ))}
        </div>
      )}

      {/* Videos */}
      {videos.map((v, i) => (
        <video key={i} src={v.url} controls style={{ width: '100%', maxHeight: 320, background: '#000', display: 'block' }} />
      ))}

      {/* Files */}
      {files.length > 0 && (
        <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {files.map((f, i) => (
            <a key={i} href={f.url} target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, textDecoration: 'none', color: C.navy }}>
              <span style={{ fontSize: '1.2rem' }}>📎</span>
              <span style={{ fontSize: 13, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
              <span style={{ fontSize: 11, color: C.teal, fontWeight: 700 }}>Descargar</span>
            </a>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: '0.625rem 1rem', borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={handleLike} disabled={!currentUser}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, border: `1px solid ${liked ? C.teal + '50' : C.border}`, background: liked ? C.tealLight : 'transparent', color: liked ? C.teal : C.muted, cursor: currentUser ? 'pointer' : 'default', fontWeight: 600, fontSize: 13, transition: 'all .15s' }}>
          {liked ? '❤️' : '🤍'} {likeCount}
        </button>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.88)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', cursor: 'zoom-out' }}>
          <img src={lightbox} alt="" style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: 12, objectFit: 'contain' }} />
        </div>
      )}
    </div>
  )
}

/* ── Post Composer ── */
function PostComposer({ currentUser, onPost }: { currentUser: CurrentUser; onPost: (post: Post) => void }) {
  const [body, setBody]       = useState('')
  const [files, setFiles]     = useState<{ file: File; preview?: string; type: 'image' | 'video' | 'file' }[]>([])
  const [posting, setPosting] = useState(false)
  const [error, setError]     = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const meta = ROLE_META[currentUser.role] || ROLE_META.productor

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    selected.forEach(f => {
      const type: 'image' | 'video' | 'file' = f.type.startsWith('image/') ? 'image' : f.type.startsWith('video/') ? 'video' : 'file'
      if (type === 'image') {
        const reader = new FileReader()
        reader.onload = ev => setFiles(prev => [...prev, { file: f, preview: ev.target?.result as string, type }])
        reader.readAsDataURL(f)
      } else {
        setFiles(prev => [...prev, { file: f, type }])
      }
    })
    e.target.value = ''
  }

  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i))

  const submit = async () => {
    if (!body.trim() && files.length === 0) return
    setPosting(true); setError('')
    try {
      const media: MediaItem[] = []
      for (const f of files) {
        if (f.type === 'image') {
          const compressed = await compressImage(f.file)
          media.push({ type: 'image', url: compressed, name: f.file.name })
        } else {
          const url = await uploadToStorage(f.file)
          if (url) media.push({ type: f.type, url, name: f.file.name })
          else { setError('Error subiendo archivo. Verifica el bucket "community" en Supabase Storage.'); setPosting(false); return }
        }
      }
      const { data, error: rpcError } = await supabase.rpc('create_post', {
        p_user_email:  currentUser.email,
        p_user_name:   currentUser.name || currentUser.email,
        p_user_role:   currentUser.isAdmin ? 'admin' : currentUser.role,
        p_user_company: currentUser.company || null,
        p_body:        body.trim(),
        p_media:       media,
      })
      if (rpcError) { setError(rpcError.message); setPosting(false); return }
      const newPost: Post = {
        id: data as string, user_email: currentUser.email,
        user_name: currentUser.name || currentUser.email,
        user_role: currentUser.isAdmin ? 'admin' : currentUser.role,
        user_company: currentUser.company,
        body: body.trim(), media, likes: [], created_at: new Date().toISOString(),
      }
      onPost(newPost)
      setBody(''); setFiles([])
    } catch (e) { setError('Error inesperado. Intenta de nuevo.') }
    setPosting(false)
  }

  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '1rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0, fontWeight: 800, color: meta.color }}>
          {(currentUser.name || '??').slice(0, 2).toUpperCase()}
        </div>
        <textarea value={body} onChange={e => setBody(e.target.value)}
          placeholder="Comparte algo con la comunidad..."
          rows={3}
          style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, resize: 'none', fontFamily: 'inherit', color: C.text, background: C.bg, lineHeight: 1.5, outline: 'none' }}
          onFocus={e => (e.target.style.borderColor = C.teal)}
          onBlur={e => (e.target.style.borderColor = C.border)} />
      </div>

      {/* File previews */}
      {files.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10, paddingLeft: 48 }}>
          {files.map((f, i) => (
            <div key={i} style={{ position: 'relative' }}>
              {f.type === 'image' && f.preview
                ? <img src={f.preview} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: `1px solid ${C.border}` }} />
                : <div style={{ width: 72, height: 72, borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <span style={{ fontSize: '1.5rem' }}>{f.type === 'video' ? '🎥' : '📎'}</span>
                    <span style={{ fontSize: 9, color: C.muted, textAlign: 'center', padding: '0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 68 }}>{f.file.name}</span>
                  </div>
              }
              <button onClick={() => removeFile(i)} style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', border: 'none', background: C.red, color: '#fff', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>✕</button>
            </div>
          ))}
        </div>
      )}

      {error && <div style={{ marginBottom: 8, fontSize: 12, color: C.red, background: '#FEE2E2', padding: '8px 12px', borderRadius: 7 }}>{error}</div>}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 48 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <input ref={fileRef} type="file" multiple accept="image/*,video/*,application/pdf,.doc,.docx,.xlsx,.pptx,.zip" onChange={handleFiles} style={{ display: 'none' }} />
          <button onClick={() => fileRef.current?.click()} title="Adjuntar foto, video o archivo"
            style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>📎 Adjuntar</button>
        </div>
        <button onClick={submit} disabled={posting || (!body.trim() && files.length === 0)}
          style={{ padding: '8px 20px', borderRadius: 9, border: 'none', background: (body.trim() || files.length > 0) ? `linear-gradient(135deg, ${C.teal}, ${C.navy})` : C.border, color: '#fff', fontWeight: 700, fontSize: 13, cursor: posting ? 'not-allowed' : 'pointer', opacity: posting ? .7 : 1 }}>
          {posting ? '⏳ Publicando...' : '→ Publicar'}
        </button>
      </div>
    </div>
  )
}

/* ── Main Feed ── */
export default function CommunityFeed({ currentUser, compact }: Props) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const loadPosts = useCallback(async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(50)
    if (data) setPosts(data as Post[])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadPosts()
    const channel = supabase.channel('community-posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, loadPosts)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [loadPosts])

  const handlePost = (post: Post) => setPosts(prev => [post, ...prev])

  const handleDelete = async (id: string) => {
    if (!currentUser) return
    const post = posts.find(p => p.id === id)
    const emailToUse = currentUser.isAdmin ? (post?.user_email || '') : currentUser.email
    await supabase.rpc('delete_post', { p_id: id, p_user_email: emailToUse })
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: C.muted }}>
      <div style={{ fontSize: '2rem', marginBottom: 10 }}>⏳</div>
      <div style={{ fontSize: 13, fontWeight: 600 }}>Cargando comunidad...</div>
    </div>
  )

  return (
    <div style={{ maxWidth: compact ? '100%' : 680, margin: '0 auto' }}>
      {currentUser && <PostComposer currentUser={currentUser} onPost={handlePost} />}
      {!currentUser && (
        <div style={{ background: `linear-gradient(135deg, ${C.navy}, #1a4a7a)`, borderRadius: 14, padding: '1.5rem', textAlign: 'center', color: '#fff', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🌐</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Únete a la comunidad Global Nexus</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', marginBottom: '1rem' }}>Regístrate para publicar, compartir y conectar con productores y compradores.</div>
          <a href="/registro" style={{ padding: '9px 22px', borderRadius: 9, background: C.teal, color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none', display: 'inline-block' }}>Registrarse gratis →</a>
        </div>
      )}
      {posts.length === 0
        ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: C.muted }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 6 }}>La comunidad está por comenzar</div>
            <div style={{ fontSize: 13 }}>Sé el primero en publicar algo.</div>
          </div>
        )
        : posts.map(post => (
          <PostCard key={post.id} post={post} currentUser={currentUser} onDelete={handleDelete} />
        ))
      }
    </div>
  )
}

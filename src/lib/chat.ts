import { supabase } from './supabase'

const ADMIN_EMAIL = 'brandmkrs.ads@gmail.com'
const ADMIN_NAME  = 'Global Nexus Admin'

export interface ChatMessage {
  id: string
  thread_id: string       // 'admin__user@email.com'
  from_email: string
  from_name: string
  to_email: string
  body: string
  sent_at: string
  read: boolean
}

export interface ChatThread {
  thread_id: string
  user_email: string
  user_name: string
  user_role?: string
  last_message?: ChatMessage
  unread_count: number
  messages: ChatMessage[]
}

function threadId(userEmail: string) {
  return `admin__${userEmail}`
}
function lsKey(threadId: string) {
  return `gn_chat_${threadId}`
}

/* ── Local helpers ── */
function lsGet(tid: string): ChatMessage[] {
  try { return JSON.parse(localStorage.getItem(lsKey(tid)) || '[]') } catch { return [] }
}
function lsSet(tid: string, msgs: ChatMessage[]) {
  try { localStorage.setItem(lsKey(tid), JSON.stringify(msgs)) } catch {}
}
function lsMerge(tid: string, incoming: ChatMessage[]) {
  const existing = lsGet(tid)
  const map = new Map(existing.map(m => [m.id, m]))
  incoming.forEach(m => map.set(m.id, m))
  const merged = Array.from(map.values()).sort((a, b) => a.sent_at.localeCompare(b.sent_at))
  lsSet(tid, merged)
  return merged
}

/* ── Load full thread ── */
export async function loadThread(userEmail: string): Promise<ChatMessage[]> {
  const tid = threadId(userEmail)
  try {
    const { data, error } = await supabase
      .from('mensajes_admin')
      .select('*')
      .eq('thread_id', tid)
      .order('sent_at', { ascending: true })
    if (!error && data) return lsMerge(tid, data as ChatMessage[])
  } catch {}
  return lsGet(tid).sort((a, b) => a.sent_at.localeCompare(b.sent_at))
}

/* ── Send a message (works from both admin and user) ── */
export async function sendChatMessage(
  fromEmail: string,
  fromName: string,
  toEmail: string,
  body: string,
): Promise<ChatMessage> {
  const isAdmin = fromEmail === ADMIN_EMAIL
  const userEmail = isAdmin ? toEmail : fromEmail
  const tid = threadId(userEmail)

  const msg: ChatMessage = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
    thread_id: tid,
    from_email: fromEmail,
    from_name: fromName,
    to_email: toEmail,
    body,
    sent_at: new Date().toISOString(),
    read: false,
  }

  // Optimistic local update
  const existing = lsGet(tid)
  lsSet(tid, [...existing, msg])

  // Persist to Supabase non-blocking
  supabase.from('mensajes_admin').insert([msg]).then(() => {}).catch(() => {})

  return msg
}

/* ── Count unread for a user (messages FROM admin TO user that are unread) ── */
export async function countUnread(userEmail: string): Promise<number> {
  const tid = threadId(userEmail)
  try {
    const { count } = await supabase
      .from('mensajes_admin')
      .select('*', { count: 'exact', head: true })
      .eq('thread_id', tid)
      .eq('to_email', userEmail)
      .eq('read', false)
    return count || 0
  } catch {
    const msgs = lsGet(tid)
    return msgs.filter(m => m.to_email === userEmail && !m.read).length
  }
}

/* ── Mark all messages TO a user as read ── */
export async function markThreadRead(userEmail: string): Promise<void> {
  const tid = threadId(userEmail)
  supabase.from('mensajes_admin')
    .update({ read: true })
    .eq('thread_id', tid)
    .eq('to_email', userEmail)
    .eq('read', false)
    .then(() => {}).catch(() => {})
  const msgs = lsGet(tid)
  lsSet(tid, msgs.map(m => m.to_email === userEmail ? { ...m, read: true } : m))
}

/* ── Mark admin-side unread (messages FROM user that admin hasn't read) ── */
export async function markThreadReadByAdmin(userEmail: string): Promise<void> {
  const tid = threadId(userEmail)
  supabase.from('mensajes_admin')
    .update({ read: true })
    .eq('thread_id', tid)
    .eq('to_email', ADMIN_EMAIL)
    .eq('read', false)
    .then(() => {}).catch(() => {})
  const msgs = lsGet(tid)
  lsSet(tid, msgs.map(m => m.to_email === ADMIN_EMAIL ? { ...m, read: true } : m))
}

/* ── Load all threads (for admin view) ── */
export async function loadAllThreads(userList: { email: string; name: string; role?: string }[]): Promise<ChatThread[]> {
  const threads: ChatThread[] = []
  for (const u of userList) {
    const msgs = await loadThread(u.email)
    const unread = msgs.filter(m => m.to_email === ADMIN_EMAIL && !m.read).length
    threads.push({
      thread_id: threadId(u.email),
      user_email: u.email,
      user_name: u.name,
      user_role: u.role,
      last_message: msgs[msgs.length - 1],
      unread_count: unread,
      messages: msgs,
    })
  }
  return threads.sort((a, b) => {
    const ta = a.last_message?.sent_at || ''
    const tb = b.last_message?.sent_at || ''
    return tb.localeCompare(ta)
  })
}

/* ── Realtime subscription for a thread ── */
export function subscribeThread(userEmail: string, onNew: (msg: ChatMessage) => void) {
  const tid = threadId(userEmail)
  const sub = supabase
    .channel(`chat_${tid}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'mensajes_admin',
      filter: `thread_id=eq.${tid}`,
    }, (payload) => {
      onNew(payload.new as ChatMessage)
    })
    .subscribe()
  return () => { supabase.removeChannel(sub) }
}

export { ADMIN_EMAIL, ADMIN_NAME, threadId }

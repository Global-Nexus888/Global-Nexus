import { supabase } from './supabase'

export interface AdminMessage {
  id: string
  from_email: string
  from_name: string
  to_email: string
  subject: string
  body: string
  sent_at: string
  read: boolean
  type: 'bienvenida' | 'seguimiento' | 'recordatorio' | 'custom'
}

const LS_KEY = (email: string) => `gn_admin_msgs_${email}`

/* Load messages for a specific user (checks Supabase first, falls back to localStorage) */
export async function loadAdminMessages(toEmail: string): Promise<AdminMessage[]> {
  try {
    const { data, error } = await supabase
      .from('mensajes_admin')
      .select('*')
      .eq('to_email', toEmail)
      .order('sent_at', { ascending: false })
    if (!error && data && data.length > 0) {
      localStorage.setItem(LS_KEY(toEmail), JSON.stringify(data))
      return data as AdminMessage[]
    }
  } catch { /* fallback */ }
  try {
    return JSON.parse(localStorage.getItem(LS_KEY(toEmail)) || '[]')
  } catch { return [] }
}

/* Count unread messages for a user */
export async function countUnreadAdminMessages(toEmail: string): Promise<number> {
  try {
    const { count } = await supabase
      .from('mensajes_admin')
      .select('*', { count: 'exact', head: true })
      .eq('to_email', toEmail)
      .eq('read', false)
    return count || 0
  } catch {
    try {
      const msgs: AdminMessage[] = JSON.parse(localStorage.getItem(LS_KEY(toEmail)) || '[]')
      return msgs.filter(m => !m.read).length
    } catch { return 0 }
  }
}

/* Mark a message as read */
export async function markAdminMessageRead(id: string, toEmail: string): Promise<void> {
  supabase.from('mensajes_admin').update({ read: true }).eq('id', id).then(() => {}).catch(() => {})
  try {
    const msgs: AdminMessage[] = JSON.parse(localStorage.getItem(LS_KEY(toEmail)) || '[]')
    const updated = msgs.map(m => m.id === id ? { ...m, read: true } : m)
    localStorage.setItem(LS_KEY(toEmail), JSON.stringify(updated))
  } catch { /* ignore */ }
}

/* Mark all messages as read for a user */
export async function markAllAdminMessagesRead(toEmail: string): Promise<void> {
  supabase.from('mensajes_admin').update({ read: true }).eq('to_email', toEmail).eq('read', false)
    .then(() => {}).catch(() => {})
  try {
    const msgs: AdminMessage[] = JSON.parse(localStorage.getItem(LS_KEY(toEmail)) || '[]')
    const updated = msgs.map(m => ({ ...m, read: true }))
    localStorage.setItem(LS_KEY(toEmail), JSON.stringify(updated))
  } catch { /* ignore */ }
}

/* Send a message from admin (saves to Supabase + localStorage cache for recipient) */
export async function sendAdminMessage(msg: Omit<AdminMessage, 'id' | 'read'>): Promise<AdminMessage> {
  const full: AdminMessage = { ...msg, id: Date.now().toString(), read: false }
  // Save to Supabase
  await supabase.from('mensajes_admin').insert([full]).then(() => {}).catch(() => {})
  // Cache locally for the recipient
  try {
    const existing: AdminMessage[] = JSON.parse(localStorage.getItem(LS_KEY(msg.to_email)) || '[]')
    localStorage.setItem(LS_KEY(msg.to_email), JSON.stringify([full, ...existing]))
  } catch { /* ignore */ }
  return full
}

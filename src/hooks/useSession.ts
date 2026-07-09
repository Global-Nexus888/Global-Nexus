const SESSION_MS = 3 * 60 * 60 * 1000 // 3 hours

export function setSessionExpiry() {
  localStorage.setItem('gn_session_expires', String(Date.now() + SESSION_MS))
}

export function isSessionValid(): boolean {
  const user = localStorage.getItem('gn_current_user')
  if (!user) return false
  const exp = localStorage.getItem('gn_session_expires')
  if (!exp) { setSessionExpiry(); return true } // legacy: set expiry now
  return Date.now() < Number(exp)
}

export function refreshSession() {
  if (localStorage.getItem('gn_current_user')) setSessionExpiry()
}

export function clearSession() {
  localStorage.removeItem('gn_current_user')
  localStorage.removeItem('gn_session_expires')
}

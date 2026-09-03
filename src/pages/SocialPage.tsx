import { useEffect, useState } from 'react'
import CommunityFeed from '../components/CommunityFeed'
import { useLang } from '../context/LangContext'

const C = { navy: '#1E3A5F', teal: '#0D9488', tealLight: '#CCFBF1', border: '#E2E8F0', bg: '#F8FAFC', white: '#FFFFFF', muted: '#64748B' }

function getCurrentUser() {
  try {
    const u = JSON.parse(localStorage.getItem('gn_current_user') || 'null')
    if (!u?.email) return null
    return { email: u.email, name: u.name || '', role: u.role || 'productor', company: u.company || '', isAdmin: false }
  } catch { return null }
}

export default function SocialPage() {
  const { lang } = useLang()
  const [currentUser, setCurrentUser] = useState(getCurrentUser)

  useEffect(() => { setCurrentUser(getCurrentUser()) }, [])

  const t = (es: string, en: string, nl: string, de: string) =>
    lang === 'nl' ? nl : lang === 'de' ? de : lang === 'en' ? en : es

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(1rem,4vw,2rem)' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.4rem,3vw,1.8rem)', fontWeight: 900, color: C.navy, marginBottom: 8 }}>
          🌐 {t('Comunidad', 'Community', 'Gemeenschap', 'Gemeinschaft')}
        </h1>
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65 }}>
          {t(
            'Conecta con productores mexicanos, compradores europeos y asesores de comercio internacional.',
            'Connect with Mexican producers, European buyers, and international trade advisors.',
            'Verbind met Mexicaanse producenten, Europese kopers en internationale handelsadviseurs.',
            'Verbinde dich mit mexikanischen Produzenten, europäischen Käufern und Handelsberatern.'
          )}
        </p>
      </div>

      {/* Feed */}
      <CommunityFeed currentUser={currentUser} />
    </div>
  )
}

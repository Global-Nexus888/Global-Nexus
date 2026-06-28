import { useLang } from '../context/LangContext'
import type { Lang } from '../context/LangContext'

const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: 'es', flag: '🇲🇽', label: 'ES' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'nl', flag: '🇳🇱', label: 'NL' },
  { code: 'de', flag: '🇩🇪', label: 'DE' },
]

export default function LangBar() {
  const { lang, setLang } = useLang()

  return (
    <div style={{
      background: '#0F172A',
      borderBottom: '1px solid rgba(255,255,255,.06)',
      padding: '5px 1.25rem',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 4,
    }}>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', marginRight: 6, letterSpacing: '.04em' }}>
        🌐 Idioma:
      </span>
      {LANGS.map(l => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 9px', borderRadius: 6,
            border: lang === l.code ? '1px solid rgba(13,148,136,.6)' : '1px solid rgba(255,255,255,.08)',
            background: lang === l.code ? 'rgba(13,148,136,.2)' : 'transparent',
            color: lang === l.code ? '#5EEAD4' : 'rgba(255,255,255,.45)',
            fontSize: 11, fontWeight: lang === l.code ? 700 : 500,
            cursor: 'pointer', transition: 'all .15s',
          }}
        >
          <span>{l.flag}</span>
          <span>{l.label}</span>
        </button>
      ))}
    </div>
  )
}

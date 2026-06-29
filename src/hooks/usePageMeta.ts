import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { pageMeta } from '../lib/i18n/meta'

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el) }
  el.setAttribute('content', content)
}

function setPropertyMeta(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el) }
  el.setAttribute('content', content)
}

function setHreflang(hreflang: string, href: string) {
  const existing = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`)
  if (existing) { existing.setAttribute('href', href); return }
  const el = document.createElement('link')
  el.setAttribute('rel', 'alternate')
  el.setAttribute('hreflang', hreflang)
  el.setAttribute('href', href)
  document.head.appendChild(el)
}

export function usePageMeta() {
  const { lang } = useLang()
  const { pathname } = useLocation()
  const base = 'https://nexusstrategy.online'

  useEffect(() => {
    const page = pageMeta[pathname]
    const meta = page?.[lang] ?? page?.['es']

    if (meta) {
      document.title = meta.title
      setMeta('description', meta.description)
      setMeta('keywords', meta.keywords)
      setPropertyMeta('og:title', meta.title)
      setPropertyMeta('og:description', meta.description)
      setPropertyMeta('og:url', `${base}${pathname}`)
      setPropertyMeta('og:type', 'website')
      setPropertyMeta('og:image', `${base}/og-image.png`)
      setMeta('twitter:card', 'summary_large_image')
      setMeta('twitter:title', meta.title)
      setMeta('twitter:description', meta.description)
    }

    // hreflang for all 4 languages (same URL, lang switcher handles content)
    const langs: [string, string][] = [
      ['es', base + pathname],
      ['en', base + pathname],
      ['nl', base + pathname],
      ['de', base + pathname],
      ['x-default', base + pathname],
    ]
    langs.forEach(([hl, href]) => setHreflang(hl, href))

    setMeta('language', lang)
    setPropertyMeta('og:locale', lang === 'en' ? 'en_US' : lang === 'nl' ? 'nl_NL' : lang === 'de' ? 'de_DE' : 'es_MX')
  }, [lang, pathname])
}

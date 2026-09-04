import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { pageMeta } from '../lib/i18n/meta'

const BASE = 'https://global-nexus.business'

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

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', 'canonical'); document.head.appendChild(el) }
  el.setAttribute('href', href)
}

function setJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.setAttribute('type', 'application/ld+json')
    el.setAttribute('id', id)
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

const SCHEMA_ORG_BASE = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Global Nexus',
  url: BASE,
  logo: `${BASE}/og-image.png`,
  description: 'B2B platform connecting verified Mexican producers with European importers under TLCUEM 0% tariffs.',
  foundingDate: '2026',
  areaServed: ['MX', 'NL', 'DE', 'BE', 'FR', 'ES', 'AT', 'CH', 'PL', 'IT'],
  knowsAbout: ['TLCUEM', 'Mexico-EU trade', 'Tequila export', 'Organic coffee export', 'Mexican artisan products'],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['Spanish', 'English', 'Dutch', 'German'],
  },
  sameAs: [
    'https://global-nexus.business',
  ],
}

const PAGE_SCHEMAS: Record<string, object> = {
  '/': {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Global Nexus',
    url: BASE,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE}/catalogo?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
  '/catalogo': {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Global Nexus — Mexican Export Product Catalog',
    description: 'Certified Mexican products for export to Europe: tequila, mezcal, organic coffee, crafts, cosmetics.',
    url: `${BASE}/catalogo`,
    inLanguage: ['es', 'en', 'nl', 'de'],
  },
  '/precios': {
    '@context': 'https://schema.org',
    '@type': 'PriceSpecification',
    name: 'Global Nexus Subscription Plans',
    url: `${BASE}/precios`,
    offers: [
      { '@type': 'Offer', name: 'Explorer', price: '0', priceCurrency: 'USD' },
      { '@type': 'Offer', name: 'Pro Exporter', price: '99', priceCurrency: 'USD', billingIncrement: 1 },
      { '@type': 'Offer', name: 'EU Buyer', price: '249', priceCurrency: 'USD', billingIncrement: 1 },
    ],
  },
  '/faq': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: 'Global Nexus — FAQ Mexico Europe Export',
    url: `${BASE}/faq`,
  },
}

export function usePageMeta() {
  const { lang } = useLang()
  const { pathname } = useLocation()

  useEffect(() => {
    const page = pageMeta[pathname]
    const meta = page?.[lang as 'es' | 'en' | 'nl' | 'de'] ?? page?.['es']
    const canonical = BASE + pathname

    if (meta) {
      document.title = meta.title

      // Core
      setMeta('description', meta.description)
      setMeta('keywords', meta.keywords)
      setMeta('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')
      setMeta('author', 'Global Nexus')
      setMeta('language', lang)
      setMeta('revisit-after', '7 days')

      // Geo targeting
      setMeta('geo.region', lang === 'nl' ? 'NL' : lang === 'de' ? 'DE' : lang === 'en' ? 'EU' : 'MX')
      setMeta('geo.placename', lang === 'nl' ? 'Netherlands' : lang === 'de' ? 'Germany' : lang === 'en' ? 'European Union' : 'México')
      setMeta('ICBM', lang === 'es' ? '23.6345, -102.5528' : '52.3676, 4.9041')

      // Open Graph
      setPropertyMeta('og:title', meta.title)
      setPropertyMeta('og:description', meta.description)
      setPropertyMeta('og:url', canonical)
      setPropertyMeta('og:type', 'website')
      setPropertyMeta('og:site_name', 'Global Nexus')
      setPropertyMeta('og:image', `${BASE}/og-image.png`)
      setPropertyMeta('og:image:width', '1200')
      setPropertyMeta('og:image:height', '630')
      setPropertyMeta('og:image:alt', 'Global Nexus — Mexico Europe B2B Platform')
      setPropertyMeta('og:locale', lang === 'en' ? 'en_US' : lang === 'nl' ? 'nl_NL' : lang === 'de' ? 'de_DE' : 'es_MX')
      setPropertyMeta('og:locale:alternate', lang !== 'es' ? 'es_MX' : 'en_US')

      // Twitter / X
      setMeta('twitter:card', 'summary_large_image')
      setMeta('twitter:title', meta.title)
      setMeta('twitter:description', meta.description)
      setMeta('twitter:image', `${BASE}/og-image.png`)
      setMeta('twitter:image:alt', 'Global Nexus — Mexico Europe B2B Platform')

      // Canonical
      setCanonical(canonical)
    }

    // hreflang — all 4 languages + x-default (es)
    const hreflangs: [string, string][] = [
      ['es', BASE + pathname],
      ['en', BASE + pathname],
      ['nl', BASE + pathname],
      ['de', BASE + pathname],
      ['x-default', BASE + pathname],
    ]
    hreflangs.forEach(([hl, href]) => setHreflang(hl, href))

    // Schema.org — org always present, page-specific on top
    setJsonLd('schema-org', SCHEMA_ORG_BASE)
    const pageSchema = PAGE_SCHEMAS[pathname]
    if (pageSchema) setJsonLd('schema-page', pageSchema)

  }, [lang, pathname])
}

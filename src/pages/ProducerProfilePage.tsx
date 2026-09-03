import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLang } from '../context/LangContext'
import { getTranslated } from '../lib/translate'

const C = {
  navy: '#1E3A5F', teal: '#0D9488', tealLight: '#CCFBF1',
  gold: '#D97706', green: '#16A34A', border: '#E2E8F0', bg: '#F8FAFC',
}

const CERT_LABELS: Record<string, string> = {
  'denominacion-origen': 'D.O.', 'organico': 'Orgánico', 'senasica': 'SENASICA',
  'nom': 'NOM', 'cofepris': 'COFEPRIS', 'kosher-halal': 'Kosher/Halal', 'iso22000': 'ISO 22000',
  'haccp': 'HACCP', 'brc': 'BRC',
}

interface ProfileData {
  id: string; email: string; name: string; company: string; state: string
  category: string; interest: string; created_at: string
  bio?: string; bio_translations?: Record<string,string>
  logo?: string; photo?: string; location?: string
  website?: string; whatsapp?: string
  photos?: string[]
  history?: string; history_translations?: Record<string,string>
  foundedYear?: string; employees?: string
  products?: {
    id: string; name: string; category: string; description: string; price: string; unit: string; photos?: string[]
    name_translations?: Record<string,string>; description_translations?: Record<string,string>
  }[]
  certifications?: string[]
}

export default function ProducerProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { lang } = useLang()
  const [data, setData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  const t = (es: string, en: string, nl: string, de: string) =>
    lang === 'nl' ? nl : lang === 'de' ? de : lang === 'en' ? en : es

  useEffect(() => {
    async function load() {
      try {
        // Find usuario by id or email
        const { data: u } = await supabase.from('usuarios').select('*')
          .or(`id.eq.${id},email.eq.${id}`).single()
        if (!u) { setLoading(false); return }

        const email = String(u.email)

        // Load perfil
        const { data: perfil } = await supabase.from('perfiles').select('*').eq('email', email).single()

        // Load historia
        const { data: hist } = await supabase.from('historia').select('*').eq('email', email).single()

        // Load products
        const { data: prods } = await supabase.from('productos').select('*').eq('user_email', email).order('created_at', { ascending: false })

        setData({
          ...u,
          ...(perfil || {}),
          photos: (hist as Record<string,unknown>)?.photos as string[] || perfil?.photos || [],
          history: (hist as Record<string,unknown>)?.history as string || perfil?.history || '',
          foundedYear: (hist as Record<string,unknown>)?.foundedYear as string || perfil?.foundedYear || '',
          employees: (hist as Record<string,unknown>)?.employees as string || perfil?.employees || '',
          products: (prods || []) as ProfileData['products'],
        })
      } catch { /* not found */ }
      setLoading(false)
    }
    if (id) load()
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: C.navy }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⏳</div>
        <div style={{ fontWeight: 600 }}>{t('Cargando perfil...', 'Loading profile...', 'Profiel laden...', 'Profil wird geladen...')}</div>
      </div>
    </div>
  )

  if (!data) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: C.navy }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏭</div>
        <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>{t('Perfil no encontrado', 'Profile not found', 'Profiel niet gevonden', 'Profil nicht gefunden')}</div>
        <Link to="/productores" style={{ color: C.teal, fontWeight: 600, fontSize: 14 }}>← {t('Ver todos los productores', 'See all producers', 'Alle producenten', 'Alle Produzenten')}</Link>
      </div>
    </div>
  )

  const displayName = data.company || data.name || ''
  const avatar = data.photo || data.logo
  const bioRaw = data.bio || data.interest || data.category || ''
  const bio = getTranslated(data.bio_translations, bioRaw, lang)
  const historyRaw = data.history || ''
  const history = getTranslated(data.history_translations, historyRaw, lang)
  const location = data.location || data.state || 'México'
  const photos = (data.photos || []).filter(Boolean)
  const products = data.products || []
  const certs: string[] = data.certifications || []

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(1rem,4vw,2rem)' }}>

      {/* Back */}
      <Link to="/productores" style={{ fontSize: 13, color: C.teal, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: '1.5rem' }}>
        ← {t('Productores', 'Producers', 'Producenten', 'Produzenten')}
      </Link>

      {/* Header card */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 'clamp(1.25rem,3vw,2rem)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{ width: 80, height: 80, borderRadius: 16, background: C.tealLight, border: `2px solid ${C.teal}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', flexShrink: 0, overflow: 'hidden' }}>
            {avatar ? <img src={avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🏭'}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
              <h1 style={{ fontSize: 'clamp(1.1rem,3vw,1.5rem)', fontWeight: 800, color: C.navy, margin: 0 }}>{displayName}</h1>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: C.tealLight, color: C.teal }}>🏭 {t('Productor MX', 'MX Producer', 'MX Producent', 'MX Produzent')}</span>
            </div>
            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 8 }}>
              📍 {location}
              {data.category && <> &nbsp;·&nbsp; {data.category}</>}
              {data.foundedYear && <> &nbsp;·&nbsp; {t('Fundada', 'Founded', 'Opgericht', 'Gegründet')} {data.foundedYear}</>}
              {data.employees && <> &nbsp;·&nbsp; {data.employees} {t('empleados', 'employees', 'medewerkers', 'Mitarbeiter')}</>}
            </div>
            {bio && <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.65, margin: 0 }}>{bio}</p>}
          </div>
        </div>

        {/* Certs row */}
        {certs.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${C.border}` }}>
            {certs.map(c => (
              <span key={c} style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100, background: '#EFF6FF', color: '#1E40AF' }}>✓ {CERT_LABELS[c] || c}</span>
            ))}
          </div>
        )}

        {/* Website only — NO email, NO phone */}
        {data.website && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${C.border}` }}>
            <a href={data.website.startsWith('http') ? data.website : `https://${data.website}`} target="_blank" rel="noreferrer"
              style={{ fontSize: 13, color: C.teal, fontWeight: 600, textDecoration: 'none' }}>🌐 {data.website}</a>
          </div>
        )}
      </div>

      {/* Historia / Fotos */}
      {(data.history || photos.length > 0) && (
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 'clamp(1.25rem,3vw,1.75rem)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: C.navy, marginBottom: '1rem' }}>
            📖 {t('Historia de la empresa', 'Company story', 'Bedrijfsverhaal', 'Unternehmensgeschichte')}
          </h2>
          {history && <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.7, marginBottom: photos.length > 0 ? '1.25rem' : 0 }}>{history}</p>}
          {photos.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
              {photos.slice(0, 9).map((src, i) => (
                <img key={i} src={src} alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 10, border: `1px solid ${C.border}` }} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Productos */}
      {products.length > 0 && (
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 'clamp(1.25rem,3vw,1.75rem)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: C.navy, marginBottom: '1rem' }}>
            📦 {t('Catálogo de productos', 'Product catalog', 'Productcatalogus', 'Produktkatalog')} ({products.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {products.map(p => (
              <div key={p.id} style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                {p.photos?.[0] && <img src={p.photos[0]} alt="" style={{ width: '100%', height: 140, objectFit: 'cover' }} />}
                {!p.photos?.[0] && <div style={{ height: 80, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>📦</div>}
                <div style={{ padding: '0.75rem' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: 4 }}>{getTranslated(p.name_translations, p.name, lang)}</div>
                  {p.description && <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5, marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{getTranslated(p.description_translations, p.description, lang)}</div>}
                  {p.price && <div style={{ fontSize: 13, fontWeight: 700, color: C.teal }}>${p.price} <span style={{ fontWeight: 400, color: '#94A3B8', fontSize: 11 }}>/ {p.unit}</span></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA — contact through platform only */}
      <div style={{ background: `linear-gradient(135deg, ${C.navy}, #1a4a7a)`, borderRadius: 16, padding: 'clamp(1.25rem,3vw,2rem)', textAlign: 'center', color: '#fff' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: 10 }}>🤝</div>
        <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 8 }}>
          {t(`¿Interesado en ${displayName}?`, `Interested in ${displayName}?`, `Geïnteresseerd in ${displayName}?`, `Interesse an ${displayName}?`)}
        </h3>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', marginBottom: '1.25rem', maxWidth: 420, margin: '0 auto 1.25rem', lineHeight: 1.6 }}>
          {t('Regístrate como comprador europeo para contactar directamente a este productor a través de la plataforma.',
            'Sign up as a European buyer to contact this producer directly through the platform.',
            'Registreer als Europese koper om direct contact op te nemen met deze producent via het platform.',
            'Registrieren Sie sich als europäischer Käufer, um diesen Produzenten direkt über die Plattform zu kontaktieren.')}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/registro" style={{ padding: '11px 24px', borderRadius: 10, background: C.teal, color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
            {t('Registrarse gratis →', 'Sign up free →', 'Gratis registreren →', 'Kostenlos registrieren →')}
          </Link>
          <Link to="/productores" style={{ padding: '11px 24px', borderRadius: 10, background: 'rgba(255,255,255,.12)', color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none', border: '1px solid rgba(255,255,255,.2)' }}>
            {t('Ver más productores', 'See more producers', 'Meer producenten', 'Mehr Produzenten')}
          </Link>
        </div>
      </div>

      {/* Member since */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 12, color: '#94A3B8' }}>
        {t('Miembro de Global Nexus desde', 'Global Nexus member since', 'Global Nexus lid sinds', 'Global Nexus Mitglied seit')} {new Date(data.created_at).toLocaleDateString(lang === 'es' ? 'es-MX' : lang === 'nl' ? 'nl-NL' : lang === 'de' ? 'de-DE' : 'en-US', { month: 'long', year: 'numeric' })}
      </div>
    </div>
  )
}

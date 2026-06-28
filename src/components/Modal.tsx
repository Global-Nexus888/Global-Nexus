import { useEffect } from 'react'
import type { Lang } from '../types'

interface ModalProps {
  type: 'preventa' | 'demo' | null
  lang: Lang
  onClose: () => void
}

const CONTENT: Record<'preventa' | 'demo', Record<Lang, { title: string; sub: string; form: { name: string; email: string; phone: string; company: string; btn: string } }>> = {
  preventa: {
    es: { title: '🚀 Activar Preventa', sub: 'Accede a precio especial de lanzamiento. Solo 20 lugares disponibles.', form: { name: 'Nombre completo', email: 'Email empresarial', phone: 'WhatsApp / Teléfono', company: 'Empresa', btn: 'Activar mi preventa' } },
    en: { title: '🚀 Activate Pre-sale', sub: 'Access special launch pricing. Only 20 spots available.', form: { name: 'Full name', email: 'Business email', phone: 'WhatsApp / Phone', company: 'Company', btn: 'Activate my pre-sale' } },
    nl: { title: '🚀 Pre-sale activeren', sub: 'Toegang tot speciale lanceringsprijs. Slechts 20 plaatsen beschikbaar.', form: { name: 'Volledige naam', email: 'Zakelijk e-mailadres', phone: 'WhatsApp / Telefoon', company: 'Bedrijf', btn: 'Mijn pre-sale activeren' } },
    pt: { title: '🚀 Ativar Pré-venda', sub: 'Acesse preço especial de lançamento. Apenas 20 vagas disponíveis.', form: { name: 'Nome completo', email: 'Email empresarial', phone: 'WhatsApp / Telefone', company: 'Empresa', btn: 'Ativar minha pré-venda' } },
  },
  demo: {
    es: { title: '📅 Agendar Demo Gratuita', sub: 'Sesión de 30 minutos para mostrarme exactamente cómo funciona.', form: { name: 'Nombre completo', email: 'Email', phone: 'WhatsApp', company: 'Empresa / Sector', btn: 'Agendar mi demo' } },
    en: { title: '📅 Schedule Free Demo', sub: '30-minute session to show you exactly how it works.', form: { name: 'Full name', email: 'Email', phone: 'WhatsApp', company: 'Company / Sector', btn: 'Schedule my demo' } },
    nl: { title: '📅 Gratis demo plannen', sub: '30 minuten sessie om u precies te laten zien hoe het werkt.', form: { name: 'Volledige naam', email: 'E-mail', phone: 'WhatsApp', company: 'Bedrijf / Sector', btn: 'Mijn demo plannen' } },
    pt: { title: '📅 Agendar Demo Gratuita', sub: 'Sessão de 30 minutos para mostrar exatamente como funciona.', form: { name: 'Nome completo', email: 'Email', phone: 'WhatsApp', company: 'Empresa / Setor', btn: 'Agendar minha demo' } },
  },
}

export default function Modal({ type, lang, onClose }: ModalProps) {
  useEffect(() => {
    if (type) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [type])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!type) return null
  const c = CONTENT[type][lang]

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '.65rem .9rem',
    background: 'var(--void)', border: '1px solid var(--border)',
    borderRadius: 8, color: 'var(--white)', fontSize: '.88rem',
    outline: 'none', transition: 'border-color .2s',
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 440,
          position: 'relative', borderTop: '2px solid var(--gold)',
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '1.2rem', cursor: 'pointer', lineHeight: 1 }}
        >×</button>

        <h3 className="font-playfair" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '.5rem' }}>{c.title}</h3>
        <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>{c.sub}</p>

        <form
          onSubmit={e => { e.preventDefault(); onClose() }}
          style={{ display: 'grid', gap: '.85rem' }}
        >
          {[c.form.name, c.form.email, c.form.phone, c.form.company].map((placeholder, i) => (
            <input
              key={i}
              type={i === 1 ? 'email' : i === 2 ? 'tel' : 'text'}
              placeholder={placeholder}
              required={i < 2}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
          ))}
          <button
            type="submit"
            className="gold-gradient"
            style={{
              padding: '.8rem', borderRadius: 8, border: 'none',
              fontWeight: 700, fontSize: '.9rem', cursor: 'pointer',
              color: '#0A0A0F', letterSpacing: '.04em', marginTop: '.25rem',
            }}
          >{c.form.btn}</button>
        </form>
      </div>
    </div>
  )
}

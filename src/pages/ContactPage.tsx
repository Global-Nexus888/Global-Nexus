import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true) }, 1000)
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)', fontSize: '14px', fontFamily: 'inherit',
    background: 'var(--white)', boxSizing: 'border-box' as const,
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 800, marginBottom: '0.75rem' }}>Contacto</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, maxWidth: 520, margin: '0 auto' }}>
          ¿Tienes preguntas sobre la plataforma, tu suscripción o necesitas soporte? Estamos aquí.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '2.5rem', alignItems: 'flex-start' }} className="contact-grid">

        {/* Info cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { icon: '📧', title: 'Email general', value: 'brandmkrs.ads@gmail.com', sub: 'Respuesta en menos de 24h' },
            { icon: '🛡️', title: 'Soporte técnico', value: 'brandmkrs.ads@gmail.com', sub: 'Lunes–Viernes 9:00–18:00 CDMX' },
            { icon: '💳', title: 'Facturación y pagos', value: 'brandmkrs.ads@gmail.com', sub: 'Para cambios de plan o reembolsos' },
            { icon: '🏛️', title: 'Legal / RGPD', value: 'brandmkrs.ads@gmail.com', sub: 'Privacidad y términos' },
          ].map(c => (
            <div key={c.title} className="card" style={{ padding: '1.25rem', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{c.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 600 }}>{c.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{c.sub}</div>
              </div>
            </div>
          ))}

          <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E3A5F)', borderRadius: 'var(--radius)', padding: '1.5rem', color: '#fff' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🌍</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Horario de atención</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', lineHeight: 1.8 }}>
              🇲🇽 México (CDMX): Lun–Vie 9:00–18:00<br />
              🇪🇺 Europa (CET): Lun–Vie 16:00–01:00<br />
              🌐 Email: 24/7 respuesta en 24h
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card" style={{ padding: '2rem' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.75rem' }}>¡Mensaje enviado!</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7 }}>
                Gracias por contactarnos. Te responderemos en menos de 24 horas a <strong>{form.email}</strong>.
              </p>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                className="btn btn-ghost" style={{ marginTop: '1.5rem', fontSize: 13 }}>
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <>
              <h2 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Envíanos un mensaje</h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Nombre completo</label>
                    <input value={form.name} onChange={set('name')} required placeholder="Juan García" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Email</label>
                    <input value={form.email} onChange={set('email')} type="email" required placeholder="tu@empresa.com" style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Asunto</label>
                  <select value={form.subject} onChange={set('subject')} required style={inputStyle}>
                    <option value="">Selecciona un asunto...</option>
                    <option>Información sobre planes y precios</option>
                    <option>Soporte técnico</option>
                    <option>Verificación de cuenta</option>
                    <option>Facturación y pagos</option>
                    <option>Pregunta sobre TLCUEM</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Mensaje</label>
                  <textarea value={form.message} onChange={set('message')} required rows={5} placeholder="Describe tu consulta en detalle..."
                    style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: 15 }}>
                  {loading ? '⏳ Enviando...' : '📧 Enviar mensaje'}
                </button>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
                  Al enviar, acepta nuestra <a href="/privacidad" style={{ color: 'var(--teal)' }}>Política de Privacidad</a>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

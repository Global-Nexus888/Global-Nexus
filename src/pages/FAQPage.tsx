import { useState } from 'react'

const FAQS = [
  {
    cat: '🌐 Plataforma',
    items: [
      { q: '¿Qué es Global Nexus?', a: 'Global Nexus es una plataforma B2B especializada que conecta productores mexicanos certificados con compradores de la Unión Europea, aprovechando el Tratado de Libre Comercio México–UE (TLCUEM), que permite exportar con 0% de aranceles.' },
      { q: '¿Necesito experiencia en exportación para registrarme?', a: 'No. La plataforma está diseñada para acompañarte en todo el proceso. Contamos con guías, documentación TLCUEM y soporte especializado para productores que exportan por primera vez.' },
      { q: '¿En qué idiomas está disponible la plataforma?', a: 'Global Nexus está disponible en Español (🇲🇽), English (🇬🇧), Nederlands (🇳🇱) y Deutsch (🇩🇪). La mensajería entre usuarios incluye traducción automática en tiempo real.' },
    ],
  },
  {
    cat: '💳 Planes y pagos',
    items: [
      { q: '¿Cuánto cuesta registrarse?', a: 'El registro básico (plan Explorador) es completamente gratuito. Los planes de pago (Pro Exportador $59 USD/mes y Comprador EU $149 USD/mes) ofrecen funciones avanzadas como mensajería ilimitada, productos destacados y acceso prioritario a compradores verificados.' },
      { q: '¿Hay comisiones por transacción?', a: 'No. Global Nexus cobra únicamente por suscripción mensual. No cobramos comisión sobre las ventas o transacciones que realices a través de conexiones establecidas en la plataforma.' },
      { q: '¿Puedo cancelar mi suscripción en cualquier momento?', a: 'Sí. Puedes cancelar desde tu panel de configuración en cualquier momento. Seguirás teniendo acceso hasta el final del período pagado. Ofrecemos reembolso completo en los primeros 7 días si no has utilizado el servicio.' },
      { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos todas las tarjetas de crédito y débito principales (Visa, Mastercard, Amex) a través de Stripe, que garantiza el máximo nivel de seguridad PCI DSS.' },
    ],
  },
  {
    cat: '🛡️ Verificación',
    items: [
      { q: '¿Qué documentos necesito para verificarme como productor?', a: 'Para productores: RFC/Constancia SAT, Acta Constitutiva o Poder Notarial, Certificaciones relevantes (DO, NOM, orgánico, etc.) y comprobante de domicilio fiscal. El proceso toma 24-48 horas hábiles.' },
      { q: '¿Qué documentos piden a los compradores europeos?', a: 'Para compradores EU: Registro mercantil/Chamber of Commerce, Número VAT/IVA europeo y carta de presentación de la empresa. La verificación toma 24-48 horas hábiles.' },
      { q: '¿Es obligatoria la verificación?', a: 'No es obligatoria para explorar la plataforma, pero sí para acceder a mensajería, precios detallados y conectar con contrapartes. La verificación genera confianza y aumenta significativamente las posibilidades de cerrar negocios.' },
    ],
  },
  {
    cat: '📦 TLCUEM y exportación',
    items: [
      { q: '¿Qué es el TLCUEM?', a: 'El Tratado de Libre Comercio entre México y la Unión Europea (TLCUEM, en vigor desde 2000 con actualización en 2023) elimina o reduce aranceles en la mayoría de productos exportados entre México y los 27 países de la UE. Para productos calificados, el arancel es 0%.' },
      { q: '¿Cómo sé si mi producto califica para 0% de arancel?', a: 'Dependiendo del producto y su clasificación arancelaria (HS Code), puede calificar para 0% de arancel bajo TLCUEM. En la plataforma encontrarás una guía de clasificación y puedes consultar con nuestro equipo especializado.' },
      { q: '¿Global Nexus gestiona la logística?', a: 'La plataforma facilita la conexión comercial y orienta sobre documentación TLCUEM. La logística la coordinas directamente con tu comprador o con los socios logísticos recomendados en la plataforma (embarques desde Puerto Veracruz).' },
    ],
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', textAlign: 'left', padding: '1.1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', lineHeight: 1.5 }}>{q}</span>
        <span style={{ fontSize: 18, color: 'var(--teal)', flexShrink: 0, transition: 'transform .2s', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      {open && (
        <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, paddingBottom: '1.1rem' }}>
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 800, marginBottom: '0.75rem' }}>Preguntas frecuentes</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>
          Todo lo que necesitas saber sobre Global Nexus, el TLCUEM y cómo conectar con tu primer socio comercial.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {FAQS.map(section => (
          <div key={section.cat} className="card" style={{ padding: '1.5rem 1.75rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>{section.cat}</h2>
            {section.items.map(item => <FAQItem key={item.q} {...item} />)}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>💬</div>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>¿No encontraste tu respuesta?</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: '1rem' }}>Nuestro equipo responde en menos de 24 horas.</p>
        <a href="/contacto" className="btn btn-primary" style={{ fontSize: 14, padding: '10px 24px' }}>Contactar soporte →</a>
      </div>
    </div>
  )
}

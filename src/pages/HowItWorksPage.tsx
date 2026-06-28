import { Link } from 'react-router-dom'

const STEPS_PRODUCER = [
  { icon: '📝', title: 'Crea tu perfil de productor', desc: 'Registro gratuito. Sube tus certificaciones, fotos de producto y capacidad productiva. Proceso 100% en línea.' },
  { icon: '✅', title: 'Verificación de documentos por IA', desc: 'Nuestro sistema valida automáticamente tus certificados (NOM, SENASICA, COFEPRIS, D.O.) en menos de 24 horas.' },
  { icon: '🛒', title: 'Publica tu catálogo', desc: 'Sube tus productos con precio, MOQ, fotos y disponibilidad. Apareces en búsquedas de 450M consumidores europeos.' },
  { icon: '💬', title: 'Recibe órdenes y conecta', desc: 'Los compradores te contactan directamente. Mensajería bilingüe integrada. Sin intermediarios.' },
  { icon: '🚢', title: 'Nosotros gestionamos la logística', desc: 'Coordinamos el envío desde Puerto Veracruz, la documentación TLCUEM y la entrega en destino europeo.' },
]

const STEPS_BUYER = [
  { icon: '🔐', title: 'Regístrate como comprador EU', desc: 'Perfil gratuito. Indica tu país, sector y qué tipo de productos buscas de México.' },
  { icon: '🔍', title: 'Explora el catálogo verificado', desc: 'Filtra por categoría, certificación, estado mexicano y precio. Solo productos con capacidad de exportación real.' },
  { icon: '📊', title: 'Compara y solicita muestras', desc: 'Solicita muestras directamente al productor antes de hacer un pedido de volumen. Sin riesgo.' },
  { icon: '📄', title: 'Documentación gestionada', desc: 'Todos los trámites de exportación-importación, aranceles cero TLCUEM y permisos fitosanitarios los gestionamos nosotros.' },
  { icon: '📦', title: 'Recibe en tu país europeo', desc: 'Entrega en tu almacén en cualquiera de los 27 países de la UE. Tracking en tiempo real.' },
]

const TLCUEM_FACTS = [
  { icon: '🏛️', title: 'Qué es el TLCUEM', desc: 'El Tratado de Libre Comercio México-Unión Europea elimina aranceles en la mayoría de productos agrícolas, industriales y artesanales mexicanos al entrar a Europa.' },
  { icon: '0%', title: 'Arancel cero', desc: 'La mayoría de categorías aplica arancel del 0%. Esto significa que un café chiapaneco que llegaría a 25% de impuesto en Alemania, con TLCUEM entra sin costo.' },
  { icon: '27', title: '27 países destino', desc: 'Una sola exportación desde México puede distribuirse a cualquiera de los 27 países miembros de la Unión Europea sin tramitación adicional.' },
  { icon: '🌾', title: 'Productos elegibles', desc: 'Alimentos, bebidas, artesanías, cosméticos, farmacéuticos, textiles y más. Global Nexus verifica que tu producto cumpla los requisitos de origen.' },
]

export default function HowItWorksPage() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '.5rem' }}>¿Cómo funciona Global Nexus?</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '3rem', maxWidth: 600 }}>
        Conectamos productores mexicanos certificados con compradores europeos de forma directa, segura y sin aranceles.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        {/* For producers */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(135deg, #0D9488, #0F766E)', padding: '1.25rem 1.5rem', color: '#fff' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>🏭</div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Para productores mexicanos</h2>
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {STEPS_PRODUCER.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: 3 }}>{s.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
            <Link to="/registro" className="btn btn-primary" style={{ marginTop: '.5rem' }}>Registrar mi empresa</Link>
          </div>
        </div>

        {/* For buyers */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(135deg, #1E3A5F, #1e40af)', padding: '1.25rem 1.5rem', color: '#fff' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>🇪🇺</div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Para compradores europeos</h2>
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {STEPS_BUYER.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--navy-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: 3 }}>{s.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
            <Link to="/catalogo" className="btn btn-outline" style={{ marginTop: '.5rem' }}>Explorar catálogo</Link>
          </div>
        </div>
      </div>

      {/* TLCUEM Section */}
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '.5rem' }}>El TLCUEM: tu ventaja competitiva</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '1.5rem' }}>El acuerdo de libre comercio entre México y la Unión Europea que abre 450 millones de consumidores a precio cero.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {TLCUEM_FACTS.map((f, i) => (
            <div key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', display: 'flex', gap: '1rem' }}>
              <div style={{ fontSize: '1.5rem', minWidth: 36, textAlign: 'center' }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

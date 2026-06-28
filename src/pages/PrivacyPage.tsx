export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Global Nexus</span>
        <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 800, marginTop: 8, marginBottom: '0.5rem' }}>Política de Privacidad</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Última actualización: 28 de junio de 2026</p>
      </div>

      {[
        {
          title: '1. Responsable del tratamiento',
          body: 'Global Nexus (nexusstrategy.online) es responsable del tratamiento de sus datos personales. Para consultas de privacidad, puede contactarnos en: privacidad@nexusstrategy.online',
        },
        {
          title: '2. Datos que recopilamos',
          body: 'Recopilamos: nombre completo, correo electrónico, nombre de empresa, país/estado, categoría de productos y contraseña cifrada. Para pagos, utilizamos Stripe como procesador externo y no almacenamos datos de tarjetas bancarias.',
        },
        {
          title: '3. Finalidad del tratamiento',
          body: 'Sus datos se utilizan para: (a) Gestionar su cuenta y acceso a la plataforma, (b) Facilitar la conexión entre productores mexicanos y compradores europeos, (c) Procesar pagos de suscripción, (d) Enviar comunicaciones relacionadas con el servicio, (e) Cumplir obligaciones legales.',
        },
        {
          title: '4. Base legal (RGPD)',
          body: 'El tratamiento de sus datos se basa en: ejecución de contrato (Art. 6.1.b RGPD) para la prestación del servicio, interés legítimo (Art. 6.1.f RGPD) para la seguridad de la plataforma, y consentimiento (Art. 6.1.a RGPD) para comunicaciones de marketing.',
        },
        {
          title: '5. Transferencias internacionales',
          body: 'Global Nexus opera entre México y la Unión Europea. Los datos pueden ser procesados en servidores ubicados en EE.UU. bajo garantías adecuadas (Cláusulas Contractuales Estándar de la Comisión Europea). Todos los proveedores cumplen con el RGPD.',
        },
        {
          title: '6. Conservación de datos',
          body: 'Conservamos sus datos mientras mantenga su cuenta activa y durante los 5 años posteriores a su eliminación por obligaciones legales y fiscales. Los datos de pagos se conservan según los requisitos de Stripe y la legislación aplicable.',
        },
        {
          title: '7. Sus derechos (RGPD)',
          body: 'Como usuario de la UE, tiene derecho a: acceso, rectificación, supresión ("derecho al olvido"), portabilidad, limitación del tratamiento y oposición. Para ejercer sus derechos, envíe un correo a privacidad@nexusstrategy.online con su identificación.',
        },
        {
          title: '8. Cookies',
          body: 'Utilizamos únicamente cookies técnicas necesarias para el funcionamiento de la plataforma (sesión, preferencias de idioma). No utilizamos cookies de rastreo publicitario de terceros.',
        },
        {
          title: '9. Seguridad',
          body: 'Implementamos medidas técnicas y organizativas: cifrado SSL/TLS en todas las comunicaciones, contraseñas almacenadas con hash bcrypt, acceso restringido a datos personales y copias de seguridad periódicas.',
        },
        {
          title: '10. Contacto y reclamaciones',
          body: 'Para cualquier consulta sobre privacidad: privacidad@nexusstrategy.online. Si considera que sus derechos no han sido respetados, puede presentar una reclamación ante la Autoridad de Control de su país de residencia en la UE (AEPD en España, AP en Países Bajos, BfDI en Alemania, CNIL en Francia).',
        },
      ].map(section => (
        <div key={section.title} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)' }}>{section.title}</h2>
          <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-muted)' }}>{section.body}</p>
        </div>
      ))}

      <div style={{ background: 'var(--teal-light)', border: '1px solid var(--teal)', borderRadius: 'var(--radius)', padding: '1.25rem', marginTop: '2rem' }}>
        <div style={{ fontSize: 13, color: 'var(--teal-dark)', fontWeight: 600, marginBottom: 4 }}>📧 Contacto de privacidad</div>
        <div style={{ fontSize: 13, color: 'var(--teal-dark)' }}>privacidad@nexusstrategy.online · nexusstrategy.online</div>
      </div>
    </div>
  )
}

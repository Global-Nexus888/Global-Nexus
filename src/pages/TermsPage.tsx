export default function TermsPage() {
  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Global Nexus</span>
        <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 800, marginTop: 8, marginBottom: '0.5rem' }}>Términos de Servicio</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Última actualización: 28 de junio de 2026</p>
      </div>

      {[
        {
          title: '1. Descripción del servicio y Deslinde de Responsabilidad',
          body: 'Global Nexus (Nexus Strategy) es una plataforma tecnológica de conectividad y comunicación B2B. Su función es facilitar el contacto y la comunicación entre productores mexicanos y compradores europeos mediante herramientas digitales de catálogo, mensajería, verificación documental y directorio comercial. NEXUS STRATEGY NO ES PARTE, NI INTERVIENE, EN LOS CONTRATOS COMERCIALES QUE LOS USUARIOS CELEBREN ENTRE SÍ. Nexus Strategy no es responsable ni garantiza: (a) el cumplimiento de contratos de compraventa entre usuarios, (b) el pago o cobro de mercancías, (c) el despacho aduanal, permisos fitosanitarios o retención de productos por autoridades, (d) la calidad, autenticidad o conformidad de las mercancías acordadas entre las partes, (e) el cumplimiento de obligaciones de envío, entrega o devolución. Nexus Strategy es un facilitador tecnológico. Las transacciones comerciales ocurren exclusivamente entre los usuarios registrados, quienes asumen plena responsabilidad sobre las mismas.',
        },
        {
          title: '2. Aceptación de los términos',
          body: 'Al registrarse en Global Nexus, usted acepta estos Términos de Servicio en su totalidad. Si no está de acuerdo con alguno de estos términos, no debe utilizar la plataforma. Nos reservamos el derecho de modificar estos términos con aviso previo de 30 días.',
        },
        {
          title: '3. Requisitos de elegibilidad',
          body: 'Para usar Global Nexus debe: (a) Tener al menos 18 años de edad, (b) Ser representante legal autorizado de la empresa que registra, (c) Productores: estar registrados ante el SAT con actividad exportadora legal en México, (d) Compradores: ser una entidad comercial legalmente constituida en un país de la Unión Europea.',
        },
        {
          title: '4. Suscripciones y pagos',
          body: 'Global Nexus ofrece planes de suscripción mensuales procesados por Stripe. Los precios se muestran en USD. Las suscripciones se renuevan automáticamente hasta ser canceladas. El reembolso se puede solicitar dentro de los 7 días posteriores al cobro si no ha utilizado el servicio. No se emiten reembolsos parciales por períodos no utilizados.',
        },
        {
          title: '5. Responsabilidades del usuario',
          body: 'Usted es responsable de: (a) Mantener la confidencialidad de sus credenciales, (b) La veracidad de la información y documentos subidos a la plataforma, (c) El cumplimiento de las regulaciones de exportación/importación aplicables, (d) Las transacciones comerciales que realice a través de conexiones establecidas en la plataforma. Global Nexus actúa como intermediario y no es parte de las transacciones comerciales entre usuarios.',
        },
        {
          title: '6. Alcance de la Verificación de Perfiles ("Perfil Verificado")',
          body: 'El badge "✓ Verificado" en Global Nexus significa exclusivamente que la plataforma ha validado: (a) la existencia legal de la empresa o persona moral, (b) su registro fiscal vigente (RFC en México / VAT-ID en la Unión Europea), y (c) la autenticidad de los datos de contacto directo declarados. La verificación de Global Nexus NO implica: (i) aval de la calidad de productos o servicios, (ii) cumplimiento de normas ISO, NOM, SENASICA u otras certificaciones de producto, (iii) historial crediticio o capacidad de pago, (iv) garantía de exportación o importación exitosa. El badge verificado es una validación de identidad empresarial, no una auditoría de calidad ni una certificación técnica. Los usuarios deben realizar su propia diligencia debida (due diligence) antes de formalizar cualquier acuerdo comercial.',
        },
        {
          title: '7. Propiedad intelectual',
          body: 'El contenido de la plataforma, incluyendo textos, diseños, logotipos y software, es propiedad de Global Nexus. Los usuarios conservan la propiedad de los contenidos que publican y otorgan a Global Nexus una licencia limitada para mostrarlos en la plataforma.',
        },
        {
          title: '8. Limitación de responsabilidad',
          body: 'Global Nexus no garantiza el éxito de transacciones comerciales entre usuarios, ni la exactitud de información proporcionada por terceros. En la máxima medida permitida por la ley, la responsabilidad de Global Nexus se limita al monto pagado en los últimos 12 meses de suscripción.',
        },
        {
          title: '9. Suspensión y cancelación',
          body: 'Podemos suspender o cancelar cuentas que violen estos términos, publiquen información falsa, realicen actividades fraudulentas o incumplan la legislación aplicable. Los usuarios pueden cancelar su cuenta en cualquier momento desde el panel de configuración.',
        },
        {
          title: '10. Ley aplicable y jurisdicción',
          body: 'Estos términos se rigen por las leyes de México. Para usuarios de la UE, se aplican adicionalmente los derechos de consumidor del RGPD y la legislación de su país de residencia. Las disputas se resolverán preferentemente por mediación antes de recurrir a los tribunales.',
        },
      ].map(section => (
        <div key={section.title} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)' }}>{section.title}</h2>
          <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-muted)' }}>{section.body}</p>
        </div>
      ))}

      <div style={{ background: 'var(--navy-light)', border: '1px solid #BFDBFE', borderRadius: 'var(--radius)', padding: '1.25rem', marginTop: '2rem' }}>
        <div style={{ fontSize: 13, color: 'var(--navy)', fontWeight: 600, marginBottom: 4 }}>📧 Contacto legal</div>
        <div style={{ fontSize: 13, color: 'var(--navy)' }}>legal@nexusstrategy.online · nexusstrategy.online</div>
      </div>
    </div>
  )
}

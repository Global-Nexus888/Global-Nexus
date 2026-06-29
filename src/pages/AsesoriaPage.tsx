import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { usePageMeta } from '../hooks/usePageMeta'
import type { Lang } from '../context/LangContext'

const copy: Record<Lang, {
  badge: string; title: string; sub: string
  how_title: string
  steps: { icon: string; title: string; desc: string }[]
  certs_title: string; certs: string[]
  advisors_title: string; advisors_sub: string
  for_advisors_title: string
  for_advisors: { icon: string; title: string; desc: string }[]
  cta_prod: string; cta_prod_sub: string; cta_prod_btn: string
  cta_asesor: string; cta_asesor_sub: string; cta_asesor_btn: string
  faq_title: string; faqs: { q: string; a: string }[]
}> = {
  es: {
    badge: '🎓 Asesoría Profesional · Global Nexus',
    title: 'Certifícate para exportar a Europa',
    sub: 'Conectamos a productores mexicanos con asesores especializados en certificaciones TLCUEM, NOM, SENASICA y más — todo en una sola plataforma. Chat privado, gestión de documentos y seguimiento hasta lograrlo.',
    how_title: 'Cómo funciona la Asesoría',
    steps: [
      { icon: '🔍', title: 'Publica tu necesidad', desc: 'Describe qué certificación necesitas (SENASICA, NOM, Denominación de Origen, etc.) y tu presupuesto aproximado.' },
      { icon: '🎓', title: 'Conecta con un asesor', desc: 'Recibe propuestas de asesores verificados. Revisa su perfil, experiencia y tarifa. Elige el que mejor te conviene.' },
      { icon: '💬', title: 'Chat privado + documentos', desc: 'Comparte documentación de forma segura dentro de la plataforma. Seguimiento en tiempo real del proceso.' },
      { icon: '✅', title: 'Logra tu certificación', desc: 'El asesor te guía hasta completar el proceso. Pago final a través de Global Nexus cuando alcances el objetivo.' },
    ],
    certs_title: 'Certificaciones disponibles',
    certs: ['NOM (Normas Oficiales Mexicanas)', 'SENASICA (Sanidad agropecuaria)', 'COFEPRIS (Salud y alimentos)', 'Denominación de Origen', 'Certificación Orgánica', 'Certificado TLCUEM de origen', 'Registro sanitario EU', 'Kosher / Halal', 'ISO 22000 / BRC / HACCP', 'VAT-ID y registro fiscal EU'],
    advisors_title: 'Asesores verificados',
    advisors_sub: 'Profesionales con experiencia real en exportación México–Europa',
    for_advisors_title: '¿Eres asesor profesional?',
    for_advisors: [
      { icon: '💼', title: 'Cobra tu propia tarifa', desc: 'Establece tus tarifas: por proyecto, por hora o por comisión. Tú decides cuánto vale tu experiencia.' },
      { icon: '💳', title: 'Cobros seguros a través de Global Nexus', desc: 'Los productores pagan a través de la plataforma. Recibes el pago al completar hitos acordados.' },
      { icon: '🌍', title: 'Acceso a cientos de productores', desc: 'Conecta con productores de todo México que necesitan exactamente tu expertise para exportar a Europa.' },
      { icon: '📊', title: 'Tu propio panel de gestión', desc: 'Gestiona múltiples clientes, documentos y seguimientos desde tu panel de asesor dedicado.' },
    ],
    cta_prod: '¿Buscas un asesor para tu certificación?',
    cta_prod_sub: 'Regístrate como productor y publica tu necesidad. Los asesores llegarán a ti.',
    cta_prod_btn: 'Buscar asesor certificador',
    cta_asesor: '¿Eres experto en certificaciones o comercio exterior?',
    cta_asesor_sub: 'Regístrate como asesor y conecta con productores mexicanos que necesitan tu ayuda para llegar a Europa.',
    cta_asesor_btn: 'Registrarme como asesor',
    faq_title: 'Preguntas frecuentes',
    faqs: [
      { q: '¿Cómo se determina la tarifa del asesor?', a: 'Cada asesor establece su propia tarifa (por proyecto, por hora o por comisión). El productor ve las propuestas y elige. Global Nexus no fija tarifas.' },
      { q: '¿Cómo y cuándo se hace el pago al asesor?', a: 'El pago se realiza a través de Global Nexus en hitos acordados entre productor y asesor. Al cumplir cada hito, se libera el pago correspondiente.' },
      { q: '¿Qué pasa si el proceso no concluye?', a: 'Los pagos están sujetos a los hitos acordados. Si el proceso no avanza por causa del asesor, el productor puede solicitar mediación a través de la plataforma.' },
      { q: '¿Puedo contratar varios asesores para distintas certificaciones?', a: 'Sí. Puedes tener un asesor para SENASICA y otro para NOM simultáneamente. Cada proceso es independiente.' },
      { q: '¿Los asesores son de México o también de Europa?', a: 'Ambos. Tenemos asesores mexicanos especializados en regulación de exportación y asesores europeos para requisitos de entrada a la UE.' },
    ],
  },

  en: {
    badge: '🎓 Professional Advisory · Global Nexus',
    title: 'Get certified to export to Europe',
    sub: 'We connect Mexican producers with specialists in TLCUEM, NOM, SENASICA certifications and more — all on one platform. Private chat, document management and tracking until you achieve it.',
    how_title: 'How Advisory Works',
    steps: [
      { icon: '🔍', title: 'Post your need', desc: 'Describe which certification you need (SENASICA, NOM, Denomination of Origin, etc.) and your approximate budget.' },
      { icon: '🎓', title: 'Connect with an advisor', desc: 'Receive proposals from verified advisors. Review their profile, experience and fee. Choose the one that suits you best.' },
      { icon: '💬', title: 'Private chat + documents', desc: 'Share documentation securely within the platform. Real-time tracking of the process.' },
      { icon: '✅', title: 'Achieve your certification', desc: 'The advisor guides you until the process is complete. Final payment through Global Nexus when you reach the goal.' },
    ],
    certs_title: 'Available certifications',
    certs: ['NOM (Mexican Official Standards)', 'SENASICA (Agricultural health)', 'COFEPRIS (Health and food)', 'Denomination of Origin', 'Organic Certification', 'TLCUEM origin certificate', 'EU health registration', 'Kosher / Halal', 'ISO 22000 / BRC / HACCP', 'VAT-ID and EU tax registration'],
    advisors_title: 'Verified advisors',
    advisors_sub: 'Professionals with real experience in Mexico–Europe export',
    for_advisors_title: 'Are you a professional advisor?',
    for_advisors: [
      { icon: '💼', title: 'Set your own fee', desc: 'Set your rates: per project, per hour or by commission. You decide what your expertise is worth.' },
      { icon: '💳', title: 'Secure payments through Global Nexus', desc: 'Producers pay through the platform. You receive payment upon completing agreed milestones.' },
      { icon: '🌍', title: 'Access to hundreds of producers', desc: 'Connect with producers throughout Mexico who need exactly your expertise to export to Europe.' },
      { icon: '📊', title: 'Your own management panel', desc: 'Manage multiple clients, documents and follow-ups from your dedicated advisor panel.' },
    ],
    cta_prod: 'Looking for an advisor for your certification?',
    cta_prod_sub: 'Register as a producer and post your need. Advisors will come to you.',
    cta_prod_btn: 'Find a certification advisor',
    cta_asesor: 'Are you an expert in certifications or foreign trade?',
    cta_asesor_sub: 'Register as an advisor and connect with Mexican producers who need your help to reach Europe.',
    cta_asesor_btn: 'Register as advisor',
    faq_title: 'Frequently asked questions',
    faqs: [
      { q: 'How is the advisor fee determined?', a: 'Each advisor sets their own fee (per project, per hour or commission). The producer sees proposals and chooses. Global Nexus does not set fees.' },
      { q: 'How and when is the advisor paid?', a: 'Payment is made through Global Nexus in milestones agreed between producer and advisor. When each milestone is met, the corresponding payment is released.' },
      { q: 'What happens if the process does not conclude?', a: 'Payments are subject to agreed milestones. If the process does not advance due to the advisor, the producer can request mediation through the platform.' },
      { q: 'Can I hire multiple advisors for different certifications?', a: 'Yes. You can have one advisor for SENASICA and another for NOM simultaneously. Each process is independent.' },
      { q: 'Are advisors from Mexico or also from Europe?', a: 'Both. We have Mexican advisors specialized in export regulation and European advisors for EU entry requirements.' },
    ],
  },

  nl: {
    badge: '🎓 Professioneel Advies · Global Nexus',
    title: 'Gecertificeerd worden voor export naar Europa',
    sub: 'Wij verbinden Mexicaanse producenten met specialisten in TLCUEM, NOM, SENASICA certificeringen — alles op één platform. Privéchat, documentbeheer en opvolging tot u slaagt.',
    how_title: 'Hoe Advies Werkt',
    steps: [
      { icon: '🔍', title: 'Publiceer uw behoefte', desc: 'Beschrijf welke certificering u nodig heeft en uw geschatte budget.' },
      { icon: '🎓', title: 'Verbind met een adviseur', desc: 'Ontvang voorstellen van geverifieerde adviseurs. Bekijk hun profiel, ervaring en tarief.' },
      { icon: '💬', title: 'Privéchat + documenten', desc: 'Deel documentatie veilig binnen het platform. Real-time opvolging van het proces.' },
      { icon: '✅', title: 'Behaal uw certificering', desc: 'De adviseur begeleidt u totdat het proces is voltooid. Betaling via Global Nexus bij het behalen van het doel.' },
    ],
    certs_title: 'Beschikbare certificeringen',
    certs: ['NOM (Mexicaanse officiële normen)', 'SENASICA (Landbouwgezondheid)', 'COFEPRIS (Gezondheid en voedsel)', 'Denominatie van Oorsprong', 'Biologische certificering', 'TLCUEM oorsprongscertificaat', 'EU-gezondheidsregistratie', 'Koosjer / Halal', 'ISO 22000 / BRC / HACCP', 'BTW-ID en EU-belastingregistratie'],
    advisors_title: 'Geverifieerde adviseurs',
    advisors_sub: 'Professionals met echte ervaring in Mexico–Europa export',
    for_advisors_title: 'Bent u een professionele adviseur?',
    for_advisors: [
      { icon: '💼', title: 'Stel uw eigen tarief in', desc: 'Stel uw tarieven in: per project, per uur of op commissiebasis. U beslist wat uw expertise waard is.' },
      { icon: '💳', title: 'Veilige betalingen via Global Nexus', desc: 'Producenten betalen via het platform. U ontvangt betaling bij voltooiing van overeengekomen mijlpalen.' },
      { icon: '🌍', title: 'Toegang tot honderden producenten', desc: 'Verbind met producenten door heel Mexico die precies uw expertise nodig hebben.' },
      { icon: '📊', title: 'Uw eigen beheerpanel', desc: 'Beheer meerdere klanten, documenten en opvolgingen vanuit uw toegewijde adviseurspanel.' },
    ],
    cta_prod: 'Op zoek naar een adviseur voor uw certificering?',
    cta_prod_sub: 'Registreer als producent en publiceer uw behoefte. Adviseurs komen naar u toe.',
    cta_prod_btn: 'Certificeringsadviseur vinden',
    cta_asesor: 'Bent u een expert in certificeringen of buitenlandse handel?',
    cta_asesor_sub: 'Registreer als adviseur en verbind met Mexicaanse producenten die uw hulp nodig hebben.',
    cta_asesor_btn: 'Registreren als adviseur',
    faq_title: 'Veelgestelde vragen',
    faqs: [
      { q: 'Hoe wordt het tarief van de adviseur bepaald?', a: 'Elke adviseur stelt zijn eigen tarief vast. De producent ziet voorstellen en kiest. Global Nexus stelt geen tarieven vast.' },
      { q: 'Hoe en wanneer wordt de adviseur betaald?', a: 'Betaling vindt plaats via Global Nexus in mijlpalen overeengekomen tussen producent en adviseur.' },
      { q: 'Wat gebeurt er als het proces niet wordt afgerond?', a: 'Betalingen zijn afhankelijk van overeengekomen mijlpalen. Als het proces niet vordert door de adviseur, kan de producent bemiddeling aanvragen.' },
      { q: 'Kan ik meerdere adviseurs inhuren voor verschillende certificeringen?', a: 'Ja. U kunt tegelijkertijd een adviseur voor SENASICA en een voor NOM hebben. Elk proces is onafhankelijk.' },
      { q: 'Zijn adviseurs uit Mexico of ook uit Europa?', a: 'Beide. Wij hebben Mexicaanse adviseurs gespecialiseerd in exportregulering en Europese adviseurs voor EU-toegangsvereisten.' },
    ],
  },

  de: {
    badge: '🎓 Professionelle Beratung · Global Nexus',
    title: 'Zertifiziert werden für den Export nach Europa',
    sub: 'Wir verbinden mexikanische Produzenten mit Spezialisten für TLCUEM-, NOM-, SENASICA-Zertifizierungen — alles auf einer Plattform. Privater Chat, Dokumentenverwaltung und Begleitung bis zum Ziel.',
    how_title: 'Wie die Beratung funktioniert',
    steps: [
      { icon: '🔍', title: 'Bedarf veröffentlichen', desc: 'Beschreiben Sie, welche Zertifizierung Sie benötigen und Ihr ungefähres Budget.' },
      { icon: '🎓', title: 'Mit einem Berater verbinden', desc: 'Erhalten Sie Angebote von verifizierten Beratern. Überprüfen Sie deren Profil, Erfahrung und Honorar.' },
      { icon: '💬', title: 'Privater Chat + Dokumente', desc: 'Teilen Sie Dokumentation sicher innerhalb der Plattform. Echtzeit-Verfolgung des Prozesses.' },
      { icon: '✅', title: 'Zertifizierung erreichen', desc: 'Der Berater begleitet Sie bis zum Abschluss des Prozesses. Zahlung über Global Nexus bei Zielerreichung.' },
    ],
    certs_title: 'Verfügbare Zertifizierungen',
    certs: ['NOM (Mexikanische offizielle Normen)', 'SENASICA (Landwirtschaftliche Gesundheit)', 'COFEPRIS (Gesundheit und Lebensmittel)', 'Herkunftsbezeichnung', 'Bio-Zertifizierung', 'TLCUEM-Ursprungszeugnis', 'EU-Gesundheitsregistrierung', 'Koscher / Halal', 'ISO 22000 / BRC / HACCP', 'USt-IdNr. und EU-Steuerregistrierung'],
    advisors_title: 'Verifizierte Berater',
    advisors_sub: 'Fachleute mit echter Erfahrung im Mexico–Europa-Export',
    for_advisors_title: 'Sind Sie ein professioneller Berater?',
    for_advisors: [
      { icon: '💼', title: 'Eigenes Honorar festlegen', desc: 'Legen Sie Ihre Honorare fest: pro Projekt, pro Stunde oder Provision. Sie entscheiden, was Ihre Expertise wert ist.' },
      { icon: '💳', title: 'Sichere Zahlungen über Global Nexus', desc: 'Produzenten zahlen über die Plattform. Sie erhalten die Zahlung bei Abschluss vereinbarter Meilensteine.' },
      { icon: '🌍', title: 'Zugang zu hunderten von Produzenten', desc: 'Verbinden Sie sich mit Produzenten in ganz Mexiko, die genau Ihre Expertise benötigen.' },
      { icon: '📊', title: 'Ihr eigenes Verwaltungspanel', desc: 'Verwalten Sie mehrere Kunden, Dokumente und Follow-ups über Ihr dediziertes Beraterpanel.' },
    ],
    cta_prod: 'Suchen Sie einen Berater für Ihre Zertifizierung?',
    cta_prod_sub: 'Registrieren Sie sich als Produzent und veröffentlichen Sie Ihren Bedarf. Berater kommen zu Ihnen.',
    cta_prod_btn: 'Zertifizierungsberater finden',
    cta_asesor: 'Sind Sie Experte für Zertifizierungen oder Außenhandel?',
    cta_asesor_sub: 'Registrieren Sie sich als Berater und verbinden Sie sich mit mexikanischen Produzenten, die Ihre Hilfe benötigen.',
    cta_asesor_btn: 'Als Berater registrieren',
    faq_title: 'Häufig gestellte Fragen',
    faqs: [
      { q: 'Wie wird das Honorar des Beraters festgelegt?', a: 'Jeder Berater legt sein eigenes Honorar fest. Der Produzent sieht Angebote und wählt. Global Nexus legt keine Honorare fest.' },
      { q: 'Wie und wann wird der Berater bezahlt?', a: 'Die Zahlung erfolgt über Global Nexus in vereinbarten Meilensteinen zwischen Produzent und Berater.' },
      { q: 'Was passiert, wenn der Prozess nicht abgeschlossen wird?', a: 'Zahlungen hängen von vereinbarten Meilensteinen ab. Wenn der Prozess nicht voranschreitet, kann der Produzent eine Mediation beantragen.' },
      { q: 'Kann ich mehrere Berater für verschiedene Zertifizierungen beauftragen?', a: 'Ja. Sie können gleichzeitig einen Berater für SENASICA und einen für NOM haben. Jeder Prozess ist unabhängig.' },
      { q: 'Sind Berater aus Mexiko oder auch aus Europa?', a: 'Beide. Wir haben mexikanische Berater für Exportregulierung und europäische Berater für EU-Einreiseanforderungen.' },
    ],
  },
}

const MOCK_ADVISORS = [
  { name: 'Lic. Carmen Vega', spec: 'SENASICA · NOM · Exportación agropecuaria', exp: '12 años', flag: '🇲🇽', rate: 'Desde $1,500 USD / proyecto', avatar: '👩‍💼' },
  { name: 'Ing. Roberto Salinas', spec: 'COFEPRIS · Registro sanitario EU · ISO 22000', exp: '8 años', flag: '🇲🇽', rate: 'Desde $2,000 USD / proyecto', avatar: '👨‍💼' },
  { name: 'Dr. Hans Mueller', spec: 'Regulación EU · VAT-ID · Comercio exterior UE', exp: '15 años', flag: '🇩🇪', rate: 'Desde €1,800 / proyecto', avatar: '👨‍🏫' },
  { name: 'Mtra. Sofia Delgado', spec: 'Denominación de Origen · TLCUEM · Artesanías', exp: '6 años', flag: '🇲🇽', rate: 'Desde $1,200 USD / proyecto', avatar: '👩‍🏫' },
]

export default function AsesoriaPage() {
  usePageMeta()
  const { lang } = useLang()
  const i = copy[lang]
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E3A5F 60%, #0D4A42 100%)', color: '#fff', padding: 'clamp(2.5rem,6vw,5rem) 1.25rem clamp(2rem,5vw,4rem)', textAlign: 'center' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <span style={{ display: 'inline-block', background: 'rgba(13,148,136,.2)', border: '1px solid rgba(13,148,136,.4)', color: '#5EEAD4', padding: '5px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, marginBottom: '1.25rem' }}>
            {i.badge}
          </span>
          <h1 style={{ fontSize: 'clamp(1.75rem,5vw,3rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem' }}>{i.title}</h1>
          <p style={{ fontSize: 'clamp(.9rem,2.5vw,1.1rem)', color: 'rgba(255,255,255,.75)', maxWidth: 620, margin: '0 auto 2rem', lineHeight: 1.7 }}>{i.sub}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/registro" className="btn btn-primary" style={{ padding: '12px 26px' }}>{i.cta_prod_btn}</Link>
            <a href="#para-asesores" className="btn" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', border: '1px solid rgba(255,255,255,.25)', padding: '12px 26px' }}>{i.cta_asesor_btn}</a>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(2rem,5vw,4rem) 1.25rem' }}>

        {/* ── HOW IT WORKS ── */}
        <section style={{ marginBottom: 'clamp(2.5rem,6vw,4rem)' }}>
          <h2 style={{ fontSize: 'clamp(1.1rem,3vw,1.4rem)', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>{i.how_title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.25rem' }}>
            {i.steps.map((s, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 10, right: 14, fontSize: '2rem', fontWeight: 900, color: '#E2E8F0' }}>0{idx + 1}</div>
                <div style={{ fontSize: '1.75rem', marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#0F172A' }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CERTIFICATIONS ── */}
        <section style={{ marginBottom: 'clamp(2.5rem,6vw,4rem)', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '2rem' }}>
          <h2 style={{ fontSize: 'clamp(1rem,2.5vw,1.2rem)', fontWeight: 800, marginBottom: '1.25rem' }}>{i.certs_title}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {i.certs.map((c, idx) => (
              <span key={idx} style={{ background: '#CCFBF1', color: '#0F766E', padding: '6px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600, border: '1px solid #99F6E4' }}>✓ {c}</span>
            ))}
          </div>
        </section>

        {/* ── ADVISORS ── */}
        <section style={{ marginBottom: 'clamp(2.5rem,6vw,4rem)' }}>
          <h2 style={{ fontSize: 'clamp(1rem,2.5vw,1.2rem)', fontWeight: 800, marginBottom: '.5rem' }}>{i.advisors_title}</h2>
          <p style={{ fontSize: 13, color: '#64748B', marginBottom: '1.5rem' }}>{i.advisors_sub}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '1rem' }}>
            {MOCK_ADVISORS.map((a, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: '#CCFBF1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{a.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{a.name} {a.flag}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>{a.exp} de experiencia</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#0D9488', fontWeight: 600, marginBottom: 8 }}>{a.spec}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1E3A5F' }}>{a.rate}</div>
                <Link to="/registro" style={{ display: 'block', marginTop: 12, textAlign: 'center', padding: '8px', borderRadius: 8, background: '#CCFBF1', color: '#0F766E', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                  {lang === 'es' ? 'Contactar asesor' : lang === 'nl' ? 'Adviseur contacteren' : lang === 'de' ? 'Berater kontaktieren' : 'Contact advisor'} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOR ADVISORS ── */}
        <section id="para-asesores" style={{ marginBottom: 'clamp(2.5rem,6vw,4rem)', background: 'linear-gradient(135deg, #0F172A, #1E3A5F)', borderRadius: 20, padding: 'clamp(1.5rem,4vw,2.5rem)', color: '#fff' }}>
          <h2 style={{ fontSize: 'clamp(1.1rem,3vw,1.4rem)', fontWeight: 800, marginBottom: '1.75rem', color: '#5EEAD4' }}>{i.for_advisors_title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {i.for_advisors.map((f, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '1.25rem' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 5 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
          <Link to="/registro" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: 15 }}>{i.cta_asesor_btn}</Link>
        </section>

        {/* ── CTA PRODUCER ── */}
        <section style={{ marginBottom: 'clamp(2.5rem,6vw,4rem)', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.1rem,3vw,1.25rem)', fontWeight: 800, marginBottom: '.75rem' }}>{i.cta_prod}</h2>
          <p style={{ fontSize: 14, color: '#64748B', marginBottom: '1.5rem', lineHeight: 1.65 }}>{i.cta_prod_sub}</p>
          <Link to="/registro" className="btn btn-primary" style={{ padding: '12px 28px' }}>{i.cta_prod_btn}</Link>
        </section>

        {/* ── FAQ ── */}
        <section>
          <h2 style={{ fontSize: 'clamp(1.1rem,3vw,1.25rem)', fontWeight: 800, marginBottom: '1.25rem', textAlign: 'center' }}>{i.faq_title}</h2>
          <div style={{ border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden' }}>
            {i.faqs.map((f, idx) => (
              <div key={idx} style={{ borderBottom: idx < i.faqs.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{ width: '100%', padding: '1rem 1.25rem', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: 14, textAlign: 'left', color: '#0F172A' }}
                >
                  {f.q}
                  <span style={{ color: '#0D9488', fontSize: '1.1rem', flexShrink: 0, marginLeft: 12 }}>{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div style={{ padding: '0 1.25rem 1rem', fontSize: 13, color: '#64748B', lineHeight: 1.7 }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

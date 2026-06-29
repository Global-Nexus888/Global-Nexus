import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { usePageMeta } from '../hooks/usePageMeta'
import type { Lang } from '../context/LangContext'

const content: Record<Lang, {
  title: string; sub: string
  tab_producer: string; tab_buyer: string
  steps_producer: { icon: string; title: string; desc: string }[]
  steps_buyer: { icon: string; title: string; desc: string }[]
  tlcuem_title: string
  tlcuem: { icon: string; title: string; desc: string }[]
  cta_title: string; cta_sub: string; cta_btn: string
}> = {
  es: {
    title: '¿Cómo funciona Global Nexus?',
    sub: 'Conectamos productores mexicanos con compradores europeos sin intermediarios, con aranceles 0% bajo el TLCUEM.',
    tab_producer: 'Soy productor mexicano',
    tab_buyer: 'Soy comprador europeo',
    steps_producer: [
      { icon: '📝', title: 'Crea tu perfil de productor', desc: 'Registro gratuito. Sube tus certificaciones, fotos de producto y capacidad productiva. Proceso 100% en línea.' },
      { icon: '✅', title: 'Verificación de documentos por IA', desc: 'Nuestro sistema valida automáticamente tus certificados (NOM, SENASICA, COFEPRIS, D.O.) en menos de 24 horas.' },
      { icon: '🛒', title: 'Publica tu catálogo', desc: 'Sube tus productos con precio, MOQ, fotos y disponibilidad. Apareces en búsquedas de 450M consumidores europeos.' },
      { icon: '💬', title: 'Recibe órdenes y conecta', desc: 'Los compradores te contactan directamente. Mensajería bilingüe integrada. Sin intermediarios.' },
      { icon: '🚢', title: 'Nosotros gestionamos la logística', desc: 'Coordinamos el envío desde Puerto Veracruz, la documentación TLCUEM y la entrega en destino europeo.' },
    ],
    steps_buyer: [
      { icon: '🔐', title: 'Regístrate como comprador EU', desc: 'Perfil gratuito. Indica tu país, sector y qué tipo de productos buscas de México.' },
      { icon: '🔍', title: 'Explora el catálogo verificado', desc: 'Filtra por categoría, certificación, estado mexicano y precio. Solo productos con capacidad de exportación real.' },
      { icon: '📊', title: 'Compara y solicita muestras', desc: 'Solicita muestras directamente al productor antes de hacer un pedido de volumen. Sin riesgo.' },
      { icon: '📄', title: 'Documentación gestionada', desc: 'Todos los trámites de exportación-importación, aranceles cero TLCUEM y permisos fitosanitarios los gestionamos nosotros.' },
      { icon: '📦', title: 'Recibe en tu país europeo', desc: 'Entrega en tu almacén en cualquiera de los 27 países de la UE. Tracking en tiempo real.' },
    ],
    tlcuem_title: '¿Qué es el TLCUEM y por qué importa?',
    tlcuem: [
      { icon: '🏛️', title: 'Qué es el TLCUEM', desc: 'El Tratado de Libre Comercio México-Unión Europea elimina aranceles en la mayoría de productos agrícolas, industriales y artesanales mexicanos al entrar a Europa.' },
      { icon: '0%', title: 'Arancel cero', desc: 'La mayoría de categorías aplica arancel del 0%. Un café chiapaneco que llegaría a 25% en Alemania, con TLCUEM entra sin costo.' },
      { icon: '27', title: '27 países destino', desc: 'Una sola exportación desde México puede distribuirse a cualquiera de los 27 países miembros de la Unión Europea sin tramitación adicional.' },
      { icon: '🌾', title: 'Productos elegibles', desc: 'Alimentos, bebidas, artesanías, cosméticos, farmacéuticos, textiles y más. Global Nexus verifica que tu producto cumpla los requisitos de origen.' },
    ],
    cta_title: '¿Listo para empezar?',
    cta_sub: 'Regístrate gratis hoy y conecta con partners en 27 países europeos.',
    cta_btn: 'Crear cuenta gratis',
  },

  en: {
    title: 'How does Global Nexus work?',
    sub: 'We connect Mexican producers with European buyers without intermediaries, with 0% tariffs under the TLCUEM agreement.',
    tab_producer: "I'm a Mexican producer",
    tab_buyer: "I'm a European buyer",
    steps_producer: [
      { icon: '📝', title: 'Create your producer profile', desc: 'Free registration. Upload your certifications, product photos and production capacity. 100% online process.' },
      { icon: '✅', title: 'AI document verification', desc: 'Our system automatically validates your certificates (NOM, SENASICA, COFEPRIS, D.O.) in less than 24 hours.' },
      { icon: '🛒', title: 'Publish your catalog', desc: 'Upload your products with price, MOQ, photos and availability. Appear in searches by 450M European consumers.' },
      { icon: '💬', title: 'Receive orders and connect', desc: 'Buyers contact you directly. Integrated bilingual messaging. No intermediaries.' },
      { icon: '🚢', title: 'We handle logistics', desc: 'We coordinate shipping from Veracruz Port, TLCUEM documentation and delivery to the European destination.' },
    ],
    steps_buyer: [
      { icon: '🔐', title: 'Register as EU buyer', desc: 'Free profile. Indicate your country, sector and what type of products you are looking for from Mexico.' },
      { icon: '🔍', title: 'Explore verified catalog', desc: 'Filter by category, certification, Mexican state and price. Only products with real export capacity.' },
      { icon: '📊', title: 'Compare and request samples', desc: 'Request samples directly from the producer before placing a bulk order. Risk free.' },
      { icon: '📄', title: 'Managed documentation', desc: 'All export-import procedures, TLCUEM zero tariffs and phytosanitary permits are managed by us.' },
      { icon: '📦', title: 'Receive in your European country', desc: 'Delivery to your warehouse in any of the 27 EU countries. Real-time tracking.' },
    ],
    tlcuem_title: 'What is the TLCUEM and why does it matter?',
    tlcuem: [
      { icon: '🏛️', title: 'What is the TLCUEM', desc: 'The Mexico-European Union Free Trade Agreement eliminates tariffs on most Mexican agricultural, industrial and artisanal products entering Europe.' },
      { icon: '0%', title: 'Zero tariff', desc: 'Most categories have a 0% tariff. A Chiapas coffee that would face 25% tax in Germany enters duty-free under TLCUEM.' },
      { icon: '27', title: '27 destination countries', desc: 'A single export from Mexico can be distributed to any of the 27 EU member countries without additional procedures.' },
      { icon: '🌾', title: 'Eligible products', desc: 'Food, beverages, crafts, cosmetics, pharmaceuticals, textiles and more. Global Nexus verifies your product meets origin requirements.' },
    ],
    cta_title: 'Ready to start?',
    cta_sub: 'Sign up free today and connect with partners in 27 European countries.',
    cta_btn: 'Create free account',
  },

  nl: {
    title: 'Hoe werkt Global Nexus?',
    sub: 'Wij verbinden Mexicaanse producenten met Europese kopers zonder tussenpersonen, met 0% tarieven onder het TLCUEM-akkoord.',
    tab_producer: 'Ik ben een Mexicaanse producent',
    tab_buyer: 'Ik ben een Europese koper',
    steps_producer: [
      { icon: '📝', title: 'Maak uw producentenprofiel', desc: "Gratis registratie. Upload uw certificeringen, productfoto's en productiecapaciteit. 100% online proces." },
      { icon: '✅', title: 'AI-documentverificatie', desc: 'Ons systeem valideert automatisch uw certificaten (NOM, SENASICA, COFEPRIS, D.O.) in minder dan 24 uur.' },
      { icon: '🛒', title: 'Publiceer uw catalogus', desc: "Upload uw producten met prijs, MOQ, foto's en beschikbaarheid. Verschijn in zoekopdrachten van 450M Europese consumenten." },
      { icon: '💬', title: 'Ontvang bestellingen en verbind', desc: 'Kopers nemen direct contact met u op. Geïntegreerde tweetalige berichten. Geen tussenpersonen.' },
      { icon: '🚢', title: 'Wij regelen de logistiek', desc: 'Wij coördineren de verzending vanuit de haven van Veracruz, TLCUEM-documentatie en levering op de Europese bestemming.' },
    ],
    steps_buyer: [
      { icon: '🔐', title: 'Registreer als EU-koper', desc: 'Gratis profiel. Geef uw land, sector en welke producten u zoekt uit Mexico op.' },
      { icon: '🔍', title: 'Verken de geverifieerde catalogus', desc: 'Filter op categorie, certificering, Mexicaanse staat en prijs. Alleen producten met echte exportcapaciteit.' },
      { icon: '📊', title: 'Vergelijk en vraag monsters aan', desc: 'Vraag monsters rechtstreeks bij de producent aan voordat u een bulkbestelling plaatst. Risicovrij.' },
      { icon: '📄', title: 'Beheerde documentatie', desc: 'Alle export-importprocedures, TLCUEM-nultarieven en fytosanitaire vergunningen worden door ons beheerd.' },
      { icon: '📦', title: 'Ontvang in uw Europese land', desc: 'Levering bij uw magazijn in een van de 27 EU-landen. Real-time tracking.' },
    ],
    tlcuem_title: 'Wat is het TLCUEM en waarom is het belangrijk?',
    tlcuem: [
      { icon: '🏛️', title: 'Wat is het TLCUEM', desc: 'Het Mexico-EU Vrijhandelsakkoord elimineert tarieven op de meeste Mexicaanse landbouw-, industrie- en ambachtsproducten die Europa binnenkomen.' },
      { icon: '0%', title: 'Nultarief', desc: 'De meeste categorieën hebben een tarief van 0%. Een Chiapas koffie die in Duitsland 25% belasting zou ondergaan, komt onder TLCUEM vrij van rechten binnen.' },
      { icon: '27', title: '27 bestemmingslanden', desc: 'Een enkele export vanuit Mexico kan worden gedistribueerd naar elk van de 27 EU-lidstaten zonder aanvullende procedures.' },
      { icon: '🌾', title: 'In aanmerking komende producten', desc: 'Voedsel, dranken, ambachten, cosmetica, farmaceutica, textiel en meer. Global Nexus verifieert dat uw product voldoet aan de oorsprongsvereisten.' },
    ],
    cta_title: 'Klaar om te beginnen?',
    cta_sub: 'Registreer u vandaag gratis en verbind met partners in 27 Europese landen.',
    cta_btn: 'Gratis account aanmaken',
  },

  de: {
    title: 'Wie funktioniert Global Nexus?',
    sub: 'Wir verbinden mexikanische Produzenten mit europäischen Käufern ohne Zwischenhändler, mit 0% Zöllen unter dem TLCUEM-Abkommen.',
    tab_producer: 'Ich bin mexikanischer Produzent',
    tab_buyer: 'Ich bin europäischer Käufer',
    steps_producer: [
      { icon: '📝', title: 'Erstellen Sie Ihr Produzentenprofil', desc: 'Kostenlose Registrierung. Laden Sie Ihre Zertifizierungen, Produktfotos und Produktionskapazität hoch. 100% Online-Prozess.' },
      { icon: '✅', title: 'KI-Dokumentenverifizierung', desc: 'Unser System validiert automatisch Ihre Zertifikate (NOM, SENASICA, COFEPRIS, D.O.) in weniger als 24 Stunden.' },
      { icon: '🛒', title: 'Katalog veröffentlichen', desc: 'Laden Sie Ihre Produkte mit Preis, MOQ, Fotos und Verfügbarkeit hoch. Erscheinen Sie in Suchen von 450M europäischen Verbrauchern.' },
      { icon: '💬', title: 'Bestellungen erhalten und verbinden', desc: 'Käufer kontaktieren Sie direkt. Integriertes zweisprachiges Messaging. Keine Zwischenhändler.' },
      { icon: '🚢', title: 'Wir übernehmen die Logistik', desc: 'Wir koordinieren den Versand vom Hafen Veracruz, TLCUEM-Dokumentation und Lieferung an das europäische Ziel.' },
    ],
    steps_buyer: [
      { icon: '🔐', title: 'Als EU-Käufer registrieren', desc: 'Kostenloses Profil. Geben Sie Ihr Land, Ihre Branche und welche Produkte Sie aus Mexiko suchen an.' },
      { icon: '🔍', title: 'Verifizierten Katalog erkunden', desc: 'Filtern Sie nach Kategorie, Zertifizierung, mexikanischem Bundesstaat und Preis. Nur Produkte mit echter Exportkapazität.' },
      { icon: '📊', title: 'Vergleichen und Muster anfordern', desc: 'Fordern Sie Muster direkt beim Produzenten an, bevor Sie eine Großbestellung aufgeben. Risikolos.' },
      { icon: '📄', title: 'Verwaltete Dokumentation', desc: 'Alle Export-Import-Verfahren, TLCUEM-Nullzölle und pflanzenschutzrechtliche Genehmigungen werden von uns verwaltet.' },
      { icon: '📦', title: 'Empfang in Ihrem europäischen Land', desc: 'Lieferung in Ihr Lager in einem der 27 EU-Länder. Echtzeit-Tracking.' },
    ],
    tlcuem_title: 'Was ist das TLCUEM und warum ist es wichtig?',
    tlcuem: [
      { icon: '🏛️', title: 'Was ist das TLCUEM', desc: 'Das Mexiko-EU-Freihandelsabkommen beseitigt Zölle auf die meisten mexikanischen landwirtschaftlichen, industriellen und handwerklichen Produkte, die nach Europa kommen.' },
      { icon: '0%', title: 'Nullzoll', desc: 'Die meisten Kategorien haben einen Zollsatz von 0%. Ein Chiapas-Kaffee, der in Deutschland 25% Steuer hätte, kommt unter TLCUEM zollfrei ein.' },
      { icon: '27', title: '27 Zielländer', desc: 'Ein einziger Export aus Mexiko kann an alle 27 EU-Mitgliedsländer ohne weitere Verfahren verteilt werden.' },
      { icon: '🌾', title: 'Berechtigte Produkte', desc: 'Lebensmittel, Getränke, Kunsthandwerk, Kosmetika, Pharmazeutika, Textilien und mehr. Global Nexus überprüft, ob Ihr Produkt die Ursprungsanforderungen erfüllt.' },
    ],
    cta_title: 'Bereit anzufangen?',
    cta_sub: 'Registrieren Sie sich noch heute kostenlos und verbinden Sie sich mit Partnern in 27 europäischen Ländern.',
    cta_btn: 'Kostenloses Konto erstellen',
  },
}

export default function HowItWorksPage() {
  usePageMeta()
  const { lang } = useLang()
  const i = content[lang]

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', fontWeight: 800, marginBottom: '.5rem' }}>{i.title}</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '3rem', maxWidth: 600, lineHeight: 1.65 }}>{i.sub}</p>

      {/* Producer steps */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--teal)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
          🏭 {i.tab_producer}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {i.steps_producer.map((s, idx) => (
            <div key={idx} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem 1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--teal-light)', border: '2px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--teal)', marginBottom: 2 }}>0{idx + 1}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Buyer steps */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
          🇪🇺 {i.tab_buyer}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {i.steps_buyer.map((s, idx) => (
            <div key={idx} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem 1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#EFF6FF', border: '2px solid var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: 2 }}>0{idx + 1}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TLCUEM */}
      <section style={{ background: 'linear-gradient(135deg,#0F172A,#1E3A5F)', borderRadius: 'var(--radius)', padding: 'clamp(1.5rem,4vw,2.5rem)', color: '#fff', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: 'clamp(1.1rem,3vw,1.35rem)', fontWeight: 800, marginBottom: '1.5rem', color: '#5EEAD4' }}>{i.tlcuem_title}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.25rem' }}>
          {i.tlcuem.map((t, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '1.25rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#5EEAD4', marginBottom: 8 }}>{t.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: 6 }}>{t.title}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.65)', lineHeight: 1.6 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '2rem', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '.5rem' }}>{i.cta_title}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '14px' }}>{i.cta_sub}</p>
        <Link to="/registro" className="btn btn-primary" style={{ padding: '12px 28px' }}>{i.cta_btn}</Link>
      </section>
    </div>
  )
}

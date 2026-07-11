import type { Lang } from '../../context/LangContext'

export const homeI18n: Record<Lang, {
  hero_badge: string
  hero_h1a: string; hero_h1b: string; hero_h1c: string; hero_h1d: string; hero_h1e: string
  hero_sub: string
  hero_placeholder: string
  hero_hints: string[]
  metrics: { value: string; label: string }[]
  cat_title: string
  categories: { label: string }[]
  trending_title: string; trending_sub: string
  how_title: string; how_sub: string
  steps: { title: string; desc: string }[]
  producers_title: string; producers_sub: string
  cta_title: string; cta_sub: string; cta_btn1: string; cta_btn2: string
}> = {
  es: {
    hero_badge: '✓ Plataforma especializada en el TLCUEM · Acuerdo México–UE',
    hero_h1a: 'Conectamos', hero_h1b: 'México', hero_h1c: 'con', hero_h1d: 'Europa', hero_h1e: 'Sin aranceles. En tiempo real.',
    hero_sub: 'La plataforma B2B que conecta productores mexicanos certificados con compradores europeos aprovechando el acuerdo TLCUEM.',
    hero_placeholder: 'Busca producto o productor (tequila, café, miel...)',
    hero_hints: ['Tequila', 'Café orgánico', 'Miel', 'Mezcal', 'Artesanías'],
    metrics: [
      { value: '0%', label: 'Aranceles TLCUEM' },
      { value: '450M', label: 'Consumidores EU' },
      { value: '28 Ago', label: 'Lanzamiento oficial' },
      { value: '27', label: 'Países compradores' },
    ],
    cat_title: 'Explorar por categoría',
    categories: [
      { label: 'Bebidas espirituosas' },
      { label: 'Agricultura y alimentos' },
      { label: 'Artesanías y textiles' },
      { label: 'Cosméticos naturales' },
      { label: 'Farmacéutico / Herbolaria' },
    ],
    trending_title: '🔥 Productos en tendencia',
    trending_sub: 'Los más solicitados por compradores europeos esta semana',
    how_title: 'Cómo funciona',
    how_sub: 'De productor a comprador europeo en 4 pasos',
    steps: [
      { title: 'Regístrate gratis', desc: 'Crea tu perfil como productor mexicano o comprador europeo en menos de 5 minutos.' },
      { title: 'Explora el catálogo', desc: 'Navega el catálogo de los primeros productores verificados. Filtra por categoría, certificación y región.' },
      { title: 'Conecta directamente', desc: 'Mensajería multilingüe integrada. Sin intermediarios, sin comisiones ocultas.' },
      { title: 'Exporta sin fricción', desc: 'Prepara tu documentación TLCUEM con nuestras herramientas y conecta con el transporte ideal.' },
    ],
    producers_title: 'Productores verificados',
    producers_sub: 'Empresas con certificaciones validadas y historial de exportación',
    cta_title: '¿Eres productor mexicano?',
    cta_sub: 'Publica tus productos y conecta con compradores en 27 países europeos. Sin comisiones por transacción. Sin intermediarios.',
    cta_btn1: 'Publicar mis productos gratis',
    cta_btn2: 'Ver cómo funciona',
  },

  en: {
    hero_badge: '✓ TLCUEM-Specialized Platform · Mexico–EU Trade Agreement',
    hero_h1a: 'Connecting', hero_h1b: 'Mexico', hero_h1c: 'with', hero_h1d: 'Europe', hero_h1e: 'Zero tariffs. Real time.',
    hero_sub: 'The B2B platform connecting certified Mexican producers with European buyers through the TLCUEM free trade agreement.',
    hero_placeholder: 'Search product or producer (tequila, coffee, honey...)',
    hero_hints: ['Tequila', 'Organic coffee', 'Honey', 'Mezcal', 'Handicrafts'],
    metrics: [
      { value: '0%', label: 'TLCUEM Tariffs' },
      { value: '450M', label: 'EU Consumers' },
      { value: 'Aug 28', label: 'Official launch' },
      { value: '27', label: 'Buyer countries' },
    ],
    cat_title: 'Explore by category',
    categories: [
      { label: 'Spirits & Beverages' },
      { label: 'Agriculture & Food' },
      { label: 'Crafts & Textiles' },
      { label: 'Natural Cosmetics' },
      { label: 'Pharmaceutical / Herbalism' },
    ],
    trending_title: '🔥 Trending products',
    trending_sub: 'Most requested by European buyers this week',
    how_title: 'How it works',
    how_sub: 'From Mexican producer to European buyer in 4 steps',
    steps: [
      { title: 'Sign up for free', desc: 'Create your profile as a Mexican producer or European buyer in less than 5 minutes.' },
      { title: 'Explore the catalog', desc: 'Browse founding verified producers. Filter by category, certification and region.' },
      { title: 'Connect directly', desc: 'Integrated multilingual messaging. No intermediaries, no hidden fees.' },
      { title: 'Export without friction', desc: 'Prepare your TLCUEM documentation with our tools and connect with the ideal transport.' },
    ],
    producers_title: 'Verified producers',
    producers_sub: 'Companies with validated certifications and export track record',
    cta_title: 'Are you a Mexican producer?',
    cta_sub: 'List your products and connect with buyers in 27 European countries. No transaction fees. No intermediaries.',
    cta_btn1: 'List my products for free',
    cta_btn2: 'See how it works',
  },

  nl: {
    hero_badge: '✓ TLCUEM-Gespecialiseerd Platform · Mexico–EU Handelsakkoord',
    hero_h1a: 'Verbindt', hero_h1b: 'Mexico', hero_h1c: 'met', hero_h1d: 'Europa', hero_h1e: 'Nul tarieven. Real time.',
    hero_sub: 'Het B2B-platform dat gecertificeerde Mexicaanse producenten verbindt met Europese kopers via het TLCUEM-vrijhandelsakkoord.',
    hero_placeholder: 'Zoek product of producent (tequila, koffie, honing...)',
    hero_hints: ['Tequila', 'Biologische koffie', 'Honing', 'Mezcal', 'Ambachten'],
    metrics: [
      { value: '0%', label: 'TLCUEM Tarieven' },
      { value: '450M', label: 'EU Consumenten' },
      { value: '28 aug', label: 'Officiële lancering' },
      { value: '27', label: 'Kopende landen' },
    ],
    cat_title: 'Verkennen per categorie',
    categories: [
      { label: 'Dranken & Spiritualiën' },
      { label: 'Landbouw & Voeding' },
      { label: 'Ambachten & Textiel' },
      { label: 'Natuurlijke Cosmetica' },
      { label: 'Farmaceutisch / Kruidengeneeskunde' },
    ],
    trending_title: '🔥 Trending producten',
    trending_sub: 'Meest gevraagd door Europese kopers deze week',
    how_title: 'Hoe het werkt',
    how_sub: 'Van Mexicaanse producent naar Europese koper in 4 stappen',
    steps: [
      { title: 'Gratis registreren', desc: 'Maak uw profiel als Mexicaanse producent of Europese koper in minder dan 5 minuten.' },
      { title: 'Verken de catalogus', desc: 'Blader door de eerste geverifieerde producenten. Filter op categorie, certificering en regio.' },
      { title: 'Direct verbinden', desc: 'Geïntegreerde meertalige berichten. Geen tussenpersonen, geen verborgen kosten.' },
      { title: 'Exporteren zonder moeite', desc: 'Bereid uw TLCUEM-documentatie voor met onze tools en verbind met het ideale transport.' },
    ],
    producers_title: 'Geverifieerde producenten',
    producers_sub: 'Bedrijven met gevalideerde certificeringen en exportervaring',
    cta_title: 'Bent u een Mexicaanse producent?',
    cta_sub: 'Publiceer uw producten en verbind met kopers in 27 Europese landen. Geen transactiekosten. Geen tussenpersonen.',
    cta_btn1: 'Mijn producten gratis publiceren',
    cta_btn2: 'Bekijk hoe het werkt',
  },

  de: {
    hero_badge: '✓ TLCUEM-Spezialisierte Plattform · Mexiko–EU Handelsabkommen',
    hero_h1a: 'Verbindet', hero_h1b: 'Mexiko', hero_h1c: 'mit', hero_h1d: 'Europa', hero_h1e: 'Null Zölle. Echtzeit.',
    hero_sub: 'Die B2B-Plattform, die zertifizierte mexikanische Produzenten über das TLCUEM-Freihandelsabkommen mit europäischen Käufern verbindet.',
    hero_placeholder: 'Produkt oder Produzent suchen (Tequila, Kaffee, Honig...)',
    hero_hints: ['Tequila', 'Bio-Kaffee', 'Honig', 'Mezcal', 'Kunsthandwerk'],
    metrics: [
      { value: '0%', label: 'TLCUEM-Zölle' },
      { value: '450M', label: 'EU-Verbraucher' },
      { value: '28 Aug', label: 'Offizieller Start' },
      { value: '27', label: 'Käuferländer' },
    ],
    cat_title: 'Nach Kategorie erkunden',
    categories: [
      { label: 'Spirituosen & Getränke' },
      { label: 'Landwirtschaft & Lebensmittel' },
      { label: 'Kunsthandwerk & Textilien' },
      { label: 'Naturkosmetik' },
      { label: 'Pharmazeutisch / Kräuterheilkunde' },
    ],
    trending_title: '🔥 Trendprodukte',
    trending_sub: 'Diese Woche am meisten von europäischen Käufern angefragt',
    how_title: 'So funktioniert es',
    how_sub: 'Vom mexikanischen Produzenten zum europäischen Käufer in 4 Schritten',
    steps: [
      { title: 'Kostenlos registrieren', desc: 'Erstellen Sie Ihr Profil als mexikanischer Produzent oder europäischer Käufer in weniger als 5 Minuten.' },
      { title: 'Katalog erkunden', desc: 'Entdecken Sie die ersten verifizierten Produzenten. Filtern Sie nach Kategorie, Zertifizierung und Region.' },
      { title: 'Direkt verbinden', desc: 'Integriertes mehrsprachiges Messaging. Keine Zwischenhändler, keine versteckten Gebühren.' },
      { title: 'Ohne Aufwand exportieren', desc: 'Bereiten Sie Ihre TLCUEM-Dokumentation mit unseren Tools vor und verbinden Sie sich mit dem idealen Transport.' },
    ],
    producers_title: 'Verifizierte Produzenten',
    producers_sub: 'Unternehmen mit validierten Zertifizierungen und Exporterfahrung',
    cta_title: 'Sind Sie ein mexikanischer Produzent?',
    cta_sub: 'Veröffentlichen Sie Ihre Produkte und verbinden Sie sich mit Käufern in 27 europäischen Ländern. Keine Transaktionsgebühren. Keine Zwischenhändler.',
    cta_btn1: 'Meine Produkte kostenlos listen',
    cta_btn2: 'Wie es funktioniert',
  },
}

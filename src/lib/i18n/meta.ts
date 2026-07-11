import type { Lang } from '../../context/LangContext'

export const pageMeta: Record<string, Record<Lang, { title: string; description: string; keywords: string }>> = {
  '/': {
    es: {
      title: 'Global Nexus — Plataforma B2B México–Europa TLCUEM | 0% Aranceles',
      description: 'Conecta productores mexicanos con compradores europeos. Exporta tequila, café, artesanías y más con 0% aranceles bajo el Acuerdo TLCUEM. Regístrate gratis.',
      keywords: 'exportar mexico europa, TLCUEM, tequila exportacion, cafe organico mexico, plataforma B2B mexico, importar productos mexicanos, mezcal europa',
    },
    en: {
      title: 'Global Nexus — Mexico–Europe B2B Platform TLCUEM | 0% Tariffs',
      description: 'Connect Mexican producers with European buyers. Export tequila, coffee, crafts and more with 0% tariffs under the TLCUEM Free Trade Agreement. Sign up free.',
      keywords: 'import mexican products, TLCUEM free trade, tequila europe, organic coffee mexico, B2B platform mexico europe, mezcal import, mexican suppliers',
    },
    nl: {
      title: 'Global Nexus — Mexico–Europa B2B Platform TLCUEM | 0% Tarieven',
      description: 'Verbind Mexicaanse producenten met Europese kopers. Exporteer tequila, koffie, ambachten en meer met 0% tarieven onder het TLCUEM-vrijhandelsakkoord. Gratis registreren.',
      keywords: 'mexicaanse producten importeren, TLCUEM vrijhandel, tequila importeren nederland, biologische koffie mexico, B2B platform mexico, mezcal nederland',
    },
    de: {
      title: 'Global Nexus — Mexiko–Europa B2B Plattform TLCUEM | 0% Zölle',
      description: 'Verbinden Sie mexikanische Produzenten mit europäischen Käufern. Exportieren Sie Tequila, Kaffee, Kunsthandwerk und mehr mit 0% Zöllen unter dem TLCUEM-Freihandelsabkommen.',
      keywords: 'mexikanische produkte importieren, TLCUEM freihandel, tequila importieren deutschland, bio kaffee mexiko, B2B plattform mexiko europa, mezcal deutschland',
    },
  },
  '/catalogo': {
    es: { title: 'Catálogo de Productos Mexicanos para Europa — Global Nexus', description: 'Explora productos mexicanos certificados de los primeros productores verificados: tequila, café orgánico, artesanías, cosméticos y más. Exportación con 0% aranceles TLCUEM a 27 países europeos.', keywords: 'productos mexicanos exportacion, catalogo exportacion mexico, tequila mayoreo, cafe organico chiapas, artesanias mexicanas europa' },
    en: { title: 'Mexican Products Catalog for Europe — Global Nexus', description: 'Explore certified Mexican products from our founding verified producers: tequila, organic coffee, crafts, cosmetics and more. Export with 0% TLCUEM tariffs to 27 European countries.', keywords: 'mexican products export, mexican suppliers europe, tequila wholesale, organic coffee chiapas, mexican handicrafts europe' },
    nl: { title: 'Mexicaanse Producten Catalogus voor Europa — Global Nexus', description: 'Verken gecertificeerde Mexicaanse producten van de eerste geverifieerde producenten: tequila, biologische koffie, ambachten en meer. Export met 0% TLCUEM-tarieven naar 27 Europese landen.', keywords: 'mexicaanse producten export, mexicaanse leveranciers europa, tequila groothandel, biologische koffie chiapas' },
    de: { title: 'Mexikanische Produkte Katalog für Europa — Global Nexus', description: 'Entdecken Sie zertifizierte mexikanische Produkte der ersten verifizierten Produzenten: Tequila, Bio-Kaffee, Kunsthandwerk und mehr. Export mit 0% TLCUEM-Zöllen in 27 europäische Länder.', keywords: 'mexikanische produkte exportieren, mexikanische lieferanten europa, tequila großhandel, bio kaffee chiapas' },
  },
  '/precios': {
    es: { title: 'Planes y Precios — Global Nexus B2B México–Europa', description: 'Plan Explorador gratis, Pro Exportador desde $59/mes, Comprador EU desde $149/mes. Sin comisiones por venta. Precio de lanzamiento con 40% de descuento.', keywords: 'precios plataforma exportacion, suscripcion B2B mexico europa, plan exportador mexico, importar mexico precio' },
    en: { title: 'Plans & Pricing — Global Nexus B2B Mexico–Europe', description: 'Explorer plan free, Pro Exporter from $59/month, EU Buyer from $149/month. No sales commissions. Launch pricing with 40% discount.', keywords: 'B2B platform pricing mexico europe, export platform subscription, import mexico pricing' },
    nl: { title: 'Plannen & Prijzen — Global Nexus B2B Mexico–Europa', description: 'Verkennerplan gratis, Pro Exporteur vanaf $59/maand, EU Koper vanaf $149/maand. Geen verkoopcommissies. Lanceerprijs met 40% korting.', keywords: 'B2B platform prijzen mexico europa, exportplatform abonnement' },
    de: { title: 'Pläne & Preise — Global Nexus B2B Mexiko–Europa', description: 'Entdecker-Plan kostenlos, Pro Exporteur ab $59/Monat, EU-Käufer ab $149/Monat. Keine Verkaufsprovisionen. Einführungspreis mit 40% Rabatt.', keywords: 'B2B Plattform Preise Mexiko Europa, Exportplattform Abonnement' },
  },
  '/productores': {
    es: { title: 'Productores Mexicanos Certificados para Exportar a Europa — Global Nexus', description: 'Sé parte de los primeros productores mexicanos verificados listos para conectar con compradores europeos: tequileros, cafetaleros, artesanos y más. Exporta con 0% aranceles TLCUEM.', keywords: 'productores mexicanos exportacion, proveedores mexico europa, tequileros jalisco, cafetaleros chiapas, artesanos oaxaca' },
    en: { title: 'Certified Mexican Producers for Export to Europe — Global Nexus', description: 'Join our founding verified Mexican producers ready to connect with European buyers: tequila makers, coffee growers, artisans and more. Export with 0% TLCUEM tariffs.', keywords: 'mexican producers export, mexican suppliers europe, tequila producers jalisco, coffee growers chiapas, oaxaca artisans' },
    nl: { title: 'Gecertificeerde Mexicaanse Producenten voor Export naar Europa — Global Nexus', description: 'Maak deel uit van de eerste geverifieerde Mexicaanse producenten klaar om te verbinden met Europese kopers: tequilamakers, koffieboeren, ambachtslieden en meer.', keywords: 'mexicaanse producenten export, mexicaanse leveranciers europa, tequila producenten jalisco' },
    de: { title: 'Zertifizierte Mexikanische Produzenten für Export nach Europa — Global Nexus', description: 'Werden Sie Teil der ersten verifizierten mexikanischen Produzenten, die bereit sind, europäische Käufer zu verbinden: Tequila-Hersteller, Kaffeebauern, Handwerker und mehr.', keywords: 'mexikanische produzenten export, mexikanische lieferanten europa, tequila hersteller jalisco' },
  },
  '/registro': {
    es: { title: 'Crear Cuenta Gratis — Global Nexus B2B México–Europa', description: 'Regístrate gratis como productor mexicano o comprador europeo. Sé parte del lanzamiento oficial el 28 de agosto de 2026 y conecta directamente sin intermediarios.', keywords: 'registrarse plataforma exportacion, cuenta productor mexico, cuenta comprador europa' },
    en: { title: 'Create Free Account — Global Nexus B2B Mexico–Europe', description: 'Sign up free as a Mexican producer or European buyer. Join our founding members launching August 28, 2026 and connect directly without intermediaries.', keywords: 'sign up export platform, mexican producer account, european buyer account' },
    nl: { title: 'Gratis Account Aanmaken — Global Nexus B2B Mexico–Europa', description: 'Registreer gratis als Mexicaanse producent of Europese koper. Word lid van onze oprichtende leden die lanceren op 28 augustus 2026.', keywords: 'gratis registreren exportplatform' },
    de: { title: 'Kostenloses Konto Erstellen — Global Nexus B2B Mexiko–Europa', description: 'Registrieren Sie sich kostenlos als mexikanischer Produzent oder europäischer Käufer. Werden Sie Gründungsmitglied mit Launch am 28. August 2026.', keywords: 'kostenlos registrieren exportplattform' },
  },
}

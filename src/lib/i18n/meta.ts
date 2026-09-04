import type { Lang } from '../../context/LangContext'

export const pageMeta: Record<string, Record<Lang, { title: string; description: string; keywords: string }>> = {
  '/': {
    es: {
      title: 'Global Nexus — Plataforma B2B México–Europa | Exporta con 0% Aranceles TLCUEM',
      description: 'La plataforma que conecta productores mexicanos verificados con importadores europeos. Exporta tequila, mezcal, café orgánico, artesanías, cosméticos y más con 0% aranceles bajo el TLCUEM a Países Bajos, Alemania, Bélgica y 27 países de la UE. Regístrate gratis hoy.',
      keywords: 'exportar mexico europa, TLCUEM aranceles cero, plataforma B2B mexico europa, exportar tequila europa, exportar mezcal holanda, cafe organico chiapas exportacion, importar productos mexicanos europa, proveedores mexico europa, acuerdo comercial mexico union europea, exportacion directa sin intermediarios, productos gourmet mexico, artesanias mexicanas exportacion, cosmeticos naturales mexico europa, exportar jalisco, productores mexicanos verificados',
    },
    en: {
      title: 'Global Nexus — Mexico–Europe B2B Platform | Import Mexican Products 0% TLCUEM Tariffs',
      description: 'The platform connecting verified Mexican producers with European importers. Import tequila, mezcal, organic coffee, crafts, cosmetics and more with 0% tariffs under TLCUEM to Netherlands, Germany, Belgium and 27 EU countries. Sign up free today.',
      keywords: 'import mexican products europe, TLCUEM free trade agreement, B2B platform mexico europe, mexican suppliers netherlands, tequila import europe, mezcal import germany, organic coffee mexico export, mexican artisan products, import from mexico EU, mexican gourmet food europe, wholesale mexican products, certified mexican exporters, direct from mexico producers, mexican cosmetics europe, agave products export',
    },
    nl: {
      title: 'Global Nexus — Mexico–Europa B2B Platform | Mexicaanse Producten Importeren 0% TLCUEM',
      description: 'Het platform dat geverifieerde Mexicaanse producenten verbindt met Europese importeurs. Importeer tequila, mezcal, biologische koffie, ambachten en meer met 0% tarieven onder TLCUEM in Nederland, Duitsland, België en 27 EU-landen. Gratis registreren.',
      keywords: 'mexicaanse producten importeren, TLCUEM vrijhandel mexico eu, B2B platform mexico nederland, tequila importeur nederland, mezcal importeren belgie, biologische koffie mexico importeren, mexicaanse leveranciers europa, mexicaans voedsel groothandel, ambachten mexico nederland, agave producten importeren, mexicaanse cosmetica europa, directe import mexico',
    },
    de: {
      title: 'Global Nexus — Mexiko–Europa B2B Plattform | Mexikanische Produkte Importieren 0% TLCUEM',
      description: 'Die Plattform, die verifizierte mexikanische Produzenten mit europäischen Importeuren verbindet. Importieren Sie Tequila, Mezcal, Bio-Kaffee, Kunsthandwerk und mehr mit 0% Zöllen unter TLCUEM nach Deutschland, Österreich, Schweiz und 27 EU-Länder. Kostenlos registrieren.',
      keywords: 'mexikanische produkte importieren, TLCUEM freihandel mexiko eu, B2B plattform mexiko deutschland, tequila importeur deutschland, mezcal importieren österreich, bio kaffee mexiko importieren, mexikanische lieferanten europa, mexikanisches essen großhandel, kunsthandwerk mexiko deutschland, agave produkte importieren, mexikanische kosmetik europa, direktimport mexiko',
    },
  },

  '/catalogo': {
    es: {
      title: 'Catálogo de Exportación: Productos Mexicanos para Europa — Global Nexus',
      description: 'Descubre y compra al por mayor productos mexicanos certificados para exportar a Europa: tequila 100% agave, mezcal artesanal, café de Chiapas y Oaxaca, artesanías, mole, vainilla, cosméticos orgánicos y más. Precios de exportación directa, 0% aranceles TLCUEM. Envío CIF Rotterdam / Hamburgo.',
      keywords: 'catalogo exportacion productos mexicanos, tequila mayoreo exportacion, mezcal artesanal exportacion, cafe organico chiapas mayoreo, artesanias oaxaca exportacion, mole negro oaxaca europa, vainilla mexicana exportacion, cosmeticos naturales mexico, productos gourmet mexicanos mayoreo, chile en polvo exportacion, cacao mexicano exportacion, aguacate hass mexico europa, tequilana weber azul, denominacion origen mexico',
    },
    en: {
      title: 'Mexican Export Product Catalog for Europe — Global Nexus',
      description: 'Discover and buy wholesale certified Mexican products for export to Europe: 100% agave tequila, artisan mezcal, Chiapas and Oaxaca coffee, crafts, mole, vanilla, organic cosmetics and more. Direct export pricing, 0% TLCUEM tariffs. CIF Rotterdam / Hamburg delivery.',
      keywords: 'mexican products wholesale europe, tequila wholesale export, mezcal artisan export, organic coffee chiapas wholesale, oaxaca crafts export, mexican mole europe, mexican vanilla export, natural cosmetics mexico, mexican gourmet food wholesale, chile powder export, mexican cacao export, hass avocado mexico europe, agave products, denomination of origin mexico',
    },
    nl: {
      title: 'Mexicaans Exportproductcatalogus voor Europa — Global Nexus',
      description: 'Ontdek en koop groothandel gecertificeerde Mexicaanse producten voor export naar Europa: 100% agave tequila, ambachtelijke mezcal, koffie uit Chiapas en Oaxaca, ambachten, mole, vanille, biologische cosmetica en meer. Directe exportprijzen, 0% TLCUEM-tarieven.',
      keywords: 'mexicaanse producten groothandel europa, tequila groothandel exporteren, mezcal ambachtelijk exporteren, biologische koffie chiapas groothandel, oaxaca ambachten exporteren, mexicaanse mole europa, mexicaanse vanille exporteren, natuurlijke cosmetica mexico, mexicaans voedsel groothandel',
    },
    de: {
      title: 'Mexikanischer Exportprodukt-Katalog für Europa — Global Nexus',
      description: 'Entdecken und kaufen Sie zertifizierte mexikanische Produkte für den Großhandel: 100% Agave Tequila, handwerklicher Mezcal, Kaffee aus Chiapas und Oaxaca, Kunsthandwerk, Mole, Vanille, Bio-Kosmetik und mehr. Direkte Exportpreise, 0% TLCUEM-Zölle.',
      keywords: 'mexikanische produkte großhandel europa, tequila großhandel exportieren, mezcal handwerklich exportieren, bio kaffee chiapas großhandel, oaxaca kunsthandwerk exportieren, mexikanische mole europa, mexikanische vanille exportieren, naturkosmetik mexiko, mexikanisches essen großhandel',
    },
  },

  '/productores': {
    es: {
      title: 'Productores Mexicanos Exportadores Verificados — Global Nexus',
      description: 'Conoce a los productores mexicanos verificados que exportan directamente a Europa: tequileros de Jalisco, cafetaleros de Chiapas y Oaxaca, artesanos de Oaxaca y Michoacán, cosméticos de Ciudad de México. Certificaciones TLCUEM, SENASICA, NOM, COFEPRIS y Denominación de Origen.',
      keywords: 'productores mexicanos exportacion europa, tequileros jalisco exportacion, cafetaleros chiapas exportacion, artesanos oaxaca exportacion, productores mezcal exportacion, cosmeticos organicos mexico exportacion, exportadores mexico verificados, proveedores mexico europa certificados, productores jalisco jalisco, productores oaxaca, denominacion origen mexico, productores michoacan artesanias, exportacion directa productor comprador',
    },
    en: {
      title: 'Verified Mexican Exporting Producers — Global Nexus',
      description: 'Meet verified Mexican producers exporting directly to Europe: tequila makers from Jalisco, coffee growers from Chiapas and Oaxaca, artisans from Oaxaca and Michoacán, cosmetics from Mexico City. TLCUEM, SENASICA, NOM, COFEPRIS and Denomination of Origin certifications.',
      keywords: 'verified mexican producers europe, tequila producers jalisco, coffee growers chiapas oaxaca, oaxacan artisans export, mezcal producers export, organic cosmetics mexico export, certified mexican exporters, mexican suppliers europe certified, denomination of origin mexico, michoacan artisan producers',
    },
    nl: {
      title: 'Geverifieerde Mexicaanse Exportproducenten — Global Nexus',
      description: 'Maak kennis met geverifieerde Mexicaanse producenten die direct naar Europa exporteren: tequilamakers uit Jalisco, koffieboeren uit Chiapas en Oaxaca, ambachtslieden uit Oaxaca en Michoacán. TLCUEM-, SENASICA-, NOM- en COFEPRIS-certificeringen.',
      keywords: 'geverifieerde mexicaanse producenten europa, tequila producenten jalisco, koffieboeren chiapas oaxaca, oaxacaanse ambachtslieden export, mezcal producenten export, biologische cosmetica mexico export',
    },
    de: {
      title: 'Verifizierte Mexikanische Exportproduzenten — Global Nexus',
      description: 'Lernen Sie verifizierte mexikanische Produzenten kennen, die direkt nach Europa exportieren: Tequila-Hersteller aus Jalisco, Kaffeebauern aus Chiapas und Oaxaca, Handwerker aus Oaxaca und Michoacán. TLCUEM-, SENASICA-, NOM- und COFEPRIS-Zertifizierungen.',
      keywords: 'verifizierte mexikanische produzenten europa, tequila hersteller jalisco, kaffeebauern chiapas oaxaca, oaxacanische handwerker export, mezcal produzenten export, naturkosmetik mexiko export',
    },
  },

  '/compradores': {
    es: {
      title: 'Importadores Europeos — Compra Directamente de México | Global Nexus',
      description: 'Plataforma para importadores europeos que buscan proveedores mexicanos verificados. Accede a precios de exportación directa, RFQs, certificaciones TLCUEM y sin comisiones. Importadores en Países Bajos, Alemania, Bélgica, Francia y toda la UE.',
      keywords: 'importadores europeos productos mexicanos, comprar directamente mexico europa, importar mexico sin intermediarios, importador tequila mezcal europa, broker productos mexicanos, importar cafe organico mexico, proveedor mexicano certificado, acuerdo TLCUEM importadores, plataforma importacion mexico europa',
    },
    en: {
      title: 'European Importers — Buy Directly from Mexico | Global Nexus',
      description: 'Platform for European importers seeking verified Mexican suppliers. Access direct export pricing, RFQs, TLCUEM certifications and no commissions. Importers in Netherlands, Germany, Belgium, France and all EU.',
      keywords: 'european importers mexican products, buy directly mexico europe, import mexico without intermediaries, tequila mezcal importer europe, mexican product broker, import organic coffee mexico, certified mexican supplier, TLCUEM importers, mexico europe import platform',
    },
    nl: {
      title: 'Europese Importeurs — Koop Direct uit Mexico | Global Nexus',
      description: 'Platform voor Europese importeurs die geverifieerde Mexicaanse leveranciers zoeken. Toegang tot directe exportprijzen, RFQs, TLCUEM-certificeringen en geen commissies. Importeurs in Nederland, Duitsland, België, Frankrijk en heel EU.',
      keywords: 'europese importeurs mexicaanse producten, direct kopen mexico europa, mexico importeren zonder tussenpersonen, tequila mezcal importeur nederland, mexicaanse leverancier gecertificeerd',
    },
    de: {
      title: 'Europäische Importeure — Direkt aus Mexiko Kaufen | Global Nexus',
      description: 'Plattform für europäische Importeure, die verifizierte mexikanische Lieferanten suchen. Direkter Exportpreis, RFQs, TLCUEM-Zertifizierungen und keine Provisionen. Importeure in Deutschland, Niederlande, Belgien, Frankreich und EU.',
      keywords: 'europäische importeure mexikanische produkte, direkt kaufen mexiko europa, mexiko importieren ohne zwischenhändler, tequila mezcal importeur deutschland, mexikanischer lieferant zertifiziert',
    },
  },

  '/oportunidades': {
    es: {
      title: 'Oportunidades de Exportación — Precios Especiales de Lotes México–Europa | Global Nexus',
      description: 'Lotes especiales de exportación directa a precios de oportunidad. Tequila, mezcal, café, cosméticos y más con 30–50% de descuento. Stock limitado de productores mexicanos verificados. Entrega CIF Rotterdam y Hamburgo. 0% aranceles TLCUEM.',
      keywords: 'oportunidades exportacion mexico europa, lotes tequila mayoreo precio, mezcal lote especial exportacion, cafe organico chiapas precio mayoreo, ofertas exportacion directa mexico, precio CIF rotterdam mexico, descuento exportacion tequila mezcal, stock limitado exportacion',
    },
    en: {
      title: 'Export Deals — Special Batch Prices Mexico–Europe | Global Nexus',
      description: 'Special direct export batches at deal prices. Tequila, mezcal, coffee, cosmetics and more with 30–50% discount. Limited stock from verified Mexican producers. CIF Rotterdam and Hamburg delivery. 0% TLCUEM tariffs.',
      keywords: 'mexico export deals europe, tequila wholesale batch price, mezcal special batch export, organic coffee chiapas wholesale price, direct export offers mexico, CIF rotterdam mexico price, tequila mezcal export discount, limited stock export',
    },
    nl: {
      title: 'Exportaanbiedingen — Speciale Partijprijzen Mexico–Europa | Global Nexus',
      description: 'Speciale directe exportpartijen tegen aanbiedingsprijzen. Tequila, mezcal, koffie, cosmetica en meer met 30–50% korting. Beperkte voorraad van geverifieerde Mexicaanse producenten. Levering CIF Rotterdam en Hamburg.',
      keywords: 'mexico exportaanbiedingen europa, tequila groothandel partijprijs, mezcal speciale partij export, biologische koffie chiapas groothandelsprijs, directe exportaanbiedingen mexico',
    },
    de: {
      title: 'Export-Deals — Sonderchargenpreise Mexiko–Europa | Global Nexus',
      description: 'Spezielle Direktexport-Chargen zu Sonderpreisen. Tequila, Mezcal, Kaffee, Kosmetik und mehr mit 30–50% Rabatt. Begrenzte Menge von verifizierten mexikanischen Produzenten. Lieferung CIF Rotterdam und Hamburg.',
      keywords: 'mexiko export deals europa, tequila großhandel chargenpreis, mezcal sondercharge export, bio kaffee chiapas großhandelspreis, direktexport angebote mexiko',
    },
  },

  '/precios': {
    es: {
      title: 'Planes y Precios — Global Nexus B2B México–Europa | 32 Días de Prueba',
      description: 'Modo Explorador gratis, Pro Exportador $99/mes, Comprador EU $249/mes. 32 días de prueba gratis con tarjeta. Sin comisiones por venta. Conecta productores mexicanos con importadores de Países Bajos, Alemania, Bélgica y Europa.',
      keywords: 'precios plataforma exportacion mexico europa, suscripcion B2B mexico europa, plan exportador mexico, importar mexico precio, costo exportacion directa, plataforma comercio exterior mexico, herramienta exportacion pymes mexico',
    },
    en: {
      title: 'Plans & Pricing — Global Nexus B2B Mexico–Europe | 32-Day Free Trial',
      description: 'Explorer mode free, Pro Exporter $99/month, EU Buyer $249/month. 32-day free trial with card. No sales commissions. Connect Mexican producers with importers in Netherlands, Germany, Belgium and Europe.',
      keywords: 'B2B platform pricing mexico europe, export platform subscription, import mexico pricing, direct export cost, foreign trade platform mexico, SME export tool mexico europe',
    },
    nl: {
      title: 'Plannen & Prijzen — Global Nexus B2B Mexico–Europa | 32 Dagen Gratis',
      description: 'Verkennerplan gratis, Pro Exporteur $99/maand, EU Koper $249/maand. 32 dagen gratis proefperiode met kaart. Geen verkoopcommissies. Verbind Mexicaanse producenten met importeurs in Nederland, Duitsland, België.',
      keywords: 'B2B platform prijzen mexico europa, exportplatform abonnement, mexico importeren prijs, directe exportkosten, buitenlandse handel platform mexico',
    },
    de: {
      title: 'Pläne & Preise — Global Nexus B2B Mexiko–Europa | 32 Tage Kostenlos',
      description: 'Erkundungsmodus kostenlos, Pro Exporteur $99/Monat, EU-Käufer $249/Monat. 32 Tage kostenlose Testversion mit Karte. Keine Verkaufsprovisionen. Verbinden Sie mexikanische Produzenten mit Importeuren in Deutschland, Österreich, Belgien.',
      keywords: 'B2B Plattform Preise Mexiko Europa, Exportplattform Abonnement, Mexiko importieren Preis, direkter Exportkosten, Außenhandel Plattform Mexiko',
    },
  },

  '/registro': {
    es: {
      title: 'Crear Cuenta Gratis — Global Nexus | Productor Mexicano o Comprador Europeo',
      description: 'Regístrate gratis como productor mexicano exportador o comprador europeo importador. Exporta a Países Bajos, Alemania, Bélgica, Francia y más con 0% aranceles TLCUEM. Acceso inmediato al catálogo y red de contactos B2B.',
      keywords: 'registrarse plataforma exportacion mexico, crear cuenta productor exportador mexico, registro importador europeo, cuenta comprador europa productos mexicanos, exportar jalisco registro, exportar chiapas registro, importar mexico holanda registro',
    },
    en: {
      title: 'Create Free Account — Global Nexus | Mexican Producer or European Buyer',
      description: 'Sign up free as a Mexican exporting producer or European importing buyer. Export to Netherlands, Germany, Belgium, France and more with 0% TLCUEM tariffs. Immediate access to catalog and B2B contact network.',
      keywords: 'sign up export platform mexico, create mexican producer exporter account, european importer registration, european buyer account mexican products, export jalisco register, export chiapas register',
    },
    nl: {
      title: 'Gratis Account Aanmaken — Global Nexus | Mexicaanse Producent of Europese Koper',
      description: 'Registreer gratis als Mexicaanse exportproducent of Europese importkoper. Exporteer naar Nederland, Duitsland, België, Frankrijk en meer met 0% TLCUEM-tarieven.',
      keywords: 'gratis registreren exportplatform mexico, mexicaanse producent exporteur account aanmaken, europese importeur registratie, nederland mexico handel',
    },
    de: {
      title: 'Kostenloses Konto Erstellen — Global Nexus | Mexikanischer Produzent oder Europäischer Käufer',
      description: 'Registrieren Sie sich kostenlos als mexikanischer Exportproduzent oder europäischer Importkäufer. Exportieren Sie nach Deutschland, Österreich, Belgien, Frankreich und mehr mit 0% TLCUEM-Zöllen.',
      keywords: 'kostenlos registrieren exportplattform mexiko, mexikanischer produzent exporteur konto erstellen, europäischer importeur registrierung, deutschland mexiko handel',
    },
  },

  '/como-funciona': {
    es: {
      title: 'Cómo Funciona Global Nexus — Exportar de México a Europa sin Intermediarios',
      description: 'Aprende cómo exportar de México a Europa directamente: regístrate como productor, sube tu catálogo, conecta con compradores europeos verificados y exporta con 0% aranceles TLCUEM. Sin comisiones. Proceso en 3 pasos.',
      keywords: 'como exportar mexico europa, proceso exportacion directa mexico, pasos exportar producto mexicano, guia exportacion TLCUEM, exportacion sin intermediarios mexico, como vender en europa desde mexico, productor mexicano exportar paso a paso',
    },
    en: {
      title: 'How Global Nexus Works — Export from Mexico to Europe Without Intermediaries',
      description: 'Learn how to export from Mexico to Europe directly: register as a producer, upload your catalog, connect with verified European buyers and export with 0% TLCUEM tariffs. No commissions. 3-step process.',
      keywords: 'how to export mexico europe, direct export process mexico, steps export mexican product, TLCUEM export guide, export without intermediaries mexico, how to sell in europe from mexico',
    },
    nl: {
      title: 'Hoe Global Nexus Werkt — Exporteer van Mexico naar Europa Zonder Tussenpersonen',
      description: 'Leer hoe u direct van Mexico naar Europa kunt exporteren: registreer als producent, upload uw catalogus, verbind met geverifieerde Europese kopers en exporteer met 0% TLCUEM-tarieven.',
      keywords: 'hoe exporteren mexico europa, direct export proces mexico, stappen mexicaans product exporteren, TLCUEM export gids, exporteren zonder tussenpersonen mexico',
    },
    de: {
      title: 'Wie Global Nexus Funktioniert — Von Mexiko nach Europa Exportieren Ohne Zwischenhändler',
      description: 'Lernen Sie, wie Sie direkt von Mexiko nach Europa exportieren: Als Produzent registrieren, Katalog hochladen, mit verifizierten europäischen Käufern verbinden und mit 0% TLCUEM-Zöllen exportieren.',
      keywords: 'wie mexiko europa exportieren, direkter export prozess mexiko, schritte mexikanisches produkt exportieren, TLCUEM export leitfaden, exportieren ohne zwischenhändler mexiko',
    },
  },

  '/comunidad': {
    es: {
      title: 'Comunidad Global Nexus — Red B2B México–Europa | Productores y Compradores',
      description: 'Únete a la comunidad de productores mexicanos y compradores europeos. Comparte novedades, oportunidades de exportación, consejos de comercio internacional y conecta directamente con tu mercado.',
      keywords: 'comunidad exportacion mexico europa, red B2B productores compradores, foro exportacion mexico, comunidad comercio internacional, networking mexico europa, productores mexicanos conectar europa',
    },
    en: {
      title: 'Global Nexus Community — B2B Network Mexico–Europe | Producers & Buyers',
      description: 'Join the community of Mexican producers and European buyers. Share news, export opportunities, international trade tips and connect directly with your market.',
      keywords: 'mexico europe export community, B2B producer buyer network, mexico export forum, international trade community, networking mexico europe',
    },
    nl: {
      title: 'Global Nexus Gemeenschap — B2B Netwerk Mexico–Europa | Producenten & Kopers',
      description: 'Sluit u aan bij de gemeenschap van Mexicaanse producenten en Europese kopers. Deel nieuws, exportkansen, tips voor internationale handel.',
      keywords: 'mexico europa export gemeenschap, B2B producent koper netwerk, mexico export forum, internationale handel gemeenschap',
    },
    de: {
      title: 'Global Nexus Gemeinschaft — B2B Netzwerk Mexiko–Europa | Produzenten & Käufer',
      description: 'Treten Sie der Gemeinschaft mexikanischer Produzenten und europäischer Käufer bei. Teilen Sie Neuigkeiten, Exportmöglichkeiten, Tipps zum internationalen Handel.',
      keywords: 'mexiko europa export gemeinschaft, B2B produzent käufer netzwerk, mexiko export forum, internationaler handel gemeinschaft',
    },
  },

  '/asesoria': {
    es: {
      title: 'Asesoría de Exportación México–Europa TLCUEM — Global Nexus',
      description: 'Asesores especializados en exportación México–Europa. Trámites TLCUEM, certificaciones SENASICA, NOM, COFEPRIS, logística CIF, incoterms y regulaciones aduaneras de la UE. Consulta gratuita.',
      keywords: 'asesoria exportacion mexico europa, asesor TLCUEM, tramites exportacion mexico, certificacion senasica exportacion, regulaciones aduana europa mexico, logistica exportacion CIF, incoterms exportacion mexico, asesoria comercio exterior',
    },
    en: {
      title: 'Mexico–Europe TLCUEM Export Consulting — Global Nexus',
      description: 'Specialized consultants for Mexico–Europe export. TLCUEM procedures, SENASICA, NOM, COFEPRIS certifications, CIF logistics, incoterms and EU customs regulations. Free consultation.',
      keywords: 'mexico europe export consulting, TLCUEM advisor, mexico export procedures, senasica certification export, EU customs regulations mexico, CIF export logistics',
    },
    nl: {
      title: 'Mexico–Europa TLCUEM Exportadvies — Global Nexus',
      description: 'Gespecialiseerde adviseurs voor Mexico–Europa export. TLCUEM-procedures, SENASICA-, NOM-, COFEPRIS-certificeringen, CIF-logistiek en EU-douaneregels.',
      keywords: 'mexico europa exportadvies, TLCUEM adviseur, mexico exportprocedures, senasica certificering export, EU douaneregels mexico',
    },
    de: {
      title: 'Mexiko–Europa TLCUEM Exportberatung — Global Nexus',
      description: 'Spezialisierte Berater für Mexiko–Europa Export. TLCUEM-Verfahren, SENASICA-, NOM-, COFEPRIS-Zertifizierungen, CIF-Logistik und EU-Zollvorschriften.',
      keywords: 'mexiko europa exportberatung, TLCUEM berater, mexiko exportverfahren, senasica zertifizierung export, EU zollvorschriften mexiko',
    },
  },

  '/faq': {
    es: {
      title: 'Preguntas Frecuentes — Exportar México Europa TLCUEM | Global Nexus',
      description: 'Respuestas a las preguntas más comunes sobre exportar de México a Europa: aranceles TLCUEM, certificaciones, logística, pagos, regulaciones y cómo usar la plataforma Global Nexus.',
      keywords: 'preguntas frecuentes exportacion mexico europa, FAQ TLCUEM, como exportar mexico preguntas, aranceles exportacion mexico europa, certificaciones exportacion mexico',
    },
    en: {
      title: 'FAQ — Exporting Mexico Europe TLCUEM | Global Nexus',
      description: 'Answers to the most common questions about exporting from Mexico to Europe: TLCUEM tariffs, certifications, logistics, payments, regulations and how to use the Global Nexus platform.',
      keywords: 'FAQ export mexico europe, TLCUEM frequently asked questions, how to export mexico questions, export tariffs mexico europe, export certifications mexico',
    },
    nl: {
      title: 'FAQ — Exporteren Mexico Europa TLCUEM | Global Nexus',
      description: 'Antwoorden op de meest gestelde vragen over exporteren van Mexico naar Europa: TLCUEM-tarieven, certificeringen, logistiek, betalingen en hoe het platform te gebruiken.',
      keywords: 'FAQ exporteren mexico europa, TLCUEM veelgestelde vragen, hoe exporteren mexico vragen, exporttarieven mexico europa',
    },
    de: {
      title: 'FAQ — Exportieren Mexiko Europa TLCUEM | Global Nexus',
      description: 'Antworten auf häufig gestellte Fragen zum Export von Mexiko nach Europa: TLCUEM-Zölle, Zertifizierungen, Logistik, Zahlungen und Plattformnutzung.',
      keywords: 'FAQ exportieren mexiko europa, TLCUEM häufig gestellte fragen, wie exportieren mexiko fragen, exportzölle mexiko europa',
    },
  },
}

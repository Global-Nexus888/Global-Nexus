import type { Lang } from '../../context/LangContext'

export const pricingI18n: Record<Lang, {
  title: string; sub: string
  badge_prelaunch: string
  plans: {
    explorador: { eyebrow: string; name: string; period: string; desc: string; cta: string; features: string[] }
    pro: { eyebrow: string; name: string; period: string; desc: string; cta_pre: string; cta_post: string; features: string[] }
    comprador: { eyebrow: string; name: string; period: string; desc: string; cta_pre: string; cta_post: string; features: string[] }
  }
  table_title: string
  table_feature: string
  guarantee: string; guarantee_sub: string
  faq_title: string
  faqs: { q: string; a: string }[]
}> = {
  es: {
    title: 'Planes y Precios',
    sub: 'Regístrate gratis hoy · Conecta tu tarjeta · Primer cobro el 29 de septiembre de 2026.',
    badge_prelaunch: '🎉 Registro gratis · Sin cobros hasta el 29 de septiembre de 2026',
    plans: {
      explorador: {
        eyebrow: 'MODO EXPLORADOR', name: 'Explorador', period: '· acceso limitado', desc: 'Solo para explorar la plataforma. Sin acceso a publicar, chatear ni aparecer en el catálogo.',
        cta: 'Explorar la plataforma',
        features: ['Ver catálogo de productos', 'Ver perfiles de productores', 'Feed social (solo lectura)', 'Sin chat ni mensajes', 'Sin publicaciones en comunidad', 'No apareces en el catálogo'],
      },
      pro: {
        eyebrow: 'PRO EXPORTADOR', name: 'Pro Exportador', period: 'USD / mes', desc: 'Para productores listos para conquistar Europa.',
        cta_pre: 'Regístrate gratis · Sin cobro hasta 29 Sep', cta_post: 'Suscribirse ahora',
        features: ['Todo lo del plan Explorador', 'Badge ✓ Verificado en tu perfil', 'Productos destacados en catálogo', 'Chat ilimitado con compradores EU', 'Certificaciones TLCUEM incluidas', 'Soporte prioritario 24/7'],
      },
      comprador: {
        eyebrow: 'COMPRADOR EU', name: 'Comprador EU', period: 'USD / mes', desc: 'Para importadores europeos que buscan lo mejor de México.',
        cta_pre: 'Regístrate gratis · Sin cobro hasta 29 Sep', cta_post: 'Suscribirse ahora',
        features: ['Todo lo del plan Explorador', 'Acceso a contactos directos ilimitados', 'RFQ (solicitud de cotización) ilimitados', 'Precios de exportación exclusivos', 'Historial de transacciones', 'Gestor de cuenta dedicado'],
      },
    },
    table_title: 'Comparativa completa de planes',
    table_feature: 'Característica',
    guarantee: '🎉 Regístrate gratis hoy · Sin cobros hasta el 29 de septiembre de 2026',
    guarantee_sub: 'Conecta tu tarjeta ahora, tu primer cobro será el 29 de septiembre. Cancela en cualquier momento.',
    faq_title: 'Preguntas frecuentes sobre precios',
    faqs: [
      { q: '¿Cuándo se hace el primer cobro?', a: 'El primer cobro se realiza el 29 de septiembre de 2026 — un mes después del lanzamiento oficial el 3 de septiembre. Regístrate hoy, arma tu perfil y no pagas nada hasta esa fecha.' },
      { q: '¿Hay comisiones por venta?', a: 'No. Global Nexus cobra solo por suscripción mensual. Las transacciones entre productores y compradores son directas, sin comisiones.' },
      { q: '¿Puedo cambiar de plan?', a: 'Sí. Puedes subir o bajar de plan en cualquier momento desde tu panel. Los cambios aplican al siguiente ciclo de facturación.' },
      { q: '¿El precio de lanzamiento se mantiene?', a: 'Sí. Si te suscribes antes del 3 de septiembre de 2026, el precio preferencial ($59 Pro / $149 Comprador) se congela en tu cuenta para siempre.' },
    ],
  },

  en: {
    title: 'Plans & Pricing',
    sub: 'Register free today · Connect your card · First charge on September 29, 2026.',
    badge_prelaunch: '🎉 Free registration · No charges until September 29, 2026',
    plans: {
      explorador: {
        eyebrow: 'EXPLORER MODE', name: 'Explorer', period: '· limited access', desc: 'Browse only. No posting, no chat, and you will not appear in the catalog.',
        cta: 'Explore the platform',
        features: ['Browse product catalog', 'View producer profiles', 'Social feed (read-only)', 'No chat or messaging', 'No community posts', 'Not listed in catalog'],
      },
      pro: {
        eyebrow: 'PRO EXPORTER', name: 'Pro Exporter', period: 'USD / month', desc: 'For producers ready to conquer Europe.',
        cta_pre: 'Register free · No charge until Sep 29', cta_post: 'Subscribe now',
        features: ['Everything in Explorer', '✓ Verified badge on your profile', 'Featured products in catalog', 'Unlimited chat with EU buyers', 'TLCUEM certifications included', '24/7 priority support'],
      },
      comprador: {
        eyebrow: 'EU BUYER', name: 'EU Buyer', period: 'USD / month', desc: 'For European importers seeking the best of Mexico.',
        cta_pre: 'Register free · No charge until Sep 29', cta_post: 'Subscribe now',
        features: ['Everything in Explorer', 'Unlimited direct contacts', 'Unlimited RFQ (request for quote)', 'Exclusive export pricing', 'Transaction history', 'Dedicated account manager'],
      },
    },
    table_title: 'Full plan comparison',
    table_feature: 'Feature',
    guarantee: '🎉 Register free today · No charges until September 29, 2026',
    guarantee_sub: 'Connect your card now, your first charge will be on September 29. Cancel anytime.',
    faq_title: 'Frequently asked questions about pricing',
    faqs: [
      { q: 'When is the first charge?', a: 'The first charge is on September 29, 2026 — one month after the official launch on September 3. Register today, build your profile and pay nothing until then.' },
      { q: 'Are there sales commissions?', a: 'No. Global Nexus charges only a monthly subscription. Transactions between producers and buyers are direct, commission-free.' },
      { q: 'Can I change my plan?', a: 'Yes. You can upgrade or downgrade at any time from your dashboard. Changes apply to the next billing cycle.' },
      { q: 'Is the launch price permanent?', a: 'Yes. If you subscribe before September 3, 2026, the preferential price ($59 Pro / $149 EU Buyer) is locked into your account forever.' },
    ],
  },

  nl: {
    title: 'Plannen & Prijzen',
    sub: 'Registreer gratis vandaag · Koppel uw kaart · Eerste betaling op 29 september 2026.',
    badge_prelaunch: '🎉 Gratis registratie · Geen kosten tot 29 september 2026',
    plans: {
      explorador: {
        eyebrow: 'VERKENNERSMODUS', name: 'Verkenner', period: '· beperkte toegang', desc: 'Alleen rondkijken. Geen publicaties, geen chat en u verschijnt niet in de catalogus.',
        cta: 'Platform verkennen',
        features: ['Productcatalogus bekijken', 'Producentprofielen bekijken', 'Sociale feed (alleen lezen)', 'Geen chat of berichten', 'Geen communityposts', 'Niet vermeld in catalogus'],
      },
      pro: {
        eyebrow: 'PRO EXPORTEUR', name: 'Pro Exporteur', period: 'USD / maand', desc: 'Voor producenten klaar om Europa te veroveren.',
        cta_pre: 'Gratis registreren · Geen kosten tot 29 sep', cta_post: 'Nu abonneren',
        features: ['Alles in Verkenner', '✓ Geverifieerd badge op uw profiel', 'Uitgelichte producten in catalogus', 'Onbeperkt chatten met EU-kopers', 'TLCUEM-certificeringen inbegrepen', '24/7 prioriteitsondersteuning'],
      },
      comprador: {
        eyebrow: 'EU KOPER', name: 'EU Koper', period: 'USD / maand', desc: 'Voor Europese importeurs op zoek naar het beste van Mexico.',
        cta_pre: 'Gratis registreren · Geen kosten tot 29 sep', cta_post: 'Nu abonneren',
        features: ['Alles in Verkenner', 'Onbeperkte directe contacten', 'Onbeperkte offerteaanvragen (RFQ)', 'Exclusieve exportprijzen', 'Transactiegeschiedenis', 'Toegewijde accountmanager'],
      },
    },
    table_title: 'Volledige planvergelijking',
    table_feature: 'Functie',
    guarantee: '🎉 Gratis registreren vandaag · Geen kosten tot 29 september 2026',
    guarantee_sub: 'Koppel uw kaart nu, uw eerste betaling is op 29 september. Annuleer wanneer u wilt.',
    faq_title: 'Veelgestelde vragen over prijzen',
    faqs: [
      { q: 'Wanneer is de eerste betaling?', a: 'De eerste betaling is op 29 september 2026 — één maand na de officiële lancering op 3 september. Registreer vandaag, bouw uw profiel en betaal niets tot die datum.' },
      { q: 'Zijn er verkoopcommissies?', a: 'Nee. Global Nexus brengt alleen een maandelijks abonnement in rekening. Transacties tussen producenten en kopers zijn direct, zonder commissies.' },
      { q: 'Kan ik van plan wisselen?', a: 'Ja. U kunt op elk moment upgraden of downgraden vanuit uw dashboard. Wijzigingen gelden voor de volgende factureringscyclus.' },
      { q: 'Is de lanceringsprijs permanent?', a: 'Ja. Als u zich abonneert vóór 3 september 2026, wordt de voorkeurskorting ($59 Pro / $149 EU Koper) voor altijd in uw account vergrendeld.' },
    ],
  },

  de: {
    title: 'Pläne & Preise',
    sub: 'Kostenlos registrieren · Karte hinterlegen · Erste Zahlung am 29. September 2026.',
    badge_prelaunch: '🎉 Kostenlose Registrierung · Keine Kosten bis 29. September 2026',
    plans: {
      explorador: {
        eyebrow: 'ERKUNDUNGSMODUS', name: 'Entdecker', period: '· begrenzter Zugang', desc: 'Nur zum Stöbern. Kein Posten, kein Chat, keine Auflistung im Katalog.',
        cta: 'Plattform erkunden',
        features: ['Produktkatalog durchsuchen', 'Produzentenprofile ansehen', 'Social Feed (nur lesen)', 'Kein Chat oder Nachrichten', 'Keine Community-Posts', 'Nicht im Katalog gelistet'],
      },
      pro: {
        eyebrow: 'PRO EXPORTEUR', name: 'Pro Exporteur', period: 'USD / Monat', desc: 'Für Produzenten, die bereit sind, Europa zu erobern.',
        cta_pre: 'Kostenlos registrieren · Keine Kosten bis 29. Sep', cta_post: 'Jetzt abonnieren',
        features: ['Alles im Entdecker-Plan', '✓ Verifiziertes Badge auf Ihrem Profil', 'Hervorgehobene Produkte im Katalog', 'Unbegrenzter Chat mit EU-Käufern', 'TLCUEM-Zertifizierungen inklusive', '24/7 Prioritätssupport'],
      },
      comprador: {
        eyebrow: 'EU-KÄUFER', name: 'EU-Käufer', period: 'USD / Monat', desc: 'Für europäische Importeure, die das Beste aus Mexiko suchen.',
        cta_pre: 'Kostenlos registrieren · Keine Kosten bis 29. Sep', cta_post: 'Jetzt abonnieren',
        features: ['Alles im Entdecker-Plan', 'Unbegrenzte Direktkontakte', 'Unbegrenzte Angebotsanfragen (RFQ)', 'Exklusive Exportpreise', 'Transaktionsverlauf', 'Dedizierter Account-Manager'],
      },
    },
    table_title: 'Vollständiger Planvergleich',
    table_feature: 'Funktion',
    guarantee: '🎉 Kostenlos registrieren · Keine Kosten bis 29. September 2026',
    guarantee_sub: 'Hinterlegen Sie jetzt Ihre Karte, Ihre erste Zahlung erfolgt am 29. September. Jederzeit kündbar.',
    faq_title: 'Häufig gestellte Fragen zu Preisen',
    faqs: [
      { q: 'Wann erfolgt die erste Zahlung?', a: 'Die erste Zahlung erfolgt am 29. September 2026 — einen Monat nach dem offiziellen Launch am 3. September. Registrieren Sie sich heute, erstellen Sie Ihr Profil und zahlen Sie bis dahin nichts.' },
      { q: 'Gibt es Verkaufsprovisionen?', a: 'Nein. Global Nexus berechnet nur ein monatliches Abonnement. Transaktionen zwischen Produzenten und Käufern sind direkt, ohne Provisionen.' },
      { q: 'Kann ich meinen Plan ändern?', a: 'Ja. Sie können jederzeit über Ihr Dashboard upgraden oder downgraden. Änderungen gelten für den nächsten Abrechnungszeitraum.' },
      { q: 'Ist der Einführungspreis dauerhaft?', a: 'Ja. Wenn Sie sich vor dem 3. September 2026 anmelden, wird der Vorzugspreis ($59 Pro / $149 EU-Käufer) für immer in Ihrem Konto gesperrt.' },
    ],
  },
}

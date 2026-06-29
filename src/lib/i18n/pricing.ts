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
    sub: 'Sin comisiones por venta. Sin letra pequeña. Cancela cuando quieras.',
    badge_prelaunch: '🚀 Precio de lanzamiento · 40% de descuento hasta el 28 de agosto de 2026',
    plans: {
      explorador: {
        eyebrow: 'EXPLORADOR', name: 'Explorador', period: '/ mes', desc: 'Para conocer la plataforma antes de comprometer.',
        cta: 'Empezar gratis',
        features: ['Perfil básico (sin badge verificado)', 'Ver catálogo completo', '3 solicitudes de contacto/mes', 'Feed social (solo lectura)', 'Badge verificado', 'Chat ilimitado'],
      },
      pro: {
        eyebrow: 'PRO EXPORTADOR', name: 'Pro Exportador', period: 'USD / mes', desc: 'Para productores listos para conquistar Europa.',
        cta_pre: 'Acceso anticipado · 40% OFF', cta_post: 'Suscribirse ahora',
        features: ['Todo lo del plan Explorador', 'Badge ✓ Verificado en tu perfil', 'Productos destacados en catálogo', 'Chat ilimitado con compradores EU', 'Certificaciones TLCUEM incluidas', 'Soporte prioritario 24/7'],
      },
      comprador: {
        eyebrow: 'COMPRADOR EU', name: 'Comprador EU', period: 'USD / mes', desc: 'Para importadores europeos que buscan lo mejor de México.',
        cta_pre: 'Acceso anticipado · 40% OFF', cta_post: 'Suscribirse ahora',
        features: ['Todo lo del plan Explorador', 'Acceso a contactos directos ilimitados', 'RFQ (solicitud de cotización) ilimitados', 'Precios de exportación exclusivos', 'Historial de transacciones', 'Gestor de cuenta dedicado'],
      },
    },
    table_title: 'Comparativa completa de planes',
    table_feature: 'Característica',
    guarantee: '💳 Pago 100% seguro via Stripe · Sin riesgo',
    guarantee_sub: 'Reembolso completo en 7 días si no estás satisfecho. Cancela en cualquier momento.',
    faq_title: 'Preguntas frecuentes sobre precios',
    faqs: [
      { q: '¿Hay comisiones por venta?', a: 'No. Global Nexus cobra solo por suscripción mensual. Las transacciones entre productores y compradores son directas, sin comisiones.' },
      { q: '¿Puedo cambiar de plan?', a: 'Sí. Puedes subir o bajar de plan en cualquier momento desde tu panel. Los cambios aplican al siguiente ciclo de facturación.' },
      { q: '¿Qué pasa después del 28 de agosto de 2026?', a: 'Los precios vuelven a $99 USD (Pro) y $249 USD (Comprador EU). Los que se suscriban antes conservan su precio de por vida.' },
      { q: '¿El precio de lanzamiento se mantiene?', a: 'Sí. Si te suscribes antes del 28 de agosto de 2026, el precio preferencial se congela en tu cuenta para siempre.' },
    ],
  },

  en: {
    title: 'Plans & Pricing',
    sub: 'No sales commissions. No fine print. Cancel anytime.',
    badge_prelaunch: '🚀 Launch pricing · 40% off until August 28, 2026',
    plans: {
      explorador: {
        eyebrow: 'EXPLORER', name: 'Explorer', period: '/ month', desc: 'To discover the platform before committing.',
        cta: 'Start for free',
        features: ['Basic profile (no verified badge)', 'Full catalog access', '3 contact requests/month', 'Social feed (read-only)', 'Verified badge', 'Unlimited chat'],
      },
      pro: {
        eyebrow: 'PRO EXPORTER', name: 'Pro Exporter', period: 'USD / month', desc: 'For producers ready to conquer Europe.',
        cta_pre: 'Early access · 40% OFF', cta_post: 'Subscribe now',
        features: ['Everything in Explorer', '✓ Verified badge on your profile', 'Featured products in catalog', 'Unlimited chat with EU buyers', 'TLCUEM certifications included', '24/7 priority support'],
      },
      comprador: {
        eyebrow: 'EU BUYER', name: 'EU Buyer', period: 'USD / month', desc: 'For European importers seeking the best of Mexico.',
        cta_pre: 'Early access · 40% OFF', cta_post: 'Subscribe now',
        features: ['Everything in Explorer', 'Unlimited direct contacts', 'Unlimited RFQ (request for quote)', 'Exclusive export pricing', 'Transaction history', 'Dedicated account manager'],
      },
    },
    table_title: 'Full plan comparison',
    table_feature: 'Feature',
    guarantee: '💳 100% secure payment via Stripe · Risk free',
    guarantee_sub: 'Full refund within 7 days if not satisfied. Cancel anytime.',
    faq_title: 'Frequently asked questions about pricing',
    faqs: [
      { q: 'Are there sales commissions?', a: 'No. Global Nexus charges only a monthly subscription. Transactions between producers and buyers are direct, commission-free.' },
      { q: 'Can I change my plan?', a: 'Yes. You can upgrade or downgrade at any time from your dashboard. Changes apply to the next billing cycle.' },
      { q: 'What happens after August 28, 2026?', a: 'Prices return to $99 USD (Pro) and $249 USD (EU Buyer). Those who subscribe before keep their price forever.' },
      { q: 'Is the launch price permanent?', a: 'Yes. If you subscribe before August 28, 2026, the preferential price is locked into your account forever.' },
    ],
  },

  nl: {
    title: 'Plannen & Prijzen',
    sub: 'Geen verkoopcommissies. Geen kleine lettertjes. Annuleer wanneer u wilt.',
    badge_prelaunch: '🚀 Lanceringsprijs · 40% korting tot 28 augustus 2026',
    plans: {
      explorador: {
        eyebrow: 'VERKENNER', name: 'Verkenner', period: '/ maand', desc: 'Om het platform te ontdekken voordat u zich verbindt.',
        cta: 'Gratis beginnen',
        features: ['Basisprofiel (geen geverifieerd badge)', 'Volledige catalogustoegang', '3 contactverzoeken/maand', 'Sociale feed (alleen lezen)', 'Geverifieerd badge', 'Onbeperkt chatten'],
      },
      pro: {
        eyebrow: 'PRO EXPORTEUR', name: 'Pro Exporteur', period: 'USD / maand', desc: 'Voor producenten klaar om Europa te veroveren.',
        cta_pre: 'Vroege toegang · 40% KORTING', cta_post: 'Nu abonneren',
        features: ['Alles in Verkenner', '✓ Geverifieerd badge op uw profiel', 'Uitgelichte producten in catalogus', 'Onbeperkt chatten met EU-kopers', 'TLCUEM-certificeringen inbegrepen', '24/7 prioriteitsondersteuning'],
      },
      comprador: {
        eyebrow: 'EU KOPER', name: 'EU Koper', period: 'USD / maand', desc: 'Voor Europese importeurs op zoek naar het beste van Mexico.',
        cta_pre: 'Vroege toegang · 40% KORTING', cta_post: 'Nu abonneren',
        features: ['Alles in Verkenner', 'Onbeperkte directe contacten', 'Onbeperkte offerteaanvragen (RFQ)', 'Exclusieve exportprijzen', 'Transactiegeschiedenis', 'Toegewijde accountmanager'],
      },
    },
    table_title: 'Volledige planvergelijking',
    table_feature: 'Functie',
    guarantee: '💳 100% veilige betaling via Stripe · Zonder risico',
    guarantee_sub: 'Volledige terugbetaling binnen 7 dagen als u niet tevreden bent. Annuleer wanneer u wilt.',
    faq_title: 'Veelgestelde vragen over prijzen',
    faqs: [
      { q: 'Zijn er verkoopcommissies?', a: 'Nee. Global Nexus brengt alleen een maandelijks abonnement in rekening. Transacties tussen producenten en kopers zijn direct, zonder commissies.' },
      { q: 'Kan ik van plan wisselen?', a: 'Ja. U kunt op elk moment upgraden of downgraden vanuit uw dashboard. Wijzigingen gelden voor de volgende factureringscyclus.' },
      { q: 'Wat gebeurt er na 28 augustus 2026?', a: 'Prijzen keren terug naar $99 USD (Pro) en $249 USD (EU Koper). Wie zich eerder abonneert, behoudt zijn prijs voor altijd.' },
      { q: 'Is de lanceringsprijs permanent?', a: 'Ja. Als u zich abonneert vóór 28 augustus 2026, wordt de voorkeurskorting voor altijd in uw account vergrendeld.' },
    ],
  },

  de: {
    title: 'Pläne & Preise',
    sub: 'Keine Verkaufsprovisionen. Kein Kleingedrucktes. Jederzeit kündbar.',
    badge_prelaunch: '🚀 Einführungspreis · 40% Rabatt bis 28. August 2026',
    plans: {
      explorador: {
        eyebrow: 'ENTDECKER', name: 'Entdecker', period: '/ Monat', desc: 'Um die Plattform zu erkunden, bevor Sie sich festlegen.',
        cta: 'Kostenlos starten',
        features: ['Basisprofil (kein verifiziertes Badge)', 'Vollständiger Katalogzugang', '3 Kontaktanfragen/Monat', 'Social Feed (nur lesen)', 'Verifiziertes Badge', 'Unbegrenzter Chat'],
      },
      pro: {
        eyebrow: 'PRO EXPORTEUR', name: 'Pro Exporteur', period: 'USD / Monat', desc: 'Für Produzenten, die bereit sind, Europa zu erobern.',
        cta_pre: 'Früher Zugang · 40% RABATT', cta_post: 'Jetzt abonnieren',
        features: ['Alles im Entdecker-Plan', '✓ Verifiziertes Badge auf Ihrem Profil', 'Hervorgehobene Produkte im Katalog', 'Unbegrenzter Chat mit EU-Käufern', 'TLCUEM-Zertifizierungen inklusive', '24/7 Prioritätssupport'],
      },
      comprador: {
        eyebrow: 'EU-KÄUFER', name: 'EU-Käufer', period: 'USD / Monat', desc: 'Für europäische Importeure, die das Beste aus Mexiko suchen.',
        cta_pre: 'Früher Zugang · 40% RABATT', cta_post: 'Jetzt abonnieren',
        features: ['Alles im Entdecker-Plan', 'Unbegrenzte Direktkontakte', 'Unbegrenzte Angebotsanfragen (RFQ)', 'Exklusive Exportpreise', 'Transaktionsverlauf', 'Dedizierter Account-Manager'],
      },
    },
    table_title: 'Vollständiger Planvergleich',
    table_feature: 'Funktion',
    guarantee: '💳 100% sichere Zahlung über Stripe · Risikolos',
    guarantee_sub: 'Vollständige Rückerstattung innerhalb von 7 Tagen bei Unzufriedenheit. Jederzeit kündbar.',
    faq_title: 'Häufig gestellte Fragen zu Preisen',
    faqs: [
      { q: 'Gibt es Verkaufsprovisionen?', a: 'Nein. Global Nexus berechnet nur ein monatliches Abonnement. Transaktionen zwischen Produzenten und Käufern sind direkt, ohne Provisionen.' },
      { q: 'Kann ich meinen Plan ändern?', a: 'Ja. Sie können jederzeit über Ihr Dashboard upgraden oder downgraden. Änderungen gelten für den nächsten Abrechnungszeitraum.' },
      { q: 'Was passiert nach dem 28. August 2026?', a: 'Die Preise kehren auf $99 USD (Pro) und $249 USD (EU-Käufer) zurück. Wer sich vorher anmeldet, behält seinen Preis für immer.' },
      { q: 'Ist der Einführungspreis dauerhaft?', a: 'Ja. Wenn Sie sich vor dem 28. August 2026 anmelden, wird der Vorzugspreis für immer in Ihrem Konto gesperrt.' },
    ],
  },
}

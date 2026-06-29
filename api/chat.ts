const SYSTEM_PROMPT = `You are the Global Nexus AI Assistant — expert in the Mexico-EU B2B platform nexusstrategy.online and the TLCUEM free trade agreement between Mexico and the European Union.

Key facts:
- Global Nexus connects certified Mexican producers with European buyers
- TLCUEM = 0% tariff on most Mexican exports to 27 EU countries, 450M consumers
- Key Mexican exports: tequila, mezcal, coffee, honey, avocado, crafts, cosmetics
- Certifications needed: NOM, SENASICA, COFEPRIS, Denominación de Origen, ISO 22000, HACCP, BRC, Organic
- Certificate of origin: EUR.1 or REX declaration
- Platform launch: August 28, 2026 at 12pm CDMX
- Plans: Pro Exportador $59/mo, Comprador EU $149/mo
- Support: soporte@nexusstrategy.online

Deal process: Buyer finds producer → Contact request → Chat opens → Negotiate → Documents → Samples → RFQ → Agreement → Logistics → EUR.1 certificate → Shipment → Closed deal

Always reply in the SAME language the user writes in. Be concise, helpful, and professional.`

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

  try {
    const messages = req.body?.messages || []

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 800,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-10),
      }),
    })

    const data: any = await response.json()

    if (!response.ok) {
      throw new Error(data?.error?.message || `Anthropic HTTP ${response.status}`)
    }

    return res.status(200).json({ text: data.content?.[0]?.text || '' })
  } catch (err: any) {
    console.error('[api/chat]', err?.message)
    return res.status(500).json({ error: err?.message || 'Unknown error' })
  }
}

import { useState, useRef, useEffect } from 'react'
import type { Lang } from '../context/LangContext'

interface ChatMessage { role: 'user' | 'assistant'; content: string }

const WELCOME: Record<Lang, string> = {
  es: '👋 Hola, soy el asistente IA de **Global Nexus**. Conozco todo sobre el TLCUEM, certificaciones de exportación, cómo usar la plataforma y consejos para conectar con compradores europeos. ¿En qué puedo ayudarte?',
  en: '👋 Hi, I\'m the **Global Nexus** AI assistant. I know everything about TLCUEM, export certifications, how to use the platform and tips for connecting with European buyers. How can I help you?',
  nl: '👋 Hallo, ik ben de AI-assistent van **Global Nexus**. Ik weet alles over TLCUEM, exportcertificeringen, hoe u het platform gebruikt en tips voor verbinding met Europese kopers. Waarmee kan ik u helpen?',
  de: '👋 Hallo, ich bin der KI-Assistent von **Global Nexus**. Ich kenne alles über TLCUEM, Exportzertifizierungen, die Plattformnutzung und Tipps zur Verbindung mit europäischen Käufern. Wie kann ich Ihnen helfen?',
}

const PLACEHOLDER: Record<Lang, string> = {
  es: '¿Qué certificaciones necesito para exportar a Alemania?',
  en: 'What certifications do I need to export to Germany?',
  nl: 'Welke certificeringen heb ik nodig om naar Duitsland te exporteren?',
  de: 'Welche Zertifizierungen brauche ich für den Export nach Deutschland?',
}

const SEND_LABEL: Record<Lang, string> = { es: 'Enviar', en: 'Send', nl: 'Verzenden', de: 'Senden' }

const QUICK: Record<Lang, string[]> = {
  es: ['¿Qué es el TLCUEM?', '¿Qué certificaciones necesito?', '¿Cómo funciona el chat con compradores?', '¿Cuándo se activa mi perfil?', 'Tips para exportar tequila'],
  en: ['What is TLCUEM?', 'What certifications do I need?', 'How does the chat with buyers work?', 'When does my profile activate?', 'Tips for exporting tequila'],
  nl: ['Wat is TLCUEM?', 'Welke certificeringen heb ik nodig?', 'Hoe werkt de chat met kopers?', 'Wanneer wordt mijn profiel actief?', 'Tips voor tequila-export'],
  de: ['Was ist TLCUEM?', 'Welche Zertifizierungen brauche ich?', 'Wie funktioniert der Chat mit Käufern?', 'Wann wird mein Profil aktiv?', 'Tipps für Tequila-Export'],
}

const SYSTEM_PROMPT = `You are the Global Nexus AI Assistant — expert in the Mexico-EU B2B platform nexusstrategy.online and the TLCUEM free trade agreement.
Key facts: 0% tariff on Mexican exports to 27 EU countries, 450M consumers. Key exports: tequila, mezcal, coffee, honey, avocado, crafts, cosmetics. Certifications: NOM, SENASICA, COFEPRIS, Denominación de Origen, ISO 22000, HACCP, BRC, Organic. Certificate of origin: EUR.1 or REX. Platform launch: August 28 2026. Plans: Pro Exportador $59/mo, Comprador EU $149/mo. Deal flow: Buyer finds producer → contact → chat → negotiate → documents → samples → RFQ → agreement → logistics → shipment → closed.
Always reply in the SAME language the user writes in. Be concise, helpful, and professional.`

const C = { navy: '#1E3A5F', teal: '#0D9488', border: '#E2E8F0', bg: '#F8FAFC', white: '#FFFFFF', text: '#0F172A', muted: '#64748B', green: '#16A34A' }

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '• $1')
    .replace(/\n/g, '<br />')
}

export default function AIChat({ lang, role = 'producer', height = 520 }: { lang: Lang; role?: 'producer' | 'buyer'; height?: number }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const welcome = WELCOME[lang]

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const sendMessage = async (text?: string) => {
    const content = (text || input).trim()
    if (!content || loading) return
    setInput('')
    setError('')

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string
      if (!apiKey) throw new Error('__no_key__')

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 800,
          system: SYSTEM_PROMPT,
          messages: newMessages.slice(-10),
        }),
      })

      const data = await res.json() as { content?: { text: string }[]; error?: { message: string } }

      if (!res.ok || data.error) throw new Error(data.error?.message || `HTTP ${res.status}`)

      setMessages([...newMessages, { role: 'assistant', content: data.content?.[0]?.text || '' }])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error'
      const noKey = msg === '__no_key__'
      setError(
        noKey
          ? (lang === 'es' ? '⚙️ El asistente IA no está configurado aún. El administrador debe agregar la clave ANTHROPIC_API_KEY en Vercel.' : '⚙️ AI assistant is not configured yet. Admin must add ANTHROPIC_API_KEY in Vercel.')
          : (lang === 'es' ? `Error: ${msg}` : lang === 'nl' ? `Fout: ${msg}` : lang === 'de' ? `Fehler: ${msg}` : `Error: ${msg}`)
      )
    } finally {
      setLoading(false)
    }
  }

  const accentColor = role === 'buyer' ? C.navy : C.teal

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height, background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12, background: `linear-gradient(135deg, ${accentColor}08, ${accentColor}04)` }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🤖</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>
            Global Nexus · {lang === 'es' ? 'Asistente IA' : lang === 'nl' ? 'AI-assistent' : lang === 'de' ? 'KI-Assistent' : 'AI Assistant'}
          </div>
          <div style={{ fontSize: 11, color: C.green, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, display: 'inline-block' }} />
            {lang === 'es' ? 'Experto en TLCUEM · Disponible 24/7'
           : lang === 'nl' ? 'TLCUEM-expert · 24/7 beschikbaar'
           : lang === 'de' ? 'TLCUEM-Experte · 24/7 verfügbar'
           : 'TLCUEM expert · Available 24/7'}
          </div>
        </div>
        <div style={{ fontSize: 10, padding: '3px 8px', borderRadius: 100, background: `${accentColor}15`, color: accentColor, fontWeight: 700, border: `1px solid ${accentColor}30` }}>
          Claude AI
        </div>
      </div>

      {/* Messages area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Welcome message */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: `${C.teal}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', flexShrink: 0 }}>🤖</div>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '4px 14px 14px 14px', padding: '10px 14px', fontSize: 13, lineHeight: 1.7, color: C.text, maxWidth: '82%' }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(welcome) }} />
        </div>

        {/* Quick actions */}
        {messages.length === 0 && (
          <div style={{ paddingLeft: 42 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>
              {lang === 'es' ? 'Preguntas frecuentes:' : lang === 'nl' ? 'Veelgestelde vragen:' : lang === 'de' ? 'Häufige Fragen:' : 'Quick questions:'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {QUICK[lang].map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)}
                  style={{ padding: '6px 12px', borderRadius: 100, border: `1px solid ${accentColor}30`, background: `${accentColor}08`, color: accentColor, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Conversation */}
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-end', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.role === 'assistant' && (
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `${C.teal}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', flexShrink: 0 }}>🤖</div>
            )}
            <div style={{
              maxWidth: '82%',
              background: m.role === 'user' ? `linear-gradient(135deg, ${accentColor}, ${m.role === 'user' && role === 'buyer' ? '#1a4a7a' : '#0b7a72'})` : C.bg,
              color: m.role === 'user' ? '#fff' : C.text,
              border: m.role === 'user' ? 'none' : `1px solid ${C.border}`,
              borderRadius: m.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
              padding: '10px 14px',
              fontSize: 13,
              lineHeight: 1.7,
            }}>
              {m.role === 'assistant'
                ? <span dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }} />
                : m.content
              }
            </div>
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: `${C.teal}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem' }}>🤖</div>
            <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '4px 14px 14px 14px', padding: '12px 16px', display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: C.teal, animation: `aichat_bounce 1.2s ${i * 0.22}s infinite ease-in-out` }} />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#DC2626' }}>{error}</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '0.75rem 1rem', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder={PLACEHOLDER[lang]}
          disabled={loading}
          style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, fontFamily: 'inherit', background: C.white, outline: 'none', color: C.text }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: !input.trim() || loading ? C.border : `linear-gradient(135deg, ${C.teal}, ${C.navy})`, color: !input.trim() || loading ? C.muted : '#fff', fontWeight: 700, fontSize: 13, cursor: !input.trim() || loading ? 'not-allowed' : 'pointer', flexShrink: 0, transition: 'all .15s' }}>
          {SEND_LABEL[lang]}
        </button>
      </div>

      <style>{`
        @keyframes aichat_bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: .5; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

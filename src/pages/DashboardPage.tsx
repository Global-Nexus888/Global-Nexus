import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCTS, PRODUCERS } from '../lib/data'

const PRODUCER_ID = 'p1'
const producer = PRODUCERS.find(p => p.id === PRODUCER_ID)!
const myProducts = PRODUCTS.filter(p => p.producerId === PRODUCER_ID)

const MOCK_LEADS = [
  { id: 'l1', buyer: 'Jan van der Berg', company: 'EuroSpirits BV', country: '🇳🇱 Países Bajos', product: 'Tequila Añejo Reserva', moq: '200 cajas', date: 'Hace 2 horas', status: 'nuevo', email: 'jan@eurospirits.nl' },
  { id: 'l2', buyer: 'Marie Dubois', company: 'Maison des Alcools', country: '🇫🇷 Francia', product: 'Tequila Blanco Premium', moq: '300 cajas', date: 'Hace 1 día', status: 'respondido', email: 'marie@maisonalcools.fr' },
  { id: 'l3', buyer: 'Klaus Richter', company: 'Deutsche Spirits GmbH', country: '🇩🇪 Alemania', product: 'Tequila Añejo Reserva', moq: '500 cajas', date: 'Hace 3 días', status: 'negociando', email: 'k.richter@deutschespirits.de' },
  { id: 'l4', buyer: 'Sofia Andersson', company: 'Nordic Import AB', country: '🇸🇪 Suecia', product: 'Tequila Blanco Premium', moq: '150 cajas', date: 'Hace 5 días', status: 'cerrado', email: 'sofia@nordicimport.se' },
]

const MOCK_STATS = [
  { label: 'Vistas este mes', value: '1,847', change: '+23%', icon: '👁️', color: 'var(--teal)' },
  { label: 'Solicitudes recibidas', value: '28', change: '+12%', icon: '📩', color: 'var(--navy)' },
  { label: 'Valor pipeline', value: '$84,200', change: '+38%', icon: '💰', color: 'var(--green)' },
  { label: 'Tasa de respuesta', value: '94%', change: '+5%', icon: '⚡', color: 'var(--gold)' },
]

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  nuevo: { label: 'Nuevo', color: '#0D9488', bg: '#CCFBF1' },
  respondido: { label: 'Respondido', color: '#1E3A5F', bg: '#EFF6FF' },
  negociando: { label: 'Negociando', color: '#D97706', bg: '#FEF3C7' },
  cerrado: { label: 'Cerrado ✓', color: '#16A34A', bg: '#DCFCE7' },
}

const CERT_LABELS: Record<string, string> = {
  'denominacion-origen': 'D.O.', 'organico': 'Orgánico', 'senasica': 'SENASICA',
  'nom': 'NOM', 'cofepris': 'COFEPRIS', 'kosher-halal': 'Kosher/Halal',
}

type Tab = 'overview' | 'productos' | 'solicitudes' | 'perfil'

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>('overview')
  const [leadStatus, setLeadStatus] = useState<Record<string, string>>(
    Object.fromEntries(MOCK_LEADS.map(l => [l.id, l.status]))
  )
  const [selectedLead, setSelectedLead] = useState<string | null>(null)

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Resumen', icon: '📊' },
    { id: 'productos', label: 'Mis productos', icon: '📦' },
    { id: 'solicitudes', label: 'Solicitudes', icon: '📩' },
    { id: 'perfil', label: 'Mi perfil', icon: '🏭' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Dashboard header */}
      <div style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0D9488 100%)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14, fontSize: '2rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,.15)', border: '2px solid rgba(255,255,255,.3)',
              }}>{producer.logo}</div>
              <div>
                <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 12, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>Panel del productor</div>
                <div style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.2 }}>{producer.name}</div>
                <div style={{ color: 'rgba(255,255,255,.75)', fontSize: 13, marginTop: 2 }}>📍 {producer.state} · Plan Pro Exportador</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ background: 'rgba(255,255,255,.15)', color: '#fff', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: '1px solid rgba(255,255,255,.25)' }}>
                ✓ Verificado
              </span>
              <Link to="/catalogo" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: '1px solid rgba(255,255,255,.25)', textDecoration: 'none' }}>
                Ver mi catálogo →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 64, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', gap: 4 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '14px 18px', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
                background: 'transparent', display: 'flex', alignItems: 'center', gap: 6,
                color: tab === t.id ? 'var(--teal)' : 'var(--text-muted)',
                borderBottom: tab === t.id ? '2.5px solid var(--teal)' : '2.5px solid transparent',
                transition: 'all .15s',
              }}
            >
              {t.icon} {t.label}
              {t.id === 'solicitudes' && (
                <span style={{ background: 'var(--teal)', color: '#fff', borderRadius: 100, fontSize: 10, fontWeight: 700, padding: '1px 6px', marginLeft: 2 }}>
                  {MOCK_LEADS.filter(l => l.status === 'nuevo').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
              {MOCK_STATS.map(s => (
                <div key={s.label} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', background: 'var(--green-light)', padding: '2px 8px', borderRadius: 100 }}>{s.change}</span>
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent leads + products */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>

              {/* Recent solicitudes */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: 15 }}>Solicitudes recientes</h3>
                  <button onClick={() => setTab('solicitudes')} style={{ fontSize: 12, color: 'var(--teal)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Ver todas →</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {MOCK_LEADS.slice(0, 3).map(lead => (
                    <div key={lead.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: 'var(--surface2)', borderRadius: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>👤</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{lead.buyer}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.country} · {lead.product}</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: STATUS_CONFIG[leadStatus[lead.id]].bg, color: STATUS_CONFIG[leadStatus[lead.id]].color, flexShrink: 0 }}>
                        {STATUS_CONFIG[leadStatus[lead.id]].label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick stats sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* TLCUEM badge */}
                <div style={{ background: 'linear-gradient(135deg, #0D9488, #1E3A5F)', borderRadius: 'var(--radius)', padding: '1.25rem', color: '#fff' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: 6 }}>🤝</div>
                  <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>Beneficio TLCUEM activo</div>
                  <div style={{ fontSize: 12, opacity: .85, lineHeight: 1.5 }}>Tus productos llegan a los 27 países EU con 0% de arancel. Documentación aduanal generada automáticamente.</div>
                </div>

                {/* Mis productos quick */}
                <div className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>Mis productos activos</div>
                  {myProducts.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '1.2rem' }}>{p.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 600 }}>${p.price} USD/{p.unit}</div>
                      </div>
                      <span style={{ fontSize: 10, color: p.inStock ? 'var(--green)' : 'var(--text-muted)', fontWeight: 600 }}>{p.inStock ? '●' : '○'}</span>
                    </div>
                  ))}
                  <button onClick={() => setTab('productos')} style={{ width: '100%', marginTop: 10, fontSize: 12, color: 'var(--teal)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, textAlign: 'left' }}>
                    Gestionar productos →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTOS ── */}
        {tab === 'productos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Mis productos ({myProducts.length})</h2>
              <button className="btn btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>+ Agregar producto</button>
            </div>

            {myProducts.map(p => (
              <div key={p.id} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 }}>
                  {p.icon}
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</span>
                    {p.verified && <span className="badge badge-teal">✓ Verificado</span>}
                    {p.trending && <span className="badge badge-gold">🔥 Trending</span>}
                    {!p.inStock && <span className="badge badge-gray">Sin stock</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{p.description}</div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                    {p.certifications.map(c => <span key={c} className="badge badge-gray">{CERT_LABELS[c]}</span>)}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--teal)' }}>${p.price.toFixed(2)} <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>USD/{p.unit}</span></div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>MOQ: {p.moq} {p.moqUnit}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/producto/${p.id}`} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 7, background: 'var(--teal-light)', color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>Ver pública</Link>
                    <button style={{ fontSize: 12, padding: '6px 12px', borderRadius: 7, background: 'var(--surface2)', color: 'var(--text-muted)', fontWeight: 600, border: 'none', cursor: 'pointer' }}>✏️ Editar</button>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: '1.5rem', textAlign: 'center', border: '2px dashed var(--border)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>➕</div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Agregar nuevo producto</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Publica nuevos productos y llega a compradores en 27 países EU</div>
              <button className="btn btn-outline" style={{ fontSize: 13 }}>Agregar producto</button>
            </div>
          </div>
        )}

        {/* ── SOLICITUDES ── */}
        {tab === 'solicitudes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Solicitudes de compradores EU ({MOCK_LEADS.length})</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <span key={k} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 100, background: v.bg, color: v.color, fontWeight: 600 }}>
                    {v.label}: {MOCK_LEADS.filter(l => leadStatus[l.id] === k).length}
                  </span>
                ))}
              </div>
            </div>

            {MOCK_LEADS.map(lead => (
              <div key={lead.id} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--navy-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>👤</div>

                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{lead.buyer}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{lead.company}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: STATUS_CONFIG[leadStatus[lead.id]].bg, color: STATUS_CONFIG[leadStatus[lead.id]].color }}>
                        {STATUS_CONFIG[leadStatus[lead.id]].label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                      <span>{lead.country}</span>
                      <span>📦 {lead.product}</span>
                      <span>📊 MOQ: {lead.moq}</span>
                      <span>🕐 {lead.date}</span>
                    </div>
                    <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>✉️ {lead.email}</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                    <select
                      value={leadStatus[lead.id]}
                      onChange={e => setLeadStatus(s => ({ ...s, [lead.id]: e.target.value }))}
                      style={{ fontSize: 12, padding: '6px 10px', borderRadius: 7, border: '1.5px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      <option value="nuevo">Nuevo</option>
                      <option value="respondido">Respondido</option>
                      <option value="negociando">Negociando</option>
                      <option value="cerrado">Cerrado ✓</option>
                    </select>
                    <button
                      onClick={() => setSelectedLead(selectedLead === lead.id ? null : lead.id)}
                      className="btn btn-primary"
                      style={{ fontSize: 12, padding: '7px 14px' }}
                    >
                      💬 Responder
                    </button>
                  </div>
                </div>

                {selectedLead === lead.id && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Respuesta a {lead.buyer}</div>
                    <textarea
                      rows={3}
                      placeholder={`Hola ${lead.buyer.split(' ')[0]}, gracias por tu interés en ${lead.product}. Podemos ofrecer...`}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, resize: 'vertical', fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)' }}
                    />
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button
                        className="btn btn-primary"
                        style={{ fontSize: 12, padding: '8px 16px' }}
                        onClick={() => { setLeadStatus(s => ({ ...s, [lead.id]: 'respondido' })); setSelectedLead(null) }}
                      >Enviar respuesta</button>
                      <button onClick={() => setSelectedLead(null)} className="btn btn-ghost" style={{ fontSize: 12 }}>Cancelar</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── PERFIL ── */}
        {tab === 'perfil' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: '1rem' }}>Información del productor</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: 'Nombre de la empresa', value: producer.name },
                    { label: 'Estado / Región', value: producer.state },
                    { label: 'Año de fundación', value: String(producer.founded) },
                    { label: 'Empleados', value: producer.employees },
                    { label: 'Descripción', value: producer.description, textarea: true },
                  ].map(field => (
                    <div key={field.label}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: 4 }}>{field.label}</label>
                      {field.textarea ? (
                        <textarea
                          defaultValue={field.value}
                          rows={3}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 14, resize: 'vertical', fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)' }}
                        />
                      ) : (
                        <input
                          defaultValue={field.value}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 14, background: 'var(--surface)', color: 'var(--text)' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <button className="btn btn-primary" style={{ marginTop: '1rem', fontSize: 13 }}>Guardar cambios</button>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: '1rem' }}>Certificaciones activas</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {producer.certifications.map(c => (
                    <span key={c} style={{ padding: '6px 14px', borderRadius: 8, background: 'var(--teal-light)', color: 'var(--teal-dark)', fontSize: 13, fontWeight: 600 }}>✓ {CERT_LABELS[c]}</span>
                  ))}
                </div>
                <div style={{ marginTop: '1rem', fontSize: 13, color: 'var(--text-muted)' }}>
                  Para agregar o actualizar certificaciones, contacta a <a href="mailto:verificaciones@nexusstrategy.online" style={{ color: 'var(--teal)', fontWeight: 600 }}>verificaciones@nexusstrategy.online</a>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Plan */}
              <div style={{ background: 'linear-gradient(135deg, #1E3A5F, #0D9488)', borderRadius: 'var(--radius)', padding: '1.5rem', color: '#fff' }}>
                <div style={{ fontSize: 11, opacity: .75, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Tu plan actual</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 4 }}>Pro Exportador</div>
                <div style={{ fontSize: 13, opacity: .85, marginBottom: '1rem' }}>Acceso completo a compradores EU</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {['Contactos ilimitados', 'Perfil verificado', 'Soporte prioritario', 'Docs. aduanales auto'].map(f => (
                    <div key={f} style={{ fontSize: 12, display: 'flex', gap: 8 }}><span>✓</span>{f}</div>
                  ))}
                </div>
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,.2)', fontSize: 12, opacity: .75 }}>
                  Próxima renovación: 27 Jul 2026
                </div>
              </div>

              {/* Export countries */}
              <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>Exportas actualmente a</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {producer.exportCountries.map(c => (
                    <div key={c} style={{ fontSize: '1.4rem' }} title={c}>{
                      { DE: '🇩🇪', NL: '🇳🇱', FR: '🇫🇷', ES: '🇪🇸', IT: '🇮🇹', BE: '🇧🇪', SE: '🇸🇪', PL: '🇵🇱', AT: '🇦🇹', FI: '🇫🇮', DK: '🇩🇰' }[c] || c
                    }</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

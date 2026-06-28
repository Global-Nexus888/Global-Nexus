import { useState, useRef } from 'react'

type DocStatus = 'pending' | 'uploaded' | 'reviewing' | 'verified' | 'rejected'

interface DocSlot {
  id: string
  label: string
  description: string
  required: boolean
  accepts: string
  icon: string
  forRole: 'producer' | 'buyer' | 'both'
  status: DocStatus
  fileName?: string
  fileSize?: string
  uploadedAt?: string
  note?: string
}

const STATUS_CONFIG: Record<DocStatus, { label: string; color: string; bg: string; icon: string }> = {
  pending:   { label: 'Pendiente',   color: '#94A3B8', bg: '#F1F5F9', icon: '○' },
  uploaded:  { label: 'Subido',      color: '#D97706', bg: '#FEF3C7', icon: '⏳' },
  reviewing: { label: 'En revisión', color: '#1E3A5F', bg: '#EFF6FF', icon: '🔍' },
  verified:  { label: 'Verificado',  color: '#16A34A', bg: '#DCFCE7', icon: '✓' },
  rejected:  { label: 'Rechazado',   color: '#DC2626', bg: '#FEE2E2', icon: '✗' },
}

const INITIAL_DOCS: DocSlot[] = [
  // Producer docs
  { id: 'rfc', label: 'RFC / Constancia SAT', description: 'Registro Federal de Contribuyentes actualizado (máx. 3 meses)', required: true, accepts: '.pdf,.jpg,.jpeg', icon: '📋', forRole: 'producer', status: 'verified', fileName: 'RFC_AgaveAzul_2024.pdf', fileSize: '0.8 MB', uploadedAt: 'Hace 2 meses' },
  { id: 'acta', label: 'Acta Constitutiva', description: 'Acta constitutiva de la empresa y poderes notariales', required: true, accepts: '.pdf', icon: '🏛️', forRole: 'producer', status: 'verified', fileName: 'Acta_Constitutiva.pdf', fileSize: '2.1 MB', uploadedAt: 'Hace 2 meses' },
  { id: 'senasica', label: 'Certificado SENASICA', description: 'Permiso de exportación fitosanitario emitido por SENASICA', required: true, accepts: '.pdf,.jpg', icon: '🌿', forRole: 'producer', status: 'reviewing', fileName: 'Cert_SENASICA_2024.pdf', fileSize: '1.2 MB', uploadedAt: 'Hace 3 días' },
  { id: 'nom', label: 'Certificación NOM', description: 'Norma Oficial Mexicana aplicable al producto', required: false, accepts: '.pdf,.jpg', icon: '📜', forRole: 'producer', status: 'uploaded', fileName: 'NOM_Tequila_CRT.pdf', fileSize: '3.4 MB', uploadedAt: 'Hace 1 día' },
  { id: 'org', label: 'Certificado Orgánico', description: 'Certeza Cerorg, USDA Organic u organismo equivalente', required: false, accepts: '.pdf,.jpg', icon: '🌱', forRole: 'producer', status: 'pending' },
  { id: 'do', label: 'Denominación de Origen', description: 'Certificado DO emitido por el Consejo Regulador', required: false, accepts: '.pdf,.jpg', icon: '🏆', forRole: 'producer', status: 'verified', fileName: 'DO_Tequila_CRT_2024.pdf', fileSize: '0.9 MB', uploadedAt: 'Hace 2 meses' },
  // Buyer docs
  { id: 'kvk', label: 'Registro Comercial EU', description: 'KVK (NL), Handelsregister (DE), KBIS (FR) o equivalente europeo', required: true, accepts: '.pdf,.jpg', icon: '🏢', forRole: 'buyer', status: 'pending' },
  { id: 'vat', label: 'Número VAT / IVA EU', description: 'Número de IVA intracomunitario activo en VIES', required: true, accepts: '.pdf,.jpg', icon: '🔢', forRole: 'buyer', status: 'pending' },
  { id: 'import', label: 'Licencia de Importación', description: 'Permiso de importación de bebidas alcohólicas u otros regulados', required: false, accepts: '.pdf', icon: '🚢', forRole: 'buyer', status: 'pending' },
  { id: 'id', label: 'ID del Representante Legal', description: 'Pasaporte o DNI vigente del firmante autorizado', required: true, accepts: '.pdf,.jpg,.jpeg,.png', icon: '🪪', forRole: 'both', status: 'pending' },
]

export default function VerificationPage() {
  const [role, setRole] = useState<'producer' | 'buyer'>('producer')
  const [docs, setDocs] = useState<DocSlot[]>(INITIAL_DOCS)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const myDocs = docs.filter(d => d.forRole === role || d.forRole === 'both')
  const verified = myDocs.filter(d => d.status === 'verified').length
  const total = myDocs.length
  const requiredDone = myDocs.filter(d => d.required && d.status === 'verified').length
  const requiredTotal = myDocs.filter(d => d.required).length
  const progress = Math.round((verified / total) * 100)

  const handleUpload = (docId: string, file: File) => {
    setDocs(prev => prev.map(d => d.id === docId ? {
      ...d,
      status: 'uploaded',
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploadedAt: 'Ahora',
    } : d))
  }

  const handleDrop = (docId: string, e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(null)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(docId, file)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, var(--teal), var(--navy))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🛡️</div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' }}>Verificación de perfil</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Los perfiles verificados generan 3x más confianza y aparecen primero en el catálogo</p>
          </div>
        </div>

        {/* Role selector */}
        <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
          {(['producer', 'buyer'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{
                padding: '8px 20px', borderRadius: 10, border: '2px solid',
                borderColor: role === r ? 'var(--teal)' : 'var(--border)',
                background: role === r ? 'var(--teal-light)' : 'var(--white)',
                color: role === r ? 'var(--teal-dark)' : 'var(--text-muted)',
                fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all .15s',
              }}
            >
              {r === 'producer' ? '🏭 Soy productor mexicano' : '🇪🇺 Soy comprador europeo'}
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Progreso de verificación</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {requiredDone}/{requiredTotal} documentos obligatorios verificados
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: progress >= 80 ? 'var(--green)' : progress >= 50 ? 'var(--gold)' : 'var(--text-muted)' }}>{progress}%</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>completado</div>
          </div>
        </div>
        <div style={{ height: 10, background: 'var(--surface2)', borderRadius: 100, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--teal), var(--green))', borderRadius: 100, transition: 'width .5s ease' }} />
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => {
            const count = myDocs.filter(d => d.status === k).length
            if (count === 0) return null
            return (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <span style={{ color: v.color, fontWeight: 700 }}>{v.icon}</span>
                <span style={{ color: 'var(--text-muted)' }}>{v.label}: <strong style={{ color: 'var(--text)' }}>{count}</strong></span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Alert if required missing */}
      {requiredDone < requiredTotal && (
        <div style={{ background: 'var(--gold-light)', border: '1.5px solid var(--gold)', borderRadius: 10, padding: '12px 16px', marginBottom: '1.5rem', fontSize: 13 }}>
          <strong style={{ color: 'var(--gold)' }}>⚠️ Documentos obligatorios pendientes: </strong>
          <span style={{ color: 'var(--text)' }}>{myDocs.filter(d => d.required && d.status === 'pending').map(d => d.label).join(', ')}</span>
        </div>
      )}

      {/* Document slots */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {myDocs.map(doc => {
          const status = STATUS_CONFIG[doc.status]
          const isDragTarget = dragOver === doc.id

          return (
            <div
              key={doc.id}
              className="card"
              style={{
                padding: '1.25rem',
                border: isDragTarget ? '2px dashed var(--teal)' : doc.status === 'verified' ? '1.5px solid #86EFAC' : `1px solid var(--border)`,
                background: isDragTarget ? 'var(--teal-light)' : doc.status === 'verified' ? '#F0FDF4' : 'var(--white)',
                transition: 'all .2s',
              }}
              onDragOver={e => { e.preventDefault(); setDragOver(doc.id) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => handleDrop(doc.id, e)}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Icon */}
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: status.bg, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                  border: `1.5px solid ${status.color}30`,
                }}>{doc.icon}</div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{doc.label}</span>
                    {doc.required && <span style={{ fontSize: 10, color: '#DC2626', fontWeight: 700, background: '#FEE2E2', padding: '1px 6px', borderRadius: 100 }}>Obligatorio</span>}
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: status.bg, color: status.color }}>
                      {status.icon} {status.label}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{doc.description}</p>

                  {/* Uploaded file */}
                  {doc.fileName && (
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, background: status.bg, borderRadius: 8, padding: '8px 12px' }}>
                      <span style={{ fontSize: '1rem' }}>{doc.fileName.endsWith('.pdf') ? '📄' : '🖼️'}</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{doc.fileName}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{doc.fileSize} · Subido {doc.uploadedAt}</div>
                      </div>
                      {doc.status === 'verified' && <span style={{ marginLeft: 'auto', fontSize: 18 }}>✅</span>}
                      {doc.status === 'reviewing' && <span style={{ marginLeft: 'auto', fontSize: 18 }}>🔍</span>}
                    </div>
                  )}

                  {doc.note && (
                    <div style={{ marginTop: 8, fontSize: 12, color: '#DC2626', background: '#FEE2E2', padding: '6px 10px', borderRadius: 7 }}>
                      ✗ {doc.note}
                    </div>
                  )}
                </div>

                {/* Upload button */}
                <div style={{ flexShrink: 0 }}>
                  {doc.status !== 'verified' && (
                    <>
                      <input
                        ref={el => fileRefs.current[doc.id] = el}
                        type="file"
                        accept={doc.accepts}
                        style={{ display: 'none' }}
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(doc.id, f); e.target.value = '' }}
                      />
                      <button
                        onClick={() => fileRefs.current[doc.id]?.click()}
                        className="btn"
                        style={{
                          fontSize: 12, padding: '8px 16px',
                          background: doc.status === 'pending' ? 'var(--teal)' : 'var(--surface2)',
                          color: doc.status === 'pending' ? '#fff' : 'var(--text-muted)',
                          border: doc.status === 'pending' ? 'none' : '1.5px solid var(--border)',
                        }}
                      >
                        {doc.status === 'pending' ? '📤 Subir documento' : '🔄 Reemplazar'}
                      </button>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, textAlign: 'center' }}>
                        {doc.accepts.split(',').join(' ')} · máx 20MB
                      </div>
                      {isDragTarget && (
                        <div style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 700, marginTop: 4, textAlign: 'center' }}>
                          Suelta aquí ↓
                        </div>
                      )}
                    </>
                  )}
                  {doc.status === 'verified' && (
                    <div style={{ fontSize: '1.5rem', textAlign: 'center', color: 'var(--green)' }}>✅</div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Info box */}
      <div style={{ marginTop: '2rem', background: 'linear-gradient(135deg, var(--navy-light), var(--teal-light))', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>🛡️ ¿Cómo funciona la verificación?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { n: '1', title: 'Sube tus documentos', desc: 'PDF o JPG, hasta 20MB por archivo. Drag & drop o clic para seleccionar.' },
            { n: '2', title: 'Revisión en 24-48h', desc: 'Nuestro equipo de verificación revisa cada documento manualmente.' },
            { n: '3', title: 'Insignia verificada', desc: 'Tu perfil recibe ✓ Verificado y aparece primero en búsquedas.' },
            { n: '4', title: '3x más contactos', desc: 'Los perfiles verificados reciben 3 veces más solicitudes de compradores EU.' },
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--teal)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{s.n}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{s.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

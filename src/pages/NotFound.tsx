import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '3rem' }}>🌐</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>404</h1>
      <p style={{ color: 'var(--text-muted)' }}>Página no encontrada</p>
      <Link to="/" className="btn btn-primary">Volver al inicio</Link>
    </div>
  )
}

import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import CatalogPage from './pages/CatalogPage'
import ProducersPage from './pages/ProducersPage'
import HowItWorksPage from './pages/HowItWorksPage'
import PricingPage from './pages/PricingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProductPage from './pages/ProductPage'
import DashboardPage from './pages/DashboardPage'
import MessagesPage from './pages/MessagesPage'
import AdminPage from './pages/AdminPage'
import VerificationPage from './pages/VerificationPage'
import NotFound from './pages/NotFound'

const FULL_SCREEN_ROUTES = ['/admin', '/mensajes']

export default function App() {
  const { pathname } = useLocation()
  const isFullScreen = FULL_SCREEN_ROUTES.some(r => pathname.startsWith(r))

  if (isFullScreen) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/mensajes" element={<MessagesPage />} />
      </Routes>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/productores" element={<ProducersPage />} />
          <Route path="/como-funciona" element={<HowItWorksPage />} />
          <Route path="/precios" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/producto/:id" element={<ProductPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/verificacion" element={<VerificationPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

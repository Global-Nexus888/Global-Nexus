import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CountdownBanner from './components/CountdownBanner'
import LangBar from './components/LangBar'
import { LangProvider } from './context/LangContext'
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
import SocialPage from './pages/SocialPage'
import DealsPage from './pages/DealsPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import ContactPage from './pages/ContactPage'
import FAQPage from './pages/FAQPage'
import ThankYouPage from './pages/ThankYouPage'
import AsesoriaPage from './pages/AsesoriaPage'
import NotFound from './pages/NotFound'
import CookieBanner from './components/CookieBanner'

const FULL_SCREEN_ROUTES = ['/admin', '/mensajes']

export default function App() {
  const { pathname } = useLocation()
  const isFullScreen = FULL_SCREEN_ROUTES.some(r => pathname.startsWith(r))

  if (isFullScreen) {
    return (
      <LangProvider>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/mensajes" element={<MessagesPage />} />
        </Routes>
      </LangProvider>
    )
  }

  return (
    <LangProvider>
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <LangBar />
      <CountdownBanner />
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
          <Route path="/comunidad" element={<SocialPage />} />
          <Route path="/oportunidades" element={<DealsPage />} />
          <Route path="/privacidad" element={<PrivacyPage />} />
          <Route path="/terminos" element={<TermsPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/gracias" element={<ThankYouPage />} />
          <Route path="/asesoria" element={<AsesoriaPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CookieBanner />
    </div>
    </LangProvider>
  )
}

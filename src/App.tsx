import { useState, useEffect } from 'react'
import { ThemeProvider } from './theme'
import Nav from './components/Nav'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import TeamPage from './pages/TeamPage'
import FaqPage from './pages/FaqPage'
import ContactsPage from './pages/ContactsPage'
import BlogListPage from './pages/BlogListPage'
import BlogArticlePage from './pages/BlogArticlePage'
import ResourcesPage from './pages/ResourcesPage'
import RegisterPage from './pages/RegisterPage'
import JoinPage from './pages/JoinPage'
import LocationsPage from './pages/LocationsPage'
import TalentManagementPage from './pages/TalentManagementPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import ProfilePage from './pages/ProfilePage'
import OptionsPage from './pages/OptionsPage'
import VideosPage from './pages/VideosPage'
import DashboardPage, { type DashboardRole } from './pages/DashboardPage'
import type { BlogPost, Artist } from './data'

interface DashboardNavData {
  role?: DashboardRole
  account?: { name: string; email: string }
}

// Passed from the Homepage hero's quick-start panel so a name/email typed
// there carries through to the full Create Account form instead of being
// thrown away.
interface RegisterPrefill {
  firstName?: string
  lastName?: string
  email?: string
}

export type Page =
  | 'home'
  | 'about'
  | 'services'
  | 'team'
  | 'faq'
  | 'contacts'
  | 'blog'
  | 'blog-article'
  | 'resources'
  | 'register'
  | 'join'
  | 'locations'
  | 'talent'
  | 'privacy'
  | 'terms'
  | 'profile'
  | 'options'
  | 'videos'
  | 'dashboard'

interface NavState {
  page: Page
  data?: unknown
}

const NO_FOOTER_PAGES: Page[] = []

export default function App() {
  const [state, setState] = useState<NavState>({ page: 'home' })

  const navigate = (page: Page, data?: unknown) => {
    setState({ page, data })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [state.page])

  const showFooter = !NO_FOOTER_PAGES.includes(state.page)

  return (
    <ThemeProvider>
      <div style={{ minHeight: '100vh' }}>
        <Nav currentPage={state.page} navigate={navigate} />

        {state.page === 'home' && <HomePage navigate={navigate} />}
        {state.page === 'about' && <AboutPage navigate={navigate} />}
        {state.page === 'services' && <ServicesPage navigate={navigate} />}
        {state.page === 'team' && <TeamPage navigate={navigate} />}
        {state.page === 'faq' && <FaqPage navigate={navigate} />}
        {state.page === 'contacts' && <ContactsPage navigate={navigate} />}
        {state.page === 'blog' && <BlogListPage navigate={navigate} />}
        {state.page === 'blog-article' && <BlogArticlePage navigate={navigate} post={state.data as BlogPost} />}
        {state.page === 'resources' && <ResourcesPage navigate={navigate} />}
        {state.page === 'register' && <RegisterPage navigate={navigate} prefill={state.data as RegisterPrefill | undefined} />}
        {state.page === 'join' && <JoinPage navigate={navigate} />}
        {state.page === 'locations' && <LocationsPage navigate={navigate} />}
        {state.page === 'talent' && <TalentManagementPage navigate={navigate} />}
        {state.page === 'privacy' && <PrivacyPage navigate={navigate} />}
        {state.page === 'terms' && <TermsPage navigate={navigate} />}
        {state.page === 'profile' && <ProfilePage navigate={navigate} artist={state.data as Artist | undefined} />}
        {state.page === 'options' && <OptionsPage navigate={navigate} />}
        {state.page === 'videos' && <VideosPage navigate={navigate} />}
        {state.page === 'dashboard' && (
          <DashboardPage
            navigate={navigate}
            role={(state.data as DashboardNavData | undefined)?.role}
            account={(state.data as DashboardNavData | undefined)?.account}
          />
        )}

        {showFooter && <Footer navigate={navigate} />}
      </div>
    </ThemeProvider>
  )
}

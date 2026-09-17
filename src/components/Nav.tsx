import { useState, useEffect } from 'react'
import type { Page } from '../App'
import { useTheme } from '../theme'
import SideNav from './SideNav'

interface NavProps {
  currentPage: Page
  navigate: (page: Page, data?: unknown) => void
}

// Structure mirrors the real rafikihub.com header (data/files/header.php):
// About Us (dropdown: About Us, Our Team), Talent Management, Blog,
// Resource Hub (dropdown: Video Library, Contact Listings,
// Sio Bahati Services, RafikiHub Locations), then Options / Join Now.
const aboutDropdown: { label: string; page: Page }[] = [
  { label: 'About Us', page: 'about' },
  { label: 'Our Team', page: 'team' },
]

const resourceHubDropdown: { label: string; page: Page }[] = [
  { label: 'Video Library', page: 'videos' },
  { label: 'Contact Listings', page: 'contacts' },
  { label: 'Sio Bahati Services', page: 'services' },
  { label: 'RafikiHub Locations', page: 'locations' },
  { label: 'Resources', page: 'resources' },
]

function DropdownLink({
  label,
  items,
  active,
  color,
  navigate,
  accent,
}: {
  label: string
  items: { label: string; page: Page }[]
  active: boolean
  color: string
  navigate: (page: Page, data?: unknown) => void
  accent: string
}) {
  return (
    <div className="relative group">
      <button
        className="text-sm font-medium transition-colors duration-150 flex items-center gap-1"
        style={{ color: active ? accent : color, fontFamily: 'var(--font-sans)' }}
      >
        {label}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="mt-px">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <div
        className="absolute left-0 top-full pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-150"
      >
        <div className="rounded-lg overflow-hidden shadow-lg min-w-[200px]" style={{ background: '#FFFFFF', border: '1px solid #E9ECEF' }}>
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.page)}
              className="w-full text-left px-4 py-3 text-sm transition-colors duration-150"
              style={{ color: '#1C2D41', fontFamily: 'var(--font-sans)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#F8F9FA' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Nav({ currentPage, navigate }: NavProps) {
  const { t } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [sideNavOpen, setSideNavOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // The real header is a permanently dark navy navbar (ftco_navbar bg-dark)
  // sitting over the hero image on desktop; we keep that always-dark
  // treatment rather than a transparent-to-solid fade.
  const textColor = '#E8ECF3'
  const linkColor = (page: Page) => (currentPage === page ? t.terra : textColor)
  const isAboutActive = currentPage === 'about' || currentPage === 'team'
  const isResourceActive = ['videos', 'contacts', 'services', 'locations', 'resources'].includes(currentPage)

  return (
    <>
      <SideNav open={sideNavOpen} onClose={() => setSideNavOpen(false)} navigate={navigate} currentPage={currentPage} />

      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{ background: t.navBg, backdropFilter: 'blur(10px)', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none' }}
      >
        <div className="relative h-16 flex items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
          {/* Left links (desktop) */}
          <div className="hidden lg:flex items-center gap-7 flex-1">
            <DropdownLink label="About Us" items={aboutDropdown} active={isAboutActive} color={textColor} navigate={navigate} accent={t.terra} />
            <button
              onClick={() => navigate('talent')}
              className="text-sm font-medium transition-colors duration-150"
              style={{ color: linkColor('talent'), fontFamily: 'var(--font-sans)' }}
            >
              Talent Management
            </button>
            <button
              onClick={() => navigate('blog')}
              className="text-sm font-medium transition-colors duration-150"
              style={{ color: currentPage === 'blog' || currentPage === 'blog-article' ? t.terra : textColor, fontFamily: 'var(--font-sans)' }}
            >
              Blog
            </button>
          </div>

          {/* Logo */}
          <button onClick={() => navigate('home')} className="flex items-center gap-2 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
            <span className="text-xl font-bold tracking-tight uppercase" style={{ fontFamily: 'var(--font-display)' }}>
              <span style={{ color: t.terra }}>Rafiki</span><span style={{ color: '#FFFFFF' }}>Hub</span>
            </span>
          </button>

          {/* Right links (desktop) + CTA */}
          <div className="hidden lg:flex items-center gap-7 flex-1 justify-end">
            <DropdownLink label="Resource Hub" items={resourceHubDropdown} active={isResourceActive} color={textColor} navigate={navigate} accent={t.terra} />
            <button
              onClick={() => navigate('options')}
              className="text-sm font-medium transition-colors duration-150"
              style={{ color: linkColor('options'), fontFamily: 'var(--font-sans)' }}
            >
              Options
            </button>
            <button
              onClick={() => navigate('dashboard')}
              className="text-sm font-medium transition-colors duration-150"
              style={{ color: linkColor('dashboard'), fontFamily: 'var(--font-sans)' }}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('join')}
              className="px-5 py-2 rounded-md text-sm font-semibold transition-transform duration-150 hover:scale-105"
              style={{ background: t.terra, color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
            >
              Join Now
            </button>
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden ml-auto" onClick={() => setSideNavOpen(true)} aria-label="Open menu">
            <svg width="22" height="22" fill="none" stroke={textColor} strokeWidth="2">
              <line x1="2" y1="6" x2="20" y2="6" />
              <line x1="2" y1="11" x2="20" y2="11" />
              <line x1="2" y1="16" x2="20" y2="16" />
            </svg>
          </button>
        </div>

        {/* Thin beadwork-inspired stripe — a subtle East African touch that
            appears on every page since Nav is rendered globally. */}
        <div className="rh-beadband" style={{ height: 3 }} aria-hidden="true" />
      </nav>
    </>
  )
}

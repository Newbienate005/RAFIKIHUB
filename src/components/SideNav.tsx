import { useEffect } from 'react'
import type { Page } from '../App'
import { useTheme } from '../theme'

interface SideNavProps {
  open: boolean
  onClose: () => void
  navigate: (page: Page, data?: unknown) => void
  currentPage: Page
}

interface Group {
  title: string
  items: { label: string; page: Page }[]
}

// Mirrors the real rafikihub.com header + footer groupings
// (data/files/header.php and data/files/footer.php).
const groups: Group[] = [
  {
    title: 'About Us',
    items: [
      { label: 'Home', page: 'home' },
      { label: 'About Us', page: 'about' },
      { label: 'Our Team', page: 'team' },
      { label: 'Talent Management', page: 'talent' },
      { label: 'Blog', page: 'blog' },
    ],
  },
  {
    title: 'Resource Hub',
    items: [
      { label: 'Video Library', page: 'videos' },
      { label: 'Contact Listings', page: 'contacts' },
      { label: 'Sio Bahati Services', page: 'services' },
      { label: 'RafikiHub Locations', page: 'locations' },
      { label: 'Resources', page: 'resources' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Dashboard', page: 'dashboard' },
      { label: 'Sign Up', page: 'register' },
      { label: 'Options', page: 'options' },
      { label: 'Join Now', page: 'join' },
    ],
  },
  {
    title: 'The Small Print',
    items: [
      { label: 'RafikiHub Help & FAQ', page: 'faq' },
      { label: 'RafikiHub Privacy Policy', page: 'privacy' },
      { label: 'Terms & Conditions', page: 'terms' },
    ],
  },
]

export default function SideNav({ open, onClose, navigate, currentPage }: SideNavProps) {
  const { t } = useTheme()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <div
        className="fixed inset-0 z-[60] transition-opacity duration-300"
        style={{
          background: 'rgba(12,11,9,0.5)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={onClose}
      />
      <div
        className="fixed top-0 right-0 bottom-0 z-[70] w-[85%] max-w-sm overflow-y-auto transition-transform duration-300"
        style={{
          background: t.bg,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          borderLeft: `1px solid ${t.border}`,
        }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: t.border }}>
          <span className="text-lg font-bold uppercase" style={{ fontFamily: 'var(--font-display)', color: t.terra }}>
            Rafiki<span style={{ color: t.fg }}>Hub</span>
          </span>
          <button onClick={onClose} aria-label="Close menu">
            <svg width="20" height="20" fill="none" stroke={t.mutedFg} strokeWidth="2">
              <line x1="2" y1="2" x2="18" y2="18" />
              <line x1="18" y1="2" x2="2" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">
          {groups.map((g) => (
            <div key={g.title} className="mb-8">
              <h4
                className="text-xs font-semibold tracking-widest uppercase mb-3"
                style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}
              >
                {g.title}
              </h4>
              <ul className="space-y-1">
                {g.items.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => {
                        navigate(item.page)
                        onClose()
                      }}
                      className="w-full text-left py-2 text-sm transition-colors duration-150"
                      style={{
                        color: currentPage === item.page ? t.terra : t.fgDim,
                        fontFamily: 'var(--font-sans)',
                        fontWeight: currentPage === item.page ? 600 : 400,
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

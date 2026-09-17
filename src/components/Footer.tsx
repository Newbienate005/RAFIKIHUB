import type { Page } from '../App'
import { useTheme } from '../theme'

interface FooterProps {
  navigate: (page: Page, data?: unknown) => void
}

// Mirrors the real rafikihub.com footer (data/files/footer.php):
// About RafikiHub, Sio Bahati Services, The Small Print, Get In Touch.
export default function Footer({ navigate }: FooterProps) {
  const { t } = useTheme()

  const sioBahati: { label: string; page: Page }[] = [
    { label: 'Headshots', page: 'services' },
    { label: 'Showreels', page: 'services' },
    { label: 'Audition Preps', page: 'services' },
  ]
  const smallPrint: { label: string; page: Page }[] = [
    { label: 'Terms & Conditions', page: 'terms' },
    { label: 'RafikiHub Privacy Policy', page: 'privacy' },
    { label: 'RafikiHub Help & FAQ', page: 'faq' },
    { label: 'How RafikiHub Works', page: 'services' },
  ]

  const linkStyle = { color: '#B9C2CE', fontFamily: 'var(--font-sans)' as const }

  const renderList = (items: { label: string; page: Page }[]) => (
    <ul className="list-none space-y-2 p-0 m-0">
      {items.map((item, i) => (
        <li key={item.label + i}>
          <button
            onClick={() => navigate(item.page)}
            className="text-sm text-left transition-colors duration-150 py-1"
            style={linkStyle}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#B9C2CE' }}
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  )

  const socialLinks = [
    { label: 'YouTube', href: 'https://www.youtube.com/channel/UCxTTXLaw_uyEDCnlAfoHROA' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/rafikihub-com/' },
    { label: 'Instagram', href: 'https://www.instagram.com/rafikihub/' },
  ]

  return (
    <footer style={{ background: t.gold }}>
      {/* Same beadwork-inspired stripe as the nav, echoed at the base of
          every page for a subtle bookend. */}
      <div className="rh-beadband" style={{ height: 6 }} aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
        <div>
          <h2 className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}>
            About RafikiHub
          </h2>
          <p className="text-sm leading-relaxed mb-5" style={{ color: '#B9C2CE', fontFamily: 'var(--font-sans)' }}>
            RafikiHub connects cast &amp; crew to industry professionals with roles in theatre, television and film productions across Africa.
          </p>
          <div className="flex gap-4">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors duration-150"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}
              >
                {s.label[0]}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}>
            Sio Bahati Services
          </h2>
          {renderList(sioBahati)}
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}>
            The Small Print
          </h2>
          {renderList(smallPrint)}
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}>
            Get In Touch
          </h2>
          <ul className="list-none space-y-2 p-0 m-0 text-sm" style={{ color: '#B9C2CE', fontFamily: 'var(--font-sans)' }}>
            <li>Park Place Business Centre</li>
            <li>Park Place Building, 2nd Floor</li>
            <li>Parklands, Nairobi &mdash; Kenya</li>
            <li className="pt-2">
              <a href="tel:+254114011932" className="transition-colors duration-150" style={{ color: '#B9C2CE' }}>
                +254 (0) 114 011 932
              </a>
            </li>
            <li>
              <a href="mailto:info@rafikihub.com" className="transition-colors duration-150" style={{ color: '#B9C2CE' }}>
                info@rafikihub.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6">
          <p className="text-xs" style={{ color: '#8FA0B8', fontFamily: 'var(--font-sans)' }}>
            Copyright &copy; 2026 &nbsp;|&nbsp; Powered by RafikiHub
          </p>
        </div>
      </div>
    </footer>
  )
}

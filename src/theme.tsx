import { createContext, useContext, useState, type ReactNode } from 'react'

export interface Theme {
  isDark: boolean
  bg: string
  bg2: string
  card: string
  muted: string
  border: string
  border2: string
  fg: string
  fgDim: string
  mutedFg: string
  subtle: string
  gold: string
  terra: string
  navBg: string
  navMobile: string
  g08: string
  g10: string
  g12: string
  g15: string
  g20: string
  g25: string
  g30: string
  logoFilter: string
  inputBg: string
  beadRed: string
  beadGreen: string
  beadBlue: string
}

// Brand colors pulled from the real rafikihub.com source (scripts/landing.scss):
// $primary: #FF8033 (orange), $secondary: #011F55 (navy), $font-primary: Poppins.
// The client asked to move away from the navy secondary — `gold`/`navBg`/
// `navMobile` (and the matching hardcoded hero/overlay tints in HomePage,
// LocationsPage, and VideosPage) are now a warm charcoal instead of navy.
// `terra` (orange) is unchanged.
//
// `beadRed`/`beadGreen`/`beadBlue` are a small East African-inspired accent
// set (evoking Maasai beadwork's banded red/green/blue/black/white rhythm —
// fitting since RafikiHub's fictional HQ is Nairobi). They're used sparingly:
// the striped `.rh-beadband` under the nav and atop the footer, and nowhere
// else load-bearing — `terra`/`gold` remain the primary brand pair.
const light: Theme = {
  isDark: false,
  bg:        '#FFFFFF',
  bg2:       '#F8F9FA',
  card:      '#FFFFFF',
  muted:     '#F1F3F5',
  border:    '#E9ECEF',
  border2:   '#DEE2E6',
  fg:        '#1C2D41',
  fgDim:     '#33415C',
  mutedFg:   '#6C757D',
  subtle:    '#9EABC0',
  gold:      '#211F1C',
  terra:     '#FF8033',
  navBg:     'rgba(33,31,28,0.97)',
  navMobile: 'rgba(33,31,28,0.99)',
  g08:  'rgba(255,128,51,0.08)',
  g10:  'rgba(255,128,51,0.10)',
  g12:  'rgba(255,128,51,0.12)',
  g15:  'rgba(255,128,51,0.15)',
  g20:  'rgba(255,128,51,0.20)',
  g25:  'rgba(255,128,51,0.25)',
  g30:  'rgba(255,128,51,0.30)',
  logoFilter: 'none',
  inputBg:   '#FFFFFF',
  beadRed:   '#A6392D',
  beadGreen: '#1F6E43',
  beadBlue:  '#1B3F6B',
}

const dark: Theme = {
  isDark: true,
  bg:        '#0B1626',
  bg2:       '#081120',
  card:      '#101F35',
  muted:     '#152A47',
  border:    '#1F3555',
  border2:   '#152A47',
  fg:        '#F4F6F8',
  fgDim:     '#D6DEE8',
  mutedFg:   '#9EABC0',
  subtle:    '#6C7E99',
  gold:      '#B9B2A6',
  terra:     '#FF8033',
  navBg:     'rgba(24,22,20,0.97)',
  navMobile: 'rgba(24,22,20,0.99)',
  g08:  'rgba(255,128,51,0.08)',
  g10:  'rgba(255,128,51,0.10)',
  g12:  'rgba(255,128,51,0.12)',
  g15:  'rgba(255,128,51,0.15)',
  g20:  'rgba(255,128,51,0.20)',
  g25:  'rgba(255,128,51,0.25)',
  g30:  'rgba(255,128,51,0.30)',
  logoFilter: 'none',
  inputBg:   '#101F35',
  beadRed:   '#C1483A',
  beadGreen: '#2E8A5E',
  beadBlue:  '#3A5F94',
}

interface ThemeCtx {
  t: Theme
  toggle: () => void
}

const Ctx = createContext<ThemeCtx>({ t: light, toggle: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const toggle = () => setIsDark((d) => !d)
  return (
    <Ctx.Provider value={{ t: isDark ? dark : light, toggle }}>
      <div style={{ background: isDark ? dark.bg : light.bg, minHeight: '100vh', transition: 'background 200ms' }}>
        {children}
      </div>
    </Ctx.Provider>
  )
}

export const useTheme = () => useContext(Ctx)

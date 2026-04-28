import { NavLink } from 'react-router-dom'
import { BarChart2, Home, Database, Layers, Shield, Globe } from 'lucide-react'

const NAV = [
  { to: '/',          label: 'Home',           icon: Home },
  { to: '/corpus',    label: 'Corpus',         icon: Database },
  { to: '/topics',    label: 'Topics',         icon: Layers },
  { to: '/security',  label: 'Security Frames',icon: Shield },
  { to: '/explorer',  label: 'Explorer',       icon: Globe },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <NavLink to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-0.5">
              {[...Array(6)].map((_, i) => (
                <span key={i} className="text-eu-gold text-[9px]">★</span>
              ))}
            </div>
            <span className="text-sm font-bold text-white leading-tight hidden sm:block">
              EP Security<br /><span className="text-slate-400 font-normal text-xs">Debates</span>
            </span>
          </NavLink>

          <nav className="flex items-center gap-0.5 overflow-x-auto">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon size={12} />
                <span className="hidden md:inline">{label}</span>
              </NavLink>
            ))}
          </nav>

          <a
            href="https://github.com/juttingn/ep-security-debates"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs text-slate-500 hover:text-slate-300 transition-colors hidden lg:block"
          >
            GitHub →
          </a>
        </div>
      </div>
    </header>
  )
}

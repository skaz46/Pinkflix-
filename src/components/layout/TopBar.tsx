import { useLocation } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { allNav, brand } from '../../config/navigation'

interface TopBarProps {
  onOpenQuickSettings: () => void
}

export function TopBar({ onOpenQuickSettings }: TopBarProps) {
  const location = useLocation()
  const current = allNav.find((n) => (n.to === '/' ? location.pathname === '/' : location.pathname.startsWith(n.to)))
  const isHome = location.pathname === '/'

  return (
    <header className="lg:hidden sticky top-0 z-30 pt-safe">
      <div className="flex items-center justify-between px-4 h-14 bg-black/70 backdrop-blur-xl border-b border-white/6">
        <div className="flex items-center gap-2">
          {isHome ? (
            <>
              <brand.icon size={19} className="text-accent-400" />
              <span className="text-[17px] font-bold tracking-tight text-ink-primary">{brand.name}</span>
            </>
          ) : (
            <span className="text-[17px] font-bold tracking-tight text-ink-primary">
              {current?.label ?? 'PinkFlix'}
            </span>
          )}
        </div>
        <button
          onClick={onOpenQuickSettings}
          aria-label="Quick settings"
          className="focus-ring w-8 h-8 rounded-full flex items-center justify-center text-ink-secondary hover:text-ink-primary hover:bg-white/5 transition-colors"
        >
          <Settings size={19} />
        </button>
      </div>
    </header>
  )
}

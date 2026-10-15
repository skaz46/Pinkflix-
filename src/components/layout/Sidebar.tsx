import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { allNav } from '../../config/navigation'

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 h-dvh sticky top-0 border-r border-white/8 bg-black/60 backdrop-blur-xl px-4 py-6">
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-400 to-accent-700 flex items-center justify-center shadow-glow">
          <Play size={16} className="fill-white text-white ml-0.5" />
        </div>
        <span className="text-[17px] font-bold tracking-tight text-ink-primary">PinkFlix</span>
      </div>

      <nav className="flex flex-col gap-1">
        {allNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `focus-ring relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors duration-200 ${
                isActive ? 'text-ink-primary' : 'text-ink-secondary hover:text-ink-primary hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-xl bg-white/8 ring-1 ring-white/10"
                  />
                )}
                <item.icon
                  size={18}
                  className={`relative shrink-0 ${isActive ? 'text-accent-400' : ''}`}
                />
                <span className="relative">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-3 py-4 rounded-2xl glass">
        <p className="text-[12px] text-ink-tertiary leading-relaxed">
          All your data stays on this device — favorites, history and collections are stored locally.
        </p>
      </div>
    </aside>
  )
}

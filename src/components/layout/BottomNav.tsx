import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MoreHorizontal } from 'lucide-react'
import { primaryNav, secondaryNav } from '../../config/navigation'

export function BottomNav() {
  const location = useLocation()
  const isOnMoreSection = secondaryNav.some((item) => location.pathname.startsWith(item.to))

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-safe">
      <div className="glass-strong mb-3 rounded-[26px] shadow-card flex items-stretch justify-between px-1.5 py-1.5">
        {primaryNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className="relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-3xl focus-ring"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="bottomnav-active"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute inset-1 rounded-[20px] bg-white/10"
                  />
                )}
                <item.icon
                  size={21}
                  strokeWidth={2}
                  className={`relative ${isActive ? 'text-accent-400' : 'text-ink-secondary'}`}
                />
                <span
                  className={`relative text-[10px] font-medium ${
                    isActive ? 'text-ink-primary' : 'text-ink-tertiary'
                  }`}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
        <NavLink
          to="/more"
          className="relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-3xl focus-ring"
        >
          {isOnMoreSection && (
            <motion.div
              layoutId="bottomnav-active"
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              className="absolute inset-1 rounded-[20px] bg-white/10"
            />
          )}
          <MoreHorizontal
            size={21}
            className={`relative ${isOnMoreSection ? 'text-accent-400' : 'text-ink-secondary'}`}
          />
          <span
            className={`relative text-[10px] font-medium ${
              isOnMoreSection ? 'text-ink-primary' : 'text-ink-tertiary'
            }`}
          >
            More
          </span>
        </NavLink>
      </div>
    </nav>
  )
}

import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { secondaryNav } from '../config/navigation'

export function More() {
  return (
    <PageTransition>
      <div className="px-4 sm:px-6 pt-5 pb-6 lg:hidden">
        <h1 className="text-[22px] font-bold text-ink-primary tracking-tight mb-6">More</h1>
        <div className="glass rounded-2xl divide-y divide-white/8 overflow-hidden">
          {secondaryNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="focus-ring flex items-center gap-3 px-4 py-4 hover:bg-white/5 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-accent-500/15 text-accent-400 flex items-center justify-center shrink-0">
                <item.icon size={17} />
              </div>
              <span className="flex-1 text-[14.5px] font-medium text-ink-primary">{item.label}</span>
              <ChevronRight size={16} className="text-ink-tertiary" />
            </Link>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}

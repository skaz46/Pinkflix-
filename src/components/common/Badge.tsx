import type { ReactNode } from 'react'
import clsx from 'clsx'

interface BadgeProps {
  children: ReactNode
  tone?: 'neutral' | 'accent' | 'success'
  size?: 'xs' | 'sm'
}

export function Badge({ children, tone = 'neutral', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium tracking-wide whitespace-nowrap',
        size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        tone === 'neutral' && 'bg-white/8 text-ink-secondary',
        tone === 'accent' && 'bg-accent-500/15 text-accent-300 ring-1 ring-inset ring-accent-500/30',
        tone === 'success' && 'bg-emerald-500/15 text-emerald-300',
      )}
    >
      {children}
    </span>
  )
}

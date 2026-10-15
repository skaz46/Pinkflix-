import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center text-center py-20 px-6"
    >
      <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-accent-400 mb-5">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-ink-primary mb-1.5">{title}</h3>
      <p className="text-sm text-ink-tertiary max-w-xs leading-relaxed">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  )
}

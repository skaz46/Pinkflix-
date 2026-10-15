import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface StatCardProps {
  label: string
  value: string
  icon: ReactNode
  trend?: string
}

export function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-2xl p-4 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-xl bg-accent-500/15 text-accent-400 flex items-center justify-center">
          {icon}
        </div>
        {trend && <span className="text-[11px] font-medium text-emerald-400">{trend}</span>}
      </div>
      <div>
        <p className="text-[22px] font-bold text-ink-primary tracking-tight tabular-nums">{value}</p>
        <p className="text-[12px] text-ink-tertiary mt-0.5">{label}</p>
      </div>
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import clsx from 'clsx'

interface ToggleProps {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={clsx(
        'focus-ring relative w-12 h-7 rounded-full transition-colors duration-200 shrink-0',
        checked ? 'bg-accent-500' : 'bg-white/10',
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md"
        style={{ left: checked ? 'calc(100% - 26px)' : '2px' }}
      />
    </button>
  )
}

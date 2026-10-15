import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, XCircle } from 'lucide-react'
import { useToastStore } from '../../store/useToastStore'

const iconMap = {
  default: Info,
  success: CheckCircle2,
  error: XCircle,
}

const toneMap = {
  default: 'text-accent-400',
  success: 'text-emerald-400',
  error: 'text-red-400',
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div className="pointer-events-none fixed top-0 inset-x-0 z-[100] flex flex-col items-center gap-2 pt-safe px-4 pt-4">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = iconMap[toast.variant]
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={() => dismiss(toast.id)}
              className="pointer-events-auto glass-strong rounded-2xl shadow-card px-4 py-3 flex items-start gap-3 max-w-sm w-full cursor-pointer"
            >
              <Icon size={18} className={`shrink-0 mt-0.5 ${toneMap[toast.variant]}`} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink-primary leading-tight">{toast.title}</p>
                {toast.description && (
                  <p className="text-xs text-ink-tertiary mt-0.5 leading-snug">{toast.description}</p>
                )}
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

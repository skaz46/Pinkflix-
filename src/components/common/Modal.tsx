import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { IconButton } from './IconButton'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90]"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[91] flex items-end sm:items-center justify-center p-0 sm:p-6 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={title}
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
              className="pointer-events-auto glass-strong w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[86dvh] flex flex-col overflow-hidden shadow-card pb-safe"
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
                <h2 className="text-lg font-semibold text-ink-primary">{title}</h2>
                <IconButton label="Close" size="sm" onClick={onClose}>
                  <X size={16} />
                </IconButton>
              </div>
              <div className="overflow-y-auto px-5 pb-5 scrollbar-none">{children}</div>
              {footer && <div className="px-5 py-4 border-t border-white/8 shrink-0">{footer}</div>}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

type ConflictingHandlers = 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, ConflictingHandlers> {
  children: ReactNode
  variant?: 'glass' | 'solid' | 'ghost'
  active?: boolean
  size?: 'sm' | 'md' | 'lg'
  label: string
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

export function IconButton({
  children,
  variant = 'glass',
  active = false,
  size = 'md',
  label,
  className,
  ...props
}: IconButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      className={clsx(
        'focus-ring inline-flex items-center justify-center rounded-full shrink-0 transition-colors duration-200',
        sizeMap[size],
        variant === 'glass' && 'glass text-ink-primary hover:bg-white/10',
        variant === 'ghost' && 'text-ink-secondary hover:text-ink-primary hover:bg-white/5',
        variant === 'solid' && 'bg-accent-500 text-white hover:bg-accent-600',
        active && 'text-accent-400',
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}

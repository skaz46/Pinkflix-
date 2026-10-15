import clsx from 'clsx'
import type { SortOption } from '../../types'

const options: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest' },
  { value: 'quality', label: 'Top Rated' },
  { value: 'duration', label: 'Duration' },
]

interface SortMenuProps {
  value: SortOption
  onChange: (v: SortOption) => void
}

export function SortMenu({ value, onChange }: SortMenuProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={clsx(
            'focus-ring shrink-0 px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-colors duration-200',
            value === opt.value
              ? 'bg-accent-500 text-white'
              : 'bg-white/6 text-ink-secondary hover:bg-white/10 hover:text-ink-primary',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

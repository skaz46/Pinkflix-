import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
}

export function SearchBar({ value, onChange, placeholder = 'Search titles, tags, studios…', autoFocus }: SearchBarProps) {
  return (
    <div className="relative">
      <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-tertiary pointer-events-none" />
      <input
        type="text"
        inputMode="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="focus-ring w-full glass rounded-2xl pl-11 pr-10 py-3 text-[15px] text-ink-primary placeholder:text-ink-tertiary outline-none transition-shadow duration-200 focus:ring-1 focus:ring-accent-500/50"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-ink-secondary hover:text-ink-primary"
        >
          <X size={13} />
        </button>
      )}
    </div>
  )
}

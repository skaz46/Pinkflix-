import { AnimatePresence, motion } from 'framer-motion'
import { X, RotateCcw } from 'lucide-react'
import clsx from 'clsx'
import type { DurationFilter, FilterState, Resolution, Tag } from '../../types'
import { defaultFilters } from '../../utils/catalogQuery'

interface FilterDrawerProps {
  open: boolean
  onClose: () => void
  filters: FilterState
  onChange: (filters: FilterState) => void
  availableTags: Tag[]
  resultCount: number
}

const resolutions: Resolution[] = ['720p', '1080p', '4K', '4K HDR']
const durationOptions: { value: DurationFilter; label: string }[] = [
  { value: 'any', label: 'Any length' },
  { value: 'short', label: 'Under 30m' },
  { value: 'medium', label: '30–90m' },
  { value: 'long', label: 'Over 90m' },
]
const dateOptions: { value: FilterState['dateAdded']; label: string }[] = [
  { value: 'any', label: 'Anytime' },
  { value: '7d', label: 'Past week' },
  { value: '30d', label: 'Past month' },
  { value: '90d', label: 'Past 3 months' },
]

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'focus-ring px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-colors duration-200 border',
        active
          ? 'bg-accent-500/15 border-accent-500/50 text-accent-300'
          : 'bg-white/5 border-white/8 text-ink-secondary hover:text-ink-primary hover:bg-white/10',
      )}
    >
      {children}
    </button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-5 border-b border-white/8">
      <h3 className="text-[13px] font-semibold text-ink-primary mb-3">{title}</h3>
      {children}
    </div>
  )
}

export function FilterDrawer({ open, onClose, filters, onChange, availableTags, resultCount }: FilterDrawerProps) {
  function toggleResolution(r: Resolution) {
    onChange({
      ...filters,
      resolutions: filters.resolutions.includes(r)
        ? filters.resolutions.filter((x) => x !== r)
        : [...filters.resolutions, r],
    })
  }

  function toggleTag(t: Tag) {
    onChange({
      ...filters,
      tags: filters.tags.includes(t) ? filters.tags.filter((x) => x !== t) : [...filters.tags, t],
    })
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90]"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            className="fixed z-[91] bottom-0 inset-x-0 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[420px] sm:max-w-[90vw] glass-strong sm:rounded-l-3xl rounded-t-3xl max-h-[88dvh] sm:max-h-none sm:h-full flex flex-col pb-safe"
            style={{ transformOrigin: 'bottom' }}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-2 shrink-0">
              <h2 className="text-lg font-semibold text-ink-primary">Filters</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onChange(defaultFilters)}
                  className="focus-ring flex items-center gap-1 text-[12.5px] font-medium text-ink-tertiary hover:text-ink-primary px-2 py-1 rounded-full"
                >
                  <RotateCcw size={12} /> Reset
                </button>
                <button
                  onClick={onClose}
                  aria-label="Close filters"
                  className="focus-ring w-8 h-8 rounded-full glass flex items-center justify-center"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto px-5 flex-1 scrollbar-none">
              <Section title="Resolution">
                <div className="flex flex-wrap gap-2">
                  {resolutions.map((r) => (
                    <Chip key={r} active={filters.resolutions.includes(r)} onClick={() => toggleResolution(r)}>
                      {r}
                    </Chip>
                  ))}
                </div>
              </Section>

              <Section title="Tags">
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((t) => (
                    <Chip key={t} active={filters.tags.includes(t)} onClick={() => toggleTag(t)}>
                      {t}
                    </Chip>
                  ))}
                </div>
              </Section>

              <Section title="Duration">
                <div className="flex flex-wrap gap-2">
                  {durationOptions.map((d) => (
                    <Chip
                      key={d.value}
                      active={filters.duration === d.value}
                      onClick={() => onChange({ ...filters, duration: d.value })}
                    >
                      {d.label}
                    </Chip>
                  ))}
                </div>
              </Section>

              <Section title={`Minimum quality — ${filters.minQuality}`}>
                <input
                  type="range"
                  min={0}
                  max={95}
                  step={5}
                  value={filters.minQuality}
                  onChange={(e) => onChange({ ...filters, minQuality: Number(e.target.value) })}
                  className="w-full accent-accent-500"
                />
              </Section>

              <Section title="Date added">
                <div className="flex flex-wrap gap-2">
                  {dateOptions.map((d) => (
                    <Chip
                      key={d.value}
                      active={filters.dateAdded === d.value}
                      onClick={() => onChange({ ...filters, dateAdded: d.value })}
                    >
                      {d.label}
                    </Chip>
                  ))}
                </div>
              </Section>

              <div className="py-5 flex items-center justify-between">
                <span className="text-[13px] font-medium text-ink-primary">Favorites only</span>
                <button
                  role="switch"
                  aria-checked={filters.favoritesOnly}
                  onClick={() => onChange({ ...filters, favoritesOnly: !filters.favoritesOnly })}
                  className={clsx(
                    'relative w-12 h-7 rounded-full transition-colors duration-200',
                    filters.favoritesOnly ? 'bg-accent-500' : 'bg-white/10',
                  )}
                >
                  <span
                    className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-200"
                    style={{ left: filters.favoritesOnly ? 'calc(100% - 26px)' : '2px' }}
                  />
                </button>
              </div>
            </div>

            <div className="shrink-0 px-5 py-4 border-t border-white/8">
              <button
                onClick={onClose}
                className="focus-ring w-full rounded-2xl bg-accent-500 hover:bg-accent-600 text-white font-semibold text-[14.5px] py-3 transition-colors duration-200"
              >
                Show {resultCount} {resultCount === 1 ? 'title' : 'titles'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { History as HistoryIcon, Trash2 } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { HistoryRow } from '../components/video/HistoryRow'
import { EmptyState } from '../components/common/EmptyState'
import { Modal } from '../components/common/Modal'
import { catalogById } from '../data/catalog'
import { useLibraryStore } from '../store/useLibraryStore'
import { useToastStore } from '../store/useToastStore'
import { daysSince } from '../utils/format'

function groupLabel(days: number): string {
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days <= 7) return 'This week'
  if (days <= 30) return 'This month'
  return 'Earlier'
}

export function History() {
  const history = useLibraryStore((s) => s.history)
  const removeHistoryEntry = useLibraryStore((s) => s.removeHistoryEntry)
  const clearHistory = useLibraryStore((s) => s.clearHistory)
  const pushToast = useToastStore((s) => s.push)
  const [confirmClear, setConfirmClear] = useState(false)

  const grouped = useMemo(() => {
    const sorted = [...history].sort((a, b) => +new Date(b.watchedAt) - +new Date(a.watchedAt))
    const groups = new Map<string, typeof sorted>()
    for (const entry of sorted) {
      const label = groupLabel(daysSince(entry.watchedAt))
      const list = groups.get(label) ?? []
      list.push(entry)
      groups.set(label, list)
    }
    return groups
  }, [history])

  return (
    <PageTransition>
      <div className="px-4 sm:px-6 pt-5 pb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-[22px] font-bold text-ink-primary tracking-tight">History</h1>
          {history.length > 0 && (
            <button
              onClick={() => setConfirmClear(true)}
              className="focus-ring flex items-center gap-1.5 text-[12.5px] font-medium text-ink-tertiary hover:text-red-400 px-2 py-1 rounded-full transition-colors"
            >
              <Trash2 size={13} /> Clear all
            </button>
          )}
        </div>
        <p className="text-[13.5px] text-ink-tertiary mb-4">Everything you&rsquo;ve watched, in one place</p>

        {history.length === 0 ? (
          <EmptyState
            icon={<HistoryIcon size={24} />}
            title="No watch history yet"
            description="Titles you play will appear here automatically, so you can always find your way back."
          />
        ) : (
          <div className="divide-y divide-white/8">
            {Array.from(grouped.entries()).map(([label, entries]) => (
              <div key={label} className="py-3 first:pt-0">
                <h2 className="text-[12.5px] font-semibold text-ink-tertiary uppercase tracking-wide mb-1">
                  {label}
                </h2>
                <AnimatePresence initial={false}>
                  {entries.map((entry) => {
                    const item = catalogById.get(entry.videoId)
                    if (!item) return null
                    return (
                      <HistoryRow
                        key={`${entry.videoId}-${entry.watchedAt}`}
                        item={item}
                        entry={entry}
                        onRemove={() => {
                          removeHistoryEntry(entry.videoId)
                          pushToast({ title: 'Removed from history', variant: 'default' })
                        }}
                      />
                    )
                  })}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Clear all history?"
        footer={
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmClear(false)}
              className="focus-ring flex-1 rounded-2xl bg-white/8 hover:bg-white/12 text-ink-primary font-semibold text-[14.5px] py-3 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                clearHistory()
                setConfirmClear(false)
                pushToast({ title: 'History cleared', variant: 'default' })
              }}
              className="focus-ring flex-1 rounded-2xl bg-red-500/90 hover:bg-red-500 text-white font-semibold text-[14.5px] py-3 transition-colors"
            >
              Clear
            </button>
          </div>
        }
      >
        <p className="text-[13.5px] text-ink-secondary leading-relaxed">
          This removes every entry from your watch history, including progress on titles you haven&rsquo;t finished.
        </p>
      </Modal>
    </PageTransition>
  )
}

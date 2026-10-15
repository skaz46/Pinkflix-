import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { HistoryEntry, VideoItem } from '../../types'
import { formatRelativeTime, formatShortDuration } from '../../utils/format'
import { Thumbnail } from './Thumbnail'

interface HistoryRowProps {
  item: VideoItem
  entry: HistoryEntry
  onRemove: () => void
}

export function HistoryRow({ item, entry, onRemove }: HistoryRowProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-3 py-2.5"
    >
      <Link to={`/title/${item.id}`} className="focus-ring shrink-0 rounded-xl">
        <Thumbnail item={item} className="w-24 h-14 rounded-xl" iconClassName="w-8 h-8 -bottom-1 -right-1" />
      </Link>
      <Link to={`/title/${item.id}`} className="focus-ring flex-1 min-w-0">
        <p className="text-[13.5px] font-medium text-ink-primary line-clamp-1">{item.title}</p>
        <p className="text-[11.5px] text-ink-tertiary mt-0.5">
          {entry.progress >= 0.9 ? 'Watched' : `${Math.round(entry.progress * 100)}% watched`} &middot;{' '}
          {formatRelativeTime(entry.watchedAt)}
        </p>
        <div className="mt-1.5 h-1 w-full max-w-[220px] rounded-full bg-white/8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-400 to-accent-600"
            style={{ width: `${Math.min(entry.progress, 1) * 100}%` }}
          />
        </div>
      </Link>
      <span className="text-[11px] text-ink-tertiary tabular-nums shrink-0 hidden sm:block">
        {formatShortDuration(item.durationSec)}
      </span>
      <button
        onClick={onRemove}
        aria-label="Remove from history"
        className="focus-ring w-8 h-8 rounded-full flex items-center justify-center text-ink-tertiary hover:text-ink-primary hover:bg-white/5 shrink-0 transition-colors"
      >
        <X size={15} />
      </button>
    </motion.div>
  )
}

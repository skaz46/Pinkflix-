import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { VideoItem } from '../../types'
import { VideoCard } from './VideoCard'

interface RowProps {
  title: string
  items: VideoItem[]
  seeAllHref?: string
  progressFor?: (id: string) => number | undefined
  emptyHint?: ReactNode
}

export function Row({ title, items, seeAllHref, progressFor, emptyHint }: RowProps) {
  if (items.length === 0 && emptyHint) {
    return (
      <section className="mb-8">
        <div className="flex items-center justify-between px-4 sm:px-6 mb-3">
          <h2 className="text-[17px] font-semibold text-ink-primary tracking-tight">{title}</h2>
        </div>
        <div className="px-4 sm:px-6">{emptyHint}</div>
      </section>
    )
  }

  if (items.length === 0) return null

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between px-4 sm:px-6 mb-3">
        <h2 className="text-[17px] font-semibold text-ink-primary tracking-tight">{title}</h2>
        {seeAllHref && (
          <Link
            to={seeAllHref}
            className="focus-ring rounded-full flex items-center gap-0.5 text-[13px] font-medium text-ink-tertiary hover:text-accent-400 transition-colors"
          >
            See all <ChevronRight size={14} />
          </Link>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-none px-4 sm:px-6 pb-1 snap-x">
        {items.map((item, i) => (
          <div key={item.id} className="snap-start">
            <VideoCard item={item} variant="row" progress={progressFor?.(item.id)} index={i} />
          </div>
        ))}
      </div>
    </section>
  )
}

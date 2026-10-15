import type { VideoItem } from '../../types'
import { primaryTagIcon } from '../../utils/tagIcon'
import clsx from 'clsx'

interface ThumbnailProps {
  item: VideoItem
  className?: string
  iconClassName?: string
}

export function Thumbnail({ item, className, iconClassName }: ThumbnailProps) {
  const Icon = primaryTagIcon(item.tags)
  const [from, to] = item.gradient
  return (
    <div
      className={clsx('relative overflow-hidden', className)}
      style={{
        background: `radial-gradient(120% 140% at 20% 15%, ${from}55 0%, transparent 55%), linear-gradient(155deg, ${from} 0%, ${to} 100%)`,
      }}
    >
      <Icon
        className={clsx('absolute text-white/15', iconClassName)}
        strokeWidth={1.25}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)' }}
      />
    </div>
  )
}

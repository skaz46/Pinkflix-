import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Star } from 'lucide-react'
import clsx from 'clsx'
import type { VideoItem } from '../../types'
import { formatShortDuration } from '../../utils/format'
import { useLibraryStore } from '../../store/useLibraryStore'
import { useToastStore } from '../../store/useToastStore'
import { Thumbnail } from './Thumbnail'

interface VideoCardProps {
  item: VideoItem
  progress?: number
  variant?: 'grid' | 'row'
  index?: number
}

function VideoCardImpl({ item, progress, variant = 'grid', index = 0 }: VideoCardProps) {
  const isFavorite = useLibraryStore((s) => s.isFavorite(item.id))
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite)
  const pushToast = useToastStore((s) => s.push)

  function handleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(item.id)
    pushToast({
      title: isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
      description: item.title,
      variant: 'success',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className={clsx(variant === 'row' ? 'w-[168px] sm:w-[200px] shrink-0' : 'w-full')}
    >
      <Link to={`/title/${item.id}`} className="group block focus-ring rounded-2xl">
        <motion.div
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          className="relative"
        >
          <Thumbnail
            item={item}
            className="aspect-video w-full rounded-2xl shadow-card ring-1 ring-white/10 group-hover:ring-accent-500/40 transition-shadow duration-300"
            iconClassName="w-14 h-14 -bottom-2 -right-2"
          />

          <button
            onClick={handleFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200"
          >
            <Heart size={15} className={isFavorite ? 'fill-accent-500 text-accent-500' : 'text-white'} />
          </button>

          <div className="absolute top-2.5 left-2.5 px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-[10px] font-semibold tracking-wide text-white">
            {item.resolution}
          </div>

          <div className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-[10px] font-medium text-white/90">
            {item.episodeCount ? `${item.episodeCount} eps` : formatShortDuration(item.durationSec)}
          </div>

          {typeof progress === 'number' && progress > 0 && (
            <div className="absolute bottom-0 inset-x-0 h-1 bg-black/40 rounded-b-2xl overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-400 to-accent-600"
                style={{ width: `${Math.min(progress, 1) * 100}%` }}
              />
            </div>
          )}
        </motion.div>

        <div className="mt-2.5 px-0.5">
          <h3 className="text-[13.5px] font-medium text-ink-primary leading-snug line-clamp-1">
            {item.title}
          </h3>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-ink-tertiary">
            <Star size={11} className="fill-accent-400 text-accent-400" />
            <span>{(item.rating / 10).toFixed(1)}</span>
            <span className="text-ink-tertiary/50">&middot;</span>
            <span className="line-clamp-1">{item.tags[0]}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export const VideoCard = memo(VideoCardImpl)

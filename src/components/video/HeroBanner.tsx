import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Plus, Check, Info, Star } from 'lucide-react'
import type { VideoItem } from '../../types'
import { formatDuration } from '../../utils/format'
import { primaryTagIcon } from '../../utils/tagIcon'
import { useLibraryStore } from '../../store/useLibraryStore'
import { useToastStore } from '../../store/useToastStore'
import { PlayerOverlay } from './PlayerOverlay'

interface HeroBannerProps {
  item: VideoItem
}

export function HeroBanner({ item }: HeroBannerProps) {
  const [playing, setPlaying] = useState(false)
  const isFavorite = useLibraryStore((s) => s.isFavorite(item.id))
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite)
  const pushToast = useToastStore((s) => s.push)
  const Icon = primaryTagIcon(item.tags)
  const [from, to] = item.gradient

  return (
    <>
      <section className="relative mx-4 sm:mx-6 mt-3 rounded-3xl overflow-hidden shadow-card ring-1 ring-white/10">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(150deg, ${from} 0%, ${to} 75%)` }}
        />
        {/* Signature ambient stage-light glow */}
        <motion.div
          aria-hidden
          className="absolute -top-24 left-1/3 w-[420px] h-[420px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${from}66 0%, transparent 70%)` }}
          animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <Icon
          className="absolute -right-6 -bottom-10 w-56 h-56 text-white/10"
          strokeWidth={1}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.15) 100%)' }}
        />

        <div className="relative px-5 sm:px-8 pt-10 pb-6 sm:pt-16 sm:pb-8 flex flex-col justify-end min-h-[280px] sm:min-h-[360px]">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-sm text-[11px] font-semibold tracking-wide text-white uppercase">
              Featured
            </span>
            <span className="flex items-center gap-1 text-[12px] text-white/85">
              <Star size={12} className="fill-accent-300 text-accent-300" />
              {(item.rating / 10).toFixed(1)}
            </span>
          </div>

          <h1 className="text-[28px] sm:text-[40px] font-bold text-white tracking-tight leading-[1.05] max-w-lg drop-shadow-sm">
            {item.title}
          </h1>

          <p className="mt-3 text-[13.5px] sm:text-[15px] text-white/80 max-w-md leading-relaxed line-clamp-2 sm:line-clamp-3">
            {item.description}
          </p>

          <div className="mt-2 flex items-center gap-2 text-[12.5px] text-white/70">
            <span>{item.resolution}</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span>{formatDuration(item.durationSec)}</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span>{item.tags.slice(0, 2).join(', ')}</span>
          </div>

          <div className="mt-5 flex items-center gap-2.5">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setPlaying(true)}
              className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-white text-black font-semibold text-[14px] px-5 py-2.5 shadow-lg"
            >
              <Play size={16} className="fill-black" /> Play
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                toggleFavorite(item.id)
                pushToast({
                  title: isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
                  description: item.title,
                  variant: 'success',
                })
              }}
              className="focus-ring w-11 h-11 rounded-full glass flex items-center justify-center text-white"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? <Check size={18} /> : <Plus size={18} />}
            </motion.button>
            <Link
              to={`/title/${item.id}`}
              className="focus-ring w-11 h-11 rounded-full glass flex items-center justify-center text-white"
              aria-label="More info"
            >
              <Info size={18} />
            </Link>
          </div>
        </div>
      </section>

      {playing && <PlayerOverlay item={item} onClose={() => setPlaying(false)} />}
    </>
  )
}

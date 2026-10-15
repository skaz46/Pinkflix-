import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Compass, FolderPlus, Heart, Play, Star } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { PlayerOverlay } from '../components/video/PlayerOverlay'
import { Row } from '../components/video/Row'
import { Badge } from '../components/common/Badge'
import { EmptyState } from '../components/common/EmptyState'
import { AddToCollectionSheet } from '../components/collections/AddToCollectionSheet'
import { catalog, catalogById } from '../data/catalog'
import { primaryTagIcon } from '../utils/tagIcon'
import { formatDate, formatDuration } from '../utils/format'
import { useLibraryStore } from '../store/useLibraryStore'
import { useToastStore } from '../store/useToastStore'

export function TitleDetail() {
  const { videoId } = useParams<{ videoId: string }>()
  const navigate = useNavigate()
  const item = videoId ? catalogById.get(videoId) : undefined

  const isFavorite = useLibraryStore((s) => (item ? s.isFavorite(item.id) : false))
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite)
  const history = useLibraryStore((s) => s.history)
  const pushToast = useToastStore((s) => s.push)

  const [playing, setPlaying] = useState(false)
  const [addToCollectionOpen, setAddToCollectionOpen] = useState(false)

  const related = useMemo(() => {
    if (!item) return []
    return catalog
      .filter((c) => c.id !== item.id && c.tags.some((t) => item.tags.includes(t)))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10)
  }, [item])

  if (!item) {
    return (
      <PageTransition>
        <div className="px-4 sm:px-6 pt-16">
          <EmptyState
            icon={<Compass size={24} />}
            title="Title not found"
            description="This title may no longer be available in the catalog."
            action={
              <Link to="/" className="focus-ring text-accent-400 text-[13.5px] font-semibold">
                Back to Home
              </Link>
            }
          />
        </div>
      </PageTransition>
    )
  }

  const entry = history.find((h) => h.videoId === item.id)
  const Icon = primaryTagIcon(item.tags)
  const [from, to] = item.gradient

  return (
    <PageTransition>
      <div className="relative mx-4 sm:mx-6 mt-3 rounded-3xl overflow-hidden shadow-card ring-1 ring-white/10">
        <div className="absolute inset-0" style={{ background: `linear-gradient(150deg, ${from} 0%, ${to} 100%)` }} />
        <motion.div
          aria-hidden
          className="absolute -top-20 left-1/4 w-[380px] h-[380px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${from}55 0%, transparent 70%)` }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <Icon className="absolute -right-6 -bottom-10 w-52 h-52 text-white/10" strokeWidth={1} />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.15) 100%)' }}
        />

        <div className="relative px-5 sm:px-8 pt-8 pb-6 sm:pt-10 sm:pb-8 min-h-[260px] flex flex-col justify-end">
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="absolute top-5 left-5 sm:left-8 w-9 h-9 rounded-full glass flex items-center justify-center text-white"
          >
            <ArrowLeft size={17} />
          </button>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {item.tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>

          <h1 className="text-[26px] sm:text-[36px] font-bold text-white tracking-tight leading-[1.05] max-w-lg">
            {item.title}
          </h1>

          <div className="mt-3 flex items-center flex-wrap gap-x-3 gap-y-1 text-[12.5px] text-white/75">
            <span className="flex items-center gap-1">
              <Star size={12} className="fill-accent-300 text-accent-300" /> {(item.rating / 10).toFixed(1)}
            </span>
            <span>{item.resolution}</span>
            <span>{item.episodeCount ? `${item.episodeCount} episodes` : formatDuration(item.durationSec)}</span>
            <span>{formatDate(item.releaseDate)}</span>
            <span>{item.studio}</span>
          </div>

          <div className="mt-5 flex items-center gap-2.5">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setPlaying(true)}
              className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-white text-black font-semibold text-[14px] px-5 py-2.5 shadow-lg"
            >
              <Play size={16} className="fill-black" /> {entry && entry.progress > 0.02 && entry.progress < 0.95 ? 'Resume' : 'Play'}
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
              {isFavorite ? <Check size={18} /> : <Heart size={18} />}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setAddToCollectionOpen(true)}
              className="focus-ring w-11 h-11 rounded-full glass flex items-center justify-center text-white"
              aria-label="Add to collection"
            >
              <FolderPlus size={18} />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6">
        <h2 className="text-[15px] font-semibold text-ink-primary mb-2">Synopsis</h2>
        <p className="text-[14px] text-ink-secondary leading-relaxed max-w-2xl">{item.description}</p>
      </div>

      {related.length > 0 && <Row title="More like this" items={related} />}

      {playing && <PlayerOverlay item={item} onClose={() => setPlaying(false)} />}
      <AddToCollectionSheet
        open={addToCollectionOpen}
        onClose={() => setAddToCollectionOpen(false)}
        videoId={item.id}
      />
    </PageTransition>
  )
}

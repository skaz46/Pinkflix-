import { memo } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Play } from 'lucide-react'
import type { YouTubeVideo } from '../../services/youtube'

interface YouTubeVideoCardProps {
  video: YouTubeVideo
  onPlay: (video: YouTubeVideo) => void
}

function YouTubeVideoCardImpl({
  video,
  onPlay,
}: YouTubeVideoCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="w-full min-w-0"
    >
      <button
        type="button"
        onClick={() => onPlay(video)}
        className="focus-ring group block w-full text-left rounded-2xl"
        aria-label={`Play ${video.title}`}
      >
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 group-hover:ring-accent-500/50 transition-all">
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/40">
              No thumbnail
            </div>
          )}

          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <span className="w-12 h-12 rounded-full bg-accent-500/95 text-white flex items-center justify-center shadow-lg opacity-90 group-hover:scale-110 transition-transform">
              <Play size={21} fill="currentColor" className="ml-0.5" />
            </span>
          </div>

          <span className="absolute top-2 left-2 rounded-md bg-black/75 px-2 py-1 text-[10px] font-bold text-white">
            YOUTUBE
          </span>
        </div>

        <div className="mt-2.5 px-0.5">
          <h3 className="text-[13.5px] font-semibold text-ink-primary leading-snug line-clamp-2">
            {video.title}
          </h3>

          <p className="mt-1 text-[11.5px] text-ink-tertiary line-clamp-1">
            {video.channelTitle}
          </p>

          <p className="mt-1 text-[10.5px] text-ink-tertiary/80">
            {video.publishedAt
              ? new Date(video.publishedAt).toLocaleDateString()
              : 'YouTube video'}
          </p>
        </div>
      </button>

      <a
        href={`https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-ink-tertiary hover:text-accent-400 transition-colors"
      >
        <ExternalLink size={12} />
        Open on YouTube
      </a>
    </motion.article>
  )
}

export const YouTubeVideoCard = memo(YouTubeVideoCardImpl)

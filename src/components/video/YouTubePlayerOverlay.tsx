
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, X } from 'lucide-react'
import type { YouTubeVideo } from '../../services/youtube'

interface YouTubePlayerOverlayProps {
  video: YouTubeVideo
  onClose: () => void
}

export function YouTubePlayerOverlay({
  video,
  onClose,
}: YouTubePlayerOverlayProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label={video.title}
      >
        <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold tracking-[0.2em] text-accent-400">
              NOW PLAYING
            </p>
            <h2 className="mt-1 text-sm sm:text-base font-semibold text-white truncate">
              {video.title}
            </h2>
            <p className="text-xs text-white/50 truncate">
              {video.channelTitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close player"
            className="focus-ring shrink-0 w-10 h-10 rounded-full glass flex items-center justify-center text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 min-h-0 flex items-center justify-center px-3 sm:px-8 pb-4">
          <div className="w-full max-w-6xl">
            <div className="relative aspect-video overflow-hidden rounded-xl sm:rounded-2xl bg-black ring-1 ring-white/10">
              <iframe
                key={video.id}
                src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}?autoplay=1&playsinline=1&rel=0`}
                title={video.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            <a
              href={`https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/15 px-4 py-2.5 text-sm text-white transition-colors"
            >
              <ExternalLink size={15} />
              Having trouble? Watch on YouTube
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  )
}

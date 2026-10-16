import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, LoaderCircle, X } from 'lucide-react'
import type { Playback, SourceVideo, VideoSource } from '../../sources/types'

interface SourcePlayerOverlayProps {
  video: SourceVideo
  source: VideoSource | undefined
  onClose: () => void
}

export function SourcePlayerOverlay({
  video,
  source,
  onClose,
}: SourcePlayerOverlayProps) {
  const [playback, setPlayback] = useState<Playback | null>(null)
  const [error, setError] = useState('')
  const label = source?.label ?? video.sourceId
  const message = source ? error : 'This video source is no longer available.'

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  useEffect(() => {
    if (!source) return

    let cancelled = false

    source
      .getPlayback(video)
      .then((result) => {
        if (!cancelled) setPlayback(result)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Unable to load this video.',
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [source, video])

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
            {video.subtitle && (
              <p className="text-xs text-white/50 truncate">
                {video.subtitle}
              </p>
            )}
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
              {playback?.kind === 'embed' && !message ? (
                <iframe
                  key={video.id}
                  src={playback.url}
                  title={video.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                  {message || playback ? (
                    <p className="text-sm text-white/70 break-words">
                      {message || "This video can't be played inside PinkFlix."}
                    </p>
                  ) : (
                    <LoaderCircle
                      size={28}
                      className="animate-spin text-accent-400"
                    />
                  )}
                </div>
              )}
            </div>

            {video.webUrl && (
              <a
                href={video.webUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/15 px-4 py-2.5 text-sm text-white transition-colors"
              >
                <ExternalLink size={15} />
                Having trouble? Watch on {label}
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  )
}

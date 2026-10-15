import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { Pause, Play, RotateCcw, RotateCw, X } from 'lucide-react'
import type { VideoItem } from '../../types'
import { clamp, formatShortDuration } from '../../utils/format'
import { useLibraryStore } from '../../store/useLibraryStore'
import { useToastStore } from '../../store/useToastStore'
import { useSettingsStore } from '../../store/useSettingsStore'

interface PlayerOverlayProps {
  item: VideoItem
  onClose: () => void
}

export function PlayerOverlay({ item, onClose }: PlayerOverlayProps) {
  const history = useLibraryStore((s) => s.history)
  const recordProgress = useLibraryStore((s) => s.recordProgress)
  const pushToast = useToastStore((s) => s.push)
  const autoplay = useSettingsStore((s) => s.autoplay)

  const existing = history.find((h) => h.videoId === item.id)
  const [progress, setProgress] = useState(existing && existing.progress < 0.98 ? existing.progress : 0)
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isPlaying) return
    const step = 0.5 / item.durationSec // half-second tick, simulated playback speed
    const id = setInterval(() => {
      setProgress((p) => {
        const next = p + step
        if (next >= 1) {
          clearInterval(id)
          setIsPlaying(false)
          return 1
        }
        return next
      })
    }, 500)
    return () => clearInterval(id)
  }, [isPlaying, item.durationSec])

  function handleClose() {
    recordProgress(item.id, progress)
    if (progress >= 0.98) {
      pushToast({ title: 'Marked as watched', description: item.title, variant: 'success' })
    } else if (progress > 0.02) {
      pushToast({ title: 'Progress saved', description: `${item.title} · added to Continue Watching`, variant: 'default' })
    }
    onClose()
  }

  function seekBy(deltaSec: number) {
    setProgress((p) => clamp(p + deltaSec / item.durationSec, 0, 1))
  }

  function seekToClientX(clientX: number) {
    const bar = barRef.current
    if (!bar) return
    const rect = bar.getBoundingClientRect()
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
    setProgress(ratio)
  }

  const elapsed = Math.round(progress * item.durationSec)
  const [from, to] = item.gradient

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col"
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{ background: `radial-gradient(120% 90% at 50% 0%, ${from}55 0%, transparent 60%), linear-gradient(180deg, ${to} 0%, #000 100%)` }}
      />

      <div className="relative flex items-center justify-between px-4 sm:px-6 pt-safe pt-5 pb-3">
        <button
          onClick={handleClose}
          aria-label="Close player"
          className="focus-ring w-9 h-9 rounded-full glass flex items-center justify-center text-white"
        >
          <X size={17} />
        </button>
        <p className="text-[13px] font-medium text-white/70 truncate max-w-[60%]">{item.title}</p>
        <div className="w-9" />
      </div>

      <div className="relative flex-1 flex items-center justify-center px-8">
        <motion.button
          key={isPlaying ? 'pause' : 'play'}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsPlaying((v) => !v)}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="focus-ring w-20 h-20 rounded-full glass-strong flex items-center justify-center text-white shadow-glow-lg"
        >
          {isPlaying ? <Pause size={30} className="fill-white" /> : <Play size={30} className="fill-white ml-1" />}
        </motion.button>
      </div>

      <div className="relative px-5 sm:px-8 pb-safe pb-8">
        <div className="flex items-center justify-center gap-8 mb-5">
          <button onClick={() => seekBy(-10)} aria-label="Back 10 seconds" className="focus-ring text-white/80 hover:text-white flex flex-col items-center gap-1">
            <RotateCcw size={22} />
            <span className="text-[10px]">10s</span>
          </button>
          <button onClick={() => seekBy(10)} aria-label="Forward 10 seconds" className="focus-ring text-white/80 hover:text-white flex flex-col items-center gap-1">
            <RotateCw size={22} />
            <span className="text-[10px]">10s</span>
          </button>
        </div>

        <div
          ref={barRef}
          onClick={(e) => seekToClientX(e.clientX)}
          className="relative h-1.5 rounded-full bg-white/15 cursor-pointer"
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent-400 to-accent-600"
            style={{ width: `${progress * 100}%` }}
          />
          <div
            className="absolute -top-1.5 w-4 h-4 rounded-full bg-white shadow-md"
            style={{ left: `calc(${progress * 100}% - 8px)` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[11.5px] text-white/60 tabular-nums">
          <span>{formatShortDuration(elapsed)}</span>
          <span>{formatShortDuration(item.durationSec)}</span>
        </div>
      </div>
    </motion.div>,
    document.body,
  )
}

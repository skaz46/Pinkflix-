import { useMemo } from 'react'
import { catalogById } from '../data/catalog'
import { useLibraryStore } from '../store/useLibraryStore'
import type { VideoItem } from '../types'

export function useContinueWatching(limit = 12): { item: VideoItem; progress: number }[] {
  const history = useLibraryStore((s) => s.history)

  return useMemo(() => {
    const latestByVideo = new Map<string, { watchedAt: string; progress: number }>()
    for (const h of history) {
      const existing = latestByVideo.get(h.videoId)
      if (!existing || new Date(h.watchedAt) > new Date(existing.watchedAt)) {
        latestByVideo.set(h.videoId, h)
      }
    }
    return Array.from(latestByVideo.entries())
      .filter(([, h]) => h.progress > 0.02 && h.progress < 0.95)
      .sort((a, b) => +new Date(b[1].watchedAt) - +new Date(a[1].watchedAt))
      .map(([videoId, h]) => ({ item: catalogById.get(videoId), progress: h.progress }))
      .filter((x): x is { item: VideoItem; progress: number } => Boolean(x.item))
      .slice(0, limit)
  }, [history, limit])
}

export function useRecentlyViewed(limit = 12): VideoItem[] {
  const history = useLibraryStore((s) => s.history)

  return useMemo(() => {
    const seen = new Set<string>()
    const ordered = [...history].sort((a, b) => +new Date(b.watchedAt) - +new Date(a.watchedAt))
    const items: VideoItem[] = []
    for (const h of ordered) {
      if (seen.has(h.videoId)) continue
      seen.add(h.videoId)
      const item = catalogById.get(h.videoId)
      if (item) items.push(item)
      if (items.length >= limit) break
    }
    return items
  }, [history, limit])
}

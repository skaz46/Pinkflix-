import { useMemo } from 'react'
import { catalog } from '../data/catalog'
import { useLibraryStore } from '../store/useLibraryStore'
import type { VideoItem } from '../types'

export function useRecommendations(limit = 10): VideoItem[] {
  const favorites = useLibraryStore((s) => s.favorites)
  const history = useLibraryStore((s) => s.history)

  return useMemo(() => {
    const seenIds = new Set([...favorites, ...history.map((h) => h.videoId)])
    const favoriteTags = new Map<string, number>()

    for (const id of favorites) {
      const item = catalog.find((c) => c.id === id)
      if (!item) continue
      for (const tag of item.tags) {
        favoriteTags.set(tag, (favoriteTags.get(tag) ?? 0) + 1)
      }
    }

    if (favoriteTags.size === 0) {
      return [...catalog].sort((a, b) => b.rating - a.rating).slice(0, limit)
    }

    const scored = catalog
      .filter((item) => !seenIds.has(item.id))
      .map((item) => {
        const overlap = item.tags.reduce((sum, t) => sum + (favoriteTags.get(t) ?? 0), 0)
        return { item, overlap }
      })
      .filter((s) => s.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap || b.item.rating - a.item.rating)

    return scored.slice(0, limit).map((s) => s.item)
  }, [favorites, history, limit])
}

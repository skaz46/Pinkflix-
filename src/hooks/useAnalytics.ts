import { useMemo } from 'react'
import { useLibraryStore } from '../store/useLibraryStore'
import { catalogById } from '../data/catalog'
import type { Tag } from '../types'

export interface DailyActivity {
  label: string
  minutes: number
}

export interface GenreSlice {
  tag: Tag
  count: number
}

export interface TopTitle {
  id: string
  title: string
  minutes: number
  gradient: [string, string]
}

export function useAnalytics() {
  const history = useLibraryStore((s) => s.history)
  const favorites = useLibraryStore((s) => s.favorites)
  const collections = useLibraryStore((s) => s.collections)

  return useMemo(() => {
    const totalWatchSec = history.reduce((sum, h) => {
      const item = catalogById.get(h.videoId)
      if (!item) return sum
      return sum + h.progress * item.durationSec
    }, 0)

    const uniqueWatched = new Set(history.filter((h) => h.progress > 0.05).map((h) => h.videoId))
    const completed = new Set(history.filter((h) => h.progress >= 0.9).map((h) => h.videoId))

    // Daily activity for the last 14 days
    const days: DailyActivity[] = []
    const dayBuckets = new Map<string, number>()
    for (const h of history) {
      const item = catalogById.get(h.videoId)
      if (!item) continue
      const key = new Date(h.watchedAt).toISOString().slice(0, 10)
      dayBuckets.set(key, (dayBuckets.get(key) ?? 0) + (h.progress * item.durationSec) / 60)
    }
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      days.push({
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        minutes: Math.round(dayBuckets.get(key) ?? 0),
      })
    }

    // Genre distribution across watched titles
    const genreCounts = new Map<Tag, number>()
    for (const videoId of uniqueWatched) {
      const item = catalogById.get(videoId)
      if (!item) continue
      for (const tag of item.tags) {
        genreCounts.set(tag, (genreCounts.get(tag) ?? 0) + 1)
      }
    }
    const genres: GenreSlice[] = Array.from(genreCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)

    // Top titles by total minutes watched
    const minutesByTitle = new Map<string, number>()
    for (const h of history) {
      const item = catalogById.get(h.videoId)
      if (!item) continue
      minutesByTitle.set(
        h.videoId,
        (minutesByTitle.get(h.videoId) ?? 0) + (h.progress * item.durationSec) / 60,
      )
    }
    const topTitles: TopTitle[] = Array.from(minutesByTitle.entries())
      .map(([id, minutes]) => {
        const item = catalogById.get(id)!
        return { id, title: item.title, minutes: Math.round(minutes), gradient: item.gradient }
      })
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 5)

    return {
      totalWatchMinutes: Math.round(totalWatchSec / 60),
      titlesWatched: uniqueWatched.size,
      titlesCompleted: completed.size,
      favoritesCount: favorites.length,
      collectionsCount: collections.length,
      dailyActivity: days,
      genres,
      topTitles,
      hasActivity: history.length > 0,
    }
  }, [history, favorites, collections])
}

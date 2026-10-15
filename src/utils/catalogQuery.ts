import type { FilterState, SortOption, VideoItem } from '../types'

export const defaultFilters: FilterState = {
  resolutions: [],
  tags: [],
  duration: 'any',
  minQuality: 0,
  favoritesOnly: false,
  dateAdded: 'any',
}

export function countActiveFilters(f: FilterState): number {
  let n = 0
  if (f.resolutions.length) n++
  if (f.tags.length) n++
  if (f.duration !== 'any') n++
  if (f.minQuality > 0) n++
  if (f.favoritesOnly) n++
  if (f.dateAdded !== 'any') n++
  return n
}

/** Score a single item against a query. Higher is better; 0 means no match. */
function scoreItem(item: VideoItem, q: string): number {
  const query = q.trim().toLowerCase()
  if (!query) return 1

  const title = item.title.toLowerCase()
  let score = 0

  if (title === query) score += 100
  else if (title.startsWith(query)) score += 60
  else if (title.includes(query)) score += 35

  if (item.tags.some((t) => t.toLowerCase() === query)) score += 40
  else if (item.tags.some((t) => t.toLowerCase().includes(query))) score += 18

  if (item.studio.toLowerCase().includes(query)) score += 12
  if (item.description.toLowerCase().includes(query)) score += 8

  return score
}

export function searchCatalog(items: VideoItem[], query: string): Map<string, number> {
  const scores = new Map<string, number>()
  for (const item of items) {
    const s = scoreItem(item, query)
    if (s > 0) scores.set(item.id, s)
  }
  return scores
}

function durationBucket(durationSec: number): 'short' | 'medium' | 'long' {
  const minutes = durationSec / 60
  if (minutes < 30) return 'short'
  if (minutes <= 90) return 'medium'
  return 'long'
}

const DAY_MS = 86_400_000

export function applyFilters(
  items: VideoItem[],
  filters: FilterState,
  favorites: string[],
): VideoItem[] {
  const now = Date.now()
  const dateThresholdDays =
    filters.dateAdded === '7d' ? 7 : filters.dateAdded === '30d' ? 30 : filters.dateAdded === '90d' ? 90 : null

  return items.filter((item) => {
    if (filters.resolutions.length && !filters.resolutions.includes(item.resolution)) return false
    if (filters.tags.length && !item.tags.some((t) => filters.tags.includes(t))) return false
    if (filters.duration !== 'any' && durationBucket(item.durationSec) !== filters.duration) return false
    if (item.rating < filters.minQuality) return false
    if (filters.favoritesOnly && !favorites.includes(item.id)) return false
    if (dateThresholdDays !== null) {
      const ageDays = (now - new Date(item.addedDate).getTime()) / DAY_MS
      if (ageDays > dateThresholdDays) return false
    }
    return true
  })
}

export function sortCatalog(
  items: VideoItem[],
  sort: SortOption,
  scores?: Map<string, number>,
): VideoItem[] {
  const copy = [...items]
  switch (sort) {
    case 'newest':
      return copy.sort((a, b) => +new Date(b.addedDate) - +new Date(a.addedDate))
    case 'quality':
      return copy.sort((a, b) => b.rating - a.rating)
    case 'duration':
      return copy.sort((a, b) => b.durationSec - a.durationSec)
    case 'relevance':
    default:
      if (!scores) return copy.sort((a, b) => b.rating - a.rating)
      return copy.sort((a, b) => (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0))
  }
}

export type Resolution = '720p' | '1080p' | '4K' | '4K HDR'

export type Tag =
  | 'Drama'
  | 'Thriller'
  | 'Concert Film'
  | 'Documentary'
  | 'Sci-Fi'
  | 'Anime'
  | 'Romance'
  | 'Action'
  | 'Music'
  | 'Comedy'
  | 'Behind the Scenes'
  | 'Mystery'
  | 'Fantasy'
  | 'Indie'

export interface VideoItem {
  id: string
  title: string
  description: string
  tags: Tag[]
  resolution: Resolution
  durationSec: number
  /** Editorial quality score out of 100, used for sorting/filtering by quality */
  rating: number
  releaseDate: string // ISO date
  addedDate: string // ISO date
  gradient: [string, string]
  episodeCount?: number
  studio: string
}

export interface Collection {
  id: string
  name: string
  description: string
  videoIds: string[]
  gradient: [string, string]
  createdAt: string
}

export interface HistoryEntry {
  videoId: string
  watchedAt: string // ISO date-time
  progress: number // 0..1
}

export type SortOption = 'relevance' | 'newest' | 'quality' | 'duration'

export type DurationFilter = 'any' | 'short' | 'medium' | 'long'

export interface FilterState {
  resolutions: Resolution[]
  tags: Tag[]
  duration: DurationFilter
  minQuality: number
  favoritesOnly: boolean
  dateAdded: 'any' | '7d' | '30d' | '90d'
}

export interface AppSettings {
  autoplay: boolean
  reduceMotion: boolean
  dataSaver: boolean
  defaultQuality: Resolution
  notifications: boolean
}

export interface ToastMessage {
  id: string
  title: string
  description?: string
  variant: 'default' | 'success' | 'error'
}

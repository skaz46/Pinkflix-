
import type { SourceVideo, VideoSource } from '../types'
import {
  PORNHUB_SOURCE_ID,
  browseEntries,
  embedUrl,
} from './catalogue'
import { PORNHUB_ENTRIES } from './entries'

const API_URL =
  'https://pinkflix-api.sakthispace27.workers.dev/api/search'

interface ApiVideo {
  video_id: string
  title: string
  duration?: string
  default_thumb?: string
  thumb?: string
  publish_date?: string
  tags?: { tag_name: string }[]
  categories?: { category: string }[]
}

interface ApiResponse {
  videos?: ApiVideo[]
  error?: string
}

function durationInSeconds(value?: string): number | undefined {
  if (!value) return undefined

  const parts = value.split(':').map(Number)

  if (parts.some((part) => !Number.isFinite(part) || part < 0)) {
    return undefined
  }

  return parts.reduce((total, part) => total * 60 + part, 0)
}

function mapVideo(video: ApiVideo): SourceVideo | null {
  if (!/^[A-Za-z0-9]{6,32}$/.test(video.video_id)) return null
  if (!video.title?.trim()) return null

  const tags = (video.tags ?? [])
    .map((tag) => tag.tag_name)
    .filter(Boolean)

  const categories = (video.categories ?? [])
    .map((category) => category.category)
    .filter(Boolean)

  return {
    id: video.video_id,
    sourceId: PORNHUB_SOURCE_ID,
    title: video.title,
    thumbnail: video.default_thumb || video.thumb,
    subtitle:
      [...new Set([...categories, ...tags])]
        .slice(0, 5)
        .join(' · ') || undefined,
    durationSec: durationInSeconds(video.duration),
    publishedAt: video.publish_date,
    webUrl: embedUrl(video.video_id),
  }
}

async function searchLive(
  query: string,
  signal?: AbortSignal,
): Promise<SourceVideo[]> {
  const url = new URL(API_URL)
  url.searchParams.set('q', query)
  url.searchParams.set('page', '1')
  url.searchParams.set('ordering', 'newest')
  url.searchParams.set('period', 'alltime')

  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(`Pornhub search failed (${response.status}).`)
  }

  const data = (await response.json()) as ApiResponse

  if (data.error || !Array.isArray(data.videos)) {
    throw new Error(data.error || 'Unexpected metadata response.')
  }

  return data.videos
    .map(mapVideo)
    .filter((video): video is SourceVideo => video !== null)
}

export const pornhubSource: VideoSource = {
  id: PORNHUB_SOURCE_ID,
  label: 'Pornhub',
  isAvailable: () => true,

  browse: async () => browseEntries(PORNHUB_ENTRIES),

  search: async (query, signal) => {
    const term = query.trim()

    if (!term) {
      return browseEntries(PORNHUB_ENTRIES)
    }

    return searchLive(term, signal)
  },

  getPlayback: async (video) => ({
    kind: 'embed',
    url: embedUrl(video.id),
  }),
}

import { searchYouTube } from '../services/youtube'
import type { YouTubeVideo } from '../services/youtube'
import type { SourceVideo, VideoSource } from './types'

export const YOUTUBE_SOURCE_ID = 'youtube'

export function toSourceVideo(video: YouTubeVideo): SourceVideo {
  return {
    id: video.id,
    sourceId: YOUTUBE_SOURCE_ID,
    title: video.title,
    description: video.description,
    thumbnail: video.thumbnail || undefined,
    subtitle: video.channelTitle,
    publishedAt: video.publishedAt,
    webUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`,
  }
}

/**
 * Thin adapter over the existing YouTube service. It does not replace
 * services/youtube.ts or the YouTube card/overlay, which keep working as-is.
 */
export const youtubeSource: VideoSource = {
  id: YOUTUBE_SOURCE_ID,
  label: 'YouTube',
  isAvailable: () => Boolean(import.meta.env.VITE_YOUTUBE_API_KEY),
  // searchYouTube has no abort support, so the signal is intentionally unused.
  search: async (query) => (await searchYouTube(query)).map(toSourceVideo),
  getPlayback: async (video) => ({
    kind: 'embed',
    url: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}?autoplay=1&playsinline=1&rel=0`,
  }),
}

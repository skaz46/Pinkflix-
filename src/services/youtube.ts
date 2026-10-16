
export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  channelTitle: string
  publishedAt: string
}

interface YouTubeSearchResponse {
  items?: {
    id?: {
      videoId?: string
    }
    snippet: {
      title: string
      description: string
      channelTitle: string
      publishedAt: string
      thumbnails?: {
        high?: { url: string }
        medium?: { url: string }
        default?: { url: string }
      }
    }
  }[]
  error?: {
    message?: string
  }
}

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

export async function searchYouTube(
  query: string,
): Promise<YouTubeVideo[]> {
  if (!API_KEY) {
    throw new Error(
      'YouTube API key is missing. Check your GitHub Actions secret and deployment workflow.',
    )
  }

  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    q: query,
    maxResults: '24',
    videoEmbeddable: 'true',
    safeSearch: 'moderate',
    key: API_KEY,
  })

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
  )

  const data = (await response.json()) as YouTubeSearchResponse

  if (!response.ok) {
    throw new Error(
      data.error?.message || 'Unable to search YouTube right now.',
    )
  }

  return (data.items ?? [])
    .filter((item) => item.id?.videoId)
    .map((item) => ({
      id: item.id!.videoId!,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail:
        item.snippet.thumbnails?.high?.url ??
        item.snippet.thumbnails?.medium?.url ??
        item.snippet.thumbnails?.default?.url ??
        '',
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    }))
}
